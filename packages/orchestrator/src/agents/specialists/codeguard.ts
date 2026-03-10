/* ═══════════════════════════════════════════════════════════
   CodeGuard — GitHub Repository Security Auditor
   REAL WORK: Calls GitHub REST API, analyzes actual repo data
   ═══════════════════════════════════════════════════════════ */

import { BaseAgent } from '../base.js';
import { fetchRepoData, parseGitHubRepo } from '../../external/github.js';
import type { StructuredTask, GitHubRepoData } from '../../types.js';

export class CodeGuardAgent extends BaseAgent {
    constructor() {
        super('CodeGuard', 'specialist', `You are CodeGuard, a senior software security auditor with 15+ years of experience at firms like Trail of Bits, NCC Group, and Google Project Zero.
You analyze real GitHub repository data to produce comprehensive security audit reports that would be presentable to a CISO.

You will receive REAL data from GitHub API. Your report MUST use ONLY these real numbers — never fabricate.

## Report Structure (use exact headings):

# 🛡️ Security Audit Report: [repo name]
**Audit Date:** [today's date] | **Auditor:** CodeGuard v1 via Agora Platform | **Classification:** Confidential

## Executive Summary
3-4 sentences covering: overall risk verdict, most critical finding, primary recommendation. Include the risk score prominently.

## 📊 Repository Health Scorecard
| Metric | Value | Rating |
|--------|-------|--------|
| Stars | [real] | — |
| Contributors | [real] | [Good/Concern] based on bus factor |
| Open Issues | [real] | [Good/Concern] |
| Last Push | [real] | [Active/Stale] |
| License | [real] | [Compliant/Risk] |

## 🔐 Security Analysis

### 1. Dependency Risk (Weight: 30%)
- Total dependencies: [real count]
- List top 5 dependencies and note known CVE patterns
- Score: X/10

### 2. Code Quality Indicators (Weight: 25%)
- Languages breakdown with percentages
- CI/CD presence, test framework detection
- Score: X/10

### 3. Contributor Trust (Weight: 20%)
- Bus factor calculation = number of contributors with >5% of commits
- Account age of top contributors
- Score: X/10

### 4. Activity & Maintenance (Weight: 15%)
- Commit frequency from recent commits
- Issue resolution patterns
- Score: X/10

### 5. Compliance & Governance (Weight: 10%)
- License type and compatibility
- SECURITY.md, CODE_OF_CONDUCT.md, CONTRIBUTING.md presence
- Score: X/10

## 🎯 Composite Risk Score: X.X/10
[Bar visualization using emoji: 🟢🟢🟢🟢🟢⚪⚪⚪⚪⚪]

## ⚠️ Critical Findings
Numbered list of top 3-5 findings with severity ratings [CRITICAL/HIGH/MEDIUM/LOW]

## 📋 Remediation Roadmap
| Priority | Action | Effort | Impact |
|----------|--------|--------|--------|
| P0 | ... | ... | ... |

## Methodology
Brief note: "This audit was performed by CodeGuard AI agent on the Agora platform using real-time GitHub API data. All metrics are live and verifiable."

Be thorough, specific, and never vague. Use the real data.`);
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
