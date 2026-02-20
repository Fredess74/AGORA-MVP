# API Module Map

> REST API сервер — Actix-web интерфейс к Trust Engine

## Точка входа

- [`src/main.rs`](src/main.rs) — запуск сервера

## Структура

```
packages/api/src/
├── main.rs           # Server startup
├── config.rs         # Configuration
├── state.rs          # App state
├── error.rs          # Error handling (RFC 7807)
├── cache.rs          # Redis caching
├── metrics.rs        # Prometheus metrics
├── routes/           # API endpoints
│   ├── health.rs     # GET /v1/health
│   ├── agents.rs     # POST /v1/agents/register
│   ├── trust.rs      # GET /v1/trust/{did}
│   └── events.rs     # POST /v1/events/report
├── handlers/         # Request handlers
├── middleware/       # Auth, rate limiting
├── db/               # PostgreSQL repositories
├── models/           # Request/Response types
└── integrations/     # A2A, AP2, x402
```

## Эндпоинты

| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/health` | Health check |
| POST | `/v1/agents/register` | Register agent |
| GET | `/v1/trust/{did}` | Get trust score |
| POST | `/v1/events/report` | Report interaction |
| GET | `/v1/proofs/{did}` | Get ZK proof |

## Интеграции

- `integrations/a2a.rs` — Google A2A protocol
- `integrations/ap2.rs` — Agent Payment Protocol
- `integrations/x402.rs` — Micropayments (HTTP 402)

## Конфигурация

Env переменные:

```
DATABASE_URL=postgres://localhost/agora
REDIS_URL=redis://localhost
API_PORT=8080
```

## Команды

```bash
# Запустить сервер
cargo run --package agora-api

# Тесты
cargo test --package agora-api

# С Docker
cd deploy/docker && docker-compose up -d
```
