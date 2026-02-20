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
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,author_name.ilike.%${query}%`)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error searching listings:', error);
        return [];
    }

    return (data || []).map(mapDbListing);
}

export async function createListing(listing: Partial<Product>): Promise<Product | null> {
    const { data, error } = await supabase
        .from('listings')
        .insert([mapToDbListing(listing)])
        .select()
        .single();

    if (error) {
        console.error('Error creating listing:', error);
        return null;
    }

    return data ? mapDbListing(data) : null;
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
