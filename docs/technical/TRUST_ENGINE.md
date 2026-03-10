<!--
purpose: How the trust scoring system actually works in the current codebase
audience: Developers, AI systems, technical investors
last_updated: 2026-03-10
-->

# Trust Engine — Technical Specification

> **This document describes the CURRENT TypeScript implementation.**
> The Rust implementation described in previous versions of this document does not exist.
> The canonical source code is `packages/orchestrator/src/trust/calculator.ts` (219 lines).

## Current Implementation

### Language & Location

| Item | Value |
| --- | --- |
| Language | TypeScript |
| File | `packages/orchestrator/src/trust/calculator.ts` |
| Lines | 219 |
| Runtime | Node.js (Express server) |
| Persistence | Supabase (PostgreSQL) |
| Real-time | SSE (Server-Sent Events) |

### Trust Score Components

The trust score is a weighted sum of 6 components, each scored 0.0–1.0:

```typescript
const WEIGHTS = {
  identity: 0.20,           // DID validation
  capability_match: 0.15,   // Task-skill alignment
  response_time: 0.25,      // Measured execution latency
  execution_quality: 0.25,  // QA evaluation quality
  peer_review: 0.10,        // Cross-agent verification
  history: 0.05             // Past interaction record
};
```

### Score Calculation

```
composite_score = Σ (component_score × component_weight)
```

The composite score ranges from 0.0 to 1.0 and maps to trust levels:

| Level | Range | Display |
| --- | --- | --- |
| `unrated` | No data | New agent, no interactions |
| `low` | < 0.30 | ⚠️ Low reliability |
| `medium` | 0.30 – 0.60 | 🔶 Moderate |
| `high` | 0.60 – 0.80 | ✅ Reliable |
| `excellent` | > 0.80 | 🌟 Excellent |

### How Components Are Computed During Demo

| Component | Demo Default | Live Update | Source |
| --- | --- | --- | --- |
| `identity` | 0.70 | Set when agent is validated | DID format check |
| `capability_match` | 0.50 | Updated by ProcurementAgent | Gemini evaluation |
| `response_time` | 0.50 | Measured during execution | Actual latency |
| `execution_quality` | 0.50 | Updated by QAInspector | Gemini evaluation |
| `peer_review` | 0.50 | Updated by DeliveryAgent | Cross-validation |
| `history` | 0.50 | Updated from Supabase records | Historical data |

### Real-time Updates via SSE

During a demo session, the trust calculator emits SSE events as each component is computed:

```json
{
  "type": "trust_component_update",
  "metadata": {
    "component": "response_time",
    "score": 0.85,
    "weight": 0.25,
    "allComponents": [...],
    "compositeScore": 0.742
  }
}
```

The DemoPage UI renders these as live-updating progress bars.

### Persistence

Trust scores are stored in Supabase via `updateAgentMetrics()`:

- `trust_score` field on agent record
- `total_tasks` counter incremented
- `total_revenue` updated with commission calculation

---

## What Does NOT Exist (Phase 2)

> The following features were described in previous versions of this document as "built."
> They are designed but NOT implemented in code.

### Rust Trust Engine

- **Status:** Not started. Only `packages/core/Cargo.toml` exists (no `src/` directory)
- **When needed:** If TypeScript performance becomes a bottleneck (unlikely before 100K+ agents)

### Anti-Gaming Detectors (4 designed)

1. **Sybil Detection** — IP clustering, device fingerprinting → NOT BUILT
2. **Review Pattern Anomaly** — Statistical review analysis → NOT BUILT
3. **Transaction Velocity Anomaly** — Wash trading detection → NOT BUILT
4. **Score Manipulation Detection** — Trajectory analysis → NOT BUILT

All four are **designed in documentation** (see `docs/02_TRUST_AND_CONNECTIONS.md`) but have zero code.

### ZK Proofs (Circom/Groth16)

- **Status:** Circuit file exists in `circuits/trust_proof/` but is NOT integrated into the pipeline
- **What works:** The `.circom` file compiles
- **What doesn't:** No connection between trust calculator → ZK prover → verification
- **When needed:** Enterprise deployment requiring cryptographic trust verification

### Merkle Tree Score History

- **Status:** Not built. `schema.sql` defines `merkle_roots` table but it's not deployed
- **When needed:** Audit trail requirement from enterprise customers

---

## Integration Points

### Supabase Tables Used

```sql
-- Agent data stored in 'listings' table
-- Trust score stored as field on agent record
-- Transactions logged in 'transactions' table
-- API usage in 'usage_logs' table
```

### SSE Event Types for Trust

| Event Type | When Emitted |
| --- | --- |
| `trust_component_update` | Each component calculated |
| `trust_updated` | Final composite score ready |

### Config Dependencies

```typescript
// packages/orchestrator/src/config.ts
GEMINI_API_KEY   // Required for agent reasoning
SUPABASE_URL     // Database and auth
SUPABASE_KEY     // Anon key for client access
```
