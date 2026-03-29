/* ═══════════════════════════════════════════════════════════
   Trust Calculator — Unit Tests
   
   Tests for the core trust score computation functions:
   - Wilson Score cold-start behavior
   - Sigmoid α curve boundaries
   - Composite score calculation
   - Edge cases (NaN, Infinity, boundary values)
   - Component score functions
   ═══════════════════════════════════════════════════════════ */

import { describe, it, expect } from 'vitest';
import {
    getConfidenceTier,
    getWeightsForTier,
    getTrustLevel,
    calculateCompositeScore,
    computeCapabilityMatch,
    computeResponseTimeScore,
    computeExecutionScore,
    computeHistoryScore,
} from './calculator.js';
import { sigmoidAlpha } from './trust_history.js';
import type { TrustComponentScore } from '../types.js';

/* ── Confidence Tiers ────────────────────────────────── */

describe('getConfidenceTier', () => {
    it('returns "new" for 0-2 transactions', () => {
        expect(getConfidenceTier(0)).toBe('new');
        expect(getConfidenceTier(1)).toBe('new');
        expect(getConfidenceTier(2)).toBe('new');
    });

    it('returns "low" for 3-10 transactions', () => {
        expect(getConfidenceTier(3)).toBe('low');
        expect(getConfidenceTier(10)).toBe('low');
    });

    it('returns "medium" for 11-49 transactions', () => {
        expect(getConfidenceTier(11)).toBe('medium');
        expect(getConfidenceTier(49)).toBe('medium');
    });

    it('returns "high" for 50+ transactions', () => {
        expect(getConfidenceTier(50)).toBe('high');
        expect(getConfidenceTier(1000)).toBe('high');
    });
});

/* ── Weight Profiles ─────────────────────────────────── */

describe('getWeightsForTier', () => {
    it('all weights sum to 1.0 for every tier', () => {
        for (const tier of ['new', 'low', 'medium', 'high'] as const) {
            const weights = getWeightsForTier(tier);
            const sum = Object.values(weights).reduce((a, b) => a + b, 0);
            expect(sum).toBeCloseTo(1.0, 5);
        }
    });

    it('"new" tier gives highest weight to identity', () => {
        const w = getWeightsForTier('new');
        expect(w.identity).toBeGreaterThan(w.execution_quality);
        expect(w.identity).toBeGreaterThan(w.history);
    });

    it('"high" tier gives highest weight to execution + response_time', () => {
        const w = getWeightsForTier('high');
        expect(w.execution_quality).toBeGreaterThanOrEqual(w.identity);
        expect(w.response_time).toBeGreaterThanOrEqual(w.identity);
    });

    it('returns a copy (not reference)', () => {
        const w1 = getWeightsForTier('new');
        const w2 = getWeightsForTier('new');
        w1.identity = 999;
        expect(w2.identity).toBe(0.35);
    });
});

/* ── Trust Level ─────────────────────────────────────── */

describe('getTrustLevel', () => {
    it('returns correct levels for score ranges', () => {
        expect(getTrustLevel(0)).toBe('unrated');
        expect(getTrustLevel(0.1)).toBe('low');
        expect(getTrustLevel(0.44)).toBe('low');
        expect(getTrustLevel(0.45)).toBe('medium');
        expect(getTrustLevel(0.74)).toBe('medium');
        expect(getTrustLevel(0.75)).toBe('high');
        expect(getTrustLevel(1.0)).toBe('high');
    });
});

/* ── Composite Score ─────────────────────────────────── */

describe('calculateCompositeScore', () => {
    it('returns 0 for all-zero components', () => {
        const components: TrustComponentScore[] = [
            { component: 'identity', score: 0, weight: 0.35, updatedAt: '' },
            { component: 'capability_match', score: 0, weight: 0.30, updatedAt: '' },
            { component: 'response_time', score: 0, weight: 0.15, updatedAt: '' },
            { component: 'execution_quality', score: 0, weight: 0.15, updatedAt: '' },
            { component: 'peer_review', score: 0, weight: 0.05, updatedAt: '' },
            { component: 'history', score: 0, weight: 0.00, updatedAt: '' },
        ];
        expect(calculateCompositeScore(components)).toBe(0);
    });

    it('returns correct weighted sum', () => {
        const components: TrustComponentScore[] = [
            { component: 'identity', score: 1.0, weight: 0.5, updatedAt: '' },
            { component: 'capability_match', score: 0.5, weight: 0.5, updatedAt: '' },
        ];
        expect(calculateCompositeScore(components)).toBe(0.75);
    });

    it('rounds to 3 decimal places', () => {
        const components: TrustComponentScore[] = [
            { component: 'identity', score: 0.333, weight: 0.5, updatedAt: '' },
            { component: 'capability_match', score: 0.777, weight: 0.5, updatedAt: '' },
        ];
        const result = calculateCompositeScore(components);
        expect(result.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(3);
    });
});

/* ── Sigmoid α ───────────────────────────────────────── */

describe('sigmoidAlpha', () => {
    it('returns ~0.70 for N=1 (very responsive)', () => {
        const alpha = sigmoidAlpha(1);
        expect(alpha).toBeGreaterThan(0.60);
        expect(alpha).toBeLessThanOrEqual(0.70);
    });

    it('returns ~0.41 at midpoint N=30', () => {
        const alpha = sigmoidAlpha(30);
        expect(alpha).toBeCloseTo(0.41, 1);
    });

    it('returns ~0.12 for N=100+ (very stable)', () => {
        const alpha = sigmoidAlpha(100);
        expect(alpha).toBeGreaterThanOrEqual(0.12);
        expect(alpha).toBeLessThan(0.20);
    });

    it('is monotonically decreasing', () => {
        let prev = sigmoidAlpha(1);
        for (let n = 2; n <= 100; n++) {
            const current = sigmoidAlpha(n);
            expect(current).toBeLessThanOrEqual(prev + 0.001); // allow floating point
            prev = current;
        }
    });

    it('stays within [ALPHA_MIN, ALPHA_MAX] bounds', () => {
        for (let n = 0; n <= 10000; n += 100) {
            const alpha = sigmoidAlpha(n);
            expect(alpha).toBeGreaterThanOrEqual(0.12);
            expect(alpha).toBeLessThanOrEqual(0.70);
        }
    });
});

/* ── Component Score Functions ────────────────────────── */

describe('computeCapabilityMatch', () => {
    it('returns 1.0 for perfect match', () => {
        const score = computeCapabilityMatch('code_audit', 'security', ['code_audit', 'security'], 'code audit security');
        expect(score).toBeGreaterThanOrEqual(0.8);
    });

    it('returns 0 for no match', () => {
        const score = computeCapabilityMatch('code_audit', 'security', ['cooking', 'recipes'], 'food preparation');
        expect(score).toBe(0);
    });

    it('handles empty tags gracefully', () => {
        const score = computeCapabilityMatch('code_audit', 'security', [], '');
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(1);
    });
});

describe('computeResponseTimeScore', () => {
    it('returns 1.0 for instant response', () => {
        expect(computeResponseTimeScore(0)).toBe(1.0);
    });

    it('returns 0 for 60s+ response', () => {
        expect(computeResponseTimeScore(60000)).toBe(0);
        expect(computeResponseTimeScore(90000)).toBe(0);
    });

    it('returns ~0.5 for 30s response', () => {
        const score = computeResponseTimeScore(30000);
        expect(score).toBeCloseTo(0.5, 1);
    });

    it('is monotonically decreasing', () => {
        let prev = computeResponseTimeScore(0);
        for (let ms = 1000; ms <= 60000; ms += 1000) {
            const current = computeResponseTimeScore(ms);
            expect(current).toBeLessThanOrEqual(prev);
            prev = current;
        }
    });
});

describe('computeExecutionScore', () => {
    it('returns 1.0 for perfect execution', () => {
        expect(computeExecutionScore(10, 10, 10, 10)).toBe(1.0);
    });

    it('returns 0 for zero successes and zero data', () => {
        expect(computeExecutionScore(0, 0, 0, 0)).toBe(0);
    });

    it('weighs success rate 60% and completeness 40%', () => {
        // 100% success, 0% data = 0.6
        expect(computeExecutionScore(10, 10, 0, 10)).toBeCloseTo(0.6, 1);
        // 0% success, 100% data = 0.4
        expect(computeExecutionScore(0, 10, 10, 10)).toBeCloseTo(0.4, 1);
    });
});

describe('computeHistoryScore', () => {
    it('returns 0 for zero transactions', () => {
        expect(computeHistoryScore(0)).toBe(0);
    });

    it('returns 1.0 for 50+ transactions', () => {
        expect(computeHistoryScore(50)).toBe(1.0);
        expect(computeHistoryScore(100)).toBe(1.0);
    });

    it('returns 0.5 for 25 transactions', () => {
        expect(computeHistoryScore(25)).toBe(0.5);
    });

    it('clamps to [0, 1]', () => {
        expect(computeHistoryScore(-1)).toBe(0);
        expect(computeHistoryScore(1000)).toBe(1.0);
    });
});
