/* ═══════════════════════════════════════════════════════════
   CodeGuard — GitHub Repository Security Auditor
   REAL WORK: Calls GitHub REST API, analyzes actual repo data
   ═══════════════════════════════════════════════════════════ */

import { BaseAgent } from '../base.js';
import { fetchRepoData, parseGitHubRepo } from '../../external/github.js';
import type { StructuredTask, GitHubRepoData } from '../../types.js';

export class CodeGuardAgent extends BaseAgent {
    constructor() {
        super('CodeGuard', 'specialist', `You are CodeGuard, a senior software security auditor.
You analyze real GitHub repository data to produce security and code quality reports.

Given real data from GitHub API (repo metadata, dependencies, commit history, languages, license),
produce a detailed security audit report with:
1. Executive Summary (3 sentences: overall risk level, key findings, recommendation)
2. Repository Health Assessment (stars, forks, activity, bus factor)
3. Dependency Analysis (number, known risks, outdated packages)
4. Code Quality Indicators (test presence, CI/CD, documentation, commit patterns)
5. Security Posture (license compliance, secret detection risk, contributor trust)
6. Risk Score (1-10, where 1 = very safe, 10 = critical risk)
7. Top 3 Recommendations

Use ONLY the real data provided. Never fabricate statistics.
Format as clear Markdown.`);
    }

    async audit(task: StructuredTask, onApiCall?: (api: string, detail: string) => void): Promise<{
        report: string;
        repoData: GitHubRepoData;
        apiCalls: number;
        latencyMs: number;
    }> {
        const start = Date.now();

        // Parse target repo
        const parsed = parseGitHubRepo(task.target);
        if (!parsed) throw new Error(`Cannot parse GitHub repo from: ${task.target}`);

        onApiCall?.('GitHub API', `Fetching repo: ${parsed.owner}/${parsed.repo}`);

        // Make REAL API calls
        const repoData = await fetchRepoData(parsed.owner, parsed.repo);

        onApiCall?.('GitHub API', `Got data: ${repoData.stars} stars, ${Object.keys(repoData.languages).length} languages, ${repoData.recentCommits.length} recent commits`);

        // Prepare data summary for LLM
        const dataSummary = JSON.stringify({
            repo: repoData.fullName,
            description: repoData.description,
            stars: repoData.stars,
            forks: repoData.forks,
            openIssues: repoData.openIssues,
            language: repoData.language,
            languages: repoData.languages,
            license: repoData.license,
            hasReadme: repoData.hasReadme,
            contributors: repoData.contributors,
            size: repoData.size,
            topics: repoData.topics,
            createdAt: repoData.createdAt,
            lastPush: repoData.pushedAt,
            recentCommits: repoData.recentCommits.slice(0, 5),
            dependencyCount: Object.keys(repoData.dependencies || {}).length,
            devDependencyCount: Object.keys(repoData.devDependencies || {}).length,
            dependencies: repoData.dependencies,
        }, null, 2);

        onApiCall?.('Gemini AI', 'Analyzing data and generating security report');

        const result = await this.call(
            `Analyze this GitHub repository data and produce a security audit report:\n\n${dataSummary}`
        );

        return {
            report: result.content,
            repoData,
            apiCalls: 6, // repo, languages, contributors, commits, contents, package.json
            latencyMs: Date.now() - start,
        };
    }
}
