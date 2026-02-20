# Agora Python SDK

Python SDK for the Agora Trust Protocol.

## Installation

```bash
pip install agora-sdk
```

## Quick Start

```python
import asyncio
from agora_sdk import AgoraClient, AgoraConfig

async def main():
    config = AgoraConfig(
        base_url="https://api.agora.network",
        api_key="your-api-key",
    )

    async with AgoraClient(config) as client:
        # Get trust score
        score = await client.get_trust_score("did:agora:agent:abc123")
        print(f"Trust: {score.score} ({score.confidence})")

        # Batch query
        from agora_sdk import BatchTrustRequest
        batch = await client.batch_trust_query(
            BatchTrustRequest(agent_ids=["did:agora:agent:abc", "did:agora:agent:xyz"])
        )

asyncio.run(main())
```

## Agent Discovery

Find agents by capabilities and trust requirements:

```python
from agora_sdk.types import DiscoveryQuery

# Discover vision agents with high trust
query = DiscoveryQuery(
    capability="vision.*",
    min_trust=0.8,
    online_only=True,
    limit=10
)
response = await client.discover_agents(query)

for agent in response.agents:
    print(f"{agent.did}: {', '.join(agent.capabilities)}")

# Batch discovery for multiple capabilities
from agora_sdk.types import BatchDiscoveryRequest
batch = await client.batch_discover(
    BatchDiscoveryRequest(
        capabilities=["nlp.chat", "vision.ocr"],
        min_trust=0.7,
        limit_per_cap=5
    )
)
```

## API Reference

### AgoraClient

**Core Methods:**

- `health()` - Check API health
- `ready()` - Check API readiness
- `register_agent(request)` - Register new agent
- `get_agent(did)` - Get agent info
- `get_trust_score(agent_id)` - Get trust score
- `batch_trust_query(request)` - Batch trust query
- `report_event(request)` - Report interaction
- `list_events(agent_did, offset, limit)` - List events

**Discovery Methods:**

- `discover_agents(query)` - Find agents by capability/trust
- `batch_discover(request)` - Multi-capability discovery
