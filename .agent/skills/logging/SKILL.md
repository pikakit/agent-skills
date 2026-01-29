---
name: logging
description: >-
  Structured logging setup with cloud aggregation. JSON format, log levels, PII masking, correlation IDs.
  Triggers on: logging, logs, log aggregation, structured logging, Pino, Winston.
  Coordinates with: observability, metrics, tracing.
allowed-tools: Read, Write, Glob, Bash
metadata:
  category: "devops"
  success_metrics: "Structured logs, cloud aggregation active, PII masked"
  coordinates_with: "observability, metrics, tracing"
---

# Structured Logging

> JSON-formatted logs with cloud aggregation and correlation

## 🎯 Purpose

Setup production-grade structured logging with JSON format, log levels, PII masking, and cloud aggregation (Datadog, CloudWatch, Grafana Loki).

---

## Quick Reference

| Need | Reference |
|------|-----------|
| Cloud setup (Datadog, AWS, Loki) | [cloud-integration.md](references/cloud-integration.md) |
| PII masking, correlation IDs | [advanced-patterns.md](references/advanced-patterns.md) |
| Error handling, sampling | [advanced-patterns.md](references/advanced-patterns.md) |

---

## 1. Core Principles

### Structured vs. Unstructured

| Type             | Example                                    | Searchable |
| ---------------- | ------------------------------------------ | ---------- |
| **Unstructured** | "User john logged in at 10:30"             | ❌ Hard    |
| **Structured**   | `{user:"john",event:"login",time:"10:30"}` | ✅ Easy    |

### Log Levels

| Level     | When to Use         | Example                     |
| --------- | ------------------- | --------------------------- |
| **ERROR** | Something failed    | "Payment processing failed" |
| **WARN**  | Potential issue     | "API slow response (500ms)" |
| **INFO**  | Normal events       | "User logged in"            |
| **DEBUG** | Development details | "Query parameters: {...}"   |

---

## 2. Setup (Pino - Recommended)

### Installation

```bash
npm install pino pino-pretty
```

### Basic Setup

```typescript
// lib/logger.ts
import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  base: {
    service: process.env.SERVICE_NAME || "my-app",
    environment: process.env.NODE_ENV || "development",
  },
});

export default logger;
```

### Pretty Print (Development)

```typescript
const logger = pino({
  transport:
    process.env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: { colorize: true, translateTime: "SYS:standard" },
        }
      : undefined,
});
```

---

## 3. Contextual Logging

### Express Request Logger

```typescript
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: Date.now() - start,
    }, "HTTP request");
  });

  next();
});
```

### Database Query Logging

```typescript
prisma.$on("query", (e) => {
  if (e.duration > 1000) {
    logger.warn({ query: e.query, duration: e.duration }, "Slow query");
  }
});
```

---

## 4. Best Practices

### Do's ✅

| Practice                | Benefit                  |
| ----------------------- | ------------------------ |
| Use structured JSON     | Easy search and analysis |
| Include correlation IDs | Trace requests           |
| Mask PII                | GDPR/CCPA compliance     |
| Use child loggers       | Context per module       |

### Don'ts ❌

| Anti-Pattern         | Why                   |
| -------------------- | --------------------- |
| Log sensitive data   | Security / compliance |
| String concatenation | Not structured        |
| Excessive debug logs | Performance impact    |

---

## 5. Troubleshooting

| Symptom                | Cause                   | Fix                      |
| ---------------------- | ----------------------- | ------------------------ |
| Logs not appearing     | Transport misconfigured | Check API key, endpoint  |
| High memory usage      | Sync logging            | Use async destination    |
| Sensitive data in logs | Missing redaction       | Add redact config        |

---

## 6. Migration from Console.log

### Before

```javascript
console.log("User logged in:", user.id);
console.error("Payment failed!", error);
```

### After

```typescript
logger.info({ userId: user.id }, "User logged in");
logger.error({ err: error, userId: user.id }, "Payment failed");
```

---

## References

For detailed documentation:

- [Cloud Integration](references/cloud-integration.md) - Datadog, CloudWatch, Grafana Loki
- [Advanced Patterns](references/advanced-patterns.md) - PII masking, correlation IDs, sampling, performance

---

> **Key Takeaway:** Structured logs are queryable, correlation IDs are essential, and PII masking is non-negotiable in production.
