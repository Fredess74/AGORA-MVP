/* ═══════════════════════════════════════════════════════════
   Session Manager — E2E Demo Orchestration with Live Trust
   
   All trust starts at 0. Each phase updates a component in
   real-time. Supabase records transactions + trust history.
   ═══════════════════════════════════════════════════════════ */

import { v4 as uuid } from 'uuid';
import { emit } from './sse.js';
import { LiveTrustTracker } from '../trust/calculator.js';
import { searchAgents, getAllAgents } from '../mcp/tools.js';
import { FormulatorAgent, ProcurementAgent, QAInspectorAgent } from '../agents/buyer-chain.js';
import { AccountManagerAgent, BuyerResponseAgent, DeliveryAgent } from '../agents/seller-chain.js';
import { CodeGuardAgent } from '../agents/specialists/codeguard.js';
import { MarketScopeAgent } from '../agents/specialists/marketscope.js';
import { WebPulseAgent } from '../agents/specialists/webpulse.js';
import { seedAgentsIfEmpty, recordTransaction, updateAgentMetrics, logUsage } from '../db/supabase.js';
import type { DemoSession, SpeedMode, StructuredTask, AgentListing } from '../types.js';

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

let webpulse: WebPulseAgent | null = null;
try { webpulse = new WebPulseAgent(); } catch { /* no PageSpeed key */ }

/** Ensure Supabase has agents seeded */
export async function initSessions(): Promise<void> {
    await seedAgentsIfEmpty();
}

/** Start a new demo session */
export async function startSession(query: string, speedMode: SpeedMode = 'fast'): Promise<DemoSession> {
    const id = uuid();
    const session: DemoSession = {
        id,
        userQuery: query,
        status: 'started',
        apiCallsMade: 0,
        speedMode,
        createdAt: new Date().toISOString(),
    };
    sessions.set(id, session);

    // Run pipeline in background
    runPipeline(session).catch(err => {
        console.error(`Session ${id} failed:`, err);
        emit('session_completed', id, 'System', '❌ Session Failed', err.message || 'Unknown error', speedMode, { error: true });
    });

    return session;
}

export function getSession(id: string): DemoSession | undefined {
    return sessions.get(id);
}

// ── Pipeline ────────────────────────────────────────────

async function runPipeline(session: DemoSession): Promise<void> {
    const { id, speedMode: sm } = session;
    const startTime = Date.now();

    // ────────── STEP 1: Session Started ──────────
    await emit('session_started', id, 'System', 'Demo Started',
        `Director request: "${session.userQuery}"`, sm);

    // ────────── STEP 2: Task Formulation ──────────
    await emit('task_formulated', id, "Director's AI", 'Formulating task...',
        'Analyzing director request and creating structured specification', sm);

    const { task, latencyMs: formulateMs } = await formulator.formulate(session.userQuery);
    session.structuredTask = task;
    session.apiCallsMade++;

    await emit('task_formulated', id, "Director's AI", 'Task Formulated',
        `Type: ${task.task_type} Target: ${task.target} Domain: ${task.domain} Deliverables: ${task.deliverables.join(', ')}`, sm,
        { latencyMs: formulateMs });

    // ────────── STEP 3: MCP Search ──────────
    await emit('mcp_search', id, 'Agora MCP', 'Searching agents...',
        `search_agents({ capability: "${task.task_type}" })`, sm);

    let agents = await searchAgents({ capability: task.task_type });

    // Broadened search fallback
    if (agents.length === 0) {
        agents = await searchAgents({ query: task.domain });
    }
    if (agents.length === 0) {
        agents = await getAllAgents();
    }

    await emit('mcp_search', id, 'Agora MCP', `Found ${agents.length} agents`,
        agents.map(a => `${a.name} [trust: ${a.trustScore.toFixed(3)}, calls: ${a.totalCalls}]`).join('\n'), sm);

    // ────────── STEP 4: Agent Selection ──────────
    await emit('agent_selected', id, 'Procurement AI', 'Evaluating agents...',
        'Analyzing capability match, trust scores, and pricing', sm);

    const { agentId, reasoning, latencyMs: selectMs } = await procurement.selectAgent(task, agents);
    session.apiCallsMade++;

    const agent = agents.find(a => a.id === agentId) || agents[0];
    if (!agent) {
        await emit('session_completed', id, 'System', '❌ No Agents Available',
            'No agents found on Agora marketplace matching this request.', sm, { error: true });
        return;
    }

    session.selectedAgentId = agent.id;
    session.agentName = agent.name;

    await emit('agent_selected', id, 'Procurement AI', `Selected: ${agent.name}`,
        reasoning, sm, { agent: { id: agent.id, name: agent.name, did: agent.did, trustScore: agent.trustScore, totalCalls: agent.totalCalls }, latencyMs: selectMs });

    // ────────── TRUST: Initialize LiveTrustTracker (all zeros) ──────────
    const trust = new LiveTrustTracker(id, agent.id, agent.name, agent.did, sm);

    // Trust Check 1: Identity verification
    const hasDid = !!agent.did && agent.did.startsWith('did:');
    await trust.checkIdentity(hasDid, hasDid); // ZK = true if DID exists for demo

    // Trust Check 2: Capability match
    await trust.checkCapability(
        task.task_type,
        task.domain,
        agent.capabilities,
        agent.description
    );

    // Trust Check 3: History from Supabase
    await trust.loadHistory();

    // ── REJECTION CHECK ──
    const matchBreakdown = trust.getBreakdown();
    const capComponent = matchBreakdown.components.find(c => c.component === 'capability_match');
    if (capComponent && capComponent.score < 0.1) {
        await emit('session_completed', id, 'Agora Trust Engine',
            '⛔ Operation Rejected — Insufficient Capability Match',
            `Agent "${agent.name}" capability match is ${(capComponent.score * 100).toFixed(0)}%, below minimum threshold of 10%. No suitable agents available for task type "${task.task_type}".`,
            sm, { error: true, rejected: true, trustBreakdown: matchBreakdown });
        return;
    }

    session.trustBefore = matchBreakdown;

    // ────────── STEP 5: Negotiation ──────────
    const negotiateStart = Date.now();

    await emit('negotiation', id, 'Account Manager', 'Reviewing task brief...',
        `Seller AI received task specification for ${task.task_type}`, sm);

    const { response: amResponse, questions, latencyMs: amMs } = await accountManager.negotiate(
        `Client needs: ${task.task_type} for ${task.target}. Deliverables: ${task.deliverables.join(', ')}`, task);
    session.apiCallsMade++;

    await emit('negotiation', id, 'Account Manager', 'Terms proposed',
        amResponse, sm, { latencyMs: amMs });

    // Buyer responds to questions
    const { answers, latencyMs: brMs } = await buyerResponse.respond(task, questions);
    session.apiCallsMade++;

    await emit('negotiation', id, 'Procurement AI', 'Clarifications provided',
        answers.map((a, i) => `${i + 1}. ${a}`).join('\n'), sm, { latencyMs: brMs });

    // Trust Check 4: Response time during negotiation
    const negotiateMs = Date.now() - negotiateStart;
    await trust.recordResponseTime(negotiateMs);

    // ────────── STEP 6: Work Execution ──────────
    await emit('work_started', id, agent.name, 'Starting work...',
        `Executing ${task.task_type} on ${task.target}`, sm);

    let rawReport = '';
    let apiCalls = 0;
    let dataPoints = 0;
    let expectedDataPoints = 10;
    let apiSuccesses = 0;
    const workStart = Date.now();

    const onApiCall = (api: string, detail: string) => {
        session.apiCallsMade++;
        apiCalls++;
        apiSuccesses++; // assuming success (failures would go to catch)
        emit('api_call', id, agent.name, `📡 ${api}`, detail, sm, { latencyMs: Date.now() - workStart });
    };

    try {
        if (agent.slug?.includes('codeguard') || agent.capabilities.includes('code_security_audit')) {
            const result = await codeguard.audit(task, onApiCall);
            rawReport = result.report;
            dataPoints = result.repoData ? Object.keys(result.repoData).length : 5;
            expectedDataPoints = 15;
            apiCalls = result.apiCalls;
            apiSuccesses = result.apiCalls;
            session.apiCallsMade++;
        } else if (agent.slug?.includes('marketscope') || agent.capabilities.includes('competitive_intelligence')) {
            const result = await marketscope.research(task, onApiCall);
            rawReport = result.report;
            dataPoints = result.npmData.length + result.hnData.length;
            expectedDataPoints = 15;
            apiCalls = result.apiCalls;
            apiSuccesses = result.apiCalls;
            session.apiCallsMade++;
        } else if (webpulse && (agent.slug?.includes('webpulse') || agent.capabilities.includes('website_performance_audit'))) {
            const result = await webpulse.audit(task, onApiCall);
            rawReport = result.report;
            dataPoints = (result.mobileData ? 10 : 0) + (result.desktopData ? 10 : 0) + (result.siteCheck ? 3 : 0);
            expectedDataPoints = 12;
            apiCalls = result.apiCalls;
            apiSuccesses = result.apiCalls;
            session.apiCallsMade++;
        } else {
            rawReport = `No specialist available for capability: ${task.task_type}`;
            dataPoints = 0;
        }
    } catch (err: any) {
        rawReport = `Execution error: ${err.message}`;
        apiSuccesses = Math.max(0, apiCalls - 1);
    }

    // Trust Check 5: Execution quality
    await trust.recordExecution(apiSuccesses, Math.max(1, apiCalls), dataPoints, expectedDataPoints);

    // ────────── STEP 7: Delivery ──────────
    await emit('work_completed', id, 'Delivery Manager', 'Formatting report...',
        'Packaging raw analysis into executive report format', sm);

    const { report: finalReport, latencyMs: deliveryMs } = await delivery.format(rawReport, task);
    session.apiCallsMade++;

    await emit('work_completed', id, 'Delivery Manager', '📋 Report Delivered',
        finalReport.slice(0, 500) + (finalReport.length > 500 ? '...' : ''), sm,
        { latencyMs: deliveryMs, fullReport: finalReport });

    // ────────── STEP 8: QA Review ──────────
    await emit('qa_review', id, 'QA Inspector', 'Reviewing deliverables...',
        'Running quality checks on the delivered report', sm);

    const { accepted, rating, summary: qaSummary, latencyMs: qaMs } = await qaInspector.validate(task, finalReport);
    session.apiCallsMade++;

    // Trust Check 6: Peer review
    await trust.recordPeerReview(rating);

    const issues = accepted ? [] : [qaSummary];
    await emit('qa_review', id, 'QA Inspector', `Quality Rating: ${rating}/5`,
        issues.length > 0 ? `Issues found:\n${issues.map((issue: string, i: number) => `${i + 1}. ${issue}`).join('\n')}` : 'All quality checks passed',
        sm, { rating, issues, latencyMs: qaMs });

    // ────────── STEP 9: Final Trust Summary ──────────
    const finalBreakdown = trust.getBreakdown();
    session.trustAfter = finalBreakdown;

    await emit('trust_updated', id, 'Agora Trust Engine', 'Trust Score Finalized',
        `${agent.name}: ${finalBreakdown.compositeScore.toFixed(3)} (${finalBreakdown.level})`,
        sm, { trustBreakdown: finalBreakdown });

    // ────────── STEP 10: Persist to Supabase ──────────
    const totalMs = Date.now() - startTime;
    session.totalLatencyMs = totalMs;
    session.result = finalReport;
    session.status = 'completed';
    session.completedAt = new Date().toISOString();

    // Write to Supabase (non-blocking)
    const cost = agent.pricePerCall || 0.05;
    const commission = Math.round(cost * 0.10 * 100) / 100;

    recordTransaction(agent.did, cost, commission, {
        sessionId: id,
        taskType: task.task_type,
        target: task.target,
        qaRating: rating,
        latencyMs: totalMs,
    }).catch(err => console.error('  ⚠️  Failed to record transaction:', err.message));

    updateAgentMetrics(agent.did, finalBreakdown.compositeScore, totalMs)
        .catch(err => console.error('  ⚠️  Failed to update agent metrics:', err.message));

    logUsage(agent.did, 'demo_execution', totalMs, { apiCalls, dataPoints })
        .catch(err => console.error('  ⚠️  Failed to log usage:', err.message));

    // ────────── STEP 11: Session Complete ──────────
    await emit('session_completed', id, 'System', '✅ Connection Complete',
        `Task completed successfully. Agent: ${agent.name}, Cost: $${cost.toFixed(2)}, Duration: ${(totalMs / 1000).toFixed(1)}s, Trust: ${finalBreakdown.compositeScore.toFixed(3)}`,
        sm, {
        totalLatencyMs: totalMs,
        apiCalls: session.apiCallsMade,
        trustScore: finalBreakdown.compositeScore,
        trustLevel: finalBreakdown.level,
        cost,
        commission,
        creatorEarned: Math.round((cost - commission) * 100) / 100,
    });
}
