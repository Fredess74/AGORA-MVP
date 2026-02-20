import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function Navbar() {
    const location = useLocation();
    const { isAuthenticated, user, logout } = useStore();

    const isActive = (path: string) =>
        location.pathname === path ? 'navbar__link navbar__link--active' : 'navbar__link';

    return (
        <nav className="navbar">
            <div className="navbar__inner">
                <Link to="/" className="navbar__logo">
                    <span className="navbar__logo-icon" style={{
                        background: 'linear-gradient(135deg, #DC1A00, #8b1a00)',
                        fontSize: '16px',
                        fontWeight: 800,
                        letterSpacing: '0.05em',
                    }}>A</span>
                    <span style={{ letterSpacing: '0.15em', textTransform: 'uppercase' }}>Agora</span>
                </Link>

                <ul className="navbar__links">
                    <li>
                        <Link to="/marketplace" className={isActive('/marketplace')}>
                            Marketplace
                        </Link>
                    </li>
                    <li>
                        <a href="https://github.com/Fredess74/AGORA-MVP#readme" className="navbar__link" target="_blank" rel="noreferrer">
                            Docs
                        </a>
                    </li>
                    <li>
                        <a href="https://github.com/Fredess74/AGORA-MVP" className="navbar__link" target="_blank" rel="noreferrer">
                            GitHub
                        </a>
                    </li>
                </ul>

                <div className="navbar__actions">
                    {isAuthenticated && user ? (
                        <>
                            <Link to="/create" className="btn btn--primary btn--sm">
                                + Create
                            </Link>
                            <Link to="/dashboard" className="btn btn--ghost btn--sm">
                                Dashboard
                            </Link>
                            <button onClick={logout} className="btn btn--ghost btn--sm">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/auth" className="btn btn--ghost">
                                Log in
                            </Link>
                            <Link to="/auth" className="btn btn--primary">
                                Sign up free
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
