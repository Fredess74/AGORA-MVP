/* ═══════════════════════════════════════════════════════════
   Chain Reliability Calculator
   
   Implements the simplified Cascading Entropy formula from
   Deep Research Part 2: P_chain = ∏ p_i
   
   The "95% Trap": Five 95%-reliable agents chained together
   yield only 77.4% reliability. This module computes actual
   pipeline reliability and warns before execution.
   
   Phase 2: Will add entropy term: P = ∏ p_i · exp(-Σ H_cascade(i))
   ═══════════════════════════════════════════════════════════ */

/**
 * Agent reliability data for chain calculation.
 * In production, pulled from listings.uptime and historical success rate.
 */
export interface AgentReliability {
    /** Agent identifier (slug, DID, or name) */
    agentId: string;
    /** Agent display name */
    name: string;
    /** Historical success rate (0.0-1.0), derived from completed/total transactions */
    successRate: number;
    /** Uptime percentage (0.0-1.0), from monitoring data */
    uptime: number;
    /** Average latency in milliseconds */
    avgLatencyMs: number;
}

/**
 * Result of a chain reliability computation.
 */
export interface ChainReliabilityResult {
    /** Combined pipeline success probability (0.0-1.0) */
    chainReliability: number;
    /** Human-readable percentage string */
    chainReliabilityPct: string;
    /** Number of agents in the chain */
    agentCount: number;
    /** The weakest link in the chain */
    weakestAgent: { name: string; reliability: number } | null;
    /** Risk assessment */
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    /** Per-agent reliability contribution */
    agentContributions: Array<{
        name: string;
        reliability: number;
        cumulativeReliability: number;
    }>;
    /** Warning message if reliability is below threshold */
    warning: string | null;
    /** Recommended action */
    recommendation: string;
}

// ── Thresholds ──────────────────────────────────────────

const RELIABILITY_THRESHOLDS = {
    /** Below this = CRITICAL risk, consider aborting */
    critical: 0.50,
    /** Below this = HIGH risk, warn user */
    high: 0.70,
    /** Below this = MEDIUM risk, note it */
    medium: 0.85,
    /** Above this = LOW risk */
    low: 1.00,
} as const;

// ── Main Calculator ─────────────────────────────────────

/**
 * Compute pipeline reliability using simplified Cascading Entropy formula.
 * 
 * P_chain = ∏ p_i  (product of individual reliabilities)
 * 
 * Each agent's reliability = min(successRate, uptime)
 * 
 * @param agents Array of agents in the execution chain
 * @returns Chain reliability result with risk assessment
 * 
 * @example
 * ```typescript
 * const agents = [
 *   { agentId: 'formulator', name: 'Formulator', successRate: 0.99, uptime: 0.99, avgLatencyMs: 2000 },
 *   { agentId: 'procurement', name: 'Procurement', successRate: 0.95, uptime: 0.98, avgLatencyMs: 3000 },
 *   { agentId: 'codeguard', name: 'CodeGuard', successRate: 0.92, uptime: 0.95, avgLatencyMs: 5000 },
 *   { agentId: 'qa', name: 'QA Inspector', successRate: 0.98, uptime: 0.99, avgLatencyMs: 2000 },
 * ];
 * 
 * const result = chainReliability(agents);
 * // result.chainReliability ≈ 0.846
 * // result.riskLevel = 'MEDIUM'
 * ```
 */
export function chainReliability(agents: AgentReliability[]): ChainReliabilityResult {
    if (agents.length === 0) {
        return {
            chainReliability: 1.0,
            chainReliabilityPct: '100.0%',
            agentCount: 0,
            weakestAgent: null,
            riskLevel: 'LOW',
            agentContributions: [],
            warning: null,
            recommendation: 'No agents in chain.',
        };
    }

    // Calculate per-agent reliability as min(successRate, uptime)
    const agentReliabilities = agents.map(a => ({
        name: a.name,
        reliability: Math.min(a.successRate, a.uptime),
    }));

    // P_chain = ∏ p_i (product of all reliabilities)
    let chainProb = 1.0;
    const contributions: ChainReliabilityResult['agentContributions'] = [];

    for (const agent of agentReliabilities) {
        chainProb *= agent.reliability;
        contributions.push({
            name: agent.name,
            reliability: +agent.reliability.toFixed(4),
            cumulativeReliability: +chainProb.toFixed(4),
        });
    }

    // Find weakest link
    const weakest = agentReliabilities.reduce(
        (min, a) => (a.reliability < min.reliability ? a : min),
        agentReliabilities[0]
    );

    // Determine risk level
    let riskLevel: ChainReliabilityResult['riskLevel'];
    if (chainProb < RELIABILITY_THRESHOLDS.critical) {
        riskLevel = 'CRITICAL';
    } else if (chainProb < RELIABILITY_THRESHOLDS.high) {
        riskLevel = 'HIGH';
    } else if (chainProb < RELIABILITY_THRESHOLDS.medium) {
        riskLevel = 'MEDIUM';
    } else {
        riskLevel = 'LOW';
    }

    // Generate warning and recommendation
    let warning: string | null = null;
    let recommendation: string;

    switch (riskLevel) {
        case 'CRITICAL':
            warning = `⛔ Pipeline reliability is ${(chainProb * 100).toFixed(1)}% — CRITICAL risk. Less than 1 in 2 executions will succeed.`;
            recommendation = 'Abort: Remove unreliable agents or use fallback pipeline.';
            break;
        case 'HIGH':
            warning = `⚠️ Pipeline reliability is ${(chainProb * 100).toFixed(1)}% — HIGH risk. ~${((1 - chainProb) * 100).toFixed(0)}% failure rate expected.`;
            recommendation = `Improve: ${weakest.name} is the weakest link at ${(weakest.reliability * 100).toFixed(1)}%. Consider replacement.`;
            break;
        case 'MEDIUM':
            warning = `📊 Pipeline reliability is ${(chainProb * 100).toFixed(1)}% — acceptable but not ideal.`;
            recommendation = `Monitor: Watch ${weakest.name} (${(weakest.reliability * 100).toFixed(1)}% reliability).`;
            break;
        case 'LOW':
            recommendation = 'Pipeline reliability is healthy. Proceed normally.';
            break;
    }

    return {
        chainReliability: +chainProb.toFixed(4),
        chainReliabilityPct: `${(chainProb * 100).toFixed(1)}%`,
        agentCount: agents.length,
        weakestAgent: { name: weakest.name, reliability: +weakest.reliability.toFixed(4) },
        riskLevel,
        agentContributions: contributions,
        warning,
        recommendation,
    };
}

/**
 * Quick check: should this pipeline proceed?
 * Returns true if reliability >= threshold (default 0.50)
 */
export function shouldProceed(agents: AgentReliability[], minReliability = 0.50): boolean {
    const result = chainReliability(agents);
    return result.chainReliability >= minReliability;
}

/**
 * Estimate total pipeline latency (sum of avg latencies).
 * Does NOT account for parallel execution — worst-case serial estimate.
 */
export function estimatedPipelineLatency(agents: AgentReliability[]): {
    totalMs: number;
    totalSeconds: string;
    perAgent: Array<{ name: string; latencyMs: number }>;
} {
    const totalMs = agents.reduce((sum, a) => sum + a.avgLatencyMs, 0);
    return {
        totalMs,
        totalSeconds: `${(totalMs / 1000).toFixed(1)}s`,
        perAgent: agents.map(a => ({ name: a.name, latencyMs: a.avgLatencyMs })),
    };
}
