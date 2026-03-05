import { CONFIG } from '../config.js';
import { sleep } from '../utils/llm.js';

interface HNStory {
    id: number;
    title: string;
    url: string | null;
    score: number;
    by: string;
    time: number;
    descendants: number; // comment count
    type: string;
}

interface HNSearchResult {
    query: string;
    stories: HNStory[];
    collected_at: string;
}

export interface HackerNewsData {
    search_results: HNSearchResult[];
    top_stories: HNStory[];
    collected_at: string;
}

async function searchHN(query: string): Promise<HNStory[]> {
    // Algolia HN Search API — free, no key needed
    const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=20&numericFilters=created_at_i>${Math.floor(Date.now() / 1000) - 30 * 24 * 3600}`;

    const res = await fetch(url);
    if (!res.ok) {
        console.error(`  ⚠️ HN search failed for "${query}": ${res.status}`);
        return [];
    }

    const data = await res.json() as any;
    return (data.hits || []).map((h: any) => ({
        id: h.objectID,
        title: h.title,
        url: h.url || null,
        score: h.points || 0,
        by: h.author,
        time: h.created_at_i,
        descendants: h.num_comments || 0,
        type: 'story',
    }));
}

async function getTopStories(): Promise<HNStory[]> {
    // Get current top stories and filter for AI-related
    const res = await fetch('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=30');
    if (!res.ok) return [];

    const data = await res.json() as any;
    const aiKeywords = ['ai', 'agent', 'llm', 'gpt', 'claude', 'gemini', 'openai', 'anthropic', 'mcp', 'model'];

    return (data.hits || [])
        .filter((h: any) => {
            const title = (h.title || '').toLowerCase();
            return aiKeywords.some(kw => title.includes(kw));
        })
        .map((h: any) => ({
            id: h.objectID,
            title: h.title,
            url: h.url || null,
            score: h.points || 0,
            by: h.author,
            time: h.created_at_i,
            descendants: h.num_comments || 0,
            type: 'story',
        }));
}

export async function collectHackerNews(): Promise<HackerNewsData> {
    console.log('🟧 Collecting Hacker News data...');

    const search_results: HNSearchResult[] = [];

    for (const query of CONFIG.HN_QUERIES) {
        console.log(`  Searching: "${query}"`);
        const stories = await searchHN(query);
        search_results.push({
            query,
            stories,
            collected_at: new Date().toISOString(),
        });
        await sleep(500);
    }

    console.log('  Checking top stories for AI mentions...');
    const top_stories = await getTopStories();

    const totalStories = search_results.reduce((sum, r) => sum + r.stories.length, 0);
    console.log(`  ✅ HN: ${totalStories} stories found, ${top_stories.length} AI-related on front page`);

    return {
        search_results,
        top_stories,
        collected_at: new Date().toISOString(),
    };
}
