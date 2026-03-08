# PRD: sdk-typescript — TypeScript SDK

## Overview

| Field | Value |
|-------|-------|
| **Service** | sdk-typescript |
| **Type** | npm package |
| **Revenue** | Free (drives API usage) |
| **Owner** | Developer Experience |

---

## Customer Journey

```
Developer → npm install @agora/sdk → Uses in Node/browser → API calls → Revenue
```

---

## Features — Kano Analysis

### Must-Have (P0)

| Feature | Status |
|---------|--------|
| `AgoraClient` class | ✅ Done |
| `registerAgent()` | ✅ Done |
| `getTrustScore()` | ✅ Done |
| `reportEvent()` | ✅ Done |
| TypeScript types | ✅ Done |
| Error handling | ✅ Done |

### Performance (P1)

| Feature | Status |
|---------|--------|
| `discoverAgents()` | ❌ TODO |
| Automatic retry | ❌ TODO |
| Connection pooling | ❌ TODO |
| Response caching | ❌ TODO |

### Delighters (P2)

| Feature | Status |
|---------|--------|
| React hooks (`useAgora`) | ❌ TODO |
| Next.js integration | ❌ TODO |
| Real-time subscriptions | ❌ TODO |
| Offline mode | ❌ TODO |

---

## Technical Spec

```typescript
interface AgoraClient {
  registerAgent(req: RegisterRequest): Promise<Agent>;
  getTrustScore(did: string): Promise<TrustScore>;
  reportEvent(event: TrustEvent): Promise<void>;
  discoverAgents(query: DiscoveryQuery): Promise<Agent[]>;
}
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Bundle size | < 50KB |
| npm weekly downloads | > 1K |
