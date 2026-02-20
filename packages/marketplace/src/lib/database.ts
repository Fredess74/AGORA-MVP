/* ═══════════════════════════════════════════════════════════
   Supabase Database Service — CRUD for all tables
   ═══════════════════════════════════════════════════════════ */

import { supabase } from './supabase';
import { Product, User } from '../types';

// ── Products / Listings ──────────────────────────────────

export async function fetchProducts(): Promise<Product[]> {
    const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching listings:', error);
        return [];
    }

    return (data || []).map(mapDbListing);
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error fetching listing:', error);
        return null;
    }

    return data ? mapDbListing(data) : null;
}

export async function fetchProductsByCategory(category: string): Promise<Product[]> {
    const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('type', category)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching listings by category:', error);
        return [];
    }

    return (data || []).map(mapDbListing);
}

export async function searchProducts(query: string): Promise<Product[]> {
    const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,author_name.ilike.%${query}%`)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error searching listings:', error);
        return [];
    }

    return (data || []).map(mapDbListing);
}

export async function createListing(listing: Partial<Product> & { creatorId: string; status?: string }): Promise<Product | null> {
    const dbRow = {
        ...mapToDbListing(listing),
        creator_id: listing.creatorId,
        status: listing.status || 'draft',
    };

    const { data, error } = await supabase
        .from('listings')
        .insert([dbRow])
        .select()
        .single();

    if (error) {
        console.error('Error creating listing:', error);
        return null;
    }

    return data ? mapDbListing(data) : null;
}

// ── Creator's Own Listings ────────────────────────────────

export async function fetchMyListings(userId: string): Promise<Product[]> {
    const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('creator_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching my listings:', error);
        return [];
    }

    return (data || []).map(mapDbListing);
}

export async function updateListing(id: string, updates: Partial<Product> & { status?: string }): Promise<Product | null> {
    const dbUpdates: Record<string, unknown> = {};

    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.type !== undefined) dbUpdates.type = updates.type;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
    if (updates.githubRepo !== undefined) dbUpdates.github_repo = updates.githubRepo;
    if (updates.pricingModel !== undefined) dbUpdates.pricing_model = updates.pricingModel;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    dbUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
        .from('listings')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating listing:', error);
        return null;
    }

    return data ? mapDbListing(data) : null;
}

export async function deleteListing(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting listing:', error);
        return false;
    }

    return true;
}

export async function publishListing(id: string): Promise<Product | null> {
    return updateListing(id, { status: 'active' });
}

export async function unpublishListing(id: string): Promise<Product | null> {
    return updateListing(id, { status: 'draft' });
}

// ── Auth ──────────────────────────────────────────────────

export async function signInWithGitHub() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
        },
    });

    if (error) {
        console.error('GitHub auth error:', error);
    }

    return { data, error };
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Sign out error:', error);
}

export async function getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Also fetch from our profiles table
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return {
        id: user.id,
        githubId: user.user_metadata?.provider_id || 0,
        username: profile?.username || user.user_metadata?.user_name || 'user',
        email: user.email,
        avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url,
        role: profile?.role || 'buyer',
        stripeAccountId: profile?.stripe_account_id,
    };
}

// ── Reviews ───────────────────────────────────────────────

export async function fetchReviews(listingId: string) {
    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('listing_id', listingId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }

    return data || [];
}

export async function createReview(review: {
    listing_id: string;
    rating: number;
    comment: string;
}) {
    const { data, error } = await supabase
        .from('reviews')
        .insert([review])
        .select()
        .single();

    if (error) {
        console.error('Error creating review:', error);
        return null;
    }

    return data;
}

// ── Categories ────────────────────────────────────────────

export async function fetchCategories() {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }

    return data || [];
}

// ── API Keys ──────────────────────────────────────────────

export interface ApiKey {
    id: string;
    name: string;
    keyPrefix: string;
    scopes: string[];
    lastUsedAt: string | null;
    expiresAt: string | null;
    createdAt: string;
}

function generateKeyString(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'agora_';
    for (let i = 0; i < 40; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

async function hashKey(key: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function createApiKey(name: string = 'Default Key', scopes: string[] = ['read', 'write']): Promise<{ apiKey: ApiKey; fullKey: string } | null> {
    const fullKey = generateKeyString();
    const keyHash = await hashKey(fullKey);
    const keyPrefix = fullKey.substring(0, 14);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from('api_keys')
        .insert([{
            user_id: user.id,
            name,
            key_hash: keyHash,
            key_prefix: keyPrefix,
            scopes,
        }])
        .select()
        .single();

    if (error) {
        console.error('Error creating API key:', error);
        return null;
    }

    return {
        apiKey: mapApiKey(data),
        fullKey,
    };
}

export async function fetchApiKeys(): Promise<ApiKey[]> {
    const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching API keys:', error);
        return [];
    }

    return (data || []).map(mapApiKey);
}

export async function deleteApiKey(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting API key:', error);
        return false;
    }

    return true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiKey(row: any): ApiKey {
    return {
        id: row.id,
        name: row.name,
        keyPrefix: row.key_prefix,
        scopes: row.scopes || ['read'],
        lastUsedAt: row.last_used_at,
        expiresAt: row.expires_at,
        createdAt: row.created_at,
    };
}

// ── Usage Logs ────────────────────────────────────────────

export interface UsageLog {
    id: string;
    listingId: string;
    userId: string;
    action: string;
    latencyMs: number;
    statusCode: number;
    metadata: Record<string, unknown>;
    createdAt: string;
}

export async function logUsage(entry: {
    listing_id: string;
    action?: string;
    latency_ms?: number;
    status_code?: number;
    metadata?: Record<string, unknown>;
}): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
        .from('usage_logs')
        .insert([{
            ...entry,
            user_id: user?.id,
            action: entry.action || 'api_call',
            latency_ms: entry.latency_ms || 0,
            status_code: entry.status_code || 200,
        }]);

    if (error) {
        console.error('Error logging usage:', error);
        return false;
    }

    // Increment total_calls on the listing
    await supabase.rpc('increment_listing_calls', { listing_uuid: entry.listing_id }).catch(() => { });

    return true;
}

export async function fetchUsageLogs(listingId?: string, days: number = 7): Promise<UsageLog[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    let query = supabase
        .from('usage_logs')
        .select('*')
        .gte('created_at', since.toISOString())
        .order('created_at', { ascending: false });

    if (listingId) {
        query = query.eq('listing_id', listingId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching usage logs:', error);
        return [];
    }

    return (data || []).map(mapUsageLog);
}

export async function fetchUsageStats(listingId?: string, days: number = 7): Promise<{ date: string; count: number }[]> {
    const logs = await fetchUsageLogs(listingId, days);

    // Group by date
    const grouped: Record<string, number> = {};
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        grouped[key] = 0;
    }

    for (const log of logs) {
        const key = log.createdAt.split('T')[0];
        if (grouped[key] !== undefined) grouped[key]++;
    }

    return Object.entries(grouped).map(([date, count]) => ({ date, count }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapUsageLog(row: any): UsageLog {
    return {
        id: row.id,
        listingId: row.listing_id,
        userId: row.user_id,
        action: row.action,
        latencyMs: row.latency_ms,
        statusCode: row.status_code,
        metadata: row.metadata || {},
        createdAt: row.created_at,
    };
}

// ── DID Generation ────────────────────────────────────────

export function generateDID(): string {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    return `did:agora:${hex}`;
}

export function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        + '-' + Math.random().toString(36).substring(2, 6);
}

// ── Trust Score Computation ───────────────────────────────

export function computeInitialTrustScore(params: {
    hasGithubRepo: boolean;
    hasDescription: boolean;
    hasEndpoint: boolean;
    hasTags: boolean;
}): number {
    let score = 0.1; // Base score
    if (params.hasGithubRepo) score += 0.25;
    if (params.hasDescription) score += 0.15;
    if (params.hasEndpoint) score += 0.3;
    if (params.hasTags) score += 0.1;
    return Math.min(score, 1.0);
}

// ── Mappers ───────────────────────────────────────────────

// Map DB row → frontend Product type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbListing(row: any): Product {
    return {
        id: row.id,
        did: row.did || '',
        type: row.type || 'mcp_server',
        name: row.name,
        slug: row.slug,
        description: row.description || '',
        author: row.author_name || '',
        authorAvatar: row.author_avatar || '',
        githubRepo: row.github_repo || '',
        pricingModel: row.pricing_model || 'free',
        pricePerCallUsd: row.price_per_call,
        subscriptionPriceUsd: row.subscription_price,
        freetierCalls: row.freetier_calls,
        trustScore: row.trust_score || 0,
        trustLevel: row.trust_score >= 0.8 ? 'high' : row.trust_score >= 0.5 ? 'medium' : 'low',
        trustConfidence: 'medium',
        totalCalls: row.total_calls || 0,
        totalUsers: row.total_users || 0,
        avgLatencyMs: row.avg_latency_ms || 0,
        uptime: row.uptime || 0,
        category: row.category || '',
        tags: row.tags || [],
        rating: row.rating || 0,
        reviewCount: row.review_count || 0,
        createdAt: row.created_at,
        status: row.status || 'active',
    };
}

function mapToDbListing(p: Partial<Product>) {
    return {
        did: p.did,
        type: p.type,
        name: p.name,
        slug: p.slug,
        description: p.description,
        author_name: p.author,
        author_avatar: p.authorAvatar,
        github_repo: p.githubRepo,
        pricing_model: p.pricingModel,
        price_per_call: p.pricePerCallUsd,
        subscription_price: p.subscriptionPriceUsd,
        freetier_calls: p.freetierCalls,
        trust_score: p.trustScore,
        total_calls: p.totalCalls,
        total_users: p.totalUsers,
        avg_latency_ms: p.avgLatencyMs,
        uptime: p.uptime,
        category: p.category,
        tags: p.tags,
        rating: p.rating,
        review_count: p.reviewCount,
    };
}
