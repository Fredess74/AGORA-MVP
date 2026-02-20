import { TrustLevel } from '../types';

interface TrustBadgeProps {
    score: number;
    level: TrustLevel;
    size?: 'sm' | 'md' | 'lg';
}

export default function TrustBadge({ score, level, size = 'sm' }: TrustBadgeProps) {
    const icon = level === 'high' ? '✓' : level === 'medium' ? '~' : '!';
    const label = level === 'high' ? 'Trusted' : level === 'medium' ? 'Moderate' : 'Low Trust';

    return (
        <span className={`trust-badge trust-badge--${level}`}>
            <span>{icon}</span>
            <span>{(score * 100).toFixed(0)}%</span>
            {size !== 'sm' && <span>· {label}</span>}
        </span>
    );
}
