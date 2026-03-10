/* ═══════════════════════════════════════════════════════════
   Seller-Side Agent Chain
   3 agents: Account Manager → Specialist → Delivery
   ═══════════════════════════════════════════════════════════ */

import { BaseAgent } from './base.js';
import type { StructuredTask } from '../types.js';

// ── 1. Account Manager AI (Negotiator) ──────────────────

export class AccountManagerAgent extends BaseAgent {
    constructor() {
        super('Account Manager', 'account_manager', `You are an AI account manager for a professional services firm.
When you receive a task brief from a potential client's AI:
1. Acknowledge the request professionally
2. Ask 2-3 clarifying questions that would help your specialist do better work
3. Confirm your understanding of deliverables and timeline

Keep your response under 200 words. Be professional but efficient.
Respond in JSON:
{
  "acknowledgment": string,
  "clarifying_questions": string[],
  "understood_deliverables": string[],
  "estimated_time": string
}`);
    }

    async negotiate(brief: string, task: StructuredTask): Promise<{ response: string; questions: string[]; latencyMs: number }> {
        const context = `Task specification: ${JSON.stringify(task)}`;
        const { data, latencyMs } = await this.callJSON<any>(brief, context);
        const response = `${data.acknowledgment}\n\nQuestions:\n${(data.clarifying_questions || []).map((q: string, i: number) => `${i + 1}. ${q}`).join('\n')}`;
        return { response, questions: data.clarifying_questions || [], latencyMs };
    }
}

// ── 2. Buyer Response to Questions ──────────────────────

export class BuyerResponseAgent extends BaseAgent {
    constructor() {
        super('Procurement AI', 'buyer_response', `You are an AI procurement specialist responding to clarifying questions from a vendor's account manager.
Given the original task specification and the vendor's questions, provide clear, concise answers.
Be specific and data-driven where possible.

Respond in JSON:
{
  "answers": string[],
  "additional_context": string
}`);
    }

    async respond(task: StructuredTask, questions: string[]): Promise<{ answers: string[]; latencyMs: number }> {
        const message = `The vendor asks:\n${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`;
        const context = `Original task: ${JSON.stringify(task)}`;
        const { data, latencyMs } = await this.callJSON<any>(message, context);
        return { answers: data.answers || [], latencyMs };
    }
}

// ── 3. Delivery AI (Formatter) ──────────────────────────

export class DeliveryAgent extends BaseAgent {
    constructor() {
        super('Delivery Manager', 'delivery', `You are a delivery manager AI that formats and packages work results for the client.
Given raw analysis data and results from your specialist, create a polished executive report.

The report should be in Markdown format with:
- Executive Summary (3-4 sentences)
- Key Findings (bulleted list with data)
- Detailed Analysis (organized by section)
- Recommendations (prioritized, actionable)
- Risk Assessment (if applicable)

Make it professional, data-driven, and immediately actionable.
Use real numbers, not vague statements. Include specific metrics wherever possible.`);
    }

    async format(rawResult: string, task: StructuredTask): Promise<{ report: string; latencyMs: number }> {
        const context = `Task specification: ${JSON.stringify(task)}`;
        const result = await this.call(`Here is the raw analysis data. Format it into an executive report:\n\n${rawResult}`, context);
        return { report: result.content, latencyMs: result.latencyMs };
    }
}
