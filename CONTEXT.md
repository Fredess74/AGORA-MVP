# AGORA

**Creator Platform & Behavioral Trust Engine for the AI Agent Economy** — the place where indie developers publish, monetize, and build reputation for AI agents, MCP servers, and Skills. Behavioral trust scoring (EWMA + Wilson + Sigmoid) is our core IP — the missing layer in the agentic commerce stack that Visa, Google, and Stripe don't build.

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

| Stream | Pricing | Timeline | Priority |
|--------|---------|----------|----------|
| Trust API SaaS | Free/$29/$99/$199 mo | Day 1 (post-LLC) | 🔴 PRIMARY |
| Marketplace Commission | 10% per transaction | Day 1 (post-LLC) | 🟡 SECONDARY |
| Featured Listings / Badges | $9-29/mo per creator | Month 2 | 🟡 SECONDARY |
| Compliance API (EU AI Act) | $5K-50K/year | Month 6-12 | 🔵 PHASE 2 |

> **Why SaaS-first:** Claude Marketplace = 0% commission. Google UCP = native discovery. Commission revenue is vulnerable to platform zero-fee strategies. Trust data = monopoly asset.

Phase 1 burn: ~$850/mo (tools + infra + legal, no salaries). Break-even target: ~$2,000-5,000/mo.

**Product Architecture (DEC-008):**
- **Website (agora.market):** Creator platform — publish, manage listings, analytics dashboard. Consumer side — search, compare trust scores, buy. NO in-browser chat.
- **AI Assistants (Claude/Gemini/ChatGPT):** Agent discovery + execution via Agora MCP Server.
- **CLI Tool (planned):** `npx agora-trust` — free trust report for any GitHub repo/MCP server.
- **Embeddable Badge (planned):** SVG trust badge for GitHub READMEs — viral distribution.
- **Trust API (planned):** Public JSON endpoint for programmatic trust queries.

**Positioning (DEC-009, April 2026):**
- Agora = **Creator Platform** (Etsy/npm for AI) + **Behavioral Trust Engine** (FICO for AI)
- We complement Visa (identity), Google (governance), Stripe (payments) — we are the **behavioral trust layer** they don't build
- Target: indie developers and small teams who build AI tools but have 0 distribution and 0 monetization

**Competitive Context (April 2026):**
- 15+ funded competitors in adjacent spaces ($40M+ in sector seed funding)
- Big Tech building closed ecosystems: Claude Marketplace (0% commission), Google UCP, OpenAI ACP
- Our defensible moat: adaptive 6-component behavioral trust scoring (calculator.ts, 323 lines, 31 tests)
- Nobody answers "how WELL will this agent perform" — Visa checks identity, MC checks authorization, we check quality

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
