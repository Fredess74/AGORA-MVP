<!--
purpose: Deep Research — Verifiable AI Execution + Mechanism Design for Decentralized AI Economy
author: Founder (manual deep research via Gemini/NotebookLM)
date: 2026-03-29
status: Research complete, integration in progress
-->

# Verifiable AI Execution: Гибридная криптографическая архитектура для децентрализованной экономики AGI

## Аннотация

Переход к децентрализованной экономике автономных агентов искусственного интеллекта (AGI Economy) требует создания надежных криптографических механизмов верификации вычислений. В условиях, когда автономные агенты оперируют собственными криптовалютными кошельками и взаимодействуют в формате "машина-машина", возникает фундаментальная проблема: как клиент может быть уверен, что провайдер не подменил модель на более дешёвую (Model Downgrade Attack)?

Данное исследование представляет:
1. **ZK-MCP Protocol** — расширение Model Context Protocol для встраивания ZK-доказательств
2. **Гибридная архитектура zkML/opML/TEE** — три уровня верификации
3. **Mechanism Design** — экономические стимулы через BTS/VCG/Slashing
4. **Intent-Based Swarm Routing** — маршрутизация в гиперболическом пространстве

---

## Часть I: Проблема верификации в AI экономике

### Model Downgrade Attack

Провайдер заявляет использование GPT-4-Turbo (стоимость $0.06/1K токенов), но фактически запускает GPT-3.5-Turbo ($0.002/1K токенов), присваивая маржу 97%.

**Формальная постановка:**
- Пусть M* — заявленная модель, M' — фактически используемая
- Profit_fraud = (Price(M*) - Cost(M')) × Volume
- Detection_probability_current ≈ 0 (no verification)

### "Verifiability Trilemma"

Невозможно одновременно достичь:
1. **Полная верификация** (ZK-proof каждого inference)
2. **Низкая задержка** (<100ms overhead)
3. **Низкая стоимость** (<$0.01 per verification)

**Agora решает** через гибридную архитектуру: TEE (default) + opML (disputes) + zkML (critical).

---

## Часть II: Криптографические примитивы

### 1. zkML — Zero-Knowledge Machine Learning

#### Арифметизация Attention (zkAttn)

```
Attention(Q, K, V) = softmax(QK^T / √d_k) · V
```

ZK-арифметизация: каждая операция транслируется в систему полиномиальных ограничений (R1CS/AIR).

**Сложность:** T_prove ≈ O(k · N log N), где N — размер модели, k — num_constraints per parameter.

Для LLM 70B: T_prove ≈ 45-180 минут. **Непрактично для real-time.**

#### KZG Polynomial Commitments (Model Binding)

```
C(f) = [f(τ)]₁ = Σ aᵢ · [τⁱ]₁
```

Где τ — trusted setup toxic waste, [·]₁ — группа эллиптической кривой.

**Свойства:**
- Proof size: 48 bytes (single G₁ element)
- Verification: O(1) — одна pairing operation
- Binding: computational (CDH assumption)
- Hiding: perfect (uniform in G₁)

**Применение в Agora:** Model Registry → KZG commitment → PCR binding = **PoEA (Proof of Efficient Attribution)**.

#### FRI (Fast Reed-Solomon IOP) — альтернатива KZG

```
Prover: split f(x) → f_even(x²) + x·f_odd(x²)
Verifier: random challenge β → check f_fold(x) = f_even(x) + β·f_odd(x)
```

**Свойства:**
- Transparent setup (no trusted ceremony)
- Post-quantum secure
- Proof size: O(log²n) — larger than KZG
- Verification: O(log²n) — slower than KZG

### 2. opML — Optimistic Machine Learning

#### Bisection Protocol

Если возникает спор о результате inference:

```
1. Challenger подаёт dispute bond D
2. Provider и Challenger играют в "bisection game":
   - Каждый раунд делит вычисление пополам
   - После O(log N) раундов: спор сводится к ОДНОЙ операции
3. Единственная операция верифицируется on-chain
4. Проигравший теряет deposit D
```

**Finality:**
- Optimistic: immediate (если нет спора)
- Disputed: O(log N) раундов × round_time
- Для GPT-4: ~20 раундов bisection

**AnyTrust Assumption:** Достаточно 1 честного наблюдателя.

### 3. TEE — Trusted Execution Environments

#### Remote Attestation Flow

```
1. Provider запускает inference в SGX/TDX enclave
2. Enclave генерирует attestation report:
   - MRENCLAVE (hash кода)
   - MRSIGNER (hash подписи разработчика)
   - PCR values (Platform Configuration Registers)
   - Report data (custom: model_hash + input_hash + output_hash)
3. Client верифицирует attestation через Intel/AMD attestation service
4. Verification time: <1 second
```

**Overhead:** <10% latency, <5% compute.

**Ограничения:**
- Single point of trust (Intel/AMD)
- Side-channel attacks (Spectre, Foreshadow)
- Enclave memory limits (~256MB EPC for SGX)

---

## Часть III: Гибридная архитектура верификации Agora

### Traffic Light Architecture

```
         ┌─────────────────────────────────────────┐
         │           Client Request                  │
         │  {model: "gpt-4", task: "translate"}     │
         └────────────────┬──────────────────────────┘
                          │
                    ┌─────▼─────┐
                    │ Risk Tier │
                    │ Classifier│
                    └─────┬─────┘
                          │
         ┌────────────────┼─────────────────┐
         │                │                  │
    ┌────▼────┐     ┌────▼────┐       ┌────▼────┐
    │ 🟢 LOW  │     │ 🟡 MED  │       │ 🔴 HIGH │
    │ TEE only│     │ TEE +   │       │ Full    │
    │ <10% OH │     │ Spot-ZK │       │ zkML    │
    │ $0.001  │     │ <25% OH │       │ >100% OH│
    │         │     │ $0.01   │       │ $0.10+  │
    └─────────┘     └─────────┘       └─────────┘
    
    Routing: 85%         12%               3%
```

### Stochastic ZK-Spot-Checks

Вместо верификации каждого inference — вероятностная проверка:

```
P(spot_check) = ρ = 0.05 (5% запросов)
Expected cost per query = ρ × C_zk = 0.05 × $1.40 = $0.07
Detection probability after K queries:
  P(detect_fraud | K queries) = 1 - (1-ρ)^K
  K=13: P > 50%
  K=45: P > 90%
  K=90: P > 99%
```

### PoEA — Proof of Efficient Attribution

Привязка между заявленной моделью и фактически используемой:

```
1. Model Registry: hash(model_weights) → model_id
2. TEE attestation: PCR[model_id] → enclave report
3. ZK-proof: prove(model_id ∈ Registry) without revealing weights
4. Result: cryptographic guarantee that model_id was used
```

---

## Часть IV: Mechanism Design для децентрализованной AI экономики

### 1. Bayesian Truth Serum (BTS) для P2P аудита

Классическая проблема: если аудитор получает вознаграждение за "правильный" ответ, все отвечают одинаково (herding). BTS решает это через **"surprising popularity"**:

```
Score_i = log(x_i / ȳ_i)
```

Где:
- x_i — доля аудиторов с ответом i
- ȳ_i — среднее предсказание аудиторов о доле ответа i

**Свойство:** Honest reporting = строго доминирующая стратегия (SPNE).

**Применение в Agora:**
- Peer Review компонент Trust Score
- Аудиторы оценивают качество выполнения
- BTS гарантирует: врать нерентабельно даже в collusion

#### Modified BTS для Agora:

```
R_auditor = max(0, log(x / ȳ) × τ_auditor × quality_weight)
```

Где:
- τ_auditor — trust score самого аудитора (репутация)
- quality_weight — вес, основанный на глубине аудита (поверхностный/глубокий)

### 2. Нелинейный Slashing (Anti-Sybil)

Стандартный линейный slashing (потеря пропорциональна stake) не останавливает Sybil — злоумышленник создаёт N идентичностей с малым stake.

**Нелинейная формула:**

```
Φ_v(x) = S_v · (k · C/S_total)^γ
```

Где:
- S_v — stake валидатора v
- C — общая сумма correlated failures
- S_total — общий stake всех валидаторов
- k — scaling constant (k=2 recommended)
- γ — superlinear exponent (γ=1.5 recommended)

**Свойство:** При C/S_total → 1 (все fail = coordinated attack), penalty → superlinear.

**Пример:**
- 1 одинокий failure (C/S_total = 0.01): Φ = S × 0.028 (2.8%)
- Coordinated 20% failure: Φ = S × 0.179 (17.9%)
- Coordinated 50% failure: Φ = S × 0.707 (70.7%)

**Anti-correlation:**
```
penalty_i = base_penalty × (1 + β × correlation_with_others)
```

Sybil identities correlate → penalty amplifies → экономически нерентабельно.

### 3. VCG Auction для API Routing

Provably incentive-compatible mechanism для распределения API запросов:

```
Allocation: x* = argmax Σ vᵢ(x)
Payment: pᵢ = Σⱼ≠ᵢ vⱼ(x*₋ᵢ) - Σⱼ≠ᵢ vⱼ(x*)
```

**Свойства:**
- DSIC (Dominant Strategy Incentive Compatible): агенты не могут повысить utility через ложные заявления
- Allocative efficiency: максимизирует social welfare
- Individual rationality: участие ≥ неучастие

**Применение в Agora:**
- Bid = f(trust_score, capability, latency, price)
- Allocation = лучший агент для конкретного запроса
- Payment = VCG externality price ("сколько ты стоил другим")

### 4. EigenTrust — почему НЕ работает для AI агентов

EigenTrust (PageRank для trust) уязвим к:
1. **Swarm Collusion**: группа агентов взаимно повышает рейтинги
2. **Pre-trust exploitation**: bootstrapped identity → accumulate trust → attack
3. **Convergence attacks**: манипуляция eigenvalue через стратегические транзакции

**Критическое отличие от Web:** В web PageRank работает потому что creating links is costly (build website). В AI создание нового агента — бесплатно.

**Решение Agora:** BTS + Nonlinear Slashing + Stake >> EigenTrust.

---

## Часть V: Intent-Based Swarm Routing

### 1. Poincaré Ball Embeddings

Евклидово пространство неэффективно для иерархий (дерево навыков):

```
Euclidean: volume grows polynomially → information loss
Hyperbolic: volume grows exponentially → preserves hierarchy
```

**Poincaré Ball Model:**
```
d_P(u, v) = arcosh(1 + 2·||u-v||² / ((1-||u||²)(1-||v||²)))
```

**Свойства:**
- 2-5 dim hyperbolic > 100 dim euclidean для иерархий
- Корневые узлы (общие навыки) → центр
- Листья (специализации) → край
- Расстояние растёт экспоненциально к краю

### 2. Trust-Weighted Poincaré Distance

Объединение trust + similarity в одну метрику:

```
d_TWP(u, v) = (1 / √(τ_u · τ_v)) · arcosh(1 + 2·||u-v||² / ((1-||u||²)(1-||v||²)))
```

Где τ_u, τ_v — trust scores.

**Свойство:** Высокий trust "сжимает" расстояние → trusted agents кажутся "ближе".

### 3. GAT для декомпозиции интентов

Graph Attention Networks для DAG-сборки multi-agent pipelines:

```
α_ij = softmax(LeakyReLU(a^T [W·h_i || W·h_j]))
h'_i = σ(Σ_j α_ij · W · h_j)
```

### 4. MDP для оптимальных цепочек агентов

```
V*(s) = max_a [R(s,a) + γ Σ P(s'|s,a) V*(s')]
```

Bellman optimality equation для routing.

### 5. Каскадная энтропия — "The 95% Trap"

```
P_success(chain) = ∏ pᵢ · exp(-Σ H_cascade(i))
```

Где H_cascade — энтропия на каждом шаге цепочки.

**Пример:** 5 агентов по 95% → 0.95⁵ = 77%. "The 95% Trap."

---

## Часть VI: FHE Blind Matching (CKKS)

Гомоморфное шифрование для приватности интентов:

```
enc(v₁) ⊗ enc(v₂) = enc(⟨v₁, v₂⟩)   // cosine similarity on encrypted vectors
```

**Overhead:** C_FHE/mult ≈ 10³ × C_plaintext. Пока непрактично для MVP.

---

## Применимость к текущей архитектуре Agora

| Компонент | Фаза | Зависимости |
|-----------|------|-------------|
| TEE Remote Attestation | Phase 2 | Cloud provider TEE support |
| BTS P2P Audit | Phase 2 | >100 transactions/day |
| Poincaré Embeddings | Phase 2 | pgvector alternative |
| VCG Routing | Phase 2 | Discovery engine redesign |
| Trust-Weighted Poincaré | Phase 2 | Poincaré + Trust integration |
| Cascading Entropy monitor | Phase 2 | Pipeline instrumentation |
| Nonlinear Slashing | Phase 2-3 | Staking mechanism |
| opML Bisection | Phase 3 | Smart contract integration |
| Stochastic ZK-Spot-Checks | Phase 3 | zkML infrastructure |
| PoEA | Phase 3 | Model Registry + TEE |
| KZG/FRI Commitments | Phase 3 | Cryptographic library |
| Full zkML | Phase 4+ | Enormous compute |
| FHE Blind Matching | Phase 4+ | FHE library performance |
| GAT Intent Decomposition | Phase 3 | Large agent network |
| MDP Chain Optimization | Phase 3 | Agent network scale |
