import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useStore } from '../store/useStore';

export default function LandingPage() {
    const { products, isLoading } = useStore();
    const featured = products.filter((p) => p.trustScore >= 0.8).slice(0, 3);

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
                    <Link to="/demo" className="btn btn--primary btn--lg" style={{ background: 'linear-gradient(135deg, #DC1A00, #ff4433)' }}>
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
