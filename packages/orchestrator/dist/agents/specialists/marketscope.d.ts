import { BaseAgent } from '../base.js';
import type { StructuredTask, NpmPackageData, HackerNewsItem } from '../../types.js';
export declare class MarketScopeAgent extends BaseAgent {
    constructor();
    research(task: StructuredTask, onApiCall?: (api: string, detail: string) => void): Promise<{
        report: string;
        npmData: NpmPackageData[];
        hnData: HackerNewsItem[];
        apiCalls: number;
        latencyMs: number;
    }>;
}
