import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { fetchProductBySlug } from '../lib/database';
import { Product } from '../types';
import TrustBadge from '../components/TrustBadge';
import TryAgent from '../components/TryAgent';
import PricingTiers from '../components/PricingTiers';
import ReviewSection from '../components/ReviewSection';
import UsageDashboard from '../components/UsageDashboard';
import { getStats } from '../lib/usageTracker';

function formatNumber(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toString();
}

function formatPrice(product: Product): string {
    if (product.pricingModel === 'free') return 'Free';
    if (product.pricingModel === 'per_call' && product.pricePerCallUsd) {
        return `$${product.pricePerCallUsd}/call`;
    }
    if (product.pricingModel === 'subscription' && product.subscriptionPriceUsd) {
        return `$${product.subscriptionPriceUsd}/mo`;
    }
    return 'Free';
}

function typeLabel(type: Product['type']): string {
    switch (type) {
        case 'mcp_server': return 'MCP Server';
        case 'ai_agent': return 'AI Agent';
        case 'skill': return 'Skill';
        case 'automation': return 'Automation';
        default: return type;
    }
}

function typeIcon(type: Product['type']): string {
    switch (type) {
        case 'mcp_server': return '🔌';
        case 'ai_agent': return '🤖';
        case 'skill': return '📋';
        case 'automation': return '⚡';
        default: return '•';
    }
}

export default function ProductDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const [toast, setToast] = useState<string | null>(null);

    const refresh = useCallback(() => setRefreshKey(k => k + 1), []);
    const showToast = useCallback((msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    }, []);
    const copySnippet = useCallback(() => {
        navigator.clipboard.writeText(`npx mcp-add agora://${product?.slug || 'unknown'}`);
        showToast('✅ Copied to clipboard!');
    }, [product?.slug, showToast]);

    useEffect(() => {
        async function load() {
            if (!slug) return;
            setLoading(true);
            const p = await fetchProductBySlug(slug);
            setProduct(p);
            setLoading(false);
        }
        load();
    }, [slug]);

    if (loading) {
        return (
            <div className="page container" style={{ textAlign: 'center', paddingTop: 'var(--space-20)' }}>
                <div style={{
                    width: 48, height: 48,
                    border: '3px solid var(--color-border)',
                    borderTopColor: 'var(--color-primary)',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    margin: '0 auto',
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="page container" style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-4)' }}>404</h1>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>Product not found</p>
                <Link to="/marketplace" className="btn btn--primary">Back to Marketplace</Link>
            </div>
        );
    }

    // Use live stats from usageTracker (falls back to seed data)
    const liveStats = getStats(product.id);
    const hasLiveData = liveStats.totalCalls > 0;
    const trustScore = hasLiveData ? liveStats.trustScore : product.trustScore;
    const trustPercent = (trustScore * 100).toFixed(0);
    const avgLatency = hasLiveData ? liveStats.avgLatencyMs : product.avgLatencyMs;
    const uptime = hasLiveData ? liveStats.uptime : product.uptime;
    const rating = hasLiveData && liveStats.reviewCount > 0 ? liveStats.rating : product.rating;
    const reviewCount = hasLiveData ? liveStats.reviewCount + product.reviewCount : product.reviewCount;
    const totalCalls = (hasLiveData ? liveStats.totalCalls : 0) + product.totalCalls;

    return (
        <div className="page container">
            {/* Breadcrumb */}
            <div style={{ marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                <Link to="/marketplace" style={{ color: 'var(--color-text-muted)' }}>Marketplace</Link>
                {' → '}
                <span style={{ color: 'var(--color-text-secondary)' }}>{product.name}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--space-8)', alignItems: 'start' }}>
                {/* Main Content */}
                <div>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                        <div
                            className={`product-card__icon ${product.type === 'mcp_server'
                                ? 'product-card__icon--mcp'
                                : product.type === 'ai_agent'
                                    ? 'product-card__icon--agent'
                                    : 'product-card__icon--automation'
                                }`}
                            style={{ width: 64, height: 64, fontSize: 'var(--text-3xl)' }}
                        >
                            {typeIcon(product.type)}
                        </div>
                        <div>
                            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: 'var(--space-1)' }}>
                                {product.name}
                            </h1>
                            <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                                by <strong>{product.author}</strong> · {typeLabel(product.type)}
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
                        {product.tags.map((tag) => (
                            <span key={tag} className="tag">{tag}</span>
                        ))}
                    </div>

                    {/* Description */}
                    <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
                            About
                        </h2>
                        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                            {product.description}
                        </p>
                    </div>

                    {/* Trust Score Breakdown */}
                    <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-6)' }}>
                            Trust Score Breakdown
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                            <TrustMetric label="Overall Trust" value={`${trustPercent}%`} bar={trustScore} />
                            <TrustMetric label="Uptime" value={`${uptime}%`} bar={uptime / 100} />
                            <TrustMetric label="Avg Latency" value={`${avgLatency}ms`} bar={Math.max(0, 1 - avgLatency / 5000)} />
                            <TrustMetric label="User Rating" value={`${rating}/5`} bar={rating / 5} />
                        </div>
                        <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--color-primary-light)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', color: 'var(--color-primary-hover)' }}>
                            🛡️ Trust score computed via Agora's 6-signal engine: Identity, Capability, Response Time, Execution Quality, Peer Review, History.
                        </div>
                    </div>

                    {/* Quick Start */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>
                                Quick Start
                            </h2>
                            <button className="btn btn--sm btn--secondary" onClick={copySnippet}>
                                📋 Copy
                            </button>
                        </div>
                        <div style={{ background: 'var(--color-bg)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-primary-hover)', overflowX: 'auto' }}>
                            <div style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}># Install via MCP</div>
                            <div>npx mcp-add agora://{product.slug}</div>
                            <br />
                            <div style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}># Or use the API directly</div>
                            <div>curl -H "Authorization: Bearer YOUR_KEY" \</div>
                            <div style={{ paddingLeft: 'var(--space-4)' }}>https://api.agora.dev/v1/marketplace/use/{product.did}</div>
                        </div>
                    </div>

                    {/* Pricing Tiers */}
                    <PricingTiers agentId={product.id} onPlanChange={refresh} />

                    {/* Interactive Agent Demo or Endpoint Tester */}
                    {product.slug === 'agora-trend-analyst' ? (
                        <TryAgent onCallComplete={refresh} />
                    ) : (
                        <EndpointTester product={product} />
                    )}

                    {/* Usage Dashboard */}
                    <UsageDashboard agentId={product.id} refreshKey={refreshKey} />

                    {/* Reviews */}
                    <ReviewSection agentId={product.id} onReviewAdded={refresh} />
                </div>

                {/* Sidebar */}
                <div style={{ position: 'sticky', top: 'calc(var(--header-height) + var(--space-8))' }}>
                    <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
                        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
                            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: product.pricingModel === 'free' ? 'var(--color-success)' : 'var(--color-primary)' }}>
                                {formatPrice(product)}
                            </div>
                            {product.freetierCalls && product.pricingModel !== 'free' && (
                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
                                    {product.freetierCalls} free calls included
                                </div>
                            )}
                        </div>
                        <button className="btn btn--primary btn--lg" style={{ width: '100%', marginBottom: 'var(--space-3)' }} onClick={() => showToast('🚀 Subscription API launching soon!  Join the waitlist.')}>
                            {product.pricingModel === 'free' ? 'Get Started Free' : 'Subscribe Now'}
                        </button>
                        <button className="btn btn--secondary" style={{ width: '100%' }} onClick={() => window.open(`https://github.com/Fredess74/AGORA-MVP`, '_blank')}>
                            View API Docs
                        </button>
                    </div>

                    <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
                        <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                            Stats
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            <StatRow label="Total Calls" value={formatNumber(totalCalls)} />
                            <StatRow label="Active Users" value={formatNumber(product.totalUsers + (hasLiveData ? 1 : 0))} />
                            <StatRow label="Avg Latency" value={`${avgLatency}ms`} />
                            <StatRow label="Uptime" value={`${uptime}%`} />
                            <StatRow label="Reviews" value={reviewCount.toString()} />
                        </div>
                    </div>

                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                                Trust Level
                            </h3>
                            <TrustBadge score={trustScore} level={trustScore >= 0.8 ? 'high' : trustScore >= 0.5 ? 'medium' : 'low'} size="md" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {toast && (
                <div style={{
                    position: 'fixed', bottom: 'var(--space-6)', left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)', padding: 'var(--space-3) var(--space-6)',
                    fontSize: 'var(--text-sm)', color: 'var(--color-text)',
                    boxShadow: 'var(--shadow-lg)', zIndex: 1000, animation: 'fadeInUp 0.3s ease',
                }}>
                    {toast}
                </div>
            )}
        </div>
    );
}

/* ── Endpoint Tester ──────────────────────────────────── */

function EndpointTester({ product }: { product: Product }) {
    const [requestBody, setRequestBody] = useState(
        JSON.stringify(
            {
                prompt: 'Hello, what can you do?',
                context: {},
                max_tokens: 512,
            },
            null,
            2,
        ),
    );
    const [response, setResponse] = useState<string>('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [latency, setLatency] = useState(0);

    const handleSend = async () => {
        setStatus('loading');
        setResponse('');

        const start = performance.now();

        // Simulate the request with a realistic mock response
        await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 800));

        const elapsed = Math.round(performance.now() - start);
        setLatency(elapsed);

        try {
            JSON.parse(requestBody); // validate JSON
            setStatus('success');
            setResponse(
                JSON.stringify(
                    {
                        result: `Response from ${product.name}. Your request was processed successfully.`,
                        usage: {
                            tokens_used: Math.floor(Math.random() * 500) + 50,
                            latency_ms: elapsed,
                        },
                        metadata: {
                            model: product.slug,
                            did: product.did,
                            trust_score: product.trustScore,
                            timestamp: new Date().toISOString(),
                        },
                    },
                    null,
                    2,
                ),
            );
        } catch {
            setStatus('error');
            setResponse(
                JSON.stringify(
                    {
                        error: 'Invalid JSON in request body',
                        code: 'INVALID_REQUEST',
                    },
                    null,
                    2,
                ),
            );
        }
    };

    const statusLabel = {
        idle: '⚪ Ready',
        loading: '⏳ Sending...',
        success: `✅ 200 OK — ${latency}ms`,
        error: `❌ 400 Error — ${latency}ms`,
    }[status];

    return (
        <div className="endpoint-tester">
            <div className="endpoint-tester__header">
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
                    🧪 Try It — Endpoint Tester
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span className={`endpoint-tester__status endpoint-tester__status--${status === 'loading' ? 'idle' : status}`}>
                        {statusLabel}
                    </span>
                    <button
                        className="btn btn--primary btn--sm"
                        onClick={handleSend}
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? <span className="spinner" /> : '▶ Send'}
                    </button>
                </div>
            </div>
            <div className="endpoint-tester__body">
                <div className="endpoint-tester__pane">
                    <div className="endpoint-tester__pane-label">Request Body</div>
                    <textarea
                        className="endpoint-tester__code"
                        value={requestBody}
                        onChange={(e) => setRequestBody(e.target.value)}
                        spellCheck={false}
                    />
                </div>
                <div className="endpoint-tester__pane">
                    <div className="endpoint-tester__pane-label">Response</div>
                    <div className="endpoint-tester__output">
                        {status === 'loading' ? (
                            <span style={{ color: 'var(--color-text-muted)' }}>Waiting for response...</span>
                        ) : response ? (
                            response
                        ) : (
                            <span style={{ color: 'var(--color-text-muted)' }}>
                                Click Send to test the endpoint
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function TrustMetric({ label, value, bar }: { label: string; value: string; bar: number }) {
    const barColor = bar >= 0.8 ? 'var(--color-trust-high)' : bar >= 0.5 ? 'var(--color-trust-medium)' : 'var(--color-trust-low)';
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)', fontSize: 'var(--text-sm)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
                <span style={{ fontWeight: 600 }}>{value}</span>
            </div>
            <div style={{ height: 6, background: 'var(--color-bg)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(bar * 100, 100)}%`, background: barColor, borderRadius: 'var(--radius-full)', transition: 'width 0.5s ease' }} />
            </div>
        </div>
    );
}

function StatRow({ label, value }: { label: string; value: string }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>{label}</span>
            <span style={{ fontWeight: 500 }}>{value}</span>
        </div>
    );
}

