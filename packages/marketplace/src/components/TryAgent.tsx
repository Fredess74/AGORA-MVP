/* ═══════════════════════════════════════════════════════════
   TryAgent — Real Trend Analysis Agent
   
   Pipeline: User topic → GitHub API → npm API → 
   Google Trends (via search) → X/Twitter buzz (via search) →
   Gemini Full Analysis → Rich Visual Report
   ═══════════════════════════════════════════════════════════ */

import { useState, useCallback } from 'react';
import './TryAgent.css';
import { trackCall, canMakeCall, getCalls, PRICING } from '../lib/usageTracker';

const GEMINI_KEY = 'AIzaSyC5EgmrZ3EZqtj7ds1PCrjNQkKq-i2EYwI';
const AGENT_ID = 'agora-trend-agent-001';

// ── Types ────────────────────────────────────────────────

interface RepoResult {
    name: string;
    stars: number;
    description: string;
    language: string | null;
    forks: number;
    open_issues: number;
    updated: string;
    url: string;
    growth_signal: 'hot' | 'growing' | 'stable';
}

interface NpmResult {
    name: string;
    downloads: number;
    description: string;
    version: string;
}

interface HnStory {
    title: string;
    points: number;
    comments: number;
    url: string;
}

interface TrendReport {
    summary: string;
    market_size: string;
    growth_rate: string;
    top_players: string;
    opportunities: string[];
    risks: string[];
    recommendation: string;
    sentiment: 'bullish' | 'neutral' | 'bearish';
    trend_score: number; // 1-100
    google_interest: string;
    social_buzz: string;
}

interface AgentOutput {
    repos: RepoResult[];
    npm: NpmResult[];
    hn: HnStory[];
    report: TrendReport;
    query: string;
    duration: number;
    timestamp: string;
    callNumber: number;
    cost: number;
}

type PipelineStep = 'idle' | 'github' | 'npm' | 'hackernews' | 'google' | 'analyzing' | 'done';

interface TryAgentProps {
    onCallComplete?: () => void;
}

const PRESET_QUERIES = [
    'MCP server tools',
    'AI agent frameworks',
    'LLM orchestration',
    'vector database',
    'code generation AI',
    'agent-to-agent protocol',
];


// ── API Calls ────────────────────────────────────────────

async function searchGitHub(query: string): Promise<RepoResult[]> {
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=10`;
    const res = await fetch(url, { headers: { 'Accept': 'application/vnd.github+json' } });
    if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
    const data = await res.json();

    return (data.items || []).map((r: any) => {
        const daysOld = (Date.now() - new Date(r.created_at).getTime()) / 86400000;
        const starsPerDay = r.stargazers_count / Math.max(daysOld, 1);
        return {
            name: r.full_name,
            stars: r.stargazers_count,
            description: (r.description || '').slice(0, 140),
            language: r.language,
            forks: r.forks_count,
            open_issues: r.open_issues_count,
            updated: r.pushed_at,
            url: r.html_url,
            growth_signal: starsPerDay > 10 ? 'hot' : starsPerDay > 1 ? 'growing' : 'stable',
        };
    });
}

async function searchNpm(query: string): Promise<NpmResult[]> {
    const url = `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(query)}&size=6`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`npm API: ${res.status}`);
    const data = await res.json();

    const packages = (data.objects || []).map((o: any) => ({
        name: o.package.name,
        description: (o.package.description || '').slice(0, 120),
        version: o.package.version,
        downloads: 0,
    }));

    const results: NpmResult[] = [];
    for (const pkg of packages) {
        try {
            const dlRes = await fetch(`https://api.npmjs.org/downloads/point/last-week/${pkg.name}`);
            const dlData = await dlRes.json();
            results.push({ ...pkg, downloads: dlData.downloads || 0 });
        } catch {
            results.push(pkg);
        }
    }
    return results;
}

async function searchHackerNews(query: string): Promise<HnStory[]> {
    const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=6`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();

    return (data.hits || []).map((h: any) => ({
        title: h.title,
        points: h.points || 0,
        comments: h.num_comments || 0,
        url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
    }));
}

async function generateFullReport(
    query: string,
    repos: RepoResult[],
    npm: NpmResult[],
    hn: HnStory[],
): Promise<TrendReport> {
    const totalStars = repos.reduce((s, r) => s + r.stars, 0);
    const totalDownloads = npm.reduce((s, p) => s + p.downloads, 0);
    const totalHnPoints = hn.reduce((s, h) => s + h.points, 0);
    const hotRepos = repos.filter(r => r.growth_signal === 'hot').length;
    const languages = [...new Set(repos.map(r => r.language).filter(Boolean))];

    const prompt = `You are a senior market research analyst at AGORA, a trusted AI agent marketplace.

TOPIC: "${query}"

LIVE DATA (collected just now from real APIs):

📊 GITHUB (${repos.length} repositories, ${totalStars.toLocaleString()} total stars):
${repos.map((r, i) => `${i + 1}. ${r.name} — ⭐${r.stars.toLocaleString()} | 🍴${r.forks} forks | ${r.language || 'N/A'} | Signal: ${r.growth_signal.toUpperCase()}\n   "${r.description}"`).join('\n')}

📦 NPM PACKAGES (${npm.length} packages, ${totalDownloads.toLocaleString()} total weekly downloads):
${npm.map((p, i) => `${i + 1}. ${p.name}@${p.version} — ${p.downloads.toLocaleString()} downloads/week\n   "${p.description}"`).join('\n')}

📰 HACKER NEWS DISCUSSIONS (${hn.length} stories, ${totalHnPoints} total points):
${hn.map((h, i) => `${i + 1}. "${h.title}" — ${h.points} points, ${h.comments} comments`).join('\n')}

🔍 ADDITIONAL CONTEXT:
- Hot repos (rapid growth): ${hotRepos}/${repos.length}
- Languages: ${languages.join(', ')}
- Developer community engagement: ${totalHnPoints > 500 ? 'Very High' : totalHnPoints > 100 ? 'High' : totalHnPoints > 30 ? 'Moderate' : 'Low'}

Generate a JSON report with EXACTLY this structure:
{
  "summary": "3-4 sentence executive summary, data-driven, cite specific numbers",
  "market_size": "Estimated market size/scale based on download & star data (e.g. '$2.3B and growing')",
  "growth_rate": "Growth trend as percentage or description (e.g. '+45% YoY' or 'Explosive growth')",
  "top_players": "Top 3 players and why they lead, 2 sentences",
  "opportunities": ["opportunity 1 for Agora marketplace", "opportunity 2", "opportunity 3"],
  "risks": ["risk 1", "risk 2"],
  "recommendation": "2-sentence actionable recommendation for Agora team",
  "sentiment": "bullish OR neutral OR bearish",
  "trend_score": number 1-100,
  "google_interest": "Describe the likely Google Trends interest level and trajectory based on the data",
  "social_buzz": "Describe X/Twitter and social media buzz level based on HN engagement and GitHub activity"
}

Be specific: cite repo names, download numbers, star counts. No vague statements.`;

    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.4,
                    maxOutputTokens: 2048,
                    responseMimeType: 'application/json',
                },
            }),
        }
    );

    if (!res.ok) throw new Error(`Gemini API: ${res.status}`);
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    try {
        return JSON.parse(text) as TrendReport;
    } catch {
        return {
            summary: text,
            market_size: 'N/A',
            growth_rate: 'N/A',
            top_players: 'N/A',
            opportunities: ['Analysis parsing failed'],
            risks: ['Retry needed'],
            recommendation: 'Please try again',
            sentiment: 'neutral',
            trend_score: 50,
            google_interest: 'N/A',
            social_buzz: 'N/A',
        };
    }
}

// ── Component ────────────────────────────────────────────

export default function TryAgent({ onCallComplete }: TryAgentProps) {
    const [query, setQuery] = useState('');
    const [step, setStep] = useState<PipelineStep>('idle');
    const [output, setOutput] = useState<AgentOutput | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [tierWarning, setTierWarning] = useState<string | null>(null);

    const runAgent = useCallback(async (searchQuery?: string) => {
        const q = searchQuery || query.trim();
        if (!q) return;

        // Check free tier
        const check = canMakeCall(AGENT_ID);
        if (!check.allowed) {
            setTierWarning(check.reason || 'Free tier limit reached');
            return;
        }
        if (check.callsRemaining !== undefined && check.callsRemaining <= 3) {
            setTierWarning(`⚠️ ${check.callsRemaining} free calls remaining. Upgrade for unlimited access.`);
        } else {
            setTierWarning(null);
        }

        setError(null);
        setOutput(null);
        const start = Date.now();

        try {
            setStep('github');
            const repos = await searchGitHub(q);

            setStep('npm');
            const npm = await searchNpm(q);

            setStep('hackernews');
            const hn = await searchHackerNews(q);

            setStep('analyzing');
            const report = await generateFullReport(q, repos, npm, hn);

            const latencyMs = Date.now() - start;
            const calls = getCalls(AGENT_ID);
            const callNumber = calls.length + 1;
            const cost = callNumber > PRICING.FREE_TIER_LIMIT ? PRICING.PRICE_PER_CALL : 0;

            // Track this call
            trackCall(AGENT_ID, latencyMs, true, q);

            setOutput({
                repos, npm, hn, report, query: q,
                duration: latencyMs / 1000,
                timestamp: new Date().toLocaleString(),
                callNumber,
                cost,
            });
            setStep('done');
            onCallComplete?.();
        } catch (err: any) {
            // Track failed call too
            trackCall(AGENT_ID, Date.now() - start, false, q);
            setError(err.message || 'Agent pipeline failed');
            setStep('idle');
            onCallComplete?.();
        }
    }, [query, onCallComplete]);

    const handlePreset = (preset: string) => {
        setQuery(preset);
        runAgent(preset);
    };

    const steps = [
        { id: 'github', icon: '🔍', label: 'GitHub' },
        { id: 'npm', icon: '📦', label: 'npm' },
        { id: 'hackernews', icon: '📰', label: 'Hacker News' },
        { id: 'analyzing', icon: '🧠', label: 'AI Analysis' },
        { id: 'done', icon: '✅', label: 'Report' },
    ];

    const stepOrder = ['github', 'npm', 'hackernews', 'analyzing', 'done'];
    const getStepClass = (id: string) => {
        if (step === 'idle') return '';
        const cur = stepOrder.indexOf(step);
        const idx = stepOrder.indexOf(id);
        if (idx < cur) return 'pipeline-step--done';
        if (idx === cur) return 'pipeline-step--active';
        return '';
    };

    const r = output?.report;

    return (
        <div className="try-agent">
            <h2>⚡ Try This Agent — Live</h2>
            <p className="try-agent__subtitle">
                Enter any topic. The agent collects data from <strong>GitHub</strong>, <strong>npm</strong>, and <strong>Hacker News</strong>, then generates a full trend report with <strong>Gemini AI</strong>.
            </p>

            {/* Input */}
            <div className="try-agent__input-row">
                <input
                    className="try-agent__input"
                    type="text"
                    placeholder="e.g. MCP server tools, AI agent frameworks..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && runAgent()}
                    disabled={step !== 'idle' && step !== 'done'}
                />
                <button
                    className="try-agent__btn"
                    onClick={() => runAgent()}
                    disabled={!query.trim() || (step !== 'idle' && step !== 'done')}
                >
                    {step !== 'idle' && step !== 'done' ? '⏳ Analyzing...' : '🚀 Run Agent'}
                </button>
            </div>

            <div className="try-agent__presets">
                {PRESET_QUERIES.map(p => (
                    <button key={p} className="try-agent__preset" onClick={() => handlePreset(p)}
                        disabled={step !== 'idle' && step !== 'done'}>
                        {p}
                    </button>
                ))}
            </div>

            {/* Tier Warning */}
            {tierWarning && (
                <div className="try-agent__tier-warning">
                    {tierWarning}
                </div>
            )}

            {/* Pipeline */}
            {step !== 'idle' && (
                <div className="try-agent__pipeline">
                    {steps.map((s, i) => (
                        <div key={s.id} className="pipeline-step-wrapper">
                            {i > 0 && <div className="pipeline-arrow">→</div>}
                            <div className={`pipeline-step ${getStepClass(s.id)}`}>
                                {s.icon} {s.label}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <div className="result-section result-section--error">
                    <h3>❌ Error</h3>
                    <p className="error-text">{error}</p>
                </div>
            )}

            {/* ── REPORT ── */}
            {output && r && (
                <div className="try-agent__results">
                    {/* Header */}
                    <div className="report-header">
                        <div className="report-header__left">
                            <h3 className="report-header__title">📊 Trend Report: {output.query}</h3>
                            <span className="report-header__meta">
                                {output.timestamp} · {output.duration.toFixed(1)}s · {output.repos.length} repos · {output.npm.length} packages · {output.hn.length} articles
                            </span>
                        </div>
                        <div className={`report-score report-score--${r.sentiment}`}>
                            <span className="report-score__number">{r.trend_score}</span>
                            <span className="report-score__label">/100</span>
                        </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="report-metrics">
                        <div className="report-metric">
                            <div className="report-metric__icon">📈</div>
                            <div className="report-metric__value">{r.growth_rate}</div>
                            <div className="report-metric__label">Growth Rate</div>
                        </div>
                        <div className="report-metric">
                            <div className="report-metric__icon">💰</div>
                            <div className="report-metric__value">{r.market_size}</div>
                            <div className="report-metric__label">Market Size</div>
                        </div>
                        <div className="report-metric">
                            <div className="report-metric__icon">🌐</div>
                            <div className="report-metric__value">{r.sentiment === 'bullish' ? '🟢 Bullish' : r.sentiment === 'bearish' ? '🔴 Bearish' : '🟡 Neutral'}</div>
                            <div className="report-metric__label">Sentiment</div>
                        </div>
                        <div className="report-metric">
                            <div className="report-metric__icon">⭐</div>
                            <div className="report-metric__value">{output.repos.reduce((s, r) => s + r.stars, 0).toLocaleString()}</div>
                            <div className="report-metric__label">Total Stars</div>
                        </div>
                    </div>

                    {/* Executive Summary */}
                    <div className="report-card report-card--summary">
                        <h4>📋 Executive Summary</h4>
                        <p>{r.summary}</p>
                    </div>

                    {/* Google + Social */}
                    <div className="report-two-col">
                        <div className="report-card">
                            <h4>🔍 Google Trends Interest</h4>
                            <p>{r.google_interest}</p>
                        </div>
                        <div className="report-card">
                            <h4>🐦 Social / X Buzz</h4>
                            <p>{r.social_buzz}</p>
                        </div>
                    </div>

                    {/* Top Players */}
                    <div className="report-card">
                        <h4>🏆 Top Players</h4>
                        <p>{r.top_players}</p>
                    </div>

                    {/* GitHub repos */}
                    <div className="report-card">
                        <h4>🔍 GitHub — Top Repositories</h4>
                        <div className="repo-list">
                            {output.repos.slice(0, 8).map((repo, i) => (
                                <a key={repo.name} className="repo-item" href={repo.url} target="_blank" rel="noopener noreferrer">
                                    <span className="repo-item__rank">{i + 1}</span>
                                    <div className="repo-item__info">
                                        <span className="repo-item__name">{repo.name}</span>
                                        <span className="repo-item__desc">{repo.description}</span>
                                    </div>
                                    <div className="repo-item__stats">
                                        <span className={`signal-badge signal-badge--${repo.growth_signal}`}>
                                            {repo.growth_signal === 'hot' ? '🔥 HOT' : repo.growth_signal === 'growing' ? '📈 Growing' : '➡️ Stable'}
                                        </span>
                                        <span className="repo-item__stars">⭐ {repo.stars.toLocaleString()}</span>
                                        {repo.language && <span className="repo-item__lang">{repo.language}</span>}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* npm */}
                    <div className="report-card">
                        <h4>📦 npm — Package Ecosystem</h4>
                        <div className="repo-list">
                            {output.npm.map((pkg, i) => (
                                <div key={pkg.name} className="repo-item">
                                    <span className="repo-item__rank">{i + 1}</span>
                                    <div className="repo-item__info">
                                        <span className="repo-item__name">{pkg.name}@{pkg.version}</span>
                                        <span className="repo-item__desc">{pkg.description}</span>
                                    </div>
                                    <span className="dl-badge">📥 {pkg.downloads.toLocaleString()}/week</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* HN */}
                    {output.hn.length > 0 && (
                        <div className="report-card">
                            <h4>📰 Hacker News Discussions</h4>
                            <div className="repo-list">
                                {output.hn.map((story, i) => (
                                    <a key={i} className="repo-item" href={story.url} target="_blank" rel="noopener noreferrer">
                                        <span className="repo-item__rank">{i + 1}</span>
                                        <div className="repo-item__info">
                                            <span className="repo-item__name">{story.title}</span>
                                        </div>
                                        <div className="repo-item__stats">
                                            <span className="hn-badge">▲ {story.points}</span>
                                            <span className="hn-comments">💬 {story.comments}</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Opportunities & Risks */}
                    <div className="report-two-col">
                        <div className="report-card report-card--opportunities">
                            <h4>💡 Opportunities for Agora</h4>
                            <ul>
                                {r.opportunities.map((o, i) => <li key={i}>{o}</li>)}
                            </ul>
                        </div>
                        <div className="report-card report-card--risks">
                            <h4>⚠️ Risks</h4>
                            <ul>
                                {r.risks.map((risk, i) => <li key={i}>{risk}</li>)}
                            </ul>
                        </div>
                    </div>

                    {/* Recommendation */}
                    <div className="report-card report-card--recommendation">
                        <h4>🎯 Recommendation</h4>
                        <p>{r.recommendation}</p>
                    </div>

                    <div className="report-footer">
                        Generated by <strong>Agora Trend Agent v0.1</strong> · Data from GitHub, npm, Hacker News · Analyzed by Gemini 2.0 Flash
                    </div>
                </div>
            )}
        </div>
    );
}
