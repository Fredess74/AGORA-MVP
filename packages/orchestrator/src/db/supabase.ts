/* ═══════════════════════════════════════════════════════════
   Supabase Client — Agent persistence & transactions
   Uses service_role key to bypass RLS for orchestrator writes
   ═══════════════════════════════════════════════════════════ */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config.js';

let supabase: SupabaseClient | null = null;

/** Get Supabase client (lazy init) */
export function getDb(): SupabaseClient | null {
    if (supabase) return supabase;
    if (!config.supabaseServiceKey) {
        console.warn('  ⚠️  SUPABASE_SERVICE_KEY not set — running without persistence');
        return null;
    }
    supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);
    return supabase;
}

/** Agent definition for seeding */
const AGENT_SEEDS = [
    {
        did: 'did:agora:codeguard-security-v1',
        type: 'ai_agent',
        name: 'CodeGuard Security Auditor',
        slug: 'codeguard-security',
        description: 'Full-stack GitHub repository security auditor. Analyzes code quality, dependencies, commit patterns, and security posture using real GitHub API data.',
        author_name: 'Agora Foundation',
        pricing_model: 'per_call',
        price_per_call: 0.05,
        category: 'ai_agent',
        tags: ['security', 'code_audit', 'github', 'vulnerability_scan', 'dependency_analysis'],
        trust_score: 0.0,
        total_calls: 0,
        total_users: 0,
        avg_latency_ms: 0,
        uptime: 0.0,
        status: 'active',
    },
    {
        did: 'did:agora:marketscope-intel-v1',
        type: 'ai_agent',
        name: 'MarketScope Intelligence',
        slug: 'marketscope-intelligence',
        description: 'Competitive intelligence analyst using real npm download data, HackerNews discussions, and GitHub trending repos. Produces market reports with actual numbers.',
        author_name: 'Agora Foundation',
        pricing_model: 'per_call',
        price_per_call: 0.03,
        category: 'ai_agent',
        tags: ['market_research', 'competitive_intelligence', 'trend_analysis', 'npm', 'hackernews'],
        trust_score: 0.0,
        total_calls: 0,
        total_users: 0,
        avg_latency_ms: 0,
        uptime: 0.0,
        status: 'active',
    },
    {
        did: 'did:agora:webpulse-audit-v1',
        type: 'ai_agent',
        name: 'WebPulse Performance Auditor',
        slug: 'webpulse-performance',
        description: 'Website performance and SEO auditor using Google PageSpeed Insights API. Measures real Core Web Vitals, analyzes security headers, SSL, and produces optimization reports.',
        author_name: 'Agora Foundation',
        pricing_model: 'per_call',
        price_per_call: 0.04,
        category: 'ai_agent',
        tags: ['performance', 'seo', 'pagespeed', 'core_web_vitals', 'security_headers'],
        trust_score: 0.0,
        total_calls: 0,
        total_users: 0,
        avg_latency_ms: 0,
        uptime: 0.0,
        status: 'active',
    },
];

/** Seed agents into Supabase if listings table is empty */
export async function seedAgentsIfEmpty(): Promise<void> {
    const db = getDb();
    if (!db) return;

    try {
        const { data: existing, error: fetchErr } = await db
            .from('listings')
            .select('id')
            .eq('type', 'ai_agent')
            .limit(1);

        if (fetchErr) {
            console.error('  ❌ Supabase fetch error:', fetchErr.message);
            return;
        }

        if (existing && existing.length > 0) {
            console.log('  📦 Agents already exist in Supabase');
            return;
        }

        // Seed agents
        for (const agent of AGENT_SEEDS) {
            const { error } = await db.from('listings').insert(agent);
            if (error) {
                console.error(`  ❌ Failed to seed ${agent.name}:`, error.message);
            } else {
                console.log(`  ✅ Seeded agent: ${agent.name}`);
            }
        }
    } catch (e: any) {
        console.error('  ❌ Supabase seed error:', e.message);
    }
}

/** Get all agent listings from Supabase */
export async function getAgentListings(): Promise<any[]> {
    const db = getDb();
    if (!db) return [];

    const { data, error } = await db
        .from('listings')
        .select('*')
        .eq('type', 'ai_agent')
        .eq('status', 'active')
        .order('name');

    if (error) {
        console.error('  ❌ Supabase getListings error:', error.message);
        return [];
    }
    return data || [];
}

/** Get past transaction count for an agent */
export async function getAgentTransactionCount(agentDid: string): Promise<number> {
    const db = getDb();
    if (!db) return 0;

    // Get the listing ID for the agent
    const { data: listing } = await db
        .from('listings')
        .select('id')
        .eq('did', agentDid)
        .single();

    if (!listing) return 0;

    const { count } = await db
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('listing_id', listing.id)
        .eq('status', 'completed');

    return count || 0;
}

/** Record a completed transaction */
export async function recordTransaction(agentDid: string, amount: number, commission: number, metadata: Record<string, unknown> = {}): Promise<void> {
    const db = getDb();
    if (!db) return;

    const { data: listing } = await db
        .from('listings')
        .select('id')
        .eq('did', agentDid)
        .single();

    if (!listing) return;

    await db.from('transactions').insert({
        listing_id: listing.id,
        type: 'purchase',
        amount_usd: amount,
        commission_usd: commission,
        status: 'completed',
        metadata,
    });
}

/** Update agent trust score and metrics in Supabase */
export async function updateAgentMetrics(agentDid: string, trustScore: number, latencyMs: number): Promise<void> {
    const db = getDb();
    if (!db) return;

    // Get current metrics
    const { data: listing } = await db
        .from('listings')
        .select('id, total_calls, avg_latency_ms')
        .eq('did', agentDid)
        .single();

    if (!listing) return;

    const newTotal = (listing.total_calls || 0) + 1;
    const oldAvg = listing.avg_latency_ms || 0;
    // Running average of latency
    const newAvg = Math.round(oldAvg + (latencyMs - oldAvg) / newTotal);

    await db.from('listings').update({
        trust_score: trustScore,
        total_calls: newTotal,
        avg_latency_ms: newAvg,
        updated_at: new Date().toISOString(),
    }).eq('id', listing.id);
}

/** Log a usage event */
export async function logUsage(agentDid: string, action: string, latencyMs: number, metadata: Record<string, unknown> = {}): Promise<void> {
    const db = getDb();
    if (!db) return;

    const { data: listing } = await db
        .from('listings')
        .select('id')
        .eq('did', agentDid)
        .single();

    if (!listing) return;

    await db.from('usage_logs').insert({
        listing_id: listing.id,
        action,
        latency_ms: latencyMs,
        status_code: 200,
        metadata,
    });
}
