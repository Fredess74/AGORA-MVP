import { Link } from 'react-router-dom';
import { signInWithGitHub } from '../lib/database';

export default function AuthPage() {
    const handleGitHubLogin = async () => {
        await signInWithGitHub();
    };

    return (
        <div className="page container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - var(--header-height))' }}>
            <div style={{ width: '100%', maxWidth: 420 }}>
                <div className="card" style={{ padding: 'var(--space-10)' }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                        <div style={{
                            width: 56,
                            height: 56,
                            background: 'linear-gradient(135deg, #DC1A00, #8b1a00)',
                            borderRadius: 'var(--radius-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 'var(--text-2xl)',
                            fontWeight: 800,
                            margin: '0 auto var(--space-4)',
                            letterSpacing: '0.05em',
                        }}>A</div>
                        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                            Welcome to Agora
                        </h1>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                            Sign in to publish, discover, and monetize AI agents.
                        </p>
                    </div>

                    {/* GitHub OAuth Button */}
                    <button
                        className="btn btn--lg"
                        style={{
                            width: '100%',
                            background: '#24292e',
                            color: '#fff',
                            marginBottom: 'var(--space-4)',
                            fontSize: 'var(--text-base)',
                        }}
                        onClick={handleGitHubLogin}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 8 }}>
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        Continue with GitHub
                    </button>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', margin: 'var(--space-6) 0' }}>
                        <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>or</span>
                        <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
                    </div>

                    {/* Email (future) */}
                    <input
                        type="email"
                        className="input"
                        placeholder="Email address"
                        style={{ marginBottom: 'var(--space-3)' }}
                        disabled
                    />
                    <button className="btn btn--secondary btn--lg" style={{ width: '100%' }} disabled>
                        Continue with Email (Coming Soon)
                    </button>

                    {/* Terms */}
                    <p style={{ marginTop: 'var(--space-6)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
                        By signing in, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>

                <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
                    <Link to="/" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
