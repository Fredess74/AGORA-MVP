/* ═══════════════════════════════════════════════════════════
   Supabase Client for MCP Server
   Reads agents from the real database, not hardcoded arrays.
   
   DEC-008: Agora MCP Server uses the same Supabase instance
   as the marketplace web app. Uses anon key for reads,
   service key (if available) for writes.
   ═══════════════════════════════════════════════════════════ */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase config — same instance as marketplace
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://fnwrqgmaqempmcvcozqa.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_BtBZ62BMM3i2QP1rVj_H7w_5fRZKDSC';

let db: SupabaseClient | null = null;

export function getDb(): SupabaseClient {
    if (!db) {
        db = createClient(SUPABASE_URL, SUPABASE_KEY);
    }
    return db;
}

// ── Agent Types ─────────────────────────────────────────

export interface AgentListing {
    id: string;
    did: string;
    type: string;
    name: string;
    slug: string;
    description: string;
    author_name: string;
    pricing_model: string;
    price_per_call: number;
    subscription_price?: number;
    freetier_calls?: number;
    trust_score: number;
    total_calls: number;
    total_users: number;
    avg_latency_ms: number;
    uptime: number;
    category: string;
    tags: string[];
    rating?: number;
    review_count?: number;
    status: string;
    github_repo?: string;
    endpoint_url?: string;
    created_at: string;
}

// ── Queries ─────────────────────────────────────────────

/** Search agents from Supabase with optional filters */
export async function searchAgents(opts: {
    query?: string;
    category?: string;
    minTrust?: number;
    limit?: number;
}): Promise<AgentListing[]> {
    const { query, category, minTrust, limit = 20 } = opts;
    
    let q = getDb()
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .order('trust_score', { ascending: false })
        .limit(limit);

    if (category) {
        q = q.eq('category', category);
    }
    if (minTrust !== undefined && minTrust > 0) {
        q = q.gte('trust_score', minTrust);
    }
    if (query) {
        // Use Postgres ilike for simple text search (sufficient for <200 agents)
        q = q.or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`);
    }

    const { data, error } = await q;
    if (error) {
        console.error('Supabase search error:', error.message);
        return [];
    }
    return (data || []) as AgentListing[];
}

/** Get a single agent by ID or DID */
export async function getAgent(idOrDid: string): Promise<AgentListing | null> {
    const db = getDb();
    
    // Try by ID first
    let { data, error } = await db
        .from('listings')
        .select('*')
        .eq('id', idOrDid)
        .single();
    
    if (!data && !error) {
        // Try by DID
        ({ data, error } = await db
            .from('listings')
            .select('*')
            .eq('did', idOrDid)
            .single());
    }
    
    if (!data) {
        // Try by slug
        ({ data, error } = await db
            .from('listings')
            .select('*')
            .eq('slug', idOrDid)
            .single());
    }

    if (error && error.code !== 'PGRST116') {
        console.error('Supabase get error:', error.message);
    }
    return data as AgentListing | null;
}

/** Get all agents (for listing/counting) */
export async function getAllAgents(): Promise<AgentListing[]> {
    const { data, error } = await getDb()
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .order('trust_score', { ascending: false });

    if (error) {
        console.error('Supabase list error:', error.message);
        return [];
    }
    return (data || []) as AgentListing[];
}

/** Get category statistics */
export async function getCategoryStats(): Promise<{ category: string; count: number; avgTrust: number }[]> {
    const agents = await getAllAgents();
    const catMap = new Map<string, { count: number; trustSum: number }>();
    
    for (const a of agents) {
        const cat = a.category || 'uncategorized';
        const existing = catMap.get(cat) || { count: 0, trustSum: 0 };
        existing.count++;
        existing.trustSum += a.trust_score || 0;
        catMap.set(cat, existing);
    }
    
    return Array.from(catMap.entries())
        .map(([category, { count, trustSum }]) => ({
            category,
            count,
            avgTrust: count > 0 ? trustSum / count : 0,
        }))
        .sort((a, b) => b.count - a.count);
}

/** Submit a new agent listing */
export async function submitAgent(agent: {
    name: string;
    description: string;
    type?: string;
    category?: string;
    endpoint_url?: string;
    github_repo?: string;
    pricing_model?: string;
    price_per_call?: number;
    tags?: string[];
}): Promise<{ id: string; did: string } | null> {
    const slug = agent.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const did = `did:agora:${slug}-v1`;
    
    // Cold-start trust: based on metadata completeness
    let coldStart = 0.0;
    if (agent.github_repo) coldStart += 0.25;
    if (agent.description && agent.description.length > 50) coldStart += 0.15;
    if (agent.endpoint_url) coldStart += 0.30;
    if (agent.tags && agent.tags.length > 0) coldStart += 0.10;
    
    const record = {
        did,
        slug,
        name: agent.name,
        description: agent.description,
        type: agent.type || 'mcp_server',
        category: agent.category || 'general',
        author_name: 'Community',
        pricing_model: agent.pricing_model || 'free',
        price_per_call: agent.price_per_call || 0,
        trust_score: Math.min(coldStart, 0.80),
        total_calls: 0,
        total_users: 0,
        avg_latency_ms: 0,
        uptime: 0,
        tags: agent.tags || [],
        status: 'active',
        endpoint_url: agent.endpoint_url || null,
        github_repo: agent.github_repo || null,
    };

    const { data, error } = await getDb()
        .from('listings')
        .insert(record)
        .select('id, did')
        .single();
    
    if (error) {
        console.error('Supabase insert error:', error.message);
        return null;
    }
    return data as { id: string; did: string };
}

/** Log trust history events & update agent stats */
export async function logTrustHistory(agentIdOrSlug: string, event: string, metadata: any = {}): Promise<void> {
    const agent = await getAgent(agentIdOrSlug);
    if (!agent) return;

    // 1. Log event
    const { error: logErr } = await getDb()
        .from('trust_history')
        .insert({
            agent_id: agent.id,
            event_type: event,
            metadata,
        });

    if (logErr && logErr.code !== '42P01') { // Ignore missing table error
        console.error('Trust history log error:', logErr.message);
    }

    // 2. Update execution stats
    if (event === 'execution_success') {
        const latency = metadata.latency_ms || 1500;
        const oldCalls = agent.total_calls || 0;
        const newCalls = oldCalls + 1;
        const oldLatency = agent.avg_latency_ms || 0;
        const newLatency = Math.round(((oldLatency * oldCalls) + latency) / newCalls);

        await getDb()
            .from('listings')
            .update({
                total_calls: newCalls,
                avg_latency_ms: newLatency
            })
            .eq('id', agent.id);
    }
}
