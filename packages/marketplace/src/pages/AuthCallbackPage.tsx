import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

/**
 * OAuth callback page — Supabase redirects here after GitHub auth.
 * Exchanges the auth code, then redirects to marketplace.
 */
export default function AuthCallbackPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuth = async () => {
            const { error } = await supabase.auth.getSession();
            if (error) {
                console.error('Auth callback error:', error);
            }
            // Redirect to marketplace after auth
            navigate('/marketplace', { replace: true });
        };

        handleAuth();
    }, [navigate]);

    return (
        <div className="page container" style={{ textAlign: 'center', paddingTop: 'var(--space-20)' }}>
            <div style={{
                width: 48,
                height: 48,
                border: '3px solid var(--color-border)',
                borderTopColor: 'var(--color-primary)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto var(--space-6)',
            }} />
            <p style={{ color: 'var(--color-text-secondary)' }}>Authenticating...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
