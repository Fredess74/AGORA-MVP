import type { Response } from 'express';
import type { SSEEvent, SSEEventType, SpeedMode } from '../types.js';
/** Register a new SSE client */
export declare function addClient(clientId: string, res: Response): void;
/** Remove a disconnected client */
export declare function removeClient(clientId: string): void;
/** Get number of connected clients */
export declare function getClientCount(): number;
/** Broadcast an SSE event to all clients */
export declare function broadcast(event: SSEEvent): void;
/** Helper: emit event with optional delay for presentation mode */
export declare function emit(type: SSEEventType, sessionId: string, sender: string, title: string, content: string, speedMode?: SpeedMode, metadata?: Record<string, unknown>): Promise<void>;
