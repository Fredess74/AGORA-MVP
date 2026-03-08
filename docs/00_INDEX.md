<!--
purpose: Navigation index for all Agora documentation.
audience: AI systems, humans (anyone starting here)
reads_after: none (this is the entry point)
language: English
last_updated: 2026-03-08
-->

# Agora Documentation Index

> **TL;DR:** 15 docs organized by importance. Start with 01_OVERVIEW for full picture. 04_BUSINESS_MODEL is the canonical source for pricing, AI agents, and payment architecture.

## Quick Facts

| Fact | Value |
|------|-------|
| What | Trust + discovery + payment infrastructure for AI agents |
| Revenue | 4 streams: commission (10%), Trust API, convenience fees, creator tools |
| Payments | Dual-rail: prepaid balance (fiat) + x402 (crypto) |
| Team | 1 human + 7 AI agents (Phase 1), max 15 humans (Phase 3) |
| Burn | $4,900/month (Phase 1) |
| Built | Trust engine (Rust, 15K SLOC), API, ZK proofs, marketplace UI |
| Not built | Payments, escrow, MCP endpoint, execution monitoring |

## Document Map

### Core (Read First)

| # | Document | What It Covers |
|---|----------|---------------|
| 01 | [Overview](01_OVERVIEW.md) | What Agora is, how it works, why now |
| 02 | [Trust & Connections](02_TRUST_AND_CONNECTIONS.md) | Trust score formula, connection cycle, anti-gaming |
| 03 | [Funnel & Conversion](03_FUNNEL_AND_CONVERSION.md) | How users and AI find Agora, growth hypotheses |
| 04 | [Business Model](04_BUSINESS_MODEL.md) | **Canonical:** 4 revenue streams, dual-rail payments, AI agents, costs |

### Strategy

| # | Document | What It Covers |
|---|----------|---------------|
| 05 | [Market & Competition](05_MARKET_AND_COMPETITION.md) | TAM/SAM/SOM, named competitors, protocols |
| 06 | [Evolution Roadmap](06_EVOLUTION_ROADMAP.md) | 3 phases (Build → Grow → Scale), hiring plan |
| 07 | [Risk Analysis](07_RISK_ANALYSIS.md) | 15 risks, mitigations, SWOT, pivot triggers |
| 08 | [Financial Projections](08_FINANCIAL_PROJECTIONS.md) | Monthly revenue, bear/base cases, funding |
| 09 | [Philosophy](09_PHILOSOPHY.md) | 5 beliefs, vision of the future, why this opportunity |
| 10 | [Marketing Strategy](10_MARKETING_STRATEGY.md) | Blue ocean positioning, 4 unique tactics, metrics |

### Technical

| Document | What It Covers |
|----------|---------------|
| [Architecture](technical/ARCHITECTURE.md) | System components, stack, deployment, build status |
| [Protocols](technical/PROTOCOLS.md) | MCP, A2A, AP2, x402 — how they work with Agora |
| [Trust Engine](technical/TRUST_ENGINE.md) | Rust implementation, ZK circuits, anti-gaming detection |

### Pitch

| Document | What It Covers |
|----------|---------------|
| [Co-Founder Memo](pitch/COFOUNDER_MEMO.md) | Pitch for technical co-founder |
| [Sprint Plan](pitch/SPRINT_PLAN.md) | Current engineering priorities |

## Canonical Sources (Single Source of Truth)

To avoid duplication, these topics are defined in ONE doc:

| Topic | Canonical Source |
|-------|-----------------|
| AI agent specs, costs, self-monitoring | [04_BUSINESS_MODEL.md](04_BUSINESS_MODEL.md) |
| Pricing, commission, payouts | [04_BUSINESS_MODEL.md](04_BUSINESS_MODEL.md) |
| Dual-rail payment architecture | [04_BUSINESS_MODEL.md](04_BUSINESS_MODEL.md) |
| Trust score formula, weights | [02_TRUST_AND_CONNECTIONS.md](02_TRUST_AND_CONNECTIONS.md) |
| Build status (what exists / doesn't) | [technical/ARCHITECTURE.md](technical/ARCHITECTURE.md) |
| Market size, competitor names | [05_MARKET_AND_COMPETITION.md](05_MARKET_AND_COMPETITION.md) |
| Phase definitions, hiring plan | [06_EVOLUTION_ROADMAP.md](06_EVOLUTION_ROADMAP.md) |
| Vision, beliefs, philosophy | [09_PHILOSOPHY.md](09_PHILOSOPHY.md) |
| Marketing strategy, channels, tactics | [10_MARKETING_STRATEGY.md](10_MARKETING_STRATEGY.md) |

All other docs reference these instead of duplicating content.
