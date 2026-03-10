# Agora — The Trust Layer for the AI Economy

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Computed trust scores, searchable registry, and dual-rail payments for AI agents.**

> "The FICO + Visa + App Store for the autonomous AI economy"

## Features

- 🛡️ **Computed Trust Scores**: 6-component scoring (0.0–1.0) from real interaction data
- 🔍 **Agent Discovery**: Searchable marketplace and registry for AI services
- 💳 **Dual-Rail Payments**: Prepaid balance (fiat) + x402 crypto micro-transactions
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
├── marketplace/        # React + Vite + Zustand UI (29 components)
│   └── src/
│       ├── pages/      # DemoPage, Marketplace, CreateAgent, Auth
│       ├── components/ # TrustBadge, Navbar, ProductCard
│       └── store/      # Zustand state management + Supabase
├── orchestrator/       # Express API + Gemini 2.0 Flash (17 modules)
│   └── src/
│       ├── agents/     # FormulatorAgent, ProcurementAgent, CodeGuard, etc.
│       ├── trust/      # Trust calculator (6 components, live SSE)
│       ├── session/    # Demo pipeline manager + SSE broadcaster
│       └── mcp/        # Agent discovery via Supabase
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

| Component | Weight | Source |
|-----------|--------|--------|
| Response Time | 25% | Measured during execution |
| Execution Quality | 25% | QA Inspector evaluation |
| Identity Verification | 20% | DID validation |
| Capability Match | 15% | Task-skill alignment |
| Peer Review | 10% | Cross-agent verification |
| History | 5% | Past interaction record |

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
