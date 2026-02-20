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
                        🚀 Now in Public Beta
                    </span>
                </div>
                <h1 className="hero__title animate-in animate-delay-1">
                    The Trusted Marketplace for{' '}
                    <span className="hero__highlight">AI Agents</span>
                </h1>
                <p className="hero__subtitle animate-in animate-delay-2">
                    Discover, publish, and monetize MCP servers, AI agents, and automations
                    — with cryptographically verified trust scores.
                </p>
                <div className="hero__actions animate-in animate-delay-3">
                    <Link to="/marketplace" className="btn btn--primary btn--lg">
                        Explore Marketplace
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
                        <div className="stat__value">10K+</div>
                        <div className="stat__label">MCP Servers Indexed</div>
                    </div>
                    <div className="stat">
                        <div className="stat__value">&lt;10ms</div>
                        <div className="stat__label">Trust Verification</div>
                    </div>
                    <div className="stat">
                        <div className="stat__value">ZK</div>
                        <div className="stat__label">Cryptographic Proofs</div>
                    </div>
                    <div className="stat">
                        <div className="stat__value">4</div>
                        <div className="stat__label">Protocols Supported</div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features container">
                <h2 className="features__title">Why Agora?</h2>
                <p className="features__subtitle">
                    The only marketplace with mathematically provable trust scoring.
                </p>
                <div className="features__grid">
                    <div className="card feature-card">
                        <div className="feature-card__icon" style={{ background: 'linear-gradient(135deg, #DC1A00, #8b1a00)' }}>
                            🔐
                        </div>
                        <h3 className="feature-card__title">ZK-Verified Trust</h3>
                        <p className="feature-card__text">
                            Every trust score is backed by zero-knowledge proofs. Verify without exposing data.
                            No other marketplace offers this level of cryptographic guarantee.
                        </p>
                    </div>

                    <div className="card feature-card">
                        <div className="feature-card__icon" style={{ background: 'linear-gradient(135deg, #ff3318, #DC1A00)' }}>
                            💰
                        </div>
                        <h3 className="feature-card__title">Instant Monetization</h3>
                        <p className="feature-card__text">
                            List your MCP server, AI agent, or automation in minutes. Set your pricing —
                            per-call, subscription, or free tier. We handle billing and payouts.
                        </p>
                    </div>

                    <div className="card feature-card">
                        <div className="feature-card__icon" style={{ background: 'linear-gradient(135deg, #DC1A00, #990000)' }}>
                            🔌
                        </div>
                        <h3 className="feature-card__title">Multi-Protocol</h3>
                        <p className="feature-card__text">
                            MCP, A2A, AP2, x402 — we support every major AI agent protocol.
                            Your agents discover and pay each other automatically.
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
                        Join creators already earning with their MCP servers,
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
