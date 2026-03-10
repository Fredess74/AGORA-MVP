import type { DemoSession, SpeedMode } from '../types.js';
/** Ensure Supabase has agents seeded */
export declare function initSessions(): Promise<void>;
/** Start a new demo session */
export declare function startSession(query: string, speedMode?: SpeedMode): Promise<DemoSession>;
export declare function getSession(id: string): DemoSession | undefined;
