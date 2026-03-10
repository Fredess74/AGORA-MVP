/* ═══════════════════════════════════════════════════════════
   Trust Calculator — 6-Component Trust Score
   ═══════════════════════════════════════════════════════════ */

import type { TrustBreakdown, TrustComponent, TrustComponentScore } from '../types.js';

/** Trust component weights from 02_TRUST_AND_CONNECTIONS.md (sum = 1.0) */
const WEIGHTS: Record<TrustComponent, number> = {
    code_quality: 0.20,
    repo_health: 0.15,
    uptime: 0.25,
    transaction_success: 0.25,
    user_reviews: 0.10,
    account_age: 0.05,
};

/** Initial trust scores for seed agents — deliberately LOW (cold start per docs: 0.35-0.50) */
export const SEED_TRUST: Record<string, TrustComponentScore[]> = {
    'codeguard-001': [
        { component: 'code_quality', score: 0.62, weight: WEIGHTS.code_quality, updatedAt: new Date().toISOString() },
        { component: 'repo_health', score: 0.55, weight: WEIGHTS.repo_health, updatedAt: new Date().toISOString() },
        { component: 'uptime', score: 0.48, weight: WEIGHTS.uptime, updatedAt: new Date().toISOString() },
        { component: 'transaction_success', score: 0.35, weight: WEIGHTS.transaction_success, updatedAt: new Date().toISOString() },
        { component: 'user_reviews', score: 0.40, weight: WEIGHTS.user_reviews, updatedAt: new Date().toISOString() },
        { component: 'account_age', score: 0.08, weight: WEIGHTS.account_age, updatedAt: new Date().toISOString() },
    ],
    'marketscope-001': [
        { component: 'code_quality', score: 0.58, weight: WEIGHTS.code_quality, updatedAt: new Date().toISOString() },
        { component: 'repo_health', score: 0.50, weight: WEIGHTS.repo_health, updatedAt: new Date().toISOString() },
        { component: 'uptime', score: 0.45, weight: WEIGHTS.uptime, updatedAt: new Date().toISOString() },
        { component: 'transaction_success', score: 0.32, weight: WEIGHTS.transaction_success, updatedAt: new Date().toISOString() },
        { component: 'user_reviews', score: 0.38, weight: WEIGHTS.user_reviews, updatedAt: new Date().toISOString() },
        { component: 'account_age', score: 0.06, weight: WEIGHTS.account_age, updatedAt: new Date().toISOString() },
    ],
    'webpulse-001': [
        { component: 'code_quality', score: 0.60, weight: WEIGHTS.code_quality, updatedAt: new Date().toISOString() },
        { component: 'repo_health', score: 0.52, weight: WEIGHTS.repo_health, updatedAt: new Date().toISOString() },
        { component: 'uptime', score: 0.46, weight: WEIGHTS.uptime, updatedAt: new Date().toISOString() },
        { component: 'transaction_success', score: 0.33, weight: WEIGHTS.transaction_success, updatedAt: new Date().toISOString() },
        { component: 'user_reviews', score: 0.35, weight: WEIGHTS.user_reviews, updatedAt: new Date().toISOString() },
        { component: 'account_age', score: 0.05, weight: WEIGHTS.account_age, updatedAt: new Date().toISOString() },
    ],
};

/** Calculate composite trust score from components */
export function calculateCompositeScore(components: TrustComponentScore[]): number {
    let score = 0;
    for (const c of components) {
        score += c.score * c.weight;
    }
    return Math.round(score * 1000) / 1000;
}

/** Get trust level from score */
export function getTrustLevel(score: number): 'high' | 'medium' | 'low' | 'unrated' {
    if (score >= 0.8) return 'high';
    if (score >= 0.5) return 'medium';
    if (score > 0) return 'low';
    return 'unrated';
}

/** Get full trust breakdown for an agent */
export function getTrustBreakdown(agentId: string, agentName: string): TrustBreakdown {
    const components = SEED_TRUST[agentId] || [];
    const compositeScore = calculateCompositeScore(components);
    return {
        agentId,
        agentName,
        components: [...components],
        compositeScore,
        level: getTrustLevel(compositeScore),
    };
}

/** Update a trust component after a transaction */
export function updateTrustAfterTransaction(
    agentId: string,
    success: boolean,
    latencyMs: number,
    qualityRating: number // 1-5
): TrustBreakdown | null {
    const components = SEED_TRUST[agentId];
    if (!components) return null;

    const now = new Date().toISOString();

    // Update transaction_success
    const txComp = components.find(c => c.component === 'transaction_success')!;
    if (success) {
        txComp.score = Math.min(1, txComp.score + 0.008);
    } else {
        txComp.score = Math.max(0, txComp.score - 0.05);
    }
    txComp.updatedAt = now;

    // Update uptime based on latency (under 30s is good)
    const uptimeComp = components.find(c => c.component === 'uptime')!;
    if (latencyMs < 30000) {
        uptimeComp.score = Math.min(1, uptimeComp.score + 0.002);
    } else {
        uptimeComp.score = Math.max(0, uptimeComp.score - 0.01);
    }
    uptimeComp.updatedAt = now;

    // Update user_reviews based on quality rating
    const reviewComp = components.find(c => c.component === 'user_reviews')!;
    const ratingNorm = (qualityRating - 1) / 4; // 1-5 → 0-1
    reviewComp.score = reviewComp.score * 0.9 + ratingNorm * 0.1; // EMA
    reviewComp.updatedAt = now;

    return getTrustBreakdown(agentId, '');
}
