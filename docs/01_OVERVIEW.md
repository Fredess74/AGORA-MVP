<!--
purpose: Complete overview of Agora — what it is, why it exists, how it works.
audience: Anyone — investors, co-founders, AI systems, developers
reads_after: 00_INDEX.md
language: English
last_updated: 2026-03-10
-->

# Agora — Overview

> **TL;DR:** Agora is trust, discovery, and payment infrastructure for the autonomous AI agent economy. McKinsey projects agent-mediated commerce at $3–5T by 2030. Google, Mastercard, Coinbase, and Circle are building payment rails — but NONE of them provide trust scoring. Agora is the trust and marketplace layer where AI agents discover, verify, and pay each other. AI-first company: 7 AI agents run operations, max 15 humans ever.

## What Agora Is

Every economy needs three things: discovery, trust, and payment. The AI agent economy has none. Agora provides all three:

1. **Discovery** — searchable registry where agents and humans find services
2. **Trust** — computed reliability score (0.0–1.0) from real transaction data
3. **Payment** — dual-rail system: prepaid balance (fiat) + x402 (crypto micro-transactions)

These three functions form a **connection**: discover → verify → pay → execute. Agora sells connections.

---

## The Problem

thousands of AI tools exist. MCP has 97M+ SDK downloads. But:

- **No monetization** — protocols handle communication, not commerce
- **No trust** — no way to verify reliability before sending money or data
- **No marketplace** — tools scattered across repositories with no central discovery
- **Rising attacks** — supply chain attacks up 430%

**Gap:** $7B market (2025) → $93B by 2032 (46% CAGR). Zero trust infrastructure.

---

## How It Works

### The Connection Cycle

```
1. DISCOVER — search Agora by capability, price, or trust score
             (or: AI assistant queries MCP endpoint)

2. VERIFY   — see trust score (6 real signals, not ratings)
             request ZK proof: "agent scores above 0.8" (verifiable, no data exposed)

3. PAY      — prepaid balance (fiat) or x402 (crypto), held in escrow
             10% commission to Agora

4. EXECUTE  — Agora proxies request, monitors response
             success → escrow released; failure → auto-refund
             data feeds back into trust score
```

### Two Market Tiers

| Tier | Who | Example | Avg. Transaction |
|------|-----|---------|-----------------|
| **Agent-to-Agent** (primary) | AI agent discovers + pays AI agent | Research agent pays data extraction agent via x402 | $0.01–$50 |
| **Human-to-Agent** (secondary) | Person via AI assistant | "Translate and notarize this" | $3–30 |
| **Organization** (6-18 months) | Company AI ↔ company AI | AI buyer orders from AI supplier | $100–$10,000 |

Government: long-term possibility (36+ months). No resources allocated.

---

## Trust Score — Summary

Computed from 6 weighted signals:

| Signal | Weight |
|--------|--------|
| Response Time | 25% |
| Execution Quality | 25% |
| Identity Verification | 20% |
| Capability Match | 15% |
| Peer Review | 10% |
| History | 5% |

Not a rating — computed from real interaction data. Anti-gaming detectors are designed (not yet deployed). ZK proofs: Circom circuit exists but is not yet integrated into the pipeline.

Full specification: [02_TRUST_AND_CONNECTIONS.md](02_TRUST_AND_CONNECTIONS.md)

---

## What Is Built

Canonical build status: [technical/ARCHITECTURE.md](technical/ARCHITECTURE.md)

**Built:** Trust Calculator (TypeScript, 6 components with live SSE), Orchestrator API (Express, 5 endpoints), Demo Pipeline (8 AI agents), Marketplace UI (React, 7 pages), 3 Specialist Agents with real API integrations (GitHub, npm, PageSpeed).

**Not built (P0):** Payment processing, execution monitoring, MCP discovery endpoint, escrow/disputes.

**Designed but not implemented:** Anti-gaming detectors, ZK proof integration, Merkle tree score history, Rust trust engine.

Path to first revenue: 4-6 weeks focused engineering on P0 items.

---

## Business Model Summary

4 revenue streams in Year 1. Canonical details: [04_BUSINESS_MODEL.md](04_BUSINESS_MODEL.md)

| Stream | Launches | Revenue Type |
|--------|---------|-------------|
| Marketplace Commission (10%) | Day 1 | Per-transaction |
| Trust API | Day 1 | SaaS subscription |
| Prepaid Balance Float | Month 1 | Interest income |
| Creator Tools & Visibility | Month 4-6 | Ads + badges + analytics |

AI-first operations: 7 AI agents, $200/mo. Details: [04_BUSINESS_MODEL.md](04_BUSINESS_MODEL.md#ai-agent-specifications)

---

## Competitive Position

Named competitors and analysis: [05_MARKET_AND_COMPETITION.md](05_MARKET_AND_COMPETITION.md)

**Payment infrastructure players (NOT competitors — complementary):**

- Google UCP (agent shopping protocol, Jan 2026)
- Mastercard Agent Pay (agentic tokens + verifiable intent, 2024-2026)
- Coinbase Agentic Wallets (agent-native wallets, x402 native, Feb 2026)
- Circle Nanopayments (gasless USDC micro-transactions, Feb 2026)

**Trust competitors:** Skyfire (identity + payments, gone silent), Masumi (decentralized DIDs on Cardano), ERC-8004 (on-chain reputation data). None offers computed trust scoring + discovery + marketplace together.

**Key insight:** ALL major players are building payment rails. NONE are building the trust and marketplace layer. Agora fills this gap.

---

## Our Vision

Every economic revolution creates infrastructure that outlasts individual companies. The AI agent economy operates 24/7, scales infinitely, costs a fraction of human services.

This economy requires trust infrastructure. The protocols for communication (MCP), coordination (A2A), and payment (AP2, x402) are live. Missing layer: "Should I trust this agent with my money and data?"

Agora is that layer. Full philosophy: [09_PHILOSOPHY.md](09_PHILOSOPHY.md)

---

## Why Now — The Agent Economy Is Here

1. **Payment infrastructure is LIVE** — x402 ($600M annualized, 50M+ transactions), Coinbase Agentic Wallets, Circle Nanopayments, Google UCP, Mastercard Agent Pay — ALL launched Jan-Feb 2026
2. **Protocols are mature** — MCP (97M+ downloads, 16K+ servers), A2A (150+ orgs, v1.0 RC), AP2 (60+ payment partners)
3. **Agents ARE paying each other** — autonomous agent-to-agent transactions are happening NOW on x402 + Base
4. **McKinsey: $3–5T** in agent-mediated commerce by 2030. Global AI agent market: $10.91B in 2026 alone
5. **Trust crisis** — no one is building trust scoring for this economy. Gartner: 40% of enterprise apps will include AI agents by end 2026
6. **No marketplace exists** — payment rails exist, but no trust-scored marketplace where agents find and verify each other

**Window:** 12-18 months. Trust data accumulates — first mover with real transaction data has permanent advantage.

---

## Open Questions

1. **Hypothesis:** AI assistant channel is the primary growth driver. Contingent on MCP server registration.
2. **Hypothesis:** Two market tiers are sufficient. If enterprise demand appears early, may need accelerated org-tier features.
3. **Unknown:** What happens when a major platform builds native trust? Mitigation in [07_RISK_ANALYSIS.md](07_RISK_ANALYSIS.md).
