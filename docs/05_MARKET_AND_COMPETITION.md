<!--
purpose: Market sizing, named competitors, and strategic positioning based on real data.
audience: AI systems, investors, co-founders
reads_after: 04_BUSINESS_MODEL.md
language: English
last_updated: 2026-04-11
-->

# Market & Competition

## Market Size

### AI Agent Economy

**McKinsey: Agent-mediated commerce = $3–5 TRILLION by 2030 (Forbes)**

Global AI agent market: $10.91B in 2026, projected 46% CAGR.

| Metric | 2025 | 2026 | 2028 | 2032 | Source |
|--------|------|------|------|------|--------|
| Agentic AI market | $7.1B | ~$12B | ~$35B | $93.2B | Industry analysts, 46% CAGR |
| Enterprise AI agent deployment | 25% of enterprises | 40% projected | 50%+ | Majority | Gartner |
| SaaS pricing shift to usage-based | 83% of AI-native SaaS | Growing | Dominant | Standard | Deloitte |

### Protocol Ecosystem Size (Updated April 2026)

| Metric | Value | Source |
|--------|-------|--------|
| MCP SDK downloads | 97M+ | npm/PyPI |
| Published MCP servers | 16,000+ | MCP registries, dev.to |
| A2A partner organizations | 150+ | Google, Linux Foundation |
| AP2 launch partners | 60+ | Google (Mastercard, PayPal, Shopify) |
| x402 30-day volume (verified) | **$24M** | Nevermined, CoinMarketCap (April 2026) |
| Stablecoin total volume (2025) | **$33 trillion** | Forbes, CryptoRank |
| AAIF members | 170+ | Linux Foundation (April 2026) |
| MCP security sector seed funding | $40M+ | SoftwareStrategiesBlog |
| MCP monetization built in | None | Protocol specification |
| MCP trust verification built in | None | Protocol specification |

> ⚠️ **Previous version cited x402 "$600M annualized" — that figure included 40-50% wash trading. Corrected to $24M verified 30-day volume per Nevermined/CoinMarketCap April 2026 data.**

The gap is clear: massive supply of AI tools, growing payment infrastructure, **zero behavioral trust scoring**, fragmented creator monetization.

---

## Named Competitors

### Skyfire — Identity + Payments for AI Agents

| Aspect | Detail |
|--------|--------|
| Founded | Launched publicly June 2025 |
| Focus | "Know Your Agent" (KYA) — digital credentials + payment processing |
| What they do | Identity verification for agents, autonomous micropayments |
| What they don't do | No behavioral trust scoring, no marketplace/catalog, no anti-gaming |
| Revenue model | Transaction fees on payments |
| Strengths | Early mover in agent identity, Visa partnership (Dec 2025) |
| Weaknesses | Identity is static, no discovery. **Went silent since Jan 2026** — no new products announced |

### ERC-8004 — On-Chain AI Agent Identity & Reputation (Ethereum)

| Aspect | Detail |
|--------|--------|
| Launched | Ethereum mainnet, January 29, 2026 |
| Backed by | MetaMask, Ethereum Foundation, Google, Coinbase |
| What they do | 3 on-chain registries: Identity (NFT-based), Reputation (raw feedback), Validation (zkML/TEE) |
| What they don't do | **No scoring algorithm** — stores raw data, expects others to build scoring. No marketplace. No payments. |
| Traction | 10,000+ agents registered, 20,000+ feedback entries (testnet) |
| Strengths | Massive backing, true decentralization, composable |
| Weaknesses | On-chain = slow for real-time. Raw data only, no scoring. Blockchain friction. |
| **Agora angle** | Agora = the scoring engine that ERC-8004 needs but doesn't have. Integration target, not competitor. |

### Masumi Network — Decentralized Agent Ecosystem

| Aspect | Detail |
|--------|--------|
| Built on | Cardano blockchain |
| Focus | Decentralized Identifiers (DIDs) for AI agents, immutable decision logging |
| What they do | Assign verifiable DIDs to agents, log all decisions to blockchain |
| What they don't do | No active marketplace, no real-time trust scoring, no payment processing |
| Revenue model | Blockchain transaction fees |
| Strengths | True decentralization, immutable audit trail |
| Weaknesses | Blockchain dependency adds friction, slow for real-time AI operations, small ecosystem |

### Scalekit — Agent Authentication

| Aspect | Detail |
|--------|--------|
| Focus | Authentication protocols specifically for AI agents |
| What they do | Plug-in auth for agents (like "login with..." but for AI) |
| What they don't do | No trust scoring, no marketplace, no payments |
| Coverage | Authentication only — narrow scope |

### FICO — AI Trust Score Concept

| Aspect | Detail |
|--------|--------|
| Focus | Credit scoring for humans; AI trust concept discussed but not built |
| What they have | "Trust Score" for phone identity (Prove Identity product), AI foundation models for financial services |
| Relevance | The "AI FICO score" concept validates Agora's approach — but FICO itself has not built one for AI agents |

---

## The Agentic Commerce Trust Stack (April 2026)

> **Key Positioning Insight:** Every protocol solves ONE problem. Nobody solves behavioral trust.

```
THE AGENTIC COMMERCE TRUST STACK

┌────────────────────────────────────────────────────┐
│  Settlement     x402 / Stripe MPP / Visa IC       │ ← Who pays?
├────────────────────────────────────────────────────┤
│  Discovery      ACP / UCP / MCP registries        │ ← What's available?
├────────────────────────────────────────────────────┤
│  Governance     AP2 / Mastercard Verifiable Intent │ ← Is this authorized?
├────────────────────────────────────────────────────┤
│  Identity       Visa TAP / Skyfire / Scalekit      │ ← Is this a real agent?
├════════════════════════════════════════════════════╡
│  BEHAVIORAL     ★ AGORA ★                         │ ← Will this agent
│  TRUST          Trust Engine v2                    │   PERFORM WELL?
└────────────────────────────────────────────────────┘

"Everyone verifies WHO the agent is. Nobody verifies HOW WELL it works."
```

---

## Agent Economy Infrastructure (Complementary, NOT Competitors)

### NEW: Visa Intelligent Commerce Connect (April 8, 2026)

| Aspect | Detail |
|--------|--------|
| Launched | **April 8, 2026** (pilot phase) |
| What it does | Protocol-agnostic "on-ramp" for agentic commerce. Single integration for agent-initiated payments |
| Supports | TAP, MPP, ACP, UCP — ALL protocols through one gateway |
| Partners | AWS, Aldar, Highnote, Mesh, Payabli, Diddo, Sumvin |
| Trust scoring | **None** — payment gateway only |
| Source | visa.com, techinformed.com |

### NEW: Stripe Machine Payments Protocol (MPP) (March 18, 2026)

| Aspect | Detail |
|--------|--------|
| Launched | **March 18, 2026** |
| What it does | Session-based streaming micropayments. $0.01 USDC minimum. Batch settlement |
| Key feature | Supports stablecoins + fiat (cards, BNPL) via Stripe infrastructure |
| Trust scoring | **None** |
| Source | workos.com, formo.so |

### NEW: x402 Foundation (Linux Foundation)

| Aspect | Detail |
|--------|--------|
| Status | Under Linux Foundation governance. Founding members: Cloudflare, Google, Visa, Mastercard, Stripe |
| Volume | **$24M in 30-day period** (April 2026, verified via Nevermined/CoinMarketCap) |
| Key integration | Nevermined + Visa IC + x402 = fiat settlement through existing Visa card rails |
| Trust scoring | **None** |

### Google Universal Commerce Protocol (UCP)

| Aspect | Detail |
|--------|--------|
| Launched | January 2026 |
| What it does | Standardizes agent commerce: discovery, cart, checkout, order management |
| Partners | Shopify, Walmart, Target, Etsy, Wayfair |
| Compatibility | MCP, A2A, AP2 bindings |
| Trust scoring | **None** — merchant remains MoR, no quality assessment |

### Mastercard Agent Pay + Verifiable Intent

| Aspect | Detail |
|--------|--------|
| Launched | Agent Pay 2024; **Verifiable Intent March 2026** (open-source, with Google) |
| What it does | Cryptographic proof: user identity + instructions + transaction outcome = tamper-resistant record |
| Partners | Google (AP2), Fiserv, IBM, Adyen |
| Trust scoring | **None** — verifies THE TRANSACTION intent, not THE AGENT quality |

### OpenAI Agentic Commerce Protocol (ACP)

| Aspect | Detail |
|--------|--------|
| Co-developed with | Stripe (Apache 2.0 license) |
| Status | **Pivoted** from Instant Checkout to ChatGPT Apps (merchant-specific) |
| Focus | Product discovery + structured feeds. Checkout delegated to merchant apps |
| Partners | Shopify, Etsy, Instacart, Walmart, Target |
| Trust scoring | **None** |

### Anthropic Claude Marketplace

| Aspect | Detail |
|--------|--------|
| Launched | **March 2026** (limited preview) |
| Commission | **0% commission** — distribution channel, not revenue source for Anthropic |
| Partners | Snowflake, Harvey, Replit, GitLab, Lovable, Rogo |
| Audience | Enterprise (annual API spending commitments) |
| Trust scoring | **None** |
| Agora impact | **Kills commission-based revenue model.** Validates SaaS-first approach. |

### Why These Are Complementary

All systems solve logistics: **HOW** do agents discover, authorize, pay? None solve quality: **HOW WELL** will this agent perform?

- Visa IC Connect = the payment gateway
- UCP = the checkout protocol
- Agent Pay = the card
- ACP = the discovery feed
- x402 / MPP = the micropayment rails
- **Agora = the behavioral trust layer** that determines QUALITY before payment

---

## Named Trust & Security Competitors (Updated April 2026)

### NEW Funded Competitors (Q1 2026)

| Competitor | Funding | Focus | Threat to Agora |
|-----------|---------|-------|-----------------|
| **FabricLayer** | $2.5M seed (Feb 2026) | "Trust Index" for AI tools — transparency, data handling, performance scores | 🔴 DIRECT — similar product concept |
| **OpenBox AI** | $5M seed (Mar 2026) | Enterprise AI trust platform — governance, verification, oversight | 🔴 DIRECT — enterprise trust |
| **Trent AI** | €11M seed (Apr 2026) | Layered security for agentic era autonomous workflows | 🟠 ADJACENT — security, not trust scoring |
| **Tumeryk** | Funded | AI Trust Score™ (trademarked) — adversarial testing: hallucination, prompt injection | 🟠 ADJACENT — pre-deploy testing |
| **Akto** | Funded (Jun 2025) | First MCP security platform — discovery, red teaming, real-time monitoring | 🟠 ADJACENT — security scanning |
| **NeuralTrust** | Seed (2022) | AI gateway, zero-trust security, automated red teaming | 🟡 PERIPHERAL — general AI security |
| **BlueRock** | F4 Fund backed | Runtime monitoring, pre-execution enforcement for 9,000+ MCP servers | 🟠 ADJACENT — monitoring |

> ⚠️ **$40M+ deployed to MCP security seed rounds in Q1 2026 alone.** (Source: SoftwareStrategiesBlog)

### MCP Discovery Platforms (Not Trust, But Overlap)

| Platform | What It Does | Monetization | Trust Scoring |
|---------|-------------|-------------|---------------|
| **Glama.ai** | MCP discovery + LLM gateway | Free | ❌ None |
| **Smithery** | MCP hosting + marketplace | Free/enterprise | ❌ None |
| **Composio** | Managed MCP + built-in auth | Freemium | ❌ None |
| **MCP Market** | Community directory | Free | ❌ None |

### Legacy Competitors (From Previous Analysis)

| Competitor | Status | Threat |
|-----------|--------|--------|
| **Skyfire** | $14.5M raised. Went silent since Jan 2026 | 🟡 Declining |
| **ERC-8004** | 10K+ agents registered (testnet). Raw data, no scoring | 🟡 Complementary |
| **Masumi Network** | Cardano-based DIDs. Small ecosystem | 🟢 Low |
| **Scalekit** | Auth-only. Narrow scope | 🟢 Low |

### Updated Competitive Comparison

| Capability | FabricLayer | Akto | BlueRock | Glama | Skyfire | **Agora** |
|-----------|------------|------|---------|-------|---------|----------|
| Trust scoring (behavioral) | Static index | No | No | No | No | **Yes (EWMA + adaptive 4-tier)** |
| Runtime monitoring | No | Yes | Yes | No | No | **Planned** |
| Creator marketplace | No | No | No | Directory | No | **Yes** |
| Creator monetization | No | No | No | No | No | **Yes (planned)** |
| Embeddable badge | No | No | No | No | No | **Planned** |
| CLI tool | No | CLI | CLI | No | No | **Planned** |
| Payment processing | No | No | No | No | Yes | **Planned** |
| Skills category | No | No | No | No | No | **Yes (10 built)** |
| MCP-native discovery | No | Scanning | Scanning | Yes | No | **Yes** |

### The Key Insight (Updated)

**Pre-deploy vs. Post-deploy:**
- FabricLayer, Akto, BlueRock, Tumeryk = **static scanning** ("Is the code safe?")
- Visa TAP, Skyfire, Scalekit = **identity** ("Is this a real agent?")
- Mastercard Verifiable Intent = **governance** ("Was this authorized?")
- **Agora = behavioral trust** ("Does this agent actually perform well over time?")

**Creator economics gap:**
- ALL competitors focus on enterprise security or protocol infrastructure
- NONE provide a place where indie developers can publish, monetize, and build reputation
- Agora = Etsy for AI tools + FICO for AI quality — unique combination

---

## Agora's Defensible Advantages (Ranked)

| Advantage | Defensibility | Time to Replicate |
|-----------|--------------|-------------------|
| **Transaction data accumulation** | Very high | Cannot be copied — must be earned |
| **Network effects** (agents -> buyers -> agents) | High | Requires critical mass |
| **Multi-protocol support** (4 protocols) | Medium | 3-6 months for funded team |
| **ZK proof integration** | Medium | 3-4 months for funded team |
| **Sub-10ms trust queries** | Medium | Architecture choice, replicable |

### Honest Disadvantages

| Disadvantage | Severity |
|-------------|----------|
| Zero users, zero traction | Critical |
| Solo founder | High |
| Payment processing not built | High |
| No brand recognition | Medium |

---

## Market Timing

### Why Now — The Agent Economy Infrastructure Is Live

| Factor | Evidence | Source |
|--------|----------|--------|
| Full payment stack live (April 2026) | Visa IC Connect (Apr 8), Stripe MPP (Mar 18), x402 Foundation (Linux), Google UCP (Jan), MC Verifiable Intent (Mar) | Multiple |
| x402 verified volume | **$24M in 30 days** (corrected from inflated $600M) | Nevermined, CoinMarketCap |
| Stablecoin ecosystem | $33 trillion total volume in 2025 | Forbes, CryptoRank |
| AAIF standardization | 170+ members, governs MCP + AGENTS.md + goose + x402 | Linux Foundation |
| MCP ecosystem matured | 97M SDK downloads, 16,000+ servers, all major AI providers | npm/PyPI, dev.to |
| $40M+ in MCP security seed rounds | FabricLayer ($2.5M), OpenBox ($5M), Trent AI (€11M), Akto, etc. | Multiple |
| Claude Marketplace | 0% commission, enterprise-only, limited preview | Anthropic, Mar 2026 |
| McKinsey forecast | $3–5T agent-mediated commerce by 2030 | Forbes |
| EU AI Act enforcement | August 2, 2026 — €193K-600K compliance, €35M fines | europa.eu |
| Behavioral trust gap | 15+ competitors in adjacent spaces, ZERO do behavioral runtime trust | Our analysis (April 2026) |

### Window Duration

12-18 months. After that:

- Payment infrastructure players may add native trust features
- Well-funded competitors will expand scope
- Major cloud platforms could build their own solutions

The advantage of starting now: trust scores require transaction history, which requires time. A competitor launching 12 months later starts with zero data against Agora's accumulated history. The agent economy is being built RIGHT NOW — and the trust layer is missing.
