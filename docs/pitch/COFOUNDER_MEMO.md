<!--
purpose: Pitch for technical co-founder. What Agora is, what's built, what's needed.
audience: Potential CTO / co-founder
reads_after: 01_OVERVIEW.md
language: English
last_updated: 2026-03-30
-->

# Co-Founder Memo

> **TL;DR:** Infrastructure for AI agent economy (trust + discovery + payments). TypeScript-based 6-component adaptive trust engine with EWMA, Wilson Score cold-start, and sigmoid α. Need a technical co-founder to build payment processing and scale. AI-first company: 8 AI agents in pipeline, max 15 humans.

## The 30-Second Pitch

thousands of AI tools exist. Zero way to verify trust before sending money or data. Protocols for communication (MCP, 97M+ downloads) and payment (x402, 100M+ processed) are live. Missing: "Should I trust this agent?"

Agora is the trust + discovery + payment layer for the AI agent economy.

## What's Built

Canonical build status: [ARCHITECTURE.md](../technical/ARCHITECTURE.md)

- **Trust Engine** — TypeScript, 323-line calculator + EWMA persistence, 1 test file (209 lines), 6-signal adaptive scoring with 4 confidence tiers
- **ZK Proofs** — Circom circuit file exists in `circuits/` but is NOT integrated into the system
- **REST API** — 5 endpoints (health, agents, demo/start, demo/stream, demo/session)
- **Marketplace** — React, 7 routes, 19 components, responsive
- **MCP Server** — TypeScript, 8 tools, stdio transport, compiles cleanly
- **Infrastructure** — Vercel + Render configs exist, no Docker/K8s

## What's Not Built (Your Job)

| Feature | Why It Matters | Timeline |
|---------|---------------|---------|
| Payment processing (Stripe + x402) | Blocks all revenue | Month 1-2 |
| Execution monitoring | Blocks trust data collection | Month 1-2 |
| MCP discovery endpoint | Blocks AI assistant channel | Month 2-3 |
| Escrow + dispute resolution | Blocks consumer confidence | Month 3-4 |

## Business Model

4 revenue streams in Year 1: marketplace commission (10%), Trust API (SaaS), prepaid balance convenience fees, premium API access (priority resolution + SLA). Dual-rail payments (prepaid fiat + x402 crypto) make micro-transactions profitable.

Full details: [04_BUSINESS_MODEL.md](../04_BUSINESS_MODEL.md)

## AI-First Operations

7 AI agents run internal operations. Specs: [04_BUSINESS_MODEL.md](../04_BUSINESS_MODEL.md#ai-agent-specifications)

**Cost:** $200/mo in API calls replaces $12,000/mo in human operations.

**Phase 1 burn:** $4,900/month (1 human + AI agents).

## Market

$10.9B (2026) → $183B (2030), 76% CAGR (Precedence Research). No trust infrastructure exists.

Competitors: Recall Network ($42M, blockchain trust — high friction), BlueRock.io (static security scanning, not behavioral trust), Smithery (discovery-only, no trust). None combines dynamic behavioral trust + MCP-native discovery + compliance layer.

Full analysis: [05_MARKET_AND_COMPETITION.md](../05_MARKET_AND_COMPETITION.md)

## What I'm Looking For

A technical co-founder who:

1. Can ship production payment systems fast
2. Understands distributed systems (escrow, event-driven architectures)
3. Is comfortable being employee #2 at a company where #3-#7 are AI agents
4. Wants to build infrastructure that becomes default for the AI economy

**Equity split:** Negotiable, meaningful co-founder stake.

**Timeline:** 4-6 weeks to first revenue after payment processing is live.

---

## References

- Full overview: [01_OVERVIEW.md](../01_OVERVIEW.md)
- Technical architecture: [ARCHITECTURE.md](../technical/ARCHITECTURE.md)
- Financial projections: [08_FINANCIAL_PROJECTIONS.md](../08_FINANCIAL_PROJECTIONS.md)
- Roadmap: [06_EVOLUTION_ROADMAP.md](../06_EVOLUTION_ROADMAP.md)
