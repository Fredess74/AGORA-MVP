/* ═══════════════════════════════════════════════════════════
   MCP Server Tools — Agent Discovery & Trust Queries
   ═══════════════════════════════════════════════════════════ */

import type { AgentListing } from '../types.js';
import { getTrustBreakdown, calculateCompositeScore, getTrustLevel, SEED_TRUST } from '../trust/calculator.js';

/** Seed agent listings (3 real agents) */
export const AGENT_REGISTRY: AgentListing[] = [
    {
        id: 'codeguard-001',
        did: 'did:agora:codeguard-security-v1',
        name: 'CodeGuard Security Auditor',
        slug: 'codeguard-security',
        description: 'Full-stack GitHub repository security auditor. Analyzes code quality, dependencies, commit patterns, and security posture using real GitHub API data. Produces executive security reports with actionable recommendations.',
        type: 'ai_agent',
        capabilities: ['code_security_audit', 'dependency_analysis', 'code_quality', 'vulnerability_scan', 'github_audit'],
        category: 'security',
        trustScore: calculateCompositeScore(SEED_TRUST['codeguard-001']),
        trustLevel: getTrustLevel(calculateCompositeScore(SEED_TRUST['codeguard-001'])),
        pricingModel: 'per_call',
        pricePerCall: 0.05,
        totalCalls: 312,
        avgLatencyMs: 8500,
        uptime: 99.2,
    },
    {
        id: 'marketscope-001',
        did: 'did:agora:marketscope-intel-v1',
        name: 'MarketScope Intelligence',
        slug: 'marketscope-intelligence',
        description: 'Competitive intelligence analyst using real npm download data, HackerNews discussions, and GitHub trending repos. Produces market reports with actual numbers, trend analysis, and white-space opportunities.',
        type: 'ai_agent',
        capabilities: ['competitive_intelligence', 'market_research', 'trend_analysis', 'competitor_tracking', 'ecosystem_analysis'],
        category: 'analytics',
        trustScore: calculateCompositeScore(SEED_TRUST['marketscope-001']),
        trustLevel: getTrustLevel(calculateCompositeScore(SEED_TRUST['marketscope-001'])),
        pricingModel: 'per_call',
        pricePerCall: 0.03,
        totalCalls: 547,
        avgLatencyMs: 12000,
        uptime: 98.5,
    },
    {
        id: 'webpulse-001',
        did: 'did:agora:webpulse-audit-v1',
        name: 'WebPulse Performance Auditor',
        slug: 'webpulse-performance',
        description: 'Website performance and SEO auditor using Google PageSpeed Insights API. Measures real Core Web Vitals (LCP, FID, CLS), analyzes security headers, SSL, and produces optimization reports with specific recommendations.',
        type: 'ai_agent',
        capabilities: ['website_performance_audit', 'seo_audit', 'core_web_vitals', 'security_headers', 'performance_optimization'],
        category: 'performance',
        trustScore: calculateCompositeScore(SEED_TRUST['webpulse-001']),
        trustLevel: getTrustLevel(calculateCompositeScore(SEED_TRUST['webpulse-001'])),
        pricingModel: 'per_call',
        pricePerCall: 0.04,
        totalCalls: 428,
        avgLatencyMs: 15000,
        uptime: 98.8,
    },
];

/** MCP Tool: search_agents */
export function searchAgents(params: {
    capability?: string;
    category?: string;
    minTrust?: number;
    query?: string;
}): AgentListing[] {
    let results = [...AGENT_REGISTRY];

    // Filter by capability
    if (params.capability) {
        const cap = params.capability.toLowerCase();
        results = results.filter(a =>
            a.capabilities.some(c => c.includes(cap)) ||
            a.description.toLowerCase().includes(cap)
        );
    }

    // Filter by category
    if (params.category) {
        results = results.filter(a => a.category === params.category);
    }

    // Filter by min trust
    if (params.minTrust !== undefined) {
        results = results.filter(a => a.trustScore >= params.minTrust!);
    }

    // Filter by query
    if (params.query) {
        const q = params.query.toLowerCase();
        results = results.filter(a =>
            a.name.toLowerCase().includes(q) ||
            a.description.toLowerCase().includes(q) ||
            a.capabilities.some(c => c.includes(q))
        );
    }

    // Sort by trust score (highest first)
    results.sort((a, b) => b.trustScore - a.trustScore);

    // Refresh trust scores from live data
    return results.map(a => ({
        ...a,
        trustScore: calculateCompositeScore(SEED_TRUST[a.id] || []),
    }));
}

/** MCP Tool: get_trust_score */
export function getAgentTrust(agentId: string) {
    const agent = AGENT_REGISTRY.find(a => a.id === agentId);
    if (!agent) return null;
    return getTrustBreakdown(agentId, agent.name);
}
