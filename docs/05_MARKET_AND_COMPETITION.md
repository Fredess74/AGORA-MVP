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

**McKinsey: Agent-mediated commerce = $3–5 TRILLION by 2030 (Forbes)**

Global AI agent market: $10.91B in 2026, projected 46% CAGR.

| Metric | 2025 | 2026 | 2028 | 2032 | Source |
|--------|------|------|------|------|--------|
| Agentic AI market | $7.1B | ~$12B | ~$35B | $93.2B | Industry analysts, 46% CAGR |
| Enterprise AI agent deployment | 25% of enterprises | 40% projected | 50%+ | Majority | Gartner |
| SaaS pricing shift to usage-based | 83% of AI-native SaaS | Growing | Dominant | Standard | Deloitte |

### Protocol Ecosystem Size

| Metric | Value | Source |
|--------|-------|--------|
| MCP SDK downloads | 97M+ | npm/PyPI |
| MCP SDK downloads | 97M+ | npm/PyPI |
| Published MCP servers | 16,000+ | MCP registries, dev.to |
| A2A partner organizations | 150+ | Google, Linux Foundation |
| AP2 launch partners | 60+ | Google (Mastercard, PayPal, Shopify) |
| x402 annualized volume | **$600M** | MEXC, The Block |
| x402 total transactions | **50M+** | Coinbase, bitcoin.com |
| MCP monetization built in | None | Protocol specification |
| MCP trust verification built in | None | Protocol specification |

The gap is clear: massive supply of AI tools, growing payment infrastructure, **zero standardized trust**, zero marketplace for agent discovery.

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

## Agent Economy Payment Infrastructure (NOT Competitors — Complementary)

Major financial institutions and crypto platforms are building payment rails for AI agents. ALL launched Jan-Feb 2026. NONE provide trust scoring.

### Google Universal Commerce Protocol (UCP)

| Aspect | Detail |
|--------|--------|
| Launched | January 2026 |
| What it does | Standardizes agent-to-agent shopping: Checkout, Identity Linking, Order Management |
| Partners | Shopify, Walmart, Target, Etsy, Wayfair, 20+ global partners |
| Compatibility | A2A, MCP, x402 |
| Trust scoring | **None** |
| Agora opportunity | Trust layer for UCP commerce flows. UCP handles checkout; Agora verifies agent reliability pre-checkout. |

### Mastercard Agent Pay

| Aspect | Detail |
|--------|--------|
| Launched | 2024, major expansion 2026 |
| What it does | Agentic Tokens (tokenized cards for AI agents) + Verifiable Intent (cryptographic audit trail) |
| Partners | Microsoft Azure OpenAI, Banco Santander (live pilot), Cloudflare, Google |
| Key feature | Open-source Verifiable Intent framework — links consumer identity + AI instructions + transaction outcome |
| Trust scoring | **None** — verifies THE TRANSACTION, not THE AGENT |
| Agora opportunity | Trust scores feed into Agent Pay authentication. Agora scores agent reliability; Mastercard handles payment execution. |

### Coinbase Agentic Wallets

| Aspect | Detail |
|--------|--------|
| Launched | February 2026 |
| What it does | Non-custodial wallets for AI agents. Gasless trading on Base. Programmable spending policies. x402 native. |
| Scale | 50M+ transactions processed. Agent Skills repository for developers. |
| Key feature | Private keys in TEEs, never exposed to LLMs |
| Trust scoring | **None** — has KYT (Know Your Transaction) for compliance, but no behavioral trust |
| Agora opportunity | Coinbase wallets = the wallet agents use. Agora = marketplace where agents with Coinbase wallets find and verify each other. |

### Circle Nanopayments

| Aspect | Detail |
|--------|--------|
| Launched | February 2026 (private beta) |
| What it does | Gasless USDC micropayments. Batched settlement: 1,000 tx for ~$0.01 in gas. x402 enabled. |
| Key feature | Circle Paymaster — gas fees paid in USDC, not ETH. Off-chain authorization + on-chain batch settlement. |
| Trust scoring | **None** |
| Agora opportunity | Makes $0.001 transactions economically viable. Critical for Agora's micro-transaction commission model. |

### Why These Are Complementary, Not Competitive

All 4 systems solve the same problem: **HOW do agents pay?** None of them solve: **SHOULD agents pay THIS agent?**

- UCP = the checkout protocol
- Agent Pay = the card
- Agentic Wallets = the wallet
- Nanopayments = the cash register
- **Agora = the trust score + marketplace** that determines WHO gets paid

---

## Named Trust Competitors

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

### Why Now — The Agent Economy Infrastructure Is Live

| Factor | Evidence | Source |
|--------|----------|--------|
| Agent payment infrastructure launched | Google UCP (Jan 2026), Coinbase Agentic Wallets (Feb 2026), Circle Nanopayments (Feb 2026), Mastercard Agent Pay (2024-2026) | Multiple |
| x402 reaching scale | **$600M annualized**, 50M+ transactions, Stripe integrated | The Block, MEXC |
| MCP ecosystem matured | 97M SDK downloads, 16,000+ servers, all major AI providers | npm/PyPI, dev.to |
| Agent-to-agent transactions happening | Autonomous agents paying for API calls, compute, data access via x402 | Coinbase, bitcoin.com |
| McKinsey forecast | $3–5T agent-mediated commerce by 2030 | Forbes |
| Enterprise deployment | 40% of enterprise apps will include AI agents by end 2026 | Gartner |
| Trust gap confirmed | ZERO systems provide behavioral trust scoring for AI agents | Our analysis |

### Window Duration

12-18 months. After that:

- Payment infrastructure players may add native trust features
- Well-funded competitors will expand scope
- Major cloud platforms could build their own solutions

The advantage of starting now: trust scores require transaction history, which requires time. A competitor launching 12 months later starts with zero data against Agora's accumulated history. The agent economy is being built RIGHT NOW — and the trust layer is missing.
