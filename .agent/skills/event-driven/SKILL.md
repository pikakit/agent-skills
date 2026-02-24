---
name: event-driven
description: >-
  Event-driven architecture patterns for distributed systems.
  Message queues, pub/sub, event sourcing, CQRS, saga patterns.
  Triggers on: event-driven, message queue, Kafka, RabbitMQ, pub/sub, CQRS, saga.
  Coordinates with: api-architect, system-design, caching-strategy.
allowed-tools: Read, Write, Edit, Glob, Grep
metadata:
  version: "1.0.0"
  category: "architecture"
  triggers: "event-driven, message queue, Kafka, RabbitMQ, pub/sub, CQRS, event sourcing, saga"
  success_metrics: "messages delivered, idempotent consumers, no data loss"
  coordinates_with: "api-architect, system-design, caching-strategy"
---

# Event-Driven Architecture

> Asynchronous communication patterns for scalable distributed systems.
> **Learn to THINK about event flow, not default to synchronous calls.**

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Choosing messaging pattern | Check decision tree below |
| Event sourcing / CQRS | Read `references/patterns.md` |
| Message queue selection | Read `references/message-queues.md` |
| Real-time / pub/sub | Read `references/pubsub.md` |
| Webhook design | Read `references/webhooks.md` |

---

## 🎯 Selective Reading Rule

**Read ONLY files relevant to the request!** Check content map, find what you need.

---

## When Sync vs Async

```
Does the caller NEED the result immediately?
├── YES → Synchronous (REST/gRPC)
│   Examples: user login, payment validation, read queries
└── NO → Asynchronous (events/queues)
    ├── Fire-and-forget?
    │   └── Message Queue (one consumer)
    ├── Multiple consumers need it?
    │   └── Pub/Sub (fan-out)
    ├── Need audit trail of changes?
    │   └── Event Sourcing
    └── Complex multi-step workflow?
        └── Saga (choreography or orchestration)
```

---

## Pattern Selection

| Pattern | Use When | Example |
|---------|----------|---------|
| **Request/Reply** | Need response | Payment processing |
| **Fire-and-Forget** | No response needed | Email sending, logging |
| **Pub/Sub** | Multiple consumers | Order placed → inventory, email, analytics |
| **Event Sourcing** | Need full audit trail | Financial transactions, compliance |
| **CQRS** | Read/write at different scales | Read-heavy dashboards |
| **Saga** | Distributed transactions | Order → Payment → Shipping |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| `references/patterns.md` | Event Sourcing, CQRS, Saga, choreography vs orchestration | Architecture design |
| `references/message-queues.md` | Kafka vs RabbitMQ vs SQS, setup, patterns | Queue selection |
| `references/pubsub.md` | Redis Pub/Sub, WebSocket, SSE, real-time | Real-time features |
| `references/webhooks.md` | Webhook design, retry, idempotency, signatures | External integrations |

---

## Core Principles

| Principle | Application |
|-----------|-------------|
| **Idempotent Consumers** | Processing same event twice = same result |
| **At-Least-Once Delivery** | Design for duplicates, not exactly-once |
| **Event Ordering** | Use partition keys for ordered processing |
| **Dead Letter Queues** | Capture failed messages for debugging |
| **Schema Evolution** | Backward-compatible event schemas |
| **Observability** | Trace events across services |

---

## Event Schema

```typescript
interface DomainEvent<T = unknown> {
  id: string;              // Unique event ID (UUID)
  type: string;            // "order.created", "user.updated"
  source: string;          // "order-service"
  timestamp: string;       // ISO 8601
  version: string;         // Schema version "1.0"
  data: T;                 // Event payload
  metadata: {
    correlationId: string; // Trace across services
    causationId: string;   // What caused this event
    userId?: string;       // Who triggered it
  };
}

// Example
const event: DomainEvent<OrderCreated> = {
  id: "evt_abc123",
  type: "order.created",
  source: "order-service",
  timestamp: "2025-01-15T10:30:00Z",
  version: "1.0",
  data: {
    orderId: "ord_xyz",
    items: [...],
    total: 99.99,
  },
  metadata: {
    correlationId: "req_456",
    causationId: "cmd_789",
    userId: "user_012",
  },
};
```

---

## ✅ Decision Checklist

- [ ] **Sync vs async decided for THIS use case?**
- [ ] **Event schema versioned?** (backward compatible)
- [ ] **Consumers are idempotent?** (handle duplicates)
- [ ] **Dead letter queue configured?**
- [ ] **Retry policy defined?** (exponential backoff)
- [ ] **Monitoring/tracing in place?** (correlation IDs)
- [ ] **Data loss prevention?** (persistence before ack)

---

## ❌ Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|------|
| Use events for everything | Sync for queries, async for commands |
| Put full entity in event | Include only changed data + ID |
| Assume exactly-once delivery | Design for at-least-once |
| Skip dead letter queues | Always capture failed messages |
| Tight coupling via event data | Use event contracts/schemas |
| Ignore event ordering | Partition by entity ID |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `api-architect` | Skill | API design for event endpoints |
| `system-design` | Skill | Distributed system architecture |
| `caching-strategy` | Skill | Event-driven cache invalidation |
| `payment-patterns` | Skill | Webhook patterns for payments |

---

⚡ PikaKit v3.2.0
