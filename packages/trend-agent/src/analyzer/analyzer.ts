import { llmJSON } from '../utils/llm.js';
import type { EnrichedData } from '../enricher/enricher.js';

interface TrendItem {
    name: string;
    type: string;            // "repo" | "package" | "topic" | "competitor"
    metric: string;          // what we measured
    current_value: number;
    direction: string;       // "rising" | "stable" | "declining"
    velocity_pct: number;    // % change
    buzz_score: number;      // composite engagement score
    relevance: number;
}

interface WhiteSpace {
    niche: string;
    description: string;
    opportunity_score: number;  // 1-10
    evidence: string;
}

interface CompetitorInsight {
    name: string;
    stars: number;
    last_activity: string;
    status: string;         // "active" | "stale" | "growing"
    threat_level: string;   // "low" | "medium" | "high"
    notes: string;
}

export interface AnalysisResult {
    trends: TrendItem[];
    white_spaces: WhiteSpace[];
    competitor_insights: CompetitorInsight[];
    ecosystem_health: {
        total_mcp_repos: number;
        avg_relevance: number;
        sentiment_breakdown: { positive: number; neutral: number; negative: number };
        buzz_index: number;
    };
    analyzed_at: string;
}

export async function analyzeData(enriched: EnrichedData, rawGitHub: any): Promise<AnalysisResult> {
    console.log('📊 Analyzing trends...');

    // 1. Calculate trend items from repos
    const repoTrends: TrendItem[] = enriched.repos
        .filter(r => r.relevance >= 6)
        .sort((a, b) => b.stars - a.stars)
        .slice(0, 20)
        .map(r => ({
            name: r.full_name,
            type: 'repo',
            metric: 'stars',
            current_value: r.stars,
            direction: r.stars > 1000 ? 'rising' : 'stable',  // Simplified — history needed for real velocity
            velocity_pct: 0,
            buzz_score: Math.round(r.stars * r.relevance / 100),
            relevance: r.relevance,
        }));

    // 2. NPM trends
    const npmTrends: TrendItem[] = enriched.npm_summary.packages.map(p => ({
        name: p.name,
        type: 'package',
        metric: 'weekly_downloads',
        current_value: p.weekly,
        direction: p.growth_pct > 5 ? 'rising' : p.growth_pct < -5 ? 'declining' : 'stable',
        velocity_pct: p.growth_pct,
        buzz_score: Math.round(p.weekly / 1000),
        relevance: 8,
    }));

    // 3. Sentiment breakdown
    const sentiments = { positive: 0, neutral: 0, negative: 0 };
    for (const s of enriched.stories) {
        if (s.sentiment in sentiments) {
            sentiments[s.sentiment as keyof typeof sentiments]++;
        }
    }

    // 4. Buzz index (composite)
    const totalEngagement = enriched.stories.reduce((sum, s) => sum + s.score + s.comments, 0);
    const buzzIndex = Math.round(totalEngagement / Math.max(enriched.stories.length, 1));

    // 5. Competitor insights
    console.log('  Analyzing competitors...');
    const competitors: CompetitorInsight[] = (rawGitHub.competitors || []).map((c: any) => {
        const daysSinceUpdate = Math.floor((Date.now() - new Date(c.last_push).getTime()) / (1000 * 60 * 60 * 24));
        const status = daysSinceUpdate < 7 ? 'active' : daysSinceUpdate < 30 ? 'growing' : 'stale';
        const threatLevel = c.stars > 5000 ? 'high' : c.stars > 500 ? 'medium' : 'low';

        return {
            name: c.name,
            stars: c.stars,
            last_activity: `${daysSinceUpdate} days ago`,
            status,
            threat_level: threatLevel,
            notes: c.description || '',
        };
    });

    // 6. White space detection (LLM)
    console.log('  Detecting white spaces...');

    const categoryCounts: Record<string, number> = {};
    for (const r of enriched.repos) {
        categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
    }

    const topTopics = enriched.stories
        .map(s => s.topic)
        .reduce((acc, topic) => {
            acc[topic] = (acc[topic] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

    const white_spaces = await llmJSON<WhiteSpace[]>(
        `Based on the AI/MCP ecosystem data below, identify 3-5 underserved niches or white spaces where there's demand but few solutions.

Existing repo categories and counts:
${JSON.stringify(categoryCounts, null, 2)}

Hot topics from Hacker News:
${JSON.stringify(topTopics, null, 2)}

NPM packages tracked (these are the established ones):
${enriched.npm_summary.packages.map(p => `${p.name}: ${p.weekly}/week`).join('\n')}

For context: Agora is building a trusted marketplace for AI agents and MCP servers.

Return JSON array: [{ niche, description, opportunity_score (1-10), evidence }]`
    );

    const trends = [...repoTrends, ...npmTrends]
        .sort((a, b) => b.buzz_score - a.buzz_score);

    console.log(`  ✅ Analysis: ${trends.length} trends, ${white_spaces.length} white spaces, ${competitors.length} competitors`);

    return {
        trends,
        white_spaces,
        competitor_insights: competitors,
        ecosystem_health: {
            total_mcp_repos: enriched.repos.filter(r => r.category === 'mcp_tool').length,
            avg_relevance: Math.round(enriched.repos.reduce((s, r) => s + r.relevance, 0) / Math.max(enriched.repos.length, 1) * 10) / 10,
            sentiment_breakdown: sentiments,
            buzz_index: buzzIndex,
        },
        analyzed_at: new Date().toISOString(),
    };
}
