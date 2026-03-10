import type { AgentResponse } from '../types.js';
export declare abstract class BaseAgent {
    protected name: string;
    protected role: string;
    protected systemPrompt: string;
    constructor(name: string, role: string, systemPrompt: string);
    call(userMessage: string, context?: string): Promise<AgentResponse>;
    callJSON<T>(userMessage: string, context?: string): Promise<{
        data: T;
        latencyMs: number;
    }>;
    getName(): string;
    getRole(): string;
}
