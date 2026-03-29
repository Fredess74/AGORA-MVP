# Competitive Intelligence — Deep Research (March 2026)

> Source: Gemini Deep Research, verified data with named sources
> Date: 2026-03-14

## Funding Comparison

| Competitor | Funding | Key Backers | What They Do | What They DON'T Do |
|-----------|---------|-------------|-------------|-------------------|
| **Recall Network** | $42.0M (Series B, Bessemer) | YC, Nvidia, Bessemer | AgentRank (PageRank for AI), staking | No fiat, complex tokenomics |
| **Skyfire** | $14.5M (2 seed rounds) | Coinbase Ventures, a16z CSX, Circle, Draper, Ripple | KYA identity, wallets, KYAPay | No behavioral scoring |
| **Scalekit** | $5.5M (seed) | Together Fund, Z47 | OAuth 2.1 for agents, MCP auth | No scoring, no marketplace |
| **Agora** | $0.0M | — | Trust scoring + marketplace + payments | Zero users, solo founder |

---

## 1. Skyfire — The Capitalized Identity Incumbent

**Status:** Active (despite conflicting reports of "ceased updates"). Enterprise partnerships ongoing.

**Business Model:**
- Transaction fees on KYAPay protocol
- Enterprise SaaS integrations (wallet, identity)
- Two-sided network: developer tools + merchant API monetization

**Products:**
- KYA (Know Your Agent): verified agent identity
- Digital wallets (fiat + USDC funding)
- KYAPay protocol (payment + identity combined)
- Budget controls, spending policies

**Key Partnerships:**
- **Visa** (Dec 2025): end-to-end autonomous purchase demo
- **Akamai + TollBit** (Sep 2025): publisher monetization
- **Apify MCP Server** (Mar 2026): agentic payments integration

**Critical Weakness:**
> KYA validates WHO the agent IS. It does NOT evaluate HOW WELL the agent PERFORMS.
> A static identity gateway ≠ dynamic behavioral trust oracle.
> Agent can pass KYA onboarding, then hallucinate, drift, or get hijacked.

---

## 2. Recall Network — ⚠️ MOST DANGEROUS COMPETITOR

**Funding:** $42M total ($8M Series A 2023, $10M YC round, $38M Series B 2025 at $250M valuation)

**Founders:** Andrew W. Hill, Michael Sena, Sander Pick (decentralized storage/identity veterans)

**Product — AgentRank:**
- Marketed as "PageRank for AI agents"
- Skill-based scores from algorithmic on-chain competitions
- Community staking: users stake $RECALL tokens on agents they predict will perform well
- Correct predictions = rewards; wrong = slashing penalties
- Runs on Base L2, Ceramic, Tableland

**Business Model:** Tokenomics ($RECALL token, 1B total supply)

**Critical Weakness:**
> Enterprise friction. Requires agents to operate on-chain, users to manage volatile tokens,
> and accept staking/slashing mechanics. Mainstream enterprise clients prefer frictionless,
> legally accountable, centralized SaaS over decentralized token economies.

**Our advantage:** Same utility (behavioral trust score) delivered via clean Web2-native API.
No tokens, no staking, no slashing. Centralized accountability > decentralized complexity.

---

## 3. Google Cloud AI Agent Marketplace

**Revenue:** ~$18B run-rate (Q4 2025), 48% YoY growth
**Commission:** 3% on third-party sales (1.5% for renewals >$10M)
**Agents:** 50+ pre-vetted (EPAM, Nokia, Box, Elastic, Deloitte)
**Protocol:** A2A Agent Cards (JSON manifest)

**Pricing Options for Providers:**
- Free (drives GCP compute usage)
- Flat monthly subscription
- Usage-based per-transaction

**Critical Weakness:**
> Closed, enterprise-only ecosystem. No consumer marketplace, no cross-platform scoring,
> no open trust algorithm. Built to cross-sell GCP services.

---

## 4. Anthropic Claude Marketplace (March 2026)

**Commission:** ZERO (0%)
**Launch Partners:** Snowflake, GitLab, Harvey, Replit, Lovable, Rogo
**Model:** Enterprise spend counts against existing Anthropic API commitments

**Strategic Threat:**
> Claude is Agora's PRIMARY acquisition channel via MCP.
> Anthropic's zero-commission model undercuts standard marketplace economics.
> If enterprises buy tools through Claude directly, they bypass Agora.

**Critical Weakness:**
> Closed ecosystem. Cannot evaluate agents running on OpenAI, GCP, or local Llama.
> Zero cross-platform trust scoring. Enterprise lock-in mechanism, not open marketplace.

**Our Defense:** Cross-platform neutrality. Agora evaluates agents across ALL platforms.
Revenue diversification into Trust API SaaS (immune to commission compression).

---

## 5. OpenAI GPT Store

**Scale:** 800M weekly active users, 2.5B daily queries, 82.7% market share in GenAI
**Revenue Path:** $20B projected 2026 (subs $20-200/mo + API + ads + ACP 4% merchant fee)
**Creator Economics:** Revenue-sharing program exists but no transparent direct payment system

**Critical Weakness:**
> Walled garden. No cross-platform trust, no A2A scoring, no payment for third-party services.
> Massive discovery issues (millions of GPTs, algorithm-dependent visibility).

---

## 6. Salesforce AgentExchange/Agentforce

**ARR:** $800M Agentforce Q4 FY2026 (169% YoY growth)
**Broader:** $2.9B Data+AI ARR, 29,000+ Agentforce deals
**Metric:** 2.4B Agentic Work Units (AWUs), 20T+ tokens processed
**Model:** Enterprise licensing + AWU consumption

**Critical Weakness:**
> CRM-only. No open marketplace, no AI-to-AI external transactions.
> Trust = local (within client's Salesforce instance). No cross-platform scoring.

---

## 7. Scalekit

**Funding:** $5.5M seed (Together Fund, Z47)
**Product:** OAuth 2.1 for AI agents, AuthN/AuthZ SDKs
**Pricing:** Free <10K accounts, $5/1K accounts, enterprise $99/domain/mo

**Critical Weakness:**
> Authentication ≠ reliability. Solves "access" not "quality."
> Complementary to trust scoring, not competitive.

---

## 8. Masumi Network (Cardano)

**Stack:** Cardano eUTXO, DIDs, blockchain wallets, decentralized registry
**Roadmap:** Cardano native → proprietary L2
**Model:** Token-based

**Critical Weakness:**
> Cardano ecosystem adoption is limited. Enterprise friction from blockchain.
> No behavioral scoring algorithm.

---

## 9. ERC-8004 / ERC-8183 (Ethereum)

**ERC-8004:** On-chain reputation REGISTRY (raw data ledger, NOT a scoring algorithm)
- 10,000+ agents registered on mainnet
- Authors: MetaMask + Ethereum Foundation + Google + Coinbase

**ERC-8183:** Agentic commerce escrow (Virtuals Protocol + ETH Foundation)
- Programmable escrow, modular hooks, milestone payments

**Critical Insight:**
> ERC-8004 explicitly DELEGATES scoring to third parties.
> This validates Agora's business model — we compute the score from their raw data.

---

## 10. OpenClaw — Security Warning

**Product:** Open-source personal AI assistant with Behavioral Trust Scoring v3
**CVE-2026-25157:** OS command injection vulnerability
- Attackers could execute arbitrary commands via SSH
- OpenClaw deployments became automated attack infrastructure
- Darkweb marketplace "MoltRoad" created from compromised instances

**Lesson:** Validates necessity of centralized, secure trust scoring infrastructure.
Self-hosted, unvetted agent code = existential security risk.

---

## Infrastructure Players (Complementary, NOT Competitors)

| Player | What They Build | Trust Gap |
|--------|----------------|-----------|
| **Google UCP** | Agent shopping checkout, 60+ partners | No agent evaluation |
| **Mastercard Agent Pay** | Verifiable Intent, cryptographic audit | Verifies human intent, not agent quality |
| **Stripe** | Shared Payment Tokens, x402 USDC | Processes transactions, no vendor quality control |
| **Coinbase** | Agentic Wallets, TEE-secured, KYT | Wallet + compliance, not behavioral trust |
| **Circle** | Nanopayments, gasless USDC | Settlement layer, no discovery/curation |
| **Visa** | Trusted Agent Protocol, 100+ partners | Secures checkout, not performance rating |

> **UNIVERSAL PATTERN:** Everyone verifies the TRANSACTION. Nobody verifies the AGENT.

---

## Competitive Positioning Summary

### The Killer Table

| Layer | Who Builds It | Agora's Role |
|-------|--------------|-------------|
| **Intelligence** (LLMs) | OpenAI, Anthropic, Google | ❌ Not our layer |
| **Connectivity** (protocols) | MCP, A2A, UCP | ❌ Not our layer |
| **Identity** (who is this agent?) | Skyfire KYA, Scalekit OAuth | ❌ Not our layer |
| **Payment** (how to pay) | Stripe, Coinbase, Circle, x402 | ❌ Not our layer |
| **Intent** (what did human authorize?) | Mastercard Verifiable Intent | ❌ Not our layer |
| **Trust** (is this agent reliable?) | **NOBODY** | ✅ **THIS IS US** |

### Biggest Threats (Ranked)

1. **Recall Network** ($42M, same thesis, Web3 approach) — friction defense
2. **Anthropic Claude Marketplace** (zero-commission, MCP channel risk) — neutrality defense
3. **Skyfire pivot to scoring** ($14.5M, could recognize the gap) — technical moat defense
4. **Google adding scoring** (20% probability, not in A2A roadmap) — independence defense
