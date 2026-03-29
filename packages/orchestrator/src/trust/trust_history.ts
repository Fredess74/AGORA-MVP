/* ═══════════════════════════════════════════════════════════
   Trust History — Append-only audit log for trust score changes
   
   ARCHITECTURE FIX (DEC-006):
   Instead of storing only the final composite score, we now log
   each individual component score per session. This enables:
   1. Audit trail (EU AI Act Art. 12 compliance)
   2. Per-component EWMA (mathematically correct)
   3. Trust score explanation ("why this score?")
   4. Analytics & calibration
   ═══════════════════════════════════════════════════════════ */

import { getDb } from '../db/supabase.js';
import type { TrustComponent, TrustComponentScore, TrustConfidenceTier } from '../types.js';

export interface TrustHistoryEntry {
    agent_did: string;
    session_id: string;
    component: TrustComponent;
    score: number;
    weight: number;
    confidence_tier: TrustConfidenceTier;
    composite_score: number;
}

/**
 * Log all trust component scores for a session (append-only).
 * This is the canonical audit trail for trust score changes.
 */
export async function logTrustHistory(
    agentDid: string,
    sessionId: string,
    components: TrustComponentScore[],
    compositeScore: number,
    confidenceTier: TrustConfidenceTier,
): Promise<void> {
    const db = getDb();
    if (!db) return;

    const entries: TrustHistoryEntry[] = components.map(c => ({
        agent_did: agentDid,
        session_id: sessionId,
        component: c.component,
        score: c.score,
        weight: c.weight,
        confidence_tier: confidenceTier,
        composite_score: compositeScore,
    }));

    const { error } = await db.from('trust_history').insert(entries);
    if (error) {
        // Non-fatal: log and continue (table may not exist yet)
        console.warn('  ⚠️  Failed to log trust history:', error.message);
    }
}

/**
 * Get per-component EWMA scores from historical data.
 * Returns the latest EWMA for each component based on all past sessions.
 * 
 * This replaces the old approach of running EWMA on composite score.
 * Mathematically correct: EWMA(component₁), EWMA(component₂), ...
 * Then composite = weighted_avg(EWMA(component₁), ...)
 */
export async function getPerComponentEWMA(
    agentDid: string,
): Promise<Map<TrustComponent, { ewma: number; count: number }>> {
    const db = getDb();
    const result = new Map<TrustComponent, { ewma: number; count: number }>();
    
    if (!db) return result;

    // Get all historical scores for this agent, ordered by time
    const { data, error } = await db
        .from('trust_history')
        .select('component, score, created_at')
        .eq('agent_did', agentDid)
        .order('created_at', { ascending: true });

    if (error || !data) return result;

    // Group by component
    const byComponent = new Map<string, number[]>();
    for (const row of data) {
        const scores = byComponent.get(row.component) || [];
        scores.push(row.score);
        byComponent.set(row.component, scores);
    }

    // Calculate EWMA for each component independently
    for (const [comp, scores] of byComponent.entries()) {
        const n = scores.length;
        const alpha = sigmoidAlpha(n);
        
        let ewma = scores[0]; // Initialize with first observation
        for (let i = 1; i < scores.length; i++) {
            ewma = alpha * scores[i] + (1 - alpha) * ewma;
        }
        
        result.set(comp as TrustComponent, { ewma, count: n });
    }

    return result;
}

/**
 * Sigmoid α function — smooth transition from responsive to stable.
 * α(N) = 0.12 + 0.58 / (1 + e^(0.08 × (N - 30)))
 * 
 * - New agents (N≈1): α ≈ 0.70 (responsive to new data)
 * - Established (N≈30): α ≈ 0.41 (balanced)
 * - Veterans (N≈100+): α ≈ 0.12 (stable, hard to move)
 */
export function sigmoidAlpha(n: number): number {
    const ALPHA_MIN = 0.12;
    const ALPHA_MAX = 0.70;
    const SLOPE = 0.08;
    const MIDPOINT = 30;
    return ALPHA_MIN + (ALPHA_MAX - ALPHA_MIN) / (1 + Math.exp(SLOPE * (n - MIDPOINT)));
}
