<!--
purpose: Real technical architecture of Agora as it exists today
audience: Developers, AI systems, technical investors
last_updated: 2026-03-29
-->

# Agora — Technical Architecture

> **This document describes the CURRENT working system, not aspirational features.**
> Features marked "Phase 2" are planned but not yet built.

## System Overview

```
┌──────────────────────────────────────────────────────┐
│                    Marketplace UI                      │
│          React + Vite + Zustand + Supabase Auth        │
│               packages/marketplace/src/                │
│                   (29 components)                      │
└──────────────┬───────────────────────────┬────────────┘
               │  HTTP/SSE                  │  Supabase SDK
               ▼                            ▼
┌──────────────────────┐    ┌───────────────────────────┐
│   Orchestrator API    │    │       Supabase Cloud       │
│   Express + TS        │    │  PostgreSQL + Auth + RLS   │
│   port 3001           │    │                            │
│                       │    │  Tables:                   │
│  ┌─────────────────┐  │    │  - listings                │
│  │ Session Manager  │  │    │  - transactions            │
│  │ (pipeline ctrl)  │──│───▶│  - usage_logs              │
│  └─────────────────┘  │    │  - (agent_registry)        │
│  ┌─────────────────┐  │    └───────────────────────────┘
│  │ Trust Calculator │  │
│  │ (6 components)   │  │
│  └─────────────────┘  │
│  ┌─────────────────┐  │    ┌───────────────────────────┐
│  │  Agent Chains    │──│───▶│    External APIs           │
│  │  8 AI agents     │  │    │  - Gemini 2.0 Flash       │
│  └─────────────────┘  │    │  - GitHub API              │
│  ┌─────────────────┐  │    │  - npm Registry            │
│  │  SSE Manager     │  │    │  - PageSpeed Insights      │
│  │  (real-time)     │  │    │  - HackerNews Algolia      │
│  └─────────────────┘  │    └───────────────────────────┘
└──────────────────────┘
```

## Components

### 1. Marketplace UI (`packages/marketplace/src/`)

| Item | Detail |
| --- | --- |
| Framework | React 18 + TypeScript |
| Build | Vite |
| State | Zustand |
| Auth | Supabase Auth (Google OAuth) |
| Pages | 7 routes: /, /marketplace, /demo, /create-agent, /product/:id, /auth, /agents |

**Key files:**

- `pages/DemoPage.tsx` — 671-line E2E demo interface with SSE, pipeline stepper, trust visualization
- `pages/MarketplacePage.tsx` — Agent catalog with search/filter
- `store/useStore.ts` — Zustand store for products, auth state
- `lib/supabase.ts` — Supabase client configuration

### 2. Orchestrator (`packages/orchestrator/src/`)

| Item | Detail |
| --- | --- |
| Framework | Express.js + TypeScript |
| AI | Gemini 2.0 Flash (via @google/generative-ai) |
| DB | Supabase client |
| Real-time | Server-Sent Events (SSE) |
| Port | 3001 |

**API Endpoints:**

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/demo/start` | POST | Start demo session |
| `/api/demo/stream` | GET | SSE event stream |
| `/api/demo/session/:id` | GET | Session status/result |
| `/api/agents` | GET | List all agents |
| `/api/health` | GET | Health check |

**Agent Architecture:**

```
Demo Pipeline (8 agents):

Buyer Side:
  1. FormulatorAgent    — Parses user query into structured task
  2. ProcurementAgent   — Selects best agent via trust score
  3. QAInspectorAgent   — Validates delivered result

Seller Side:
  4. AccountManagerAgent — Receives task, plans execution
  5. BuyerResponseAgent  — Answers buyer questions
  6. DeliveryAgent       — Formats final report

Specialists (real API integrations):
  7. CodeGuardAgent     — GitHub API security audit
  8. MarketScopeAgent   — npm + HN + GitHub market research
     WebPulseAgent      — PageSpeed Insights performance audit
```

### 3. Trust Calculator (`packages/orchestrator/src/trust/calculator.ts`)

**THIS IS THE CANONICAL TRUST FORMULA.** Any other formula in any other document is aspirational.

| Component | Weight | How Computed |
| --- | --- | --- |
| `response_time` | 25% | Measured latency during execution |
| `execution_quality` | 25% | QA Inspector agent evaluation |
| `identity` | 20% | DID validation (starts at 0.7 for demo) |
| `capability_match` | 15% | Task-skill alignment score |
| `peer_review` | 10% | Cross-agent verification |
| `history` | 5% | Past interaction record |

**Scoring:**

- Range: 0.0 to 1.0
- Levels: `unrated` (new), `low` (<0.3), `medium` (0.3-0.6), `high` (0.6-0.8), `excellent` (>0.8)
- Updates: Real-time via SSE during demo execution
- Storage: Supabase (agent_registry fields)

### 4. Trend Agent (`packages/trend-agent/`)

Standalone Node.js service with cron scheduling:

- Scans GitHub trending repos
- Queries npm registry for package stats
- Queries HackerNews Algolia API for relevant discussions
- Creates agent listing suggestions

### 5. Database (Supabase)

**Active tables:**

- `listings` — Agent catalog entries
- `transactions` — Completed connections
- `usage_logs` — API call tracking

**Schema note:** `packages/core/schema.sql` defines a DIFFERENT schema (agents, trust_events, merkle_roots, trust_scores, disputes, api_keys with TimescaleDB). This schema is **planned but not deployed**. The active schema uses standard Supabase tables.

### 6. External API Dependencies

| API | Used By | Purpose | Auth |
| --- | --- | --- | --- |
| Gemini 2.0 Flash | All agents | LLM reasoning | API key (config.ts) |
| GitHub REST API | CodeGuard, MarketScope | Repo data, commits, deps | Public (rate-limited) |
| npm Registry | MarketScope | Package stats | Public |
| PageSpeed Insights | WebPulse | Performance metrics | API key (config.ts) |
| HackerNews Algolia | MarketScope | Discussion data | Public |
| Supabase | All | Data persistence, auth | Anon key (config.ts) |

---

## Phase 2 — Not Yet Built

> These items are described in other documents but DO NOT exist in code.
> **Deep Research (2026-03-29)** provides formal foundations for verification, routing, and anti-gaming.
> See: [RESEARCH_FOUNDATION.md](../research/RESEARCH_FOUNDATION.md)

### Verification Layer (from Deep Research)

Hybrid "Traffic Light" architecture for verifiable AI execution:

```
Client Request --> Risk Tier Classifier
    |
    +-- GREEN (85%)  --> TEE only (<10% overhead, ~$0.001)
    +-- YELLOW (12%) --> TEE + ZK Spot-Check (<25% OH, ~$0.01)
    +-- RED (3%)     --> Full zkML (>100% OH, ~$0.10+)
```

| Component | Status | Phase | Key Formula |
| --- | --- | --- | --- |
| TEE Remote Attestation | Not started | Phase 2 | MRENCLAVE + PCR binding, <10% overhead |
| Stochastic ZK-Spot-Checks | Not started | Phase 3 | P(detect) = 1-(1-0.05)^K; $0.07/check |
| opML Bisection Protocol | Not started | Phase 3 | O(log N) dispute rounds |
| PoEA (Model Attribution) | Not started | Phase 3 | Registry + TEE + ZK |
| Full zkML | Not started | Phase 4+ | Impractical for >70B models |

### Discovery/Routing Layer (from Deep Research)

| Component | Status | Phase | Key Formula |
| --- | --- | --- | --- |
| Poincare Ball Embeddings | Not started | Phase 2 | 2-5 dim hyperbolic > 100 dim euclidean |
| Trust-Weighted Distance | Not started | Phase 2 | d_TWP = (1/sqrt(tau)) * d_Poincare |
| VCG Auction Routing | Not started | Phase 2 | DSIC: agents cannot lie profitably |
| GAT Intent Decomposition | Not started | Phase 3 | Graph Attention Networks |
| MDP Chain Optimization | Not started | Phase 3 | Bellman optimality equation |
| Cascading Entropy Monitor | Not started | Phase 2 | P_chain = product(p_i); "95% Trap" |

### Anti-Gaming Layer (from Deep Research)

| Component | Status | Phase | Key Formula |
| --- | --- | --- | --- |
| BTS P2P Audit | Not started | Phase 2 | Score = log(x/y) -- strictly dominant strategy |
| Nonlinear Slashing | Not started | Phase 2 | Superlinear penalty destroys Sybil economics |
| Anti-Correlation Penalty | Not started | Phase 2 | Correlated failures penalized exponentially |

### Core Infrastructure (Phase 2)

| Feature | Status | Priority |
| --- | --- | --- |
| Payment Service (Stripe/x402) | Not started | P0 |
| Execution Monitor | Not started | P0 |
| MCP Discovery Endpoint | Not started | P0 |
| A2A adapter | Not started | P1 |
| AP2 adapter | Not started | P1 |
| x402 wrapper | Not started | P1 |
| ZK proof integration | Circuit exists, not integrated | P2 |
| Merkle tree score history | Not started | P2 |
| Rust Trust Engine | Not started | P2 |

---

## Known Issues

- `config.ts` exposes Supabase anon key in plaintext (acceptable for dev, needs env var for prod)
- SSE broadcasts to ALL clients (no session filtering)
- CORS open to `*` (needs origin whitelist for production)
- Gemini free tier: 15 RPM rate limit, ~4.5s between calls
- Health endpoint queries Supabase on every request
