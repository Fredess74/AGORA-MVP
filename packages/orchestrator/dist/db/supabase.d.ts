import { SupabaseClient } from '@supabase/supabase-js';
/** Get Supabase client (lazy init) */
export declare function getDb(): SupabaseClient | null;
/** Seed agents into Supabase if listings table is empty */
export declare function seedAgentsIfEmpty(): Promise<void>;
/** Get all agent listings from Supabase */
export declare function getAgentListings(): Promise<any[]>;
/** Get past transaction count for an agent */
export declare function getAgentTransactionCount(agentDid: string): Promise<number>;
/** Record a completed transaction */
export declare function recordTransaction(agentDid: string, amount: number, commission: number, metadata?: Record<string, unknown>): Promise<void>;
/** Update agent trust score and metrics in Supabase */
export declare function updateAgentMetrics(agentDid: string, trustScore: number, latencyMs: number): Promise<void>;
/** Log a usage event */
export declare function logUsage(agentDid: string, action: string, latencyMs: number, metadata?: Record<string, unknown>): Promise<void>;
