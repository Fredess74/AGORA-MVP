# Core Module — Status

> ⚠️ **This package is PLANNED, not built.** No source code exists yet.

## What Exists

| File | Purpose | Status |
| --- | --- | --- |
| `Cargo.toml` | Rust package definition | Placeholder only |
| `schema.sql` | PostgreSQL schema for production | **PLANNED** — not deployed to Supabase |
| `MAP.md` | This file | — |

## Planned Architecture (Phase 2)

When built, this package will contain the Rust trust engine:

```
packages/core/src/
├── lib.rs           # Re-exports
├── identity/
│   └── did.rs       # AgentDID (Ed25519)
├── trust/
│   ├── algorithm.rs # Trust score computation
│   ├── score.rs     # TrustScore types
│   └── event.rs     # TrustEvent types
└── crypto/
    └── merkle.rs    # Merkle tree implementation
```

## Current Trust Engine Location

The **working** trust engine is in TypeScript:

- `packages/orchestrator/src/trust/calculator.ts` (219 lines)
- 6 components: Response Time 25%, Execution Quality 25%, Identity 20%, Capability Match 15%, Peer Review 10%, History 5%

## schema.sql

`schema.sql` defines the PRODUCTION schema (agents, trust_events, trust_scores, merkle_roots, api_keys, disputes with TimescaleDB). This is the target database design for when we move beyond the current Supabase setup.

**Current live tables** (Supabase): `listings`, `transactions`, `usage_logs`
