# k6 Load Testing for Agora API

## Prerequisites

Install k6:

```bash
# Windows (winget)
winget install Grafana.k6

# macOS
brew install k6

# Linux
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update && sudo apt-get install k6
```

## Running Tests

### Start the API (Docker)

```bash
cd deploy/docker
docker-compose up -d
```

### Smoke Test (Quick Validation)

```bash
k6 run --vus 1 --iterations 1 tests/load/api-load-test.js
```

### Standard Load Test

```bash
k6 run tests/load/api-load-test.js
```

### High Load Test

```bash
k6 run --vus 100 --duration 5m tests/load/api-load-test.js
```

### Stress Test

```bash
k6 run --config tests/load/api-load-test.js -e STRESS=true
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `API_URL` | `http://localhost:8080` | API base URL |
| `API_KEY` | `agora_test_key_12345` | API authentication key |

## Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| p95 latency | <500ms | 95th percentile response time |
| Error rate | <1% | HTTP errors / total requests |
| Throughput | >1000 RPS | Requests per second at peak |

## Test Profiles

1. **Default**: Ramp from 10→100 VUs over 5 minutes
2. **Smoke**: Single request validation
3. **Stress**: Ramp to 300 VUs to find breaking point
4. **Spike**: Sudden burst to 500 VUs
