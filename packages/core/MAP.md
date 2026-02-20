# Core Module Map

> Trust Engine — ядро системы доверия Agora

## Точки входа

- [`src/lib.rs`](src/lib.rs) — публичный API модуля

## Структура

```
packages/core/src/
├── lib.rs           # Re-exports
├── identity/
│   └── did.rs       # AgentDID (Ed25519)
├── trust/
│   ├── algorithm.rs # Trust score computation
│   ├── score.rs     # TrustScore types
│   ├── event.rs     # TrustEvent types
│   └── detection.rs # Anti-gaming detection
├── crypto/
│   └── merkle.rs    # Merkle tree implementation
└── zk/
    ├── types.rs     # ZK proof types
    ├── prover.rs    # Groth16 prover
    └── verifier.rs  # Proof verification
```

## Ключевые типы

| Type | File | Description |
|------|------|-------------|
| `AgentDID` | `identity/did.rs` | Decentralized identifier |
| `TrustScore` | `trust/score.rs` | Agent's trust score |
| `TrustEvent` | `trust/event.rs` | Interaction event |
| `MerkleTree` | `crypto/merkle.rs` | Cryptographic tree |

## Алгоритм доверия

Веса компонентов:

- 40% — История взаимодействий
- 25% — Верификация identity
- 15% — Длительность участия
- 15% — Network endorsements
- 5% — Штрафы (disputes)

## Anti-gaming детекция

- Velocity check (слишком быстрые действия)
- Sybil detection (множественные аккаунты)
- Uniform pattern (подозрительная однородность)
- Burst detection (всплески активности)

## Команды

```bash
# Запустить тесты
cargo test --package agora-core

# Проверить типы
cargo check --package agora-core
```

## Зависимости

- `ed25519-dalek` — криптография
- `sha2` — хэширование
- `serde` — сериализация
