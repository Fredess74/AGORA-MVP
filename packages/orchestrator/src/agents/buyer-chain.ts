/* ═══════════════════════════════════════════════════════════
   Buyer-Side Agent Chain
   3 agents: Formulator → Procurement → QA Inspector
   ═══════════════════════════════════════════════════════════ */

import { BaseAgent } from './base.js';
import type { StructuredTask, AgentListing } from '../types.js';

// ── 1. Director's AI (Formulator) ───────────────────────

export class FormulatorAgent extends BaseAgent {
    constructor() {
        super('Director\'s AI', 'formulator', `You are a corporate AI assistant for a business director.
Your job is to take a natural language request from the director and convert it into a structured task specification.

IMPORTANT: Respond ONLY with valid JSON. No markdown, no explanation.

Determine the task_type from these options:
- "code_security_audit" — if the request involves reviewing code, repos, dependencies, security
- "competitive_intelligence" — if the request involves market research, competitor analysis, trends
- "website_performance_audit" — if the request involves analyzing a website's performance, SEO, speed
- "business_process_optimization" — if it involves improving internal processes

JSON Schema:
{
  "task_type": string,
  "target": string (URL, repo name, topic, or process name),
  "domain": string (industry or area),
  "current_state": string | null,
  "desired_state": string | null,
  "deliverables": string[] (what the director expects),
  "priority": "low" | "medium" | "high" | "critical",
  "constraints": string[] | null
}`);
    }

    async formulate(directorQuery: string): Promise<{ task: StructuredTask; latencyMs: number }> {
        const { data, latencyMs } = await this.callJSON<StructuredTask>(directorQuery);
        return { task: data, latencyMs };
    }
}

// ── 2. Procurement AI (Discoverer) ──────────────────────

export class ProcurementAgent extends BaseAgent {
    constructor() {
        super('Procurement AI', 'procurement', `You are an AI procurement specialist. You evaluate AI agents from a marketplace and select the best one for a task.

Given a list of available agents (with trust scores, capabilities, pricing) and a task specification, you must:
1. Evaluate each agent's fit for the task
2. Consider trust scores, specialization, and track record
3. Select the BEST agent and explain why

Respond in JSON:
{
  "selected_agent_id": string,
  "selected_agent_name": string,
  "reasoning": string (2-3 sentences why this agent was chosen),
  "relevance_score": number (0.0-1.0),
  "negotiation_brief": string (what to tell the agent about the task)
}`);
    }

    async selectAgent(
        task: StructuredTask,
        agents: AgentListing[]
    ): Promise<{ agentId: string; agentName: string; reasoning: string; brief: string; latencyMs: number }> {
        const context = `Available agents:\n${JSON.stringify(agents, null, 2)}`;
        const message = `Task specification:\n${JSON.stringify(task, null, 2)}\n\nSelect the best agent for this task.`;
        const { data, latencyMs } = await this.callJSON<any>(message, context);
        return {
            agentId: data.selected_agent_id,
            agentName: data.selected_agent_name,
            reasoning: data.reasoning,
            brief: data.negotiation_brief,
            latencyMs,
        };
    }
}

// ── 3. QA Inspector AI (Validator) ──────────────────────

export class QAInspectorAgent extends BaseAgent {
    constructor() {
        super('QA Inspector', 'qa_inspector', `You are a QA inspector AI. You validate the quality and completeness of work delivered by external AI agents.

Given the original task specification and the delivered result, you must:
1. Check if all deliverables were addressed
2. Rate the quality (1-5 stars)
3. Identify any gaps or issues
4. Write a brief acceptance summary

Respond in JSON:
{
  "accepted": boolean,
  "quality_rating": number (1-5),
  "completeness_percentage": number (0-100),
  "summary": string (2-3 sentences),
  "gaps": string[] (any missing items),
  "recommendation": string ("accept" | "request_revision" | "reject")
}`);
    }

    async validate(
        task: StructuredTask,
        result: string
    ): Promise<{ accepted: boolean; rating: number; summary: string; latencyMs: number }> {
        const message = `Original task:\n${JSON.stringify(task, null, 2)}\n\nDelivered result:\n${result.substring(0, 3000)}`;
        const { data, latencyMs } = await this.callJSON<any>(message);
        return {
            accepted: data.accepted ?? true,
            rating: data.quality_rating ?? 4,
            summary: data.summary ?? 'Quality check completed.',
            latencyMs,
        };
    }
}
