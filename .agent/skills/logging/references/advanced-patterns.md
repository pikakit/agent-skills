# Advanced Logging Patterns

> PII masking, correlation IDs, error handling, sampling, and performance

---

## PII Masking & Redaction

### Automatic Redaction

```typescript
const logger = pino({
  redact: {
    paths: ["password", "creditCard", "ssn", "req.headers.authorization", "user.email", "user.phone"],
    censor: "[REDACTED]",
  },
});

// Usage
logger.info({
  user: { email: "user@example.com", name: "John" },
  password: "secret123",
});
// Output: { user: { email: '[REDACTED]', name: 'John' }, password: '[REDACTED]' }
```

### Custom Redaction (Regex)

```typescript
function redactSensitive(obj: any) {
  const patterns = {
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
    ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  };

  let str = JSON.stringify(obj);
  for (const [key, pattern] of Object.entries(patterns)) {
    str = str.replace(pattern, `[${key.toUpperCase()}_REDACTED]`);
  }
  return JSON.parse(str);
}
```

---

## Correlation IDs

### Request Tracing with AsyncLocalStorage

```typescript
import { randomUUID } from "crypto";
import { AsyncLocalStorage } from "async_hooks";

const asyncLocalStorage = new AsyncLocalStorage<{ requestId: string }>();

// Express middleware
export function requestIdMiddleware(req, res, next) {
  const requestId = req.headers["x-request-id"] || randomUUID();
  res.setHeader("x-request-id", requestId);

  asyncLocalStorage.run({ requestId }, () => {
    next();
  });
}

// Get logger with requestId
export function getLogger() {
  const store = asyncLocalStorage.getStore();
  return logger.child({ requestId: store?.requestId });
}

// Usage in routes
app.get("/api/users", (req, res) => {
  const log = getLogger();
  log.info("Fetching users");
  // All logs in this request have the same requestId
});
```

---

## Error Handling

### With Stack Traces

```typescript
try {
  await riskyOperation();
} catch (error) {
  logger.error(
    {
      err: error, // Pino automatically serializes Error objects
      context: { userId, orderId },
    },
    "Operation failed",
  );
}
```

### Custom Error Serializer

```typescript
const logger = pino({
  serializers: {
    err: (err) => ({
      type: err.constructor.name,
      message: err.message,
      stack: err.stack,
      code: err.code,
      statusCode: err.statusCode,
      isOperational: err.isOperational,
    }),
  },
});
```

---

## Log Sampling

### High-Volume Endpoints

```typescript
let requestCount = 0;

app.get("/api/health", (req, res) => {
  requestCount++;

  // Log only every 100th request
  if (requestCount % 100 === 0) {
    logger.info({ requestCount }, "Health check (sampled)");
  }

  res.json({ status: "ok" });
});
```

### Rate Limiting

```typescript
import { RateLimiter } from "limiter";

const logLimiter = new RateLimiter({
  tokensPerInterval: 100,
  interval: "minute",
});

function rateLimitedLog(level: string, msg: any, text: string) {
  if (logLimiter.tryRemoveTokens(1)) {
    logger[level](msg, text);
  }
}
```

---

## Performance Optimization

### Async Logging

```typescript
import pino from "pino";
import SonicBoom from "sonic-boom";

// Async destination (non-blocking)
const destination = new SonicBoom({
  fd: process.stdout.fd,
  sync: false,
  minLength: 4096,
});

const logger = pino(destination);
```

### Log Level per Module

```typescript
const logger = pino({ level: "info" });

// Debug logs for specific module
export const dbLogger = logger.child({ module: "database" }, { level: "debug" });
export const authLogger = logger.child({ module: "auth" });

// Usage
dbLogger.debug("Query executed"); // Only in debug mode
authLogger.info("User logged in"); // Always logged
```

---

## Log Retention Guidelines

| Environment | Retention   | Reason                |
| ----------- | ----------- | --------------------- |
| Development | 7 days      | Short-term debugging  |
| Staging     | 30 days     | Testing cycles        |
| Production  | 90-365 days | Compliance, forensics |

### Cost Optimization

| Strategy                | Savings | Trade-off        |
| ----------------------- | ------- | ---------------- |
| Sample high-volume logs | 50-70%  | Less granularity |
| Shorter retention       | 30-50%  | Less history     |
| Compress old logs       | 60-80%  | Slower retrieval |
| Archive to S3           | 80-90%  | Manual restore   |
