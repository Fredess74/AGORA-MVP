<!--
purpose: Complete overview of Agora — what it is, why it exists, how it works.
audience: Anyone — investors, co-founders, AI systems, developers
reads_after: 00_INDEX.md
language: English
last_updated: 2026-03-30
-->

# Agora — Overview

> **TL;DR:** Agora is a marketplace and counterparty risk engine for the AI agent economy. We provide a searchable registry for agent discovery and a behavioral trust score based on real transaction data to prevent fraud, data leakage, and agentic overspend. Phase 1 burn: ~$400-700/mo (3 co-founders, no salaries, AI-augmented operations). Break-even target: ~$2,000-5,000/mo.

## What Agora Is

Every economy needs three things: discovery, trust, and payment. The AI agent economy has none. Agora provides all three:

1. **Discovery** — searchable registry where agents and humans find services (MCP server + marketplace UI)
2. **Trust** — adaptive 6-signal reliability score (0.0–1.0) from real transaction data, with EWMA persistence
3. **Payment** — not yet built (designed for commission-based model via prepaid balance or x402)

These three functions form a **connection**: discover → verify → pay → execute. Agora sells connections.

---

## The Problem

AI agents are already making financial transactions, accessing databases, and performing operations autonomously. But there is no way to evaluate the counterparty risk of an AI agent before giving it access to your data or money.

**Concrete risks that exist TODAY:**

| Risk | What Happens | Real-World Example |
|------|-------------|-------------------|
| **Data Leakage** | Agent accesses confidential data and sends it to unauthorized parties | Paradox.ai leaked 64M applicant records (McDonald's) |
| **Fraud / Model Downgrade** | Agent claims to use GPT-4 but actually runs GPT-3.5 (97% cost savings stolen) | No detection standard exists |
| **Agentic Overspend** | Agent enters infinite loop and burns through budget | No spend caps in MCP/A2A protocols |
| **Sanctions Evasion** | Autonomous agents route payments through restricted jurisdictions | FinCEN has no AI-agent-specific guidance yet |
| **Prompt Injection** | Malicious instructions override agent’s safety controls | Supply chain attacks up 430% |
| **Unreliable Execution** | Agent fails silently or returns wrong results | VW Cariad: $7.5B in software losses |

**The gap:** $10.9B market (2026) → $183B by 2030 (76% CAGR, Precedence Research). Payment rails exist (Stripe, Coinbase, Circle, x402). Communication protocols exist (MCP, A2A). **Nobody evaluates whether the agent on the other end is safe to work with.**

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

Weights are **adaptive** (4 tiers: cold start → emerging → established → veteran). Cold start agents are scored heavily on identity/capability; veteran agents are scored on execution/peer review/history.

Not a rating — computed from real interaction data. Anti-gaming detectors are designed (not yet deployed). ZK proofs: Circom circuit exists but is not integrated.

Full specification: [02_TRUST_AND_CONNECTIONS.md](02_TRUST_AND_CONNECTIONS.md)

---

## What Is Built

Canonical build status: [technical/ARCHITECTURE.md](technical/ARCHITECTURE.md)

**Built:** Trust Calculator (TypeScript, 6 components with live SSE), Orchestrator API (Express, 5 endpoints), Demo Pipeline (8 AI agents), Marketplace UI (React, 7 pages), 3 Specialist Agents with real API integrations (GitHub, npm, PageSpeed), MCP Server (8 tools, TypeScript).

**Product Architecture:**
- **Website (agora.market):** Agent search, trust score cards, developer listing wizard, analytics dashboard. NO chat. NO "Try Agent" in browser.
- **AI Assistants (Claude/Gemini/ChatGPT):** Full agent discovery, selection, and execution via Agora MCP Server. This is where users actually WORK with agents.

**Not built (P0):** Payment processing, execution monitoring, MCP registry registration, escrow/disputes.

**Designed but not implemented:** Anti-gaming detectors, ZK proof integration, Merkle tree score history, Rust trust engine.

Path to first revenue: 4-6 weeks focused engineering on P0 items.

---

## Business Model Summary

4 revenue streams in Year 1. Canonical details: [04_BUSINESS_MODEL.md](04_BUSINESS_MODEL.md)

| Stream | Launches | Revenue Type |
|--------|---------|-------------|
| Marketplace Commission (10%) | Day 1 | Per-transaction |
| Trust API | Day 1 | SaaS subscription |
| Prepaid Balance Fees (3%) | Month 1 | Convenience fees on top-ups |
| Premium API Access | Month 4-6 | Priority resolution + SLA + enhanced trust data |

AI-augmented operations: 3 operational AI agents (CodeGuard, MarketScope, WebPulse), expanding to 7+. Details: [04_BUSINESS_MODEL.md](04_BUSINESS_MODEL.md#ai-agent-specifications)

---

## Competitive Position

Named competitors and analysis: [05_MARKET_AND_COMPETITION.md](05_MARKET_AND_COMPETITION.md)

**Payment infrastructure players (NOT competitors — complementary):**

- Google UCP (agent shopping protocol, Jan 2026)
- Mastercard Agent Pay (agentic tokens + verifiable intent, 2024-2026)
- Coinbase Agentic Wallets (agent-native wallets, x402 native, Feb 2026)
- Circle Nanopayments (gasless USDC micro-transactions, Feb 2026)

**Trust competitors:** Recall Network ($42M, blockchain-based AgentRank — Web3 friction), BlueRock.io (static security scanning — different from behavioral trust), Smithery (discovery-only registry). None offers dynamic behavioral trust scoring + MCP-native discovery + compliance layer.

**Key insight:** ALL major players are building payment rails. NONE are building the counterparty risk assessment layer. Agora evaluates whether an agent is safe to work with — across all platforms, all protocols.

---

## Our Vision

Every economic revolution creates infrastructure that outlasts individual companies. The AI agent economy operates 24/7, scales infinitely, costs a fraction of human services.

This economy requires trust infrastructure. The protocols for communication (MCP), coordination (A2A), and payment (AP2, x402) are live. Missing layer: "Should I trust this agent with my money and data?"

Agora is that layer. Full philosophy: [09_PHILOSOPHY.md](09_PHILOSOPHY.md)

---

## Why Now — The Agent Economy Is Here

1. **Payment infrastructure is LIVE** — x402, Coinbase Agentic Wallets, Circle Nanopayments, Google UCP, Mastercard Agent Pay — ALL launched Jan-Feb 2026
2. **Protocols are mature** — MCP (97M+ downloads, 16K+ servers), A2A (150+ orgs, v1.0 RC), AP2 (60+ payment partners)
3. **Agents ARE paying each other** — autonomous agent-to-agent transactions happening NOW (Circle: 140M payments by AI agents, $43M total volume)
4. **No counterparty risk solution exists** — Agents handle money and data with zero verification of the other party
5. **Regulation incoming** — EU AI Act (Aug 2, 2026, €35M fines), Colorado SB 24-205, NIST AI Agent Standards
6. **No marketplace exists** — payment rails exist, but no scored marketplace where agents find and verify each other

**Window:** 12-18 months. Trust data accumulates — first mover with real transaction data has permanent advantage.

---

## Open Questions

1. **Hypothesis:** AI assistant channel is the primary growth driver. Contingent on MCP server registration.
2. **Hypothesis:** Two market tiers are sufficient. If enterprise demand appears early, may need accelerated org-tier features.
3. **Unknown:** What happens when a major platform builds native trust? Mitigation in [07_RISK_ANALYSIS.md](07_RISK_ANALYSIS.md).
