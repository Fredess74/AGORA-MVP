import type { GitHubRepoData } from '../types.js';
export declare function fetchRepoData(owner: string, repo: string): Promise<GitHubRepoData>;
/** Parse "owner/repo" from a GitHub URL or shorthand */
export declare function parseGitHubRepo(input: string): {
    owner: string;
    repo: string;
} | null;
