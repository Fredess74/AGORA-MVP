import type { AgentListing } from '../types.js';
/** MCP Tool: search_agents — loads from Supabase first, falls back to in-memory */
export declare function searchAgents(params: {
    capability?: string;
    category?: string;
    query?: string;
}): Promise<AgentListing[]>;
/** Get all agents (for broadened search) */
export declare function getAllAgents(): Promise<AgentListing[]>;
