/* ═══════════════════════════════════════════════════════════
   GitHub REST API Client
   ═══════════════════════════════════════════════════════════ */

import { config } from '../config.js';
import type { GitHubRepoData } from '../types.js';

const API = 'https://api.github.com';

function headers() {
    const h: Record<string, string> = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Agora-Orchestrator/0.1',
    };
    if (config.githubToken) h['Authorization'] = `Bearer ${config.githubToken}`;
    return h;
}

async function ghFetch<T>(path: string): Promise<T> {
    const res = await fetch(`${API}${path}`, { headers: headers() });
    if (!res.ok) throw new Error(`GitHub API ${res.status}: ${res.statusText} — ${path}`);
    return res.json() as Promise<T>;
}

export async function fetchRepoData(owner: string, repo: string): Promise<GitHubRepoData> {
    // Parallel fetch for speed
    const [repoInfo, languages, contributors, commits, contents] = await Promise.all([
        ghFetch<any>(`/repos/${owner}/${repo}`),
        ghFetch<Record<string, number>>(`/repos/${owner}/${repo}/languages`),
        ghFetch<any[]>(`/repos/${owner}/${repo}/contributors?per_page=5`).catch(() => []),
        ghFetch<any[]>(`/repos/${owner}/${repo}/commits?per_page=15`).catch(() => []),
        ghFetch<any[]>(`/repos/${owner}/${repo}/contents/`).catch(() => []),
    ]);

    // Try to fetch package.json for dependencies
    let dependencies: Record<string, string> = {};
    let devDependencies: Record<string, string> = {};
    try {
        const pkgContent = await ghFetch<any>(`/repos/${owner}/${repo}/contents/package.json`);
        if (pkgContent.content) {
            const decoded = JSON.parse(atob(pkgContent.content));
            dependencies = decoded.dependencies || {};
            devDependencies = decoded.devDependencies || {};
        }
    } catch { /* no package.json, that's fine */ }

    const hasReadme = Array.isArray(contents)
        ? contents.some((f: any) => f.name.toLowerCase().startsWith('readme'))
        : false;

    return {
        name: repoInfo.name,
        fullName: repoInfo.full_name,
        description: repoInfo.description || '',
        stars: repoInfo.stargazers_count,
        forks: repoInfo.forks_count,
        openIssues: repoInfo.open_issues_count,
        language: repoInfo.language || 'Unknown',
        languages,
        createdAt: repoInfo.created_at,
        updatedAt: repoInfo.updated_at,
        pushedAt: repoInfo.pushed_at,
        license: repoInfo.license?.spdx_id || undefined,
        hasReadme,
        defaultBranch: repoInfo.default_branch,
        contributors: Array.isArray(contributors) ? contributors.length : 0,
        recentCommits: Array.isArray(commits)
            ? commits.slice(0, 10).map((c: any) => ({
                message: c.commit?.message?.split('\n')[0] || '',
                date: c.commit?.author?.date || '',
                author: c.commit?.author?.name || '',
            }))
            : [],
        topics: repoInfo.topics || [],
        size: repoInfo.size,
        dependencies,
        devDependencies,
    };
}

/** Parse "owner/repo" from a GitHub URL or shorthand */
export function parseGitHubRepo(input: string): { owner: string; repo: string } | null {
    // Try URL format: github.com/owner/repo
    const urlMatch = input.match(/github\.com\/([^\/]+)\/([^\/\s#?]+)/);
    if (urlMatch) return { owner: urlMatch[1], repo: urlMatch[2].replace(/\.git$/, '') };
    // Try shorthand: owner/repo
    const shortMatch = input.match(/^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/);
    if (shortMatch) return { owner: shortMatch[1], repo: shortMatch[2] };
    return null;
}
