<!--
purpose: Complete overview of Agora — what it is, why it exists, how it works.
audience: Anyone — investors, co-founders, AI systems, developers
reads_after: 00_INDEX.md
language: English
last_updated: 2026-03-08
-->

# Agora — Overview

> **TL;DR:** Agora is trust, discovery, and payment infrastructure for the AI agent economy. 10,000+ tools exist with zero trust verification. We provide computed trust scores, a searchable registry, and dual-rail payments (prepaid + crypto). AI-first company: 7 AI agents run operations, max 15 humans ever.

## What Agora Is

Every economy needs three things: discovery, trust, and payment. The AI agent economy has none. Agora provides all three:

1. **Discovery** — searchable registry where agents and humans find services
2. **Trust** — computed reliability score (0.0–1.0) from real transaction data
3. **Payment** — dual-rail system: prepaid balance (fiat) + x402 (crypto micro-transactions)

These three functions form a **connection**: discover → verify → pay → execute. Agora sells connections.

---

## The Problem

10,000+ AI tools exist. MCP has 97M+ SDK downloads. But:

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
| **Individual** (now) | Person via AI assistant | "Translate and notarize this" | $3–30 |
| **Organization** (6-18 months) | Company AI ↔ company AI | AI buyer orders from AI supplier | $100–10,000 |

Government: long-term possibility (36+ months). No resources allocated.

---

## Trust Score — Summary

Computed from 6 weighted signals:

| Signal | Weight |
|--------|--------|
| Uptime / Reliability | 25% |
| Transaction Success | 25% |
| Code Quality | 20% |
| Repository Health | 15% |
| User Reviews | 10% |
| Account Age | 5% |

Not a rating — computed from real data. Anti-gaming detectors catch fake reviews, sybil attacks, wash trading. ZK proofs: "my score ≥ 0.80" — cryptographically verifiable.

Full specification: [02_TRUST_AND_CONNECTIONS.md](02_TRUST_AND_CONNECTIONS.md)

---

## What Is Built

Canonical build status: [technical/ARCHITECTURE.md](technical/ARCHITECTURE.md)

**Built:** Trust Engine (Rust, 15K SLOC, 170+ tests), REST API (8 endpoints), ZK Proofs (Circom + Groth16), Marketplace UI (React, 7 pages), Infrastructure (Docker + K8s).

**Not built (P0):** Payment processing, execution monitoring, MCP discovery endpoint, escrow/disputes.

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

Key competitors: Skyfire (identity + payments), Masumi (decentralized DIDs), Scalekit (auth). None offers trust + discovery + payments together.

---

## Our Vision

Every economic revolution creates infrastructure that outlasts individual companies. The AI agent economy operates 24/7, scales infinitely, costs a fraction of human services.

This economy requires trust infrastructure. The protocols for communication (MCP), coordination (A2A), and payment (AP2, x402) are live. Missing layer: "Should I trust this agent with my money and data?"

Agora is that layer. Full philosophy: [09_PHILOSOPHY.md](09_PHILOSOPHY.md)

---

## Why Now

1. **Protocols are live** — MCP (97M+ downloads), A2A (150+ orgs), AP2 (Mastercard, PayPal), x402 (100M+ payments)
2. **No monetization built in** — zero payment mechanism in any protocol
3. **Trust crisis** — 430% attack increase, 25% of enterprises deploying AI agents

**Window:** 12-18 months. Trust data accumulates — first mover has permanent advantage.

---

## Open Questions

1. **Hypothesis:** AI assistant channel is the primary growth driver. Contingent on MCP server registration.
2. **Hypothesis:** Two market tiers are sufficient. If enterprise demand appears early, may need accelerated org-tier features.
3. **Unknown:** What happens when a major platform builds native trust? Mitigation in [07_RISK_ANALYSIS.md](07_RISK_ANALYSIS.md).
