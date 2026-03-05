/* ═══════════════════════════════════════════════════════════
   TrendsPage — Live dashboard powered by Agora Trend Agent
   Shows real analysis data from the trend-agent pipeline
   ═══════════════════════════════════════════════════════════ */

import './TrendsPage.css';

// ── Embedded analysis data from trend-agent run (2026-03-04) ──
const ANALYSIS_DATA = {
    trends: [
        { name: '@modelcontextprotocol/sdk', type: 'package', metric: 'weekly_downloads', current_value: 23352608, direction: 'rising', velocity_pct: 27, buzz_score: 23353 },
        { name: 'openai', type: 'package', metric: 'weekly_downloads', current_value: 13987751, direction: 'rising', velocity_pct: 10, buzz_score: 13988 },
        { name: 'langchain-ai/langchain', type: 'repo', metric: 'stars', current_value: 128243, direction: 'rising', velocity_pct: 0, buzz_score: 12824 },
        { name: 'n8n-io/n8n', type: 'repo', metric: 'stars', current_value: 177579, direction: 'rising', velocity_pct: 0, buzz_score: 12431 },
        { name: 'google-gemini/gemini-cli', type: 'repo', metric: 'stars', current_value: 96440, direction: 'rising', velocity_pct: 0, buzz_score: 8680 },
        { name: 'modelcontextprotocol/servers', type: 'repo', metric: 'stars', current_value: 80116, direction: 'rising', velocity_pct: 0, buzz_score: 7210 },
        { name: '@anthropic-ai/sdk', type: 'package', metric: 'weekly_downloads', current_value: 7034825, direction: 'rising', velocity_pct: 15, buzz_score: 7035 },
        { name: 'punkpeye/awesome-mcp-servers', type: 'repo', metric: 'stars', current_value: 82178, direction: 'rising', velocity_pct: 0, buzz_score: 6574 },
        { name: 'microsoft/autogen', type: 'repo', metric: 'stars', current_value: 55160, direction: 'rising', velocity_pct: 0, buzz_score: 5516 },
        { name: 'crewAIInc/crewAI', type: 'repo', metric: 'stars', current_value: 45126, direction: 'rising', velocity_pct: 0, buzz_score: 4513 },
    ],
    white_spaces: [
        { niche: 'AI Agent Security & Sandboxing', description: 'Tools for securing AI agents and sandboxing execution environments to prevent malicious behavior.', opportunity_score: 9 },
        { niche: 'AI Agent Testing & Validation', description: 'Solutions for rigorously testing agent behavior, ensuring performance and ethical compliance.', opportunity_score: 8 },
        { niche: 'MCP Server Optimization', description: 'Tools for optimizing MCP server performance and reducing operational costs.', opportunity_score: 7 },
        { niche: 'Agent Coordination & Concurrency', description: 'Frameworks for coordinating multiple AI agents working together on complex tasks.', opportunity_score: 6 },
        { niche: 'Ethical Governance for AI Agents', description: 'Tools for ethical auditing, risk assessment, and compliance monitoring.', opportunity_score: 6 },
    ],
    competitors: [
        { name: 'MCP Servers', stars: 80116, last_activity: '4 days ago', status: 'active', threat_level: 'high', notes: 'Official Model Context Protocol Servers' },
        { name: 'AutoGen', stars: 55160, last_activity: '1 days ago', status: 'active', threat_level: 'high', notes: 'Microsoft — agentic AI framework' },
        { name: 'CrewAI', stars: 45126, last_activity: '0 days ago', status: 'active', threat_level: 'high', notes: 'Multi-agent orchestration framework' },
        { name: 'A2A Protocol', stars: 22270, last_activity: '0 days ago', status: 'active', threat_level: 'high', notes: 'Google — agent-to-agent communication' },
        { name: 'LangChain JS', stars: 17085, last_activity: '0 days ago', status: 'active', threat_level: 'high', notes: 'Agent engineering platform' },
        { name: 'MCP Specification', stars: 7383, last_activity: '0 days ago', status: 'active', threat_level: 'high', notes: 'Anthropic — protocol specification' },
    ],
    ecosystem: {
        total_mcp_repos: 15,
        avg_relevance: 8,
        buzz_index: 534,
        sentiment: { positive: 11, neutral: 9, negative: 10 },
        total_weekly_downloads: 48559896,
        fastest_growing: 'autogen (+77%)',
    },
};

function formatNumber(n: number): string {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
}

export default function TrendsPage() {
    const { trends, white_spaces, competitors, ecosystem } = ANALYSIS_DATA;
    const sentTotal = ecosystem.sentiment.positive + ecosystem.sentiment.neutral + ecosystem.sentiment.negative;

    return (
        <div className="page container trends-page">
            {/* Header */}
            <div className="trends-header">
                <div className="trends-header__badge">
                    🏛️ Powered by Agora Trend Agent
                </div>
                <h1>AI/MCP Ecosystem Trends</h1>
                <p>
                    Real-time analysis of the AI agent ecosystem — data from GitHub, npm, and Hacker News.
                    Updated weekly by our Trend Analyst agent.
                </p>
            </div>

            {/* Key Stats */}
            <div className="trends-stats">
                <div className="stat-card">
                    <div className="stat-card__icon">📦</div>
                    <div className="stat-card__value">{formatNumber(ecosystem.total_weekly_downloads)}</div>
                    <div className="stat-card__label">Weekly npm Downloads</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__icon">📊</div>
                    <div className="stat-card__value">{ecosystem.total_mcp_repos}</div>
                    <div className="stat-card__label">MCP Repos Tracked</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__icon">🔥</div>
                    <div className="stat-card__value">{ecosystem.buzz_index}</div>
                    <div className="stat-card__label">Buzz Index</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__icon">🚀</div>
                    <div className="stat-card__value">{ecosystem.fastest_growing}</div>
                    <div className="stat-card__label">Fastest Growing</div>
                </div>
            </div>

            {/* Top Trends */}
            <div className="trends-section">
                <h2>🔥 Top Trends This Week</h2>
                <table className="trends-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Value</th>
                            <th>Direction</th>
                            <th>Velocity</th>
                            <th>Buzz</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trends.map((t, i) => (
                            <tr key={t.name}>
                                <td style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>{i + 1}</td>
                                <td style={{ fontWeight: 600 }}>
                                    {t.type === 'repo' ? (
                                        <a href={`https://github.com/${t.name}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-primary)', textDecoration: 'none' }}>
                                            {t.name}
                                        </a>
                                    ) : t.name}
                                </td>
                                <td>
                                    <span className={`type-badge type-badge--${t.type}`}>
                                        {t.type === 'repo' ? '⭐ Repo' : '📦 Package'}
                                    </span>
                                </td>
                                <td style={{ fontVariantNumeric: 'tabular-nums' }}>
                                    {formatNumber(t.current_value)}
                                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', marginLeft: 4 }}>
                                        {t.metric === 'stars' ? 'stars' : '/week'}
                                    </span>
                                </td>
                                <td>
                                    <span className={`direction-badge direction-badge--${t.direction}`}>
                                        {t.direction === 'rising' ? '📈' : t.direction === 'declining' ? '📉' : '➡️'} {t.direction}
                                    </span>
                                </td>
                                <td style={{ fontWeight: 600, color: t.velocity_pct > 0 ? '#22c55e' : 'var(--color-text-secondary)' }}>
                                    {t.velocity_pct > 0 ? `+${t.velocity_pct}%` : '—'}
                                </td>
                                <td style={{ fontVariantNumeric: 'tabular-nums' }}>{formatNumber(t.buzz_score)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* White Spaces */}
            <div className="trends-section">
                <h2>💡 White Space Opportunities</h2>
                <div className="whitespace-grid">
                    {white_spaces.map(ws => (
                        <div className="whitespace-card" key={ws.niche}>
                            <div className="whitespace-card__score">{ws.opportunity_score}</div>
                            <h3>{ws.niche}</h3>
                            <p>{ws.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Competitors */}
            <div className="trends-section">
                <h2>🏢 Competitor Watch</h2>
                <div className="competitor-grid">
                    {competitors.map(c => (
                        <div className="competitor-card" key={c.name}>
                            <div className="competitor-card__stars">
                                {formatNumber(c.stars)}
                                <span>⭐ stars</span>
                            </div>
                            <div className="competitor-card__info">
                                <h3>
                                    <span className={`threat-dot threat-dot--${c.threat_level}`} />
                                    {c.name}
                                </h3>
                                <p>{c.notes} · {c.last_activity}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sentiment */}
            <div className="trends-section">
                <h2>💬 Community Sentiment</h2>
                <div className="sentiment-bars">
                    <div className="sentiment-bar sentiment-bar--positive" style={{ flex: ecosystem.sentiment.positive }}>
                        {Math.round(ecosystem.sentiment.positive / sentTotal * 100)}%
                    </div>
                    <div className="sentiment-bar sentiment-bar--neutral" style={{ flex: ecosystem.sentiment.neutral }}>
                        {Math.round(ecosystem.sentiment.neutral / sentTotal * 100)}%
                    </div>
                    <div className="sentiment-bar sentiment-bar--negative" style={{ flex: ecosystem.sentiment.negative }}>
                        {Math.round(ecosystem.sentiment.negative / sentTotal * 100)}%
                    </div>
                </div>
                <div className="sentiment-legend">
                    <span><span className="threat-dot threat-dot--low" /> Positive ({ecosystem.sentiment.positive})</span>
                    <span><span className="threat-dot threat-dot--medium" style={{ background: '#64748b' }} /> Neutral ({ecosystem.sentiment.neutral})</span>
                    <span><span className="threat-dot threat-dot--high" /> Negative ({ecosystem.sentiment.negative})</span>
                </div>
            </div>

            {/* Footer */}
            <div className="trends-footer">
                Generated by <a href="/marketplace/agora-trend-analyst">Agora Trend Analyst</a> · Data from GitHub, npm, Hacker&nbsp;News · March 4, 2026
            </div>
        </div>
    );
}
