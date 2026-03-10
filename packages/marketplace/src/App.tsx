import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import MarketplacePage from './pages/MarketplacePage';
import ProductDetailPage from './pages/ProductDetailPage';
import AuthPage from './pages/AuthPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import CreateAgentPage from './pages/CreateAgentPage';
import DashboardPage from './pages/DashboardPage';
import TrendsPage from './pages/TrendsPage';
import DemoPage from './pages/DemoPage';
import { useStore } from './store/useStore';

export default function App() {
    const { loadProducts, initAuth } = useStore();

    useEffect(() => {
        initAuth();
        loadProducts();
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/marketplace" element={<MarketplacePage />} />
                    <Route path="/marketplace/:slug" element={<ProductDetailPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/auth/callback" element={<AuthCallbackPage />} />
                    <Route path="/create" element={<CreateAgentPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/trends" element={<TrendsPage />} />
                    <Route path="/demo" element={<DemoPage />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

function NotFound() {
    return (
        <div className="page container" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--text-5xl)', marginBottom: 'var(--space-4)' }}>🏛</div>
            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
                Page Not Found
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
                The page you're looking for doesn't exist.
            </p>
            <a href="/" className="btn btn--primary">Go Home</a>
        </div>
    );
}
