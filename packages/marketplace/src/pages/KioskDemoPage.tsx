/* ═══════════════════════════════════════════════════════════
   KioskDemoPage — B2B AI Agent Commerce Demo
   
   Scenario: Paper Factory AI buys lumber from Forestry AI
   through the Agora Trust Protocol.
   
   ZERO API dependencies. Fully self-contained.
   Auto-loops every ~50 seconds for booth display.
   ═══════════════════════════════════════════════════════════ */

import { useState, useEffect, useRef, useCallback } from 'react';
import './KioskDemoPage.css';

// ── Scenario Data ───────────────────────────────────────

const BUYER = {
    icon: '🏭',
    name: 'Northern Paper Co.',
    role: 'BUYER',
    agent: 'PaperMill AI • Procurement Agent',
};

const SELLER = {
    icon: '🌲',
    name: 'Green Forest Lumber',
    role: 'SELLER',
    agent: 'TimberSource AI • Sales Agent',
};

const CANDIDATES = [
    {
        icon: '🌲',
        name: 'Green Forest Lumber',
        type: 'Certified Timber Supplier',
        trust: 0.912,
        calls: '2,847',
        uptime: '99.8%',
    },
    {
        icon: '🪵',
        name: 'WoodFlow Supply',
        type: 'Bulk Material Trader',
        trust: 0.673,
        calls: '892',
        uptime: '97.2%',
    },
    {
        icon: '🌿',
        name: 'EcoTimber Direct',
        type: 'Small-Batch Forestry',
        trust: 0.384,
        calls: '127',
        uptime: '94.1%',
    },
];

const TRUST_COMPONENTS = [
    { icon: '🔐', label: 'Identity', score: 1.0 },
    { icon: '🎯', label: 'Capability', score: 0.95 },
    { icon: '⚡', label: 'Speed', score: 0.88 },
    { icon: '📊', label: 'Quality', score: 0.93 },
    { icon: '⭐', label: 'Peers', score: 0.82 },
    { icon: '📜', label: 'History', score: 0.89 },
];

const DIALOGUE = [
    {
        side: 'buyer',
        icon: '🏭',
        sender: 'PaperMill AI',
        text: 'Need 500 tons of Grade A birch pulpwood. Delivery to Warehouse 7, Boston. Deadline: April 30.',
    },
    {
        side: 'seller',
        icon: '🌲',
        sender: 'TimberSource AI',
        text: 'Available. 500 tons Grade A birch, FSC-certified. $95/ton delivered. ETA April 22. Trust escrow via Agora.',
    },
    {
        side: 'buyer',
        icon: '🏭',
        sender: 'PaperMill AI',
        text: 'Accepted. Initiating Agora escrow for $47,500. Release upon delivery confirmation.',
    },
];

const PIPELINE_STEPS = [
    { icon: '🔍', label: 'Discover' },
    { icon: '🛡️', label: 'Verify' },
    { icon: '🤝', label: 'Negotiate' },
    { icon: '⚡', label: 'Execute' },
    { icon: '📦', label: 'Deliver' },
    { icon: '📊', label: 'Trust' },
    { icon: '🏁', label: 'Done' },
];

// ── Phase enum ──────────────────────────────────────────

type Phase = 'query' | 'search' | 'trust' | 'dialogue' | 'transaction' | 'restart';

const PHASE_STEP: Record<Phase, number> = {
    query: 0,
    search: 0,
    trust: 1,
    dialogue: 2,
    transaction: 5,
    restart: 6,
};

// ── Component ───────────────────────────────────────────

export default function KioskDemoPage() {
    const [phase, setPhase] = useState<Phase>('query');
    const [elapsed, setElapsed] = useState(0);
    const [candidatesVisible, setCandidatesVisible] = useState([false, false, false]);
    const [candidateSelected, setCandidateSelected] = useState(-1);
    const [trustVisible, setTrustVisible] = useState<boolean[]>(new Array(6).fill(false));
    const [trustFills, setTrustFills] = useState<number[]>(new Array(6).fill(0));
    const [compositeScore, setCompositeScore] = useState(0);
    const [dialogueVisible, setDialogueVisible] = useState<boolean[]>(new Array(3).fill(false));
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startRef = useRef(Date.now());

    // ── Timer ──────────────────────────────────────────
    useEffect(() => {
        startRef.current = Date.now();
        timerRef.current = setInterval(() => {
            setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
        }, 1000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, []);

    // ── Auto-play sequence ─────────────────────────────
    const runSequence = useCallback(async () => {
        const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

        // Phase 0: Show businesses
        setPhase('query');
        await wait(5000);

        // Phase 1: Search — candidates fly in
        setPhase('search');
        await wait(600);
        setCandidatesVisible([true, false, false]);
        await wait(500);
        setCandidatesVisible([true, true, false]);
        await wait(500);
        setCandidatesVisible([true, true, true]);
        await wait(2000);

        // Select winner
        setCandidateSelected(0);
        await wait(2500);

        // Phase 2: Trust building
        setPhase('trust');
        await wait(400);

        for (let i = 0; i < TRUST_COMPONENTS.length; i++) {
            setTrustVisible(prev => { const n = [...prev]; n[i] = true; return n; });
            await wait(200);
            setTrustFills(prev => { const n = [...prev]; n[i] = TRUST_COMPONENTS[i].score; return n; });
            await wait(700);
        }

        // Compute composite
        const weights = [0.20, 0.20, 0.15, 0.20, 0.10, 0.15];
        let composite = 0;
        TRUST_COMPONENTS.forEach((c, i) => { composite += c.score * weights[i]; });
        setCompositeScore(Math.round(composite * 1000) / 1000);
        await wait(2000);

        // Phase 3: Dialogue
        setPhase('dialogue');
        await wait(400);
        setDialogueVisible([true, false, false]);
        await wait(2500);
        setDialogueVisible([true, true, false]);
        await wait(2500);
        setDialogueVisible([true, true, true]);
        await wait(3000);

        // Phase 4: Transaction complete
        setPhase('transaction');
        await wait(6000);

        // Phase 5: Restart
        setPhase('restart');
        await wait(4000);

        // Reset all states
        setCandidatesVisible([false, false, false]);
        setCandidateSelected(-1);
        setTrustVisible(new Array(6).fill(false));
        setTrustFills(new Array(6).fill(0));
        setCompositeScore(0);
        setDialogueVisible(new Array(3).fill(false));
        startRef.current = Date.now();
        setElapsed(0);

        // Loop
        runSequence();
    }, []);

    useEffect(() => {
        runSequence();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Helpers ────────────────────────────────────────
    const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

    const trustColor = (score: number) => {
        if (score >= 0.8) return 'high';
        if (score >= 0.5) return 'medium';
        return 'low';
    };

    const currentStepIndex = PHASE_STEP[phase];

    return (
        <div className="kiosk">
            {/* ── Top Bar ──────────────────────────── */}
            <div className="kiosk-top">
                <div className="kiosk-logo">
                    <div className="kiosk-logo-icon">🏛️</div>
                    <span className="kiosk-logo-text">AGORA</span>
                </div>
                <div className="kiosk-badge">
                    <span className="kiosk-badge-dot" />
                    LIVE DEMO
                </div>
                <div className="kiosk-timer">{formatTime(elapsed)}</div>
            </div>

            {/* ── Pipeline ─────────────────────────── */}
            <div className="kiosk-pipeline">
                {PIPELINE_STEPS.map((step, i) => (
                    <span key={step.label}>
                        <span className={`kiosk-step ${i === currentStepIndex ? 'active' : i < currentStepIndex ? 'done' : ''}`}>
                            <span className="kiosk-step-icon">
                                {i < currentStepIndex ? '✓' : step.icon}
                            </span>
                            {step.label}
                        </span>
                        {i < PIPELINE_STEPS.length - 1 && (
                            <span className="kiosk-step-arrow">→</span>
                        )}
                    </span>
                ))}
            </div>

            {/* ── Main Stage ───────────────────────── */}
            <div className="kiosk-stage">

                {/* Phase: Query / Businesses */}
                <div className={`kiosk-phase phase-query ${phase === 'query' ? 'visible' : ''}`}>
                    <div className="phase-query-businesses">
                        <div className="business-card buyer">
                            <div className="business-icon">{BUYER.icon}</div>
                            <div className="business-name">{BUYER.name}</div>
                            <div className="business-role">{BUYER.role}</div>
                            <div className="business-agent">{BUYER.agent}</div>
                        </div>

                        <div className="query-connector">
                            <div className="query-connector-label">via AGORA</div>
                            <div className="query-connector-line">⟶</div>
                        </div>

                        <div className="business-card seller">
                            <div className="business-icon">{SELLER.icon}</div>
                            <div className="business-name">{SELLER.name}</div>
                            <div className="business-role">{SELLER.role}</div>
                            <div className="business-agent">{SELLER.agent}</div>
                        </div>
                    </div>

                    <div className="phase-query-text">
                        <span className="highlight">PaperMill AI</span> needs 500 tons of birch pulpwood.
                        It searches Agora for a <span className="highlight">trusted lumber supplier</span>.
                    </div>
                </div>

                {/* Phase: Search Candidates */}
                <div className={`kiosk-phase phase-search ${phase === 'search' ? 'visible' : ''}`}>
                    <div className="search-title">
                        🔍 Searching Agora for <span>lumber suppliers</span>...
                    </div>
                    <div className="search-candidates">
                        {CANDIDATES.map((c, i) => (
                            <div
                                key={c.name}
                                className={`candidate-card ${candidatesVisible[i] ? 'visible' : ''} ${candidateSelected === i ? 'selected' : candidateSelected >= 0 && candidateSelected !== i ? 'rejected' : ''}`}
                                style={{ transitionDelay: `${i * 100}ms` }}
                            >
                                <div className="candidate-header">
                                    <div className="candidate-avatar">{c.icon}</div>
                                    <div>
                                        <div className="candidate-name">{c.name}</div>
                                        <div className="candidate-type">{c.type}</div>
                                    </div>
                                </div>
                                <div className="candidate-score">
                                    <span className="candidate-score-label">Trust</span>
                                    <div className="candidate-score-bar">
                                        <div
                                            className={`candidate-score-fill ${trustColor(c.trust)}`}
                                            style={{ width: candidatesVisible[i] ? `${c.trust * 100}%` : '0%' }}
                                        />
                                    </div>
                                    <span className={`candidate-score-value color-${trustColor(c.trust)}`}>
                                        {c.trust.toFixed(3)}
                                    </span>
                                </div>
                                <div className="candidate-meta">
                                    <span>📊 {c.calls} txns</span>
                                    <span>⬆️ {c.uptime} uptime</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Phase: Trust Building */}
                <div className={`kiosk-phase phase-trust ${phase === 'trust' ? 'visible' : ''}`}>
                    <div className="trust-header">
                        <div className="trust-header-agent">
                            🌲 Green Forest Lumber
                            <span className="agent-badge">✅ Verifying</span>
                        </div>
                        <div className="trust-header-did">did:agora:green-forest-lumber-0x7f3a</div>
                    </div>

                    <div className="trust-components">
                        {TRUST_COMPONENTS.map((c, i) => (
                            <div key={c.label} className={`trust-row ${trustVisible[i] ? 'visible' : ''}`}>
                                <span className="trust-row-icon">{c.icon}</span>
                                <span className="trust-row-label">{c.label}</span>
                                <div className="trust-row-bar">
                                    <div
                                        className={`trust-row-fill ${trustColor(c.score)}`}
                                        style={{ width: `${trustFills[i] * 100}%` }}
                                    />
                                </div>
                                <span className={`trust-row-value color-${trustColor(c.score)}`}>
                                    {(trustFills[i]).toFixed(3)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {compositeScore > 0 && (
                        <div className="trust-composite">
                            <div className="trust-composite-big">
                                <div className="trust-composite-label">Composite Trust Score</div>
                                <div className={`trust-composite-number color-${trustColor(compositeScore)}`}>
                                    {compositeScore.toFixed(3)}
                                </div>
                                <div className="trust-composite-level">HIGH TRUST</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Phase: Dialogue */}
                <div className={`kiosk-phase phase-dialogue ${phase === 'dialogue' ? 'visible' : ''}`}>
                    {DIALOGUE.map((d, i) => (
                        <div
                            key={i}
                            className={`dialogue-bubble ${d.side} ${dialogueVisible[i] ? 'visible' : ''}`}
                        >
                            <span className="dialogue-avatar">{d.icon}</span>
                            <div className="dialogue-body">
                                <div className="dialogue-sender">{d.sender}</div>
                                <div className="dialogue-text">{d.text}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Phase: Transaction Complete */}
                <div className={`kiosk-phase phase-transaction ${phase === 'transaction' ? 'visible' : ''}`}>
                    <div className="tx-check">✅</div>
                    <div className="tx-title">Transaction Complete</div>
                    <div className="tx-grid">
                        <div className="tx-card">
                            <div className="tx-card-label">Order Total</div>
                            <div className="tx-card-value white">$47,500</div>
                        </div>
                        <div className="tx-card">
                            <div className="tx-card-label">Agora Commission</div>
                            <div className="tx-card-value red">$4,750</div>
                        </div>
                        <div className="tx-card">
                            <div className="tx-card-label">Seller Received</div>
                            <div className="tx-card-value green">$42,750</div>
                        </div>
                        <div className="tx-card">
                            <div className="tx-card-label">Trust Score</div>
                            <div className="tx-card-value blue">0.912 → 0.918</div>
                        </div>
                    </div>
                    <div className="tx-tagline">
                        Every transaction makes the network <strong>smarter</strong>.
                    </div>
                </div>

                {/* Restart overlay */}
                <div className={`kiosk-restart ${phase === 'restart' ? 'visible' : ''}`}>
                    <div className="kiosk-restart-icon">🏛️</div>
                    <div className="kiosk-restart-text">AGORA — The Trust Layer for the AI Economy</div>
                </div>
            </div>

            {/* ── Bottom Ticker ─────────────────────── */}
            <div className="kiosk-ticker">
                <span className="kiosk-ticker-item">
                    📊 <span className="kiosk-ticker-value">16,000+</span> AI tools published
                </span>
                <span className="kiosk-ticker-item">
                    📥 <span className="kiosk-ticker-value">97M</span> SDK downloads
                </span>
                <span className="kiosk-ticker-item">
                    📈 <span className="kiosk-ticker-value">$52B</span> market by 2030
                </span>
                <span className="kiosk-ticker-item">
                    🛡️ <span className="kiosk-ticker-value">6-Signal</span> Trust Engine
                </span>
            </div>
        </div>
    );
}
