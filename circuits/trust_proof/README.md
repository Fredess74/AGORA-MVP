# Trust Proof Circuit

ZK (Zero-Knowledge) circuit for proving trust scores without revealing underlying data.

## Prerequisites

Install Circom 2.x:

```bash
npm install -g circom snarkjs
```

## Directory Structure

```
circuits/trust_proof/
├── circom.json           # Circom configuration
├── trust_main.circom     # Main circuit
├── lib/                  # Reusable components
│   ├── merkle.circom     # Merkle tree verification
│   ├── score.circom      # Score computation
│   └── comparators.circom # Comparison circuits
├── scripts/
│   ├── compile.sh        # Compile circuit
│   ├── setup.sh          # Trusted setup
│   └── prove.sh          # Generate proof
└── test/
    └── trust.test.js     # Circuit tests
```

## Build Commands

```bash
# Compile circuit
circom trust_main.circom --r1cs --wasm --sym -o build/

# Powers of Tau ceremony (dev only)
snarkjs powersoftau new bn128 14 pot14_0000.ptau
snarkjs powersoftau contribute pot14_0000.ptau pot14_final.ptau

# Generate zkey
snarkjs groth16 setup build/trust_main.r1cs pot14_final.ptau trust_0000.zkey

# Export verification key
snarkjs zkey export verificationkey trust_0000.zkey verification_key.json
```

## Circuit Overview

The circuit proves:

1. The prover knows events that hash to the public Merkle root
2. The trust score was correctly computed from those events
3. The score falls within the claimed range

Without revealing:

- Individual event details
- Counterparty identities
- Transaction amounts
