# Payment Layer Specification

## Purpose

The Payment Layer enables autonomous, non-custodial value transfer between AI agents with escrow protection and multi-rail settlement.

---

## Design Principles

1. **Non-Custodial**: Protocol never holds funds
2. **Rail-Agnostic**: Support crypto, fiat, CBDC
3. **Atomic**: Payment and service delivery are linked
4. **Escrowed**: Funds locked until service confirmed

---

## Payment Flow

### Standard Transaction

```
┌─────────┐                    ┌─────────┐                    ┌─────────┐
│  BUYER  │                    │ ESCROW  │                    │ SELLER  │
│  AGENT  │                    │CONTRACT │                    │  AGENT  │
└────┬────┘                    └────┬────┘                    └────┬────┘
     │                              │                              │
     │  1. Request Quote            │                              │
     │─────────────────────────────────────────────────────────────▶
     │                              │                              │
     │  2. Quote Response           │                              │
     │◀─────────────────────────────────────────────────────────────
     │                              │                              │
     │  3. Lock Funds               │                              │
     │─────────────────────────────▶│                              │
     │                              │                              │
     │  4. Escrow Confirmation      │                              │
     │◀─────────────────────────────│                              │
     │                              │                              │
     │  5. Service Request + Escrow ID                             │
     │─────────────────────────────────────────────────────────────▶
     │                              │                              │
     │                              │  6. Verify Escrow            │
     │                              │◀─────────────────────────────│
     │                              │                              │
     │                              │  7. Escrow Valid             │
     │                              │─────────────────────────────▶│
     │                              │                              │
     │  8. Service Result           │                              │
     │◀─────────────────────────────────────────────────────────────
     │                              │                              │
     │  9. Confirm & Release        │                              │
     │─────────────────────────────▶│                              │
     │                              │                              │
     │                              │  10. Transfer Funds          │
     │                              │─────────────────────────────▶│
     │                              │                              │
```

---

## x402 Integration

### HTTP 402 Payment Required

The protocol extends HTTP with machine-readable payment requirements:

```http
GET /api/generate-image HTTP/1.1
Host: agent-b.example.com
X-Agora-Agent: did:agora:buyer123

HTTP/1.1 402 Payment Required
Content-Type: application/json
X-Agora-Payment: required

{
  "payment": {
    "amount": "0.05",
    "currency": "USDC",
    "recipient": "did:agora:seller456",
    "escrow_contract": "0x1234...",
    "expires": "2025-12-29T15:00:00Z",
    "quote_id": "quote-uuid"
  },
  "trust": {
    "seller_score": 0.92,
    "min_buyer_score": 0.5
  }
}
```

### Payment Fulfillment

```http
GET /api/generate-image HTTP/1.1
Host: agent-b.example.com
X-Agora-Agent: did:agora:buyer123
X-Agora-Payment-Proof: {
  "escrow_id": "escrow-uuid",
  "escrow_contract": "0x1234...",
  "amount": "0.05",
  "currency": "USDC",
  "proof": "0xabc..."
}

HTTP/1.1 200 OK
Content-Type: application/json

{
  "result": { ... },
  "transaction_id": "tx-uuid"
}
```

---

## Escrow Smart Contract

### Interface

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title AgoraEscrow
 * @notice Non-custodial escrow for AI agent transactions
 * 
 * Patent Claim: Smart contract system for autonomous agent 
 * transactions with trust-conditional release and automated 
 * dispute resolution.
 */
interface IAgoraEscrow {
    
    struct Escrow {
        bytes32 escrowId;
        address buyer;
        address seller;
        uint256 amount;
        address token;
        uint256 expiresAt;
        EscrowState state;
        bytes32 serviceHash;
    }
    
    enum EscrowState {
        Created,
        Funded,
        Released,
        Disputed,
        Refunded,
        Expired
    }
    
    // Buyer creates escrow
    function createEscrow(
        bytes32 escrowId,
        address seller,
        uint256 amount,
        address token,
        uint256 duration,
        bytes32 serviceHash
    ) external returns (bool);
    
    // Seller claims after service delivery
    function claimEscrow(
        bytes32 escrowId,
        bytes calldata buyerSignature
    ) external returns (bool);
    
    // Buyer releases manually
    function releaseEscrow(bytes32 escrowId) external returns (bool);
    
    // Either party initiates dispute
    function disputeEscrow(
        bytes32 escrowId,
        bytes calldata evidence
    ) external returns (bool);
    
    // Automatic refund after expiry
    function refundExpired(bytes32 escrowId) external returns (bool);
    
    // Events
    event EscrowCreated(bytes32 indexed escrowId, address buyer, address seller, uint256 amount);
    event EscrowReleased(bytes32 indexed escrowId, address seller, uint256 amount);
    event EscrowDisputed(bytes32 indexed escrowId, address initiator);
    event EscrowRefunded(bytes32 indexed escrowId, address buyer, uint256 amount);
}
```

### Implementation Notes

```solidity
contract AgoraEscrow is IAgoraEscrow {
    
    mapping(bytes32 => Escrow) public escrows;
    
    // Trust oracle integration for dispute resolution
    address public trustOracle;
    
    function createEscrow(
        bytes32 escrowId,
        address seller,
        uint256 amount,
        address token,
        uint256 duration,
        bytes32 serviceHash
    ) external returns (bool) {
        require(escrows[escrowId].buyer == address(0), "Escrow exists");
        
        // Transfer tokens to contract
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        
        escrows[escrowId] = Escrow({
            escrowId: escrowId,
            buyer: msg.sender,
            seller: seller,
            amount: amount,
            token: token,
            expiresAt: block.timestamp + duration,
            state: EscrowState.Funded,
            serviceHash: serviceHash
        });
        
        emit EscrowCreated(escrowId, msg.sender, seller, amount);
        return true;
    }
    
    function releaseEscrow(bytes32 escrowId) external returns (bool) {
        Escrow storage e = escrows[escrowId];
        require(msg.sender == e.buyer, "Not buyer");
        require(e.state == EscrowState.Funded, "Invalid state");
        
        e.state = EscrowState.Released;
        IERC20(e.token).transfer(e.seller, e.amount);
        
        emit EscrowReleased(escrowId, e.seller, e.amount);
        return true;
    }
    
    function disputeEscrow(
        bytes32 escrowId,
        bytes calldata evidence
    ) external returns (bool) {
        Escrow storage e = escrows[escrowId];
        require(
            msg.sender == e.buyer || msg.sender == e.seller,
            "Not party"
        );
        require(e.state == EscrowState.Funded, "Invalid state");
        
        e.state = EscrowState.Disputed;
        
        // Forward to trust oracle for resolution
        ITrustOracle(trustOracle).resolveDispute(escrowId, evidence);
        
        emit EscrowDisputed(escrowId, msg.sender);
        return true;
    }
}
```

---

## Multi-Rail Support

### Supported Payment Rails

| Rail | Type | Latency | Fee | Best For |
|------|------|---------|-----|----------|
| **USDC (Base L2)** | Crypto | 2s | ~$0.001 | Default |
| **USDC (Solana)** | Crypto | 0.4s | ~$0.0002 | High frequency |
| **Lightning BTC** | Crypto | <1s | ~$0.001 | Bitcoin ecosystem |
| **Stripe** | Fiat | <1s | 2.9%+$0.30 | Enterprise |
| **Wire/ACH** | Fiat | 1-3 days | $0.20-$5 | Large amounts |

### Rail Selection Logic

```python
def select_payment_rail(
    amount: Decimal,
    buyer_prefs: PaymentPrefs,
    seller_prefs: PaymentPrefs
) -> PaymentRail:
    """
    Patent Claim: Method for automatic selection of optimal 
    payment settlement rail based on transaction parameters 
    and agent preferences.
    """
    
    # Find intersection of supported rails
    common_rails = buyer_prefs.rails & seller_prefs.rails
    
    if not common_rails:
        raise NoCommonRailError()
    
    # Score each rail
    scores = {}
    for rail in common_rails:
        fee = rail.calculate_fee(amount)
        latency = rail.expected_latency
        reliability = rail.reliability_score
        
        # Weighted scoring
        score = (
            (1 - fee/amount) * 0.4 +  # Minimize fee impact
            (1 - latency/MAX_LATENCY) * 0.3 +  # Prefer fast
            reliability * 0.3  # Prefer reliable
        )
        
        # Apply preference bonuses
        if rail in buyer_prefs.preferred:
            score *= 1.1
        if rail in seller_prefs.preferred:
            score *= 1.1
        
        scores[rail] = score
    
    return max(scores, key=scores.get)
```

---

## Payment Data Structures

### Payment Request

```json
{
  "type": "payment_request",
  "version": "1.0",
  "quote_id": "quote-uuid",
  "buyer": "did:agora:buyer123",
  "seller": "did:agora:seller456",
  "amount": {
    "value": "0.05",
    "currency": "USD"
  },
  "service": {
    "type": "image-generation",
    "params_hash": "sha256:abc..."
  },
  "expires_at": "2025-12-29T15:00:00Z",
  "accepted_rails": ["usdc-base", "usdc-solana"],
  "seller_signature": "..."
}
```

### Payment Confirmation

```json
{
  "type": "payment_confirmation",
  "version": "1.0",
  "quote_id": "quote-uuid",
  "escrow": {
    "id": "escrow-uuid",
    "contract": "0x1234...",
    "chain": "base",
    "block": 12345678,
    "tx_hash": "0xabc..."
  },
  "rail": "usdc-base",
  "amount": {
    "value": "0.05",
    "currency": "USDC"
  },
  "buyer_signature": "..."
}
```

---

## Dispute Resolution

### Automatic Resolution

```python
def auto_resolve_dispute(dispute: Dispute) -> Resolution:
    """
    Automatic dispute resolution based on objective criteria.
    """
    
    # 1. Check if service was delivered (hash match)
    if dispute.result_hash == dispute.expected_hash:
        # Result matches specification
        return Resolution.RELEASE_TO_SELLER
    
    # 2. Check response time
    if dispute.latency_ms > dispute.max_latency_ms * 2:
        # Severely over time limit
        return Resolution.REFUND_TO_BUYER
    
    # 3. Check seller's historical dispute rate
    seller_trust = get_trust_score(dispute.seller)
    if seller_trust < 0.5 and dispute.buyer_trust > 0.8:
        # Unreliable seller, reliable buyer
        return Resolution.REFUND_TO_BUYER
    
    # 4. No automatic resolution possible
    return Resolution.ESCALATE_TO_ARBITRATION
```

### Arbitration (Fallback)

When automatic resolution fails:
1. Both parties submit evidence
2. Random selection of 3 arbiters from trusted pool
3. Majority decision
4. Loser pays arbitration fee
5. Result affects both parties' trust scores
