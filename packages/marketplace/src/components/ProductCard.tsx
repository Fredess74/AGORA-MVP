import { Link } from 'react-router-dom';
import { Product } from '../types';
import TrustBadge from './TrustBadge';

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

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const iconClass =
        product.type === 'mcp_server'
            ? 'product-card__icon--mcp'
            : product.type === 'ai_agent'
                ? 'product-card__icon--agent'
                : 'product-card__icon--automation';

    const hasUsageData = product.totalCalls > 0;

    return (
        <Link to={`/marketplace/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card card--clickable product-card">
                <div className="product-card__header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div className={`product-card__icon ${iconClass}`}>
                            {typeIcon(product.type)}
                        </div>
                        <div>
                            <div className="product-card__title">{product.name}</div>
                            <div className="product-card__author">
                                by {product.author} · {typeLabel(product.type)}
                            </div>
                        </div>
                    </div>
                    <TrustBadge score={product.trustScore} level={product.trustLevel} />
                </div>

                <p className="product-card__description">{product.description}</p>

                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                    {product.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                    ))}
                </div>

                <div className="product-card__footer">
                    <div className="product-card__stats">
                        {hasUsageData ? (
                            <>
                                <span className="product-card__stat">
                                    ⬆ {formatNumber(product.totalCalls)} calls
                                </span>
                                <span className="product-card__stat">
                                    👥 {formatNumber(product.totalUsers)} users
                                </span>
                                {product.rating > 0 && (
                                    <span className="product-card__stat">
                                        ⭐ {product.rating.toFixed(1)}
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="product-card__stat" style={{ color: 'var(--color-text-muted)' }}>
                                🆕 New · No usage data yet
                            </span>
                        )}
                    </div>
                    <span className={`product-card__price ${product.pricingModel === 'free' ? 'product-card__price--free' : ''}`}>
                        {formatPrice(product)}
                    </span>
                </div>
            </div>
        </Link>
    );
}
