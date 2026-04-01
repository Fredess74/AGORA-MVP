# AGORA

**Marketplace & Counterparty Risk Engine for the AI Agent Economy** — behavioral credibility scores, searchable agent registry, and dual-rail payments (fiat + x402).

## 👥 Team

| Name | Role | Focus |
|------|------|-------|
| **Vladimir Putkov** | CEO / Chief Strategy Officer | Vision, pitch, outreach, Q&A |
| **Amirsaid Velikhanov** (Amir) | CFO / Head of Finance & Analytics | Financial model, unit economics, market sizing |
| **Egor Nikotin** | Head of DevOps / Product Lead | Deployment, demo, catalog, MCP server |

## 🎯 Current Goal (April 2026)

**Suffolk $40K Competition** — April 16, 2026
- ✅ Marketplace website — working, builds clean
- ✅ MCP server for Claude/Gemini — built, compiles
- ✅ Trust Engine v2 — EWMA + Wilson + Sigmoid, 31 tests passing
- ⬜ Pitch deck — GAMMA_PROMPT_V6_FINAL.md ready for Gamma AI

## 📁 Directory Structure (ONLY what exists)

```
Agora 2/                          ← Workspace root
├── .agent/                       ← AI session memory (workflows, sessions)
├── agora_team_playbook.html      ← Team roles playbook (актуально)
├── Agora_Team_Playbook.pdf       ← PDF version
│
└── Agora/                        ← Main project repo
    ├── CONTEXT.md                ← THIS FILE — ground truth
    ├── README.md                 ← Public README
    │
    ├── packages/                 ← ONLY working code lives here
    │   ├── marketplace/          ← React + Vite + Zustand + Supabase Auth
    │   ├── orchestrator/         ← Express + Gemini 2.0 Flash + Supabase
    │   ├── mcp-server/           ← TypeScript + @modelcontextprotocol/sdk
    │   └── trend-agent/          ← Node.js cron, GitHub/npm/HN APIs
    │
    ├── docs/                     ← Active documentation
    │   ├── 00-10_*.md            ← Business strategy docs (numbered series)
    │   ├── AI_FIRST_OPS.md       ← AI-first operations plan
    │   ├── GAMMA_PROMPT_V6_FINAL.md ← Final Gamma AI prompt for pitch deck
    │   ├── mvp/                  ← Suffolk 40K pitch materials
    │   │   ├── PITCH_DECK_v4.md  ← Master pitch script (slides + timing)
    │   │   ├── SLIDE_CONTENT_v4.md ← Fact-checked slide content
    │   │   ├── COMPETITOR_ANALYSIS_40K.md
    │   │   ├── COMPETITION_PLAYBOOK.md
    │   │   └── MVP_CONCEPT.md
    │   ├── research/             ← Market research (verified data + URLs)
    │   ├── technical/            ← Architecture docs
    │   └── developer/            ← Developer-facing docs
    │
    └── _archive/                 ← OLD/DEAD — do NOT read or reference
        ├── business/             ← Old business plans
        ├── dead_packages/        ← api/, core/, sdk-python/, sdk-typescript/ (never built)
        ├── circuits/             ← ZK Circom (not integrated)
        ├── deploy/               ← Docker/k8s (not used)
        ├── docs/                 ← Superseded prompts, old pitch versions
        ├── pitch_decks/          ← Old PPTX files
        ├── protocol/             ← Old protocol specs
        └── reference_decks/      ← Revolut, Ferrari reference decks
```

> ⚠️ **AI RULE: NEVER read from `_archive/`. It contains outdated docs with wrong data (e.g., wrong founder name "Frederic", non-existent packages). Always use `docs/` and `packages/` only.**

## Stack

| Layer | Tech | Location | Status |
|-------|------|----------|--------|
| Orchestrator | Express + Gemini 2.0 Flash + Supabase | `packages/orchestrator/src/` | ✅ Working |
| Marketplace UI | React + Vite + Zustand + Supabase Auth | `packages/marketplace/src/` | ✅ Working |
| MCP Server | TypeScript + @modelcontextprotocol/sdk | `packages/mcp-server/src/` | ✅ Compiles |
| Trend Agent | Node.js cron, GitHub/npm/HN APIs | `packages/trend-agent/` | ✅ Working |

## Architecture

```
User Query → FormulatorAgent (Gemini) → MCP search (Supabase)
  → ProcurementAgent → AccountManager → Specialist Agent
  → DeliveryAgent → QA Inspector → Live Trust Score → SSE → UI
```

3 Specialist Agents with real API integrations:
- **CodeGuard** → GitHub API (repo data, commits, deps)
- **MarketScope** → npm Registry + HackerNews Algolia + GitHub Search
- **WebPulse** → Google PageSpeed Insights

## Trust Score — v2 Engine

6 components, live-calculated per transaction via adaptive weights by tier:

| Component | New Agent | Veteran |
|-----------|-----------|---------|
| Identity | 35% | 10% |
| Capability Match | 30% | 10% |
| Response Time | 15% | 25% |
| Execution Quality | 15% | 25% |
| Peer Review | 5% | 15% |
| History | 0% | 15% |

- **Dynamic α**: `α(N) = 0.12 + 0.58/(1+e^(0.08×(N-30)))`
- **Cold-start**: Wilson Score lower bound (z=1.96) for < 5 txns
- **Asymmetric**: Score < 0.5 → 2× deficit penalty
- **Decay**: 30-day half-life: `T_old × 0.5^(days/30)`

## Revenue Model

| Stream | Pricing | Timeline |
|--------|---------|----------|
| Marketplace Commission | 10% per transaction | Day 1 |
| Trust API Subscriptions | Free/29/99/mo | Day 1 |
| Prepaid Balance Fees | 3% convenience | Month 1 |
| Premium API | $29-199/mo | Month 4-6 |

Phase 1 burn: ~$850/mo (tools + infra + legal, no salaries). Break-even target: ~$2,000-5,000/mo.

**Product Architecture (DEC-008):**
- **Website (agora.market):** Search, listing management, analytics. NO in-browser chat.
- **AI Assistants (Claude/Gemini/ChatGPT):** Agent discovery + execution via Agora MCP Server.

## Development Commands

```bash
# Start marketplace
cd packages/marketplace && npm run dev

# Start orchestrator
cd packages/orchestrator && npm run dev

# Type-check
cd packages/orchestrator && npx tsc --noEmit

# Build marketplace
cd packages/marketplace && npm run build
```

## Session Files

```
.agent/session/current.md       — last session state
.agent/session/issues.md        — issue tracker
.agent/session/backlog.md       — prioritized backlog
.agent/session/decisions.md     — strategic decisions log
.agent/session/research_results.md — web research facts + URLs
.agent/session/scan_results.md  — last code audit
.agent/session/sprint.md        — current sprint tasks
```
