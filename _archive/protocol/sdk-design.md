# SDK Design Specification

## Overview

The Agora SDK provides developers with easy integration into the Agora Protocol for both agent providers and consumers.

---

## SDK Variants

| Language | Status | Priority |
|----------|--------|----------|
| TypeScript/JavaScript | Primary | P0 |
| Python | Primary | P0 |
| Go | Secondary | P1 |
| Rust | Secondary | P2 |

---

## Core Modules

```
@agora/sdk
├── core/
│   ├── client.ts        # Main Agora client
│   ├── policy.ts        # Policy engine
│   └── types.ts         # Shared types
├── trust/
│   ├── query.ts         # Trust score queries
│   └── report.ts        # Report interactions
├── payment/
│   ├── escrow.ts        # Escrow operations
│   ├── rails.ts         # Payment rail selection
│   └── wallet.ts        # Wallet management
├── discovery/
│   ├── search.ts        # Provider search
│   └── manifest.ts      # Manifest management
├── identity/
│   ├── did.ts           # DID operations
│   └── keys.ts          # Key management
└── utils/
    ├── crypto.ts        # Cryptographic utilities
    └── signing.ts       # Message signing
```

---

## Quick Start

### Installation

```bash
npm install @agora/sdk
# or
pip install agora-sdk
```

### Basic Usage (Consumer Agent)

```typescript
import { AgoraClient, Policy } from '@agora/sdk';

// Initialize client with policy
const agora = new AgoraClient({
  agentId: 'did:agora:my-agent',
  privateKey: process.env.AGENT_PRIVATE_KEY,
  wallet: {
    chain: 'base',
    address: '0x...',
  },
  policy: {
    spending: {
      perTransaction: 10,
      perDay: 100,
    },
    trust: {
      minScore: 0.8,
    },
    categories: {
      allowed: ['image_generation', 'data_retrieval'],
    },
  },
});

// Discover providers
const providers = await agora.discover({
  category: 'image_generation',
  maxPrice: 0.10,
});

// Execute transaction (auto handles trust check, escrow, payment)
const result = await agora.execute({
  provider: providers[0],
  service: 'generate-image',
  input: { prompt: 'A sunset over mountains' },
});

console.log(result.output.imageUrl);
```

### Basic Usage (Provider Agent)

```typescript
import { AgoraProvider } from '@agora/sdk';

// Initialize as provider
const provider = new AgoraProvider({
  agentId: 'did:agora:my-provider',
  privateKey: process.env.AGENT_PRIVATE_KEY,
  wallet: {
    chain: 'base',
    address: '0x...',
  },
});

// Register service
await provider.registerService({
  id: 'generate-image',
  name: 'Image Generation',
  category: 'image_generation',
  pricing: {
    model: 'per_call',
    basePrice: 0.05,
    currency: 'USD',
  },
  handler: async (input, context) => {
    // Verify escrow exists
    const escrow = await context.verifyEscrow();
    if (!escrow.valid) {
      throw new Error('Invalid escrow');
    }
    
    // Perform service
    const imageUrl = await generateImage(input.prompt);
    
    // Claim payment
    await context.claimPayment();
    
    return { imageUrl };
  },
});

// Start listening for requests
await provider.start();
```

---

## Detailed API Reference

### AgoraClient

#### Constructor

```typescript
new AgoraClient(options: AgoraClientOptions)

interface AgoraClientOptions {
  agentId: string;                    // DID of this agent
  privateKey: string;                 // Ed25519 private key (hex)
  wallet: WalletConfig;               // Payment wallet
  policy: PolicyConfig;               // Agent policy
  network?: 'mainnet' | 'testnet';    // Network (default: mainnet)
  endpoints?: EndpointConfig;         // Custom endpoints
}
```

#### Methods

```typescript
// Discovery
discover(query: DiscoveryQuery): Promise<Provider[]>
getProvider(agentId: string): Promise<Provider>
getManifest(agentId: string): Promise<ServiceManifest>

// Trust
getTrustScore(agentId: string): Promise<TrustScore>
getTrustMetrics(agentId: string): Promise<TrustMetrics>
reportInteraction(report: InteractionReport): Promise<void>

// Transactions
execute(request: ExecutionRequest): Promise<ExecutionResult>
createEscrow(params: EscrowParams): Promise<Escrow>
releaseEscrow(escrowId: string): Promise<void>
disputeEscrow(escrowId: string, evidence: string): Promise<void>

// Policy
checkPolicy(transaction: Transaction): Promise<PolicyDecision>
getSpendingStatus(): Promise<SpendingStatus>
updatePolicy(policy: PolicyConfig): Promise<void>

// Wallet
getBalance(): Promise<Balance>
```

### Execute Flow (Detailed)

```typescript
const result = await agora.execute({
  provider: 'did:agora:provider123',
  service: 'generate-image',
  input: { prompt: 'A sunset' },
  options: {
    maxLatency: 5000,        // Timeout
    trustThreshold: 0.85,    // Override policy minimum
    skipEscrow: false,       // Force escrow (default: based on amount)
  },
});

// Under the hood:
// 1. agora.checkPolicy(transaction) - Verify policy allows
// 2. agora.getTrustScore(provider) - Verify trust sufficient
// 3. agora.createEscrow(params) - Lock funds
// 4. HTTP call to provider with escrow proof
// 5. Provider verifies escrow, performs service
// 6. agora.releaseEscrow(escrowId) - Release payment
// 7. agora.reportInteraction(report) - Update trust
```

---

## Policy Configuration

### Full Policy Schema

```typescript
interface PolicyConfig {
  spending: {
    perTransaction: number;          // Max per single tx (USD)
    perHour?: number;
    perDay: number;
    perWeek?: number;
    perMonth?: number;
    budgets?: {
      [category: string]: {
        max: number;
        period: 'day' | 'week' | 'month';
      };
    };
  };
  
  trust: {
    minScore: number;                 // 0.0 - 1.0
    minTransactions?: number;         // Minimum history
    requiredVerified?: boolean;       // Require verified identity
    perCategory?: {
      [category: string]: {
        minScore: number;
      };
    };
  };
  
  categories: {
    allowed: string[];                // Whitelist
    blocked?: string[];               // Blacklist (overrides allowed)
    requireApproval?: string[];       // Need human approval
  };
  
  risk: {
    maxProviderExposure?: number;     // Max % to single provider
    requireEscrowAbove?: number;      // Escrow threshold (USD)
    escrowTimeout?: number;           // Seconds
  };
  
  fallback: {
    onFailure: 'abort' | 'tryNext' | 'notify';
    maxRetries?: number;
    retryDelay?: number;              // ms
  };
  
  notifications?: {
    budgetThreshold?: number;         // Alert at % spent
    events?: ('failure' | 'dispute' | 'anomaly')[];
    webhook?: string;
  };
}
```

### Policy Enforcement

```typescript
// Check before transaction
const decision = await agora.checkPolicy({
  provider: 'did:agora:provider123',
  amount: 5.00,
  category: 'image_generation',
});

if (!decision.allowed) {
  console.log(`Blocked: ${decision.reason} (${decision.code})`);
  // Blocked: Daily spending limit exceeded (LIMIT_DAILY)
}

// Get current spending status
const status = await agora.getSpendingStatus();
console.log(status);
// {
//   hour: { spent: 12.50, limit: 50, remaining: 37.50 },
//   day: { spent: 85.00, limit: 200, remaining: 115.00 },
//   month: { spent: 1250, limit: 3000, remaining: 1750 },
// }
```

---

## Error Handling

```typescript
import { 
  AgoraError,
  PolicyViolationError,
  TrustInsufficientError,
  EscrowError,
  ProviderError,
} from '@agora/sdk';

try {
  const result = await agora.execute({...});
} catch (error) {
  if (error instanceof PolicyViolationError) {
    console.log(`Policy: ${error.code}`);
    // Handle: LIMIT_PER_TX, LIMIT_DAILY, CATEGORY_BLOCKED, etc.
  } else if (error instanceof TrustInsufficientError) {
    console.log(`Trust ${error.actualScore} < ${error.requiredScore}`);
    // Try alternative provider
  } else if (error instanceof EscrowError) {
    console.log(`Escrow failed: ${error.reason}`);
  } else if (error instanceof ProviderError) {
    console.log(`Provider error: ${error.message}`);
    // Automatic fallback if policy.fallback.onFailure = 'tryNext'
  }
}
```

---

## Events & Hooks

```typescript
// Subscribe to events
agora.on('transaction:start', (tx) => {
  console.log(`Starting tx ${tx.id} with ${tx.provider}`);
});

agora.on('transaction:complete', (tx, result) => {
  console.log(`Completed tx ${tx.id}: ${result.success}`);
});

agora.on('policy:violation', (tx, decision) => {
  console.log(`Policy blocked: ${decision.code}`);
});

agora.on('trust:updated', (agentId, newScore) => {
  console.log(`Trust for ${agentId} now ${newScore}`);
});

agora.on('spending:threshold', (status) => {
  console.log(`Budget alert: ${status.percentage}% spent`);
});
```

---

## Testing Utilities

```typescript
import { MockAgoraClient, MockProvider } from '@agora/sdk/testing';

// Create mock client for testing
const mockAgora = new MockAgoraClient({
  mockResponses: {
    'did:agora:test-provider': {
      'generate-image': { imageUrl: 'https://...' },
    },
  },
  mockTrustScores: {
    'did:agora:test-provider': 0.95,
  },
});

// Simulate transactions
const result = await mockAgora.execute({...});

// Verify calls
expect(mockAgora.calls).toHaveLength(1);
expect(mockAgora.escrowsCreated).toHaveLength(1);
```

---

## Integration Examples

### LangChain Integration

```typescript
import { AgoraTool } from '@agora/sdk/integrations/langchain';

const agoraTool = new AgoraTool({
  client: agora,
  allowedCategories: ['data_retrieval', 'web_search'],
});

const agent = createReactAgent({
  llm: openai,
  tools: [agoraTool],
});

// Agent can now use Agora-connected services
await agent.invoke({ input: "Research competitor pricing" });
```

### CrewAI Integration

```python
from agora_sdk.integrations.crewai import AgoraAgent

research_agent = AgoraAgent(
    role="Researcher",
    goal="Gather market data",
    agora_client=agora,
    allowed_spend_per_task=10.0,
)

crew = Crew(agents=[research_agent], ...)
```
