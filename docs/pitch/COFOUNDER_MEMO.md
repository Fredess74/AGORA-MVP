<!--
purpose: Pitch for technical co-founder. What Agora is, what's built, what's needed.
audience: Potential CTO / co-founder
reads_after: 01_OVERVIEW.md
language: English
last_updated: 2026-03-08
-->

# Co-Founder Memo

> **TL;DR:** Infrastructure for AI agent economy (trust + discovery + payments). Trust engine built in Rust (15K SLOC, 170+ tests). Need a technical co-founder to build payment processing and scale. AI-first company: 7 AI agents, max 15 humans.

## The 30-Second Pitch

10,000+ AI tools exist. Zero way to verify trust before sending money or data. Protocols for communication (MCP, 97M+ downloads) and payment (x402, 100M+ processed) are live. Missing: "Should I trust this agent?"

Agora is the trust + discovery + payment layer for the AI agent economy.

## What's Built

Canonical build status: [ARCHITECTURE.md](../technical/ARCHITECTURE.md)

- **Trust Engine** — Rust, 15K SLOC, 170+ unit tests, 6-signal scoring
- **ZK Proofs** — Circom + Groth16, cryptographic trust verification
- **REST API** — 8 endpoints, full middleware
- **Marketplace** — React, 7 pages, responsive
- **Infrastructure** — Docker + K8s, deployment-ready

## What's Not Built (Your Job)

| Feature | Why It Matters | Timeline |
|---------|---------------|---------|
| Payment processing (Stripe + x402) | Blocks all revenue | Month 1-2 |
| Execution monitoring | Blocks trust data collection | Month 1-2 |
| MCP discovery endpoint | Blocks AI assistant channel | Month 2-3 |
| Escrow + dispute resolution | Blocks consumer confidence | Month 3-4 |

## Business Model

4 revenue streams in Year 1: marketplace commission (10%), Trust API (SaaS), prepaid balance float, promoted listings. Dual-rail payments (prepaid fiat + x402 crypto) make micro-transactions profitable.

Full details: [04_BUSINESS_MODEL.md](../04_BUSINESS_MODEL.md)

## AI-First Operations

7 AI agents run internal operations. Specs: [04_BUSINESS_MODEL.md](../04_BUSINESS_MODEL.md#ai-agent-specifications)

**Cost:** $200/mo in API calls replaces $12,000/mo in human operations.

**Phase 1 burn:** $4,900/month (1 human + AI agents).

## Market

$7B (2025) → $93B (2032), 46% CAGR. No trust infrastructure exists.

Competitors: Skyfire (identity+payments, no trust), Masumi (DIDs, no marketplace), Scalekit (auth only). None combines trust + discovery + payments.

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
