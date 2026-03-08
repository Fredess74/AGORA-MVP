# PRD: agora-core — Trust Computation Library

## Overview

| Field | Value |
|-------|-------|
| **Service** | agora-core |
| **Type** | Rust library (internal) |
| **Revenue** | N/A (enables paid services) |
| **Owner** | Platform Team |

---

## Customer Journey Touchpoint

```
[Any Service] → imports agora-core → uses TrustEngine
```

Core is invisible to end users but powers ALL trust operations.

---

## Features — Kano Analysis

### Must-Have (P0) — Missing = System Broken

| Feature | Description | Status |
|---------|-------------|--------|
| `AgentDID` | Decentralized identity | ✅ Done |
| `TrustEvent` | Interaction record | ✅ Done |
| `TrustScore` | Computed trust 0.0-1.0 | ✅ Done |
| `TrustEngine` | Weighted scoring algorithm | ✅ Done |
| `MerkleTree` | Event history accumulator | ✅ Done |
| `AntiGamingDetector` | Gaming pattern detection | ✅ Done |
| `Capability` | Agent capability matching | ✅ Done |

### Performance (P1) — More = Better

| Feature | Description | Status |
|---------|-------------|--------|
| Streaming updates | Real-time score changes | ❌ TODO |
| Batch computation | Compute N scores in parallel | ❌ TODO |
| Score caching | In-memory score cache | ❌ TODO |
| Event indexing | Fast event lookup | ❌ TODO |

### Delighters (P2) — Unexpected Wow

| Feature | Description | Status |
|---------|-------------|--------|
| ML anti-gaming | Neural network fraud detection | ❌ Future |
| Cross-chain DID | Support external DID methods | ❌ Future |
| Reputation portability | Import trust from other systems | ❌ Future |

---

## Technical Spec

### Data Models

```rust
pub struct AgentDID {
    pub agent_type: AgentType,  // agent, vehicle, robot, sensor
    pub identifier: [u8; 32],   // Ed25519 public key hash
}

pub struct Capability {
    pub id: String,             // "vision.segmentation.v2"
    pub version: Option<String>,
    pub constraints: Option<Value>,
}

pub struct TrustScore {
    pub value: f64,             // 0.0 - 1.0
    pub confidence: Confidence, // Low, Medium, High
    pub components: TrustComponents,
}
```

### Dependencies

| Crate | Purpose |
|-------|---------|
| `ed25519-dalek` | Cryptographic signatures |
| `sha2` | Hashing |
| `serde` | Serialization |
| `chrono` | Timestamps |

---

## MVP Scope

**Included**: All Must-Have features (already done)

**Next iteration**: Streaming updates, batch computation

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Score computation latency | < 10ms |
| Memory per agent | < 1KB |
| Test coverage | > 90% |
