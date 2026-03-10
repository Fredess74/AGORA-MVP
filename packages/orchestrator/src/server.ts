/* ═══════════════════════════════════════════════════════════
   Agora Orchestrator — Express HTTP Server
   
   Endpoints:
   POST /api/demo/start    → Start E2E demo
   GET  /api/demo/stream   → SSE event stream
   GET  /api/demo/session/:id → Get session state
   GET  /api/mcp/agents    → List agents (from Supabase)
   GET  /api/health        → Health check
   ═══════════════════════════════════════════════════════════ */

import express from 'express';
import cors from 'cors';
import { config, validateConfig } from './config.js';
import { addClient, removeClient, getClientCount } from './session/sse.js';
import { startSession, getSession, initSessions } from './session/manager.js';
import { searchAgents, getAllAgents } from './mcp/tools.js';
import { v4 as uuid } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json());

// ── Health ──────────────────────────────────────────────

app.get('/api/health', async (_req, res) => {
    const agents = await getAllAgents();
    res.json({
        status: 'ok',
        version: '0.2.0',
        agents: agents.length,
        sseClients: getClientCount(),
        uptime: process.uptime(),
    });
});

// ── SSE Stream ──────────────────────────────────────────

app.get('/api/demo/stream', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
    });
    res.write('\n');

    const clientId = uuid();
    addClient(clientId, res);

    // Send heartbeat every 30s
    const heartbeat = setInterval(() => {
        res.write(': heartbeat\n\n');
    }, 30000);

    req.on('close', () => {
        clearInterval(heartbeat);
        removeClient(clientId);
    });
});

// ── Demo ────────────────────────────────────────────────

app.post('/api/demo/start', async (req, res) => {
    const { query, speed = 'slow' } = req.body;

    if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Missing "query" field' });
    }

    try {
        const session = await startSession(query, speed);

        res.json({
            sessionId: session.id,
            status: 'started',
            message: 'Demo started. Connect to /api/demo/stream for real-time events.',
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/demo/session/:id', (req, res) => {
    const session = getSession(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
});

// ── MCP ─────────────────────────────────────────────────

app.get('/api/mcp/agents', async (req, res) => {
    const { capability, category, query } = req.query;
    const agents = await searchAgents({
        capability: capability as string,
        category: category as string,
        query: query as string,
    });
    res.json({ agents, count: agents.length });
});

// ── Start ───────────────────────────────────────────────

async function main() {
    console.log('');
    console.log('  🏛️  AGORA ORCHESTRATOR v0.2');
    console.log('  ═══════════════════════════');
    console.log('');

    if (!validateConfig()) {
        process.exit(1);
    }

    // Seed agents into Supabase if needed
    await initSessions();

    const agents = await getAllAgents();

    app.listen(config.port, () => {
        console.log(`  🚀 Server running: http://localhost:${config.port}`);
        console.log(`  📡 SSE stream:     http://localhost:${config.port}/api/demo/stream`);
        console.log(`  🤖 Agents:         ${agents.length} registered`);
        console.log(`  💾 Supabase:       ${config.supabaseServiceKey ? '✅ Connected' : '⚠️  No service key'}`);
        console.log('');
    });
}

main();
