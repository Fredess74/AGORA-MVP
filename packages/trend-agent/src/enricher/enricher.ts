import { llmJSON } from '../utils/llm.js';

interface EnrichedRepo {
    full_name: string;
    stars: number;
    description: string | null;
    category: string;       // "mcp_tool" | "ai_agent" | "framework" | "integration" | "other"
    relevance: number;      // 1-10 how relevant to Agora ecosystem
    tags: string[];
}

interface EnrichedStory {
    id: number;
    title: string;
    score: number;
    comments: number;
    sentiment: string;      // "positive" | "neutral" | "negative"
    topic: string;           // primary topic
    relevance: number;       // 1-10
    entities: string[];      // companies/products mentioned
}

export interface EnrichedData {
    repos: EnrichedRepo[];
    stories: EnrichedStory[];
    npm_summary: {
        total_weekly_downloads: number;
        fastest_growing: string;
        packages: Array<{ name: string; weekly: number; monthly: number; growth_pct: number }>;
    };
    collected_at: string;
}

export async function enrichData(rawGitHub: any, rawHN: any, rawNpm: any): Promise<EnrichedData> {
    console.log('🧠 Enriching data with LLM...');

    // Deduplicate repos across all search results
    const allRepos = new Map<string, any>();
    for (const sr of rawGitHub.search_results) {
        for (const repo of sr.repos) {
            if (!allRepos.has(repo.full_name)) {
                allRepos.set(repo.full_name, repo);
            }
        }
    }

    // Take top 50 by stars for LLM classification
    const top50 = [...allRepos.values()]
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 50);

    console.log(`  Classifying ${top50.length} repos...`);

    const repoList = top50.map(r => ({
        full_name: r.full_name,
        stars: r.stargazers_count,
        description: r.description?.slice(0, 100),
        language: r.language,
        topics: r.topics?.slice(0, 5),
    }));

    const repoClassification = await llmJSON<Array<{ full_name: string; category: string; relevance: number; tags: string[] }>>(
        `Classify these GitHub repositories for the AI agent marketplace ecosystem.

For each repo, determine:
- category: one of "mcp_tool", "ai_agent", "framework", "integration", "infrastructure", "other"
- relevance: 1-10 (10 = directly relevant to AI agent marketplace, 1 = unrelated)
- tags: 2-4 descriptive tags

Repos:
${JSON.stringify(repoList, null, 2)}

Return a JSON array with objects: { full_name, category, relevance, tags }`
    );

    const enrichedRepos: EnrichedRepo[] = top50.map(r => {
        const classification = repoClassification.find((c: any) => c.full_name === r.full_name);
        return {
            full_name: r.full_name,
            stars: r.stargazers_count,
            description: r.description,
            category: classification?.category || 'other',
            relevance: classification?.relevance || 5,
            tags: classification?.tags || [],
        };
    });

    // Enrich HN stories
    const allStories: any[] = [];
    for (const sr of rawHN.search_results) {
        allStories.push(...sr.stories);
    }
    allStories.push(...(rawHN.top_stories || []));

    // Deduplicate by ID
    const uniqueStories = [...new Map(allStories.map(s => [s.id, s])).values()]
        .sort((a, b) => b.score - a.score)
        .slice(0, 30);

    console.log(`  Analyzing ${uniqueStories.length} HN stories...`);

    const storyList = uniqueStories.map(s => ({
        id: s.id,
        title: s.title,
        score: s.score,
        comments: s.descendants,
    }));

    const storyAnalysis = await llmJSON<Array<{ id: number; sentiment: string; topic: string; relevance: number; entities: string[] }>>(
        `Analyze these Hacker News stories about AI/MCP technology.

For each story, determine:
- sentiment: "positive", "neutral", or "negative"
- topic: primary topic in 2-3 words
- relevance: 1-10 (10 = directly relevant to AI agent marketplaces and MCP)
- entities: companies/products/protocols mentioned in the title

Stories:
${JSON.stringify(storyList, null, 2)}

Return a JSON array with objects: { id, sentiment, topic, relevance, entities }`
    );

    const enrichedStories: EnrichedStory[] = uniqueStories.map(s => {
        const analysis = storyAnalysis.find((a: any) => a.id == s.id);
        return {
            id: s.id,
            title: s.title,
            score: s.score,
            comments: s.descendants || 0,
            sentiment: analysis?.sentiment || 'neutral',
            topic: analysis?.topic || 'unknown',
            relevance: analysis?.relevance || 5,
            entities: analysis?.entities || [],
        };
    });

    // Process npm data
    const npmPackages = rawNpm.packages.map((p: any) => ({
        name: p.name,
        weekly: p.downloads_last_week,
        monthly: p.downloads_last_month,
        growth_pct: p.downloads_last_month > 0
            ? Math.round(((p.downloads_last_week * 4.33) - p.downloads_last_month) / p.downloads_last_month * 100)
            : 0,
    }));

    const fastestGrowing = npmPackages.sort((a: any, b: any) => b.growth_pct - a.growth_pct)[0]?.name || 'unknown';
    const totalWeekly = npmPackages.reduce((sum: number, p: any) => sum + p.weekly, 0);

    console.log(`  ✅ Enriched: ${enrichedRepos.length} repos, ${enrichedStories.length} stories, ${npmPackages.length} packages`);

    return {
        repos: enrichedRepos,
        stories: enrichedStories,
        npm_summary: {
            total_weekly_downloads: totalWeekly,
            fastest_growing: fastestGrowing,
            packages: npmPackages,
        },
        collected_at: new Date().toISOString(),
    };
}
