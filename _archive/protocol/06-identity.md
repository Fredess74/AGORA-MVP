# Identity Specification (DID)

## Purpose

The Identity layer provides unique, verifiable identities for AI agents using Decentralized Identifiers (DIDs).

---

## DID Method: `did:agora`

### Format

```
did:agora:<network>:<identifier>

Examples:
did:agora:mainnet:Qm1234567890abcdef
did:agora:testnet:Qmabcdef1234567890
did:agora:local:0x1234...abcd
```

### DID Document

```json
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://agora.network/ns/v1"
  ],
  "id": "did:agora:mainnet:Qm1234567890abcdef",
  "created": "2025-01-15T10:00:00Z",
  "updated": "2025-12-29T14:00:00Z",
  
  "verificationMethod": [
    {
      "id": "did:agora:mainnet:Qm1234...#keys-1",
      "type": "Ed25519VerificationKey2020",
      "controller": "did:agora:mainnet:Qm1234...",
      "publicKeyMultibase": "z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"
    },
    {
      "id": "did:agora:mainnet:Qm1234...#keys-2",
      "type": "EcdsaSecp256k1VerificationKey2019",
      "controller": "did:agora:mainnet:Qm1234...",
      "publicKeyHex": "04ab..."
    }
  ],
  
  "authentication": ["did:agora:mainnet:Qm1234...#keys-1"],
  
  "assertionMethod": ["did:agora:mainnet:Qm1234...#keys-1"],
  
  "capabilityDelegation": ["did:agora:mainnet:Qm1234...#keys-2"],
  
  "service": [
    {
      "id": "did:agora:mainnet:Qm1234...#agora-endpoint",
      "type": "AgoraEndpoint",
      "serviceEndpoint": "https://agent.example.com/api/v1"
    },
    {
      "id": "did:agora:mainnet:Qm1234...#trust",
      "type": "AgoraTrust",
      "serviceEndpoint": "https://trust.agora.network/v1/agents/Qm1234..."
    }
  ],
  
  "agoraMetadata": {
    "type": "agent",
    "owner": "did:key:z6MkpTHR8VNs...",
    "wallet": {
      "chain": "base",
      "address": "0x1234...abcd"
    },
    "trustScore": 0.87,
    "registeredAt": "2025-01-15T10:00:00Z"
  }
}
```

---

## DID Operations

### Create (Register)

```http
POST /v1/identity/register
Content-Type: application/json

{
  "publicKey": "z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK",
  "keyType": "Ed25519",
  "owner": "did:key:z6MkpTHR8VNs...",
  "wallet": {
    "chain": "base",
    "address": "0x1234...abcd"
  },
  "endpoint": "https://agent.example.com/api/v1",
  "signature": "..."
}

Response:
{
  "did": "did:agora:mainnet:Qm1234567890abcdef",
  "didDocument": { ... },
  "transactionHash": "0xabc..."
}
```

### Resolve

```http
GET /v1/identity/resolve/did:agora:mainnet:Qm1234567890abcdef

Response:
{
  "didDocument": { ... },
  "didDocumentMetadata": {
    "created": "2025-01-15T10:00:00Z",
    "updated": "2025-12-29T14:00:00Z",
    "deactivated": false
  },
  "didResolutionMetadata": {
    "contentType": "application/did+json"
  }
}
```

### Update

```http
PUT /v1/identity/update
Content-Type: application/json

{
  "did": "did:agora:mainnet:Qm1234567890abcdef",
  "updates": {
    "addService": {
      "id": "did:agora:mainnet:Qm1234...#new-service",
      "type": "CustomService",
      "serviceEndpoint": "https://..."
    }
  },
  "signature": "..."  // Signed by current authentication key
}
```

### Deactivate

```http
POST /v1/identity/deactivate
Content-Type: application/json

{
  "did": "did:agora:mainnet:Qm1234567890abcdef",
  "reason": "Agent retired",
  "signature": "..."  // Signed by owner
}
```

---

## Key Management

### Key Types

| Purpose | Algorithm | Usage |
|---------|-----------|-------|
| `authentication` | Ed25519 | Prove agent identity |
| `assertion` | Ed25519 | Sign messages/transactions |
| `wallet` | secp256k1 | Ethereum-compatible payments |
| `delegation` | Ed25519 | Delegate capabilities |

### Key Rotation

```python
def rotate_key(agent: Agent, new_key: PublicKey, owner_signature: bytes):
    """
    Rotate an agent's authentication key.
    Requires owner signature for security.
    """
    # Verify owner authorized this
    owner_did = resolve_did(agent.owner)
    if not verify_signature(
        message=hash(agent.did, new_key),
        signature=owner_signature,
        public_key=owner_did.authentication_key
    ):
        raise UnauthorizedError("Invalid owner signature")
    
    # Update DID document
    agent.did_document.add_verification_method(new_key)
    agent.did_document.remove_verification_method(agent.current_key)
    
    # Anchor update on-chain
    anchor_did_update(agent.did_document)
```

---

## Verification

### Verifying Agent Identity

```python
def verify_agent_message(
    message: bytes,
    signature: bytes,
    claimed_did: str
) -> bool:
    """Verify a message was signed by the claimed agent."""
    
    # 1. Resolve DID
    did_document = resolve_did(claimed_did)
    
    # 2. Get authentication key
    auth_key = did_document.get_authentication_key()
    
    # 3. Verify signature
    return verify_signature(
        message=message,
        signature=signature,
        public_key=auth_key
    )
```

### Verifying Owner Authorization

```python
def verify_owner_authorization(agent_did: str, action: str) -> bool:
    """Verify the agent's owner authorized an action."""
    
    # 1. Resolve agent DID
    agent_doc = resolve_did(agent_did)
    
    # 2. Get owner DID
    owner_did = agent_doc.agora_metadata.owner
    
    # 3. Resolve owner
    owner_doc = resolve_did(owner_did)
    
    # 4. Check capability delegation
    return owner_doc.has_delegated(action, to=agent_did)
```

---

## On-Chain Anchoring

### Registry Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AgoraIdentityRegistry {
    
    struct Identity {
        bytes32 didHash;
        bytes32 documentHash;  // IPFS CID hash
        address owner;
        uint256 createdAt;
        uint256 updatedAt;
        bool active;
    }
    
    mapping(bytes32 => Identity) public identities;
    
    event IdentityCreated(bytes32 indexed didHash, address owner);
    event IdentityUpdated(bytes32 indexed didHash, bytes32 newDocumentHash);
    event IdentityDeactivated(bytes32 indexed didHash);
    
    function register(
        bytes32 didHash,
        bytes32 documentHash
    ) external {
        require(identities[didHash].owner == address(0), "Already exists");
        
        identities[didHash] = Identity({
            didHash: didHash,
            documentHash: documentHash,
            owner: msg.sender,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            active: true
        });
        
        emit IdentityCreated(didHash, msg.sender);
    }
    
    function update(
        bytes32 didHash,
        bytes32 newDocumentHash
    ) external {
        require(identities[didHash].owner == msg.sender, "Not owner");
        require(identities[didHash].active, "Deactivated");
        
        identities[didHash].documentHash = newDocumentHash;
        identities[didHash].updatedAt = block.timestamp;
        
        emit IdentityUpdated(didHash, newDocumentHash);
    }
    
    function deactivate(bytes32 didHash) external {
        require(identities[didHash].owner == msg.sender, "Not owner");
        
        identities[didHash].active = false;
        
        emit IdentityDeactivated(didHash);
    }
    
    function resolve(bytes32 didHash) external view returns (
        bytes32 documentHash,
        address owner,
        bool active
    ) {
        Identity storage id = identities[didHash];
        return (id.documentHash, id.owner, id.active);
    }
}
```

---

## Security Considerations

### Replay Attack Prevention

All signed messages include:
- Timestamp (valid for 5 minutes)
- Nonce (unique per message)
- Chain ID (prevent cross-chain replay)

### Key Compromise Recovery

If an agent key is compromised:
1. Owner uses their key to deactivate agent
2. Create new agent with new keys
3. Trust history can be linked (with owner signature proving continuity)

### Sybil Resistance

Preventing mass fake identity creation:
- Registration requires small fee (anti-spam)
- Wait period before trust accumulates
- Owner verification for high-trust operations
