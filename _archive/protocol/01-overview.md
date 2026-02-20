# Agora Protocol Specification v1.0

## Executive Summary

**Agora** is a decentralized protocol enabling autonomous AI agents to discover, trust, and transact with each other within configurable risk and spending parameters.

### Core Innovation

```
Traditional: Human → API → Human approves → Payment → Result
Agora:       AI Agent → Policy Check → Trust Verify → Auto-Pay → Result
```

### Protocol Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  AI Agents, Orchestrators, Multi-Agent Systems               │
├─────────────────────────────────────────────────────────────┤
│                    AGORA PROTOCOL                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐│
│  │   POLICY    │ │    TRUST    │ │       DISCOVERY         ││
│  │   ENGINE    │ │    LAYER    │ │       PROTOCOL          ││
│  └─────────────┘ └─────────────┘ └─────────────────────────┘│
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐│
│  │   PAYMENT   │ │   ESCROW    │ │       IDENTITY          ││
│  │   RAILS     │ │   LAYER     │ │       (DID)             ││
│  └─────────────┘ └─────────────┘ └─────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│                    TRANSPORT LAYER                           │
│  HTTP/gRPC, WebSocket, P2P Messaging                         │
├─────────────────────────────────────────────────────────────┤
│                    SETTLEMENT LAYER                          │
│  Blockchain (L2), Stablecoins, Fiat Rails                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Design Principles

### 1. Agent Autonomy
Agents operate independently within owner-defined boundaries. No human approval required for transactions within policy limits.

### 2. Decentralized Trust
Reputation is computed from verifiable interaction history, not centralized authority. Anyone can audit.

### 3. Rail Agnostic
Payment settlement works across crypto, fiat, and future CBDC rails without protocol changes.

### 4. Non-Custodial
Protocol never holds funds. Escrow via smart contracts with agent-controlled keys.

### 5. Graceful Degradation
If any component fails, agents can still transact with reduced functionality.

---

## Protocol Identifier

**URI Scheme:** `agora://`
**Version:** `1.0.0`
**MIME Type:** `application/agora+json`

---

## Core Concepts

### Agent
An autonomous software entity with:
- Unique identity (DID)
- Cryptographic keys
- Policy configuration
- Wallet/payment capability

### Transaction
A value exchange between two agents:
- Buyer requests service
- Seller provides service
- Payment settled via escrow

### Trust Score
Numeric reputation (0.0 - 1.0) computed from:
- Completion rate
- Response latency
- Dispute history
- Volume history

### Policy
Owner-defined rules governing agent behavior:
- Spending limits
- Risk thresholds
- Allowed categories
- Fallback behavior

---

## Transaction Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│                    TRANSACTION STATES                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐ │
│   │ DISCOVER│───▶│ VERIFY  │───▶│ ESCROW  │───▶│ EXECUTE │ │
│   └─────────┘    └─────────┘    └─────────┘    └─────────┘ │
│                        │              │              │       │
│                        ▼              ▼              ▼       │
│                   ┌─────────┐   ┌─────────┐   ┌─────────┐   │
│                   │ REJECT  │   │ TIMEOUT │   │ DISPUTE │   │
│                   └─────────┘   └─────────┘   └─────────┘   │
│                                       │              │       │
│                                       ▼              ▼       │
│                                  ┌─────────┐   ┌─────────┐   │
│                                  │ REFUND  │   │ RESOLVE │   │
│                                  └─────────┘   └─────────┘   │
│                                                      │       │
│                                                      ▼       │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                     COMPLETE                         │   │
│   │            (Success, Refund, or Arbitrated)          │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Message Format

All Agora protocol messages use JSON with the following envelope:

```json
{
  "agora": "1.0",
  "type": "request|response|event",
  "id": "uuid-v4",
  "timestamp": "ISO-8601",
  "from": "did:agora:...",
  "to": "did:agora:...",
  "signature": "base64-ed25519",
  "payload": { ... }
}
```

---

## Related Specifications

| Document | Path | Description |
|----------|------|-------------|
| Trust Layer | `./02-trust-layer.md` | Trust scoring algorithm |
| Payment Layer | `./03-payment-layer.md` | Payment and escrow |
| Policy Engine | `./04-policy-engine.md` | Agent policy rules |
| Discovery | `./05-discovery.md` | Agent discovery protocol |
| Identity | `./06-identity.md` | Agent identity (DID) |
| Security | `./07-security.md` | Threat model |
| Whitepaper | `./whitepaper.md` | Patent-ready technical paper |
