---
name: observability
description: >-
  OpenTelemetry-based observability for production applications. Unified logs, metrics, traces.
  Triggers on: monitoring, observability, OpenTelemetry, telemetry, instrumentation.
  Coordinates with: logging, metrics, tracing, incident-response.
metadata:
  category: "devops"
  version: "2.0.0"
  triggers: "monitoring, observability, OpenTelemetry, telemetry"
  coordinates_with: "logging, metrics, tracing, incident-response"
  success_metrics: "SDK initialized, telemetry exported"
---

# Observability

> **Purpose:** Unified telemetry with OpenTelemetry SDK

---

## Quick Reference

| Task | Command |
|------|---------|
| **Install (Node)** | `npm install @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node` |
| **Install (Python)** | `pip install opentelemetry-sdk opentelemetry-instrumentation` |

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Need unified telemetry | Setup OpenTelemetry SDK |
| Debug production issues | Check traces |
| Monitor performance | Use metrics |
| Track errors | Configure logging |

---

## Three Pillars

| Pillar | Purpose | Example |
|--------|---------|---------|
| **Logs** | Events with context | "User login failed" |
| **Metrics** | Numerical measurements | "CPU usage: 45%" |
| **Traces** | Request flow | "API call took 250ms" |

---

## OpenTelemetry Benefits

| Benefit | Description |
|---------|-------------|
| Vendor-agnostic | Switch providers easily |
| Auto-instrumentation | No manual logging for HTTP, DB |
| Correlation | Link logs ↔ metrics ↔ traces |

---

## Quick Setup (Node.js)

```typescript
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const sdk = new NodeSDK({
  serviceName: process.env.SERVICE_NAME,
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
```

---

## Auto-Instrumented Libraries

| Library | Captured |
|---------|----------|
| HTTP | Request/response, status |
| Express | Routes, middleware |
| Prisma | Database queries |
| Redis | Commands, latency |
| Next.js | Page loads, API routes |

---

## Sampling by Environment

| Environment | Rate | Reason |
|-------------|------|--------|
| Development | 100% | Debug all |
| Staging | 50% | Cost vs visibility |
| Production | 1-10% | Cost optimization |

---

## Provider Integration

| Provider | Exporter |
|----------|----------|
| Datadog | `@opentelemetry/exporter-datadog` |
| Grafana | OTLP HTTP with auth |
| Sentry | `@sentry/node` |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Too many custom spans | Use auto-instrumentation |
| Sensitive data in tags | Sanitize before export |
| Ignore errors | Log exceptions |

---

## References

For detailed setup and code examples:
- [references/setup-nodejs.md](references/setup-nodejs.md)
- [references/setup-python.md](references/setup-python.md)
- [references/providers.md](references/providers.md)

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| No traces appearing | Check OTEL_EXPORTER_OTLP_ENDPOINT is set |
| High cardinality metrics | Reduce label values, use histograms |
| Missing spans | Verify instrumentation is auto-loaded |
| Prometheus scrape fails | Check /metrics endpoint, firewall rules |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `/monitor` | Workflow | Monitoring setup |
| `server-ops` | Skill | Server management |
| `cicd-pipeline` | Skill | Deployment monitoring |

---

> **Key:** Set up once, benefit everywhere (logs, metrics, traces share same SDK).

---

⚡ PikaKit v3.2.0
