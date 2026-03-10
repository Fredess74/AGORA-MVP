/* ═══════════════════════════════════════════════════════════
   TrendsPage — Agora Platform Analytics (Live from Supabase)
   Shows real agent metrics, transaction history, and GitHub stats
   ═══════════════════════════════════════════════════════════ */

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './TrendsPage.css';

// ── Types ────────────────────────────────────────────────

interface AgentMetrics {
    id: string;
    name: string;
    trust_score: number;
    total_calls: number;
    avg_latency_ms: number;
    price: number;
    category: string;
}

interface Transaction {
    id: string;
    listing_id: string;
    status: string;
    amount: number;
    trust_score: number;
    metadata: Record<string, any>;
    created_at: string;
}

interface GitHubStats {
    stars: number;
    forks: number;
    openIssues: number;
    latestCommit: string;
    language: string;
}

// ── Helpers ──────────────────────────────────────────────

function formatNumber(n: number): string {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
}

function trustColor(score: number): string {
    if (score >= 0.8) return '#22c55e';
    if (score >= 0.5) return '#eab308';
    return '#ef4444';
}

function trustLabel(score: number): string {
    if (score >= 0.8) return 'HIGH';
    if (score >= 0.5) return 'MEDIUM';
    if (score > 0) return 'LOW';
    return 'UNRATED';
}

// ── Component ────────────────────────────────────────────

export default function TrendsPage() {
    const [agents, setAgents] = useState<AgentMetrics[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [ghStats, setGhStats] = useState<GitHubStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        try {
            // Load agents from Supabase listings
            const { data: listings } = await supabase
                .from('listings')
                .select('id, name, trust_score, total_calls, avg_latency_ms, price_per_call_usd, category')
                .order('trust_score', { ascending: false });

            if (listings) {
                setAgents(listings.map((l: any) => ({
                    id: l.id,
                    name: l.name,
                    trust_score: l.trust_score || 0,
                    total_calls: l.total_calls || 0,
                    avg_latency_ms: l.avg_latency_ms || 0,
                    price: l.price_per_call_usd || 0,
                    category: l.category || 'general',
                })));
            }

            // Load recent transactions
            const { data: txns } = await supabase
                .from('transactions')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20);

            if (txns) {
                setTransactions(txns.map((t: any) => ({
                    id: t.id,
                    listing_id: t.listing_id,
                    status: t.status || 'completed',
                    amount: t.amount || 0,
                    trust_score: t.trust_score_after || 0,
                    metadata: t.metadata || {},
                    created_at: t.created_at,
                })));
            }

            // Fetch GitHub repo stats for Agora itself
            try {
                const ghRes = await fetch('https://api.github.com/repos/Fredess74/AGORA-MVP', {
                    headers: { 'Accept': 'application/vnd.github.v3+json' },
                });
                if (ghRes.ok) {
                    const gh: any = await ghRes.json();
                    setGhStats({
                        stars: gh.stargazers_count,
                        forks: gh.forks_count,
                        openIssues: gh.open_issues_count,
                        latestCommit: gh.pushed_at,
                        language: gh.language || 'TypeScript',
                    });
                }
            } catch { /* optional */ }

            setLastUpdated(new Date().toLocaleString());
        } catch (err) {
            console.error('Failed to load trends data:', err);
        }
        setLoading(false);
    }

    // Computed
    const totalTransactions = transactions.length;
    const successfulTxns = transactions.filter(t => t.status === 'completed').length;
    const successRate = totalTransactions > 0 ? Math.round((successfulTxns / totalTransactions) * 100) : 0;
    const avgTrust = agents.length > 0
        ? agents.reduce((sum, a) => sum + a.trust_score, 0) / agents.length
        : 0;
    const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);

    return (
        <div className="page container trends-page">
            {/* Header */}
            <div className="trends-header">
                <div className="trends-header__badge">
                    📊 Agora Platform Analytics
                </div>
                <h1>Live Trust & Performance Dashboard</h1>
                <p>
                    Real data from Agora's Supabase backend and GitHub. All metrics are live and verifiable.
                    {lastUpdated && <span> · Last refreshed: {lastUpdated}</span>}
                </p>
                <button className="btn btn--sm btn--primary" onClick={loadData} disabled={loading}>
                    {loading ? 'Loading...' : '🔄 Refresh'}
                </button>
            </div>

            {/* Key Stats */}
            <div className="trends-stats">
                <div className="stat-card">
                    <div className="stat-card__icon">🤖</div>
                    <div className="stat-card__value">{agents.length}</div>
                    <div className="stat-card__label">Registered Agents</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__icon">📋</div>
                    <div className="stat-card__value">{totalTransactions}</div>
                    <div className="stat-card__label">Total Transactions</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__icon">✅</div>
                    <div className="stat-card__value">{successRate}%</div>
                    <div className="stat-card__label">Success Rate</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__icon">💰</div>
                    <div className="stat-card__value">${totalRevenue.toFixed(2)}</div>
                    <div className="stat-card__label">Platform Revenue</div>
                </div>
            </div>

            {loading && (
                <div className="trends-loading">Loading live data from Supabase...</div>
            )}

            {/* Agent Leaderboard */}
            {!loading && (
                <div className="trends-section">
                    <h2>🏆 Agent Leaderboard</h2>
                    <table className="trends-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Agent</th>
                                <th>Trust Score</th>
                                <th>Level</th>
                                <th>Total Calls</th>
                                <th>Avg Latency</th>
                                <th>Price/Call</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agents.length === 0 ? (
                                <tr><td colSpan={7} className="trends-empty">No agents registered yet. Run the demo to populate data.</td></tr>
                            ) : agents.map((a, i) => (
                                <tr key={a.id}>
                                    <td className="trends-rank">{i + 1}</td>
                                    <td className="trends-name">{a.name}</td>
                                    <td>
                                        <span className="trust-score-badge" style={{ color: trustColor(a.trust_score) }}>
                                            {a.trust_score.toFixed(3)}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`type-badge type-badge--${a.trust_score >= 0.8 ? 'repo' : a.trust_score >= 0.5 ? 'package' : 'low'}`}>
                                            {trustLabel(a.trust_score)}
                                        </span>
                                    </td>
                                    <td className="trends-num">{a.total_calls}</td>
                                    <td className="trends-num">
                                        {a.avg_latency_ms > 0 ? `${(a.avg_latency_ms / 1000).toFixed(1)}s` : '—'}
                                    </td>
                                    <td className="trends-num">${a.price.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Trust Distribution */}
            {!loading && agents.length > 0 && (
                <div className="trends-section">
                    <h2>🛡️ Trust Distribution</h2>
                    <div className="trust-dist-grid">
                        {agents.map(a => (
                            <div className="trust-dist-card" key={a.id}>
                                <div className="trust-dist-card__name">{a.name}</div>
                                <div className="trust-dist-card__bar">
                                    <div
                                        className="trust-dist-card__fill"
                                        style={{ width: `${a.trust_score * 100}%`, background: trustColor(a.trust_score) }}
                                    />
                                </div>
                                <div className="trust-dist-card__score" style={{ color: trustColor(a.trust_score) }}>
                                    {a.trust_score.toFixed(3)}
                                </div>
                            </div>
                        ))}
                        <div className="trust-dist-summary">
                            <strong>Average Trust:</strong> <span style={{ color: trustColor(avgTrust) }}>{avgTrust.toFixed(3)}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Transactions */}
            {!loading && (
                <div className="trends-section">
                    <h2>📋 Recent Transactions</h2>
                    <table className="trends-table">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Agent</th>
                                <th>Task</th>
                                <th>Status</th>
                                <th>Trust After</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length === 0 ? (
                                <tr><td colSpan={6} className="trends-empty">No transactions yet. Run the Live Demo to generate real data.</td></tr>
                            ) : transactions.map(t => (
                                <tr key={t.id}>
                                    <td className="trends-time">{new Date(t.created_at).toLocaleString()}</td>
                                    <td className="trends-name">{t.metadata?.agentName || t.listing_id?.substring(0, 8)}</td>
                                    <td>{t.metadata?.task_type || 'N/A'}</td>
                                    <td>
                                        <span className={`type-badge type-badge--${t.status === 'completed' ? 'repo' : 'low'}`}>
                                            {t.status === 'completed' ? '✅' : '❌'} {t.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ color: trustColor(t.trust_score) }}>
                                            {t.trust_score.toFixed(3)}
                                        </span>
                                    </td>
                                    <td className="trends-num">${t.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* GitHub Stats */}
            {ghStats && (
                <div className="trends-section">
                    <h2>🐙 AGORA-MVP GitHub Repository</h2>
                    <div className="trends-stats" style={{ marginTop: 'var(--space-4)' }}>
                        <div className="stat-card">
                            <div className="stat-card__icon">⭐</div>
                            <div className="stat-card__value">{formatNumber(ghStats.stars)}</div>
                            <div className="stat-card__label">Stars</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card__icon">🍴</div>
                            <div className="stat-card__value">{ghStats.forks}</div>
                            <div className="stat-card__label">Forks</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card__icon">🔧</div>
                            <div className="stat-card__value">{ghStats.openIssues}</div>
                            <div className="stat-card__label">Open Issues</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card__icon">💻</div>
                            <div className="stat-card__value">{ghStats.language}</div>
                            <div className="stat-card__label">Primary Language</div>
                        </div>
                    </div>
                    <div className="trends-footer" style={{ marginTop: 'var(--space-4)' }}>
                        Last push: {new Date(ghStats.latestCommit).toLocaleString()} ·{' '}
                        <a href="https://github.com/Fredess74/AGORA-MVP" target="_blank" rel="noopener noreferrer">
                            View on GitHub →
                        </a>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="trends-footer">
                📊 Live data from Agora Supabase · Updated in real-time · <a href="/demo">Run Live Demo →</a>
            </div>
        </div>
    );
}
