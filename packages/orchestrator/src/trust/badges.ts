/* ═══════════════════════════════════════════════════════════
   Trust Badge Computation
   
   Computes visual badges for agents based on their trust data.
   Badges are visual indicators, not scores — they communicate
   trust status in a human-readable way.
   
   Badge Types:
   - VERIFIED      — Identity confirmed, DID assigned
   - RISING_STAR   — New agent with positive trajectory
   - TOP_RATED     — Veteran with excellent track record
   - ENTERPRISE    — Meets enterprise SLA requirements
   - UNDER_REVIEW  — Recent penalty or dispute
   - NEW           — Recently registered, building history
   ═══════════════════════════════════════════════════════════ */

/**
 * Trust badge types with display metadata
 */
export type BadgeType = 'VERIFIED' | 'RISING_STAR' | 'TOP_RATED' | 'ENTERPRISE' | 'UNDER_REVIEW' | 'NEW';

export interface TrustBadge {
    type: BadgeType;
    label: string;
    emoji: string;
    color: string;
    description: string;
}

/**
 * Badge definitions — visual and semantic metadata
 */
const BADGE_DEFINITIONS: Record<BadgeType, Omit<TrustBadge, 'type'>> = {
    VERIFIED: {
        label: 'Verified',
        emoji: '🟢',
        color: '#22c55e', // green-500
        description: 'Identity confirmed with DID and valid endpoint',
    },
    RISING_STAR: {
        label: 'Rising Star',
        emoji: '⭐',
        color: '#f59e0b', // amber-500
        description: 'New agent with strong performance trajectory',
    },
    TOP_RATED: {
        label: 'Top Rated',
        emoji: '🏆',
        color: '#eab308', // yellow-500
        description: 'Veteran agent with excellent track record',
    },
    ENTERPRISE: {
        label: 'Enterprise Ready',
        emoji: '🛡️',
        color: '#3b82f6', // blue-500
        description: 'Meets enterprise reliability and SLA requirements',
    },
    UNDER_REVIEW: {
        label: 'Under Review',
        emoji: '🔴',
        color: '#ef4444', // red-500
        description: 'Recent penalty or dispute under investigation',
    },
    NEW: {
        label: 'New',
        emoji: '🆕',
        color: '#6b7280', // gray-500
        description: 'Recently registered, building history',
    },
};

/**
 * Agent data needed for badge computation.
 * These fields map to the `listings` table in Supabase.
 */
export interface BadgeInput {
    trustScore: number;           // 0.0-1.0, from listings.trust_score
    totalCalls: number;           // from listings.total_calls
    uptime: number;               // 0-100 (percentage), from listings.uptime
    avgLatencyMs: number;         // from listings.avg_latency_ms
    hasDid: boolean;              // listings.did is not null
    hasEndpoint: boolean;         // listings.endpoint_url is not null
    hasGithubRepo: boolean;       // listings.github_repo is not null
    daysActive: number;           // days since listings.created_at
    recentPenalty: boolean;       // from trust_history (if available)
    errorRate: number;            // 0.0-1.0, from transaction failure rate
}

/**
 * Compute all applicable badges for an agent.
 * An agent can have MULTIPLE badges simultaneously.
 * 
 * @param input Agent data for badge evaluation
 * @returns Array of earned badges, ordered by priority
 * 
 * @example
 * ```typescript
 * const badges = computeBadges({
 *   trustScore: 0.92, totalCalls: 1500, uptime: 99.8,
 *   avgLatencyMs: 450, hasDid: true, hasEndpoint: true,
 *   hasGithubRepo: true, daysActive: 180,
 *   recentPenalty: false, errorRate: 0.005
 * });
 * // badges = [TOP_RATED, VERIFIED, ENTERPRISE]
 * ```
 */
export function computeBadges(input: BadgeInput): TrustBadge[] {
    const badges: TrustBadge[] = [];

    // Priority 1: UNDER_REVIEW (overrides positive badges in display)
    if (input.recentPenalty) {
        badges.push({ type: 'UNDER_REVIEW', ...BADGE_DEFINITIONS.UNDER_REVIEW });
    }

    // Priority 2: TOP_RATED
    if (
        input.trustScore >= 0.85 &&
        input.totalCalls >= 100 &&
        input.errorRate < 0.01
    ) {
        badges.push({ type: 'TOP_RATED', ...BADGE_DEFINITIONS.TOP_RATED });
    }

    // Priority 3: ENTERPRISE
    if (
        input.trustScore >= 0.90 &&
        input.totalCalls >= 500 &&
        input.uptime >= 99.5 &&
        input.avgLatencyMs <= 1000 &&
        input.errorRate < 0.005
    ) {
        badges.push({ type: 'ENTERPRISE', ...BADGE_DEFINITIONS.ENTERPRISE });
    }

    // Priority 4: VERIFIED
    if (
        input.hasDid &&
        input.hasEndpoint &&
        (input.hasGithubRepo || input.trustScore >= 0.7)
    ) {
        badges.push({ type: 'VERIFIED', ...BADGE_DEFINITIONS.VERIFIED });
    }

    // Priority 5: RISING_STAR
    if (
        input.trustScore >= 0.60 &&
        input.totalCalls < 30 &&
        input.totalCalls >= 3 &&
        input.errorRate < 0.05 &&
        !input.recentPenalty
    ) {
        badges.push({ type: 'RISING_STAR', ...BADGE_DEFINITIONS.RISING_STAR });
    }

    // Priority 6: NEW (fallback for agents with no other badges)
    if (badges.length === 0 && input.totalCalls < 5) {
        badges.push({ type: 'NEW', ...BADGE_DEFINITIONS.NEW });
    }

    return badges;
}

/**
 * Get the primary (most important) badge for an agent.
 * Used when only one badge can be displayed (e.g., search results).
 */
export function getPrimaryBadge(input: BadgeInput): TrustBadge | null {
    const badges = computeBadges(input);
    return badges.length > 0 ? badges[0] : null;
}

/**
 * Check if an agent qualifies for a specific badge.
 */
export function hasBadge(input: BadgeInput, badgeType: BadgeType): boolean {
    return computeBadges(input).some(b => b.type === badgeType);
}
