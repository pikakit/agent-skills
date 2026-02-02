---
name: observability
description: >-
  OpenTelemetry-based observability setup for production applications. Unified instrumentation for logs, metrics, and traces.
  Triggers on: monitoring, observability, OpenTelemetry, telemetry, instrumentation.
  Coordinates with: logging, metrics, tracing, incident-response.
allowed-tools: Read, Write, Glob, Bash
metadata:
  category: "devops"
  success_metrics: "SDK initialized, instrumentation active, telemetry exported"
  coordinates_with: "logging, metrics, tracing, incident-response"
---

# Observability Setup

> Unified telemetry foundation using OpenTelemetry

## 🎯 Purpose

Setup OpenTelemetry SDK for automatic instrumentation and telemetry export to observability platforms (Datadog, Sentry, New Relic, Grafana Cloud).

---

## 1. Core Concepts

### The Three Pillars

| Pillar      | Purpose                | Example               |
| ----------- | ---------------------- | --------------------- |
| **Logs**    | Events with context    | "User login failed"   |
| **Metrics** | Numerical measurements | "CPU usage: 45%"      |
| **Traces**  | Request flow           | "API call took 250ms" |

### OpenTelemetry Advantages

| Aspect               | Benefit                        |
| -------------------- | ------------------------------ |
| Vendor-agnostic      | Switch providers easily        |
| Auto-instrumentation | No manual logging for HTTP, DB |
| Correlation          | Link logs ↔ metrics ↔ traces   |
| Standard             | W3C Trace Context              |

---

## 2. Setup Process

### Step 1: Install Dependencies

**Node.js:**

```bash
npm install @opentelemetry/sdk-node \
            @opentelemetry/auto-instrumentations-node \
            @opentelemetry/exporter-trace-otlp-http \
            @opentelemetry/exporter-metrics-otlp-http
```

**Python:**

```bash
pip install opentelemetry-sdk \
            opentelemetry-instrumentation \
            opentelemetry-exporter-otlp
```

### Step 2: Initialize SDK

**Node.js (lib/observability/setup.ts):**

```typescript
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";

const sdk = new NodeSDK({
  serviceName: process.env.SERVICE_NAME || "my-app",
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://localhost:4318/v1/traces",
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://localhost:4318/v1/metrics",
    }),
    exportIntervalMillis: 60000, // 1 minute
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      "@opentelemetry/instrumentation-http": { enabled: true },
      "@opentelemetry/instrumentation-express": { enabled: true },
      "@opentelemetry/instrumentation-prisma": { enabled: true },
      "@opentelemetry/instrumentation-redis": { enabled: true },
    }),
  ],
  resource: {
    attributes: {
      "service.name": process.env.SERVICE_NAME,
      "deployment.environment": process.env.NODE_ENV || "development",
      "service.version": process.env.APP_VERSION || "1.0.0",
    },
  },
});

sdk.start();

// Graceful shutdown
process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(() => console.log("Telemetry terminated"))
    .catch((error) => console.error("Error terminating telemetry", error))
    .finally(() => process.exit(0));
});

export default sdk;
```

### Step 3: Environment Variables

```env
# Required
SERVICE_NAME=my-production-app
NODE_ENV=production
APP_VERSION=1.2.0

# OpenTelemetry
OTEL_EXPORTER_OTLP_ENDPOINT=https://api.example.com/v1
OTEL_EXPORTER_OTLP_HEADERS="api-key=your-key"

# Provider-specific (choose one)
# Datadog
DD_API_KEY=your-datadog-key
DD_SITE=datadoghq.com

# New Relic
NEW_RELIC_LICENSE_KEY=your-license-key

# Sentry
SENTRY_DSN=your-sentry-dsn
```

---

## 3. Provider Integration

### Datadog

```typescript
import { DatadogExporter } from "@opentelemetry/exporter-datadog";

const sdk = new NodeSDK({
  traceExporter: new DatadogExporter({
    agentUrl: process.env.DD_AGENT_URL || "http://localhost:8126",
    service: process.env.SERVICE_NAME,
    env: process.env.NODE_ENV,
  }),
});
```

### Sentry

```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1, // 10% sampling in production
  environment: process.env.NODE_ENV,
  release: process.env.APP_VERSION,
});
```

### Grafana Cloud

```typescript
const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: "https://otlp-gateway-prod.grafana.net/otlp/v1/traces",
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.GRAFANA_INSTANCE_ID}:${process.env.GRAFANA_API_KEY}`).toString("base64")}`,
    },
  }),
});
```

---

## 4. Auto-Instrumentation

### What Gets Instrumented Automatically

| Library     | Captured Data              |
| ----------- | -------------------------- |
| **HTTP**    | Request/response, status   |
| **Express** | Routes, middleware         |
| **Prisma**  | Database queries, duration |
| **Redis**   | Commands, latency          |
| **Fetch**   | External API calls         |
| **Next.js** | Page loads, API routes     |

### Custom Instrumentation

```typescript
import { trace } from "@opentelemetry/api";

const tracer = trace.getTracer("my-app");

export async function processOrder(orderId: string) {
  return tracer.startActiveSpan("process-order", async (span) => {
    try {
      span.setAttribute("order.id", orderId);

      const order = await fetchOrder(orderId);
      span.setAttribute("order.total", order.total);

      await processPayment(order);

      span.setStatus({ code: SpanStatusCode.OK });
      return order;
    } catch (error) {
      span.recordException(error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });
      throw error;
    } finally {
      span.end();
    }
  });
}
```

---

## 5. Resource Attributes

### Standard Attributes

```typescript
resource: {
  attributes: {
    // Service identification
    'service.name': 'my-app',
    'service.version': '1.2.0',
    'service.namespace': 'production',

    // Environment
    'deployment.environment': 'production',
    'cloud.provider': 'aws',
    'cloud.region': 'us-east-1',

    // Host information
    'host.name': 'web-server-01',
    'host.type': 't3.medium',

    // Custom
    'team': 'backend',
    'cost-center': 'engineering',
  }
}
```

---

## 6. Sampling Strategies

### By Environment

| Environment | Sampling Rate | Reason              |
| ----------- | ------------- | ------------------- |
| Development | 100%          | Debug all requests  |
| Staging     | 50%           | Cost vs. visibility |
| Production  | 1-10%         | Cost optimization   |

### Configuration

```typescript
import { ParentBasedSampler, TraceIdRatioBasedSampler } from "@opentelemetry/sdk-trace-base";

const sampler = new ParentBasedSampler({
  root: new TraceIdRatioBasedSampler(process.env.NODE_ENV === "production" ? 0.1 : 1.0),
});

const sdk = new NodeSDK({
  sampler,
  // ...
});
```

---

## 7. Health Checks

### Verify Telemetry Export

```typescript
// lib/observability/health.ts
export async function checkTelemetryHealth() {
  const checks = {
    sdkInitialized: false,
    exporterConnected: false,
    instrumentationActive: false,
  };

  try {
    // Check SDK
    if (sdk) checks.sdkInitialized = true;

    // Check exporter (send test span)
    const tracer = trace.getTracer("health-check");
    await tracer.startActiveSpan("test-span", async (span) => {
      span.end();
    });
    checks.exporterConnected = true;

    // Check instrumentation
    const instrumentations = getNodeAutoInstrumentations();
    checks.instrumentationActive = instrumentations.length > 0;

    return {
      healthy: Object.values(checks).every(Boolean),
      checks,
    };
  } catch (error) {
    return {
      healthy: false,
      checks,
      error: error.message,
    };
  }
}
```

---

## 8. Best Practices

### Do's ✅

| Practice                 | Benefit                  |
| ------------------------ | ------------------------ |
| Use semantic conventions | Standard attribute names |
| Sample production traces | Reduce costs             |
| Add resource attributes  | Context for debugging    |
| Graceful shutdown        | Don't lose last data     |

### Don'ts ❌

| Anti-Pattern           | Why                     |
| ---------------------- | ----------------------- |
| Log in spans           | Duplication, use events |
| Too many custom spans  | Performance overhead    |
| Sensitive data in tags | Security risk           |
| Ignore errors          | Silent failures         |

---

## 9. Troubleshooting

### Common Issues

| Symptom              | Cause                     | Fix                        |
| -------------------- | ------------------------- | -------------------------- |
| No data in dashboard | Exporter misconfigured    | Check endpoint, API key    |
| High memory usage    | Sample rate too high      | Reduce sampling            |
| Missing HTTP traces  | SDK not initialized early | Import before app code     |
| Broken trace context | Propagation disabled      | Enable context propagation |

### Debug Mode

```typescript
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";

// Enable debug logging (development only)
if (process.env.NODE_ENV === "development") {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
}
```

---

## 10. Performance Impact

### Expected Overhead

| Aspect  | Impact    | Mitigation        |
| ------- | --------- | ----------------- |
| CPU     | +2-5%     | Reduce sampling   |
| Memory  | +10-20MB  | Batch exports     |
| Network | +5-10KB/s | Compress payloads |
| Latency | +1-2ms    | Async export      |

---

> **Key Takeaway:** Observability is foundational. Set it up once, benefit everywhere (logs, metrics, traces all use the same SDK).
