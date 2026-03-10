/* ═══════════════════════════════════════════════════════════
   MCP Server Tools — Agent Discovery & Trust Queries
   Now loads from Supabase instead of hardcoded registry
   ═══════════════════════════════════════════════════════════ */

import type { AgentListing } from '../types.js';
import { getAgentListings } from '../db/supabase.js';
import { getTrustLevel } from '../trust/calculator.js';

/** In-memory fallback registry (used only if Supabase unavailable) */
const FALLBACK_AGENTS: AgentListing[] = [
    {
        id: 'codeguard-001',
        did: 'did:agora:codeguard-security-v1',
        name: 'CodeGuard Security Auditor',
        slug: 'codeguard-security',
        description: 'Full-stack GitHub repository security auditor. Analyzes code quality, dependencies, commit patterns, and security posture using real GitHub API data.',
        type: 'ai_agent',
        capabilities: ['code_security_audit', 'dependency_analysis', 'code_quality', 'vulnerability_scan', 'github_audit'],
        category: 'security',
        trustScore: 0,
        trustLevel: 'unrated',
        pricingModel: 'per_call',
        pricePerCall: 0.05,
        totalCalls: 0,
        avgLatencyMs: 0,
        uptime: 0,
    },
    {
        id: 'marketscope-001',
        did: 'did:agora:marketscope-intel-v1',
        name: 'MarketScope Intelligence',
        slug: 'marketscope-intelligence',
        description: 'Competitive intelligence analyst using real npm download data, HackerNews discussions, and GitHub trending repos.',
        type: 'ai_agent',
        capabilities: ['competitive_intelligence', 'market_research', 'trend_analysis', 'competitor_tracking', 'ecosystem_analysis'],
        category: 'analytics',
        trustScore: 0,
        trustLevel: 'unrated',
        pricingModel: 'per_call',
        pricePerCall: 0.03,
        totalCalls: 0,
        avgLatencyMs: 0,
        uptime: 0,
    },
    {
        id: 'webpulse-001',
        did: 'did:agora:webpulse-audit-v1',
        name: 'WebPulse Performance Auditor',
        slug: 'webpulse-performance',
        description: 'Website performance and SEO auditor using Google PageSpeed Insights API. Measures real Core Web Vitals.',
        type: 'ai_agent',
        capabilities: ['website_performance_audit', 'seo_audit', 'core_web_vitals', 'security_headers', 'performance_optimization'],
        category: 'performance',
        trustScore: 0,
        trustLevel: 'unrated',
        pricingModel: 'per_call',
        pricePerCall: 0.04,
        totalCalls: 0,
        avgLatencyMs: 0,
        uptime: 0,
    },
];

/** Convert Supabase row to AgentListing */
function rowToAgent(row: any): AgentListing {
    return {
        id: row.id,
        did: row.did || '',
        name: row.name,
        slug: row.slug,
        description: row.description || '',
        type: row.type,
        capabilities: row.tags || [],
        category: row.category || 'ai_agent',
        trustScore: parseFloat(row.trust_score) || 0,
        trustLevel: getTrustLevel(parseFloat(row.trust_score) || 0),
        pricingModel: row.pricing_model || 'per_call',
        pricePerCall: parseFloat(row.price_per_call) || 0,
        totalCalls: row.total_calls || 0,
        avgLatencyMs: row.avg_latency_ms || 0,
        uptime: parseFloat(row.uptime) || 0,
    };
}

/** MCP Tool: search_agents — loads from Supabase first, falls back to in-memory */
export async function searchAgents(params: {
    capability?: string;
    category?: string;
    query?: string;
}): Promise<AgentListing[]> {
    // Try Supabase first
    const dbRows = await getAgentListings();
    let results: AgentListing[] = dbRows.length > 0
        ? dbRows.map(rowToAgent)
        : [...FALLBACK_AGENTS];

    // Filter by capability
    if (params.capability) {
        const cap = params.capability.toLowerCase().replace(/_/g, ' ');
        const capWords = cap.split(/\s+/).filter(w => w.length >= 3);

        results = results.filter(a =>
            a.capabilities.some(c => {
                const cWords = c.replace(/_/g, ' ').toLowerCase();
                return capWords.some(w => cWords.includes(w));
            }) ||
            a.description.toLowerCase().includes(cap) ||
            capWords.some(w => a.description.toLowerCase().includes(w))
        );
    }

    // Filter by category
    if (params.category) {
        results = results.filter(a => a.category === params.category);
    }

    // Filter by query
    if (params.query) {
        const q = params.query.toLowerCase();
        const qWords = q.split(/\s+/).filter(w => w.length >= 3);
        results = results.filter(a =>
            a.name.toLowerCase().includes(q) ||
            a.description.toLowerCase().includes(q) ||
            qWords.some(w => a.capabilities.some(c => c.includes(w))) ||
            qWords.some(w => a.description.toLowerCase().includes(w))
        );
    }

    // Sort by trust score (highest first)
    results.sort((a, b) => b.trustScore - a.trustScore);

    return results;
}

/** Get all agents (for broadened search) */
export async function getAllAgents(): Promise<AgentListing[]> {
    const dbRows = await getAgentListings();
    return dbRows.length > 0 ? dbRows.map(rowToAgent) : [...FALLBACK_AGENTS];
}
