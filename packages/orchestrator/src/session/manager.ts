/* ═══════════════════════════════════════════════════════════
   Session Manager — Orchestrates the entire E2E demo flow
   
   Director Query → Formulator → MCP Search → Procurement →
   Account Manager ↔ Procurement (negotiation) →
   Specialist (real work) → Delivery → QA Inspector →
   Trust Update → Complete
   ═══════════════════════════════════════════════════════════ */

import { v4 as uuid } from 'uuid';
import { emit } from './sse.js';
import { FormulatorAgent, ProcurementAgent, QAInspectorAgent } from '../agents/buyer-chain.js';
import { AccountManagerAgent, BuyerResponseAgent, DeliveryAgent } from '../agents/seller-chain.js';
import { CodeGuardAgent } from '../agents/specialists/codeguard.js';
import { MarketScopeAgent } from '../agents/specialists/marketscope.js';
import { WebPulseAgent } from '../agents/specialists/webpulse.js';
import { searchAgents, getAgentTrust, AGENT_REGISTRY } from '../mcp/tools.js';
import { getTrustBreakdown, updateTrustAfterTransaction, getTrustLevel } from '../trust/calculator.js';
import type { DemoSession, SpeedMode, StructuredTask, TrustBreakdown } from '../types.js';

// Active sessions
const sessions: Map<string, DemoSession> = new Map();

// Agent instances (singletons)
const formulator = new FormulatorAgent();
const procurement = new ProcurementAgent();
const qaInspector = new QAInspectorAgent();
const accountManager = new AccountManagerAgent();
const buyerResponse = new BuyerResponseAgent();
const delivery = new DeliveryAgent();
const codeguard = new CodeGuardAgent();
const marketscope = new MarketScopeAgent();
const webpulse = new WebPulseAgent();

export function getSession(id: string): DemoSession | undefined {
    return sessions.get(id);
}

export function getAllSessions(): DemoSession[] {
    return [...sessions.values()];
}

/**
 * Run the complete E2E demo flow
 */
export async function runDemo(userQuery: string, speedMode: SpeedMode = 'slow'): Promise<DemoSession> {
    const sessionId = uuid();
    const session: DemoSession = {
        id: sessionId,
        userQuery,
        status: 'started',
        apiCallsMade: 0,
        speedMode,
        createdAt: new Date().toISOString(),
    };
    sessions.set(sessionId, session);

    try {
        // ═══ STEP 1: Session started ═══
        await emit('session_started', sessionId, 'system', 'Demo Started', `Director request: "${userQuery}"`, speedMode);

        // ═══ STEP 2: Formulate task ═══
        await emit('task_formulated', sessionId, 'Director\'s AI', 'Formulating task...', 'Analyzing director request and creating structured specification', speedMode);

        const { task, latencyMs: formLatency } = await formulator.formulate(userQuery);
        session.structuredTask = task;
        session.status = 'task_formulated';

        await emit('task_formulated', sessionId, 'Director\'s AI', 'Task Formulated',
            `Type: ${task.task_type}\nTarget: ${task.target}\nDomain: ${task.domain}\nDeliverables: ${task.deliverables.join(', ')}`,
            speedMode, { task, latencyMs: formLatency });

        // ═══ STEP 3: MCP Agent Discovery ═══
        session.status = 'searching';

        // Search WITHOUT min_trust filter first — then show actual trust scores
        const agents = searchAgents({ capability: task.task_type });

        await emit('mcp_search', sessionId, 'Agora MCP', 'Searching agents...',
            `search_agents({ capability: "${task.task_type}" })`, speedMode);

        if (agents.length === 0) {
            // Broadened search — try by category keywords
            const broadAgents = searchAgents({ query: task.task_type.replace(/_/g, ' ') });
            if (broadAgents.length > 0) {
                agents.push(...broadAgents);
            } else {
                // Last resort: return all agents
                agents.push(...AGENT_REGISTRY);
            }
        }

        await emit('mcp_search', sessionId, 'Agora MCP', `Found ${agents.length} agents`,
            agents.map(a => `• ${a.name} (trust: ${a.trustScore.toFixed(3)}, calls: ${a.totalCalls})`).join('\n'),
            speedMode, { agents: agents.map(a => ({ id: a.id, name: a.name, trust: a.trustScore })) });

        // ═══ STEP 4: Agent Selection ═══
        const { agentId, agentName, reasoning, brief, latencyMs: procLatency } =
            await procurement.selectAgent(task, agents);

        // Robust fallback: ensure we always have a valid agent
        session.selectedAgentId = agentId || agents[0]?.id || 'codeguard-001';
        session.agentName = agentName || agents[0]?.name || 'CodeGuard Security Auditor';
        session.status = 'agent_selected';

        const selectedId = session.selectedAgentId!;
        const agentDisplayName = session.agentName!;

        // Get trust breakdown BEFORE transaction
        session.trustBefore = getTrustBreakdown(selectedId, agentDisplayName);

        await emit('agent_selected', sessionId, 'Procurement AI', `Selected: ${agentDisplayName}`,
            reasoning || `Best match for ${task.task_type} based on capabilities and trust score.`,
            speedMode, {
            agentId: selectedId,
            latencyMs: procLatency,
            trust: session.trustBefore,
        });

        // ═══ STEP 5: Trust breakdown (before) ═══
        await emit('trust_updated', sessionId, 'Agora Trust', 'Trust Score (pre-transaction)',
            formatTrustBreakdown(session.trustBefore), speedMode, { trust: session.trustBefore });

        // ═══ STEP 6: AI-to-AI Negotiation ═══
        session.status = 'negotiating';

        // Seller: Account Manager receives brief
        const taskBrief = brief || `Task: ${task.task_type} targeting ${task.target}. Deliverables: ${task.deliverables.join(', ')}`;
        await emit('negotiation', sessionId, 'Procurement AI → Seller', 'Sending task brief',
            taskBrief, speedMode);

        const { response: amResponse, questions, latencyMs: amLatency } =
            await accountManager.negotiate(taskBrief, task);

        await emit('negotiation', sessionId, 'Account Manager', 'Clarification questions',
            amResponse, speedMode, { latencyMs: amLatency });

        // Buyer: Responds to questions
        if (questions.length > 0) {
            const { answers, latencyMs: brLatency } = await buyerResponse.respond(task, questions);

            await emit('negotiation', sessionId, 'Procurement AI', 'Answering questions',
                answers.map((a, i) => `${i + 1}. ${a}`).join('\n\n'),
                speedMode, { latencyMs: brLatency });
        }

        // ═══ STEP 7: Specialist Work ═══
        session.status = 'executing';
        await emit('work_started', sessionId, agentDisplayName, 'Starting work...',
            `Specialist begins executing the task`, speedMode);

        let rawResult = '';
        let apiCalls = 0;

        const onApiCall = async (api: string, detail: string) => {
            apiCalls++;
            session.apiCallsMade = apiCalls;
            await emit('api_call', sessionId, agentDisplayName, `📡 ${api}`, detail, speedMode,
                { api, apiCallNumber: apiCalls });
        };

        // Route to correct specialist
        if (selectedId === 'codeguard-001' || task.task_type.includes('code') || task.task_type.includes('security') || task.task_type.includes('audit')) {
            const result = await codeguard.audit(task, onApiCall);
            rawResult = result.report;
            apiCalls = result.apiCalls;
        } else if (selectedId === 'marketscope-001' || task.task_type.includes('market') || task.task_type.includes('competitive') || task.task_type.includes('intelligence')) {
            const result = await marketscope.research(task, onApiCall);
            rawResult = result.report;
            apiCalls = result.apiCalls;
        } else if (selectedId === 'webpulse-001' || task.task_type.includes('website') || task.task_type.includes('performance') || task.task_type.includes('seo')) {
            const result = await webpulse.audit(task, onApiCall);
            rawResult = result.report;
            apiCalls = result.apiCalls;
        } else {
            // Fallback: use CodeGuard for unknown types
            const result = await codeguard.audit(task, onApiCall);
            rawResult = result.report;
            apiCalls = result.apiCalls;
        }

        session.apiCallsMade = apiCalls;

        await emit('work_completed', sessionId, agentDisplayName, 'Work completed',
            `${rawResult.length} chars, ${apiCalls} API calls`, speedMode);

        // ═══ STEP 8: Delivery formatting ═══
        await emit('work_completed', sessionId, 'Delivery Manager', 'Formatting report...',
            'Preparing executive report for client', speedMode);

        const { report, latencyMs: delLatency } = await delivery.format(rawResult, task);

        await emit('work_completed', sessionId, 'Delivery Manager', 'Report ready',
            `${report.length} chars, ready for delivery`, speedMode, { latencyMs: delLatency });

        // ═══ STEP 9: QA Inspection ═══
        const { accepted, rating, summary, latencyMs: qaLatency } = await qaInspector.validate(task, report);

        await emit('qa_review', sessionId, 'QA Inspector', `Review: ${accepted ? '✅ Accepted' : '⚠️ Needs Revision'}`,
            `Rating: ${'⭐'.repeat(Math.round(rating))} (${rating}/5)\n${summary}`,
            speedMode, { accepted, rating, latencyMs: qaLatency });

        // ═══ STEP 10: Trust Update ═══
        const totalLatency = Date.now() - new Date(session.createdAt).getTime();
        const updatedTrust = updateTrustAfterTransaction(selectedId, accepted, totalLatency, rating);

        if (updatedTrust) {
            updatedTrust.agentName = agentDisplayName;
            session.trustAfter = updatedTrust;

            await emit('trust_updated', sessionId, 'Agora Trust Engine', 'Trust Score Updated',
                formatTrustDelta(session.trustBefore, session.trustAfter), speedMode,
                { before: session.trustBefore, after: session.trustAfter });
        } else {
            // Fallback: show the before trust again if update failed
            await emit('trust_updated', sessionId, 'Agora Trust Engine', 'Trust Score Verified',
                formatTrustBreakdown(session.trustBefore), speedMode,
                { trust: session.trustBefore });
        }

        // ═══ DONE ═══
        session.status = 'completed';
        session.result = report;
        session.totalLatencyMs = totalLatency;
        session.completedAt = new Date().toISOString();

        await emit('session_completed', sessionId, 'system', 'Connection Complete',
            `Total time: ${(totalLatency / 1000).toFixed(1)}s | API calls: ${apiCalls} | Rating: ${rating}/5`,
            speedMode, { totalLatencyMs: totalLatency, apiCalls, rating });

        return session;

    } catch (error: any) {
        session.status = 'failed';
        console.error('❌ Session error:', error);
        await emit('session_completed', sessionId, 'system', 'Error',
            error.message || String(error), speedMode);
        throw error;
    }
}

// ── Helpers ─────────────────────────────────────────────

function formatTrustBreakdown(t: TrustBreakdown): string {
    return t.components
        .map(c => `${componentIcon(c.component)} ${componentLabel(c.component)}: ${c.score.toFixed(3)} (weight: ${(c.weight * 100).toFixed(0)}%)`)
        .join('\n') + `\n──────────\n🏛️ Composite: ${t.compositeScore.toFixed(3)} [${t.level}]`;
}

function formatTrustDelta(before: TrustBreakdown, after: TrustBreakdown): string {
    const lines = after.components.map(ac => {
        const bc = before.components.find(b => b.component === ac.component);
        const delta = bc ? ac.score - bc.score : 0;
        const arrow = delta > 0 ? '⬆️' : delta < 0 ? '⬇️' : '➡️';
        const deltaStr = delta !== 0 ? ` (${delta > 0 ? '+' : ''}${delta.toFixed(3)})` : '';
        return `${arrow} ${componentLabel(ac.component)}: ${ac.score.toFixed(3)}${deltaStr}`;
    });
    const scoreDelta = after.compositeScore - before.compositeScore;
    const arrow = scoreDelta > 0 ? '⬆️' : scoreDelta < 0 ? '⬇️' : '➡️';
    lines.push(`──────────`);
    lines.push(`${arrow} TOTAL: ${before.compositeScore.toFixed(3)} → ${after.compositeScore.toFixed(3)} (${scoreDelta > 0 ? '+' : ''}${scoreDelta.toFixed(3)})`);
    return lines.join('\n');
}

function componentIcon(c: string): string {
    const icons: Record<string, string> = {
        code_quality: '💻', repo_health: '📊', uptime: '🟢',
        transaction_success: '✅', user_reviews: '⭐', account_age: '📅',
    };
    return icons[c] || '•';
}

function componentLabel(c: string): string {
    const labels: Record<string, string> = {
        code_quality: 'Code Quality', repo_health: 'Repo Health', uptime: 'Uptime',
        transaction_success: 'Tx Success', user_reviews: 'User Reviews', account_age: 'Account Age',
    };
    return labels[c] || c;
}
