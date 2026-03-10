/* ═══════════════════════════════════════════════════════════
   MarketScope — Competitive Intelligence Analyst
   REAL WORK: Calls npm Registry, HackerNews, GitHub Search APIs
   ═══════════════════════════════════════════════════════════ */

import { BaseAgent } from '../base.js';
import { fetchNpmBulk, searchHackerNews } from '../../external/npm-hn.js';
import { config } from '../../config.js';
import type { StructuredTask, NpmPackageData, HackerNewsItem } from '../../types.js';

export class MarketScopeAgent extends BaseAgent {
    constructor() {
        super('MarketScope', 'specialist', `You are MarketScope, a competitive intelligence analyst.
You analyze real market data from npm, HackerNews, and GitHub to produce competitive intelligence reports.

Given real data (npm download numbers, HN discussions, GitHub trending repos), produce:
1. Executive Summary (market landscape in 3 sentences)
2. Key Players & Market Share (ranked by npm downloads + GitHub stars)
3. Trend Analysis (what's growing, what's declining — use real numbers)
4. Community Sentiment (from HackerNews discussions)
5. White Space Opportunities (gaps in the market)
6. Competitive Threats (emerging players, recent entries)
7. Recommended Actions (3-5 specific, actionable items)

Use ONLY the real data provided. Include exact download numbers and dates.
Format as clear Markdown with tables where applicable.`);
    }

    async research(task: StructuredTask, onApiCall?: (api: string, detail: string) => void): Promise<{
        report: string;
        npmData: NpmPackageData[];
        hnData: HackerNewsItem[];
        apiCalls: number;
        latencyMs: number;
    }> {
        const start = Date.now();
        const topic = task.target || task.domain;

        // Determine relevant npm packages based on the topic
        onApiCall?.('Gemini AI', `Identifying relevant npm packages for: ${topic}`);

        const { data: packageList } = await this.callJSON<{ packages: string[] }>(
            `Given the research topic "${topic}", list 6-8 most relevant npm packages to analyze for competitive intelligence. Include both major players and emerging alternatives.
            Respond in JSON: { "packages": ["package1", "package2", ...] }`,
        );

        const packages = packageList.packages?.slice(0, 8) || [];

        // Fetch REAL npm data
        onApiCall?.('npm Registry', `Fetching download stats for ${packages.length} packages: ${packages.join(', ')}`);
        const npmData = await fetchNpmBulk(packages);

        // Fetch REAL HackerNews discussions
        onApiCall?.('HackerNews API', `Searching discussions about: ${topic}`);
        const hnData = await searchHackerNews(topic, 10);

        // Fetch GitHub trending repos
        onApiCall?.('GitHub API', `Searching top repositories for: ${topic}`);
        let githubRepos: any[] = [];
        try {
            const ghHeaders: Record<string, string> = {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Agora-Orchestrator/0.1',
            };
            if (config.githubToken) ghHeaders['Authorization'] = `Bearer ${config.githubToken}`;

            const ghRes = await fetch(
                `https://api.github.com/search/repositories?q=${encodeURIComponent(topic)}&sort=stars&per_page=10`,
                { headers: ghHeaders }
            );
            if (ghRes.ok) {
                const ghData = await ghRes.json() as any;
                githubRepos = (ghData.items || []).map((r: any) => ({
                    name: r.full_name,
                    stars: r.stargazers_count,
                    description: r.description,
                    language: r.language,
                    updatedAt: r.updated_at,
                }));
            }
        } catch { /* optional data */ }

        // Compile data for analysis
        const dataSummary = JSON.stringify({
            topic,
            npm_packages: npmData.map(p => ({
                name: p.name,
                version: p.version,
                monthlyDownloads: p.monthlyDownloads,
                dependencies: p.dependencies,
                maintainers: p.maintainers,
                lastPublish: p.lastPublished,
                license: p.license,
            })),
            hackernews_discussions: hnData.slice(0, 8).map(h => ({
                title: h.title,
                points: h.points,
                comments: h.numComments,
                date: h.createdAt,
            })),
            github_top_repos: githubRepos.slice(0, 8),
        }, null, 2);

        onApiCall?.('Gemini AI', 'Analyzing market data and generating intelligence report');

        const result = await this.call(
            `Analyze this market data and produce a competitive intelligence report:\n\n${dataSummary}`
        );

        return {
            report: result.content,
            npmData,
            hnData,
            apiCalls: 2 + packages.length + 1, // HN + npm bulk + GitHub search
            latencyMs: Date.now() - start,
        };
    }
}
