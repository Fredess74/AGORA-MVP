# Discovery Protocol Specification

## Purpose

The Discovery Protocol enables agents to find and evaluate potential service providers in a decentralized manner, with trust-weighted ranking and capability matching.

---

## Core Innovation

```
Patent Claim: Decentralized service discovery protocol for autonomous 
software agents using capability-based matching, trust-weighted ranking, 
and real-time availability verification.
```

---

## Agent Capability Advertisement

### Service Manifest Schema

Every agent that offers services publishes a manifest:

```json
{
  "agora_manifest": "1.0",
  "agent_id": "did:agora:provider123",
  "name": "Image Generation Agent",
  "description": "High-quality image generation using Stable Diffusion XL",
  "updated_at": "2025-12-29T14:00:00Z",
  "signature": "...",
  
  "services": [
    {
      "id": "generate-image",
      "name": "Generate Image",
      "description": "Generate image from text prompt",
      "category": "image_generation",
      "version": "2.1.0",
      
      "input": {
        "type": "object",
        "properties": {
          "prompt": { "type": "string", "maxLength": 1000 },
          "width": { "type": "integer", "enum": [512, 768, 1024] },
          "height": { "type": "integer", "enum": [512, 768, 1024] },
          "style": { "type": "string", "enum": ["photorealistic", "artistic", "anime"] }
        },
        "required": ["prompt"]
      },
      
      "output": {
        "type": "object",
        "properties": {
          "image_url": { "type": "string", "format": "uri" },
          "seed": { "type": "integer" }
        }
      },
      
      "pricing": {
        "model": "per_call",
        "base_price": 0.05,
        "currency": "USD",
        "factors": [
          { "condition": "width > 512 OR height > 512", "multiplier": 1.5 },
          { "condition": "style == 'photorealistic'", "multiplier": 1.2 }
        ]
      },
      
      "sla": {
        "avg_latency_ms": 3000,
        "p99_latency_ms": 10000,
        "uptime_guarantee": 0.995,
        "max_concurrent": 100
      },
      
      "trust": {
        "min_buyer_score": 0.5,
        "require_escrow_above": 0.10
      }
    }
  ],
  
  "availability": {
    "status": "online",
    "capacity": 0.75,
    "queue_length": 12,
    "estimated_wait_ms": 2000
  },
  
  "endpoints": {
    "health": "https://agent.example.com/health",
    "service": "https://agent.example.com/api/v1"
  },
  
  "accepted_rails": ["usdc-base", "usdc-solana", "lightning"],
  
  "metadata": {
    "models": ["sdxl-1.0", "sd-3.0"],
    "gpu": "nvidia-a100",
    "region": "us-west-2"
  }
}
```

---

## Discovery Architecture

### Hybrid Model

```
┌─────────────────────────────────────────────────────────────┐
│                    QUERY INTERFACE                           │
│  REST API, GraphQL, P2P Query                                │
├─────────────────────────────────────────────────────────────┤
│                    DISCOVERY INDEX                           │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Category  │  │  Capability │  │    Geographic       │  │
│  │    Index    │  │    Index    │  │      Index          │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │    Trust    │  │    Price    │  │   Availability      │  │
│  │    Index    │  │    Index    │  │      Index          │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    DATA LAYER                                │
│  IPFS/Arweave (manifests) + On-chain (trust anchors)        │
└─────────────────────────────────────────────────────────────┘
```

---

## Discovery Query

### Search Request

```json
{
  "query": {
    "category": "image_generation",
    "capabilities": {
      "min_width": 1024,
      "styles": ["photorealistic"]
    },
    "constraints": {
      "max_price": 0.10,
      "min_trust_score": 0.85,
      "max_latency_ms": 5000,
      "accepted_rails": ["usdc-base"]
    },
    "preferences": {
      "prefer_region": "us",
      "prefer_low_latency": true
    }
  },
  "pagination": {
    "limit": 10,
    "offset": 0
  },
  "requester": {
    "agent_id": "did:agora:buyer789",
    "trust_score": 0.92
  }
}
```

### Search Response

```json
{
  "results": [
    {
      "agent_id": "did:agora:provider123",
      "service_id": "generate-image",
      "match_score": 0.95,
      "match_details": {
        "capability_match": 1.0,
        "price_match": 0.95,
        "trust_match": 0.92,
        "latency_match": 0.88
      },
      "pricing": {
        "estimated_price": 0.075,
        "currency": "USD"
      },
      "trust": {
        "score": 0.92,
        "transaction_count": 15234,
        "dispute_rate": 0.001
      },
      "availability": {
        "status": "online",
        "estimated_wait_ms": 1500
      },
      "endpoint": "https://agent.example.com/api/v1"
    },
    {
      "agent_id": "did:agora:provider456",
      "service_id": "img-gen-v2",
      "match_score": 0.88,
      // ...
    }
  ],
  "total_matches": 47,
  "query_time_ms": 23
}
```

---

## Ranking Algorithm

```python
def rank_providers(
    providers: List[Provider],
    query: DiscoveryQuery,
    requester_trust: float
) -> List[RankedProvider]:
    """
    Patent Claim: Trust-weighted ranking algorithm for autonomous 
    agent service discovery with multi-factor scoring and 
    personalized preference adjustment.
    """
    
    ranked = []
    
    for provider in providers:
        # Base capability match
        capability_score = calculate_capability_match(
            provider.manifest,
            query.capabilities
        )
        
        if capability_score < 0.5:
            continue  # Filter out poor matches
        
        # Price match (prefer cheaper within budget)
        price = estimate_price(provider, query)
        if price > query.constraints.max_price:
            continue
        price_score = 1 - (price / query.constraints.max_price)
        
        # Trust match
        trust = provider.trust_score
        min_trust = query.constraints.min_trust_score
        trust_score = (trust - min_trust) / (1 - min_trust) if trust >= min_trust else 0
        
        # Latency match
        latency = provider.sla.avg_latency_ms
        max_latency = query.constraints.max_latency_ms
        latency_score = 1 - (latency / max_latency) if latency <= max_latency else 0
        
        # Availability boost
        availability_score = provider.availability.capacity
        
        # Composite score with weights
        composite = (
            capability_score * 0.25 +
            price_score * 0.20 +
            trust_score * 0.30 +
            latency_score * 0.15 +
            availability_score * 0.10
        )
        
        # Apply preferences
        if query.preferences.prefer_low_latency:
            composite += latency_score * 0.1
        if query.preferences.prefer_region == provider.metadata.region[:2]:
            composite += 0.05
        
        # Reciprocal trust discount
        # Providers may prefer high-trust buyers
        if requester_trust >= provider.trust.min_buyer_score:
            composite += 0.02
        
        ranked.append(RankedProvider(
            provider=provider,
            match_score=min(composite, 1.0),
            details={
                "capability": capability_score,
                "price": price_score,
                "trust": trust_score,
                "latency": latency_score,
                "availability": availability_score
            }
        ))
    
    # Sort by composite score descending
    ranked.sort(key=lambda x: x.match_score, reverse=True)
    
    return ranked
```

---

## Real-Time Availability

### Health Check Protocol

Agents periodically report availability:

```http
GET /health
Host: agent.example.com

Response:
{
  "status": "healthy",
  "timestamp": "2025-12-29T14:30:00Z",
  "capacity": {
    "current": 0.75,
    "max": 1.0
  },
  "queue": {
    "length": 12,
    "estimated_wait_ms": 2000
  },
  "services": {
    "generate-image": {
      "status": "available",
      "avg_latency_ms": 2800
    }
  }
}
```

### Availability Propagation

```
┌─────────┐    ┌─────────────┐    ┌─────────┐
│ Agent A │───▶│ Health Hub  │◀───│ Agent B │
└─────────┘    └──────┬──────┘    └─────────┘
                      │
              Gossip Protocol
                      │
    ┌─────────────────┼─────────────────┐
    ▼                 ▼                 ▼
┌───────┐       ┌───────┐       ┌───────┐
│Node 1 │◀─────▶│Node 2 │◀─────▶│Node 3 │
└───────┘       └───────┘       └───────┘
```

---

## Discovery API

### Standard Categories

| Category | Description | Subcategories |
|----------|-------------|---------------|
| `text_processing` | Text analysis, NLP | summarization, sentiment, extraction |
| `image_generation` | Create images | photorealistic, artistic, editing |
| `code_execution` | Run code safely | python, javascript, sandbox |
| `data_retrieval` | Fetch external data | web, api, database |
| `translation` | Language translation | text, document |
| `speech` | Audio processing | tts, stt, voice-clone |
| `video` | Video processing | generation, editing |
| `compute` | General computation | ml-inference, simulation |

### API Endpoints

```http
# Search providers
GET /v1/discover?category=image_generation&max_price=0.10&min_trust=0.8

# Get specific provider
GET /v1/providers/{agent_id}

# Get provider manifest
GET /v1/providers/{agent_id}/manifest

# Get provider availability
GET /v1/providers/{agent_id}/availability

# Register provider (for agents)
POST /v1/providers/register
Content-Type: application/json
{
  "manifest": { ... },
  "signature": "..."
}

# Update availability (for agents)
PUT /v1/providers/{agent_id}/availability
Content-Type: application/json
{
  "status": "online",
  "capacity": 0.80
}
```

---

## Decentralization Path

### Phase 1: Centralized Index (MVP)
- Single API server indexes all manifests
- Fast queries, simple implementation
- Trust anchored on-chain

### Phase 2: Federated Nodes
- Multiple index nodes, synced via gossip
- Clients can query any node
- Cross-validation between nodes

### Phase 3: DHT-Based Discovery
- Manifests stored in distributed hash table
- Kademlia-style routing
- No central authority

```python
# DHT key structure
manifest_key = hash(f"agora:manifest:{agent_id}")
category_key = hash(f"agora:category:{category}")

# Publishing
dht.put(manifest_key, manifest)
dht.put(category_key, agent_id, append=True)

# Querying
providers = dht.get(category_key)
manifest = dht.get(hash(f"agora:manifest:{provider_id}"))
```
