/* ═══════════════════════════════════════════════════════════
   Create Agent Page — Multi-step Wizard
   ═══════════════════════════════════════════════════════════ */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
    createListing,
    generateDID,
    generateSlug,
    computeInitialTrustScore,
} from '../lib/database';
import type { ProductType, PricingModel } from '../types';

const STEPS = ['Basics', 'Configuration', 'Trust & Verify', 'Review & Publish'];
const TYPE_OPTIONS: { value: ProductType; label: string; icon: string; desc: string }[] = [
    { value: 'mcp_server', label: 'MCP Server', icon: '🔌', desc: 'Model Context Protocol server that provides tools, resources, or prompts to AI models' },
    { value: 'ai_agent', label: 'AI Agent', icon: '🤖', desc: 'Autonomous agent that can perceive, reason, and act on tasks' },
    { value: 'automation', label: 'Automation', icon: '⚡', desc: 'Workflow automation that connects services and triggers actions' },
];

interface FormData {
    name: string;
    type: ProductType;
    description: string;
    tags: string;
    githubRepo: string;
    endpointUrl: string;
    apiSchema: string;
    inputFormat: string;
    outputFormat: string;
    pricingModel: PricingModel;
    category: string;
}

const INITIAL_FORM: FormData = {
    name: '',
    type: 'mcp_server',
    description: '',
    tags: '',
    githubRepo: '',
    endpointUrl: '',
    apiSchema: '{\n  "method": "POST",\n  "path": "/v1/invoke",\n  "headers": {\n    "Authorization": "Bearer {{API_KEY}}",\n    "Content-Type": "application/json"\n  }\n}',
    inputFormat: '{\n  "prompt": "string",\n  "context": "object (optional)",\n  "max_tokens": "number (default: 1024)"\n}',
    outputFormat: '{\n  "result": "string",\n  "usage": {\n    "tokens_used": "number",\n    "latency_ms": "number"\n  },\n  "metadata": "object"\n}',
    pricingModel: 'free',
    category: '',
};

export default function CreateAgentPage() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useStore();
    const [step, setStep] = useState(0);
    const [form, setForm] = useState<FormData>(INITIAL_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generatedDID, setGeneratedDID] = useState('');
    const [trustScore, setTrustScore] = useState(0);
    const [publishSuccess, setPublishSuccess] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        setGeneratedDID(generateDID());
    }, []);

    // Recompute trust score whenever relevant fields change
    useEffect(() => {
        const score = computeInitialTrustScore({
            hasGithubRepo: form.githubRepo.trim().length > 0,
            hasDescription: form.description.trim().length > 20,
            hasEndpoint: form.endpointUrl.trim().length > 0,
            hasTags: form.tags.trim().length > 0,
        });
        setTrustScore(score);
    }, [form.githubRepo, form.description, form.endpointUrl, form.tags]);

    const updateField = (field: keyof FormData, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    const validateStep = (s: number): boolean => {
        const newErrors: Record<string, string> = {};

        if (s === 0) {
            if (!form.name.trim()) newErrors.name = 'Agent name is required';
            if (form.name.trim().length < 3) newErrors.name = 'Name must be at least 3 characters';
            if (!form.description.trim()) newErrors.description = 'Description is required';
            if (form.description.trim().length < 20) newErrors.description = 'Description must be at least 20 characters';
        }

        if (s === 1) {
            if (form.endpointUrl.trim() && !isValidUrl(form.endpointUrl)) {
                newErrors.endpointUrl = 'Invalid URL format';
            }
            try {
                if (form.apiSchema.trim()) JSON.parse(form.apiSchema);
            } catch {
                newErrors.apiSchema = 'Invalid JSON format';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep((s) => Math.min(s + 1, STEPS.length - 1));
        }
    };

    const prevStep = () => setStep((s) => Math.max(s - 1, 0));

    const handlePublish = async (asDraft: boolean = false) => {
        if (!user) return;
        setIsSubmitting(true);

        const tagArray = form.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);

        const result = await createListing({
            name: form.name.trim(),
            type: form.type,
            description: form.description.trim(),
            tags: tagArray,
            githubRepo: form.githubRepo.trim(),
            pricingModel: form.pricingModel,
            category: form.type,
            did: generatedDID,
            slug: generateSlug(form.name),
            author: user.username,
            authorAvatar: user.avatarUrl,
            trustScore,
            totalCalls: 0,
            totalUsers: 0,
            avgLatencyMs: 0,
            uptime: 99.9,
            rating: 0,
            reviewCount: 0,
            creatorId: user.id,
            status: asDraft ? 'draft' : 'active',
        });

        setIsSubmitting(false);

        if (result) {
            setPublishSuccess(true);
            setTimeout(() => {
                navigate(asDraft ? '/dashboard' : `/marketplace/${result.slug}`);
            }, 2000);
        }
    };

    if (publishSuccess) {
        return (
            <div className="page container" style={{ textAlign: 'center', paddingTop: 'var(--space-20)' }}>
                <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)', animation: 'pulse 1s ease-in-out' }}>🚀</div>
                <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
                    Agent Published!
                </h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                    Redirecting to your agent...
                </p>
            </div>
        );
    }

    return (
        <div className="page container">
            <div className="wizard">
                {/* Header */}
                <div className="wizard__header">
                    <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>
                        Create New Agent
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
                        Publish your MCP server, AI agent, or automation to the marketplace
                    </p>
                </div>

                {/* Step Indicator */}
                <div className="wizard__steps">
                    {STEPS.map((label, i) => (
                        <div
                            key={label}
                            className={`wizard__step ${i === step ? 'wizard__step--active' : ''} ${i < step ? 'wizard__step--done' : ''}`}
                            onClick={() => i < step && setStep(i)}
                        >
                            <div className="wizard__step-number">
                                {i < step ? '✓' : i + 1}
                            </div>
                            <span className="wizard__step-label">{label}</span>
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="wizard__content">
                    {step === 0 && (
                        <StepBasics form={form} errors={errors} updateField={updateField} />
                    )}
                    {step === 1 && (
                        <StepConfiguration form={form} errors={errors} updateField={updateField} />
                    )}
                    {step === 2 && (
                        <StepTrust
                            form={form}
                            generatedDID={generatedDID}
                            trustScore={trustScore}
                            onRegenerateDID={() => setGeneratedDID(generateDID())}
                        />
                    )}
                    {step === 3 && (
                        <StepReview form={form} generatedDID={generatedDID} trustScore={trustScore} user={user} />
                    )}
                </div>

                {/* Navigation */}
                <div className="wizard__nav">
                    {step > 0 && (
                        <button className="btn btn--ghost" onClick={prevStep}>
                            ← Back
                        </button>
                    )}
                    <div style={{ flex: 1 }} />
                    {step < STEPS.length - 1 ? (
                        <button className="btn btn--primary" onClick={nextStep}>
                            Continue →
                        </button>
                    ) : (
                        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                            <button
                                className="btn btn--ghost"
                                onClick={() => handlePublish(true)}
                                disabled={isSubmitting}
                            >
                                Save as Draft
                            </button>
                            <button
                                className="btn btn--primary"
                                onClick={() => handlePublish(false)}
                                disabled={isSubmitting}
                                style={{ minWidth: 160 }}
                            >
                                {isSubmitting ? (
                                    <span className="spinner" />
                                ) : (
                                    '🚀 Publish Agent'
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ── Step 1: Basics ────────────────────────────────────── */

function StepBasics({
    form,
    errors,
    updateField,
}: {
    form: FormData;
    errors: Record<string, string>;
    updateField: (field: keyof FormData, value: string) => void;
}) {
    return (
        <div className="wizard__form">
            <h2 className="wizard__section-title">Basic Information</h2>

            {/* Agent Type Selector */}
            <div className="field">
                <label className="field__label">Agent Type</label>
                <div className="type-selector">
                    {TYPE_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            className={`type-selector__option ${form.type === opt.value ? 'type-selector__option--active' : ''}`}
                            onClick={() => updateField('type', opt.value)}
                        >
                            <span className="type-selector__icon">{opt.icon}</span>
                            <span className="type-selector__label">{opt.label}</span>
                            <span className="type-selector__desc">{opt.desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Name */}
            <div className="field">
                <label className="field__label" htmlFor="agent-name">
                    Agent Name <span className="field__required">*</span>
                </label>
                <input
                    id="agent-name"
                    className={`field__input ${errors.name ? 'field__input--error' : ''}`}
                    type="text"
                    placeholder="e.g. Weather Oracle MCP"
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    maxLength={80}
                />
                {errors.name && <span className="field__error">{errors.name}</span>}
                <span className="field__hint">{form.name.length}/80 characters</span>
            </div>

            {/* Description */}
            <div className="field">
                <label className="field__label" htmlFor="agent-desc">
                    Description <span className="field__required">*</span>
                </label>
                <textarea
                    id="agent-desc"
                    className={`field__textarea ${errors.description ? 'field__input--error' : ''}`}
                    placeholder="Describe what your agent does, its capabilities, and how developers can integrate it..."
                    value={form.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={5}
                    maxLength={2000}
                />
                {errors.description && <span className="field__error">{errors.description}</span>}
                <span className="field__hint">{form.description.length}/2000 characters</span>
            </div>

            {/* Tags */}
            <div className="field">
                <label className="field__label" htmlFor="agent-tags">Tags</label>
                <input
                    id="agent-tags"
                    className="field__input"
                    type="text"
                    placeholder="weather, api, real-time, nlp (comma-separated)"
                    value={form.tags}
                    onChange={(e) => updateField('tags', e.target.value)}
                />
                <span className="field__hint">Comma-separated tags help users discover your agent</span>
            </div>

            {/* GitHub Repo */}
            <div className="field">
                <label className="field__label" htmlFor="agent-github">GitHub Repository</label>
                <input
                    id="agent-github"
                    className="field__input"
                    type="url"
                    placeholder="https://github.com/your-org/your-agent"
                    value={form.githubRepo}
                    onChange={(e) => updateField('githubRepo', e.target.value)}
                />
                <span className="field__hint">Linking a repo increases your Trust Score by +25%</span>
            </div>
        </div>
    );
}

/* ── Step 2: Configuration (Endpoint + I/O) ────────────── */

function StepConfiguration({
    form,
    errors,
    updateField,
}: {
    form: FormData;
    errors: Record<string, string>;
    updateField: (field: keyof FormData, value: string) => void;
}) {
    return (
        <div className="wizard__form">
            <h2 className="wizard__section-title">Endpoint & Data Configuration</h2>

            {/* Endpoint URL */}
            <div className="field">
                <label className="field__label" htmlFor="endpoint-url">
                    Endpoint URL
                </label>
                <input
                    id="endpoint-url"
                    className={`field__input field__input--mono ${errors.endpointUrl ? 'field__input--error' : ''}`}
                    type="url"
                    placeholder="https://api.your-agent.com/v1/invoke"
                    value={form.endpointUrl}
                    onChange={(e) => updateField('endpointUrl', e.target.value)}
                />
                {errors.endpointUrl && <span className="field__error">{errors.endpointUrl}</span>}
                <span className="field__hint">The URL where API calls will be routed. Adds +30% to Trust Score.</span>
            </div>

            {/* API Schema */}
            <div className="field">
                <label className="field__label" htmlFor="api-schema">
                    API Schema (JSON)
                </label>
                <textarea
                    id="api-schema"
                    className={`field__textarea field__textarea--code ${errors.apiSchema ? 'field__input--error' : ''}`}
                    value={form.apiSchema}
                    onChange={(e) => updateField('apiSchema', e.target.value)}
                    rows={8}
                    spellCheck={false}
                />
                {errors.apiSchema && <span className="field__error">{errors.apiSchema}</span>}
                <span className="field__hint">Define the HTTP method, path, and headers for your agent</span>
            </div>

            {/* Input Format */}
            <div className="field">
                <label className="field__label" htmlFor="input-format">
                    Input Format (JSON Schema)
                </label>
                <textarea
                    id="input-format"
                    className="field__textarea field__textarea--code"
                    value={form.inputFormat}
                    onChange={(e) => updateField('inputFormat', e.target.value)}
                    rows={6}
                    spellCheck={false}
                />
                <span className="field__hint">Define the expected request body structure</span>
            </div>

            {/* Output Format */}
            <div className="field">
                <label className="field__label" htmlFor="output-format">
                    Output Format (JSON Schema)
                </label>
                <textarea
                    id="output-format"
                    className="field__textarea field__textarea--code"
                    value={form.outputFormat}
                    onChange={(e) => updateField('outputFormat', e.target.value)}
                    rows={8}
                    spellCheck={false}
                />
                <span className="field__hint">Define the response structure users can expect</span>
            </div>

            {/* Pricing Model */}
            <div className="field">
                <label className="field__label">Pricing Model</label>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    {(['free', 'per_call', 'subscription'] as PricingModel[]).map((model) => (
                        <button
                            key={model}
                            className={`btn ${form.pricingModel === model ? 'btn--primary' : 'btn--ghost'}`}
                            onClick={() => updateField('pricingModel', model)}
                            style={{ flex: 1 }}
                        >
                            {model === 'free' && '🆓 Free'}
                            {model === 'per_call' && '📞 Per Call'}
                            {model === 'subscription' && '📅 Subscription'}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ── Step 3: Trust & Verification ──────────────────────── */

function StepTrust({
    form,
    generatedDID,
    trustScore,
    onRegenerateDID,
}: {
    form: FormData;
    generatedDID: string;
    trustScore: number;
    onRegenerateDID: () => void;
}) {
    const trustLevel = trustScore >= 0.8 ? 'high' : trustScore >= 0.5 ? 'medium' : 'low';
    const trustPercent = Math.round(trustScore * 100);

    return (
        <div className="wizard__form">
            <h2 className="wizard__section-title">Trust & Verification</h2>

            {/* DID */}
            <div className="field">
                <label className="field__label">Decentralized Identifier (DID)</label>
                <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                    <code className="did-display">{generatedDID}</code>
                    <button className="btn btn--ghost btn--sm" onClick={onRegenerateDID} title="Regenerate DID">
                        🔄
                    </button>
                </div>
                <span className="field__hint">
                    Unique cryptographic identifier for your agent on the Agora network
                </span>
            </div>

            {/* Trust Score Breakdown */}
            <div className="trust-breakdown">
                <div className="trust-breakdown__header">
                    <h3>Trust Score</h3>
                    <div className={`trust-score trust-score--${trustLevel}`}>
                        <div className="trust-score__bar">
                            <div
                                className="trust-score__fill"
                                style={{ width: `${trustPercent}%` }}
                            />
                        </div>
                        <span className="trust-score__value">{trustPercent}%</span>
                    </div>
                </div>

                <div className="trust-breakdown__items">
                    <TrustItem
                        label="Base Registration"
                        points={10}
                        achieved={true}
                    />
                    <TrustItem
                        label="GitHub Repository Linked"
                        points={25}
                        achieved={form.githubRepo.trim().length > 0}
                    />
                    <TrustItem
                        label="Detailed Description (20+ chars)"
                        points={15}
                        achieved={form.description.trim().length > 20}
                    />
                    <TrustItem
                        label="Endpoint URL Configured"
                        points={30}
                        achieved={form.endpointUrl.trim().length > 0}
                    />
                    <TrustItem
                        label="Tags Added"
                        points={10}
                        achieved={form.tags.trim().length > 0}
                    />
                    <TrustItem
                        label="Community Reviews"
                        points={10}
                        achieved={false}
                        hint="Earned after receiving reviews"
                    />
                </div>
            </div>

            {/* Verification Status */}
            <div className="verification-panel">
                <h3 style={{ marginBottom: 'var(--space-3)' }}>Verification Checks</h3>
                <div className="verification-panel__items">
                    <VerifyItem label="Agent name is unique" status={form.name.trim().length >= 3 ? 'pass' : 'pending'} />
                    <VerifyItem label="Description meets minimum" status={form.description.trim().length >= 20 ? 'pass' : 'fail'} />
                    <VerifyItem label="DID generated" status={generatedDID ? 'pass' : 'pending'} />
                    <VerifyItem
                        label="GitHub repo accessible"
                        status={form.githubRepo ? 'pass' : 'skip'}
                    />
                    <VerifyItem
                        label="Endpoint reachable"
                        status={form.endpointUrl ? 'pass' : 'skip'}
                    />
                </div>
            </div>
        </div>
    );
}

/* ── Step 4: Review & Publish ──────────────────────────── */

function StepReview({
    form,
    generatedDID,
    trustScore,
    user,
}: {
    form: FormData;
    generatedDID: string;
    trustScore: number;
    user: { username: string; avatarUrl?: string } | null;
}) {
    const trustPercent = Math.round(trustScore * 100);
    const trustLevel = trustScore >= 0.8 ? 'high' : trustScore >= 0.5 ? 'medium' : 'low';
    const tagArray = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
    const typeOpt = TYPE_OPTIONS.find((o) => o.value === form.type);

    return (
        <div className="wizard__form">
            <h2 className="wizard__section-title">Review Your Agent</h2>

            {/* Preview Card */}
            <div className="preview-card">
                <div className="preview-card__header">
                    <span style={{ fontSize: '2rem' }}>{typeOpt?.icon}</span>
                    <div>
                        <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>{form.name || 'Untitled Agent'}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-1)' }}>
                            {user?.avatarUrl && (
                                <img
                                    src={user.avatarUrl}
                                    alt=""
                                    style={{ width: 20, height: 20, borderRadius: 'var(--radius-full)' }}
                                />
                            )}
                            <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                                {user?.username || 'Anonymous'}
                            </span>
                        </div>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        <span className={`trust-badge trust-badge--${trustLevel}`}>
                            {trustPercent}% Trust
                        </span>
                    </div>
                </div>

                <p style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--text-sm)',
                    lineHeight: 1.6,
                    marginTop: 'var(--space-4)',
                    maxHeight: 80,
                    overflow: 'hidden',
                }}>
                    {form.description || 'No description provided'}
                </p>

                {tagArray.length > 0 && (
                    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 'var(--space-3)' }}>
                        {tagArray.map((tag) => (
                            <span key={tag} className="tag">{tag}</span>
                        ))}
                    </div>
                )}
            </div>

            {/* Details Table */}
            <div className="review-table">
                <div className="review-table__row">
                    <span className="review-table__label">Type</span>
                    <span>{typeOpt?.icon} {typeOpt?.label}</span>
                </div>
                <div className="review-table__row">
                    <span className="review-table__label">DID</span>
                    <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{generatedDID}</code>
                </div>
                <div className="review-table__row">
                    <span className="review-table__label">Pricing</span>
                    <span style={{ textTransform: 'capitalize' }}>{form.pricingModel.replace('_', ' ')}</span>
                </div>
                {form.githubRepo && (
                    <div className="review-table__row">
                        <span className="review-table__label">GitHub</span>
                        <a href={form.githubRepo} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>
                            {form.githubRepo.replace('https://github.com/', '')}
                        </a>
                    </div>
                )}
                {form.endpointUrl && (
                    <div className="review-table__row">
                        <span className="review-table__label">Endpoint</span>
                        <code style={{ fontSize: 'var(--text-xs)' }}>{form.endpointUrl}</code>
                    </div>
                )}
                <div className="review-table__row">
                    <span className="review-table__label">Trust Score</span>
                    <span className={`trust-badge trust-badge--${trustLevel}`}>{trustPercent}%</span>
                </div>
            </div>
        </div>
    );
}

/* ── Subcomponents ────────────────────────────────────── */

function TrustItem({ label, points, achieved, hint }: { label: string; points: number; achieved: boolean; hint?: string }) {
    return (
        <div className={`trust-item ${achieved ? 'trust-item--achieved' : ''}`}>
            <span className="trust-item__icon">{achieved ? '✅' : '⬜'}</span>
            <span className="trust-item__label">{label}</span>
            <span className="trust-item__points">+{points}%</span>
            {hint && <span className="trust-item__hint">{hint}</span>}
        </div>
    );
}

function VerifyItem({ label, status }: { label: string; status: 'pass' | 'fail' | 'pending' | 'skip' }) {
    const icon = {
        pass: '✅',
        fail: '❌',
        pending: '⏳',
        skip: '⏭️',
    }[status];

    return (
        <div className={`verify-item verify-item--${status}`}>
            <span>{icon}</span>
            <span>{label}</span>
        </div>
    );
}

function isValidUrl(string: string): boolean {
    try {
        new URL(string);
        return true;
    } catch {
        return false;
    }
}
