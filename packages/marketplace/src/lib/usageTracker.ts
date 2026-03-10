/* ═══════════════════════════════════════════════════════════
   Usage Tracker — Real stats from localStorage
   
   Tracks every agent call, computes trust scores,
   manages pricing tiers, and stores user reviews.
   ═══════════════════════════════════════════════════════════ */

// ── Types ────────────────────────────────────────────────

export interface CallRecord {
    timestamp: string;
    latencyMs: number;
    success: boolean;
    query: string;
}

export interface Review {
    id: string;
    author: string;
    rating: number; // 1-5
    comment: string;
    timestamp: string;
}

export type PricingPlan = 'free' | 'per_call' | 'subscription';

export interface UserPlan {
    plan: PricingPlan;
    activatedAt: string;
    callsUsed: number;
}

export interface AgentStats {
    totalCalls: number;
    successfulCalls: number;
    failedCalls: number;
    avgLatencyMs: number;
    successRate: number;
    trustScore: number;     // 0.0 - 1.0
    trustLevel: 'high' | 'medium' | 'low' | 'unrated';
    uptime: number;         // percentage
    uniqueQueries: number;
    rating: number;         // 1-5
    reviewCount: number;
    totalSpentUsd: number;
}

// ── Constants ────────────────────────────────────────────

const STORAGE_PREFIX = 'agora_';
const FREE_TIER_LIMIT = 10;
const PRICE_PER_CALL = 0.01;
const SUBSCRIPTION_PRICE = 29;

function key(suffix: string): string {
    return `${STORAGE_PREFIX}${suffix}`;
}

// ── Call Tracking ────────────────────────────────────────

export function trackCall(agentId: string, latencyMs: number, success: boolean, query: string): void {
    const calls = getCalls(agentId);
    calls.push({
        timestamp: new Date().toISOString(),
        latencyMs,
        success,
        query,
    });
    localStorage.setItem(key(`calls_${agentId}`), JSON.stringify(calls));
}

export function getCalls(agentId: string): CallRecord[] {
    try {
        return JSON.parse(localStorage.getItem(key(`calls_${agentId}`)) || '[]');
    } catch {
        return [];
    }
}

// ── Stats Computation ────────────────────────────────────

export function getStats(agentId: string): AgentStats {
    const calls = getCalls(agentId);
    const reviews = getReviews(agentId);

    if (calls.length === 0) {
        return {
            totalCalls: 0,
            successfulCalls: 0,
            failedCalls: 0,
            avgLatencyMs: 0,
            successRate: 0,
            trustScore: 0,
            trustLevel: 'unrated',
            uptime: 0,
            uniqueQueries: 0,
            rating: 0,
            reviewCount: 0,
            totalSpentUsd: 0,
        };
    }

    const successful = calls.filter(c => c.success);
    const successRate = successful.length / calls.length;
    const avgLatency = calls.reduce((sum, c) => sum + c.latencyMs, 0) / calls.length;
    const uniqueQueries = new Set(calls.map(c => c.query.toLowerCase())).size;

    // Local trust estimate (simplified — canonical formula is in orchestrator/trust/calculator.ts)
    // This is a client-side approximation for display when Supabase data isn't available
    // Real trust uses 6-component EWMA via the orchestrator pipeline
    const speedFactor = Math.max(0, 1 - (avgLatency / 15000)); // 15s = 0, 0s = 1
    const trustScore = Math.min(1, 0.5 + (0.35 * successRate) + (0.15 * speedFactor));

    const trustLevel: AgentStats['trustLevel'] =
        calls.length < 3 ? 'unrated' :
            trustScore >= 0.8 ? 'high' :
                trustScore >= 0.5 ? 'medium' : 'low';

    const uptime = successRate * 100;

    // Rating from reviews
    const rating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    // Cost tracking
    const plan = getUserPlan(agentId);
    const totalSpent = plan.plan === 'subscription'
        ? SUBSCRIPTION_PRICE
        : plan.plan === 'per_call'
            ? Math.max(0, calls.length - FREE_TIER_LIMIT) * PRICE_PER_CALL
            : 0;

    return {
        totalCalls: calls.length,
        successfulCalls: successful.length,
        failedCalls: calls.length - successful.length,
        avgLatencyMs: Math.round(avgLatency),
        successRate,
        trustScore: Math.round(trustScore * 100) / 100,
        trustLevel,
        uptime: Math.round(uptime * 10) / 10,
        uniqueQueries,
        rating: Math.round(rating * 10) / 10,
        reviewCount: reviews.length,
        totalSpentUsd: Math.round(totalSpent * 100) / 100,
    };
}

export function computeTrustScore(agentId: string): number {
    return getStats(agentId).trustScore;
}

// ── Plan Management ──────────────────────────────────────

export function getUserPlan(agentId: string): UserPlan {
    try {
        const stored = localStorage.getItem(key(`plan_${agentId}`));
        if (stored) return JSON.parse(stored);
    } catch { /* fallthrough */ }

    return {
        plan: 'free',
        activatedAt: new Date().toISOString(),
        callsUsed: getCalls(agentId).length,
    };
}

export function setUserPlan(agentId: string, plan: PricingPlan): void {
    const planData: UserPlan = {
        plan,
        activatedAt: new Date().toISOString(),
        callsUsed: getCalls(agentId).length,
    };
    localStorage.setItem(key(`plan_${agentId}`), JSON.stringify(planData));
}

export function canMakeCall(agentId: string): { allowed: boolean; reason?: string; callsRemaining?: number } {
    const plan = getUserPlan(agentId);
    const calls = getCalls(agentId);

    if (plan.plan === 'subscription') {
        return { allowed: true };
    }

    if (plan.plan === 'per_call') {
        return { allowed: true }; // always allowed, just costs money
    }

    // Free tier
    if (calls.length >= FREE_TIER_LIMIT) {
        return {
            allowed: false,
            reason: `Free tier limit reached (${FREE_TIER_LIMIT} calls). Upgrade to continue.`,
            callsRemaining: 0,
        };
    }

    return {
        allowed: true,
        callsRemaining: FREE_TIER_LIMIT - calls.length,
    };
}

// ── Reviews ──────────────────────────────────────────────

export function getReviews(agentId: string): Review[] {
    try {
        return JSON.parse(localStorage.getItem(key(`reviews_${agentId}`)) || '[]');
    } catch {
        return [];
    }
}

export function addReview(agentId: string, rating: number, comment: string, author?: string): Review {
    const reviews = getReviews(agentId);
    const review: Review = {
        id: `rev_${Date.now()}`,
        author: author || 'Anonymous User',
        rating: Math.max(1, Math.min(5, Math.round(rating))),
        comment,
        timestamp: new Date().toISOString(),
    };
    reviews.push(review);
    localStorage.setItem(key(`reviews_${agentId}`), JSON.stringify(reviews));
    return review;
}

// ── Export Constants ──────────────────────────────────────

export const PRICING = {
    FREE_TIER_LIMIT,
    PRICE_PER_CALL,
    SUBSCRIPTION_PRICE,
} as const;
