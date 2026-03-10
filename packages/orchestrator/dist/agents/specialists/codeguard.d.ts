import { BaseAgent } from '../base.js';
import type { StructuredTask, GitHubRepoData } from '../../types.js';
export declare class CodeGuardAgent extends BaseAgent {
    constructor();
    audit(task: StructuredTask, onApiCall?: (api: string, detail: string) => void): Promise<{
        report: string;
        repoData: GitHubRepoData;
        apiCalls: number;
        latencyMs: number;
    }>;
}
