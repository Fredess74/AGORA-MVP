# Agora TypeScript SDK

TypeScript/JavaScript SDK for the Agora Trust Protocol.

## Installation

```bash
npm install @agora/sdk
```

## Quick Start

```typescript
import { AgoraClient } from '@agora/sdk';

const client = new AgoraClient({
  baseUrl: 'https://api.agora.network',
  apiKey: 'your-api-key',
});

// Get trust score
const score = await client.getTrustScore('did:agora:agent:abc123');
console.log(`Trust: ${score.score} (${score.confidence})`);

// Batch query
const batch = await client.batchTrustQuery({
  agentIds: ['did:agora:agent:abc', 'did:agora:agent:xyz'],
});
```

## Agent Discovery

Find agents by capabilities and trust requirements:

```typescript
// Discover vision agents with high trust
const response = await client.discoverAgents({
  capability: 'vision.*',
  minTrust: 0.8,
  onlineOnly: true,
  limit: 10,
});

for (const agent of response.agents) {
  console.log(`${agent.did}: ${agent.capabilities.join(', ')}`);
}

// Batch discovery for multiple capabilities
const batch = await client.batchDiscover({
  capabilities: ['nlp.chat', 'vision.ocr', 'audio.transcription'],
  minTrust: 0.7,
  limitPerCap: 5,
});
```

## API Reference

### AgoraClient

**Core Methods:**

- `health()` - Check API health
- `ready()` - Check API readiness
- `registerAgent(request)` - Register new agent
- `getAgent(did)` - Get agent info
- `getTrustScore(agentId)` - Get trust score
- `batchTrustQuery(request)` - Batch trust query
- `reportEvent(request)` - Report interaction
- `listEvents(agentDid, options)` - List events

**Discovery Methods:**

- `discoverAgents(query)` - Find agents by capability/trust
- `batchDiscover(request)` - Multi-capability discovery
