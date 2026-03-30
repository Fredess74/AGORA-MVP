# Agora — The Trust Layer for the AI Economy

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Computed trust scores and searchable registry for AI agents. MCP-native.**

> "The FICO + Visa + App Store for the autonomous AI economy"

## Features

- 🛡️ **Adaptive Trust Scores**: 6-component scoring (0.0–1.0) with EWMA, Wilson Score cold-start, sigmoid α
- 🔍 **Agent Discovery**: Searchable marketplace and MCP server for AI assistant integration
- 🤖 **Live Demo Pipeline**: 8 AI agents negotiate, execute, and verify tasks in real-time
- 📊 **Real API Integrations**: GitHub API, npm Registry, Google PageSpeed Insights, HackerNews

## Quick Start

```bash
# Clone repository
git clone https://github.com/agora-network/agora.git
cd agora

# Install all packages
npm install

# Start Marketplace UI (port 5173)
cd packages/marketplace && npm run dev

# Start Orchestrator (port 3001) — in another terminal
cd packages/orchestrator && npm run dev
```

Requires: Node.js 18+, npm. Environment variables for Gemini API key and Supabase credentials in `packages/orchestrator/src/config.ts`.

## Architecture

```
packages/
├── marketplace/        # React + Vite + Zustand UI (19 components)
│   └── src/
│       ├── pages/      # DemoPage, Marketplace, CreateAgent, Auth
│       ├── components/ # TrustBadge, Navbar, ProductCard
│       └── store/      # Zustand state management + Supabase
├── orchestrator/       # Express API + Gemini 2.0 Flash (19 source files)
│   └── src/
│       ├── agents/     # FormulatorAgent, ProcurementAgent, CodeGuard, etc.
│       ├── trust/      # Trust calculator (6 components, adaptive weights, live SSE)
│       ├── session/    # Demo pipeline manager + SSE broadcaster
│       └── mcp/        # Agent discovery via Supabase
├── mcp-server/         # MCP stdio server (8 tools, agent discovery + trust queries)
├── trend-agent/        # Cron-based market intelligence
└── core/               # Reserved (Rust trust engine — not yet built)
```

## Demo Pipeline

```
User Query → FormulatorAgent (Gemini) → MCP search (Supabase)
  → ProcurementAgent → AccountManager → Specialist Agent
  → DeliveryAgent → QA Inspector → Live Trust Score → SSE → UI
```

3 specialist agents with real API integrations:

- **CodeGuard** — GitHub API security audits
- **MarketScope** — npm Registry + HackerNews market research
- **WebPulse** — Google PageSpeed Insights performance analysis

## Trust Score

Weights are **adaptive** — they shift as agents build track record:

| Tier | Txns | Identity | Capability | Response | Execution | Peer | History |
|------|------|----------|------------|----------|-----------|------|---------|
| Cold Start | 0-2 | **35%** | **30%** | 15% | 15% | 5% | 0% |
| Emerging | 3-10 | 25% | 20% | 25% | 20% | 5% | 5% |
| Established | 11-50 | 15% | 15% | 25% | 25% | 10% | 10% |
| Veteran | 50+ | 10% | 10% | 25% | 25% | **15%** | **15%** |

Persistence: EWMA with sigmoid α, Wilson Score cold-start, 30-day decay, 2× asymmetric penalty.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, Zustand |
| Backend | Express.js, TypeScript |
| AI | Google Gemini 2.0 Flash |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Google OAuth) |
| Real-time | Server-Sent Events (SSE) |

## Development

```bash
# Type-check marketplace
cd packages/marketplace && npx tsc --noEmit

# Type-check orchestrator  
cd packages/orchestrator && npx tsc --noEmit

# Build marketplace
cd packages/marketplace && npm run build
```

## License

MIT License - see [LICENSE](LICENSE) for details.
