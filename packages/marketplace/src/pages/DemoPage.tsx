/* ═══════════════════════════════════════════════════════════
   DemoPage — E2E MVP Demo Interface
   
   3-column layout:
   1. Director Chat (input + AI responses + result)
   2. Activity Journal (SSE real-time events)
   3. Trust Score Live (6 animated component bars)
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

// ── Component ───────────────────────────────────────────

export default function DemoPage() {
    const [query, setQuery] = useState('');
    const [speed, setSpeed] = useState<SpeedMode>('slow');
    const [isRunning, setIsRunning] = useState(false);
    const [events, setEvents] = useState<SSEEvent[]>([]);
    const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; isUser: boolean }>>([]);
    const [trustBefore, setTrustBefore] = useState<TrustBreakdown | null>(null);
    const [trustAfter, setTrustAfter] = useState<TrustBreakdown | null>(null);
    const [result, setResult] = useState<string>('');
    const [, setSessionId] = useState<string>('');

    const journalRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);
    const eventSourceRef = useRef<EventSource | null>(null);

    // ── SSE Connection ──────────────────────────────────

    useEffect(() => {
        const es = new EventSource(`${API_BASE}/api/demo/stream`);
        eventSourceRef.current = es;

        es.onmessage = (e) => {
            try {
                const event: SSEEvent = JSON.parse(e.data);
                handleSSEEvent(event);
            } catch { /* ignore parsing errors */ }
        };

        es.onerror = () => {
            console.warn('SSE connection error, reconnecting...');
        };

        return () => es.close();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Handle SSE Events ───────────────────────────────

    const handleSSEEvent = useCallback((event: SSEEvent) => {
        setEvents(prev => [...prev, event]);

        // Update trust data
        if (event.type === 'trust_updated' && event.metadata?.trust) {
            const trust = event.metadata.trust as TrustBreakdown;
            if (event.metadata?.before) {
                setTrustBefore(event.metadata.before as TrustBreakdown);
                setTrustAfter(event.metadata.after as TrustBreakdown);
            } else if (!trustBefore) {
                setTrustBefore(trust);
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

        // Capture result
        if (event.type === 'session_completed') {
            setIsRunning(false);
        }

        // Auto-scroll
        setTimeout(() => {
            journalRef.current?.scrollTo({ top: journalRef.current.scrollHeight, behavior: 'smooth' });
            chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
        }, 50);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Start Demo ──────────────────────────────────────

    const startDemo = async () => {
        if (!query.trim() || isRunning) return;

        // Reset state
        setEvents([]);
        setChatMessages([{ sender: 'Director', text: query, isUser: true }]);
        setTrustBefore(null);
        setTrustAfter(null);
        setResult('');
        setIsRunning(true);

        try {
            const res = await fetch(`${API_BASE}/api/demo/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, speed }),
            });
            const data = await res.json();
            setSessionId(data.sessionId || '');

            // Poll for result
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

    // ── Render ───────────────────────────────────────────

    const currentTrust = trustAfter || trustBefore;

    return (
        <div className="demo-page">
            <div className="demo-header">
                <h1>🏛️ Agora — AI Organization ↔ AI Organization</h1>
                <p>Реальная демонстрация: AI покупатель находит, нанимает и получает работу от AI исполнителя</p>
                <div className="demo-controls">
                    <div className="speed-toggle">
                        <button
                            className={`speed-btn ${speed === 'slow' ? 'active' : ''}`}
                            onClick={() => setSpeed('slow')}
                        >
                            🐢 Presentation
                        </button>
                        <button
                            className={`speed-btn ${speed === 'fast' ? 'active' : ''}`}
                            onClick={() => setSpeed('fast')}
                        >
                            ⚡ Real-time
                        </button>
                    </div>
                </div>
            </div>

            <div className="demo-grid">
                {/* ── Column 1: Director Chat ──────────── */}
                <div className="glass-panel">
                    <div className="panel-header">
                        <span className="panel-icon">💬</span>
                        <h2>Director's Interface</h2>
                        <div style={{ marginLeft: 'auto' }}>
                            <div className={`pulse ${isRunning ? '' : 'inactive'}`} />
                        </div>
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
                                <div style={{ fontSize: '0.7rem', color: '#00d4ff', marginBottom: '0.5rem', fontWeight: 600 }}>
                                    📄 ОТЧЁТ АГЕНТА
                                </div>
                                {result.substring(0, 2000)}
                                {result.length > 2000 && (
                                    <div style={{ color: '#556', marginTop: '0.5rem' }}>
                                        ...ещё {result.length - 2000} символов
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="chat-input-area">
                        <div className="chat-input-wrapper">
                            <textarea
                                className="chat-input"
                                placeholder="Введите запрос директора... (напр: Проверь безопасность репозитория facebook/react)"
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
                                onClick={startDemo}
                                disabled={isRunning || !query.trim()}
                            >
                                {isRunning ? '⏳' : '▶ Go'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Column 2: Activity Journal ──────── */}
                <div className="glass-panel">
                    <div className="panel-header">
                        <span className="panel-icon">📋</span>
                        <h2>Activity Journal</h2>
                        <div style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#556' }}>
                            {events.length} events
                        </div>
                    </div>
                    <div className="panel-body" ref={journalRef}>
                        {events.length === 0 ? (
                            <div className="journal-empty">
                                <div className="empty-icon">📋</div>
                                <div>Журнал пуст</div>
                                <div style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
                                    Введите запрос чтобы начать
                                </div>
                            </div>
                        ) : (
                            <div className="journal-events">
                                {events.map((event, i) => (
                                    <div key={i} className={`journal-event type-${event.type}`}>
                                        <div className="journal-meta">
                                            <span className="journal-sender">{event.sender}</span>
                                            <span className="journal-time">
                                                {new Date(event.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <div className="journal-title">{event.title}</div>
                                        <div className="journal-content">{event.content}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Column 3: Trust Score Live ──────── */}
                <div className="glass-panel">
                    <div className="panel-header">
                        <span className="panel-icon">🛡️</span>
                        <h2>Trust Score Live</h2>
                    </div>
                    <div className="panel-body">
                        {!currentTrust ? (
                            <div className="trust-empty">
                                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🛡️</div>
                                <div>Ожидание данных</div>
                                <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#445' }}>
                                    Trust score появится после выбора агента
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="trust-agent-name">
                                    {currentTrust.agentName || currentTrust.agentId}
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
                                                        color: level === 'high' ? '#00ff88' : level === 'medium' ? '#ffaa00' : '#ff4444'
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
                                    <div className="trust-composite-score">
                                        {currentTrust.compositeScore.toFixed(3)}
                                    </div>
                                    {trustBefore && trustAfter && (
                                        <div className={`trust-composite-delta ${trustAfter.compositeScore > trustBefore.compositeScore ? 'positive' :
                                            trustAfter.compositeScore < trustBefore.compositeScore ? 'negative' : 'neutral'
                                            }`} style={{
                                                color: trustAfter.compositeScore >= trustBefore.compositeScore ? '#00ff88' : '#ff4444'
                                            }}>
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
        code_quality: '💻', repo_health: '📊', uptime: '🟢',
        transaction_success: '✅', user_reviews: '⭐', account_age: '📅',
    };
    return icons[c] || '•';
}

function componentLabel(c: string): string {
    const labels: Record<string, string> = {
        code_quality: 'Code Quality', repo_health: 'Repo Health', uptime: 'Uptime',
        transaction_success: 'Tx Success', user_reviews: 'User Reviews', account_age: 'Account Age',
    };
    return labels[c] || c;
}
