# Technical Architecture: Agora Trust Layer for AP2

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │  Agent SDK  │  │  REST API   │  │  GraphQL    │  │  AP2 Extension  │ │
│  │  (TS/Py/Go) │  │  Client     │  │  Client     │  │  Hook           │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘ │
└─────────┼────────────────┼────────────────┼──────────────────┼──────────┘
          │                │                │                  │
          ▼                ▼                ▼                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            API GATEWAY                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │  Rate Limiting │ Auth (API Key / JWT) │ Request Routing │ Caching  ││
│  └─────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          SERVICE LAYER                                   │
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐  │
│  │  Trust Query    │  │  Report Ingestion│  │  Anti-Gaming Engine   │  │
│  │  Service        │  │  Service         │  │                       │  │
│  │                 │  │                  │  │  • Sybil Detection    │  │
│  │  • Score Lookup │  │  • Validate      │  │  • Pattern Analysis   │  │
│  │  • Batch Query  │  │  • Queue         │  │  • Anomaly Detection  │  │
│  │  • Filtering    │  │  • Process       │  │                       │  │
│  └────────┬────────┘  └────────┬─────────┘  └───────────┬───────────┘  │
│           │                    │                        │               │
│           ▼                    ▼                        ▼               │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │                     TRUST COMPUTATION ENGINE                        ││
│  │                                                                     ││
│  │  • Real-time score calculation                                      ││
│  │  • Component weighting                                              ││
│  │  • Recency adjustment                                               ││
│  │  • Penalty application                                              ││
│  └─────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                     │
│                                                                          │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────────────────────┐  │
│  │  PostgreSQL   │  │    Redis      │  │        TimescaleDB          │  │
│  │               │  │               │  │                             │  │
│  │  • Agent      │  │  • Score      │  │  • Transaction Events       │  │
│  │    Profiles   │  │    Cache      │  │  • Time-series Metrics      │  │
│  │  • Metadata   │  │  • Rate       │  │  • Historical Data          │  │
│  │               │  │    Limits     │  │                             │  │
│  └───────────────┘  └───────────────┘  └─────────────────────────────┘  │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │                   BLOCKCHAIN ANCHOR (Base L2)                       ││
│  │  • Merkle root of trust scores (hourly)                             ││
│  │  • Verifiable proofs                                                ││
│  └─────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Data Models

### Agent Profile

```sql
CREATE TABLE agents (
    agent_id TEXT PRIMARY KEY,           -- did:web:example.com
    agent_type TEXT NOT NULL,            -- merchant, service, buyer
    first_seen TIMESTAMPTZ NOT NULL,
    last_active TIMESTAMPTZ NOT NULL,
    
    -- Cached metrics
    trust_score DECIMAL(4,3),            -- 0.000 to 1.000
    score_confidence TEXT,               -- low, medium, high
    score_updated TIMESTAMPTZ,
    
    -- Aggregate stats
    total_transactions INTEGER DEFAULT 0,
    successful_transactions INTEGER DEFAULT 0,
    disputed_transactions INTEGER DEFAULT 0,
    unique_counterparties INTEGER DEFAULT 0,
    
    -- Metadata
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_agents_trust_score ON agents(trust_score DESC);
CREATE INDEX idx_agents_type ON agents(agent_type);
```

### Transaction Events

```sql
CREATE TABLE transaction_events (
    id BIGSERIAL PRIMARY KEY,
    transaction_id TEXT NOT NULL,        -- AP2 transaction ID
    timestamp TIMESTAMPTZ NOT NULL,
    
    -- Participants
    buyer_agent_id TEXT NOT NULL REFERENCES agents(agent_id),
    seller_agent_id TEXT NOT NULL REFERENCES agents(agent_id),
    
    -- Transaction details
    amount_usd DECIMAL(15,2),
    category TEXT,
    
    -- Outcome
    outcome TEXT NOT NULL,               -- success, failed, disputed
    latency_ms INTEGER,
    
    -- AP2 integration
    ap2_mandate_hash TEXT,
    ap2_audit_hash TEXT,
    
    -- Signatures
    buyer_signature TEXT,
    seller_signature TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TimescaleDB hypertable for efficient time-series queries
SELECT create_hypertable('transaction_events', 'timestamp');

CREATE INDEX idx_tx_buyer ON transaction_events(buyer_agent_id, timestamp DESC);
CREATE INDEX idx_tx_seller ON transaction_events(seller_agent_id, timestamp DESC);
```

### Trust Score History

```sql
CREATE TABLE trust_score_history (
    agent_id TEXT NOT NULL REFERENCES agents(agent_id),
    timestamp TIMESTAMPTZ NOT NULL,
    
    trust_score DECIMAL(4,3) NOT NULL,
    
    -- Components for debugging
    components JSONB NOT NULL,
    /*
    {
        "completion_rate": 0.98,
        "dispute_rate": 0.001,
        "latency_score": 0.92,
        "volume_score": 0.85,
        "age_score": 0.75,
        "penalties": {
            "sybil_risk": 0.0,
            "velocity_anomaly": 0.0
        }
    }
    */
    
    PRIMARY KEY (agent_id, timestamp)
);

SELECT create_hypertable('trust_score_history', 'timestamp');
```

---

## API Specification

### OpenAPI 3.0

```yaml
openapi: 3.0.3
info:
  title: Agora Trust Layer API
  version: 1.0.0
  description: Trust scoring and verification for AP2 ecosystem

servers:
  - url: https://api.agora.network/v1

security:
  - ApiKeyAuth: []

paths:
  /trust/{agent_id}:
    get:
      summary: Get trust score for an agent
      parameters:
        - name: agent_id
          in: path
          required: true
          schema:
            type: string
          example: "did:web:merchant-a.com"
        - name: include_components
          in: query
          schema:
            type: boolean
            default: false
        - name: include_history
          in: query
          schema:
            type: boolean
            default: false
      responses:
        '200':
          description: Trust score retrieved
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TrustScore'
        '404':
          description: Agent not found
        '429':
          description: Rate limit exceeded

  /trust/batch:
    post:
      summary: Get trust scores for multiple agents
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                agents:
                  type: array
                  items:
                    type: string
                  maxItems: 100
                min_score:
                  type: number
                  minimum: 0
                  maximum: 1
                require_history:
                  type: boolean
      responses:
        '200':
          description: Batch results
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BatchTrustResult'

  /report:
    post:
      summary: Report transaction outcome
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TransactionReport'
      responses:
        '202':
          description: Report accepted
        '400':
          description: Invalid report

  /ap2/pre-mandate:
    post:
      summary: AP2 pre-mandate hook
      description: Called by AP2 before user signs Intent Mandate
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                merchant_agent_id:
                  type: string
                buyer_agent_id:
                  type: string
                transaction_category:
                  type: string
                estimated_amount:
                  type: number
      responses:
        '200':
          description: Trust assessment
          content:
            application/json:
              schema:
                type: object
                properties:
                  trust_score:
                    type: number
                  risk_level:
                    type: string
                    enum: [low, medium, high, critical]
                  recommendation:
                    type: string
                    enum: [proceed, caution, block]
                  warnings:
                    type: array
                    items:
                      type: string

components:
  schemas:
    TrustScore:
      type: object
      properties:
        agent_id:
          type: string
        trust_score:
          type: number
          minimum: 0
          maximum: 1
        confidence:
          type: string
          enum: [low, medium, high]
        transaction_count:
          type: integer
        last_updated:
          type: string
          format: date-time
        components:
          $ref: '#/components/schemas/TrustComponents'
        verification:
          $ref: '#/components/schemas/Verification'

    TrustComponents:
      type: object
      properties:
        completion_rate:
          type: number
        dispute_rate:
          type: number
        latency_score:
          type: number
        volume_score:
          type: number
        age_score:
          type: number

    Verification:
      type: object
      properties:
        proof_hash:
          type: string
        anchor_chain:
          type: string
        anchor_block:
          type: integer

    TransactionReport:
      type: object
      required:
        - transaction_id
        - counterparty
        - outcome
      properties:
        transaction_id:
          type: string
        counterparty:
          type: string
        outcome:
          type: string
          enum: [success, failed, disputed]
        metrics:
          type: object
          properties:
            latency_ms:
              type: integer
            amount_usd:
              type: number
        ap2_mandate_hash:
          type: string
        signature:
          type: string

  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: X-Agora-API-Key
```

---

## Infrastructure

### Cloud Architecture (GCP)

```yaml
# Terraform-style infrastructure
infrastructure:
  compute:
    api_servers:
      type: Cloud Run
      instances: 2-10 (autoscale)
      cpu: 2
      memory: 4Gi
      
    trust_engine:
      type: Cloud Run Jobs
      schedule: "*/5 * * * *"  # Every 5 minutes
      
    anti_gaming:
      type: Cloud Run Jobs
      schedule: "0 * * * *"  # Every hour

  database:
    primary:
      type: Cloud SQL (PostgreSQL 15)
      tier: db-custom-4-16384
      ha: true
      
    timeseries:
      type: TimescaleDB (Cloud SQL)
      tier: db-custom-2-8192
      
    cache:
      type: Memorystore (Redis)
      tier: 1GB

  blockchain:
    anchor:
      chain: Base L2
      contract: AgoraTrustAnchor
      frequency: hourly

  monitoring:
    - Cloud Monitoring
    - Cloud Logging
    - Error Reporting

  cdn:
    type: Cloud CDN
    backends:
      - Cloud Run API
```

### Estimated Infrastructure Costs

| Component | Monthly Cost |
|-----------|-------------|
| Cloud Run (API) | $200-500 |
| Cloud SQL (Primary) | $150 |
| Cloud SQL (TimescaleDB) | $100 |
| Redis | $50 |
| Blockchain gas | $50 |
| CDN/Networking | $50 |
| **Total** | **$600-900/month** |

---

## Security

### Authentication

```python
# API Key validation
async def validate_api_key(api_key: str) -> APIKeyData:
    # Check cache first
    cached = await redis.get(f"apikey:{hash(api_key)}")
    if cached:
        return APIKeyData.parse(cached)
    
    # Query database
    key_data = await db.execute(
        "SELECT * FROM api_keys WHERE key_hash = $1 AND active = true",
        hash(api_key)
    )
    
    if not key_data:
        raise HTTPException(401, "Invalid API key")
    
    # Cache for 5 minutes
    await redis.setex(f"apikey:{hash(api_key)}", 300, key_data.json())
    
    return key_data
```

### Report Validation

```python
async def validate_transaction_report(report: TransactionReport) -> bool:
    # 1. Verify signature
    if not verify_signature(
        message=report.transaction_id + report.counterparty + report.outcome,
        signature=report.signature,
        public_key=await resolve_did(report.reporter_agent_id)
    ):
        raise HTTPException(400, "Invalid signature")
    
    # 2. Verify AP2 mandate exists (optional, if provided)
    if report.ap2_mandate_hash:
        if not await verify_ap2_mandate(report.ap2_mandate_hash):
            raise HTTPException(400, "Invalid AP2 mandate")
    
    # 3. Check for duplicate
    existing = await db.execute(
        "SELECT 1 FROM transaction_events WHERE transaction_id = $1",
        report.transaction_id
    )
    if existing:
        raise HTTPException(409, "Transaction already reported")
    
    return True
```

---

## SDK

### TypeScript

```typescript
// @agora/trust-sdk

import { AgoraTrust } from '@agora/trust-sdk';

// Initialize
const agora = new AgoraTrust({
  apiKey: process.env.AGORA_API_KEY,
  environment: 'production', // or 'sandbox'
});

// Query trust score
const score = await agora.getTrustScore('did:web:merchant.com');
console.log(score.trust_score); // 0.94

// Batch query with filtering
const merchants = await agora.batchQuery({
  agents: ['did:web:a.com', 'did:web:b.com', 'did:web:c.com'],
  minScore: 0.8,
  requireHistory: true,
});
console.log(merchants.filtered); // ['did:web:a.com']

// Report transaction
await agora.report({
  transactionId: 'ap2-tx-123',
  counterparty: 'did:web:merchant.com',
  outcome: 'success',
  metrics: {
    latencyMs: 1200,
    amountUsd: 89.99,
  },
});

// AP2 Integration helper
const ap2Decision = await agora.preMandate({
  merchantAgentId: 'did:web:merchant.com',
  buyerAgentId: 'did:web:buyer.com',
  category: 'retail',
  estimatedAmount: 100,
});

if (ap2Decision.recommendation === 'proceed') {
  // Continue with AP2 mandate signing
}
```

### Python

```python
# agora-trust-sdk

from agora_trust import AgoraTrust

# Initialize
agora = AgoraTrust(api_key=os.environ["AGORA_API_KEY"])

# Query trust score
score = agora.get_trust_score("did:web:merchant.com")
print(score.trust_score)  # 0.94

# Batch query
result = agora.batch_query(
    agents=["did:web:a.com", "did:web:b.com"],
    min_score=0.8
)
print(result.filtered)  # ["did:web:a.com"]

# Report transaction
agora.report(
    transaction_id="ap2-tx-123",
    counterparty="did:web:merchant.com",
    outcome="success",
    latency_ms=1200
)

# LangChain integration
from agora_trust.integrations.langchain import AgoraTrustTool

trust_tool = AgoraTrustTool(client=agora)
# Use in LangChain agent
```
