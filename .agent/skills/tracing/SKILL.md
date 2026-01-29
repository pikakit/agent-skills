---
name: tracing
description: >-
  Distributed tracing across microservices. OpenTelemetry spans, trace context propagation, APM integration.
  Triggers on: tracing, distributed tracing, APM, spans, OpenTelemetry.
  Coordinates with: observability, logging, metrics.
allowed-tools: Read, Write, Glob, Bash
metadata:
  category: "devops"
  success_metrics: "Traces visible in APM, context propagation working"
  coordinates_with: "observability, logging, metrics"
---

# Distributed Tracing

> Track requests across services with OpenTelemetry

## 🎯 Purpose

Enable distributed tracing to visualize request flow, identify bottlenecks, and debug issues across microservices.

---

## 1. Core Concepts

| Term             | Meaning                          |
| ---------------- | -------------------------------- |
| **Trace**        | End-to-end request journey       |
| **Span**         | Single operation in the trace    |
| **Context**      | Trace ID + span ID propagation   |
| **Parent-child** | Span relationship (nested calls) |

---

## 2. Auto-Instrumentation

OpenTelemetry automatically traces:

- HTTP requests (incoming/outgoing)
- Database queries (Prisma, MongoDB, etc.)
- Redis commands
- External API calls (fetch, axios)

```typescript
// Already configured via observability skill
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";

const sdk = new NodeSDK({
  instrumentations: [getNodeAutoInstrumentations()],
});
```

---

## 3. Custom Spans

### Manual Instrumentation

```typescript
import { trace } from "@opentelemetry/api";

const tracer = trace.getTracer("my-app");

async function processOrder(orderId: string) {
  // Create span
  return tracer.startActiveSpan("process-order", async (span) => {
    try {
      // Add attributes
      span.setAttribute("order.id", orderId);
      span.setAttribute("order.priority", "high");

      // Nested operation (creates child span)
      const order = await fetchOrder(orderId);
      span.setAttribute("order.total", order.total);

      // Another child span
      await processPayment(order);

      // Mark successful
      span.setStatus({ code: SpanStatusCode.OK });
      return order;
    } catch (error) {
      // Record error
      span.recordException(error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });
      throw error;
    } finally {
      // End span
      span.end();
    }
  });
}
```

---

## 4. Context Propagation

### W3C Trace Context (Standard)

HTTP headers automatically propagated:

```
traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
tracestate: vendor=data
```

### Manual Propagation

```typescript
import { context, propagation } from "@opentelemetry/api";

// Extract context from incoming request
const carrier = req.headers;
const ctx = propagation.extract(context.active(), carrier);

// Inject context into outgoing request
const headers = {};
propagation.inject(ctx, headers);

await fetch("https://api.example.com", { headers });
```

---

## 5. Span Attributes (Best Practices)

### Semantic Conventions

```typescript
span.setAttribute("http.method", "POST");
span.setAttribute("http.url", "/api/orders");
span.setAttribute("http.status_code", 200);
span.setAttribute("db.system", "postgresql");
span.setAttribute("db.statement", "SELECT * FROM users");
span.setAttribute("user.id", userId);
span.setAttribute("order.id", orderId);
```

---

## 6. Sampling

### Production Strategy

```typescript
import { TraceIdRatioBasedSampler } from "@opentelemetry/sdk-trace-base";

const sampler = new TraceIdRatioBasedSampler(process.env.NODE_ENV === "production" ? 0.1 : 1.0);
// Production: 10% of traces
// Development: 100% of traces
```

### Smart Sampling

```typescript
import { ParentBasedSampler, AlwaysOnSampler } from "@opentelemetry/sdk-trace-base";

// Always trace errors, sample others
class ErrorAwareSampler {
  shouldSample(context, traceId, spanName, spanKind, attributes) {
    if (attributes["http.status_code"] >= 500) {
      return { decision: SamplingDecision.RECORD_AND_SAMPLED };
    }
    return { decision: SamplingDecision.NOT_RECORD };
  }
}
```

---

## 7. Linking Traces to Logs

```typescript
import { trace } from "@opentelemetry/api";
import logger from "./lib/logger";

function logWithTrace(message: string) {
  const span = trace.getActiveSpan();
  const traceId = span?.spanContext().traceId;
  const spanId = span?.spanContext().spanId;

  logger.info({ traceId, spanId }, message);
  // Now logs and traces are correlated!
}
```

---

## 8. APM Visualization

### Datadog APM

Traces automatically appear at:
`https://app.datadoghq.com/apm/traces`

### Features:

- Service map (dependency graph)
- Flame graphs (span timeline)
- Error tracking (failed traces)
- Latency analysis (p50, p95, p99)

---

## 9. Troubleshooting

| Issue          | Cause                         | Fix                         |
| -------------- | ----------------------------- | --------------------------- |
| No traces      | SDK not initialized           | Check observability setup   |
| Broken context | Headers not propagated        | Use W3C Trace Context       |
| High memory    | Sample rate 100%              | Reduce to 10% in production |
| Missing spans  | Auto-instrumentation disabled | Enable in SDK               |

---

> **Key Takeaway:** Auto-instrumentation covers 80% of use cases. Add custom spans only for critical business logic.
