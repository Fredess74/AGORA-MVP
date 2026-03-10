import { BaseAgent } from '../base.js';
import type { StructuredTask, PageSpeedData } from '../../types.js';
export declare class WebPulseAgent extends BaseAgent {
    constructor();
    audit(task: StructuredTask, onApiCall?: (api: string, detail: string) => void): Promise<{
        report: string;
        mobileData: PageSpeedData | null;
        desktopData: PageSpeedData | null;
        siteCheck: any;
        apiCalls: number;
        latencyMs: number;
    }>;
}
