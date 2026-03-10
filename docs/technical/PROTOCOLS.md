<!--
purpose: Real specification of all 4 AI protocols — what each does, who built it, adoption status, and how Agora integrates.
audience: AI systems, developers, investors, protocol implementers
reads_after: technical/ARCHITECTURE.md
language: English
last_updated: 2026-03-08
-->

# Protocols — MCP, A2A, AP2, x402

## Protocol Landscape (March 2026)

Four protocols define how AI systems discover, communicate, and transact. Each solves a different problem. None of them together provide trust verification.

| Protocol | Created By | Launch Date | Problem Solved | Adoption |
|----------|-----------|-------------|---------------|----------|
| **MCP** | Anthropic | Nov 2024 | AI tools discover and invoke external data/functions | Adopted by OpenAI, Google DeepMind, 97M+ SDK downloads |
| **A2A** | Google | Apr 2025 | AI agents communicate and delegate tasks to each other | 150+ orgs (Salesforce, SAP, Adobe), donated to Linux Foundation Jun 2025, v1.0 RC Nov 2025 |
| **AP2** | Google | Sep 2025 | AI agents initiate and complete financial transactions | 60+ partners (Mastercard, PayPal, American Express, Coinbase, Shopify) |
| **x402** | Coinbase | May 2025 | Instant stablecoin micropayments via HTTP 402 | Active on Base network, <$0.0001 avg fee, ~2s settlement |

### What None of Them Provide

| Missing Capability | Status Across All 4 Protocols |
|-------------------|-------------------------------|
| Trust scoring (is this agent reliable?) | Not addressed |
| Reputation history (how has this agent performed?) | Not addressed |
| Anti-gaming (is this agent manipulating its reputation?) | Not addressed |
| Unified discovery across protocols | Not addressed |

This is the gap Agora fills.

---

## MCP (Model Context Protocol) — Tool Discovery

### What It Actually Does

MCP is a standardized way for AI assistants to connect to external data and tools. Before MCP, every AI provider built custom connectors. MCP is the "USB-C" — one standard plug for everything.

```
Before MCP:
  ChatGPT -> custom plugin -> Google Calendar
  Claude  -> custom API    -> Google Calendar
  Gemini  -> custom tool   -> Google Calendar
  (3 different integrations for 1 service)

After MCP:
  Any AI Assistant -> MCP protocol -> Google Calendar MCP Server
  (1 integration serves all AI assistants)
```

### Real Numbers

| Metric | Value | Source |
|--------|-------|--------|
| SDK downloads | 97M+ | npm/PyPI registries |
| Published MCP servers | 17,000+ | GitHub + MCP registries |
| Major AI providers supporting MCP | All (OpenAI, Google, Anthropic, others) | Public announcements |
| Monetization built into MCP | None | MCP specification |
| Security standard built in | Basic (OAuth, but no trust layer) | MCP specification |

### How Agora Integrates

Agora registers as an MCP server. When any AI assistant needs a paid or verified service, it queries Agora:

```json
// Agora's MCP Server — 3 tools exposed
{
  "tools": [
    {
      "name": "discover_agents",
      "description": "Find verified AI services by capability"
    },
    {
      "name": "check_trust",
      "description": "Get computed trust score for any agent"
    },
    {
      "name": "create_connection",
      "description": "Purchase and connect to a verified agent"
    }
  ]
}
```

**Status:** MCP server manifest designed. Discovery endpoint not built yet (P0).

---

## A2A (Agent-to-Agent Protocol) — Agent Communication

### What It Actually Does

A2A lets AI agents discover each other's capabilities, assign tasks, and retrieve results. It's built on HTTP + JSON-RPC + Server-Sent Events.

Each agent publishes an "Agent Card" — a JSON document describing what it can do:

```json
{
  "name": "InvoiceProcessor",
  "description": "Extracts data from invoices, validates, routes to accounting",
  "url": "https://agent.example.com",
  "capabilities": ["invoice.extract", "invoice.validate"],
  "authentication": { "schemes": ["OAuth2", "apiKey"] }
}
```

### Real Adoption Status

| Date | Milestone |
|------|-----------|
| Apr 2025 | Launched with 50+ partner companies |
| Jun 2025 | Donated to Linux Foundation (open governance) |
| Jul 2025 | v0.3: added gRPC support, security card signing |
| Nov 2025 | v1.0 Release Candidate |
| Sep 2025 onwards | Adoption slowed vs MCP; Google Cloud added MCP compatibility |

**Key insight:** A2A adoption has slowed relative to MCP. Google itself began adding MCP support to its AI services. Both protocols will likely coexist: MCP for tool discovery, A2A for multi-agent coordination.

### How Agora Integrates

Every agent listed on Agora automatically gets an A2A-compatible agent card enriched with trust data:

```json
{
  "name": "TranslateBot",
  "url": "https://proxy.agora.dev/agt_abc123",
  "capabilities": ["translation"],
  "agora_trust": {
    "score": 0.87,
    "confidence": "high",
    "proof_available": true
  }
}
```

**Status:** Agent card generation designed. A2A adapter not built yet (P1).

---

## AP2 (Agent Payments Protocol) — Financial Transactions

### What It Actually Does

AP2 lets AI agents initiate payments on behalf of users. It solves a real problem: when an AI agent wants to buy something, current payment systems require a human to click "Pay" — AP2 enables delegation.

Key concepts:

- **Intent Mandates** — cryptographically signed instructions from a user: "Agent X can spend up to $50 on translation services this month"
- **Cart Mandates** — specific purchase authorizations tied to individual transactions
- **Audit trail** — every transaction is cryptographically logged for dispute resolution

### Real Adoption

Built with 60+ partners including:

- **Payment processors:** Mastercard, PayPal, American Express
- **Crypto infrastructure:** Coinbase (A2A x402 extension for crypto payments)
- **Commerce platforms:** Shopify, Salesforce
- **Payment agnostic:** supports credit cards, bank transfers, stablecoins

### How Agora Integrates

AP2 mandates fit naturally into Agora's escrow model:

```
1. User sets mandate: "My AI can spend $100/month on Agora services"
2. AI agent discovers service on Agora (via MCP)
3. AI creates AP2 mandate for specific purchase
4. Agora validates mandate and processes escrow
5. Agent executes service
6. Agora releases escrow to seller
```

**Status:** AP2 request/response handlers have hooks built. Escrow integration not built (P1).

---

## x402 (HTTP Payment Protocol) — Micropayments

### What It Actually Does

x402 revives the HTTP 402 "Payment Required" status code. When an agent requests a paid resource, the server responds with 402 + payment instructions. The client pays (in stablecoins) and resends the request. Payment settles in ~2 seconds.

```
1. Client -> GET /api/translate -> Server
2. Server -> 402 Payment Required + {amount: $0.02, chain: "base"} -> Client
3. Client pays $0.02 in USDC on Base chain (~2 sec settlement)
4. Client -> GET /api/translate + payment_proof -> Server
5. Server -> 200 OK + translation result -> Client
```

### Real Numbers

| Metric | Value |
|--------|-------|
| Average transaction fee | <$0.0001 |
| Settlement time | ~2 seconds |
| Supported chain | Base (Coinbase L2) |
| Payment currency | USDC (stablecoin) |
| Minimum transaction | No minimum (true micropayments) |

### Limitations

- Crypto-only (no fiat support)
- Requires wallet setup (friction for non-crypto users)
- Single chain (Base) as of March 2026
- No built-in trust or reputation

### How Agora Integrates

Agora wraps x402 endpoints with trust verification:

```
Without Agora: Client pays any agent with 402 header (no quality guarantee)
With Agora: Client checks trust score first, then pays via x402 (verified quality)
```

**Status:** x402 payment handler hooks built. Trust wrapper for x402 not built (P2).

---

## Named Competitors Using These Protocols

### Skyfire

| Aspect | Detail |
|--------|--------|
| **Focus** | Identity + payments for AI agents |
| **Launched** | June 2025 |
| **Key feature** | "Know Your Agent" (KYA) — digital credentials for agents |
| **Payments** | Autonomous micropayment processing |
| **Trust** | Identity verification only (not behavioral trust scoring) |
| **Gap Agora fills** | No computed trust from transaction history, no marketplace discovery |

### Masumi Network

| Aspect | Detail |
|--------|--------|
| **Focus** | Decentralized AI agent ecosystem |
| **Built on** | Cardano blockchain |
| **Key feature** | DIDs (Decentralized Identifiers) for agents |
| **Trust** | Immutable decision logging on blockchain |
| **Gap Agora fills** | No active marketplace, blockchain dependency adds friction, no real-time trust scoring |

### Comparison: What Exists vs. What Agora Provides

| Capability | MCP | A2A | AP2 | x402 | Skyfire | Masumi | **Agora** |
|-----------|-----|-----|-----|------|---------|--------|-----------|
| Tool discovery | Yes | Yes | No | No | No | No | **Yes** |
| Agent communication | No | Yes | No | No | No | Yes | **Yes** |
| Payment processing | No | No | Yes | Yes | Yes | No | **Yes** |
| Trust scoring | No | No | No | No | Partial (identity) | Partial (logging) | **Yes (computed)** |
| Anti-gaming detection | No | No | No | No | No | No | **Yes** |
| ZK proof verification | No | No | No | No | No | No | **Yes** |
| Marketplace / catalog | No | No | No | No | No | No | **Yes** |

---

## Agora's Protocol Strategy

### Why Protocol-Agnostic Matters

No one knows which protocol wins. By supporting all four, Agora benefits regardless:

- If MCP wins → Agora is the trust + payment layer for MCP
- If A2A wins → Agora is the trust + discovery layer for A2A
- If AP2 becomes standard → Agora integrates natively for payments
- If x402 grows → Agora wraps x402 with trust verification

### Architecture: Adapter Pattern

```
Agora Core (Trust Engine + Marketplace + Payments)
    |
    +-- MCP Adapter     (P0 — first integration target)
    +-- A2A Adapter     (P1 — after MCP)
    +-- AP2 Adapter     (P1 — payment flow)
    +-- x402 Adapter    (P2 — crypto micropayments)
    +-- [Future]        (new adapters: ~500-1000 lines each)
```

Adding a new protocol requires only an adapter module. No changes to core trust engine, marketplace, or payment logic.
