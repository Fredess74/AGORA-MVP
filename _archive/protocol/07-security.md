# Security & Threat Model

## Purpose

This document defines the security architecture, threat model, attack vectors, and mitigations for the Agora Protocol.

---

## Security Principles

1. **Defense in Depth**: Multiple layers of protection
2. **Least Privilege**: Agents have minimal necessary permissions
3. **Fail Secure**: Default to denial on uncertainty
4. **Auditability**: All actions are logged and verifiable
5. **Non-Custodial**: Protocol never holds user funds

---

## Threat Model

### Assets to Protect

| Asset | Value | Criticality |
|-------|-------|-------------|
| Agent funds (wallets) | Financial | CRITICAL |
| Trust scores | Reputation | HIGH |
| Agent private keys | Identity | CRITICAL |
| Transaction history | Privacy | MEDIUM |
| Policy configurations | Operational | HIGH |

### Threat Actors

| Actor | Motivation | Capability |
|-------|------------|------------|
| **Rogue Agent** | Profit from fraud | Technical, inside access |
| **Competitor** | Sabotage reputation | Moderate technical |
| **Script Kiddie** | Chaos, free services | Low technical |
| **Nation State** | Surveillance, disruption | High technical |
| **Malicious Owner** | Steal from own agents | High access |

---

## Attack Vectors & Mitigations

### 1. Sybil Attack (Fake Identities)

**Attack**: Create many fake agents to manipulate trust scores.

```
Attacker creates 1000 fake agents
Fake agents transact with each other
Artificially inflate trust scores
Use high-trust fakes to scam victims
```

**Mitigations**:
| Mitigation | Implementation |
|------------|----------------|
| Registration fee | 0.01 USDC per DID (anti-spam) |
| Proof of wallet | Require funded wallet on-chain |
| Caller diversity minimum | Score requires 10+ unique counterparties |
| Cluster detection | Graph analysis for fake networks |
| Age minimum | 7 days before public trust score |

```python
def detect_sybil_cluster(agent_id: str) -> float:
    """Detect if agent is part of fake cluster."""
    
    # Build transaction graph
    counterparties = get_counterparties(agent_id)
    
    # Check counterparty overlap
    for cp in counterparties:
        cp_counterparties = get_counterparties(cp)
        overlap = len(counterparties & cp_counterparties)
        if overlap / len(counterparties) > 0.5:
            return 0.8  # High Sybil risk
    
    # Check if counterparties only transact with each other
    isolated = True
    for cp in counterparties:
        external = get_counterparties(cp) - counterparties
        if len(external) > 5:
            isolated = False
            break
    
    if isolated:
        return 0.9  # Very high Sybil risk
    
    return 0.0  # Low risk
```

---

### 2. Trust Score Manipulation

**Attack**: Artificially boost or attack trust scores.

**Boost Attack**:
- Self-dealing (circular transactions)
- Pay for fake positive reviews
- Micro-transaction spam

**Attack on Competitor**:
- Initiate transactions then dispute all
- False claims to damage reputation

**Mitigations**:

```python
ANTI_MANIPULATION_RULES = {
    # Self-dealing detection
    "circular_tx_window": 24 * 60 * 60,  # 24 hours
    "max_circular_ratio": 0.1,  # Max 10% of txs can be circular
    
    # Micro-transaction spam
    "min_meaningful_value": 0.01,  # Ignore txs below $0.01 for trust
    "micro_tx_cap_per_day": 100,  # Max micro-txs per day
    
    # Dispute abuse
    "dispute_cooldown": 3600,  # 1 hour between disputes to same agent
    "max_dispute_rate": 0.2,  # If >20% disputes, flag requester
    
    # Volume gaming
    "volume_recency_weight": 0.7,  # Recent = 70%, historical = 30%
}

def apply_anti_manipulation(metrics: AgentMetrics) -> float:
    """Calculate manipulation penalty."""
    penalty = 0.0
    
    # Circular transaction check
    circular = detect_circular_transactions(metrics.transactions)
    if circular.ratio > ANTI_MANIPULATION_RULES["max_circular_ratio"]:
        penalty += 0.2
    
    # Micro-tx spam check
    micro_count = count_micro_transactions(metrics.transactions)
    if micro_count > ANTI_MANIPULATION_RULES["micro_tx_cap_per_day"]:
        penalty += 0.1
    
    # Single counterparty dominance
    max_share = max_counterparty_share(metrics.transactions)
    if max_share > 0.3:  # >30% from one source
        penalty += 0.15 * (max_share - 0.3)
    
    return min(penalty, 0.5)  # Cap at 0.5
```

---

### 3. Payment Attacks

**Attack Types**:
- Double-spend (pay, get service, reverse payment)
- Escrow griefing (lock funds, never release or claim)
- Front-running (MEV)

**Mitigations**:

| Attack | Mitigation |
|--------|------------|
| Double-spend | Use blockchain finality (wait for confirmations) |
| Escrow grief | Auto-timeout with refund, reputation penalty |
| Front-running | Private mempools, commit-reveal schemes |

```solidity
// Escrow grief prevention
function refundExpired(bytes32 escrowId) external {
    Escrow storage e = escrows[escrowId];
    require(block.timestamp > e.expiresAt, "Not expired");
    require(e.state == EscrowState.Funded, "Invalid state");
    
    e.state = EscrowState.Expired;
    IERC20(e.token).transfer(e.buyer, e.amount);
    
    // Seller gets reputation penalty for non-delivery
    emit SellerTimeout(escrowId, e.seller);
}
```

---

### 4. Policy Bypass

**Attack**: Agent ignores policy, spends beyond limits.

**Attack Scenarios**:
- Compromised agent key
- Bug in policy engine
- Race condition bypass

**Mitigations**:

```python
class PolicyEnforcer:
    """Multi-layer policy enforcement."""
    
    def __init__(self, policy: Policy):
        self.policy = policy
        # Separate lock for atomicity
        self.spend_lock = threading.Lock()
    
    def execute_transaction(self, tx: Transaction) -> Result:
        with self.spend_lock:
            # Layer 1: Local policy check
            decision = self.check_policy(tx)
            if not decision.allowed:
                return Result.denied(decision.reason)
            
            # Layer 2: Pre-reserve funds
            if not self.reserve_funds(tx.amount):
                return Result.denied("Insufficient funds")
            
            try:
                # Layer 3: On-chain policy contract check
                if not self.on_chain_policy_check(tx):
                    self.release_funds(tx.amount)
                    return Result.denied("On-chain policy rejected")
                
                # Execute
                result = self.execute(tx)
                
                # Record spend
                self.record_spend(tx)
                
                return result
                
            except Exception as e:
                self.release_funds(tx.amount)
                raise
```

**On-Chain Policy Contract**:
```solidity
contract AgoraPolicyGuard {
    mapping(address => AgentPolicy) public policies;
    mapping(address => SpendTracking) public spending;
    
    modifier withinPolicy(address agent, uint256 amount) {
        SpendTracking storage s = spending[agent];
        AgentPolicy storage p = policies[agent];
        
        // Check per-tx limit
        require(amount <= p.maxPerTx, "Exceeds per-tx limit");
        
        // Check hourly limit
        if (block.timestamp > s.hourStart + 3600) {
            s.hourStart = block.timestamp;
            s.hourSpent = 0;
        }
        require(s.hourSpent + amount <= p.maxPerHour, "Exceeds hourly");
        
        _;
        
        // Record spend
        s.hourSpent += amount;
        s.totalSpent += amount;
    }
}
```

---

### 5. Key Compromise

**Attack**: Attacker obtains agent private key.

**Impact**: Full control of agent, can drain wallet, damage reputation.

**Mitigations**:

| Layer | Protection |
|-------|------------|
| Prevention | HSM/Secure enclave for key storage |
| Detection | Unusual behavior alerting |
| Limit damage | Per-tx and daily limits |
| Recovery | Owner can revoke and rotate keys |

```python
# Anomaly detection for compromised agents
def detect_compromise(agent: Agent, tx: Transaction) -> float:
    """Return risk score 0-1 for potential compromise."""
    risks = []
    
    # Unusual time
    if is_unusual_hour(agent, tx.timestamp):
        risks.append(0.2)
    
    # Unusual provider
    if tx.provider not in agent.frequent_providers:
        risks.append(0.1)
    
    # Unusual amount
    if tx.amount > agent.avg_amount * 3:
        risks.append(0.3)
    
    # Unusual category
    if tx.category not in agent.usual_categories:
        risks.append(0.2)
    
    # Rapid transactions
    recent_count = count_recent_txs(agent, window_minutes=5)
    if recent_count > 10:
        risks.append(0.4)
    
    risk_score = min(sum(risks), 1.0)
    
    if risk_score > 0.7:
        notify_owner(agent, "Possible compromise detected")
        if risk_score > 0.9:
            emergency_freeze(agent)
    
    return risk_score
```

---

### 6. Denial of Service

**Attack**: Flood network/agents to prevent legitimate operation.

**Attack Types**:
- API spam
- Discovery flood
- Escrow spam (create many escrows, never use)

**Mitigations**:

| Attack | Mitigation |
|--------|------------|
| API spam | Rate limiting, proof-of-work for anonymous |
| Discovery flood | Cache, CDN, query cost limits |
| Escrow spam | Non-refundable escrow creation fee |

```python
# Rate limiting implementation
class RateLimiter:
    LIMITS = {
        "discovery_query": (100, 60),  # 100 per minute
        "trust_check": (200, 60),
        "escrow_create": (10, 60),
        "transaction": (50, 60),
    }
    
    def is_allowed(self, agent_id: str, action: str) -> bool:
        limit, window = self.LIMITS[action]
        key = f"rate:{agent_id}:{action}"
        
        current = self.redis.incr(key)
        if current == 1:
            self.redis.expire(key, window)
        
        return current <= limit
```

---

## Cryptographic Primitives

| Use Case | Algorithm | Reason |
|----------|-----------|--------|
| Signatures | Ed25519 | Fast, secure, small |
| Hashing | SHA-256 | Standard, hardware acceleration |
| Encryption | ChaCha20-Poly1305 | Fast, side-channel resistant |
| Key Exchange | X25519 | ECDH on Curve25519 |
| Merkle Trees | Keccak256 | EVM compatible |

---

## Incident Response

### Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| P0 | Funds at risk | Immediate |
| P1 | Trust data compromise | <1 hour |
| P2 | Service degradation | <4 hours |
| P3 | Minor bug | <24 hours |

### Response Procedures

**P0 - Funds at Risk**:
1. Emergency pause of affected contracts
2. Alert all operators
3. Root cause analysis
4. Coordinate fix and relaunch
5. Post-mortem within 48 hours

**P1 - Trust Compromise**:
1. Freeze trust updates
2. Identify affected agents
3. Rollback if necessary
4. Notify affected parties
5. Patch and resume
