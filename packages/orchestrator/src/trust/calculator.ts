/* ═══════════════════════════════════════════════════════════
   Trust Calculator — LIVE 6-Component Trust Score
   
   ALL agents start at 0.000. Trust is EARNED during each
   transaction through measurable signals:
   
   1. Identity (20%)      — DID present + ZK verifiable
   2. Capability (15%)    — keyword match between task & agent
   3. Response Time (25%) — actual latency during negotiation
   4. Execution (25%)     — API success rate × data completeness
   5. Peer Review (10%)   — QA Inspector rating / 5
   6. History (5%)        — past transaction count from Supabase
   ═══════════════════════════════════════════════════════════ */

import type { TrustBreakdown, TrustComponent, TrustComponentScore } from '../types.js';
import { emit } from '../session/sse.js';
import { getAgentTransactionCount } from '../db/supabase.js';
import type { SpeedMode } from '../types.js';

/** Trust component weights (sum = 1.0) */
const WEIGHTS: Record<TrustComponent, number> = {
    identity: 0.20,
    capability_match: 0.15,
    response_time: 0.25,
    execution_quality: 0.25,
    peer_review: 0.10,
    history: 0.05,
};

/** Get trust level from score */
export function getTrustLevel(score: number): 'high' | 'medium' | 'low' | 'unrated' {
    if (score >= 0.75) return 'high';
    if (score >= 0.45) return 'medium';
    if (score > 0) return 'low';
    return 'unrated';
}

/** Calculate composite trust score from components */
export function calculateCompositeScore(components: TrustComponentScore[]): number {
    let score = 0;
    for (const c of components) {
        score += c.score * c.weight;
    }
    return Math.round(score * 1000) / 1000;
}

/** Capability match: keyword overlap between task requirements and agent capabilities */
export function computeCapabilityMatch(taskType: string, taskDomain: string, agentTags: string[], agentDescription: string): number {
    const taskWords = `${taskType} ${taskDomain}`.toLowerCase().replace(/_/g, ' ').split(/\s+/);
    const agentWords = [...agentTags, ...agentDescription.toLowerCase().split(/\s+/)];

    let matches = 0;
    for (const tw of taskWords) {
        if (tw.length < 3) continue;
        if (agentWords.some(aw => aw.includes(tw) || tw.includes(aw))) {
            matches++;
        }
    }

    const matchScore = Math.min(1.0, matches / Math.max(taskWords.filter(w => w.length >= 3).length, 1));
    return Math.round(matchScore * 1000) / 1000;
}

/** Response time score: decay function, 0-10s = excellent, >60s = poor */
export function computeResponseTimeScore(latencyMs: number): number {
    const maxAcceptable = 60000; // 60 seconds
    const score = Math.max(0, 1.0 - (latencyMs / maxAcceptable));
    return Math.round(score * 1000) / 1000;
}

/** Execution quality: API success rate × data completeness */
export function computeExecutionScore(apiSuccesses: number, apiTotal: number, dataPoints: number, expectedDataPoints: number): number {
    const successRate = apiTotal > 0 ? apiSuccesses / apiTotal : 0;
    const completeness = expectedDataPoints > 0 ? Math.min(1, dataPoints / expectedDataPoints) : 0;
    const score = successRate * 0.6 + completeness * 0.4;
    return Math.round(score * 1000) / 1000;
}

/** History score from Supabase: min(1, pastTransactions / 10) */
export function computeHistoryScore(transactionCount: number): number {
    return Math.round(Math.min(1.0, transactionCount / 10) * 1000) / 1000;
}

/**
 * LiveTrustTracker — tracks trust score as it builds from 0 during a session
 * Emits SSE events on each component update so the UI shows real-time growth
 */
export class LiveTrustTracker {
    private sessionId: string;
    private agentId: string;
    private agentName: string;
    private agentDid: string;
    private speedMode: SpeedMode;
    private components: Map<TrustComponent, TrustComponentScore>;

    constructor(sessionId: string, agentId: string, agentName: string, agentDid: string, speedMode: SpeedMode) {
        this.sessionId = sessionId;
        this.agentId = agentId;
        this.agentName = agentName;
        this.agentDid = agentDid;
        this.speedMode = speedMode;

        // Initialize ALL components to 0
        this.components = new Map();
        const now = new Date().toISOString();
        for (const [comp, weight] of Object.entries(WEIGHTS)) {
            this.components.set(comp as TrustComponent, {
                component: comp as TrustComponent,
                score: 0,
                weight,
                updatedAt: now,
            });
        }
    }

    /** Update a single component and emit SSE event */
    async updateComponent(component: TrustComponent, score: number, reason: string): Promise<void> {
        const entry = this.components.get(component)!;
        entry.score = Math.round(Math.max(0, Math.min(1, score)) * 1000) / 1000;
        entry.updatedAt = new Date().toISOString();

        const composite = this.getCompositeScore();

        await emit('trust_component_update', this.sessionId, 'Agora Trust Engine',
            `${componentLabel(component)}: ${entry.score.toFixed(3)}`,
            reason,
            this.speedMode,
            {
                component,
                score: entry.score,
                weight: entry.weight,
                compositeScore: composite,
                level: getTrustLevel(composite),
                allComponents: this.getComponentsArray(),
            }
        );
    }

    /** Set identity score based on DID/ZK verification */
    async checkIdentity(hasDid: boolean, zkVerifiable: boolean): Promise<void> {
        let score = 0;
        if (hasDid) score = 0.6;
        if (hasDid && zkVerifiable) score = 1.0;
        await this.updateComponent('identity', score,
            hasDid ? (zkVerifiable ? 'DID verified + ZK-proof confirmed' : 'DID verified, no ZK proof') : 'No DID registered');
    }

    /** Set capability match score */
    async checkCapability(taskType: string, taskDomain: string, agentTags: string[], agentDescription: string): Promise<void> {
        const score = computeCapabilityMatch(taskType, taskDomain, agentTags, agentDescription);
        await this.updateComponent('capability_match', score,
            `Match: ${(score * 100).toFixed(0)}% — task "${taskType}" vs agent capabilities`);
    }

    /** Update response time score */
    async recordResponseTime(latencyMs: number): Promise<void> {
        const score = computeResponseTimeScore(latencyMs);
        await this.updateComponent('response_time', score,
            `Response in ${(latencyMs / 1000).toFixed(1)}s — ${score >= 0.7 ? 'fast' : score >= 0.4 ? 'acceptable' : 'slow'}`);
    }

    /** Update execution quality score */
    async recordExecution(apiSuccesses: number, apiTotal: number, dataPoints: number, expectedDataPoints: number): Promise<void> {
        const score = computeExecutionScore(apiSuccesses, apiTotal, dataPoints, expectedDataPoints);
        await this.updateComponent('execution_quality', score,
            `${apiSuccesses}/${apiTotal} API calls succeeded, ${dataPoints}/${expectedDataPoints} data points collected`);
    }

    /** Update peer review score from QA */
    async recordPeerReview(rating: number): Promise<void> {
        const score = Math.round(((rating - 1) / 4) * 1000) / 1000; // 1-5 → 0-1
        await this.updateComponent('peer_review', score,
            `QA Inspector rated ${rating}/5 — ${rating >= 4 ? 'high quality' : rating >= 3 ? 'acceptable' : 'needs improvement'}`);
    }

    /** Load history from Supabase */
    async loadHistory(): Promise<void> {
        const count = await getAgentTransactionCount(this.agentDid);
        const score = computeHistoryScore(count);
        await this.updateComponent('history', score,
            count > 0 ? `${count} past transactions on Agora` : 'New agent — no transaction history');
    }

    /** Get current composite score */
    getCompositeScore(): number {
        return calculateCompositeScore(this.getComponentsArray());
    }

    /** Get breakdown */
    getBreakdown(): TrustBreakdown {
        const composite = this.getCompositeScore();
        return {
            agentId: this.agentId,
            agentName: this.agentName,
            components: this.getComponentsArray(),
            compositeScore: composite,
            level: getTrustLevel(composite),
        };
    }

    private getComponentsArray(): TrustComponentScore[] {
        return [...this.components.values()];
    }
}

// ── Helpers ─────────────────────────────────────────────

function componentLabel(c: string): string {
    const labels: Record<string, string> = {
        identity: '🔐 Identity',
        capability_match: '🎯 Capability',
        response_time: '⚡ Response Time',
        execution_quality: '📊 Execution',
        peer_review: '⭐ Peer Review',
        history: '📜 History',
    };
    return labels[c] || c;
}
