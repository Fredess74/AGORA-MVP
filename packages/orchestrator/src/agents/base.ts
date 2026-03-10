/* ═══════════════════════════════════════════════════════════
   Base Gemini Agent — Foundation for all AI agents
   ═══════════════════════════════════════════════════════════ */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config.js';
import type { AgentResponse } from '../types.js';

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

export abstract class BaseAgent {
    protected name: string;
    protected role: string;
    protected systemPrompt: string;

    constructor(name: string, role: string, systemPrompt: string) {
        this.name = name;
        this.role = role;
        this.systemPrompt = systemPrompt;
    }

    async call(userMessage: string, context?: string): Promise<AgentResponse> {
        const start = Date.now();
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const fullPrompt = context
            ? `${this.systemPrompt}\n\n--- CONTEXT ---\n${context}\n\n--- USER MESSAGE ---\n${userMessage}`
            : `${this.systemPrompt}\n\n--- USER MESSAGE ---\n${userMessage}`;

        let lastError: any;
        for (let attempt = 0; attempt < 4; attempt++) {
            try {
                if (attempt > 0) {
                    const delayMs = 2000 * Math.pow(2, attempt - 1); // 2s, 4s, 8s
                    console.log(`    ⏳ ${this.name}: Retry ${attempt}/3 in ${delayMs}ms...`);
                    await new Promise(r => setTimeout(r, delayMs));
                }
                const result = await model.generateContent(fullPrompt);
                const text = result.response.text();
                const latencyMs = Date.now() - start;
                return { content: text, latencyMs, metadata: { agent: this.name, role: this.role } };
            } catch (err: any) {
                lastError = err;
                if (err.message?.includes('429') || err.message?.includes('Resource exhausted')) {
                    continue; // retry
                }
                throw err; // non-retryable error
            }
        }
        throw lastError;
    }

    async callJSON<T>(userMessage: string, context?: string): Promise<{ data: T; latencyMs: number }> {
        const start = Date.now();
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            generationConfig: { responseMimeType: 'application/json' },
        });

        const fullPrompt = context
            ? `${this.systemPrompt}\n\n--- CONTEXT ---\n${context}\n\n--- USER MESSAGE ---\n${userMessage}`
            : `${this.systemPrompt}\n\n--- USER MESSAGE ---\n${userMessage}`;

        let lastError: any;
        for (let attempt = 0; attempt < 4; attempt++) {
            try {
                if (attempt > 0) {
                    const delayMs = 2000 * Math.pow(2, attempt - 1);
                    console.log(`    ⏳ ${this.name}: Retry ${attempt}/3 in ${delayMs}ms...`);
                    await new Promise(r => setTimeout(r, delayMs));
                }
                const result = await model.generateContent(fullPrompt);
                const text = result.response.text();
                const latencyMs = Date.now() - start;
                return { data: JSON.parse(text) as T, latencyMs };
            } catch (err: any) {
                lastError = err;
                if (err.message?.includes('429') || err.message?.includes('Resource exhausted')) {
                    continue;
                }
                throw err;
            }
        }
        throw lastError;
    }

    getName(): string { return this.name; }
    getRole(): string { return this.role; }
}
