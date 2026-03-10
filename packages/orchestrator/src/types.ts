/* ═══════════════════════════════════════════════════════════
   Agora Orchestrator — Shared Types
   ═══════════════════════════════════════════════════════════ */

// ── Demo Session ────────────────────────────────────────

export type SessionStatus =
    | 'started'
    | 'task_formulated'
    | 'searching'
    | 'agent_selected'
    | 'negotiating'
    | 'executing'
    | 'completed'
    | 'failed';

export type SpeedMode = 'slow' | 'fast';

export interface DemoSession {
    id: string;
    userQuery: string;
    structuredTask?: StructuredTask;
    selectedAgentId?: string;
    agentName?: string;
    status: SessionStatus;
    result?: string;
    trustBefore?: TrustBreakdown;
    trustAfter?: TrustBreakdown;
    totalLatencyMs?: number;
    apiCallsMade: number;
    speedMode: SpeedMode;
    createdAt: string;
    completedAt?: string;
}

// ── Structured Task ─────────────────────────────────────

export interface StructuredTask {
    task_type: string;
    target: string;
    domain: string;
    current_state?: string;
    desired_state?: string;
    deliverables: string[];
    priority: 'low' | 'medium' | 'high' | 'critical';
    constraints?: string[];
}

// ── Trust ────────────────────────────────────────────────

export type TrustComponent =
    | 'code_quality'
    | 'repo_health'
    | 'uptime'
    | 'transaction_success'
    | 'user_reviews'
    | 'account_age';

export interface TrustComponentScore {
    component: TrustComponent;
    score: number;      // 0.0 - 1.0
    weight: number;     // 0.0 - 1.0, all weights sum to 1.0
    rawData?: Record<string, unknown>;
    updatedAt: string;
}

export interface TrustBreakdown {
    agentId: string;
    agentName: string;
    components: TrustComponentScore[];
    compositeScore: number;
    level: 'high' | 'medium' | 'low' | 'unrated';
}

// ── Agent Registry ──────────────────────────────────────

export interface AgentListing {
    id: string;
    did: string;
    name: string;
    slug: string;
    description: string;
    type: 'mcp_server' | 'ai_agent' | 'automation';
    capabilities: string[];
    category: string;
    trustScore: number;
    trustLevel: 'high' | 'medium' | 'low';
    pricingModel: 'free' | 'per_call' | 'subscription';
    pricePerCall?: number;
    totalCalls: number;
    avgLatencyMs: number;
    uptime: number;
}

// ── SSE Events ──────────────────────────────────────────

export type SSEEventType =
    | 'session_started'
    | 'task_formulated'
    | 'mcp_search'
    | 'agent_selected'
    | 'negotiation_message'
    | 'work_started'
    | 'api_call'
    | 'work_progress'
    | 'work_completed'
    | 'trust_updated'
    | 'session_completed'
    | 'error';

export interface SSEEvent {
    type: SSEEventType;
    timestamp: string;
    sessionId: string;
    sender: string;
    title: string;
    content: string;
    metadata?: Record<string, unknown>;
}

// ── Negotiation ─────────────────────────────────────────

export interface NegotiationMessage {
    id: string;
    sessionId: string;
    sender: 'buyer_formulator' | 'buyer_procurement' | 'buyer_qa'
    | 'seller_account' | 'seller_specialist' | 'seller_delivery'
    | 'agora_system';
    senderLabel: string;
    message: string;
    messageType: 'text' | 'json' | 'markdown' | 'status';
    timestamp: string;
    metadata?: Record<string, unknown>;
}

// ── Agent Chain ─────────────────────────────────────────

export interface AgentResponse {
    content: string;
    metadata?: Record<string, unknown>;
    latencyMs: number;
}

// ── External API Data ───────────────────────────────────

export interface GitHubRepoData {
    name: string;
    fullName: string;
    description: string;
    stars: number;
    forks: number;
    openIssues: number;
    language: string;
    languages: Record<string, number>;
    createdAt: string;
    updatedAt: string;
    pushedAt: string;
    license?: string;
    hasReadme: boolean;
    defaultBranch: string;
    contributors: number;
    recentCommits: { message: string; date: string; author: string }[];
    topics: string[];
    size: number;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
}

export interface NpmPackageData {
    name: string;
    version: string;
    description: string;
    weeklyDownloads: number;
    monthlyDownloads: number;
    dependencies: number;
    maintainers: number;
    lastPublished: string;
    license: string;
}

export interface HackerNewsItem {
    title: string;
    url: string;
    points: number;
    numComments: number;
    author: string;
    createdAt: string;
}

export interface PageSpeedData {
    url: string;
    strategy: 'mobile' | 'desktop';
    performanceScore: number;
    lcpMs: number;          // Largest Contentful Paint
    fidMs: number;          // First Input Delay  
    clsScore: number;       // Cumulative Layout Shift
    fcpMs: number;          // First Contentful Paint
    ttiMs: number;          // Time to Interactive
    speedIndex: number;
    totalBlockingTime: number;
    opportunities: { title: string; savings: string }[];
    diagnostics: { title: string; description: string }[];
}
