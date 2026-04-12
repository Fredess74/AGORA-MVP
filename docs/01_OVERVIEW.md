<!--
purpose: Complete overview of Agora — what it is, why it exists, how it works.
audience: Anyone — investors, co-founders, AI systems, developers
reads_after: 00_INDEX.md
language: English
last_updated: 2026-04-11
-->

# Agora — Overview

> **TL;DR:** Agora is a creator platform and behavioral trust engine for the AI agent economy. Indie developers publish AI agents, MCP servers, and Skills. Buyers discover trusted tools via behavioral trust scores (EWMA + Wilson + Sigmoid, 6 components, adaptive weights). We are the "Etsy for AI" — the missing layer in the agentic commerce trust stack that Visa, Google, and Stripe don't build. Phase 1 burn: ~$850/mo (3 co-founders, no salaries, AI-augmented operations). Break-even target: ~30 Trust API subscribers.

## What Agora Is

The AI agent economy has 16,000+ tools — but no place where creators earn and no way to verify quality. Agora provides three things:

1. **Create & Publish** — creator platform where indie devs list agents, MCP servers, and Skills with zero friction
2. **Trust** — adaptive 6-signal behavioral score (0.0–1.0) from real transaction data, with EWMA persistence and 30-day decay
3. **Earn** — revenue per use for creators (post-LLC via Stripe/x402), trust badges for viral distribution

These three functions form a **creator flywheel**: publish → get scored → earn reputation → attract buyers → earn revenue → publish more.

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

**The gap:** $10.9B market (2026) → $93B+ by 2032 (46% CAGR). Payment rails exist (Stripe, Coinbase, Circle, x402). Communication protocols exist (MCP, A2A). **Nobody evaluates whether the agent on the other end is safe to work with.**

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

### Three Phases — Creator → Business → Autonomous

| Phase | Timeline | Who | What Happens | Avg. Transaction |
|-------|----------|-----|-------------|------------------|
| **Phase 1: Creators** | Now – Month 12 | Indie devs, solo builders | Developers publish AI tools, discover each other's work, build for their own needs or a niche market. Human decision-makers. | $3–50 |
| **Phase 2: Businesses** | Month 6–24 | SMBs, teams, orgs | Companies integrate as legal entities. Procurement workflows, team accounts, compliance needs. Creators serve business clients. | $50–$10,000 |
| **Phase 3: Autonomous** | Month 18–36+ | AI agents (A2A/M2M) | Agents autonomously discover, evaluate, and hire other agents via API. Full machine-to-machine commerce. | $0.01–$500 |

> **Philosophy:** A2A/M2M is the inevitable future — but it requires humans first. Phase 1 brings the decision-makers who will later need a platform for this new form of business. We build trust data through human transactions → then automate.

Government: long-term possibility (Phase 3+). No resources allocated.

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

4 revenue streams. **Trust API SaaS = primary.** Canonical details: [04_BUSINESS_MODEL.md](04_BUSINESS_MODEL.md)

| Stream | Launches | Revenue Type | Priority |
|--------|---------|-------------|----------|
| Trust API SaaS | Day 1 (post-LLC) | SaaS subscription ($29-199/mo) | 🔴 PRIMARY |
| Marketplace Commission (10%) | Day 1 (post-LLC) | Per-transaction | 🟡 SECONDARY |
| Featured Listings / Badges | Month 2 | Creator upsell ($9-29/mo) | 🟡 SECONDARY |
| Compliance API (EU AI Act) | Month 6-12 | Enterprise SaaS ($5K-50K/yr) | 🔵 PHASE 2 |

> **Why SaaS-first:** Claude Marketplace = 0% commission. Google UCP = native discovery. Commission = race to zero. Trust data = monopoly asset.

AI-augmented operations: 3 operational AI agents (CodeGuard, MarketScope, WebPulse), expanding to 7+. Details: [04_BUSINESS_MODEL.md](04_BUSINESS_MODEL.md#ai-agent-specifications)

---

## Competitive Position (Updated April 2026)

Named competitors and analysis: [05_MARKET_AND_COMPETITION.md](05_MARKET_AND_COMPETITION.md)

**The Agentic Commerce Trust Stack** (everyone built their layer, ours is missing):

- **Settlement:** x402 Foundation (Linux), Stripe MPP, Visa IC Connect
- **Discovery:** OpenAI ACP, Google UCP, MCP registries
- **Governance:** AP2, Mastercard Verifiable Intent
- **Identity:** Visa TAP, Skyfire ($14.5M, silent), Scalekit
- **Behavioral Trust:** ★ AGORA ★ — the missing layer

**Funded trust competitors (Q1 2026):** FabricLayer ($2.5M seed), OpenBox AI ($5M seed), Trent AI (€11M seed), Tumeryk (funded), Akto (funded). **$40M+ deployed to MCP security seed rounds.** ALL do static/pre-deploy scanning. NONE do behavioral runtime trust. NONE have a creator marketplace.

**Creator marketplace gap:** Glama, Smithery = free directories (zero monetization). Claude Marketplace = enterprise-only, 0% commission. Google UCP = for Walmart/Target. AWS Marketplace = $25K minimum. **Nobody serves the indie AI developer.**

**Key insight:** We don't compete with Big Tech infrastructure — we complement it. They verify WHO the agent is and WHETHER payment is authorized. We verify HOW WELL the agent performs. And we give creators a place to earn.

---

## Our Vision

Every economic revolution creates infrastructure that outlasts individual companies. The AI agent economy operates 24/7, scales infinitely, costs a fraction of human services.

This economy requires trust infrastructure. The protocols for communication (MCP), coordination (A2A), and payment (AP2, x402) are live. Missing layer: "Should I trust this agent with my money and data?"

Agora is that layer. Full philosophy: [09_PHILOSOPHY.md](09_PHILOSOPHY.md)

---

## Why Now — The Agent Economy Is Here

1. **Full payment stack is LIVE** — Visa IC Connect (Apr 8, 2026), Stripe MPP (Mar 18), x402 Foundation (Linux), Google UCP (Jan), Mastercard Verifiable Intent (Mar)
2. **Protocols are mature** — MCP (97M+ downloads, 16K+ servers), A2A (150+ orgs), AAIF (170+ members)
3. **$40M+ deployed to AI security startups** in Q1 2026 alone — validates the market, but nobody does behavioral trust
4. **Zero creator monetization** — 16,000+ MCP servers, all listed in free directories (Glama, Smithery). No way for indie devs to earn.
5. **Regulation incoming** — EU AI Act enforcement August 2, 2026 (€35M fines). Trust data = compliance requirement.
6. **0% commission race** — Claude Marketplace (0%), Google UCP (free). Commission models dead. SaaS trust data wins.

**Window:** 12-18 months. Trust data accumulates — first mover with real transaction data has permanent advantage.

---

## Open Questions

1. **Hypothesis:** AI assistant channel is the primary growth driver. Contingent on MCP server registration.
2. **Hypothesis:** Two market tiers are sufficient. If enterprise demand appears early, may need accelerated org-tier features.
3. **Unknown:** What happens when a major platform builds native trust? Mitigation in [07_RISK_ANALYSIS.md](07_RISK_ANALYSIS.md).
