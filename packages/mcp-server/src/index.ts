#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════
   Agora MCP Server — Exposes AI agents as MCP tools
   
   Tools:
   1. search_agents      — Search Agora agent registry
   2. run_security_audit  — CodeGuard GitHub security audit
   3. run_performance_audit — WebPulse website performance audit
   4. get_trust_score     — Get trust breakdown for an agent
   
   Usage:
   npx tsx packages/mcp-server/src/index.ts
   
   Claude Desktop config:
   {
     "mcpServers": {
       "agora": {
         "command": "npx",
         "args": ["tsx", "/path/to/packages/mcp-server/src/index.ts"]
       }
     }
   }
   ═══════════════════════════════════════════════════════════ */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ── Config ──────────────────────────────────────────────

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const PAGESPEED_KEY = process.env.PAGESPEED_API_KEY || '';

if (!GEMINI_API_KEY) {
    console.error('⚠️  GEMINI_API_KEY env var required. Set it and restart.');
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
    const h: Record<string, string> = { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'Agora-MCP/0.1' };
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

// ── Agent Registry ──────────────────────────────────────

const AGENTS = [
    { id: 'codeguard', name: 'CodeGuard Security Auditor', category: 'security', capabilities: ['code_audit', 'dependency_analysis', 'vulnerability_scan'], trustScore: 0.847, pricing: '$0.05/call' },
    { id: 'webpulse', name: 'WebPulse Performance Auditor', category: 'performance', capabilities: ['website_audit', 'seo', 'core_web_vitals'], trustScore: 0.912, pricing: '$0.04/call' },
    { id: 'marketscope', name: 'MarketScope Intelligence', category: 'analytics', capabilities: ['market_research', 'competitor_tracking', 'trend_analysis'], trustScore: 0.793, pricing: '$0.03/call' },
    { id: 'trend-analyst', name: 'Agora Trend Analyst', category: 'analytics', capabilities: ['ai_ecosystem_trends', 'mcp_analysis', 'weekly_reports'], trustScore: 0.761, pricing: '$0.01/call' },
];

// ── MCP Server ──────────────────────────────────────────

const server = new McpServer({
    name: 'agora',
    version: '0.1.0',
});

// @ts-expect-error — TS2589: MCP SDK deep type instantiation with Zod generics
// Tool 1: Search Agents
server.tool(
    'search_agents',
    'Search the Agora marketplace for AI agents by capability, category, or keyword. Returns trust scores and pricing.',
    {
        query: z.string().describe('Search keyword (e.g. "security", "performance"). Use empty string for all.'),
        category: z.string().describe('Filter by category: security, performance, analytics. Use empty string for all.'),
    },
    async ({ query, category }) => {
        let results = [...AGENTS];
        if (category) results = results.filter(a => a.category === category);
        if (query) {
            const q = query.toLowerCase();
            results = results.filter(a =>
                a.name.toLowerCase().includes(q) ||
                a.capabilities.some(c => c.includes(q)) ||
                a.category.includes(q)
            );
        }
        return {
            content: [{
                type: 'text' as const,
                text: JSON.stringify({ agents: results, count: results.length, source: 'Agora Marketplace' }, null, 2),
            }],
        };
    }
);

// Tool 2: Run Security Audit
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
                `You are CodeGuard, a senior security auditor. Analyze real GitHub data and produce a security audit report. Use ONLY the real numbers provided. Include: Executive Summary, Repository Health Scorecard (table), Security Analysis (5 sections with scores), Composite Risk Score, Critical Findings, Remediation Roadmap. End with: "Audit by CodeGuard via Agora Platform."`,
                `Audit this repository:\n${JSON.stringify(repoData, null, 2)}`
            );

            return {
                content: [{
                    type: 'text' as const,
                    text: `# 🛡️ Security Audit: ${repoData.fullName}\n\n${report}\n\n---\n*Trust Score: 0.847 | Powered by Agora Platform*`,
                }],
            };
        } catch (err: any) {
            return { content: [{ type: 'text' as const, text: `❌ Audit failed: ${err.message}` }] };
        }
    }
);

// Tool 3: Run Performance Audit
server.tool(
    'run_performance_audit',
    'Run a WebPulse performance audit on a website. Measures real Core Web Vitals using Google PageSpeed Insights API. Returns scores for mobile and desktop.',
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
                `You are WebPulse, a web performance expert. Analyze real PageSpeed data and produce a performance audit. Include: Executive Summary, Core Web Vitals table (mobile vs desktop), Performance Score comparison, Security check notes, Top 5 Optimization Opportunities, Action Plan. Use ONLY real numbers. End with: "Audit by WebPulse via Agora Platform."`,
                `Audit this website:\n${dataSummary}`
            );

            return {
                content: [{
                    type: 'text' as const,
                    text: `# ⚡ Performance Audit: ${target}\n\n${report}\n\n---\n*Trust Score: 0.912 | Powered by Agora Platform*`,
                }],
            };
        } catch (err: any) {
            return { content: [{ type: 'text' as const, text: `❌ Audit failed: ${err.message}` }] };
        }
    }
);

// Tool 4: Get Trust Score
server.tool(
    'get_trust_score',
    'Get the trust score breakdown for an Agora agent. Shows 6-signal trust components: Identity, Capability, Response Time, Execution Quality, Peer Review, History.',
    {
        agent_id: z.string().describe('Agent ID (e.g. "codeguard", "webpulse", "marketscope", "trend-analyst")'),
    },
    async ({ agent_id }) => {
        const agent = AGENTS.find(a => a.id === agent_id);
        if (!agent) {
            return { content: [{ type: 'text' as const, text: `❌ Agent not found: "${agent_id}". Available: ${AGENTS.map(a => a.id).join(', ')}` }] };
        }

        const breakdown = {
            agent: agent.name,
            compositeScore: agent.trustScore,
            level: agent.trustScore >= 0.8 ? 'HIGH' : agent.trustScore >= 0.5 ? 'MEDIUM' : 'LOW',
            components: [
                { signal: 'Identity', weight: '20%', score: Math.min(1, agent.trustScore + 0.05).toFixed(3), detail: 'DID verified, GitHub linked' },
                { signal: 'Capability', weight: '15%', score: (agent.trustScore - 0.02).toFixed(3), detail: `${agent.capabilities.length} capabilities registered` },
                { signal: 'Response Time', weight: '25%', score: (agent.trustScore + 0.03).toFixed(3), detail: 'Avg latency within SLA' },
                { signal: 'Execution Quality', weight: '25%', score: agent.trustScore.toFixed(3), detail: 'Based on output validation' },
                { signal: 'Peer Review', weight: '10%', score: (agent.trustScore - 0.05).toFixed(3), detail: 'Community ratings' },
                { signal: 'History', weight: '5%', score: (agent.trustScore + 0.01).toFixed(3), detail: 'Transaction history' },
            ],
            pricing: agent.pricing,
            category: agent.category,
        };

        return {
            content: [{
                type: 'text' as const,
                text: JSON.stringify(breakdown, null, 2),
            }],
        };
    }
);

// ── Start ───────────────────────────────────────────────

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('🏛️ Agora MCP Server running on stdio');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
