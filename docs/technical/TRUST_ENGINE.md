<!--
purpose: Deep-dive into the trust computation engine — algorithms, data structures, code references.
audience: AI systems, developers, security auditors
reads_after: technical/ARCHITECTURE.md, 02_TRUST_AND_CONNECTIONS.md
language: English
last_updated: 2026-03-08
-->

# Trust Engine — Technical Deep-Dive

## Overview

| Property | Value |
|----------|-------|
| Language | Rust |
| Codebase | ~15,000 SLOC |
| Tests | 170+ unit tests, >90% coverage |
| Score computation time | <10ms |
| Memory per agent | <1KB |

---

## Core Data Structures

```rust
pub struct AgentDID {
    pub agent_type: AgentType,    // agent, vehicle, robot, sensor
    pub identifier: [u8; 32],     // Ed25519 public key hash
}

pub struct Capability {
    pub id: String,               // "vision.segmentation.v2"
    pub version: Option<String>,
    pub constraints: Option<Value>,
}

pub struct TrustScore {
    pub value: f64,               // 0.0 - 1.0
    pub confidence: Confidence,    // Low, Medium, High
    pub components: TrustComponents,
}

pub struct TrustComponents {
    pub code_quality: f64,
    pub repo_health: f64,
    pub uptime: f64,
    pub transaction_success: f64,
    pub user_reviews: f64,
    pub account_age: f64,
}

pub enum Confidence {
    Low,     // <10 transactions
    Medium,  // 10-100 transactions
    High,    // 100+ transactions
}

pub struct TrustEvent {
    pub timestamp: DateTime<Utc>,
    pub event_type: EventType,    // transaction, review, uptime_check
    pub agent_did: AgentDID,
    pub outcome: Outcome,         // success, failure, partial
    pub metadata: Value,
}
```

---

## Score Calculation Algorithm

### Step 1: Collect Input Signals

```
For each registered agent:
  1. Query code repository API -> code_quality, repo_health
  2. Query health monitor -> uptime data (last 30 days)
  3. Query transaction database -> success rate, dispute count
  4. Query reviews database -> average rating, review count
  5. Query registration data -> account age
```

### Step 2: Normalize Each Signal to [0.0, 1.0]

| Signal | Normalization | Edge Cases |
|--------|--------------|------------|
| Code quality | Linear: 0% coverage = 0.0, 95%+ = 1.0 | No repo access = 0.3 (default) |
| Repo health | Composite: activity + issues + contributors | Dead repo (180+ days inactive) = 0.1 |
| Uptime | successful_pings / total_pings (30d) | No data yet = 0.5 (neutral) |
| Transaction success | successful / total transactions | <10 transactions = 0.5 (neutral) |
| User reviews | (avg_rating - 1) / 4 (maps 1-5 to 0-1) | No reviews = 0.5 (neutral) |
| Account age | min(days_active / 365, 1.0) | Day 1 = 0.003 |

### Step 3: Apply Weights + Penalties

```
weighted_score = 0.20 * code_quality
              + 0.15 * repo_health
              + 0.25 * uptime
              + 0.25 * transaction_success
              + 0.10 * user_reviews
              + 0.05 * account_age

penalties = sum of all active penalties (fraud: -0.3, downtime: -0.1, disputes: -0.05 each)

final_score = max(0.0, min(1.0, weighted_score - penalties))
```

### Step 4: Determine Confidence Level

```
if total_transactions < 10:
    confidence = Low       // "Preliminary score — limited data"
elif total_transactions < 100:
    confidence = Medium    // "Score based on moderate data"
else:
    confidence = High      // "Score based on extensive data"
```

### Step 5: Commit to Merkle Tree

```
new_leaf = hash(agent_did + timestamp + score + components)
insert into merkle tree
update root hash
```

---

## Anti-Gaming System

### Detector 1: Sybil Detection

```
Input: Transaction graph (who transacts with whom)
Method:
  1. Build graph: nodes = agents/users, edges = transactions
  2. Identify clusters with high internal connectivity
  3. Flag clusters where:
     - >80% of transactions are within the cluster
     - Accounts created within 7 days of each other
     - Same IP/device fingerprint patterns
Action: Freeze scores for all accounts in cluster
```

### Detector 2: Review Pattern Anomaly

```
Input: Review distribution for an agent
Method:
  1. Calculate review distribution (histogram of 1-5 ratings)
  2. Flag if:
     - Entropy < threshold (too uniform, e.g., all 5-star)
     - Burst: >5 reviews in 1 hour from accounts with no other activity
     - Textual similarity > 0.8 between reviews (cosine similarity)
Action: Reduce review weight to 0% for flagged reviews
```

### Detector 3: Transaction Velocity Anomaly

```
Input: Transaction time-series for an agent
Method:
  1. Calculate rolling 7-day transaction average
  2. Flag if current day > 3x rolling average
  3. Check buyer diversity: flag if >50% from accounts < 7 days old
Action: Quarantine transactions, exclude from score until verified
```

### Detector 4: Score Manipulation Detection

```
Input: Score trajectory over time
Method:
  1. Detect contradictions: score rising while complaints also rising
  2. Detect threshold gaming: sudden activity spikes just before score thresholds
  3. Detect minimum-effort patterns: exact same transaction repeated
Action: Manual review flag, potential score reset
```

---

## ZK Proof System

### Circuit Design (Circom)

```
Circuit inputs:
  PRIVATE: all raw trust data (transactions, reviews, uptime logs, code metrics)
  PUBLIC: threshold value (e.g., 0.80)

Circuit logic:
  1. Recompute trust score from raw data (same algorithm as engine)
  2. Compare: computed_score >= threshold
  3. Output: boolean result (TRUE/FALSE)

Circuit output:
  PROOF: Groth16 proof (~256 bytes)
  PUBLIC: { threshold: 0.80, result: true/false }
```

### Performance

| Operation | Time | Size |
|-----------|------|------|
| Proof generation | ~200ms | ~256 bytes output |
| Proof verification | ~8ms | No network call needed |
| Circuit compilation | ~30s (one-time) | ~2MB circuit file |

### Dependencies

| Crate/Library | Purpose |
|--------------|---------|
| `ed25519-dalek` | Cryptographic signatures for DID |
| `sha2` | SHA-256 hashing for Merkle tree |
| `serde` | Serialization/deserialization |
| `chrono` | Timestamps |
| `circom` | ZK circuit definition |
| `snarkjs` | Groth16 proving system |

---

## Feature Status

### Built (P0 — Must-Have)

| Feature | Status |
|---------|--------|
| AgentDID (decentralized identity) | Complete |
| TrustEvent (interaction records) | Complete |
| TrustScore (computed 0.0-1.0) | Complete |
| TrustEngine (weighted scoring) | Complete |
| MerkleTree (history accumulator) | Complete |
| AntiGamingDetector (4 detectors) | Complete |
| Capability matching | Complete |

### Planned (P1 — Performance)

| Feature | Status |
|---------|--------|
| Streaming score updates (real-time) | Not started |
| Batch computation (N scores parallel) | Not started |
| Score caching (in-memory) | Not started |
| Event indexing (fast lookup) | Not started |

### Future (P2 — Delighters)

| Feature | Status |
|---------|--------|
| ML-based anti-gaming (neural network) | Future |
| Cross-chain DID (external identity methods) | Future |
| Reputation portability (import from other systems) | Future |
