<!--
purpose: Market sizing, named competitors, and strategic positioning based on real data.
audience: AI systems, investors, co-founders
reads_after: 04_BUSINESS_MODEL.md
language: English
last_updated: 2026-03-10
-->

# Market & Competition

## Market Size

### AI Agent Economy

| Metric | 2025 | 2026 | 2028 | 2032 | Source |
|--------|------|------|------|------|--------|
| Agentic AI market | $7.1B | ~$12B | ~$35B | $93.2B | Industry analysts, 46% CAGR |
| Enterprise AI agent deployment | 25% of enterprises | 40% projected | 50%+ | Majority | Gartner |
| SaaS pricing shift to usage-based | 83% of AI-native SaaS | Growing | Dominant | Standard | Deloitte |

### Protocol Ecosystem Size

| Metric | Value | Source |
|--------|-------|--------|
| MCP SDK downloads | 97M+ | npm/PyPI |
| Published MCP servers | thousands of | GitHub + registries |
| A2A partner organizations | 150+ | Google, Linux Foundation |
| AP2 launch partners | 60+ | Google (Mastercard, PayPal, Shopify) |
| MCP monetization built in | None | Protocol specification |
| MCP trust verification built in | None | Protocol specification |

The gap is clear: massive supply of AI tools, zero standardized trust, zero built-in payment infrastructure for individual tool developers.

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

## Competitive Comparison

| Capability | Skyfire | Masumi | ERC-8004 | Scalekit | MCP native | **Agora** |
|-----------|---------|--------|----------|----------|-----------|-----------|
| Agent identity | Yes (KYA) | Yes (DID) | Yes (NFT) | Yes (auth) | Basic | **Yes (DID + auth)** |
| Trust scoring (behavioral) | No | No | Raw data only | No | No | **Yes (adaptive 4-tier)** |
| Anti-gaming | No | No | No | No | No | **Planned (4 designed)** |
| ZK proof verification | No | No | zkML (validator) | No | No | **Planned (Groth16)** |
| Marketplace / discovery | No | No | No | No | No | **Yes** |
| Payment processing | Yes | No | No | No | No | **Planned (Stripe + x402)** |
| Multi-protocol support | 1-2 | 1 | 1 (ETH) | 1 | 1 | **4 (MCP + A2A + AP2 + x402)** |
| Revenue model | Tx fees | On-chain | N/A | SaaS | N/A | **Hybrid SaaS + commission** |

### The Key Insight

Every competitor solves a piece of the problem:

- Skyfire: identity + payments (but no behavioral trust scoring — and went silent in 2026)
- Masumi: identity + logging (but no marketplace, no payments)
- ERC-8004: on-chain raw data (but no scoring algorithm, no marketplace)
- Scalekit: authentication (but nothing else)

No one does **real-time, adaptive, per-transaction trust scoring**. ERC-8004 stores the data. Agora is the analytics engine that interprets it.

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

### Why Now

| Factor | Evidence |
|--------|----------|
| MCP standardized and adopted by all major AI providers | 97M SDK downloads, thousands of servers |
| AP2 launched with payment industry support | Mastercard, PayPal, AmEx as partners |
| No existing trust infrastructure for AI agents | Confirmed — no competitor provides behavioral trust scoring |
| Enterprise AI budgets growing | 25% deploying agents in 2025, doubling by 2027 |
| AI supply chain attacks rising | 430% increase in 2 years |

### Window Duration

12-18 months. After that:

- Protocol maintainers may add native trust/payment features
- Well-funded competitors will expand scope
- Major cloud platforms could build their own solutions

The advantage of starting now: trust scores require transaction history, which requires time. A competitor launching 12 months later starts with zero data against Agora's accumulated history.
