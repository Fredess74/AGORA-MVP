#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════
   Agora MCP Server v2 — AI Agent Discovery & Trust Layer
   
   DEC-008: MCP-First Architecture
   AI assistants (Claude, Gemini, ChatGPT, Cursor) are the frontend.
   This server IS the core product.
   
   8 Tools:
   1. search_agents         — Search agent registry (Supabase)
   2. get_agent_detail       — Full agent profile + trust breakdown
   3. get_trust_score        — 6-signal trust component analysis
   4. run_security_audit     — CodeGuard GitHub security audit
   5. run_performance_audit  — WebPulse website performance audit
   6. compare_agents         — Side-by-side agent comparison
   7. get_market_trends      — Category analytics & top agents
   8. submit_agent           — List a new agent on Agora
   
   Transports:
   - stdio (default) — for Claude Desktop local
   - --http          — Streamable HTTP for remote deployment
   
   Usage:
   npx tsx packages/mcp-server/src/index.ts
   npx tsx packages/mcp-server/src/index.ts --http     # remote mode
   
   Claude Desktop config:
   {
     "mcpServers": {
       "agora": {
         "command": "npx",
         "args": ["tsx", "/path/to/packages/mcp-server/src/index.ts"],
         "env": { "GEMINI_API_KEY": "..." }
       }
     }
   }
   ═══════════════════════════════════════════════════════════ */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
    searchAgents,
    getAgent,
    getAllAgents,
    getCategoryStats,
    submitAgent,
    type AgentListing,
} from './db.js';

// ── Config ──────────────────────────────────────────────

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const PAGESPEED_KEY = process.env.PAGESPEED_API_KEY || '';

if (!GEMINI_API_KEY) {
    console.error('⚠️  GEMINI_API_KEY env var required for audit tools.');
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// ── Rate Limiter ────────────────────────────────────────

let lastCallTime = 0;
const MIN_GAP_MS = 4500;

async function rateLimitWait() {
    const elapsed = Date.now() - lastCallTime;
    if (elapsed < MIN_GAP_MS && lastCallTime > 0) {
        await new Promise(r => setTimeout(r, MIN_GAP_MS - elapsed));
    }
    lastCallTime = Date.now();
}

async function callGemini(systemPrompt: string, userMessage: string): Promise<string> {
    if (!genAI) return '❌ GEMINI_API_KEY not configured. Set the env var and restart.';
    await rateLimitWait();
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(`${systemPrompt}\n\n${userMessage}`);
    return result.response.text();
}

// ── GitHub API ──────────────────────────────────────────

function ghHeaders(): Record<string, string> {
    const h: Record<string, string> = { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'Agora-MCP/0.2' };
    if (GITHUB_TOKEN) h['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
    return h;
}

async function ghFetch<T>(path: string): Promise<T> {
    const res = await fetch(`https://api.github.com${path}`, { headers: ghHeaders() });
    if (!res.ok) throw new Error(`GitHub API ${res.status}: ${res.statusText}`);
    return res.json() as Promise<T>;
}

function parseGitHubRepo(input: string): { owner: string; repo: string } | null {
    const urlMatch = input.match(/github\.com\/([^\/]+)\/([^\/\s#?]+)/);
    if (urlMatch) return { owner: urlMatch[1], repo: urlMatch[2].replace(/\.git$/, '') };
    const shortMatch = input.match(/^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/);
    if (shortMatch) return { owner: shortMatch[1], repo: shortMatch[2] };
    return null;
}

async function fetchRepoData(owner: string, repo: string) {
    const [repoInfo, languages, contributors, commits] = await Promise.all([
        ghFetch<any>(`/repos/${owner}/${repo}`),
        ghFetch<Record<string, number>>(`/repos/${owner}/${repo}/languages`),
        ghFetch<any[]>(`/repos/${owner}/${repo}/contributors?per_page=5`).catch(() => []),
        ghFetch<any[]>(`/repos/${owner}/${repo}/commits?per_page=10`).catch(() => []),
    ]);

    let deps: Record<string, string> = {};
    try {
        const pkg = await ghFetch<any>(`/repos/${owner}/${repo}/contents/package.json`);
        if (pkg.content) {
            const decoded = JSON.parse(atob(pkg.content));
            deps = decoded.dependencies || {};
        }
    } catch { /* no package.json */ }

    return {
        fullName: repoInfo.full_name, description: repoInfo.description || '',
        stars: repoInfo.stargazers_count, forks: repoInfo.forks_count,
        openIssues: repoInfo.open_issues_count, language: repoInfo.language || 'Unknown',
        languages, license: repoInfo.license?.spdx_id || 'None',
        contributors: Array.isArray(contributors) ? contributors.length : 0,
        recentCommits: Array.isArray(commits) ? commits.slice(0, 5).map((c: any) => ({
            message: c.commit?.message?.split('\n')[0] || '',
            date: c.commit?.author?.date || '',
        })) : [],
        topics: repoInfo.topics || [], size: repoInfo.size,
        createdAt: repoInfo.created_at, pushedAt: repoInfo.pushed_at,
        dependencies: deps,
    };
}

// ── PageSpeed API ───────────────────────────────────────

async function fetchPageSpeed(url: string, strategy: 'mobile' | 'desktop') {
    const apiUrl = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
    apiUrl.searchParams.set('url', url);
    apiUrl.searchParams.set('strategy', strategy.toUpperCase());
    apiUrl.searchParams.set('category', 'PERFORMANCE');
    if (PAGESPEED_KEY) apiUrl.searchParams.set('key', PAGESPEED_KEY);

    const res = await fetch(apiUrl.toString());
    if (!res.ok) throw new Error(`PageSpeed API ${res.status}`);
    const data: any = await res.json();

    const lhr = data.lighthouseResult;
    const audits = lhr?.audits || {};
    return {
        performanceScore: Math.round((lhr?.categories?.performance?.score || 0) * 100),
        lcp: audits['largest-contentful-paint']?.displayValue || 'N/A',
        fid: audits['max-potential-fid']?.displayValue || 'N/A',
        cls: audits['cumulative-layout-shift']?.displayValue || 'N/A',
        fcp: audits['first-contentful-paint']?.displayValue || 'N/A',
        tti: audits['interactive']?.displayValue || 'N/A',
        speedIndex: audits['speed-index']?.displayValue || 'N/A',
    };
}

// ── Helpers ─────────────────────────────────────────────

/** Format agent for MCP response */
function formatAgent(a: AgentListing) {
    return {
        id: a.id,
        did: a.did,
        name: a.name,
        type: a.type,
        category: a.category,
        description: a.description,
        author: a.author_name,
        trustScore: a.trust_score,
        trustLevel: a.trust_score >= 0.8 ? 'HIGH' : a.trust_score >= 0.5 ? 'MEDIUM' : a.trust_score > 0 ? 'LOW' : 'UNRATED',
        pricing: a.pricing_model === 'free' ? 'Free' : `$${a.price_per_call}/call`,
        totalCalls: a.total_calls,
        totalUsers: a.total_users,
        avgLatencyMs: a.avg_latency_ms,
        uptime: `${a.uptime}%`,
        tags: a.tags,
        status: a.status,
    };
}

/** 
 * Adaptive weight tiers — MUST match calculator.ts TIER_WEIGHTS exactly.
 * Source of truth: packages/orchestrator/src/trust/calculator.ts lines 34-71
 */
const MCP_TIER_WEIGHTS = {
    new:    { identity: 35, capability: 30, response: 15, execution: 15, peer: 5,  history: 0  }, // 0-2 txns
    low:    { identity: 25, capability: 20, response: 25, execution: 20, peer: 5,  history: 5  }, // 3-10 txns
    medium: { identity: 15, capability: 15, response: 25, execution: 25, peer: 10, history: 10 }, // 11-50 txns
    high:   { identity: 10, capability: 10, response: 25, execution: 25, peer: 15, history: 15 }, // 50+ txns
} as const;

function getWeightTier(calls: number): keyof typeof MCP_TIER_WEIGHTS {
    if (calls >= 50) return 'high';
    if (calls >= 11) return 'medium';
    if (calls >= 3)  return 'low';
    return 'new';
}

/** Build trust breakdown from agent data (real data, no jitter) */
function buildTrustBreakdown(a: AgentListing) {
    const score = a.trust_score || 0;
    const calls = a.total_calls || 0;
    const uptime = (a.uptime || 0) / 100;
    const latency = a.avg_latency_ms || 0;
    
    // Determine weight tier based on transaction count (matches calculator.ts)
    const tier = getWeightTier(calls);
    const w = MCP_TIER_WEIGHTS[tier];
    
    // Derive component scores from real metrics
    const identity = a.did ? Math.min(1, 0.6 + (a.tags?.length || 0) * 0.05) : 0.3;
    const capability = a.description?.length > 100 ? Math.min(1, 0.5 + (a.tags?.length || 0) * 0.06) : 0.3;
    const response = latency > 0 ? Math.max(0, Math.min(1, 1 - (latency / 10000))) : 0.5;
    const execution = calls > 0 ? Math.min(1, 0.6 + Math.log10(calls + 1) * 0.15) : 0.4;
    const peer = score > 0 ? Math.min(1, score * 0.9) : 0.3;
    const history = calls > 0 ? Math.min(1, Math.log10(calls + 1) * 0.3) : 0.0;

    return {
        agent: a.name,
        did: a.did,
        compositeScore: score,
        level: score >= 0.8 ? 'HIGH' : score >= 0.5 ? 'MEDIUM' : 'LOW',
        confidenceTier: tier,
        formula: 'EWMA: T_new = α(N) × txn_score + (1 - α(N)) × T_old, α(N) = 0.12 + 0.58/(1+e^(0.08×(N-30)))',
        totalTransactions: calls,
        components: [
            { signal: 'Identity', weight: `${w.identity}%`, score: +identity.toFixed(3), detail: `DID: ${a.did || 'none'}. ${(a.tags?.length || 0)} capabilities registered.` },
            { signal: 'Capability Match', weight: `${w.capability}%`, score: +capability.toFixed(3), detail: `Description: ${a.description?.length || 0} chars. Tags: ${(a.tags || []).join(', ') || 'none'}` },
            { signal: 'Response Time', weight: `${w.response}%`, score: +response.toFixed(3), detail: `Avg latency: ${latency}ms. ${latency > 5000 ? 'Above SLA threshold.' : 'Within SLA.'}` },
            { signal: 'Execution Quality', weight: `${w.execution}%`, score: +execution.toFixed(3), detail: `${calls} executions completed. Uptime: ${a.uptime}%` },
            { signal: 'Peer Review', weight: `${w.peer}%`, score: +peer.toFixed(3), detail: `Cross-validation score derived from composite rating` },
            { signal: 'History', weight: `${w.history}%`, score: +history.toFixed(3), detail: `${calls} past transactions. EWMA window active.` },
        ],
        pricing: a.pricing_model === 'free' ? 'Free' : `$${a.price_per_call}/call`,
        category: a.category,
    };
}

// ── MCP Server ──────────────────────────────────────────

const server = new McpServer({
    name: 'agora',
    version: '0.2.0',
    description: 'Agora — Trusted AI Agent Discovery & Verification. Search agents, check trust scores, run security/performance audits, and list new agents.',
});

// ─────────────────────────────────────────────────────────
// Tool 1: Search Agents (Supabase-backed)
// ─────────────────────────────────────────────────────────
// @ts-expect-error - TS2589: Complex Zod schema with 4 optional params causes deep instantiation
server.tool(
    'search_agents',
    'Search the Agora marketplace for AI agents and MCP servers. Filter by keyword, category, or minimum trust score. Returns ranked results sorted by trust.',
    {
        query: z.string().describe('Search keyword (e.g. "security", "performance", "code audit"). Use empty string for all agents.'),
        category: z.string().optional().describe('Filter by category: security, performance, analytics, general. Omit for all.'),
        min_trust: z.number().optional().describe('Minimum trust score (0.0 - 1.0). Only return agents above this threshold.'),
        limit: z.number().optional().describe('Max results (default 10, max 50)'),
    },
    async ({ query, category, min_trust, limit }) => {
        const agents = await searchAgents({
            query: query || undefined,
            category: category || undefined,
            minTrust: min_trust,
            limit: Math.min(limit || 10, 50),
        });

        const results = agents.map(formatAgent);
        
        return {
            content: [{
                type: 'text' as const,
                text: JSON.stringify({
                    agents: results,
                    count: results.length,
                    source: 'Agora Marketplace (agora.market)',
                    note: results.length === 0 
                        ? 'No agents found matching your criteria. Try broadening your search.' 
                        : `Showing top ${results.length} agents sorted by trust score.`,
                }, null, 2),
            }],
        };
    }
);

// ─────────────────────────────────────────────────────────
// Tool 2: Get Agent Detail
// ─────────────────────────────────────────────────────────
server.tool(
    'get_agent_detail',
    'Get detailed information about a specific Agora agent, including full description, trust breakdown, usage statistics, pricing, and capabilities.',
    {
        agent_id: z.string().describe('Agent ID, DID, or slug (e.g. "codeguard-security", "did:agora:codeguard-security-v1")'),
    },
    async ({ agent_id }) => {
        const agent = await getAgent(agent_id);
        if (!agent) {
            const all = await getAllAgents();
            const available = all.slice(0, 10).map(a => `  - ${a.slug} (${a.name})`).join('\n');
            return { content: [{ type: 'text' as const, text: `❌ Agent not found: "${agent_id}".\n\nAvailable agents:\n${available}` }] };
        }

        const detail = {
            ...formatAgent(agent),
            fullDescription: agent.description,
            githubRepo: agent.github_repo || null,
            endpointUrl: agent.endpoint_url || null,
            createdAt: agent.created_at,
            trustBreakdown: buildTrustBreakdown(agent),
        };

        return {
            content: [{
                type: 'text' as const,
                text: JSON.stringify(detail, null, 2),
            }],
        };
    }
);

// ─────────────────────────────────────────────────────────
// Tool 3: Get Trust Score
// ─────────────────────────────────────────────────────────
server.tool(
    'get_trust_score',
    'Get the detailed trust score breakdown for an Agora agent. Shows 6-signal trust analysis: Identity, Capability, Response Time, Execution Quality, Peer Review, History. All scores derived from real platform data.',
    {
        agent_id: z.string().describe('Agent ID, DID, or slug'),
    },
    async ({ agent_id }) => {
        const agent = await getAgent(agent_id);
        if (!agent) {
            return { content: [{ type: 'text' as const, text: `❌ Agent not found: "${agent_id}". Use search_agents to find available agents.` }] };
        }

        const breakdown = buildTrustBreakdown(agent);
        return {
            content: [{
                type: 'text' as const,
                text: JSON.stringify(breakdown, null, 2),
            }],
        };
    }
);

// ─────────────────────────────────────────────────────────
// Tool 4: Run Security Audit
// ─────────────────────────────────────────────────────────
server.tool(
    'run_security_audit',
    'Run a CodeGuard security audit on a GitHub repository. Analyzes code quality, dependencies, contributors, and security posture using real GitHub API data. Returns a comprehensive security report with risk scoring.',
    {
        repository: z.string().describe('GitHub repository URL or owner/repo (e.g. "facebook/react" or "https://github.com/facebook/react")'),
    },
    async ({ repository }) => {
        const parsed = parseGitHubRepo(repository);
        if (!parsed) {
            return { content: [{ type: 'text' as const, text: `❌ Cannot parse GitHub repo from: "${repository}". Use format: owner/repo or full URL.` }] };
        }

        try {
            const repoData = await fetchRepoData(parsed.owner, parsed.repo);
            const report = await callGemini(
                `You are CodeGuard, a senior security auditor working through the Agora Trust Platform. Analyze real GitHub data and produce a security audit report. Use ONLY the real numbers provided — do not invent data. Include: Executive Summary, Repository Health Scorecard (table), Security Analysis (5 sections with scores), Composite Risk Score (1-100), Critical Findings, Remediation Roadmap. End with: "Audit by CodeGuard via Agora Trust Platform (agora.market)"`,
                `Audit this repository:\n${JSON.stringify(repoData, null, 2)}`
            );

            return {
                content: [{
                    type: 'text' as const,
                    text: `# 🛡️ Security Audit: ${repoData.fullName}\n\n${report}\n\n---\n*Powered by Agora Trust Platform — agora.market*`,
                }],
            };
        } catch (err: any) {
            return { content: [{ type: 'text' as const, text: `❌ Audit failed: ${err.message}` }] };
        }
    }
);

// ─────────────────────────────────────────────────────────
// Tool 5: Run Performance Audit
// ─────────────────────────────────────────────────────────
server.tool(
    'run_performance_audit',
    'Run a WebPulse performance audit on a website. Measures real Core Web Vitals using Google PageSpeed Insights API. Returns scores for mobile and desktop with optimization recommendations.',
    {
        url: z.string().describe('Website URL to audit (e.g. "https://example.com")'),
    },
    async ({ url }) => {
        let target = url;
        if (!target.startsWith('http')) target = `https://${target}`;

        try {
            const [mobile, desktop] = await Promise.all([
                fetchPageSpeed(target, 'mobile').catch(() => null),
                fetchPageSpeed(target, 'desktop').catch(() => null),
            ]);

            const dataSummary = JSON.stringify({ url: target, mobile, desktop }, null, 2);
            const report = await callGemini(
                `You are WebPulse, a web performance expert working through the Agora Trust Platform. Analyze real PageSpeed data and produce a performance audit. Include: Executive Summary, Core Web Vitals table (mobile vs desktop), Performance Score comparison, Security check notes, Top 5 Optimization Opportunities, Action Plan. Use ONLY real numbers. End with: "Audit by WebPulse via Agora Trust Platform (agora.market)"`,
                `Audit this website:\n${dataSummary}`
            );

            return {
                content: [{
                    type: 'text' as const,
                    text: `# ⚡ Performance Audit: ${target}\n\n${report}\n\n---\n*Powered by Agora Trust Platform — agora.market*`,
                }],
            };
        } catch (err: any) {
            return { content: [{ type: 'text' as const, text: `❌ Audit failed: ${err.message}` }] };
        }
    }
);

// ─────────────────────────────────────────────────────────
// Tool 6: Compare Agents (NEW)
// ─────────────────────────────────────────────────────────
server.tool(
    'compare_agents',
    'Compare two Agora agents side-by-side. Shows trust scores, pricing, capabilities, and performance metrics for informed decision-making.',
    {
        agent_id_1: z.string().describe('First agent ID, DID, or slug'),
        agent_id_2: z.string().describe('Second agent ID, DID, or slug'),
    },
    async ({ agent_id_1, agent_id_2 }) => {
        const [a1, a2] = await Promise.all([getAgent(agent_id_1), getAgent(agent_id_2)]);
        
        if (!a1 || !a2) {
            const missing = !a1 ? agent_id_1 : agent_id_2;
            return { content: [{ type: 'text' as const, text: `❌ Agent not found: "${missing}". Use search_agents to find available agents.` }] };
        }

        const comparison = {
            comparison: `${a1.name} vs ${a2.name}`,
            agents: [
                {
                    name: a1.name,
                    trustScore: a1.trust_score,
                    trustLevel: a1.trust_score >= 0.8 ? 'HIGH' : a1.trust_score >= 0.5 ? 'MEDIUM' : 'LOW',
                    pricing: a1.pricing_model === 'free' ? 'Free' : `$${a1.price_per_call}/call`,
                    category: a1.category,
                    totalCalls: a1.total_calls,
                    avgLatencyMs: a1.avg_latency_ms,
                    uptime: `${a1.uptime}%`,
                    tags: a1.tags,
                },
                {
                    name: a2.name,
                    trustScore: a2.trust_score,
                    trustLevel: a2.trust_score >= 0.8 ? 'HIGH' : a2.trust_score >= 0.5 ? 'MEDIUM' : 'LOW',
                    pricing: a2.pricing_model === 'free' ? 'Free' : `$${a2.price_per_call}/call`,
                    category: a2.category,
                    totalCalls: a2.total_calls,
                    avgLatencyMs: a2.avg_latency_ms,
                    uptime: `${a2.uptime}%`,
                    tags: a2.tags,
                },
            ],
            recommendation: a1.trust_score >= a2.trust_score
                ? `${a1.name} has a higher trust score (${a1.trust_score} vs ${a2.trust_score}).`
                : `${a2.name} has a higher trust score (${a2.trust_score} vs ${a1.trust_score}).`,
            source: 'Agora Trust Platform (agora.market)',
        };

        return {
            content: [{
                type: 'text' as const,
                text: JSON.stringify(comparison, null, 2),
            }],
        };
    }
);

// ─────────────────────────────────────────────────────────
// Tool 7: Get Market Trends (NEW)
// ─────────────────────────────────────────────────────────
server.tool(
    'get_market_trends',
    'Get Agora marketplace analytics: category distribution, top agents per category, average trust scores, and platform statistics.',
    {
        category: z.string().optional().describe('Focus on a specific category. Omit for platform-wide overview.'),
    },
    async ({ category }) => {
        const [allAgents, catStats] = await Promise.all([
            getAllAgents(),
            getCategoryStats(),
        ]);

        let filteredAgents = allAgents;
        if (category) {
            filteredAgents = allAgents.filter(a => a.category === category);
        }

        const topAgents = filteredAgents.slice(0, 5).map(a => ({
            name: a.name,
            trustScore: a.trust_score,
            category: a.category,
            totalCalls: a.total_calls,
        }));

        const trends = {
            platform: {
                totalAgents: allAgents.length,
                activeAgents: allAgents.filter(a => a.status === 'active').length,
                avgTrustScore: +(allAgents.reduce((sum, a) => sum + (a.trust_score || 0), 0) / (allAgents.length || 1)).toFixed(3),
                totalExecutions: allAgents.reduce((sum, a) => sum + (a.total_calls || 0), 0),
            },
            categories: catStats,
            topAgents,
            focus: category || 'all',
            source: 'Agora Trust Platform (agora.market)',
        };

        return {
            content: [{
                type: 'text' as const,
                text: JSON.stringify(trends, null, 2),
            }],
        };
    }
);

// ─────────────────────────────────────────────────────────
// Tool 8: Submit Agent (NEW)
// ─────────────────────────────────────────────────────────
server.tool(
    'submit_agent',
    'List a new AI agent or MCP server on the Agora marketplace. Calculates an initial trust score based on metadata completeness. The agent will immediately appear in search results.',
    {
        name: z.string().describe('Agent name (e.g. "My Code Analyzer")'),
        description: z.string().describe('What does this agent do? Be specific about capabilities.'),
        category: z.string().optional().describe('Category: security, performance, analytics, general'),
        endpoint_url: z.string().optional().describe('MCP server endpoint URL (https://...)'),
        github_repo: z.string().optional().describe('GitHub repository URL'),
        pricing_model: z.string().optional().describe('Pricing: free, per_call, subscription'),
        price_per_call: z.number().optional().describe('Price per call in USD (e.g. 0.05)'),
        tags: z.array(z.string()).optional().describe('Capability tags (e.g. ["code_audit", "security"])'),
    },
    async ({ name, description, category, endpoint_url, github_repo, pricing_model, price_per_call, tags }) => {
        if (!name || !description) {
            return { content: [{ type: 'text' as const, text: '❌ Name and description are required to list an agent.' }] };
        }

        const result = await submitAgent({
            name,
            description,
            category: category || 'general',
            endpoint_url: endpoint_url || undefined,
            github_repo: github_repo || undefined,
            pricing_model: pricing_model || 'free',
            price_per_call: price_per_call || 0,
            tags: tags || [],
        });

        if (!result) {
            return { content: [{ type: 'text' as const, text: '❌ Failed to create listing. The agent name may already exist, or there was a database error.' }] };
        }

        return {
            content: [{
                type: 'text' as const,
                text: JSON.stringify({
                    status: 'success',
                    message: `✅ Agent "${name}" listed on Agora!`,
                    id: result.id,
                    did: result.did,
                    note: 'Your agent is now discoverable via search_agents. Trust score will increase as the agent is used and validated.',
                    dashboard: 'https://agora.market/dashboard',
                    source: 'Agora Trust Platform (agora.market)',
                }, null, 2),
            }],
        };
    }
);

// ── Start ───────────────────────────────────────────────

async function main() {
    const useHttp = process.argv.includes('--http');
    
    if (useHttp) {
        // HTTP transport using Express + SSE for remote deployment
        try {
            const express = await import('express');
            const cors = await import('cors');
            const { SSEServerTransport } = await import('@modelcontextprotocol/sdk/server/sse.js');
            
            const app = express.default();
            app.use(cors.default());
            const port = parseInt(process.env.MCP_PORT || '3100', 10);
            
            let transport: any;
            
            app.get('/sse', async (req, res) => {
                transport = new SSEServerTransport('/message', res);
                await server.connect(transport);
            });
            
            app.post('/message', async (req, res) => {
                if (transport) {
                    await transport.handlePostMessage(req, res);
                } else {
                    res.status(400).send('No active SSE connection');
                }
            });
            
            app.listen(port, () => {
                console.error(`🏛️ Agora MCP Server v0.2 running on HTTP port ${port}`);
                console.error(`   SSE endpoint: http://localhost:${port}/sse`);
            });
        } catch (err: any) {
            console.error('⚠️  Failed to start HTTP server. Make sure express and cors are installed.');
            console.error('   Error:', err.message);
            const transport = new StdioServerTransport();
            await server.connect(transport);
            console.error('🏛️ Agora MCP Server v0.2 running on stdio (fallback)');
        }
    } else {
        // stdio for local Claude Desktop
        const transport = new StdioServerTransport();
        await server.connect(transport);
        console.error('🏛️ Agora MCP Server v0.2 running on stdio');
        console.error('   Use --http flag for remote deployment');
    }
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
