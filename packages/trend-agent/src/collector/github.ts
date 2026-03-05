import { CONFIG } from '../config.js';
import { sleep } from '../utils/llm.js';

interface GitHubRepo {
    full_name: string;
    name: string;
    description: string | null;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    language: string | null;
    topics: string[];
    created_at: string;
    updated_at: string;
    pushed_at: string;
    html_url: string;
    owner: { login: string };
}

interface GitHubSearchResult {
    query: string;
    repos: GitHubRepo[];
    collected_at: string;
}

interface CompetitorData {
    name: string;
    repo: string;
    stars: number;
    forks: number;
    open_issues: number;
    last_push: string;
    description: string | null;
    language: string | null;
    topics: string[];
    collected_at: string;
}

export interface GitHubData {
    search_results: GitHubSearchResult[];
    competitors: CompetitorData[];
    collected_at: string;
}

const headers = {
    'Accept': 'application/vnd.github+json',
    'Authorization': `Bearer ${CONFIG.GITHUB_TOKEN}`,
    'X-GitHub-Api-Version': '2022-11-28',
};

async function searchRepos(query: string): Promise<GitHubRepo[]> {
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=30`;

    const res = await fetch(url, { headers });
    if (!res.ok) {
        console.error(`  ⚠️ GitHub search failed for "${query}": ${res.status}`);
        return [];
    }

    const data = await res.json() as { items: GitHubRepo[] };
    return data.items.map(r => ({
        full_name: r.full_name,
        name: r.name,
        description: r.description,
        stargazers_count: r.stargazers_count,
        forks_count: r.forks_count,
        open_issues_count: r.open_issues_count,
        language: r.language,
        topics: r.topics || [],
        created_at: r.created_at,
        updated_at: r.updated_at,
        pushed_at: r.pushed_at,
        html_url: r.html_url,
        owner: { login: r.owner.login },
    }));
}

async function getRepoData(repoPath: string): Promise<CompetitorData | null> {
    const url = `https://api.github.com/repos/${repoPath}`;

    const res = await fetch(url, { headers });
    if (!res.ok) {
        console.error(`  ⚠️ GitHub repo failed for "${repoPath}": ${res.status}`);
        return null;
    }

    const r = await res.json() as GitHubRepo;
    return {
        name: r.name,
        repo: r.full_name,
        stars: r.stargazers_count,
        forks: r.forks_count,
        open_issues: r.open_issues_count,
        last_push: r.pushed_at,
        description: r.description,
        language: r.language,
        topics: r.topics || [],
        collected_at: new Date().toISOString(),
    };
}

export async function collectGitHub(): Promise<GitHubData> {
    console.log('🔍 Collecting GitHub data...');

    const search_results: GitHubSearchResult[] = [];

    for (const query of CONFIG.GITHUB_QUERIES) {
        console.log(`  Searching: "${query}"`);
        const repos = await searchRepos(query);
        search_results.push({
            query,
            repos,
            collected_at: new Date().toISOString(),
        });
        await sleep(1500); // Rate limit respect
    }

    const competitors: CompetitorData[] = [];

    for (const comp of CONFIG.COMPETITOR_REPOS) {
        console.log(`  Tracking: ${comp.name} (${comp.repo})`);
        const data = await getRepoData(comp.repo);
        if (data) {
            data.name = comp.name;
            competitors.push(data);
        }
        await sleep(500);
    }

    const totalRepos = search_results.reduce((sum, r) => sum + r.repos.length, 0);
    console.log(`  ✅ GitHub: ${totalRepos} repos found, ${competitors.length} competitors tracked`);

    return {
        search_results,
        competitors,
        collected_at: new Date().toISOString(),
    };
}
