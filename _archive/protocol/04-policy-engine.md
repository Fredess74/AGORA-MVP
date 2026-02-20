# Policy Engine Specification

## Purpose

The Policy Engine enables agent owners to define precise rules governing autonomous agent behavior, including spending limits, risk thresholds, and operational boundaries.

---

## Core Innovation

```
Patent Claim: Declarative policy specification system for autonomous 
software agents enabling configurable spending limits, risk-based 
transaction gating, and automated fallback behavior.
```

Traditional approach: Human approves each transaction
Agora approach: Human defines policy once, agent executes autonomously

---

## Policy Schema

### Complete Policy Document

```yaml
# Agora Agent Policy v1.0
# This document defines the operational boundaries for an autonomous agent

version: "1.0"
agent_id: "did:agora:my-agent-123"
policy_id: "policy-uuid"
created_at: "2025-12-29T14:00:00Z"
expires_at: "2026-12-29T14:00:00Z"  # Policy must be renewed
signature: "owner-signature-base64"

# =============================================================================
# IDENTITY
# =============================================================================
identity:
  owner: "did:key:owner-public-key"
  name: "Research Assistant Agent"
  description: "Autonomous research and data gathering agent"
  contact: "owner@example.com"  # For dispute contact

# =============================================================================
# SPENDING LIMITS
# =============================================================================
spending:
  # Hard limits (cannot be exceeded under any circumstances)
  limits:
    per_transaction:
      max: 10.00
      currency: "USD"
    per_hour:
      max: 50.00
      currency: "USD"
    per_day:
      max: 200.00
      currency: "USD"
    per_week:
      max: 1000.00
      currency: "USD"
    per_month:
      max: 3000.00
      currency: "USD"
  
  # Wallet configuration
  wallet:
    address: "0xABC123..."
    chain: "base"
    auto_refill:
      enabled: true
      threshold: 50.00  # Refill when below this
      amount: 200.00    # Refill this amount
      source: "owner-wallet"
  
  # Budget allocation by category
  budgets:
    data_retrieval:
      max_per_month: 500.00
      priority: "high"
    compute:
      max_per_month: 1000.00
      priority: "medium"
    image_generation:
      max_per_month: 200.00
      priority: "low"

# =============================================================================
# TRUST REQUIREMENTS
# =============================================================================
trust:
  # Minimum trust score to transact
  min_score: 0.80
  
  # Minimum transaction history
  min_transactions: 100
  
  # Require verified identity
  require_verified: true
  
  # Category-specific trust requirements
  per_category:
    financial_data:
      min_score: 0.95
      require_audit: true
    code_execution:
      min_score: 0.90
      require_sandbox: true
    general:
      min_score: 0.75

# =============================================================================
# SERVICE CATEGORIES
# =============================================================================
categories:
  # Explicitly allowed categories
  allowed:
    - data_retrieval
    - web_search
    - image_generation
    - text_processing
    - code_analysis
    - translation
  
  # Explicitly blocked (even if would otherwise be allowed)
  blocked:
    - gambling
    - adult_content
    - weapons
    - financial_trading
    - personal_data_purchase
  
  # Requires human approval before each use
  requires_approval:
    - legal_documents
    - medical_advice
    - financial_advice

# =============================================================================
# RISK MANAGEMENT
# =============================================================================
risk:
  # Maximum exposure to single provider
  max_single_provider_exposure: 0.20  # 20% of budget
  
  # Escrow requirements
  escrow:
    require_above: 1.00  # Escrow for transactions > $1
    timeout: 300  # 5 minutes to complete
  
  # Automatic dispute triggers
  auto_dispute:
    on_timeout: true
    timeout_seconds: 60
    on_result_mismatch: true
    on_significant_latency: true  # >3x expected
  
  # Velocity limits (fraud prevention)
  velocity:
    max_transactions_per_minute: 10
    max_transactions_per_hour: 100
    max_new_providers_per_day: 5

# =============================================================================
# FALLBACK BEHAVIOR
# =============================================================================
fallback:
  # What to do on failure
  on_failure:
    action: "try_next"  # try_next | abort | notify_owner
    max_retries: 3
    retry_delay_ms: 1000
  
  # Provider selection strategy
  provider_selection:
    strategy: "highest_trust"  # highest_trust | lowest_cost | balanced
    cost_weight: 0.3
    trust_weight: 0.7
  
  # Degraded mode (if trust service unavailable)
  degraded_mode:
    allow_transactions: false  # Halt if can't verify trust
    max_amount_without_trust: 0.10
    whitelist_only: true

# =============================================================================
# NOTIFICATIONS
# =============================================================================
notifications:
  # Alert thresholds
  alerts:
    budget_threshold: 0.80  # Alert at 80% budget used
    unusual_activity: true
    failed_transactions: true
    dispute_initiated: true
  
  # Notification channels
  channels:
    - type: "email"
      address: "owner@example.com"
    - type: "webhook"
      url: "https://example.com/webhook/agora"
    - type: "telegram"
      chat_id: "123456789"

# =============================================================================
# AUDIT & COMPLIANCE
# =============================================================================
audit:
  # Logging level
  log_level: "full"  # full | summary | minimal
  
  # Retention
  log_retention_days: 365
  
  # Export
  allow_export: true
  export_format: ["json", "csv"]
  
  # Compliance flags
  compliance:
    gdpr: true
    ccpa: true
    require_data_locality: false
```

---

## Policy Engine Implementation

### Policy Validation

```python
class PolicyEngine:
    """
    Patent Claim: System for validating and enforcing declarative 
    policies on autonomous agent transactions in real-time.
    """
    
    def __init__(self, policy: Policy):
        self.policy = policy
        self.spend_tracker = SpendTracker()
        self.provider_tracker = ProviderTracker()
    
    def can_execute(self, transaction: TransactionRequest) -> PolicyDecision:
        """
        Evaluate whether a transaction is allowed under current policy.
        """
        checks = [
            self._check_spending_limits,
            self._check_trust_requirements,
            self._check_category_allowed,
            self._check_risk_limits,
            self._check_velocity_limits,
        ]
        
        for check in checks:
            result = check(transaction)
            if not result.allowed:
                return result
        
        return PolicyDecision(
            allowed=True,
            reason="All policy checks passed",
            conditions=self._get_conditions(transaction)
        )
    
    def _check_spending_limits(self, tx: TransactionRequest) -> PolicyDecision:
        """Check all spending limits."""
        limits = self.policy.spending.limits
        current = self.spend_tracker.get_current_spend()
        
        # Per-transaction limit
        if tx.amount > limits.per_transaction.max:
            return PolicyDecision(
                allowed=False,
                reason=f"Amount {tx.amount} exceeds per-transaction limit {limits.per_transaction.max}",
                code="LIMIT_PER_TX"
            )
        
        # Hourly limit
        if current.hour + tx.amount > limits.per_hour.max:
            return PolicyDecision(
                allowed=False,
                reason="Hourly spending limit would be exceeded",
                code="LIMIT_HOURLY"
            )
        
        # Daily limit
        if current.day + tx.amount > limits.per_day.max:
            return PolicyDecision(
                allowed=False,
                reason="Daily spending limit would be exceeded",
                code="LIMIT_DAILY"
            )
        
        # Category budget
        cat_budget = self.policy.spending.budgets.get(tx.category)
        if cat_budget:
            cat_spent = self.spend_tracker.get_category_spend(tx.category)
            if cat_spent + tx.amount > cat_budget.max_per_month:
                return PolicyDecision(
                    allowed=False,
                    reason=f"Category budget for {tx.category} exceeded",
                    code="LIMIT_CATEGORY"
                )
        
        return PolicyDecision(allowed=True)
    
    def _check_trust_requirements(self, tx: TransactionRequest) -> PolicyDecision:
        """Verify provider meets trust requirements."""
        provider_trust = get_trust_score(tx.provider)
        min_trust = self.policy.trust.min_score
        
        # Category-specific trust override
        cat_trust = self.policy.trust.per_category.get(tx.category)
        if cat_trust:
            min_trust = max(min_trust, cat_trust.min_score)
        
        if provider_trust is None:
            return PolicyDecision(
                allowed=False,
                reason="Provider has no trust score",
                code="TRUST_NONE"
            )
        
        if provider_trust < min_trust:
            return PolicyDecision(
                allowed=False,
                reason=f"Provider trust {provider_trust} below minimum {min_trust}",
                code="TRUST_LOW"
            )
        
        # Check transaction count
        provider_txs = get_provider_transaction_count(tx.provider)
        if provider_txs < self.policy.trust.min_transactions:
            return PolicyDecision(
                allowed=False,
                reason=f"Provider has insufficient history ({provider_txs} txs)",
                code="TRUST_HISTORY"
            )
        
        return PolicyDecision(allowed=True)
    
    def _check_category_allowed(self, tx: TransactionRequest) -> PolicyDecision:
        """Check if transaction category is allowed."""
        if tx.category in self.policy.categories.blocked:
            return PolicyDecision(
                allowed=False,
                reason=f"Category {tx.category} is blocked by policy",
                code="CATEGORY_BLOCKED"
            )
        
        if tx.category not in self.policy.categories.allowed:
            return PolicyDecision(
                allowed=False,
                reason=f"Category {tx.category} not in allowed list",
                code="CATEGORY_NOT_ALLOWED"
            )
        
        if tx.category in self.policy.categories.requires_approval:
            return PolicyDecision(
                allowed=False,
                reason=f"Category {tx.category} requires human approval",
                code="CATEGORY_NEEDS_APPROVAL",
                requires_human=True
            )
        
        return PolicyDecision(allowed=True)
    
    def _check_risk_limits(self, tx: TransactionRequest) -> PolicyDecision:
        """Check risk management rules."""
        # Provider concentration
        provider_spend = self.provider_tracker.get_provider_spend(tx.provider)
        total_spend = self.spend_tracker.get_total_spend()
        
        if total_spend > 0:
            concentration = (provider_spend + tx.amount) / total_spend
            max_concentration = self.policy.risk.max_single_provider_exposure
            
            if concentration > max_concentration:
                return PolicyDecision(
                    allowed=False,
                    reason=f"Would exceed {max_concentration*100}% exposure to single provider",
                    code="RISK_CONCENTRATION"
                )
        
        return PolicyDecision(allowed=True)
    
    def _check_velocity_limits(self, tx: TransactionRequest) -> PolicyDecision:
        """Check transaction velocity (fraud prevention)."""
        velocity = self.policy.risk.velocity
        recent = self.spend_tracker.get_recent_transactions()
        
        txs_last_minute = sum(1 for t in recent if t.age_seconds < 60)
        if txs_last_minute >= velocity.max_transactions_per_minute:
            return PolicyDecision(
                allowed=False,
                reason="Transaction velocity too high (per minute)",
                code="VELOCITY_MINUTE"
            )
        
        return PolicyDecision(allowed=True)
```

---

## Policy Decision Response

```json
{
  "decision": {
    "allowed": true,
    "reason": "All policy checks passed",
    "checks": [
      { "name": "spending_limits", "passed": true },
      { "name": "trust_requirements", "passed": true },
      { "name": "category_allowed", "passed": true },
      { "name": "risk_limits", "passed": true },
      { "name": "velocity_limits", "passed": true }
    ],
    "conditions": {
      "require_escrow": true,
      "max_latency_ms": 5000,
      "fallback_providers": ["did:agora:backup1", "did:agora:backup2"]
    }
  },
  "context": {
    "current_spend": {
      "hour": 12.50,
      "day": 45.00,
      "month": 890.00
    },
    "limits_remaining": {
      "per_transaction": 10.00,
      "hour": 37.50,
      "day": 155.00
    }
  }
}
```

---

## Policy API

### Validate Policy

```http
POST /v1/policy/validate
Content-Type: application/yaml

<policy document>

Response:
{
  "valid": true,
  "warnings": [
    "Budget for 'compute' exceeds monthly limit"
  ],
  "signature_valid": true
}
```

### Check Transaction

```http
POST /v1/policy/check
Authorization: Bearer <agent-token>
Content-Type: application/json

{
  "provider": "did:agora:provider456",
  "amount": 5.00,
  "category": "data_retrieval",
  "service": "market-data-api"
}

Response:
{
  "allowed": true,
  "reason": "All policy checks passed",
  "conditions": {
    "require_escrow": true
  }
}
```

---

## Policy Security

### Signature Verification

Policy documents must be signed by the owner's key to prevent tampering:

```python
def verify_policy_signature(policy: Policy) -> bool:
    """Verify policy was signed by declared owner."""
    owner_pubkey = resolve_did(policy.identity.owner)
    policy_hash = hash_policy_without_signature(policy)
    return verify_signature(
        message=policy_hash,
        signature=policy.signature,
        public_key=owner_pubkey
    )
```

### Policy Updates

1. Owner signs new policy with updated `policy_id`
2. Previous policy marked as superseded
3. Grace period (1 hour) where both old and new accepted
4. After grace period, only new policy valid

---

## Emergency Controls

### Kill Switch

Owners can immediately halt all agent activity:

```http
POST /v1/policy/emergency/halt
Authorization: Bearer <owner-token>

{
  "agent_id": "did:agora:my-agent-123",
  "reason": "Suspected compromise",
  "signature": "..."
}
```

### Spending Freeze

Temporarily freeze spending without halting queries:

```http
POST /v1/policy/emergency/freeze-spending
Authorization: Bearer <owner-token>

{
  "agent_id": "did:agora:my-agent-123",
  "duration_hours": 24,
  "signature": "..."
}
```
