/* ═══════════════════════════════════════════════════════════
   DemoPage — E2E MVP Demo Interface (Finalized)
   
   Features:
   - Visual pipeline stepper (8 steps)
   - 3 preset scenario buttons
   - Transaction summary banner
   - ZK-Verifiable + DID indicators
   - Confidence level display
   - Latency badges on events
   - API call counter
   - Connection status indicator
   - Download report button
   - All English UI
   ═══════════════════════════════════════════════════════════ */

import { useState, useEffect, useRef, useCallback } from 'react';
import './DemoPage.css';

const API_BASE = 'http://localhost:3001';

// ── Types ────────────────────────────────────────────────

interface SSEEvent {
    type: string;
    timestamp: string;
    sessionId: string;
    sender: string;
    title: string;
    content: string;
    metadata?: Record<string, any>;
}

interface TrustComponent {
    component: string;
    score: number;
    weight: number;
}

interface TrustBreakdown {
    agentId: string;
    agentName: string;
    components: TrustComponent[];
    compositeScore: number;
    level: string;
}

type SpeedMode = 'slow' | 'fast';

// ── Pipeline Steps ──────────────────────────────────────

const PIPELINE_STEPS = [
    { id: 'discover', icon: '🔍', label: 'Discover' },
    { id: 'verify', icon: '🛡️', label: 'Verify' },
    { id: 'negotiate', icon: '🤝', label: 'Negotiate' },
    { id: 'execute', icon: '⚡', label: 'Execute' },
    { id: 'deliver', icon: '📦', label: 'Deliver' },
    { id: 'qa', icon: '✅', label: 'QA' },
    { id: 'trust', icon: '📊', label: 'Trust' },
    { id: 'done', icon: '🏁', label: 'Done' },
];

const STEP_MAP: Record<string, string> = {
    session_started: 'discover',
    task_formulated: 'discover',
    mcp_search: 'discover',
    agent_selected: 'verify',
    trust_component_update: 'verify',
    negotiation: 'negotiate',
    work_started: 'execute',
    api_call: 'execute',
    work_completed: 'deliver',
    qa_review: 'qa',
    trust_updated: 'trust',
    session_completed: 'done',
};

// ── Preset Scenarios ────────────────────────────────────

const PRESETS = [
    { icon: '🛡️', label: 'Security Audit: facebook/react', query: 'Audit the security of the GitHub repository facebook/react' },
    { icon: '📊', label: 'Market Research: AI Frameworks', query: 'Research the competitive landscape of AI agent frameworks' },
    { icon: '⚡', label: 'Performance Audit: stripe.com', query: 'Analyze the performance and SEO of stripe.com' },
];

// ── Component ───────────────────────────────────────────

export default function DemoPage() {
    const [query, setQuery] = useState('');
    const [speed, setSpeed] = useState<SpeedMode>('slow');
    const [isRunning, setIsRunning] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [events, setEvents] = useState<SSEEvent[]>([]);
    const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; isUser: boolean }>>([]);
    const [trustBefore, setTrustBefore] = useState<TrustBreakdown | null>(null);
    const [trustAfter, setTrustAfter] = useState<TrustBreakdown | null>(null);
    const [result, setResult] = useState<string>('');
    const [, setSessionId] = useState<string>('');
    const [currentStep, setCurrentStep] = useState<string>('');
    const [apiCallCount, setApiCallCount] = useState(0);
    const [geminiCallCount, setGeminiCallCount] = useState(0);
    const [startTime, setStartTime] = useState<number>(0);
    const [elapsed, setElapsed] = useState<string>('0.0s');
    const [showTransaction, setShowTransaction] = useState(false);

    const journalRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);
    const eventSourceRef = useRef<EventSource | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // ── SSE Connection ──────────────────────────────────

    useEffect(() => {
        const es = new EventSource(`${API_BASE}/api/demo/stream`);
        eventSourceRef.current = es;

        es.onopen = () => setIsConnected(true);

        es.onmessage = (e) => {
            try {
                const event: SSEEvent = JSON.parse(e.data);
                handleSSEEvent(event);
            } catch { /* ignore parsing errors */ }
        };

        es.onerror = () => {
            setIsConnected(false);
            console.warn('SSE connection error, reconnecting...');
        };

        return () => es.close();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Timer ───────────────────────────────────────────

    useEffect(() => {
        if (isRunning && startTime > 0) {
            timerRef.current = setInterval(() => {
                setElapsed(((Date.now() - startTime) / 1000).toFixed(1) + 's');
            }, 100);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isRunning, startTime]);

    // ── Handle SSE Events ───────────────────────────────

    const handleSSEEvent = useCallback((event: SSEEvent) => {
        setEvents(prev => [...prev, event]);

        // Update pipeline step
        if (STEP_MAP[event.type]) {
            setCurrentStep(STEP_MAP[event.type]);
        }

        // Count API calls
        if (event.type === 'api_call') {
            setApiCallCount(prev => prev + 1);
        }

        // Count Gemini calls (any agent action)
        if (['task_formulated', 'agent_selected', 'negotiation', 'work_completed', 'qa_review'].includes(event.type)) {
            setGeminiCallCount(prev => prev + 1);
        }

        // Live trust component updates — animate bars one by one
        if (event.type === 'trust_component_update' && event.metadata?.allComponents) {
            const breakdown: TrustBreakdown = {
                agentId: event.metadata?.agentId as string || '',
                agentName: event.sender || '',
                components: event.metadata.allComponents as any[],
                compositeScore: event.metadata.compositeScore as number || 0,
                level: (event.metadata.level as string) || 'unrated',
            };
            setTrustBefore(breakdown);
        }

        // Final trust summary
        if (event.type === 'trust_updated' && event.metadata?.trustBreakdown) {
            setTrustAfter(event.metadata.trustBreakdown as TrustBreakdown);
            if (!trustBefore) {
                setTrustBefore(event.metadata.trustBreakdown as TrustBreakdown);
            }
        }

        // Add AI messages to chat
        if (['task_formulated', 'agent_selected', 'work_completed', 'session_completed'].includes(event.type)) {
            setChatMessages(prev => [...prev, {
                sender: event.sender,
                text: `**${event.title}**\n${event.content}`,
                isUser: false,
            }]);
        }

        // Session completed
        if (event.type === 'session_completed') {
            setIsRunning(false);
            setShowTransaction(true);
            if (timerRef.current) clearInterval(timerRef.current);
        }

        // Auto-scroll
        setTimeout(() => {
            journalRef.current?.scrollTo({ top: journalRef.current.scrollHeight, behavior: 'smooth' });
            chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
        }, 50);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Start Demo ──────────────────────────────────────

    const startDemo = async (overrideQuery?: string) => {
        const q = overrideQuery || query;
        if (!q.trim() || isRunning) return;

        // Reset state
        setEvents([]);
        setChatMessages([{ sender: 'Director', text: q, isUser: true }]);
        setTrustBefore(null);
        setTrustAfter(null);
        setResult('');
        setIsRunning(true);
        setCurrentStep('discover');
        setApiCallCount(0);
        setGeminiCallCount(0);
        setStartTime(Date.now());
        setElapsed('0.0s');
        setShowTransaction(false);
        if (overrideQuery) setQuery(overrideQuery);

        try {
            const res = await fetch(`${API_BASE}/api/demo/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: q, speed }),
            });
            const data = await res.json();
            setSessionId(data.sessionId || '');

            if (data.sessionId) {
                pollForResult(data.sessionId);
            }
        } catch (err: any) {
            setChatMessages(prev => [...prev, {
                sender: 'System',
                text: `❌ Error: ${err.message}. Make sure the orchestrator is running on port 3001.`,
                isUser: false,
            }]);
            setIsRunning(false);
        }
    };

    const pollForResult = async (sid: string) => {
        const poll = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/demo/session/${sid}`);
                const session = await res.json();
                if (session.result) {
                    setResult(session.result);
                }
                if (session.status === 'completed' || session.status === 'failed') {
                    setIsRunning(false);
                    return;
                }
                setTimeout(poll, 2000);
            } catch {
                setTimeout(poll, 3000);
            }
        };
        setTimeout(poll, 3000);
    };

    const downloadReport = () => {
        const blob = new Blob([result], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'agora-agent-report.md';
        a.click();
        URL.revokeObjectURL(url);
    };

    // ── Render ───────────────────────────────────────────

    const currentTrust = trustAfter || trustBefore;
    const completedSteps = PIPELINE_STEPS.map(s => s.id);
    const currentStepIndex = completedSteps.indexOf(currentStep);

    return (
        <div className="demo-page">
            {/* ── Header ──────────────────────────────── */}
            <div className="demo-header">
                <h1>
                    🏛️ Agora — <span className="highlight">Live E2E Demo</span>
                </h1>
                <p>Watch AI organizations discover, verify, negotiate, and transact — powered by real APIs</p>

                <div className="demo-stats-bar">
                    <div className="demo-stat">
                        <div className={`connection-dot ${isConnected ? '' : 'disconnected'}`} />
                        <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
                    </div>
                    <div className="demo-stat">
                        📡 API Calls: <span className="value">{apiCallCount}</span>
                    </div>
                    <div className="demo-stat">
                        🤖 AI Calls: <span className="value">{geminiCallCount}</span>
                    </div>
                    <div className="demo-stat">
                        ⏱ Elapsed: <span className="value">{elapsed}</span>
                    </div>
                    <div className="demo-controls">
                        <div className="speed-toggle">
                            <button
                                className={`speed-btn ${speed === 'slow' ? 'active' : ''}`}
                                onClick={() => setSpeed('slow')}
                                title="Adds dramatic pauses between steps for live presentations"
                            >
                                🎬 Demo Mode
                            </button>
                            <button
                                className={`speed-btn ${speed === 'fast' ? 'active' : ''}`}
                                onClick={() => setSpeed('fast')}
                                title="Events stream instantly as they happen"
                            >
                                ⚡ Fast
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Pipeline Stepper ──────────────────────── */}
            <div className="demo-pipeline">
                {PIPELINE_STEPS.map((step, i) => (
                    <span key={step.id}>
                        <span className={`pipeline-step ${i < currentStepIndex ? 'completed' :
                            step.id === currentStep ? 'active' : ''
                            }`}>
                            <span className="step-icon">{
                                i < currentStepIndex ? '✓' : step.icon
                            }</span>
                            {step.label}
                        </span>
                        {i < PIPELINE_STEPS.length - 1 && (
                            <span className="pipeline-arrow">→</span>
                        )}
                    </span>
                ))}
            </div>

            {/* ── Preset Scenarios ─────────────────────── */}
            {!isRunning && events.length === 0 && (
                <div className="preset-scenarios">
                    {PRESETS.map((preset) => (
                        <button
                            key={preset.label}
                            className="preset-btn"
                            onClick={() => startDemo(preset.query)}
                        >
                            {preset.icon} {preset.label}
                        </button>
                    ))}
                </div>
            )}

            {/* ── Transaction Banner ──────────────────── */}
            {showTransaction && (() => {
                const completedEvent = events.find(e => e.type === 'session_completed' && e.metadata?.cost);
                const cost = completedEvent?.metadata?.cost ?? 0.05;
                const commission = completedEvent?.metadata?.commission ?? cost * 0.1;
                const earned = completedEvent?.metadata?.creatorEarned ?? (cost - commission);
                return (
                    <div className="transaction-banner">
                        <div className="tx-item">✅ Connection Complete</div>
                        <div className="tx-divider" />
                        <div className="tx-item">Agent: <span className="tx-value">{currentTrust?.agentName || 'Unknown'}</span></div>
                        <div className="tx-divider" />
                        <div className="tx-item">Cost: <span className="tx-value">${Number(cost).toFixed(2)}</span></div>
                        <div className="tx-divider" />
                        <div className="tx-item">Commission: <span className="tx-value">${Number(commission).toFixed(2)} (10%)</span></div>
                        <div className="tx-divider" />
                        <div className="tx-item">Creator Earned: <span className="tx-value">${Number(earned).toFixed(2)}</span></div>
                        <div className="tx-divider" />
                        <div className="tx-item">Time: <span className="tx-value">{elapsed}</span></div>
                    </div>
                );
            })()}

            {/* ── 3-Column Grid ───────────────────────── */}
            <div className="demo-grid">
                {/* ── Column 1: Director Chat ──────────── */}
                <div className="demo-panel">
                    <div className="panel-header">
                        <span className="panel-icon">💬</span>
                        <h2>Director's Interface</h2>
                        {isRunning && (
                            <span className="panel-meta">● Processing...</span>
                        )}
                    </div>
                    <div className="panel-body" ref={chatRef}>
                        <div className="chat-messages">
                            {chatMessages.map((msg, i) => (
                                <div key={i} className={`chat-bubble ${msg.isUser ? 'user' : 'ai'}`}>
                                    <div className="sender">{msg.sender}</div>
                                    <div>{msg.text}</div>
                                </div>
                            ))}
                            {isRunning && (
                                <div className="chat-bubble ai">
                                    <div className="typing-indicator">
                                        <span /><span /><span />
                                    </div>
                                </div>
                            )}
                        </div>
                        {result && (
                            <div className="result-panel">
                                <div className="result-header">📄 Agent Report</div>
                                {result.substring(0, 2000)}
                                {result.length > 2000 && (
                                    <div style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
                                        ...{result.length - 2000} more characters
                                    </div>
                                )}
                                <div className="result-actions">
                                    <button className="btn btn--sm btn--secondary" onClick={downloadReport}>
                                        📥 Download Report
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="chat-input-area">
                        <div className="chat-input-wrapper">
                            <textarea
                                className="chat-input"
                                placeholder="Enter director's request... (e.g.: Audit security of facebook/react)"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        startDemo();
                                    }
                                }}
                                rows={2}
                                disabled={isRunning}
                            />
                            <button
                                className="chat-send"
                                onClick={() => startDemo()}
                                disabled={isRunning || !query.trim()}
                            >
                                {isRunning ? '⏳' : '▶ Run'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Column 2: Activity Journal ──────── */}
                <div className="demo-panel">
                    <div className="panel-header">
                        <span className="panel-icon">📋</span>
                        <h2>Activity Journal</h2>
                        <span className="panel-meta">{events.length} events</span>
                    </div>
                    <div className="panel-body" ref={journalRef}>
                        {events.length === 0 ? (
                            <div className="journal-empty">
                                <div className="empty-icon">📋</div>
                                <div>Journal is empty</div>
                                <div style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)' }}>
                                    Start a demo to see real-time events
                                </div>
                            </div>
                        ) : (
                            <div className="journal-events">
                                {events.map((event, i) => {
                                    const prevTime = i > 0 ? new Date(events[i - 1].timestamp).getTime() : new Date(event.timestamp).getTime();
                                    const thisTime = new Date(event.timestamp).getTime();
                                    const latency = ((thisTime - prevTime) / 1000).toFixed(1);
                                    return (
                                        <div key={i} className={`journal-event type-${event.type}`}>
                                            <div className="journal-meta">
                                                <span className="journal-sender">{event.sender}</span>
                                                <span>
                                                    <span className="journal-time">
                                                        {new Date(event.timestamp).toLocaleTimeString()}
                                                    </span>
                                                    {i > 0 && (
                                                        <span className="journal-latency">[+{latency}s]</span>
                                                    )}
                                                </span>
                                            </div>
                                            <div className="journal-title">{event.title}</div>
                                            <div className="journal-content">{event.content}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Column 3: Trust Score Live ──────── */}
                <div className="demo-panel">
                    <div className="panel-header">
                        <span className="panel-icon">🛡️</span>
                        <h2>Trust Score Live</h2>
                    </div>
                    <div className="panel-body">
                        {!currentTrust ? (
                            <div className="trust-empty">
                                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>🛡️</div>
                                <div>Awaiting agent data</div>
                                <div style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)', color: 'var(--color-text-muted)' }}>
                                    Trust score appears after agent selection
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="trust-agent-name">
                                    {currentTrust.agentName || currentTrust.agentId}
                                    <span className="zk-badge">🔐 ZK-Verifiable</span>
                                </div>
                                <div className="trust-did">
                                    DID: did:agora:{currentTrust.agentId}
                                </div>
                                <div className="trust-components">
                                    {currentTrust.components.map((comp) => {
                                        const before = trustBefore?.components.find(c => c.component === comp.component);
                                        const delta = before && trustAfter
                                            ? comp.score - before.score
                                            : 0;
                                        const level = comp.score >= 0.8 ? 'high' : comp.score >= 0.5 ? 'medium' : 'low';
                                        return (
                                            <div key={comp.component} className="trust-component">
                                                <div className="trust-comp-header">
                                                    <span className="trust-comp-label">
                                                        {componentIcon(comp.component)} {componentLabel(comp.component)}
                                                    </span>
                                                    <span className="trust-comp-value" style={{
                                                        color: level === 'high' ? 'var(--color-trust-high)' : level === 'medium' ? 'var(--color-trust-medium)' : 'var(--color-trust-low)'
                                                    }}>
                                                        {comp.score.toFixed(3)}
                                                        {delta !== 0 && (
                                                            <span className={`trust-comp-delta ${delta > 0 ? 'positive' : 'negative'}`}>
                                                                {delta > 0 ? '▲' : '▼'}{Math.abs(delta).toFixed(3)}
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="trust-bar">
                                                    <div
                                                        className={`trust-bar-fill ${level}`}
                                                        style={{ width: `${comp.score * 100}%` }}
                                                    />
                                                </div>
                                                <span className="trust-weight">Weight: {(comp.weight * 100).toFixed(0)}%</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="trust-composite">
                                    <div className="trust-composite-label">Composite Score</div>
                                    <div className="trust-composite-score" style={{
                                        color: currentTrust.compositeScore >= 0.8 ? 'var(--color-trust-high)' :
                                            currentTrust.compositeScore >= 0.5 ? 'var(--color-trust-medium)' : 'var(--color-trust-low)'
                                    }}>
                                        {currentTrust.compositeScore.toFixed(3)}
                                    </div>
                                    <div className="trust-confidence">
                                        Level: {currentTrust.level.toUpperCase()} • Live calculation
                                    </div>
                                    {trustBefore && trustAfter && (
                                        <div className={`trust-composite-delta ${trustAfter.compositeScore > trustBefore.compositeScore ? 'positive' :
                                            trustAfter.compositeScore < trustBefore.compositeScore ? 'negative' : ''
                                            }`}>
                                            {trustBefore.compositeScore.toFixed(3)} → {trustAfter.compositeScore.toFixed(3)}
                                            {' '}({trustAfter.compositeScore - trustBefore.compositeScore > 0 ? '+' : ''}
                                            {(trustAfter.compositeScore - trustBefore.compositeScore).toFixed(3)})
                                        </div>
                                    )}
                                    <div className={`trust-composite-level ${currentTrust.level}`}>
                                        {currentTrust.level}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Helpers ─────────────────────────────────────────────

function componentIcon(c: string): string {
    const icons: Record<string, string> = {
        identity: '🔐', capability_match: '🎯', response_time: '⚡',
        execution_quality: '📊', peer_review: '⭐', history: '📜',
    };
    return icons[c] || '•';
}

function componentLabel(c: string): string {
    const labels: Record<string, string> = {
        identity: 'Identity', capability_match: 'Capability', response_time: 'Response Time',
        execution_quality: 'Execution', peer_review: 'Peer Review', history: 'History',
    };
    return labels[c] || c;
}
