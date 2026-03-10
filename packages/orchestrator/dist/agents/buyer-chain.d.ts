import { BaseAgent } from './base.js';
import type { StructuredTask, AgentListing } from '../types.js';
export declare class FormulatorAgent extends BaseAgent {
    constructor();
    formulate(directorQuery: string): Promise<{
        task: StructuredTask;
        latencyMs: number;
    }>;
}
export declare class ProcurementAgent extends BaseAgent {
    constructor();
    selectAgent(task: StructuredTask, agents: AgentListing[]): Promise<{
        agentId: string;
        agentName: string;
        reasoning: string;
        brief: string;
        latencyMs: number;
    }>;
}
export declare class QAInspectorAgent extends BaseAgent {
    constructor();
    validate(task: StructuredTask, result: string): Promise<{
        accepted: boolean;
        rating: number;
        summary: string;
        latencyMs: number;
    }>;
}
