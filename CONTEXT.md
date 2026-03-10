# AGORA

**The Trust Layer for the AI Agent Economy** — computed trust scores, searchable registry, and dual-rail payments.

## Stack

| Layer | Tech | Location | Status |
|-------|------|----------|--------|
| Orchestrator | Express + Gemini 2.0 Flash + Supabase | `packages/orchestrator/src/` | ✅ Working |
| Marketplace UI | React + Vite + Zustand + Supabase Auth | `packages/marketplace/src/` | ✅ Working |
| Trend Agent | Node.js cron, GitHub/npm/HN APIs | `packages/trend-agent/` | ✅ Working |
| ZK Circuit | Circom | `circuits/trust_proof/` | ⚠️ File exists, not integrated |
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

## Trust Score

6 components, live-calculated:

| Component | Weight |
|-----------|--------|
| Response Time | 25% |
| Execution Quality | 25% |
| Identity Verification | 20% |
| Capability Match | 15% |
| Peer Review | 10% |
| History | 5% |

## Текущий статус

✅ Working MVP with live demo pipeline
🎯 Focus: pitch competitions (Suffolk 40K, Fetch Defeat the Odds)

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
/dev-autopilot   # Full CTO cycle: research → audit → execute → verify
/dev-init        # Load session context
/dev-fix         # Debug specific bug
/dev-feature     # Add new feature
```
