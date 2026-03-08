# Agora Trust Protocol - Developer Guide

Welcome to the Agora Trust Protocol! This guide will help you get started integrating trust-verified AI agents into your applications.

## Quick Start

### 1. Get an API Key

Contact the Agora team or self-provision via the API:

```bash
# For development, use the test key:
export AGORA_API_KEY="agora_test_key_12345"
```

### 2. Register Your Agent

```bash
curl -X POST http://localhost:8080/v1/agents/register \
  -H "Content-Type: application/json" \
  -H "X-Agora-Key: $AGORA_API_KEY" \
  -d '{
    "public_key": "your-ed25519-public-key-in-hex",
    "agent_type": "api",
    "metadata": {
      "name": "My AI Agent",
      "version": "1.0.0"
    }
  }'
```

Response:

```json
{
  "did": "did:agora:abc123def456...",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### 3. Query Trust Scores

```bash
curl http://localhost:8080/v1/trust/did:agora:abc123... \
  -H "X-Agora-Key: $AGORA_API_KEY"
```

Response:

```json
{
  "did": "did:agora:abc123...",
  "score": 0.85,
  "confidence": 0.92,
  "event_count": 150,
  "computed_at": "2024-01-15T10:30:00Z"
}
```

---

## Core Concepts

### Decentralized Identifiers (DIDs)

Every agent receives a unique DID in the format `did:agora:<hash>`. This identifier is:

- **Permanent**: Once assigned, it never changes
- **Verifiable**: Linked to the agent's public key
- **Portable**: Works across all Agora-enabled platforms

### Trust Scores

Trust scores range from 0.0 to 1.0:

| Score | Meaning |
|-------|---------|
| 0.0 - 0.3 | Low trust - proceed with caution |
| 0.3 - 0.6 | Medium trust - verify important operations |
| 0.6 - 0.8 | Good trust - reliable for most operations |
| 0.8 - 1.0 | High trust - well-established agent |

### Events

Events are the foundation of trust computation. Report interactions:

```bash
curl -X POST http://localhost:8080/v1/events/report \
  -H "Content-Type: application/json" \
  -H "X-Agora-Key: $AGORA_API_KEY" \
  -d '{
    "agent_did": "did:agora:your-agent...",
    "counterparty_did": "did:agora:other-agent...",
    "outcome": "success",
    "latency_ms": 150,
    "amount_cents": 500
  }'
```

---

## SDK Examples

### Python

```python
import requests

class AgoraClient:
    def __init__(self, api_key: str, base_url: str = "http://localhost:8080"):
        self.base_url = base_url
        self.headers = {
            "X-Agora-Key": api_key,
            "Content-Type": "application/json"
        }
    
    def get_trust_score(self, did: str) -> dict:
        response = requests.get(
            f"{self.base_url}/v1/trust/{did}",
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()
    
    def report_event(self, agent_did: str, counterparty_did: str, 
                     outcome: str, latency_ms: int = None) -> dict:
        payload = {
            "agent_did": agent_did,
            "counterparty_did": counterparty_did,
            "outcome": outcome
        }
        if latency_ms:
            payload["latency_ms"] = latency_ms
            
        response = requests.post(
            f"{self.base_url}/v1/events/report",
            headers=self.headers,
            json=payload
        )
        response.raise_for_status()
        return response.json()

# Usage
client = AgoraClient("agora_test_key_12345")
score = client.get_trust_score("did:agora:abc123...")
print(f"Trust: {score['score']:.2f} (confidence: {score['confidence']:.2f})")
```

### JavaScript/TypeScript

```typescript
class AgoraClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(apiKey: string, baseUrl = 'http://localhost:8080') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  private async request(path: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        'X-Agora-Key': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return response.json();
  }

  async getTrustScore(did: string) {
    return this.request(`/v1/trust/${did}`);
  }

  async reportEvent(agentDid: string, counterpartyDid: string, outcome: string) {
    return this.request('/v1/events/report', {
      method: 'POST',
      body: JSON.stringify({
        agent_did: agentDid,
        counterparty_did: counterpartyDid,
        outcome,
      }),
    });
  }
}

// Usage
const client = new AgoraClient('agora_test_key_12345');
const score = await client.getTrustScore('did:agora:abc123...');
console.log(`Trust: ${score.score.toFixed(2)}`);
```

---

## Running Locally

### Docker Compose (Recommended)

```bash
cd deploy/docker
docker-compose up -d

# API: http://localhost:8080
# Health check:
curl http://localhost:8080/v1/health
```

### From Source

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Start PostgreSQL and Redis
docker run -d --name agora-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:15
docker run -d --name agora-redis -p 6379:6379 redis:7

# Configure and run
export DATABASE_URL="postgres://postgres:postgres@localhost:5432/agora"
export REDIS_URL="redis://localhost:6379"

cargo run -p agora-api
```

---

## API Reference

Full OpenAPI specification: [`docs/api/openapi.yaml`](./openapi.yaml)

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/health` | Health check |
| POST | `/v1/agents/register` | Register agent |
| GET | `/v1/agents/{did}` | Get agent info |
| POST | `/v1/events/report` | Report event |
| GET | `/v1/events` | List events |
| GET | `/v1/trust/{did}` | Get trust score |
| POST | `/v1/trust/batch` | Batch trust query |
| GET | `/v1/metrics` | Prometheus metrics |

### Error Handling

All errors return a consistent format:

```json
{
  "error": "not_found",
  "message": "Agent with DID 'did:agora:...' not found"
}
```

Common error codes:

- `bad_request` (400)
- `unauthorized` (401)
- `not_found` (404)
- `conflict` (409)
- `rate_limited` (429)
- `internal_error` (500)

---

## Best Practices

1. **Cache Trust Scores**: Scores are stable over short periods. Cache for 1-5 minutes.
2. **Batch Queries**: Use `/v1/trust/batch` for multiple agents.
3. **Report All Interactions**: More data = better trust computation.
4. **Handle Rate Limits**: Implement exponential backoff on 429 responses.
5. **Verify DIDs**: Always validate DID format before API calls.

---

## Support

- **Documentation**: <https://docs.agora.network>
- **GitHub**: <https://github.com/agora-network/agora>
- **Discord**: <https://discord.gg/agora>
