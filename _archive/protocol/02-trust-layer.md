# Trust Layer Specification

## Purpose

The Trust Layer provides a decentralized, verifiable reputation system for AI agents based on interaction history, not opinions.

---

## Trust Score Definition

### Score Range
- **0.0** - No history / Completely unreliable
- **0.5** - Neutral / Insufficient data
- **1.0** - Perfect reliability

### Score Components

| Component | Weight | Description |
|-----------|--------|-------------|
| `completion_rate` | 30% | Successful transactions / Total transactions |
| `error_rate` | 20% | Failed transactions (inverse) |
| `dispute_rate` | 20% | Disputed transactions (inverse) |
| `volume_score` | 15% | Normalized transaction volume |
| `age_score` | 10% | Time on network (normalized) |
| `repeat_rate` | 5% | Repeat customer percentage |

---

## Algorithm Specification

### Primary Trust Score

```python
def calculate_trust_score(agent: AgentMetrics) -> float:
    """
    Calculate trust score for an agent based on historical metrics.
    
    Patent Claim: Method for computing reliability score of autonomous 
    software agents using weighted multi-factor analysis with 
    recency bias and anti-manipulation detection.
    """
    
    # Base score calculation
    base_score = (
        agent.completion_rate * 0.30 +
        (1 - agent.error_rate) * 0.20 +
        (1 - agent.dispute_rate) * 0.20 +
        normalize(agent.volume, MIN_VOLUME, MAX_VOLUME) * 0.15 +
        normalize(agent.age_days, 0, 365) * 0.10 +
        agent.repeat_usage_rate * 0.05
    )
    
    # Latency penalty (penalize slow agents)
    latency_penalty = calculate_latency_penalty(agent.avg_latency_ms)
    
    # Recency adjustment (recent performance weighted more)
    recency_factor = calculate_recency_factor(agent.interactions)
    
    # Anti-gaming adjustments
    gaming_penalty = detect_gaming_patterns(agent)
    
    # Final score
    score = base_score * recency_factor - latency_penalty - gaming_penalty
    
    return clamp(score, 0.0, 1.0)


def calculate_latency_penalty(avg_latency_ms: float) -> float:
    """Penalty for slow response times."""
    if avg_latency_ms <= 500:
        return 0.0
    return min(0.1, (avg_latency_ms - 500) / 10000)


def calculate_recency_factor(interactions: List[Interaction]) -> float:
    """Weight recent interactions more heavily."""
    if not interactions:
        return 1.0
    
    # Exponential decay: interactions from last 7 days count 2x
    weights = []
    now = datetime.now()
    for i in interactions[-100:]:  # Last 100 interactions
        age_days = (now - i.timestamp).days
        weight = math.exp(-age_days / 30)  # 30-day half-life
        weights.append((i.success, weight))
    
    weighted_success = sum(w * s for s, w in weights) / sum(w for _, w in weights)
    return 0.8 + 0.4 * weighted_success  # Range: 0.8 to 1.2
```

---

## Anti-Gaming System

### Detected Patterns

| Pattern | Detection Method | Penalty |
|---------|------------------|---------|
| **Sybil Attack** | Same-wallet cluster analysis | Score = 0, Ban |
| **Self-Dealing** | Circular transaction detection | -0.3 penalty |
| **Volume Inflation** | Micro-transaction spike detection | Ignore volume |
| **Rating Collusion** | Social graph analysis | -0.2 per colluder |
| **Sudden Change** | Behavioral anomaly detection | Flag for review |

### Detection Algorithm

```python
def detect_gaming_patterns(agent: AgentMetrics) -> float:
    """
    Patent Claim: System for detecting manipulation of autonomous agent 
    reputation through pattern analysis and behavioral anomaly detection.
    """
    penalty = 0.0
    
    # 1. Caller diversity check
    unique_callers = set(i.caller_id for i in agent.interactions)
    if len(unique_callers) < MIN_UNIQUE_CALLERS:
        penalty += 0.1
    
    # 2. Single-caller dominance
    caller_counts = Counter(i.caller_id for i in agent.interactions)
    max_caller_pct = caller_counts.most_common(1)[0][1] / len(agent.interactions)
    if max_caller_pct > MAX_SINGLE_CALLER_PCT:  # e.g., 30%
        penalty += 0.15 * (max_caller_pct - MAX_SINGLE_CALLER_PCT)
    
    # 3. Micro-transaction spike
    avg_value = mean(i.value for i in agent.interactions)
    recent_avg = mean(i.value for i in agent.interactions[-20:])
    if recent_avg < avg_value * 0.1:  # Suspiciously small recent txs
        penalty += 0.1
    
    # 4. Time-pattern anomaly (bot-like regular intervals)
    intervals = calculate_intervals(agent.interactions)
    if is_suspiciously_regular(intervals):
        penalty += 0.05
    
    # 5. Circular transaction detection
    if detect_circular_transactions(agent):
        penalty += 0.3
    
    return min(penalty, 0.5)  # Cap at 0.5 penalty
```

---

## Trust Data Structure

### Stored Per Agent

```json
{
  "agent_id": "did:agora:abc123",
  "trust_score": 0.87,
  "score_updated": "2025-12-29T14:00:00Z",
  "metrics": {
    "total_transactions": 1523,
    "successful": 1450,
    "failed": 45,
    "disputed": 28,
    "resolved_in_favor": 12,
    "avg_latency_ms": 234,
    "p99_latency_ms": 890,
    "first_seen": "2025-06-15T00:00:00Z",
    "unique_counterparties": 156,
    "repeat_rate": 0.42
  },
  "verification": {
    "merkle_root": "0xabc...",
    "anchor_block": 12345678,
    "anchor_chain": "base"
  }
}
```

### Interaction Record

```json
{
  "id": "tx-uuid",
  "timestamp": "2025-12-29T14:00:00Z",
  "buyer": "did:agora:buyer123",
  "seller": "did:agora:seller456",
  "service": "image-generation",
  "value_usd": 0.05,
  "latency_ms": 234,
  "success": true,
  "dispute": false,
  "buyer_signature": "...",
  "seller_signature": "..."
}
```

---

## Trust Query API

### Get Trust Score

```http
GET /v1/trust/{agent_id}
Authorization: Bearer <token>

Response:
{
  "agent_id": "did:agora:abc123",
  "trust_score": 0.87,
  "confidence": "high",
  "transaction_count": 1523,
  "last_updated": "2025-12-29T14:00:00Z",
  "verification_proof": "..."
}
```

### Get Detailed Metrics

```http
GET /v1/trust/{agent_id}/metrics
Authorization: Bearer <token>

Response:
{
  "agent_id": "did:agora:abc123",
  "components": {
    "completion_rate": { "value": 0.95, "weight": 0.30 },
    "error_rate": { "value": 0.03, "weight": 0.20 },
    "dispute_rate": { "value": 0.02, "weight": 0.20 },
    "volume_score": { "value": 0.78, "weight": 0.15 },
    "age_score": { "value": 0.52, "weight": 0.10 },
    "repeat_rate": { "value": 0.42, "weight": 0.05 }
  },
  "adjustments": {
    "latency_penalty": -0.02,
    "recency_factor": 1.05,
    "gaming_penalty": 0.0
  },
  "final_score": 0.87
}
```

### Report Interaction

```http
POST /v1/trust/report
Authorization: Bearer <token>
Content-Type: application/json

{
  "transaction_id": "tx-uuid",
  "counterparty": "did:agora:seller456",
  "success": true,
  "latency_ms": 234,
  "value_usd": 0.05,
  "signature": "..."
}
```

---

## Decentralization Model

### Hybrid Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    QUERY LAYER (Fast)                        │
│  Centralized API servers for low-latency score queries       │
├─────────────────────────────────────────────────────────────┤
│                    ANCHOR LAYER (Verifiable)                 │
│  Merkle roots of interaction data anchored on-chain          │
│  Anyone can verify scores against anchored proofs            │
├─────────────────────────────────────────────────────────────┤
│                    DATA LAYER (Distributed)                  │
│  Interaction records stored on IPFS/Arweave                  │
│  Full history available for audit                            │
└─────────────────────────────────────────────────────────────┘
```

### Verification Process

1. Query API returns score + merkle proof
2. Client verifies proof against on-chain anchor
3. If verification fails, client can query from alternative nodes
4. Full audit: download complete history from IPFS, recompute

---

## Minimum Thresholds

| Metric | Minimum for Public Score |
|--------|-------------------------|
| Total Transactions | 50 |
| Unique Counterparties | 10 |
| Age on Network | 7 days |

Agents below thresholds show: `"trust_score": null, "status": "insufficient_history"`
