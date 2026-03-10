# API Module — Status

> ⚠️ **This package is PLANNED, not built.** No source code exists yet.

## What Exists

| File | Purpose | Status |
| --- | --- | --- |
| `Cargo.toml` | Rust package definition | Placeholder only |
| `.env.example` | Target env vars for production API | Reference only |
| `README.md` | API description | Describes planned endpoints |
| `MAP.md` | This file | — |

## Current API Location

The **working** API is Express.js (TypeScript):

- `packages/orchestrator/src/server.ts` (127 lines)
- Endpoints: `/api/demo/start`, `/api/demo/stream` (SSE), `/api/demo/session/:id`, `/api/mcp/agents`, `/api/health`

## Planned Architecture (Phase 2)

When built, this Rust API will replace the Express orchestrator for production:

```
packages/api/src/
├── main.rs           # Actix-web server
├── routes/
│   ├── health.rs     # GET /v1/health
│   ├── agents.rs     # POST /v1/agents/register
│   ├── trust.rs      # GET /v1/trust/{did}
│   └── events.rs     # POST /v1/events/report
└── integrations/
    ├── a2a.rs        # Google A2A protocol
    ├── ap2.rs        # Agent Payment Protocol
    └── x402.rs       # Micropayments (HTTP 402)
```
