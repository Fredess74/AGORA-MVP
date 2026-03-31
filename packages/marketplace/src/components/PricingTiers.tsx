/* ═══════════════════════════════════════════════════════════
   PricingTiers — 3-tier pricing display for agent products
   ═══════════════════════════════════════════════════════════ */

import { PRICING, getUserPlan, setUserPlan, type PricingPlan } from '../lib/usageTracker';
import './PricingTiers.css';

interface Props {
    agentId: string;
    onPlanChange?: (plan: PricingPlan) => void;
}

export default function PricingTiers({ agentId, onPlanChange }: Props) {
    const currentPlan = getUserPlan(agentId);

    const handleSelect = (plan: PricingPlan) => {
        if (plan === currentPlan.plan) return;

        if (plan === 'per_call') {
            if (!confirm('Activate Pay-per-Call? You will be charged $0.01 for each call beyond the free tier.')) return;
        }
        if (plan === 'subscription') {
            if (!confirm(`Subscribe for $${PRICING.SUBSCRIPTION_PRICE}/mo? You get unlimited calls with priority support.`)) return;
        }

        setUserPlan(agentId, plan);
        onPlanChange?.(plan);
        // Force re-render by dispatching storage event
        window.dispatchEvent(new Event('storage'));
    };

    const tiers = [
        {
            id: 'free' as PricingPlan,
            name: 'Free',
            price: '$0',
            period: '',
            description: 'Try the agent with basic access',
            features: [
                `${PRICING.FREE_TIER_LIMIT} calls included`,
                'Basic report output',
                'Community support',
                'Standard latency',
            ],
            cta: currentPlan.plan === 'free' ? 'Current Plan' : 'Downgrade',
            accent: 'free',
        },
        {
            id: 'per_call' as PricingPlan,
            name: 'Pay per Call',
            price: `$${PRICING.PRICE_PER_CALL}`,
            period: '/call',
            description: 'Pay only for what you use',
            features: [
                `${PRICING.FREE_TIER_LIMIT} free calls, then $${PRICING.PRICE_PER_CALL}/call`,
                'Full report with all data sources',
                'Email support',
                'Priority latency',
                'Downloadable reports',
            ],
            cta: currentPlan.plan === 'per_call' ? 'Current Plan' : 'Activate',
            accent: 'pro',
        },
        {
            id: 'subscription' as PricingPlan,
            name: 'Unlimited',
            price: `$${PRICING.SUBSCRIPTION_PRICE}`,
            period: '/mo',
            description: 'Unlimited access for power users',
            features: [
                'Unlimited calls',
                'Full report + Google Trends + X data',
                'Priority support',
                'Fastest latency',
                'API access',
                'Export to PDF',
                'Custom focus prompts',
            ],
            cta: currentPlan.plan === 'subscription' ? 'Current Plan' : 'Subscribe',
            accent: 'unlimited',
            popular: true,
        },
    ];

    return (
        <div className="pricing-tiers">
            <h3 className="pricing-tiers__title">💳 Pricing</h3>
            <div style={{ padding: 'var(--space-3)', marginBottom: 'var(--space-4)', background: 'rgba(255,193,7,0.1)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', color: 'var(--color-warning)', textAlign: 'center' }}>
                🚧 Payment integration coming soon — all plans are currently free during Early Access
            </div>
            <div className="pricing-tiers__grid">
                {tiers.map(tier => (
                    <div
                        key={tier.id}
                        className={`pricing-card pricing-card--${tier.accent} ${currentPlan.plan === tier.id ? 'pricing-card--active' : ''} ${tier.popular ? 'pricing-card--popular' : ''}`}
                    >
                        {tier.popular && <div className="pricing-card__badge">Most Popular</div>}
                        <h4 className="pricing-card__name">{tier.name}</h4>
                        <div className="pricing-card__price">
                            <span className="pricing-card__amount">{tier.price}</span>
                            <span className="pricing-card__period">{tier.period}</span>
                        </div>
                        <p className="pricing-card__desc">{tier.description}</p>
                        <ul className="pricing-card__features">
                            {tier.features.map((f, i) => (
                                <li key={i}>✓ {f}</li>
                            ))}
                        </ul>
                        <button
                            className={`pricing-card__btn ${currentPlan.plan === tier.id ? 'pricing-card__btn--current' : ''}`}
                            onClick={() => handleSelect(tier.id)}
                            disabled={currentPlan.plan === tier.id}
                        >
                            {tier.cta}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
