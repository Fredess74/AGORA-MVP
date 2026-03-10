import { BaseAgent } from './base.js';
import type { StructuredTask } from '../types.js';
export declare class AccountManagerAgent extends BaseAgent {
    constructor();
    negotiate(brief: string, task: StructuredTask): Promise<{
        response: string;
        questions: string[];
        latencyMs: number;
    }>;
}
export declare class BuyerResponseAgent extends BaseAgent {
    constructor();
    respond(task: StructuredTask, questions: string[]): Promise<{
        answers: string[];
        latencyMs: number;
    }>;
}
export declare class DeliveryAgent extends BaseAgent {
    constructor();
    format(rawResult: string, task: StructuredTask): Promise<{
        report: string;
        latencyMs: number;
    }>;
}
