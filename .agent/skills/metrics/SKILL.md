---
name: metrics
description: >-
  Prometheus-compatible metrics collection. Custom metrics (counters, gauges, histograms), Golden Signals, dashboard creation.
  Triggers on: metrics, Prometheus, monitoring, performance metrics, Golden Signals.
  Coordinates with: observability, logging, incident-response.
allowed-tools: Read, Write, Glob, Bash
metadata:
  category: "devops"
  success_metrics: "Metrics exposed, dashboard created, Golden Signals tracked"
  coordinates_with: "observability, logging, incident-response"
---

# Metrics Collection

> Prometheus-format metrics for performance monitoring

## 🎯 Purpose

Expose and collect application metrics (counters, gauges, histograms) for monitoring performance, business KPIs, and Golden Signals.

---

## 1. Golden Signals (SRE Best Practice)

| Signal         | Measures | Metric Example             |
| -------------- | -------- | -------------------------- |
| **Latency**    | Speed    | `http_request_duration_ms` |
| **Traffic**    | Load     | `http_requests_total`      |
| **Errors**     | Failures | `http_errors_total`        |
| **Saturation** | Capacity | `cpu_usage_percent`        |

---

## 2. Setup (prom-client for Node.js)

```bash
npm install prom-client
```

```typescript
// lib/metrics.ts
import { Counter, Histogram, Gauge, Registry } from "prom-client";

export const register = new Registry();

// Golden Signal 1: Traffic
export const httpRequestCounter = new Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status"],
  registers: [register],
});

// Golden Signal 2: Latency
export const httpRequestDuration = new Histogram({
  name: "http_request_duration_ms",
  help: "HTTP request duration in milliseconds",
  labelNames: ["method", "route"],
  buckets: [10, 50, 100, 200, 500, 1000, 2000, 5000],
  registers: [register],
});

// Golden Signal 3: Errors
export const httpErrorCounter = new Counter({
  name: "http_errors_total",
  help: "Total HTTP errors",
  labelNames: ["method", "route", "status"],
  registers: [register],
});

// Golden Signal 4: Saturation
export const activeConnectionsGauge = new Gauge({
  name: "active_connections",
  help: "Number of active connections",
  registers: [register],
});

// Expose metrics endpoint
export function metricsHandler(req, res) {
  res.set("Content-Type", register.contentType);
  res.end(register.metrics());
}
```

---

## 3. Express Middleware

```typescript
import { httpRequestCounter, httpRequestDuration, httpErrorCounter } from "./lib/metrics";

app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const route = req.route?.path || "unknown";

    // Traffic
    httpRequestCounter.inc({
      method: req.method,
      route,
      status: res.statusCode,
    });

    // Latency
    httpRequestDuration.observe({ method: req.method, route }, duration);

    // Errors
    if (res.statusCode >= 400) {
      httpErrorCounter.inc({ method: req.method, route, status: res.statusCode });
    }
  });

  next();
});

// Expose metrics
app.get("/metrics", metricsHandler);
```

---

## 4. Metric Types

### Counter (always increases)

```typescript
const orderCounter = new Counter({
  name: "orders_total",
  help: "Total orders",
  labelNames: ["status"], // 'completed', 'failed'
});

// Usage
orderCounter.inc({ status: "completed" });
```

### Gauge (can go up/down)

```typescript
const activeUsersGauge = new Gauge({
  name: "active_users",
  help: "Currently active users",
});

// Usage
activeUsersGauge.set(150);
activeUsersGauge.inc(); // +1
activeUsersGauge.dec(); // -1
```

### Histogram (distribution)

```typescript
const paymentDuration = new Histogram({
  name: "payment_processing_seconds",
  help: "Payment processing time",
  buckets: [0.1, 0.5, 1, 2, 5],
});

// Usage
const end = paymentDuration.startTimer();
await processPayment();
end(); // Records duration
```

---

## 5. Business Metrics

```typescript
// Revenue
const revenueCounter = new Counter({
  name: "revenue_total",
  help: "Total revenue in USD",
});

revenueCounter.inc(order.total);

// User signups
const signupCounter = new Counter({
  name: "user_signups_total",
  help: "Total user signups",
  labelNames: ["source"], // 'organic', 'paid', 'referral'
});

signupCounter.inc({ source: "organic" });
```

---

## 6. Database Metrics

```typescript
const dbQueryDuration = new Histogram({
  name: "db_query_duration_ms",
  help: "Database query duration",
  labelNames: ["operation", "table"],
  buckets: [5, 10, 25, 50, 100, 250, 500, 1000],
});

// Prisma middleware
prisma.$use(async (params, next) => {
  const start = Date.now();
  const result = await next(params);
  const duration = Date.now() - start;

  dbQueryDuration.observe(
    {
      operation: params.action,
      table: params.model,
    },
    duration,
  );

  return result;
});
```

---

## 7. Dashboard Creation

### Grafana Example

```json
{
  "title": "Application Metrics",
  "panels": [
    {
      "title": "Request Rate",
      "targets": [
        {
          "expr": "rate(http_requests_total[5m])"
        }
      ]
    },
    {
      "title": "p95 Latency",
      "targets": [
        {
          "expr": "histogram_quantile(0.95, http_request_duration_ms_bucket)"
        }
      ]
    },
    {
      "title": "Error Rate",
      "targets": [
        {
          "expr": "rate(http_errors_total[5m]) / rate(http_requests_total[5m])"
        }
      ]
    }
  ]
}
```

---

## 8. PromQL Queries

```promql
# Request rate (per second)
rate(http_requests_total[5m])

# p95 latency
histogram_quantile(0.95, http_request_duration_ms_bucket)

# Error rate percentage
rate(http_errors_total[5m]) / rate(http_requests_total[5m]) * 100

# Top slow routes
topk(5, http_request_duration_ms)

# Memory usage trend
increase(nodejs_heap_size_used_bytes[1h])
```

---

> **Key Takeaway:** Golden Signals (latency, traffic, errors, saturation) are the minimum viable metrics for production monitoring.
