export type SessionStatus = 'started' | 'task_formulated' | 'searching' | 'agent_selected' | 'negotiating' | 'executing' | 'completed' | 'failed';
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
export type TrustComponent = 'identity' | 'capability_match' | 'response_time' | 'execution_quality' | 'peer_review' | 'history';
export interface TrustComponentScore {
    component: TrustComponent;
    score: number;
    weight: number;
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
    trustLevel: 'high' | 'medium' | 'low' | 'unrated';
    pricingModel: 'free' | 'per_call' | 'subscription';
    pricePerCall?: number;
    totalCalls: number;
    avgLatencyMs: number;
    uptime: number;
}
export type SSEEventType = 'session_started' | 'task_formulated' | 'mcp_search' | 'agent_selected' | 'negotiation' | 'work_started' | 'api_call' | 'work_completed' | 'qa_review' | 'trust_component_update' | 'trust_updated' | 'session_completed';
export interface SSEEvent {
    type: SSEEventType;
    timestamp: string;
    sessionId: string;
    sender: string;
    title: string;
    content: string;
    metadata?: Record<string, unknown>;
}
export interface NegotiationMessage {
    id: string;
    sessionId: string;
    sender: 'buyer_formulator' | 'buyer_procurement' | 'buyer_qa' | 'seller_account' | 'seller_specialist' | 'seller_delivery' | 'agora_system';
    senderLabel: string;
    message: string;
    messageType: 'text' | 'json' | 'markdown' | 'status';
    timestamp: string;
    metadata?: Record<string, unknown>;
}
export interface AgentResponse {
    content: string;
    metadata?: Record<string, unknown>;
    latencyMs: number;
}
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
    recentCommits: {
        message: string;
        date: string;
        author: string;
    }[];
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
    lcpMs: number;
    fidMs: number;
    clsScore: number;
    fcpMs: number;
    ttiMs: number;
    speedIndex: number;
    totalBlockingTime: number;
    opportunities: {
        title: string;
        savings: string;
    }[];
    diagnostics: {
        title: string;
        description: string;
    }[];
}
