import { Link } from 'react-router-dom';
import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useStore } from '../store/useStore';

export default function LandingPage() {
    const { products, isLoading } = useStore();
    const featured = [...products].sort((a, b) => b.trustScore - a.trustScore).slice(0, 3);
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<'claude' | 'cursor' | 'generic'>('claude');

    const snippets = {
        claude: `// claude_desktop_config.json
{
  "mcpServers": {
    "agora": {
      "command": "node",
      "args": ["path/to/agora/packages/mcp-server/dist/index.js"]
    }
  }
}`,
        cursor: `// .cursor/mcp.json
{
  "mcpServers": {
    "agora": {
      "command": "node",
      "args": ["path/to/agora/packages/mcp-server/dist/index.js"]
    }
  }
}`,
        generic: `# Clone and build
git clone https://github.com/agoramarket/agora
cd agora/packages/mcp-server
npm install && npm run build

# Run the server
node dist/index.js

# 8 tools: search, compare,
# trust-check, execute, and more`,
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(snippets[activeTab]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div>
            {/* Hero */}
            <section className="hero container">
                <div className="hero__glow" />
                <div className="animate-in">
                    <span className="hero__badge">
                        🚀 Early Access
                    </span>
                </div>
                <h1 className="hero__title animate-in animate-delay-1">
                    The Trusted Marketplace for{' '}
                    <span className="hero__highlight">AI Agents</span>
                </h1>
                <p className="hero__subtitle animate-in animate-delay-2">
                    Discover, publish, and compare MCP servers and AI agents
                    — with real-time computed trust scores.
                </p>
                <div className="hero__actions animate-in animate-delay-3">
                    <Link to="/marketplace" className="btn btn--primary btn--lg">
                        Explore Marketplace
                    </Link>
                    <Link to="/kiosk" className="btn btn--primary btn--lg" style={{ background: 'linear-gradient(135deg, #DC1A00, #ff4433)' }}>
                        🎬 Live Demo
                    </Link>
                    <Link to="/auth" className="btn btn--secondary btn--lg">
                        List Your Agent →
                    </Link>
                </div>
            </section>

            {/* Stats */}
            <section className="container">
                <div className="stats-row">
                    <div className="stat">
                        <div className="stat__value">{products.length || '—'}</div>
                        <div className="stat__label">Registered Agents</div>
                    </div>
                    <div className="stat">
                        <div className="stat__value">Real-Time</div>
                        <div className="stat__label">Trust Verification</div>
                    </div>
                    <div className="stat">
                        <div className="stat__value">6-Signal</div>
                        <div className="stat__label">Trust Engine</div>
                    </div>
                    <div className="stat">
                        <div className="stat__value">MCP</div>
                        <div className="stat__label">Protocol Native</div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features container">
                <h2 className="features__title">Why Agora?</h2>
                <p className="features__subtitle">
                    The only marketplace with real-time, formula-driven trust scoring.
                </p>
                <div className="features__grid">
                    <div className="card feature-card">
                        <div className="feature-card__icon" style={{ background: 'linear-gradient(135deg, #DC1A00, #8b1a00)' }}>
                            🔐
                        </div>
                        <h3 className="feature-card__title">6-Signal Trust Engine</h3>
                        <p className="feature-card__text">
                            Every agent is scored across 6 dimensions: Identity, Capability, Response Time,
                            Execution Quality, Peer Review, and History — computed live, not self-reported.
                        </p>
                    </div>

                    <div className="card feature-card">
                        <div className="feature-card__icon" style={{ background: 'linear-gradient(135deg, #ff3318, #DC1A00)' }}>
                            💰
                        </div>
                        <h3 className="feature-card__title">List & Discover</h3>
                        <p className="feature-card__text">
                            Register your MCP server or AI agent in minutes. Set your pricing model —
                            per-call, subscription, or free. Buyers find you through trust-ranked search.
                        </p>
                    </div>

                    <div className="card feature-card">
                        <div className="feature-card__icon" style={{ background: 'linear-gradient(135deg, #DC1A00, #990000)' }}>
                            🔌
                        </div>
                        <h3 className="feature-card__title">MCP-First Architecture</h3>
                        <p className="feature-card__text">
                            Built natively on the Model Context Protocol.
                            Works directly inside Claude, Gemini, ChatGPT, and Cursor — no extra integration needed.
                        </p>
                    </div>
                </div>
            </section>

            {/* ═══ How It Works ═══ */}
            <section className="container" style={{ padding: 'var(--space-20) 0' }}>
                <h2 className="features__title">How It Works</h2>
                <p className="features__subtitle">
                    From listing to trusted transaction — in three steps.
                </p>
                <div className="hiw-pipeline">
                    <div className="hiw-step">
                        <div className="hiw-step__number">1</div>
                        <div className="hiw-step__icon">📋</div>
                        <h3 className="hiw-step__title">List</h3>
                        <p className="hiw-step__text">
                            Developer registers their MCP server or AI agent. 
                            Agora verifies identity via GitHub and analyzes the tool schema.
                        </p>
                    </div>
                    <div className="hiw-arrow">→</div>
                    <div className="hiw-step">
                        <div className="hiw-step__number">2</div>
                        <div className="hiw-step__icon">🔬</div>
                        <h3 className="hiw-step__title">Trust</h3>
                        <p className="hiw-step__text">
                            The 6-signal engine evaluates the agent across Identity, Capability, 
                            Response Time, Execution Quality, Peer Review, and History — live EWMA scoring.
                        </p>
                    </div>
                    <div className="hiw-arrow">→</div>
                    <div className="hiw-step">
                        <div className="hiw-step__number">3</div>
                        <div className="hiw-step__icon">🚀</div>
                        <h3 className="hiw-step__title">Discover & Use</h3>
                        <p className="hiw-step__text">
                            Buyers search by capability, trust-ranked results surface the best agents. 
                            Connect via MCP — agents work inside your existing AI tools.
                        </p>
                    </div>
                </div>

                {/* Pipeline visual */}
                <div className="hiw-flow">
                    <div className="hiw-flow__step">Developer</div>
                    <div className="hiw-flow__connector" />
                    <div className="hiw-flow__step hiw-flow__step--active">Trust Engine</div>
                    <div className="hiw-flow__connector" />
                    <div className="hiw-flow__step">Discovery</div>
                    <div className="hiw-flow__connector" />
                    <div className="hiw-flow__step">MCP Connect</div>
                    <div className="hiw-flow__connector" />
                    <div className="hiw-flow__step hiw-flow__step--active">Trust Updated</div>
                </div>
            </section>

            {/* ═══ MCP Connect Snippet ═══ */}
            <section className="container" style={{ paddingBottom: 'var(--space-20)' }}>
                <h2 className="features__title">Connect in 30 Seconds</h2>
                <p className="features__subtitle">
                    Add Agora to your AI assistant with a single config change.
                </p>
                <div className="mcp-connect">
                    <div className="mcp-connect__tabs">
                        {(['claude', 'cursor', 'generic'] as const).map(tab => (
                            <button 
                                key={tab}
                                className={`mcp-connect__tab ${activeTab === tab ? 'mcp-connect__tab--active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab === 'claude' ? '🟠 Claude' : tab === 'cursor' ? '⚡ Cursor' : '📦 npm'}
                            </button>
                        ))}
                    </div>
                    <div className="mcp-connect__code">
                        <button className="mcp-connect__copy" onClick={handleCopy}>
                            {copied ? '✓ Copied!' : '📋 Copy'}
                        </button>
                        <pre><code>{snippets[activeTab]}</code></pre>
                    </div>
                    <p style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-3)' }}>
                        8 tools available • Search, Compare, Trust-Check, Execute, and more
                    </p>
                </div>
            </section>

            {/* ═══ EU AI Act — Regulatory Info ═══ */}
            <section className="container" style={{ paddingBottom: 'var(--space-20)' }}>
                <div className="regulation-banner">
                    <div className="regulation-banner__icon">🏛️</div>
                    <div className="regulation-banner__content">
                        <h3 className="regulation-banner__title">
                            Built for the EU AI Act Era
                        </h3>
                        <p className="regulation-banner__text">
                            The EU AI Act (Regulation 2024/1689) takes full effect <strong>August 2, 2026</strong>. 
                            It requires AI systems to maintain audit trails, provide transparency reports, 
                            and implement risk management for high-risk applications.
                        </p>
                        <p className="regulation-banner__text">
                            Agora's trust engine generates verifiable execution logs aligned with 
                            Articles 9 (Risk Management), 12 (Record-Keeping), 13 (Transparency), 
                            and 14 (Human Oversight). Every transaction creates an append-only audit trail 
                            — the infrastructure compliance teams will need.
                        </p>
                        <div className="regulation-banner__tags">
                            <span className="tag">Art. 9 — Risk Management</span>
                            <span className="tag">Art. 12 — Logging</span>
                            <span className="tag">Art. 13 — Transparency</span>
                            <span className="tag">Art. 14 — Human Oversight</span>
                            <span className="tag">Art. 15 — Accuracy</span>
                            <span className="tag">Art. 17 — Quality Management</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ Social Proof ═══ */}
            <section className="container" style={{ paddingBottom: 'var(--space-16)' }}>
                <div className="social-proof">
                    <div className="social-proof__built-with">
                        <span className="social-proof__label">Built With</span>
                        <div className="social-proof__logos">
                            <span className="social-proof__logo">⚛️ React</span>
                            <span className="social-proof__divider">•</span>
                            <span className="social-proof__logo">🔷 TypeScript</span>
                            <span className="social-proof__divider">•</span>
                            <span className="social-proof__logo">⚡ Supabase</span>
                            <span className="social-proof__divider">•</span>
                            <span className="social-proof__logo">🤖 Gemini 2.0</span>
                            <span className="social-proof__divider">•</span>
                            <span className="social-proof__logo">🔌 MCP Protocol</span>
                        </div>
                    </div>
                    <div className="social-proof__metrics">
                        <div className="social-proof__metric">
                            <span className="social-proof__metric-value">6</span>
                            <span className="social-proof__metric-label">Trust Signals</span>
                        </div>
                        <div className="social-proof__metric">
                            <span className="social-proof__metric-value">31</span>
                            <span className="social-proof__metric-label">Test Cases</span>
                        </div>
                        <div className="social-proof__metric">
                            <span className="social-proof__metric-value">3</span>
                            <span className="social-proof__metric-label">Live Specialist Agents</span>
                        </div>
                        <div className="social-proof__metric">
                            <span className="social-proof__metric-value">8</span>
                            <span className="social-proof__metric-label">MCP Tools</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            {featured.length > 0 && (
                <section className="container" style={{ paddingBottom: 'var(--space-16)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
                        <h2 className="features__title" style={{ textAlign: 'left', marginBottom: 0 }}>Top Trusted Products</h2>
                        <Link to="/marketplace" className="btn btn--secondary">
                            View All →
                        </Link>
                    </div>
                    <div className="grid-products">
                        {featured.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            )}

            {/* Empty state when no products yet */}
            {!isLoading && products.length === 0 && (
                <section className="container" style={{ textAlign: 'center', padding: 'var(--space-16) 0' }}>
                    <div style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-4)' }}>🏛️</div>
                    <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-3)' }}>Marketplace Coming Soon</h2>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
                        Be the first to list your AI agent or MCP server on Agora.
                    </p>
                    <Link to="/auth" className="btn btn--primary btn--lg">
                        Become a Creator →
                    </Link>
                </section>
            )}

            {/* CTA */}
            <section className="cta container">
                <div className="cta__box">
                    <h2 className="cta__title">Ready to monetize your AI?</h2>
                    <p className="cta__text">
                        Be among the first to list your MCP servers,
                        AI agents, and automations on Agora.
                    </p>
                    <div className="hero__actions">
                        <Link to="/auth" className="btn btn--primary btn--lg">
                            Get Started Free
                        </Link>
                        <a href="https://github.com/Fredess74/AGORA-MVP#readme" className="btn btn--secondary btn--lg" target="_blank" rel="noreferrer">
                            Read the Docs
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

