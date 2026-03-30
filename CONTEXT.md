# AGORA

**The Trust Layer for the AI Agent Economy** — computed trust scores, searchable registry, and dual-rail payments.

## 🎯 Current Goal (2026-03-30)

**17-day sprint** to prepare pitch for Suffolk $40K Competition (April 16):

1. ✅ Standalone website (marketplace) — working, builds clean
2. ✅ MCP server for Claude/Gemini integration — built, compiles, needs live testing
3. ⬜ Pitch deck v5.0 — in progress

**Primary target:** Suffolk $40K Competition (April 16, 2026)

## Stack

| Layer | Tech | Location | Status |
|-------|------|----------|--------|
| Orchestrator | Express + Gemini 2.0 Flash + Supabase | `packages/orchestrator/src/` (19 files) | ✅ Working |
| Marketplace UI | React + Vite + Zustand + Supabase Auth | `packages/marketplace/src/` (19 tsx files) | ✅ Working |
| MCP Server | TypeScript + @modelcontextprotocol/sdk | `packages/mcp-server/src/` | ✅ Compiles, not deployed |
| Trend Agent | Node.js cron, GitHub/npm/HN APIs | `packages/trend-agent/` | ✅ Working |
| ZK Circuit | Circom | `circuits/trust_proof/` | ⚠️ File exists, NOT production-ready |
| Trust Layer Docs | Markdown strategies | `agora-trust-layer/` | 📄 Docs only |

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

## Trust Score — v2 Engine (EWMA + Wilson + Sigmoid)

6 components, live-calculated per transaction via adaptive weights by tier:

| Component | New Agent | Veteran |
|-----------|-----------|---------|
| Identity | 35% | 10% |
| Capability Match | 30% | 10% |
| Response Time | 15% | 25% |
| Execution Quality | 15% | 25% |
| Peer Review | 5% | 15% |
| History | 0% | 15% |

**Persistence (supabase.ts):**

- **Dynamic α**: Sigmoid curve `α(N) = 0.12 + 0.58/(1+e^(0.08×(N-30)))` — no tier cliffs
- **Cold-start**: Wilson Score lower bound for < 5 transactions (z=1.96)
- **Asymmetric**: Score < 0.5 → 2× deficit penalty (loss aversion)
- **Decay**: 30-day half-life: `T_old × 0.5^(days/30)`

## Development Commands

```bash
# Start marketplace
cd packages/marketplace && npm run dev

# Start orchestrator
cd packages/orchestrator && npm run dev

# Type-check
cd packages/orchestrator && npx tsc --noEmit
```

## Dev Workflows

```
/dev-autopilot              # Full CTO cycle: research → audit → execute → verify
/chief-strategist           # Deep strategic analysis — 1-2 decisions per session
/dev-init                   # Load session context
/dev-fix [bug]              # Debug specific bug
/dev-feature [feature]      # Add new feature

Session files:
  .agent/session/current.md       — last session state
  .agent/session/issues.md        — issue tracker (38 issues, 71% closed)  
  .agent/session/backlog.md       — prioritized backlog
  .agent/session/decisions.md     — strategic decisions log
  .agent/session/research_results.md — web research facts + URLs
  .agent/session/scan_results.md  — last code audit
  .agent/session/sprint.md        — current sprint tasks
```
