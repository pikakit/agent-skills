---
name: event-driven
description: >-
  Event-driven architecture patterns for distributed systems.
  Message queues, pub/sub, event sourcing, CQRS, saga patterns.
  Triggers on: event-driven, message queue, Kafka, RabbitMQ, pub/sub, CQRS, saga.
  Coordinates with: api-architect, system-design, caching-strategy.
metadata:
  version: "2.0.0"
  category: "architecture"
  triggers: "event-driven, message queue, Kafka, RabbitMQ, pub/sub, CQRS, event sourcing, saga"
  success_metrics: "idempotent consumers, DLQ configured, versioned events, no data loss"
  coordinates_with: "api-architect, system-design, caching-strategy"
---

# Event-Driven Architecture

> Async by default. At-least-once delivery. Idempotent consumers. DLQ mandatory.

---

## Prerequisites

**Required:** None — Event-Driven is a knowledge-based skill with no external dependencies.

---

## When to Use

| Situation | Action |
|-----------|--------|
| Sync vs async decision | Use sync-async decision tree below |
| Event sourcing / CQRS | Read `references/patterns.md` |
| Queue selection | Read `references/message-queues.md` |
| Real-time / pub/sub | Read `references/pubsub.md` |
| Webhook design | Read `references/webhooks.md` |
| Architecture review | Read `references/engineering-spec.md` |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Sync-vs-async classification | API endpoint design (→ api-architect) |
| Pattern selection (6 patterns) | System architecture (→ system-design) |
| Queue selection (Kafka/RabbitMQ/SQS) | Cache invalidation (→ caching-strategy) |
| DomainEvent schema standard | Payment webhooks (→ payment-patterns) |
| Webhook design patterns | Broker provisioning |

**Pure decision skill:** Produces architecture decisions. Zero side effects.

---

## Sync vs Async Decision Tree

```
Does the caller NEED the result immediately?
├── YES → Synchronous (REST/gRPC)
│   Examples: user login, payment validation, read queries
└── NO → Asynchronous (events/queues)
    ├── Single consumer, no response?
    │   └── Fire-and-Forget (Message Queue)
    ├── Multiple consumers?
    │   └── Pub/Sub (fan-out)
    ├── Need audit trail?
    │   └── Event Sourcing
    ├── Read/write at different scales?
    │   └── CQRS
    └── Multi-step distributed transaction?
        └── Saga (choreography or orchestration)
```

---

## Pattern Selection

| Pattern | Use When | Example |
|---------|----------|---------|
| **Request/Reply** | Caller needs immediate response | Payment processing |
| **Fire-and-Forget** | No response needed | Email sending, logging |
| **Pub/Sub** | Multiple consumers | Order → inventory, email, analytics |
| **Event Sourcing** | Full audit trail required | Financial transactions, compliance |
| **CQRS** | Read/write at different scales | Read-heavy dashboards |
| **Saga** | Distributed transactions | Order → Payment → Shipping |

---

## Queue Selection

| Requirement | Queue | Rationale |
|-------------|-------|-----------|
| High throughput + ordering | Kafka | Partition-based ordering |
| Routing flexibility | RabbitMQ | Exchange/binding patterns |
| Serverless / managed | SQS | Zero infrastructure |

---

## Core Principles

| Principle | Rule |
|-----------|------|
| **Idempotent consumers** | Same event twice = same result |
| **At-least-once delivery** | Design for duplicates, never assume exactly-once |
| **Event ordering** | Partition by entity ID for ordered processing |
| **Dead letter queues** | DLQ mandatory on every queue/subscription |
| **Schema evolution** | Backward-compatible versioned events |
| **Correlation tracing** | Every event carries correlationId + causationId |

---

## Decision Checklist

| # | Check |
|---|-------|
| 1 | Sync vs async classified for THIS use case? |
| 2 | Event schema versioned? (backward compatible) |
| 3 | Consumers are idempotent? (handle duplicates) |
| 4 | Dead letter queue configured? |
| 5 | Retry policy defined? (exponential backoff) |
| 6 | Monitoring/tracing in place? (correlation IDs) |
| 7 | Data loss prevention? (persist before ack) |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_MISSING_CONTEXT` | Yes | Required context field missing |
| `ERR_CONTEXT_CONFLICT` | Yes | Conflicting requirements |
| `ERR_REFERENCE_NOT_FOUND` | No | Reference file missing |

**Zero internal retries.** Deterministic; same context = same recommendation.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Use events for everything | Sync for queries, async for commands |
| Put full entity in event | Include only changed data + entity ID |
| Assume exactly-once delivery | Design for at-least-once always |
| Skip dead letter queues | DLQ on every queue |
| Tight coupling via event data | Use versioned event contracts |
| Ignore event ordering | Partition by entity ID |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [patterns.md](references/patterns.md) | Event Sourcing, CQRS, Saga patterns | Architecture design |
| [message-queues.md](references/message-queues.md) | Kafka vs RabbitMQ vs SQS | Queue selection |
| [pubsub.md](references/pubsub.md) | Redis Pub/Sub, WebSocket, SSE | Real-time features |
| [webhooks.md](references/webhooks.md) | Webhook retry, idempotency, signatures | External integrations |
| [engineering-spec.md](references/engineering-spec.md) | Full engineering spec | Architecture review |

**Selective reading:** Read ONLY files relevant to the request.

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `api-architect` | Skill | API design for event endpoints |
| `system-design` | Skill | Distributed system architecture |
| `caching-strategy` | Skill | Event-driven cache invalidation |
| `payment-patterns` | Skill | Webhook patterns for payments |

---

⚡ PikaKit v3.9.84
