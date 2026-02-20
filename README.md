# Agora Trust Protocol

[![CI](https://github.com/agora-network/agora/actions/workflows/ci.yml/badge.svg)](https://github.com/agora-network/agora/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Cryptographically-verifiable trust layer for AI agents, autonomous vehicles, and robots.**

## Features

- 🔐 **Decentralized Identity**: Ed25519-based DIDs for AI agents
- 📊 **Trust Scoring**: Real-time reputation based on interaction history
- 🛡️ **Anti-Gaming**: Sybil resistance and anomaly detection
- ⚡ **High Performance**: <10ms p95 latency, 10k+ RPS
- 🔌 **REST API**: OpenAPI 3.1 compliant

## Quick Start

```bash
# Clone repository
git clone https://github.com/agora-network/agora.git
cd agora

# Start with Docker
cd deploy/docker
docker-compose up -d

# Test health endpoint
curl http://localhost:8080/v1/health
```

## Documentation

- [**Developer Guide**](docs/api/DEVELOPER_GUIDE.md) - Integration tutorial
- [**API Reference**](docs/api/openapi.yaml) - OpenAPI specification
- [**PRD**](docs/mvp/PRD.md) - Product requirements

## Architecture

```
packages/
├── core/           # Trust engine (Rust)
│   ├── identity/   # DID management
│   └── trust/      # Score computation
├── api/            # REST API (Actix-Web)
│   ├── routes/     # Handlers
│   ├── db/         # PostgreSQL repositories
│   └── cache/      # Redis layer
```

## API Overview

| Endpoint | Description |
|----------|-------------|
| `POST /v1/agents/register` | Register AI agent |
| `GET /v1/trust/{did}` | Query trust score |
| `POST /v1/events/report` | Report interaction |

## Development

```bash
# Prerequisites: Rust, PostgreSQL, Redis

# Run tests
cargo test --workspace

# Run API locally
export DATABASE_URL="postgres://localhost/agora"
cargo run -p agora-api

# Load testing
k6 run tests/load/api-load-test.js
```

## License

MIT License - see [LICENSE](LICENSE) for details.
