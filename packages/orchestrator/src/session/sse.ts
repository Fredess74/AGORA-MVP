/* ═══════════════════════════════════════════════════════════
   SSE (Server-Sent Events) Manager
   Broadcasts real-time events to all connected demo clients
   ═══════════════════════════════════════════════════════════ */

import type { Response } from 'express';
import type { SSEEvent, SSEEventType, SpeedMode } from '../types.js';

// Connected clients
const clients: Map<string, Response> = new Map();

/** Register a new SSE client */
export function addClient(clientId: string, res: Response): void {
    clients.set(clientId, res);
    console.log(`  📡 SSE client connected: ${clientId} (total: ${clients.size})`);
}

/** Remove a disconnected client */
export function removeClient(clientId: string): void {
    clients.delete(clientId);
    console.log(`  📡 SSE client disconnected: ${clientId} (total: ${clients.size})`);
}

/** Get number of connected clients */
export function getClientCount(): number {
    return clients.size;
}

/** Broadcast an SSE event to all clients */
export function broadcast(event: SSEEvent): void {
    const data = JSON.stringify(event);
    for (const [id, res] of clients) {
        try {
            res.write(`data: ${data}\n\n`);
        } catch {
            clients.delete(id);
        }
    }
}

/** Helper: emit event with optional delay for presentation mode */
export async function emit(
    type: SSEEventType,
    sessionId: string,
    sender: string,
    title: string,
    content: string,
    speedMode: SpeedMode = 'fast',
    metadata?: Record<string, unknown>
): Promise<void> {
    // In slow mode, add dramatic pause before event
    if (speedMode === 'slow') {
        const delays: Record<SSEEventType, number> = {
            session_started: 500,
            task_formulated: 2500,
            mcp_search: 2000,
            agent_selected: 2500,
            negotiation: 1800,
            work_started: 1500,
            api_call: 1000,
            work_completed: 1500,
            qa_review: 2000,
            trust_component_update: 800,
            trust_updated: 1500,
            session_completed: 1000,
        };
        await sleep(delays[type] || 1000);
    }

    broadcast({
        type,
        timestamp: new Date().toISOString(),
        sessionId,
        sender,
        title,
        content,
        metadata,
    });
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
