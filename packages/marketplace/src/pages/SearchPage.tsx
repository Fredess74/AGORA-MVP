/* ═══════════════════════════════════════════════════════════
   SearchPage — Perplexity-style AI Tool Search + Shareable URLs
   
   Primary demo interface for Suffolk 40K pitch.
   User types query → instant results with trust scores → shareable link.
   ═══════════════════════════════════════════════════════════ */

import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import type { Product, SavedQuery } from '../types';

// ── Nanoid-like short ID generator ──────────────────────
function nanoid(size = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    const bytes = crypto.getRandomValues(new Uint8Array(size));
    for (let i = 0; i < size; i++) id += chars[bytes[i] % chars.length];
    return id;
}

// ── Local storage for saved queries ─────────────────────
const QUERIES_KEY = 'agora_saved_queries';

function saveQueryToStorage(q: SavedQuery): void {
    const existing = JSON.parse(localStorage.getItem(QUERIES_KEY) || '[]');
    existing.unshift(q);
    if (existing.length > 50) existing.length = 50; // cap at 50
    localStorage.setItem(QUERIES_KEY, JSON.stringify(existing));
}

function getQueryFromStorage(id: string): SavedQuery | null {
    const existing: SavedQuery[] = JSON.parse(localStorage.getItem(QUERIES_KEY) || '[]');
    return existing.find(q => q.id === id) || null;
}

// ── Suggested queries for empty state ───────────────────
const SUGGESTIONS = [
    { icon: '🛡️', label: 'Security tools for code audits', query: 'security code audit vulnerability' },
    { icon: '📊', label: 'Market analysis & trends', query: 'market analysis trends intelligence' },
    { icon: '⚡', label: 'Performance monitoring', query: 'performance pagespeed web audit' },
    { icon: '🔌', label: 'Database MCP servers', query: 'database supabase postgres mcp' },
    { icon: '📋', label: 'Code review skills', query: 'code review best practices skill' },
    { icon: '🤖', label: 'All AI agents', query: 'agent' },
];

// ── Type icons/labels ───────────────────────────────────
function typeIcon(type: string): string {
    switch (type) {
        case 'ai_agent': return '🤖';
        case 'mcp_server': return '🔌';
        case 'skill': return '📋';
        case 'automation': return '⚡';
        default: return '•';
    }
}
function typeLabel(type: string): string {
    switch (type) {
        case 'ai_agent': return 'AI Agent';
        case 'mcp_server': return 'MCP Server';
        case 'skill': return 'Skill';
        case 'automation': return 'Automation';
        default: return type;
    }
}
function trustColor(score: number): string {
    if (score >= 0.8) return 'var(--color-trust-high, #10b981)';
    if (score >= 0.5) return 'var(--color-trust-medium, #f59e0b)';
    return 'var(--color-trust-low, #ef4444)';
}

// ── Chat message type ───────────────────────────────────
interface ChatMessage {
    id: string;
    role: 'user' | 'system';
    content: string;
    results?: Product[];
    queryId?: string;
    timestamp: Date;
}

// ── Component ───────────────────────────────────────────
export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const { products, loadProducts, isLoading: storeLoading } = useStore();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);

    // Load products on mount
    useEffect(() => {
        if (products.length === 0) loadProducts();
    }, [products.length, loadProducts]);

    // Auto-scroll chat
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    // Handle shared query via URL params (?q=...)
    useEffect(() => {
        const sharedId = searchParams.get('q');
        if (sharedId && messages.length === 0) {
            const saved = getQueryFromStorage(sharedId);
            if (saved) {
                setMessages([
                    { id: nanoid(), role: 'user', content: saved.query, timestamp: new Date(saved.createdAt) },
                    {
                        id: nanoid(), role: 'system',
                        content: `Found ${saved.resultCount} results`,
                        results: saved.results, queryId: saved.id,
                        timestamp: new Date(saved.createdAt),
                    },
                ]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    // ── Search logic ─────────────────────────────────────
    const performSearch = useCallback((queryText: string) => {
        if (!queryText.trim() || isSearching) return;

        const q = queryText.toLowerCase().trim();
        setIsSearching(true);

        // Add user message
        const userMsg: ChatMessage = {
            id: nanoid(), role: 'user', content: queryText, timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulate brief "thinking" delay for UX
        setTimeout(() => {
            // Search across all products — name, description, tags, author, category
            const results = products.filter(p => {
                const searchable = [
                    p.name, p.description, p.author, p.category,
                    ...(p.tags || []), p.type,
                ].join(' ').toLowerCase();
                // Match ALL terms (AND logic)
                const terms = q.split(/\s+/).filter(Boolean);
                return terms.every(term => searchable.includes(term));
            }).sort((a, b) => b.trustScore - a.trustScore);

            // Generate shareable query ID
            const queryId = nanoid();
            const savedQuery: SavedQuery = {
                id: queryId,
                query: queryText,
                results: results.slice(0, 20),
                resultCount: results.length,
                createdAt: new Date().toISOString(),
            };
            saveQueryToStorage(savedQuery);

            const systemMsg: ChatMessage = {
                id: nanoid(), role: 'system',
                content: results.length > 0
                    ? `Found ${results.length} trust-verified result${results.length !== 1 ? 's' : ''} for "${queryText}"`
                    : `No results found for "${queryText}". Try different keywords.`,
                results: results.slice(0, 20),
                queryId,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, systemMsg]);
            setIsSearching(false);
        }, 400 + Math.random() * 300);
    }, [products, isSearching]);

    // ── Copy shareable link ──────────────────────────────
    const copyShareLink = (queryId: string) => {
        const url = `${window.location.origin}/search?q=${queryId}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopiedId(queryId);
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    // ── Render ───────────────────────────────────────────
    const hasMessages = messages.length > 0;

    return (
        <div className="search-page">
            {/* ── Header ──────────────────────────────── */}
            {!hasMessages && (
                <div className="search-hero">
                    <div className="search-hero__icon">🏛️</div>
                    <h1 className="search-hero__title">Search Agora</h1>
                    <p className="search-hero__subtitle">
                        Find trust-verified AI agents, MCP servers, and skills
                    </p>
                </div>
            )}

            {/* ── Chat messages ───────────────────────── */}
            {hasMessages && (
                <div className="search-chat" ref={chatRef}>
                    {messages.map(msg => (
                        <div key={msg.id} className={`search-msg search-msg--${msg.role}`}>
                            {msg.role === 'user' ? (
                                <div className="search-msg__user">
                                    <span className="search-msg__avatar">👤</span>
                                    <span className="search-msg__text">{msg.content}</span>
                                </div>
                            ) : (
                                <div className="search-msg__system">
                                    <div className="search-msg__header">
                                        <span className="search-msg__avatar">🏛️</span>
                                        <span className="search-msg__text">{msg.content}</span>
                                        {msg.queryId && (
                                            <button
                                                className="search-msg__share"
                                                onClick={() => copyShareLink(msg.queryId!)}
                                                title="Copy shareable link"
                                            >
                                                {copiedId === msg.queryId ? '✅ Copied!' : '🔗 Share'}
                                            </button>
                                        )}
                                    </div>
                                    {/* ── Results Grid ───────────── */}
                                    {msg.results && msg.results.length > 0 && (
                                        <div className="search-results">
                                            {msg.results.map(product => (
                                                <Link
                                                    key={product.id}
                                                    to={`/marketplace/${product.slug}`}
                                                    className="search-card"
                                                >
                                                    <div className="search-card__top">
                                                        <span className="search-card__type">
                                                            {typeIcon(product.type)} {typeLabel(product.type)}
                                                        </span>
                                                        <span
                                                            className="search-card__trust"
                                                            style={{ color: trustColor(product.trustScore) }}
                                                        >
                                                            {product.trustScore.toFixed(3)}
                                                        </span>
                                                    </div>
                                                    <h3 className="search-card__name">{product.name}</h3>
                                                    <p className="search-card__desc">
                                                        {product.description.slice(0, 120)}
                                                        {product.description.length > 120 ? '...' : ''}
                                                    </p>
                                                    <div className="search-card__meta">
                                                        <span>{product.author}</span>
                                                        <span>
                                                            {product.pricingModel === 'free' ? '✅ Free' : `$${product.pricePerCallUsd}/call`}
                                                        </span>
                                                        <span>📊 {product.totalCalls.toLocaleString()} calls</span>
                                                    </div>
                                                    <div className="search-card__tags">
                                                        {(product.tags || []).slice(0, 4).map(tag => (
                                                            <span key={tag} className="search-tag">{tag}</span>
                                                        ))}
                                                    </div>
                                                    {/* Trust bar */}
                                                    <div className="search-card__trust-bar">
                                                        <div
                                                            className="search-card__trust-fill"
                                                            style={{
                                                                width: `${product.trustScore * 100}%`,
                                                                background: trustColor(product.trustScore),
                                                            }}
                                                        />
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    {isSearching && (
                        <div className="search-msg search-msg--system">
                            <div className="search-msg__system">
                                <div className="search-msg__header">
                                    <span className="search-msg__avatar">🏛️</span>
                                    <span className="search-msg__text search-msg__thinking">
                                        Searching trust-verified catalog<span className="dots"><span>.</span><span>.</span><span>.</span></span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── Suggestions (empty state) ───────────── */}
            {!hasMessages && !storeLoading && (
                <div className="search-suggestions">
                    {SUGGESTIONS.map(s => (
                        <button
                            key={s.query}
                            className="search-suggestion"
                            onClick={() => performSearch(s.query)}
                        >
                            <span className="search-suggestion__icon">{s.icon}</span>
                            <span>{s.label}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* ── Input bar ───────────────────────────── */}
            <div className={`search-input-area ${hasMessages ? 'search-input-area--bottom' : ''}`}>
                <div className="search-input-wrapper">
                    <textarea
                        ref={inputRef}
                        className="search-input"
                        placeholder="Search AI agents, MCP servers, skills..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                performSearch(input);
                            }
                        }}
                        rows={1}
                        disabled={isSearching}
                    />
                    <button
                        className="search-send"
                        onClick={() => performSearch(input)}
                        disabled={isSearching || !input.trim()}
                    >
                        {isSearching ? '⏳' : '🔍'}
                    </button>
                </div>
                <div className="search-input-hint">
                    Powered by Agora Trust Engine — {products.length} tools indexed
                </div>
            </div>
        </div>
    );
}
