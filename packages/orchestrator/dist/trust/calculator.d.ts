import type { TrustBreakdown, TrustComponent, TrustComponentScore } from '../types.js';
import type { SpeedMode } from '../types.js';
/** Get trust level from score */
export declare function getTrustLevel(score: number): 'high' | 'medium' | 'low' | 'unrated';
/** Calculate composite trust score from components */
export declare function calculateCompositeScore(components: TrustComponentScore[]): number;
/** Capability match: keyword overlap between task requirements and agent capabilities */
export declare function computeCapabilityMatch(taskType: string, taskDomain: string, agentTags: string[], agentDescription: string): number;
/** Response time score: decay function, 0-10s = excellent, >60s = poor */
export declare function computeResponseTimeScore(latencyMs: number): number;
/** Execution quality: API success rate × data completeness */
export declare function computeExecutionScore(apiSuccesses: number, apiTotal: number, dataPoints: number, expectedDataPoints: number): number;
/** History score from Supabase: min(1, pastTransactions / 10) */
export declare function computeHistoryScore(transactionCount: number): number;
/**
 * LiveTrustTracker — tracks trust score as it builds from 0 during a session
 * Emits SSE events on each component update so the UI shows real-time growth
 */
export declare class LiveTrustTracker {
    private sessionId;
    private agentId;
    private agentName;
    private agentDid;
    private speedMode;
    private components;
    constructor(sessionId: string, agentId: string, agentName: string, agentDid: string, speedMode: SpeedMode);
    /** Update a single component and emit SSE event */
    updateComponent(component: TrustComponent, score: number, reason: string): Promise<void>;
    /** Set identity score based on DID/ZK verification */
    checkIdentity(hasDid: boolean, zkVerifiable: boolean): Promise<void>;
    /** Set capability match score */
    checkCapability(taskType: string, taskDomain: string, agentTags: string[], agentDescription: string): Promise<void>;
    /** Update response time score */
    recordResponseTime(latencyMs: number): Promise<void>;
    /** Update execution quality score */
    recordExecution(apiSuccesses: number, apiTotal: number, dataPoints: number, expectedDataPoints: number): Promise<void>;
    /** Update peer review score from QA */
    recordPeerReview(rating: number): Promise<void>;
    /** Load history from Supabase */
    loadHistory(): Promise<void>;
    /** Get current composite score */
    getCompositeScore(): number;
    /** Get breakdown */
    getBreakdown(): TrustBreakdown;
    private getComponentsArray;
}
