/* ═══════════════════════════════════════════════════════════
   UsageDashboard — Real-time stats and call history
   ═══════════════════════════════════════════════════════════ */

import { getStats, getCalls, getUserPlan, canMakeCall, PRICING } from '../lib/usageTracker';
import './PricingTiers.css'; // shared styles

interface Props {
    agentId: string;
    refreshKey?: number; // increment to force re-render
}

export default function UsageDashboard({ agentId, refreshKey }: Props) {
    // Use refreshKey to force re-computation
    void refreshKey;

    const stats = getStats(agentId);
    const plan = getUserPlan(agentId);
    const callCheck = canMakeCall(agentId);
    const calls = getCalls(agentId);
    const recentCalls = calls.slice(-8).reverse();

    const planLabel = plan.plan === 'free' ? '🆓 Free Tier'
        : plan.plan === 'per_call' ? '💳 Pay per Call'
            : '⭐ Unlimited';

    // Usage bar for free tier
    const usagePercent = plan.plan === 'free'
        ? Math.min(100, (stats.totalCalls / PRICING.FREE_TIER_LIMIT) * 100)
        : 0;

    const barClass = usagePercent >= 90 ? 'usage-plan-bar__fill--danger'
        : usagePercent >= 70 ? 'usage-plan-bar__fill--warning' : '';

    return (
        <div className="usage-dashboard">
            <h3 className="usage-dashboard__title">📊 Your Usage</h3>

            {/* Stats grid */}
            <div className="usage-stats-grid">
                <div className="usage-stat usage-stat--primary">
                    <div className="usage-stat__value">{stats.totalCalls}</div>
                    <div className="usage-stat__label">Total Calls</div>
                </div>
                <div className={`usage-stat ${stats.successRate >= 0.9 ? 'usage-stat--success' : 'usage-stat--warning'}`}>
                    <div className="usage-stat__value">{stats.totalCalls > 0 ? `${(stats.successRate * 100).toFixed(0)}%` : '—'}</div>
                    <div className="usage-stat__label">Success Rate</div>
                </div>
                <div className="usage-stat">
                    <div className="usage-stat__value">{stats.totalCalls > 0 ? `${(stats.avgLatencyMs / 1000).toFixed(1)}s` : '—'}</div>
                    <div className="usage-stat__label">Avg Latency</div>
                </div>
                <div className="usage-stat usage-stat--primary">
                    <div className="usage-stat__value">${stats.totalSpentUsd.toFixed(2)}</div>
                    <div className="usage-stat__label">Total Spent</div>
                </div>
            </div>

            {/* Plan bar */}
            <div className="usage-plan-bar">
                <div className="usage-plan-bar__label">{planLabel}</div>
                {plan.plan === 'free' && (
                    <>
                        <div className="usage-plan-bar__track">
                            <div
                                className={`usage-plan-bar__fill ${barClass}`}
                                style={{ width: `${usagePercent}%` }}
                            />
                        </div>
                        <div className="usage-plan-bar__text">
                            {callCheck.callsRemaining !== undefined
                                ? `${callCheck.callsRemaining} left`
                                : 'Limit reached'}
                        </div>
                    </>
                )}
                {plan.plan === 'per_call' && (
                    <div className="usage-plan-bar__text">
                        {Math.max(0, stats.totalCalls - PRICING.FREE_TIER_LIMIT)} paid calls
                    </div>
                )}
                {plan.plan === 'subscription' && (
                    <div className="usage-plan-bar__text">Unlimited ∞</div>
                )}
            </div>

            {/* Call history (last 8) */}
            {recentCalls.length > 0 && (
                <div className="usage-history">
                    <h4 className="usage-history__title">Recent Calls</h4>
                    <table className="usage-history-table">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Query</th>
                                <th>Latency</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentCalls.map((call, i) => (
                                <tr key={i}>
                                    <td>{new Date(call.timestamp).toLocaleTimeString()}</td>
                                    <td>{call.query.slice(0, 30)}{call.query.length > 30 ? '...' : ''}</td>
                                    <td>{(call.latencyMs / 1000).toFixed(1)}s</td>
                                    <td className={call.success ? 'status-ok' : 'status-fail'}>
                                        {call.success ? '✅ OK' : '❌ Fail'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
