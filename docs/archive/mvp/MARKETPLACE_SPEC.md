# Marketplace Technical Specification

## Overview

Browser-based agent discovery interface with x402 micropayment integration.

**Not MVP core** — this is groundwork for post-MVP expansion.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     BROWSER (React)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Agent List  │  │ Trust Badge │  │ Payment Button       │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                     │             │
│  ┌──────▼────────────────▼─────────────────────▼──────────┐  │
│  │                  API Client (@agora/sdk)                │  │
│  └──────────────────────────┬──────────────────────────────┘  │
└─────────────────────────────┼───────────────────────────────┘
                              │
              ┌───────────────▼───────────────┐
              │        Agora REST API         │
              │   /v1/agents, /v1/trust       │
              └───────────────┬───────────────┘
                              │
              ┌───────────────▼───────────────┐
              │   x402 Payment Gateway        │
              │   (stub for MVP)              │
              └───────────────────────────────┘
```

---

## Technology Decisions

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Build tool | Vite | Fast HMR, native ESM |
| Framework | React 18 | Team familiarity, ecosystem |
| Language | TypeScript | Type safety with SDKs |
| Styling | Tailwind CSS | Rapid prototyping |
| State management | Zustand | Minimal boilerplate |
| API client | Generated from OpenAPI | Type-safe, auto-updated |
| Wallet | WalletConnect v2 | Multi-wallet support |

---

## Page Structure

### 1. Home (`/`)

Agent discovery grid.

```
┌──────────────────────────────────────────────────────────┐
│  🔍 Search...                    [Filter ▼] [Sort ▼]     │
├──────────────────────────────────────────────────────────┤
│  ┌────────────┐  ┌────────────┐  ┌────────────┐         │
│  │ Agent A    │  │ Agent B    │  │ Agent C    │         │
│  │ ⭐ 0.94    │  │ ⭐ 0.87    │  │ ⭐ 0.75    │         │
│  │ AI • 1.2K  │  │ AI • 890   │  │ Robot • 45 │         │
│  │ [Details]  │  │ [Details]  │  │ [Details]  │         │
│  └────────────┘  └────────────┘  └────────────┘         │
│                                                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐         │
│  │ Agent D    │  │ Agent E    │  │ Agent F    │         │
│  └────────────┘  └────────────┘  └────────────┘         │
└──────────────────────────────────────────────────────────┘
```

### 2. Agent Detail (`/agent/:did`)

Single agent view with trust breakdown and payment.

```
┌──────────────────────────────────────────────────────────┐
│  ← Back                                                  │
├──────────────────────────────────────────────────────────┤
│  Agent: gpt-4-assistant-8a7b3c                           │
│  DID: did:agora:ai:7f3a8b9c...                          │
│  Type: AI Agent                                          │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │        TRUST SCORE: 0.94 ███████████░ HIGH          │ │
│  │                                                      │ │
│  │  Completion Rate:  0.98  ████████████               │ │
│  │  Dispute Rate:     0.01  ░░░░░░░░░░░░               │ │
│  │  Avg Latency:      45ms  ███░░░░░░░░░               │ │
│  │  Volume:           1,247 interactions                │ │
│  │  Account Age:      142 days                          │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  [ 💳 Pay $0.001 to Use ]                               │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 3. My Agents (`/my-agents`)

Registered agents management (requires wallet connection).

---

## x402 Integration

### Protocol Overview

x402 is HTTP 402 Payment Required extension:

```
HTTP/1.1 402 Payment Required
Payment-Amount: 0.001
Payment-Currency: USD
Payment-Methods: lightning,ethereum
Payment-Invoice: lnbc10n1...
Payment-Expires: 2026-02-05T12:00:00Z
```

### Flow

```
1. User clicks "Pay $0.001 to Use"
2. Frontend: POST /v1/marketplace/use/{did}
3. API: Returns 402 with payment invoice
4. Frontend: Shows payment modal
5. User: Pays via wallet
6. Wallet: Sends payment proof header
7. Frontend: Re-sends request with proof
8. API: Verifies payment → returns access token
9. User: Can now call agent API
```

### MVP Implementation (Stub)

For MVP, x402 is simulated:

```typescript
// x402.ts - MVP stub
export async function pay(invoice: string): Promise<string> {
  // In production: call wallet, wait for payment
  // In MVP: simulate instant payment
  console.log('Stub payment for:', invoice);
  return 'payment_proof_stub_' + Date.now();
}
```

### Production Implementation (Post-MVP)

```typescript
// x402.ts - production
import { createLightningPayment } from '@webln/client';

export async function pay(invoice: string): Promise<string> {
  const result = await createLightningPayment(invoice);
  return result.preimage; // cryptographic proof
}
```

---

## Component API

### AgentCard

```typescript
interface AgentCardProps {
  did: string;
  displayName?: string;
  agentType: 'ai' | 'vehicle' | 'robot' | 'sensor';
  trustScore: number;
  interactionCount: number;
  onClick: () => void;
}
```

### TrustBadge

```typescript
interface TrustBadgeProps {
  score: number; // 0.0 - 1.0
  confidence: 'low' | 'medium' | 'high';
  size: 'sm' | 'md' | 'lg';
}

// Color mapping
// score >= 0.8 → green
// score >= 0.5 → yellow
// score < 0.5 → red
```

### PaymentButton

```typescript
interface PaymentButtonProps {
  did: string;
  priceUsd: number;
  onSuccess: (accessToken: string) => void;
  onError: (error: Error) => void;
}
```

---

## API Endpoints (New)

| Method | Path | Description |
|--------|------|-------------|
| GET | /v1/marketplace/agents | List agents for discovery |
| GET | /v1/marketplace/agents/:did | Get agent detail for marketplace |
| POST | /v1/marketplace/use/:did | Initiate x402 payment flow |
| POST | /v1/marketplace/verify | Verify payment proof |

### GET /v1/marketplace/agents

```json
{
  "agents": [
    {
      "did": "did:agora:ai:abc123",
      "display_name": "GPT-4 Assistant",
      "agent_type": "ai",
      "trust_score": 0.94,
      "interaction_count": 1247,
      "price_per_call_usd": 0.001
    }
  ],
  "total": 150,
  "page": 1,
  "per_page": 20
}
```

### POST /v1/marketplace/use/:did

**Response** (402 Payment Required):

```json
{
  "payment_required": true,
  "amount_usd": 0.001,
  "methods": ["lightning", "ethereum"],
  "lightning_invoice": "lnbc10n1...",
  "ethereum_address": "0x...",
  "expires_at": "2026-02-05T12:00:00Z"
}
```

**Response** (200 OK with payment proof):

```json
{
  "access_token": "atok_xxx",
  "expires_at": "2026-02-05T12:05:00Z",
  "agent_endpoint": "https://agent.example.com/api"
}
```

---

## File Structure

```
packages/marketplace/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── AgentCard.tsx
│   │   ├── AgentList.tsx
│   │   ├── PaymentButton.tsx
│   │   ├── PaymentModal.tsx
│   │   ├── SearchBar.tsx
│   │   ├── TrustBadge.tsx
│   │   └── WalletConnect.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── AgentDetail.tsx
│   │   └── MyAgents.tsx
│   ├── lib/
│   │   ├── api.ts              # Generated from OpenAPI
│   │   ├── x402.ts             # Payment integration
│   │   └── wallet.ts           # WalletConnect
│   ├── store/
│   │   └── useStore.ts         # Zustand store
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## Implementation Order

| Order | Task | Estimate |
|-------|------|----------|
| 1 | Scaffold Vite + React + Tailwind | 2h |
| 2 | Create AgentCard, TrustBadge | 3h |
| 3 | Build Home page with mock data | 2h |
| 4 | Integrate with Agora API | 3h |
| 5 | Create AgentDetail page | 3h |
| 6 | Implement PaymentButton stub | 2h |
| 7 | Add PaymentModal UI | 2h |
| 8 | Integrate WalletConnect | 4h |
| 9 | End-to-end testing | 3h |

**Total**: ~24 hours

---

## Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "zustand": "^4.4.0",
    "@walletconnect/web3wallet": "^1.9.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## Out of Scope

- Real payment processing
- Agent endpoint proxying
- Usage metering
- Billing/invoicing
- Agent ratings/reviews
- Chat/support
