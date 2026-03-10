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

/** 
 * Update agent trust score using EWMA with sigmoid α + Wilson cold-start.
 * 
 * V2 Architecture (validated via deep research):
 * - Cold-start (< 5 txns): Wilson Score lower bound — prevents 1/1 outranking 98/100
 * - Decay: T_old × 0.5^(days/30) — 30-day half-life for inactive agents
 * - Asymmetric: score < 0.5 → 2× penalty via deficit subtraction (not α manipulation)
 * - Dynamic α: logistic sigmoid curve α(N) = 0.12 + 0.58/(1+e^(0.08×(N-30)))
 *   Smooth transition from ~0.7 (new, responsive) → ~0.12 (veteran, stable)
 * - EWMA: T_new = α × adjustedScore + (1 - α) × decayedOldTrust
 */
export async function updateAgentMetrics(agentDid: string, trustScore: number, latencyMs: number): Promise<void> {
    const db = getDb();
    if (!db) return;

    // Get current metrics
    const { data: listing } = await db
        .from('listings')
        .select('id, total_calls, avg_latency_ms, trust_score, updated_at')
        .eq('did', agentDid)
        .single();

    if (!listing) return;

    const newTotal = (listing.total_calls || 0) + 1;
    const oldAvg = listing.avg_latency_ms || 0;
    const newAvg = Math.round(oldAvg + (latencyMs - oldAvg) / newTotal);

    // ── EWMA Trust Score Update (v2: sigmoid α + Wilson cold-start + asymmetric) ──
    const oldTrust = listing.trust_score || 0;

    // 1. Apply trust decay for inactivity (30-day half-life)
    let decayedOldTrust = oldTrust;
    if (listing.updated_at) {
        const daysSinceUpdate = (Date.now() - new Date(listing.updated_at).getTime()) / 86400000;
        if (daysSinceUpdate > 1) {
            const HALF_LIFE_DAYS = 30;
            decayedOldTrust = oldTrust * Math.pow(0.5, daysSinceUpdate / HALF_LIFE_DAYS);
        }
    }

    // 2. Cold-start: Wilson Score lower bound for < 5 transactions
    //    Prevents 1/1 (100%) from outranking 98/100 (98%)
    if (newTotal < 5) {
        const positives = trustScore * newTotal; // treat trust score as success proportion
        const z = 1.96; // 95% confidence
        const z2 = z * z;
        const p = positives / newTotal;
        const denom = 1 + z2 / newTotal;
        const center = p + z2 / (2 * newTotal);
        const spread = z * Math.sqrt((p * (1 - p)) / newTotal + z2 / (4 * newTotal * newTotal));
        const wilson = Math.max(0, (center - spread) / denom);
        const newTrust = Math.round(wilson * 1000) / 1000;

        await db.from('listings').update({
            trust_score: newTrust,
            total_calls: newTotal,
            avg_latency_ms: newAvg,
            updated_at: new Date().toISOString(),
        }).eq('id', listing.id);
        return;
    }

    // 3. Asymmetric penalty: adjust the SCORE not the α (loss aversion)
    //    Failures (score < 0.5) are penalized 2x by subtracting the deficit again
    const BASELINE_THRESHOLD = 0.5;
    let adjustedScore = trustScore;
    if (trustScore < BASELINE_THRESHOLD) {
        adjustedScore = Math.max(0, trustScore - (BASELINE_THRESHOLD - trustScore));
        // Example: score 0.3 → deficit 0.2 → adjusted = 0.3 - 0.2 = 0.1 (vs 0.3 without penalty)
    }

    // 4. Dynamic α via logistic (sigmoid) curve — smooth transition, no tier cliffs
    //    New agents (~0.7 α, responsive) → Veterans (~0.12 α, stable)
    const SLOPE = 0.08;      // transition aggressiveness
    const MIDPOINT = 30;      // N where agent is considered "established"
    const ALPHA_MIN = 0.12;
    const ALPHA_MAX = 0.70;
    const baseAlpha = ALPHA_MIN + (ALPHA_MAX - ALPHA_MIN) / (1 + Math.exp(SLOPE * (newTotal - MIDPOINT)));

    // 5. Context risk multiplier (optional: passed from manager.ts via enhanced call)
    //    Security tasks = more volatile, market research = more forgiving
    const effectiveAlpha = Math.min(baseAlpha, 1.0);

    // 6. EWMA: T_new = α × adjustedScore + (1 - α) × decayedOldTrust
    const newTrust = Math.round((effectiveAlpha * adjustedScore + (1 - effectiveAlpha) * decayedOldTrust) * 1000) / 1000;

    await db.from('listings').update({
        trust_score: newTrust,
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
