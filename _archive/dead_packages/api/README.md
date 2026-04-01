# Agora Trust Protocol API

REST API server for the Agora Trust Protocol.

## Endpoints

### Health

- `GET /v1/health` - Health check
- `GET /v1/ready` - Readiness check

### Agents

- `POST /v1/agents` - Register new agent
- `GET /v1/agents/{did}` - Get agent info

### Trust

- `GET /v1/trust/{did}` - Get trust score
- `POST /v1/trust/batch` - Batch trust query

### Events

- `POST /v1/events` - Report interaction event
- `GET /v1/events/{agent_did}` - List events for agent

## Configuration

Environment variables:

- `AGORA_HOST` - Host (default: 0.0.0.0)
- `AGORA_PORT` - Port (default: 8080)
- `DATABASE_URL` - Database connection (optional for MVP)

## Running

```bash
cargo run --package agora-api
```

## Test API Key

For development: `agora_test_key_12345`
