/* ═══════════════════════════════════════════════════════════
   Agora Orchestrator — Express HTTP Server
   
   Endpoints:
   POST /api/demo/start    → Start E2E demo
   GET  /api/demo/stream   → SSE event stream
   GET  /api/demo/session/:id → Get session state
   GET  /api/mcp/agents    → List agents
   GET  /api/mcp/trust/:id → Trust breakdown
   GET  /api/health        → Health check
   ═══════════════════════════════════════════════════════════ */

import express from 'express';
import cors from 'cors';
import { config, validateConfig } from './config.js';
import { addClient, removeClient, getClientCount } from './session/sse.js';
import { runDemo, getSession, getAllSessions } from './session/manager.js';
import { searchAgents, getAgentTrust, AGENT_REGISTRY } from './mcp/tools.js';
import { v4 as uuid } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json());

// ── Health ──────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        version: '0.1.0',
        agents: AGENT_REGISTRY.length,
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
        // Start demo asynchronously (SSE will stream events)
        const sessionPromise = runDemo(query, speed);

        // Return session ID immediately
        // The client will receive events via SSE
        sessionPromise.then(session => {
            console.log(`  ✅ Demo completed: ${session.id} in ${session.totalLatencyMs}ms`);
        }).catch(err => {
            console.error(`  ❌ Demo failed:`, err.message);
        });

        // Wait a bit for session to initialize
        await new Promise(resolve => setTimeout(resolve, 100));
        const sessions = getAllSessions();
        const latest = sessions[sessions.length - 1];

        res.json({
            sessionId: latest?.id,
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

app.get('/api/demo/sessions', (_req, res) => {
    res.json(getAllSessions());
});

// ── MCP ─────────────────────────────────────────────────

app.get('/api/mcp/agents', (req, res) => {
    const { capability, category, minTrust, query } = req.query;
    const agents = searchAgents({
        capability: capability as string,
        category: category as string,
        minTrust: minTrust ? parseFloat(minTrust as string) : undefined,
        query: query as string,
    });
    res.json({ agents, count: agents.length });
});

app.get('/api/mcp/trust/:id', (req, res) => {
    const trust = getAgentTrust(req.params.id);
    if (!trust) return res.status(404).json({ error: 'Agent not found' });
    res.json(trust);
});

// ── Start ───────────────────────────────────────────────

async function main() {
    console.log('');
    console.log('  🏛️  AGORA ORCHESTRATOR v0.1');
    console.log('  ═══════════════════════════');
    console.log('');

    if (!validateConfig()) {
        process.exit(1);
    }

    app.listen(config.port, () => {
        console.log(`  🚀 Server running: http://localhost:${config.port}`);
        console.log(`  📡 SSE stream:     http://localhost:${config.port}/api/demo/stream`);
        console.log(`  🤖 Agents:         ${AGENT_REGISTRY.length} registered`);
        console.log('');
    });
}

main();
