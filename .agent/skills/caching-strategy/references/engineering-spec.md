# Caching Strategy — Engineering Specification

> Production-grade specification for multi-layer caching architecture and decision-making at FAANG scale.

---

## 1. Overview

Caching Strategy provides structured decision frameworks for multi-layer cache architecture: layer selection (browser, CDN, application, database), technology selection (Redis, Memcached, service workers), invalidation strategies (TTL, write-through, event-driven, tag-based, versioned keys), and cache key design. The skill operates as an expert knowledge base that produces architectural decisions and configuration guidance, not cache implementation code.

The skill covers 5 cache layers (browser → service worker → CDN → application → database query) and 5 invalidation strategies, with 4 reference files covering Redis, CDN, browser caching, and application-level caching.

---

## 2. Problem Statement

Caching at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Wrong cache layer selection | CDN used for per-user data; browser cache skipped for static assets | 2–10x unnecessary latency |
| Missing invalidation strategy | No proactive invalidation in 50%+ of cache implementations | Stale data served to users, cache coherence failures |
| Thundering herd on cache miss | 1000+ concurrent requests to origin on single key expiry | Origin overload, cascading failure |
| Unbounded cache growth | No TTL or eviction policy in 30% of Redis deployments | Memory exhaustion, OOM crashes |

Caching Strategy eliminates these by providing context-aware decision trees that produce documented, layer-appropriate caching architectures with explicit invalidation plans.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Context-aware layer selection | Decision tree selects cache layer based on ≤ 4 input criteria (data type, audience, volatility, consistency) |
| G2 | Invalidation-first design | Every cache recommendation includes explicit invalidation strategy before TTL values |
| G3 | Cache hit rate targeting | All recommendations target ≥ 80% hit rate with measurable verification method |
| G4 | Thundering herd prevention | Every multi-instance cache design includes stampede protection (locks or stale-while-revalidate) |
| G5 | Key determinism | Cache key construction is deterministic: same input parameters = same key |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | Cache implementation code | This skill produces architecture decisions; implementation is the agent's responsibility |
| NG2 | Redis/Memcached operations | Infrastructure provisioning owned by `server-ops` |
| NG3 | CDN provider configuration | Provider-specific setup is deployment concern |
| NG4 | Performance benchmarking | Owned by `perf-optimizer` skill |
| NG5 | API response format design | Owned by `api-architect` skill (Cache-Control headers) |
| NG6 | Event bus implementation | Owned by `event-driven` skill |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Cache layer selection | 5-layer decision tree | Layer implementation |
| Invalidation strategy | TTL/write-through/event/tag/versioned key selection | Event bus implementation (→ event-driven) |
| Cache key design | Key structure, uniqueness rules | Key storage backend |
| TTL assignment | Data-volatility-based TTL rules | TTL enforcement in cache backend |
| Thundering herd prevention | Strategy selection (locks, SWR) | Lock implementation |
| PII caching guidance | Encryption requirement awareness | Encryption implementation (→ security-scanner) |

**Side-effect boundary:** Caching Strategy produces architectural decisions and configuration guidance. It does not create caches, modify configurations, or connect to cache backends.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string       # One of: "layer-selection" | "invalidation-design" | "key-design" |
                           #         "ttl-assignment" | "thundering-herd" | "full-architecture"
Context: {
  data_type: string        # "static-asset" | "api-response" | "db-query" | "computed" | "session"
  audience: string         # "global" | "regional" | "per-user" | "per-request"
  volatility: string       # "immutable" | "hourly" | "minutely" | "real-time"
  consistency: string      # "eventual" | "read-after-write" | "strong"
  scale: string            # "single-instance" | "multi-instance" | "distributed"
  existing_cache: string | null  # Current cache setup if migrating
  constraints: Array<string> | null  # ["no-redis", "edge-only", "offline-required"]
}
contract_version: string   # "2.0.0"
```

#### Output Schema

```
Status: "success" | "error"
Data: {
  layer: string             # Selected cache layer
  technology: string        # Recommended technology (Redis, CDN, etc.)
  invalidation: {
    strategy: string        # TTL | write-through | event-driven | tag-based | versioned
    trigger: string         # What triggers invalidation
    propagation: string     # How invalidation spreads (immediate | eventual | scheduled)
  }
  ttl: {
    value: string           # e.g., "300s", "24h", "immutable"
    rationale: string       # Why this TTL for this data type
  }
  key_pattern: string       # e.g., "user:{userId}:profile:v{version}"
  stampede_protection: string | null  # Lock strategy or SWR config
  monitoring: {
    hit_rate_target: string # e.g., "≥80%"
    metrics: Array<string>  # Metrics to track
  }
  reference_file: string    # Path to detailed reference
  checklist: Array<string>  # Action items
  anti_patterns: Array<string>
  metadata: {
    version: string
    context_hash: string
    contract_version: string    # "2.0.0"
    backward_compatibility: string  # "breaking"
  }
}
Error: ErrorSchema | null
```

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None — new spec for first hardening

#### Error Schema

```
Code: string         # From Error Taxonomy (Section 11)
Message: string      # Human-readable, single line
Request_Type: string
Recoverable: boolean
```

#### Deterministic Guarantees

- Same `Request_Type` + `Context` = identical layer + technology + invalidation output.
- Decision tree evaluation order: data_type → audience → volatility → consistency → scale.
- TTL assignment follows fixed rules per data volatility class.
- Cache key patterns are deterministic: same parameters = same key structure.
- No randomization, no A/B selection.

#### What Agents May Assume

- Output `layer` is the closest-to-user cache appropriate for the data type.
- `invalidation` strategy is compatible with the selected layer and technology.
- `ttl` value is appropriate for the stated data volatility.
- `stampede_protection` is included for any multi-instance configuration.

#### What Agents Must NOT Assume

- The recommendation accounts for provider-specific limitations (CDN vendor differences).
- TTL values are exact for all use cases (they are starting points; tune with monitoring).
- The skill configures actual cache infrastructure.
- Hit rate targets are guaranteed (they are measurable goals for validation).

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Layer selection | None; pure decision output |
| Invalidation design | None; strategy recommendation |
| Key design | None; pattern output |
| TTL assignment | None; value recommendation |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Define caching context (data type, audience, volatility, consistency, scale)
2. Select request type (layer-selection → invalidation → key-design → ttl)
3. Receive recommendation with monitoring targets
4. Implement cache layer (caller's responsibility)
5. Monitor hit rate against target (caller's responsibility)
6. Tune TTL if hit rate below target (re-invoke with updated context)
```

**Recommended ordering:** layer-selection → invalidation-design → key-design → ttl-assignment → thundering-herd.

#### Execution Guarantees

- Each invocation produces a complete, self-contained recommendation.
- No background processes, no deferred execution.
- Output includes monitoring targets for post-implementation validation.

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Invalid request type | Return error to caller | Use supported request type |
| Missing context field | Return error to caller | Supply missing context |
| Conflicting constraints | Return error to caller | Resolve constraint conflict |
| Reference file missing | Return error to caller | Verify skill installation |

Failures are isolated to the current invocation.

#### Retry Boundaries

- Zero internal retries. Deterministic output.
- Callers modify context to explore alternatives.

#### Isolation Model

- Each invocation is stateless and independent.
- Reference files in `references/` are read-only.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Layer selection | Yes | Same context = same layer |
| TTL assignment | Yes | Fixed per volatility class |
| Key design | Yes | Deterministic pattern |
| Reference lookup | Yes | Read-only |

---

## 7. Execution Model

### 4-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Classify** | Validate request type and context | Validated input or error |
| **Evaluate** | Traverse cache decision tree | Selected layer + technology |
| **Fortify** | Attach invalidation, TTL, stampede protection, monitoring | Complete recommendation |
| **Emit** | Return structured output with metadata | Complete output schema |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Fixed decision tree ordering | data_type → audience → volatility → consistency → scale |
| Fixed TTL per volatility | immutable: 365d, hourly: 3600s, minutely: 60s, real-time: 10s |
| Deterministic key patterns | Keys include all varying parameters; sort order is fixed |
| No external calls | Decisions use only local reference files and input context |
| No ambient state | Each invocation operates solely on explicit inputs |

---

## 9. State & Idempotency Model

### State Machine

```
States: IDLE (single state — skill is stateless)
Transitions: None — each invocation is independent
```

Caching Strategy maintains zero persistent state. Fully idempotent.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported request type |
| Missing context field | Return `ERR_MISSING_CONTEXT` with field name | Supply missing field |
| Conflicting constraints | Return `ERR_CONSTRAINT_CONFLICT` | Resolve conflict |
| Invalid data type | Return `ERR_INVALID_DATA_TYPE` | Use supported data type |
| Invalid volatility | Return `ERR_INVALID_VOLATILITY` | Use: immutable, hourly, minutely, real-time |
| Invalid consistency | Return `ERR_INVALID_CONSISTENCY` | Use: eventual, read-after-write, strong |
| Reference file missing | Return `ERR_REFERENCE_NOT_FOUND` | Verify skill installation |

**Invariant:** Every failure returns a structured error. No silent failures.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not one of the 6 supported types |
| `ERR_MISSING_CONTEXT` | Validation | Yes | Required context field is null or empty |
| `ERR_CONSTRAINT_CONFLICT` | Validation | Yes | Constraints contradict each other |
| `ERR_INVALID_DATA_TYPE` | Validation | No | Data type not recognized |
| `ERR_INVALID_VOLATILITY` | Validation | No | Volatility not one of the 4 supported values |
| `ERR_INVALID_CONSISTENCY` | Validation | No | Consistency not one of the 3 supported values |
| `ERR_REFERENCE_NOT_FOUND` | Infrastructure | No | Reference file missing from references/ |

---

## 12. Timeout & Retry Policy

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Decision generation timeout | N/A | Synchronous decision tree; < 50ms |
| Internal retries | Zero | Deterministic output |
| Reference file read timeout | 1,000 ms | Local filesystem |

---

## 13. Observability & Logging Schema

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "caching-strategy",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "layer": "string",
  "technology": "string",
  "invalidation_strategy": "string",
  "ttl_value": "string",
  "context_hash": "string",
  "status": "success|error",
  "error_code": "string|null",
  "duration_ms": "number"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Recommendation generated | INFO | All fields |
| Recommendation failed | ERROR | All fields + error_code |
| Reference file read | DEBUG | file path, read duration |
| Constraint conflict | WARN | conflicting constraints |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `cache.decision.duration` | Histogram | ms |
| `cache.decision.error_rate` | Counter | per error_code |
| `cache.layer.selected` | Counter | per layer |
| `cache.invalidation.strategy` | Counter | per strategy |
| `cache.volatility.distribution` | Counter | per volatility class |

---

## 14. Security & Trust Model

### PII in Cache

- Caching Strategy flags PII caching requirements when `data_type` involves user data.
- Recommendation includes encryption-at-rest requirement for cached PII.
- The skill does not implement encryption; it notes the requirement for the caller.

### Credential Handling

- Caching Strategy does not store, process, or transmit credentials or cache backend connection strings.

### Reference Integrity

- Reference files in `references/` are read-only, static markdown.
- No runtime injection, no code execution from reference content.

### Cache Key Security

- Key patterns must not include raw PII (e.g., email as key).
- Recommendation uses hashed identifiers when PII is part of the key context.

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | CPU-bound decision tree | < 50ms; scales linearly |
| Concurrency | Stateless invocations | Unlimited parallel |
| Reference storage | 4 files (~8 KB total) | Static; no growth |
| Memory per invocation | < 1 MB | No accumulation |
| Network | Zero network calls | No external dependency |

---

## 16. Concurrency Model

| Scope | Model | Behavior |
|-------|-------|----------|
| Within invocation | Sequential | Classify → Evaluate → Fortify → Emit |
| Across invocations | Fully parallel | No shared state |
| Reference access | Read-only shared | Concurrent reads safe |

---

## 17. Resource Lifecycle Management

| Resource | Created By | Destroyed By | Max Lifetime |
|----------|-----------|-------------|--------------|
| Decision output | Emit phase | Caller | Invocation scope |
| Reference file handle | Evaluate phase | Auto-close | < 10 ms |
| Input context | Caller | Invocation completion | Invocation scope |

**Leak prevention:** All resources scoped to single invocation.

---

## 18. Performance Constraints

| Operation | P50 Target | P99 Target | Hard Limit |
|-----------|-----------|-----------|------------|
| Layer selection | < 5 ms | < 20 ms | 50 ms |
| Full architecture recommendation | < 10 ms | < 30 ms | 100 ms |
| Reference file read | < 1 ms | < 5 ms | 1,000 ms |
| Output size | ≤ 800 chars | ≤ 2,000 chars | 5,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| TTL defaults too aggressive/conservative | Medium | Stale data or low hit rate | Fixed TTLs per volatility; callers tune with monitoring |
| Thundering herd not addressed | Medium | Origin overload on cache miss | Mandatory stampede protection for multi-instance |
| CDN vendor differences | Medium | Config guidance doesn't apply to all providers | Reference files note provider-specific caveats |
| Redis single-point-of-failure | Low | Complete cache layer failure | Reference file covers cluster/sentinel patterns |
| PII cached without encryption | Medium | Compliance violation | Skill flags encryption requirement for user data |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ✅ | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ✅ | Entry point under 200 lines |
| Prerequisites documented | ✅ | No external dependencies |
| When to Use section | ✅ | Cache layer decision matrix |
| Quick Reference | ✅ | 5-layer diagram, invalidation strategies |
| Troubleshooting section | ✅ | Anti-patterns table |
| Related section | ✅ | Cross-links to perf-optimizer, api-architect, server-ops, event-driven |
| Content Map | ✅ | Links to 4 reference files + engineering-spec.md |
| Contract versioning | ✅ | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ✅ | This table with ✅/❌ + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | 5 cache layers specified | ✅ |
| **Functionality** | 5 invalidation strategies documented | ✅ |
| **Functionality** | 4 reference files covering Redis, CDN, browser, application | ✅ |
| **Contracts** | Input/output/error schemas defined | ✅ |
| **Contracts** | Agent assumptions and non-assumptions documented | ✅ |
| **Contracts** | Workflow invocation pattern with ordering | ✅ |
| **Failure** | Error taxonomy with 7 categorized error codes | ✅ |
| **Failure** | No silent failures | ✅ |
| **Failure** | Retry policy: zero internal retries | ✅ |
| **Determinism** | Fixed decision tree ordering | ✅ |
| **Determinism** | Fixed TTL per volatility class | ✅ |
| **Security** | PII caching flagged with encryption requirement | ✅ |
| **Security** | Cache keys exclude raw PII | ✅ |
| **Observability** | Structured log schema with 4 log points | ✅ |
| **Observability** | 5 metrics defined | ✅ |
| **Performance** | P50/P99 targets | ✅ |
| **Scalability** | Stateless; unlimited parallel invocations | ✅ |
| **Concurrency** | No shared state; read-only reference access | ✅ |
| **Resources** | All resources scoped to invocation lifetime | ✅ |
| **Idempotency** | Fully idempotent | ✅ |
| **Compliance** | All skill-design-guide.md sections present | ✅ |

---

⚡ PikaKit v3.9.94
