/* ═══════════════════════════════════════════════════════════
   Dashboard Page — My Agents, API Keys, Analytics
   ═══════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
    fetchMyListings,
    publishListing,
    unpublishListing,
    deleteListing as dbDeleteListing,
    fetchApiKeys,
    createApiKey,
    deleteApiKey as dbDeleteApiKey,
    fetchUsageStats,
} from '../lib/database';
import type { ApiKey } from '../lib/database';
import type { Product } from '../types';

type Tab = 'agents' | 'keys' | 'analytics';

export default function DashboardPage() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useStore();
    const [activeTab, setActiveTab] = useState<Tab>('agents');

    // Agent state
    const [myAgents, setMyAgents] = useState<Product[]>([]);
    const [agentsLoading, setAgentsLoading] = useState(true);

    // API Keys state
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [keysLoading, setKeysLoading] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [revealedKey, setRevealedKey] = useState<string | null>(null);

    // Analytics state
    const [usageStats, setUsageStats] = useState<{ date: string; count: number }[]>([]);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth');
        }
    }, [isAuthenticated, navigate]);

    // Load agents
    const loadAgents = useCallback(async () => {
        if (!user) return;
        setAgentsLoading(true);
        const agents = await fetchMyListings(user.id);
        setMyAgents(agents);
        setAgentsLoading(false);
    }, [user]);

    // Load API keys
    const loadKeys = useCallback(async () => {
        setKeysLoading(true);
        const keys = await fetchApiKeys();
        setApiKeys(keys);
        setKeysLoading(false);
    }, []);

    // Load analytics
    const loadAnalytics = useCallback(async () => {
        setAnalyticsLoading(true);
        const stats = await fetchUsageStats(undefined, 7);
        setUsageStats(stats);
        setAnalyticsLoading(false);
    }, []);

    useEffect(() => {
        loadAgents();
    }, [loadAgents]);

    useEffect(() => {
        if (activeTab === 'keys') loadKeys();
        if (activeTab === 'analytics') loadAnalytics();
    }, [activeTab, loadKeys, loadAnalytics]);

    // Actions
    const handleToggleStatus = async (agent: Product) => {
        if (agent.status === 'active') {
            await unpublishListing(agent.id);
        } else {
            await publishListing(agent.id);
        }
        loadAgents();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this agent? This cannot be undone.')) return;
        await dbDeleteListing(id);
        loadAgents();
    };

    const handleCreateKey = async () => {
        const result = await createApiKey(newKeyName || 'Default Key');
        if (result) {
            setRevealedKey(result.fullKey);
            setNewKeyName('');
            loadKeys();
        }
    };

    const handleDeleteKey = async (id: string) => {
        if (!confirm('Delete this API key?')) return;
        await dbDeleteApiKey(id);
        loadKeys();
    };

    // Stats
    const totalCalls = myAgents.reduce((sum, a) => sum + a.totalCalls, 0);
    const totalUsers = myAgents.reduce((sum, a) => sum + a.totalUsers, 0);
    const avgRating = myAgents.length > 0
        ? (myAgents.reduce((sum, a) => sum + a.rating, 0) / myAgents.length).toFixed(1)
        : '0.0';
    const activeCount = myAgents.filter((a) => a.status === 'active').length;

    return (
        <div className="page container">
            <div className="dashboard">
                {/* Header */}
                <div className="dashboard__header">
                    <div>
                        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>Dashboard</h1>
                        <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
                            Manage your agents, keys, and analytics
                        </p>
                    </div>
                    <Link to="/create" className="btn btn--primary">
                        + Create Agent
                    </Link>
                </div>

                {/* Stats Strip */}
                <div className="stats-strip">
                    <div className="stat-card">
                        <span className="stat-card__icon">🤖</span>
                        <div>
                            <span className="stat-card__value">{myAgents.length}</span>
                            <span className="stat-card__label">Total Agents</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-card__icon">🟢</span>
                        <div>
                            <span className="stat-card__value">{activeCount}</span>
                            <span className="stat-card__label">Active</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-card__icon">📞</span>
                        <div>
                            <span className="stat-card__value">{totalCalls.toLocaleString()}</span>
                            <span className="stat-card__label">Total Calls</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-card__icon">👥</span>
                        <div>
                            <span className="stat-card__value">{totalUsers.toLocaleString()}</span>
                            <span className="stat-card__label">Total Users</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-card__icon">⭐</span>
                        <div>
                            <span className="stat-card__value">{avgRating}</span>
                            <span className="stat-card__label">Avg Rating</span>
                        </div>
                    </div>
                </div>

                {/* Tab Nav */}
                <div className="dashboard__tabs">
                    {(['agents', 'keys', 'analytics'] as Tab[]).map((tab) => (
                        <button
                            key={tab}
                            className={`dashboard__tab ${activeTab === tab ? 'dashboard__tab--active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === 'agents' && '🤖 My Agents'}
                            {tab === 'keys' && '🔑 API Keys'}
                            {tab === 'analytics' && '📊 Analytics'}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="dashboard__content">
                    {activeTab === 'agents' && (
                        <AgentsTab
                            agents={myAgents}
                            loading={agentsLoading}
                            onToggle={handleToggleStatus}
                            onDelete={handleDelete}
                        />
                    )}
                    {activeTab === 'keys' && (
                        <KeysTab
                            keys={apiKeys}
                            loading={keysLoading}
                            newKeyName={newKeyName}
                            onNameChange={setNewKeyName}
                            onCreate={handleCreateKey}
                            onDelete={handleDeleteKey}
                            revealedKey={revealedKey}
                            onDismissKey={() => setRevealedKey(null)}
                        />
                    )}
                    {activeTab === 'analytics' && (
                        <AnalyticsTab
                            stats={usageStats}
                            loading={analyticsLoading}
                            totalCalls={totalCalls}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

/* ── My Agents Tab ────────────────────────────────────── */

function AgentsTab({
    agents,
    loading,
    onToggle,
    onDelete,
}: {
    agents: Product[];
    loading: boolean;
    onToggle: (agent: Product) => void;
    onDelete: (id: string) => void;
}) {
    if (loading) {
        return <div style={{ textAlign: 'center', padding: 'var(--space-10)' }}><span className="spinner" /></div>;
    }

    if (agents.length === 0) {
        return (
            <div className="empty-state">
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🤖</div>
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                    No agents yet
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
                    Create your first agent to start earning trust and connecting with users
                </p>
                <Link to="/create" className="btn btn--primary">Create Your First Agent</Link>
            </div>
        );
    }

    return (
        <div className="agents-list">
            {agents.map((agent) => (
                <div key={agent.id} className="agent-row">
                    <div className="agent-row__info">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            <span style={{ fontSize: '1.5rem' }}>
                                {agent.type === 'mcp_server' ? '🔌' : agent.type === 'ai_agent' ? '🤖' : '⚡'}
                            </span>
                            <div>
                                <Link
                                    to={`/marketplace/${agent.slug}`}
                                    style={{ fontWeight: 600, color: 'var(--color-text)' }}
                                >
                                    {agent.name}
                                </Link>
                                <div style={{
                                    display: 'flex',
                                    gap: 'var(--space-3)',
                                    marginTop: 'var(--space-1)',
                                    fontSize: 'var(--text-xs)',
                                    color: 'var(--color-text-muted)',
                                }}>
                                    <span>{agent.totalCalls} calls</span>
                                    <span>{agent.totalUsers} users</span>
                                    <span>⭐ {agent.rating.toFixed(1)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="agent-row__status">
                        <span className={`status-badge status-badge--${agent.status}`}>
                            {agent.status}
                        </span>
                    </div>
                    <div className="agent-row__trust">
                        <span className={`trust-badge trust-badge--${agent.trustLevel}`}>
                            {Math.round(agent.trustScore * 100)}%
                        </span>
                    </div>
                    <div className="agent-row__actions">
                        <button
                            className="btn btn--ghost btn--sm"
                            onClick={() => onToggle(agent)}
                            title={agent.status === 'active' ? 'Unpublish' : 'Publish'}
                        >
                            {agent.status === 'active' ? '⏸️' : '▶️'}
                        </button>
                        <button
                            className="btn btn--ghost btn--sm btn--danger"
                            onClick={() => onDelete(agent.id)}
                            title="Delete"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ── API Keys Tab ─────────────────────────────────────── */

function KeysTab({
    keys,
    loading,
    newKeyName,
    onNameChange,
    onCreate,
    onDelete,
    revealedKey,
    onDismissKey,
}: {
    keys: ApiKey[];
    loading: boolean;
    newKeyName: string;
    onNameChange: (name: string) => void;
    onCreate: () => void;
    onDelete: (id: string) => void;
    revealedKey: string | null;
    onDismissKey: () => void;
}) {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div>
            {/* Revealed Key Banner */}
            {revealedKey && (
                <div className="key-reveal">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                        <span style={{ color: 'var(--color-warning)' }}>⚠️</span>
                        <strong>Copy your API key now — it won't be shown again!</strong>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                        <code className="key-reveal__code">{revealedKey}</code>
                        <button className="btn btn--ghost btn--sm" onClick={() => copyToClipboard(revealedKey)}>
                            📋 Copy
                        </button>
                        <button className="btn btn--ghost btn--sm" onClick={onDismissKey}>
                            ✓ Done
                        </button>
                    </div>
                </div>
            )}

            {/* Create Key Form */}
            <div className="create-key-form">
                <input
                    className="field__input"
                    type="text"
                    placeholder="Key name (e.g. Production, Dev)"
                    value={newKeyName}
                    onChange={(e) => onNameChange(e.target.value)}
                    style={{ flex: 1 }}
                />
                <button className="btn btn--primary" onClick={onCreate}>
                    Generate Key
                </button>
            </div>

            {/* Keys List */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-10)' }}><span className="spinner" /></div>
            ) : keys.length === 0 ? (
                <div className="empty-state" style={{ padding: 'var(--space-10)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>🔑</div>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        No API keys yet. Generate one to authenticate your agent requests.
                    </p>
                </div>
            ) : (
                <div className="keys-list">
                    {keys.map((key) => (
                        <div key={key.id} className="key-row">
                            <div className="key-row__info">
                                <strong>{key.name}</strong>
                                <code className="key-row__prefix">{key.keyPrefix}••••••••</code>
                            </div>
                            <div className="key-row__meta">
                                <span className="key-row__scopes">
                                    {key.scopes.map((s) => (
                                        <span key={s} className="tag tag--sm">{s}</span>
                                    ))}
                                </span>
                                <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
                                    Created {new Date(key.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <button
                                className="btn btn--ghost btn--sm btn--danger"
                                onClick={() => onDelete(key.id)}
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ── Analytics Tab ────────────────────────────────────── */

function AnalyticsTab({
    stats,
    loading,
    totalCalls,
}: {
    stats: { date: string; count: number }[];
    loading: boolean;
    totalCalls: number;
}) {
    if (loading) {
        return <div style={{ textAlign: 'center', padding: 'var(--space-10)' }}><span className="spinner" /></div>;
    }

    const maxCount = Math.max(...stats.map((s) => s.count), 1);
    const totalWeek = stats.reduce((sum, s) => sum + s.count, 0);

    return (
        <div>
            {/* Analytics Header */}
            <div style={{
                display: 'flex',
                gap: 'var(--space-6)',
                marginBottom: 'var(--space-8)',
            }}>
                <div className="analytics-metric">
                    <span className="analytics-metric__value">{totalCalls.toLocaleString()}</span>
                    <span className="analytics-metric__label">All-Time Calls</span>
                </div>
                <div className="analytics-metric">
                    <span className="analytics-metric__value">{totalWeek.toLocaleString()}</span>
                    <span className="analytics-metric__label">This Week</span>
                </div>
                <div className="analytics-metric">
                    <span className="analytics-metric__value">
                        {stats.length > 0 ? Math.round(totalWeek / stats.length) : 0}
                    </span>
                    <span className="analytics-metric__label">Daily Average</span>
                </div>
            </div>

            {/* Bar Chart */}
            <div className="bar-chart">
                <h3 style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-lg)', fontWeight: 600 }}>
                    API Calls — Last 7 Days
                </h3>
                <div className="bar-chart__container">
                    {stats.map((stat) => {
                        const height = maxCount > 0 ? (stat.count / maxCount) * 100 : 0;
                        const dayLabel = new Date(stat.date + 'T12:00:00').toLocaleDateString('en', { weekday: 'short' });

                        return (
                            <div key={stat.date} className="bar-chart__col">
                                <span className="bar-chart__value">{stat.count}</span>
                                <div className="bar-chart__bar-wrapper">
                                    <div
                                        className="bar-chart__bar"
                                        style={{ height: `${Math.max(height, 2)}%` }}
                                    />
                                </div>
                                <span className="bar-chart__label">{dayLabel}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
