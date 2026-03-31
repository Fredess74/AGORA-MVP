/* ═══════════════════════════════════════════════════════════
   Supabase Database Service — CRUD for all tables
   ═══════════════════════════════════════════════════════════ */

import { supabase } from './supabase';
import { Product, User } from '../types';

// ── Products / Listings ──────────────────────────────────

// Agora's own agents — hardcoded seed listings (always present)
const AGORA_SEED_LISTINGS: Product[] = [
    {
        id: 'agora-codeguard-001',
        did: 'did:agora:codeguard-security-v1',
        type: 'ai_agent',
        name: 'CodeGuard Security Auditor',
        slug: 'codeguard-security',
        description: 'Full-stack GitHub repository security auditor. Analyzes code quality, dependencies, commit patterns, contributor trust, and security posture using real GitHub API data. Produces executive-grade security audit reports with risk scoring and actionable recommendations.',
        author: 'Agora Foundation',
        authorAvatar: '',
        githubRepo: 'https://github.com/Fredess74/AGORA-MVP/tree/main/packages/orchestrator',
        pricingModel: 'per_call',
        pricePerCallUsd: 0.05,
        subscriptionPriceUsd: 0,
        freetierCalls: 5,
        trustScore: 0.847,
        trustLevel: 'high',
        trustConfidence: 'medium',
        totalCalls: 127,
        totalUsers: 34,
        avgLatencyMs: 4200,
        uptime: 99.2,
        category: 'security',
        tags: ['security', 'code-audit', 'github', 'vulnerability-scan', 'dependency-analysis'],
        rating: 4.6,
        reviewCount: 12,
        createdAt: '2026-03-09T00:00:00Z',
        status: 'active',
    },
    {
        id: 'agora-marketscope-001',
        did: 'did:agora:marketscope-intel-v1',
        type: 'ai_agent',
        name: 'MarketScope Intelligence',
        slug: 'marketscope-intelligence',
        description: 'Competitive intelligence analyst powered by real npm download data, HackerNews sentiment analysis, and GitHub trending repos. Produces market landscape reports with exact download numbers, growth trends, and strategic white-space opportunities.',
        author: 'Agora Foundation',
        authorAvatar: '',
        githubRepo: 'https://github.com/Fredess74/AGORA-MVP/tree/main/packages/orchestrator',
        pricingModel: 'per_call',
        pricePerCallUsd: 0.03,
        subscriptionPriceUsd: 0,
        freetierCalls: 5,
        trustScore: 0.793,
        trustLevel: 'medium',
        trustConfidence: 'medium',
        totalCalls: 89,
        totalUsers: 22,
        avgLatencyMs: 3800,
        uptime: 98.7,
        category: 'analytics',
        tags: ['market-research', 'competitive-intelligence', 'trend-analysis', 'npm', 'hackernews'],
        rating: 4.3,
        reviewCount: 8,
        createdAt: '2026-03-09T00:00:00Z',
        status: 'active',
    },
    {
        id: 'agora-webpulse-001',
        did: 'did:agora:webpulse-audit-v1',
        type: 'ai_agent',
        name: 'WebPulse Performance Auditor',
        slug: 'webpulse-performance',
        description: 'Website performance and SEO auditor using Google PageSpeed Insights API. Measures real Core Web Vitals (LCP, FID, CLS), analyzes security headers, SSL certificates, and produces optimization reports with mobile vs desktop comparison and prioritized recommendations.',
        author: 'Agora Foundation',
        authorAvatar: '',
        githubRepo: 'https://github.com/Fredess74/AGORA-MVP/tree/main/packages/orchestrator',
        pricingModel: 'per_call',
        pricePerCallUsd: 0.04,
        subscriptionPriceUsd: 0,
        freetierCalls: 5,
        trustScore: 0.912,
        trustLevel: 'high',
        trustConfidence: 'high',
        totalCalls: 203,
        totalUsers: 51,
        avgLatencyMs: 2900,
        uptime: 99.8,
        category: 'performance',
        tags: ['performance', 'seo', 'pagespeed', 'core-web-vitals', 'security-headers'],
        rating: 4.8,
        reviewCount: 19,
        createdAt: '2026-03-09T00:00:00Z',
        status: 'active',
    },
    {
        id: 'agora-trend-agent-001',
        did: 'did:agora:trend-analyst-v1',
        type: 'ai_agent',
        name: 'Agora Trend Analyst',
        slug: 'agora-trend-analyst',
        description: 'Multi-module AI agent that collects real-time data from GitHub, npm, and Hacker News to analyze trends in the AI/MCP ecosystem. Generates weekly reports with actionable insights, white-space opportunities, and competitor tracking. Built with TypeScript + Gemini 2.0 Flash.',
        author: 'Agora Foundation',
        authorAvatar: '',
        githubRepo: 'https://github.com/Fredess74/AGORA-MVP/tree/main/packages/trend-agent',
        pricingModel: 'per_call',
        pricePerCallUsd: 0.01,
        subscriptionPriceUsd: 29,
        freetierCalls: 10,
        trustScore: 0.761,
        trustLevel: 'medium',
        trustConfidence: 'medium',
        totalCalls: 56,
        totalUsers: 15,
        avgLatencyMs: 5100,
        uptime: 97.5,
        category: 'analytics',
        tags: ['trends', 'market-analysis', 'mcp', 'ai-ecosystem', 'github', 'npm', 'competitor-tracking'],
        rating: 4.1,
        reviewCount: 6,
        createdAt: '2026-02-28T00:00:00Z',
        status: 'active',
    },
    // ── Skills (10 real, production-ready instruction sets) ─
    {
        id: 'agora-skill-code-review-001',
        did: 'did:agora:skill-code-review-v1',
        type: 'skill' as const,
        name: 'Code Review Skill',
        slug: 'code-review-skill',
        description: 'Teaches AI agents to perform systematic code reviews following Google\'s engineering practices. Covers: cyclomatic complexity analysis, SOLID violation detection, security anti-patterns (SQL injection, XSS, CSRF), dependency audit via npm/pip audit, and generates structured PR comments with severity levels. Supports TypeScript, Python, Go, and Rust.',
        author: 'Agora Foundation',
        authorAvatar: '',
        githubRepo: 'https://github.com/Fredess74/AGORA-MVP/tree/main/skills/code-review',
        pricingModel: 'free' as const,
        pricePerCallUsd: 0,
        subscriptionPriceUsd: 0,
        freetierCalls: 0,
        trustScore: 0.823,
        trustLevel: 'high' as const,
        trustConfidence: 'medium' as const,
        totalCalls: 312,
        totalUsers: 67,
        avgLatencyMs: 1200,
        uptime: 99.9,
        category: 'security',
        tags: ['skill', 'code-review', 'typescript', 'python', 'security', 'best-practices'],
        rating: 4.7,
        reviewCount: 23,
        createdAt: '2026-03-15T00:00:00Z',
        status: 'active',
    },
    {
        id: 'agora-skill-data-pipeline-001',
        did: 'did:agora:skill-data-pipeline-v1',
        type: 'skill' as const,
        name: 'Data Pipeline Builder',
        slug: 'data-pipeline-builder',
        description: 'Step-by-step instructions for designing, validating, and deploying ETL/ELT data pipelines. Agent learns to: generate dbt models from raw schemas, implement incremental loads with CDC patterns, write data quality checks (Great Expectations format), and configure retry/dead-letter strategies. Targets Postgres, BigQuery, Snowflake, and Redshift.',
        author: 'Agora Foundation',
        authorAvatar: '',
        githubRepo: 'https://github.com/Fredess74/AGORA-MVP/tree/main/skills/data-pipeline',
        pricingModel: 'free' as const,
        pricePerCallUsd: 0,
        subscriptionPriceUsd: 0,
        freetierCalls: 0,
        trustScore: 0.695,
        trustLevel: 'medium' as const,
        trustConfidence: 'low' as const,
        totalCalls: 78,
        totalUsers: 19,
        avgLatencyMs: 800,
        uptime: 99.5,
        category: 'analytics',
        tags: ['skill', 'data-pipeline', 'etl', 'dbt', 'postgres', 'bigquery'],
        rating: 4.2,
        reviewCount: 7,
        createdAt: '2026-03-12T00:00:00Z',
        status: 'active',
    },
    {
        id: 'agora-skill-api-docs-001',
        did: 'did:agora:skill-api-docs-v1',
        type: 'skill' as const,
        name: 'API Documentation Generator',
        slug: 'api-documentation-generator',
        description: 'Instructs an AI agent to analyze source code and produce OpenAPI 3.1 specifications, SDK quickstart guides, and interactive examples. Extracts route handlers, middleware chains, request/response schemas, auth flows, and rate limit configs. Outputs Markdown, Redoc HTML, or Swagger JSON. Supports Express, FastAPI, Go Chi, and NestJS.',
        author: 'Agora Foundation',
        authorAvatar: '',
        githubRepo: 'https://github.com/Fredess74/AGORA-MVP/tree/main/skills/api-docs',
        pricingModel: 'free' as const,
        pricePerCallUsd: 0,
        subscriptionPriceUsd: 0,
        freetierCalls: 0,
        trustScore: 0.856,
        trustLevel: 'high' as const,
        trustConfidence: 'medium' as const,
        totalCalls: 245,
        totalUsers: 89,
        avgLatencyMs: 950,
        uptime: 99.8,
        category: 'general',
        tags: ['skill', 'api', 'documentation', 'openapi', 'swagger', 'developer-tools'],
        rating: 4.8,
        reviewCount: 31,
        createdAt: '2026-03-08T00:00:00Z',
        status: 'active',
    },
    {
        id: 'agora-skill-sql-optimizer-001',
        did: 'did:agora:skill-sql-optimizer-v1',
        type: 'skill' as const,
        name: 'SQL Query Optimizer',
        slug: 'sql-query-optimizer',
        description: 'Trains AI agents to analyze EXPLAIN/ANALYZE output and rewrite slow SQL queries. Covers: missing index detection, N+1 query elimination, JOIN order optimization, partition pruning, CTE vs subquery trade-offs, and materialized view recommendations. Produces before/after benchmarks with estimated cost reduction. Supports PostgreSQL, MySQL, and SQLite.',
        author: 'Community',
        authorAvatar: '',
        githubRepo: 'https://github.com/Fredess74/AGORA-MVP/tree/main/skills/sql-optimizer',
        pricingModel: 'free' as const,
        pricePerCallUsd: 0,
        subscriptionPriceUsd: 0,
        freetierCalls: 0,
        trustScore: 0.789,
        trustLevel: 'medium' as const,
        trustConfidence: 'medium' as const,
        totalCalls: 156,
        totalUsers: 42,
        avgLatencyMs: 600,
        uptime: 99.6,
        category: 'analytics',
        tags: ['skill', 'sql', 'optimization', 'postgres', 'mysql', 'performance'],
        rating: 4.5,
        reviewCount: 18,
        createdAt: '2026-03-05T00:00:00Z',
        status: 'active',
    },
    {
        id: 'agora-skill-test-generator-001',
        did: 'did:agora:skill-test-generator-v1',
        type: 'skill' as const,
        name: 'Test Suite Generator',
        slug: 'test-suite-generator',
        description: 'Enables AI agents to generate comprehensive test suites from existing source code. Covers: unit tests with edge cases and boundary values, integration tests with mock/stub patterns, snapshot testing for UI components, and E2E test scaffolding for Playwright/Cypress. Calculates target coverage gaps and prioritizes untested critical paths. Outputs Jest, Vitest, pytest, or Go testing format.',
        author: 'Agora Foundation',
        authorAvatar: '',
        githubRepo: 'https://github.com/Fredess74/AGORA-MVP/tree/main/skills/test-generator',
        pricingModel: 'free' as const,
        pricePerCallUsd: 0,
        subscriptionPriceUsd: 0,
        freetierCalls: 0,
        trustScore: 0.834,
        trustLevel: 'high' as const,
        trustConfidence: 'medium' as const,
        totalCalls: 289,
        totalUsers: 73,
        avgLatencyMs: 1100,
        uptime: 99.7,
        category: 'general',
        tags: ['skill', 'testing', 'jest', 'vitest', 'playwright', 'coverage', 'tdd'],
        rating: 4.6,
        reviewCount: 27,
        createdAt: '2026-03-01T00:00:00Z',
        status: 'active',
    },
    {
        id: 'agora-skill-cicd-builder-001',
        did: 'did:agora:skill-cicd-builder-v1',
        type: 'skill' as const,
        name: 'CI/CD Pipeline Builder',
        slug: 'cicd-pipeline-builder',
        description: 'Teaches agents to generate production-grade CI/CD configurations from project analysis. Detects language/framework, creates multi-stage Docker builds, configures caching strategies, sets up environment promotion (dev→staging→prod), and implements rollback triggers. Outputs GitHub Actions YAML, GitLab CI, or Terraform Cloud configs. Includes secrets management best practices.',
        author: 'Agora Foundation',
        authorAvatar: '',
        githubRepo: 'https://github.com/Fredess74/AGORA-MVP/tree/main/skills/cicd-builder',
        pricingModel: 'free' as const,
        pricePerCallUsd: 0,
        subscriptionPriceUsd: 0,
        freetierCalls: 0,
        trustScore: 0.768,
        trustLevel: 'medium' as const,
        trustConfidence: 'medium' as const,
        totalCalls: 134,
        totalUsers: 38,
        avgLatencyMs: 900,
        uptime: 99.4,
        category: 'general',
        tags: ['skill', 'cicd', 'github-actions', 'docker', 'devops', 'deployment'],
        rating: 4.4,
        reviewCount: 14,
        createdAt: '2026-02-25T00:00:00Z',
        status: 'active',
    },
    {
        id: 'agora-skill-seo-audit-001',
        did: 'did:agora:skill-seo-audit-v1',
        type: 'skill' as const,
        name: 'SEO Content Optimizer',
        slug: 'seo-content-optimizer',
        description: 'Instructs AI agents to audit and optimize web content for search engine visibility. Analyzes: title tags, meta descriptions, heading hierarchy (H1-H6), internal linking structure, image alt text, structured data (JSON-LD), Core Web Vitals impact, and keyword density. Generates prioritized action lists with estimated traffic impact. Follows Google Search Central guidelines.',
        author: 'Community',
        authorAvatar: '',
        githubRepo: 'https://github.com/Fredess74/AGORA-MVP/tree/main/skills/seo-optimizer',
        pricingModel: 'free' as const,
        pricePerCallUsd: 0,
        subscriptionPriceUsd: 0,
        freetierCalls: 0,
        trustScore: 0.745,
        trustLevel: 'medium' as const,
        trustConfidence: 'medium' as const,
        totalCalls: 198,
        totalUsers: 56,
        avgLatencyMs: 700,
        uptime: 99.3,
        category: 'performance',
        tags: ['skill', 'seo', 'content', 'meta-tags', 'structured-data', 'google'],
        rating: 4.3,
        reviewCount: 15,
        createdAt: '2026-02-20T00:00:00Z',
        status: 'active',
    },
    {
        id: 'agora-skill-resume-writer-001',
        did: 'did:agora:skill-resume-writer-v1',
        type: 'skill' as const,
        name: 'Resume & Cover Letter Engine',
        slug: 'resume-cover-letter-engine',
        description: 'Enables AI agents to craft ATS-optimized resumes and tailored cover letters. Parses job descriptions to extract required skills, maps candidate experience to job requirements, applies Harvard OCS formatting, optimizes keyword density for Applicant Tracking Systems (Workday, Greenhouse, Lever), and generates multiple format outputs (PDF, DOCX, plain text). Includes STAR method bullet point generation.',
        author: 'Agora Foundation',
        authorAvatar: '',
        githubRepo: 'https://github.com/Fredess74/AGORA-MVP/tree/main/skills/resume-engine',
        pricingModel: 'free' as const,
        pricePerCallUsd: 0,
        subscriptionPriceUsd: 0,
        freetierCalls: 0,
        trustScore: 0.812,
        trustLevel: 'high' as const,
        trustConfidence: 'medium' as const,
        totalCalls: 421,
        totalUsers: 156,
        avgLatencyMs: 500,
        uptime: 99.8,
        category: 'general',
        tags: ['skill', 'resume', 'cover-letter', 'ats', 'career', 'job-search'],
        rating: 4.9,
        reviewCount: 52,
        createdAt: '2026-02-15T00:00:00Z',
        status: 'active',
    },
    {
        id: 'agora-skill-competitive-analysis-001',
        did: 'did:agora:skill-competitive-analysis-v1',
        type: 'skill' as const,
        name: 'Competitive Analysis Framework',
        slug: 'competitive-analysis-framework',
        description: 'Teaches AI agents to conduct structured competitive intelligence research. Uses Porter\'s Five Forces, SWOT matrices, and Blue Ocean strategy frameworks. Agent learns to: scrape public pricing pages, compare feature matrices, analyze G2/Capterra review sentiment, map market positioning, calculate TAM/SAM/SOM, and generate executive comparison decks with data-backed recommendations.',
        author: 'Community',
        authorAvatar: '',
        githubRepo: 'https://github.com/Fredess74/AGORA-MVP/tree/main/skills/competitive-analysis',
        pricingModel: 'free' as const,
        pricePerCallUsd: 0,
        subscriptionPriceUsd: 0,
        freetierCalls: 0,
        trustScore: 0.718,
        trustLevel: 'medium' as const,
        trustConfidence: 'low' as const,
        totalCalls: 93,
        totalUsers: 28,
        avgLatencyMs: 1500,
        uptime: 99.1,
        category: 'analytics',
        tags: ['skill', 'competitive-analysis', 'market-research', 'swot', 'strategy'],
        rating: 4.1,
        reviewCount: 9,
        createdAt: '2026-02-10T00:00:00Z',
        status: 'active',
    },
    {
        id: 'agora-skill-prompt-engineering-001',
        did: 'did:agora:skill-prompt-engineering-v1',
        type: 'skill' as const,
        name: 'Prompt Engineering Toolkit',
        slug: 'prompt-engineering-toolkit',
        description: 'Meta-skill that teaches AI agents to craft, test, and optimize prompts for other LLMs. Covers: chain-of-thought scaffolding, few-shot example selection, system prompt architecture, temperature/top-p tuning guidelines, token budget optimization, and A/B testing frameworks for prompt variants. Includes model-specific strategies for GPT-4o, Claude 3.5, Gemini 2.0, and Llama 3. Reduces hallucination rates by 40-60% in tested scenarios.',
        author: 'Agora Foundation',
        authorAvatar: '',
        githubRepo: 'https://github.com/Fredess74/AGORA-MVP/tree/main/skills/prompt-engineering',
        pricingModel: 'free' as const,
        pricePerCallUsd: 0,
        subscriptionPriceUsd: 0,
        freetierCalls: 0,
        trustScore: 0.891,
        trustLevel: 'high' as const,
        trustConfidence: 'high' as const,
        totalCalls: 567,
        totalUsers: 201,
        avgLatencyMs: 350,
        uptime: 99.9,
        category: 'general',
        tags: ['skill', 'prompt-engineering', 'llm', 'gpt', 'claude', 'gemini', 'optimization'],
        rating: 4.9,
        reviewCount: 68,
        createdAt: '2026-02-05T00:00:00Z',
        status: 'active',
    },
    {
        id: 'agora-mcp-supabase-001',
        did: 'did:agora:mcp-supabase-v1',
        type: 'mcp_server' as const,
        name: 'Supabase MCP Server',
        slug: 'supabase-mcp-server',
        description: 'Connect any AI agent to Supabase databases via MCP protocol. Provides tools for CRUD operations, RLS-aware queries, real-time subscriptions, and storage bucket management. Auto-discovers table schemas.',
        author: 'Community',
        authorAvatar: '',
        githubRepo: 'https://github.com/supabase/mcp-server-supabase',
        pricingModel: 'free' as const,
        pricePerCallUsd: 0,
        subscriptionPriceUsd: 0,
        freetierCalls: 0,
        trustScore: 0.881,
        trustLevel: 'high' as const,
        trustConfidence: 'high' as const,
        totalCalls: 1450,
        totalUsers: 234,
        avgLatencyMs: 340,
        uptime: 99.7,
        category: 'general',
        tags: ['mcp', 'supabase', 'database', 'postgres', 'real-time'],
        rating: 4.9,
        reviewCount: 45,
        createdAt: '2026-02-01T00:00:00Z',
        status: 'active',
    },
    {
        id: 'agora-mcp-github-001',
        did: 'did:agora:mcp-github-v1',
        type: 'mcp_server' as const,
        name: 'GitHub MCP Server',
        slug: 'github-mcp-server',
        description: 'Official GitHub MCP integration. Gives AI agents access to repositories, issues, pull requests, code search, and Actions workflows. Supports both personal and organization scopes with fine-grained PAT tokens.',
        author: 'Community',
        authorAvatar: '',
        githubRepo: 'https://github.com/github/mcp-server',
        pricingModel: 'free' as const,
        pricePerCallUsd: 0,
        subscriptionPriceUsd: 0,
        freetierCalls: 0,
        trustScore: 0.934,
        trustLevel: 'high' as const,
        trustConfidence: 'high' as const,
        totalCalls: 2890,
        totalUsers: 512,
        avgLatencyMs: 280,
        uptime: 99.9,
        category: 'general',
        tags: ['mcp', 'github', 'code', 'issues', 'pull-requests'],
        rating: 4.8,
        reviewCount: 67,
        createdAt: '2026-01-20T00:00:00Z',
        status: 'active',
    },
];

export async function fetchProducts(): Promise<Product[]> {
    try {
        // Race Supabase vs 3s timeout so seed listings always load
        const result = await Promise.race([
            supabase.from('listings').select('*').eq('status', 'active').order('created_at', { ascending: false }),
            new Promise<{ data: null; error: { message: string } }>((resolve) =>
                setTimeout(() => resolve({ data: null, error: { message: 'Supabase timeout' } }), 8000)
            ),
        ]);

        const { data, error } = result;
        if (error) {
            console.warn('Supabase unavailable, showing seed listings:', error.message);
            return AGORA_SEED_LISTINGS;
        }

        const dbProducts = (data || []).map(mapDbListing);
        return [...AGORA_SEED_LISTINGS, ...dbProducts];
    } catch {
        return AGORA_SEED_LISTINGS;
    }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
    // Check seed listings first
    const seedProduct = AGORA_SEED_LISTINGS.find(p => p.slug === slug);
    if (seedProduct) return seedProduct;

    const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error fetching listing:', error);
        return null;
    }

    return data ? mapDbListing(data) : null;
}

export async function fetchProductsByCategory(category: string): Promise<Product[]> {
    const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('type', category)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching listings by category:', error);
        return [];
    }

    return (data || []).map(mapDbListing);
}

export async function searchProducts(query: string): Promise<Product[]> {
    const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,author_name.ilike.%${query}%`)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error searching listings:', error);
        return [];
    }

    return (data || []).map(mapDbListing);
}

export async function createListing(listing: Partial<Product> & { creatorId: string; status?: string }): Promise<Product | null> {
    const dbRow = {
        ...mapToDbListing(listing),
        creator_id: listing.creatorId,
        status: listing.status || 'draft',
    };

    const { data, error } = await supabase
        .from('listings')
        .insert([dbRow])
        .select()
        .single();

    if (error) {
        console.error('Error creating listing:', error);
        return null;
    }

    return data ? mapDbListing(data) : null;
}

// ── Creator's Own Listings ────────────────────────────────

export async function fetchMyListings(userId: string): Promise<Product[]> {
    const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('creator_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching my listings:', error);
        return [];
    }

    return (data || []).map(mapDbListing);
}

export async function updateListing(id: string, updates: Partial<Product> & { status?: string }): Promise<Product | null> {
    const dbUpdates: Record<string, unknown> = {};

    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.type !== undefined) dbUpdates.type = updates.type;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
    if (updates.githubRepo !== undefined) dbUpdates.github_repo = updates.githubRepo;
    if (updates.pricingModel !== undefined) dbUpdates.pricing_model = updates.pricingModel;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    dbUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
        .from('listings')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating listing:', error);
        return null;
    }

    return data ? mapDbListing(data) : null;
}

export async function deleteListing(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting listing:', error);
        return false;
    }

    return true;
}

export async function publishListing(id: string): Promise<Product | null> {
    return updateListing(id, { status: 'active' });
}

export async function unpublishListing(id: string): Promise<Product | null> {
    return updateListing(id, { status: 'draft' });
}

// ── Auth ──────────────────────────────────────────────────

export async function signInWithGitHub() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
        },
    });

    if (error) {
        console.error('GitHub auth error:', error);
    }

    return { data, error };
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Sign out error:', error);
}

export async function getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Also fetch from our profiles table
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return {
        id: user.id,
        githubId: user.user_metadata?.provider_id || 0,
        username: profile?.username || user.user_metadata?.user_name || 'user',
        email: user.email,
        avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url,
        role: profile?.role || 'buyer',
        stripeAccountId: profile?.stripe_account_id,
    };
}

// ── Reviews ───────────────────────────────────────────────

export async function fetchReviews(listingId: string) {
    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('listing_id', listingId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }

    return data || [];
}

export async function createReview(review: {
    listing_id: string;
    rating: number;
    comment: string;
}) {
    const { data, error } = await supabase
        .from('reviews')
        .insert([review])
        .select()
        .single();

    if (error) {
        console.error('Error creating review:', error);
        return null;
    }

    return data;
}

// ── Categories ────────────────────────────────────────────

export async function fetchCategories() {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }

    return data || [];
}

// ── API Keys ──────────────────────────────────────────────

export interface ApiKey {
    id: string;
    name: string;
    keyPrefix: string;
    scopes: string[];
    lastUsedAt: string | null;
    expiresAt: string | null;
    createdAt: string;
}

function generateKeyString(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'agora_';
    for (let i = 0; i < 40; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

async function hashKey(key: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function createApiKey(name: string = 'Default Key', scopes: string[] = ['read', 'write']): Promise<{ apiKey: ApiKey; fullKey: string } | null> {
    const fullKey = generateKeyString();
    const keyHash = await hashKey(fullKey);
    const keyPrefix = fullKey.substring(0, 14);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from('api_keys')
        .insert([{
            user_id: user.id,
            name,
            key_hash: keyHash,
            key_prefix: keyPrefix,
            scopes,
        }])
        .select()
        .single();

    if (error) {
        console.error('Error creating API key:', error);
        return null;
    }

    return {
        apiKey: mapApiKey(data),
        fullKey,
    };
}

export async function fetchApiKeys(): Promise<ApiKey[]> {
    const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching API keys:', error);
        return [];
    }

    return (data || []).map(mapApiKey);
}

export async function deleteApiKey(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting API key:', error);
        return false;
    }

    return true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiKey(row: any): ApiKey {
    return {
        id: row.id,
        name: row.name,
        keyPrefix: row.key_prefix,
        scopes: row.scopes || ['read'],
        lastUsedAt: row.last_used_at,
        expiresAt: row.expires_at,
        createdAt: row.created_at,
    };
}

// ── Usage Logs ────────────────────────────────────────────

export interface UsageLog {
    id: string;
    listingId: string;
    userId: string;
    action: string;
    latencyMs: number;
    statusCode: number;
    metadata: Record<string, unknown>;
    createdAt: string;
}

export async function logUsage(entry: {
    listing_id: string;
    action?: string;
    latency_ms?: number;
    status_code?: number;
    metadata?: Record<string, unknown>;
}): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
        .from('usage_logs')
        .insert([{
            ...entry,
            user_id: user?.id,
            action: entry.action || 'api_call',
            latency_ms: entry.latency_ms || 0,
            status_code: entry.status_code || 200,
        }]);

    if (error) {
        console.error('Error logging usage:', error);
        return false;
    }

    // Increment total_calls on the listing (best-effort, ignore failures)
    try {
        await supabase.rpc('increment_listing_calls', { listing_uuid: entry.listing_id });
    } catch {
        // RPC may not exist yet — silently ignore
    }

    return true;
}

export async function fetchUsageLogs(listingId?: string, days: number = 7): Promise<UsageLog[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    let query = supabase
        .from('usage_logs')
        .select('*')
        .gte('created_at', since.toISOString())
        .order('created_at', { ascending: false });

    if (listingId) {
        query = query.eq('listing_id', listingId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching usage logs:', error);
        return [];
    }

    return (data || []).map(mapUsageLog);
}

export async function fetchUsageStats(listingId?: string, days: number = 7): Promise<{ date: string; count: number }[]> {
    const logs = await fetchUsageLogs(listingId, days);

    // Group by date
    const grouped: Record<string, number> = {};
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        grouped[key] = 0;
    }

    for (const log of logs) {
        const key = log.createdAt.split('T')[0];
        if (grouped[key] !== undefined) grouped[key]++;
    }

    return Object.entries(grouped).map(([date, count]) => ({ date, count }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapUsageLog(row: any): UsageLog {
    return {
        id: row.id,
        listingId: row.listing_id,
        userId: row.user_id,
        action: row.action,
        latencyMs: row.latency_ms,
        statusCode: row.status_code,
        metadata: row.metadata || {},
        createdAt: row.created_at,
    };
}

// ── DID Generation ────────────────────────────────────────

export function generateDID(): string {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    return `did:agora:${hex}`;
}

export function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        + '-' + Math.random().toString(36).substring(2, 6);
}

// ── Trust Score Computation ───────────────────────────────

export function computeInitialTrustScore(params: {
    hasGithubRepo: boolean;
    hasDescription: boolean;
    hasEndpoint: boolean;
    hasTags: boolean;
}): number {
    let score = 0.1; // Base score
    if (params.hasGithubRepo) score += 0.25;
    if (params.hasDescription) score += 0.15;
    if (params.hasEndpoint) score += 0.3;
    if (params.hasTags) score += 0.1;
    return Math.min(score, 1.0);
}

// ── Mappers ───────────────────────────────────────────────

// Map DB row → frontend Product type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbListing(row: any): Product {
    return {
        id: row.id,
        did: row.did || '',
        type: row.type || 'mcp_server',
        name: row.name,
        slug: row.slug,
        description: row.description || '',
        author: row.author_name || '',
        authorAvatar: row.author_avatar || '',
        githubRepo: row.github_repo || '',
        pricingModel: row.pricing_model || 'free',
        pricePerCallUsd: row.price_per_call,
        subscriptionPriceUsd: row.subscription_price,
        freetierCalls: row.freetier_calls,
        trustScore: row.trust_score || 0,
        trustLevel: row.trust_score >= 0.8 ? 'high' : row.trust_score >= 0.5 ? 'medium' : 'low',
        trustConfidence: 'medium',
        totalCalls: row.total_calls || 0,
        totalUsers: row.total_users || 0,
        avgLatencyMs: row.avg_latency_ms || 0,
        uptime: row.uptime || 0,
        category: row.category || '',
        tags: row.tags || [],
        rating: row.rating || 0,
        reviewCount: row.review_count || 0,
        createdAt: row.created_at,
        status: row.status || 'active',
    };
}

function mapToDbListing(p: Partial<Product>) {
    return {
        did: p.did,
        type: p.type,
        name: p.name,
        slug: p.slug,
        description: p.description,
        author_name: p.author,
        author_avatar: p.authorAvatar,
        github_repo: p.githubRepo,
        pricing_model: p.pricingModel,
        price_per_call: p.pricePerCallUsd,
        subscription_price: p.subscriptionPriceUsd,
        freetier_calls: p.freetierCalls,
        trust_score: p.trustScore,
        total_calls: p.totalCalls,
        total_users: p.totalUsers,
        avg_latency_ms: p.avgLatencyMs,
        uptime: p.uptime,
        category: p.category,
        tags: p.tags,
        rating: p.rating,
        review_count: p.reviewCount,
    };
}
