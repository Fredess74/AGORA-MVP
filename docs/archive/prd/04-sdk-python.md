# PRD: sdk-python — Python SDK

## Overview

| Field | Value |
|-------|-------|
| **Service** | sdk-python |
| **Type** | PyPI package |
| **Revenue** | Free (drives API usage) |
| **Owner** | Developer Experience |

---

## Features — Kano Analysis

### Must-Have (P0)

| Feature | Status |
|---------|--------|
| `AgoraClient` class | ✅ Done |
| Async support (httpx) | ✅ Done |
| Pydantic models | ✅ Done |
| Type hints | ✅ Done |

### Performance (P1)

| Feature | Status |
|---------|--------|
| `discover_agents()` | ❌ TODO |
| Connection pooling | ❌ TODO |
| Retry with backoff | ❌ TODO |

### Delighters (P2)

| Feature | Status |
|---------|--------|
| FastAPI middleware | ❌ TODO |
| Django integration | ❌ TODO |
| LangChain tool | ❌ TODO |

---

## Technical Spec

```python
class AgoraClient:
    async def register_agent(self, req: RegisterRequest) -> Agent
    async def get_trust_score(self, did: str) -> TrustScore
    async def report_event(self, event: TrustEvent) -> None
    async def discover_agents(self, query: DiscoveryQuery) -> list[Agent]
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| PyPI downloads/week | > 500 |
| Python versions | 3.10+ |
