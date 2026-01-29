# Cloud Aggregation

> Integration with Datadog, AWS CloudWatch, and Grafana Loki

---

## Datadog

```typescript
import pino from "pino";

const logger = pino({
  level: "info",
  transport: {
    target: "pino-datadog",
    options: {
      apiKey: process.env.DD_API_KEY,
      service: process.env.SERVICE_NAME,
      ddsource: "nodejs",
      ddtags: `env:${process.env.NODE_ENV},version:${process.env.APP_VERSION}`,
      hostname: process.env.HOSTNAME,
    },
  },
});
```

### Query Examples

```
service:my-app env:production status:error
service:my-app @http.status_code:>=500
service:my-app @duration:>1000
```

---

## AWS CloudWatch

```typescript
import pino from "pino";

const logger = pino({
  transport: {
    target: "pino-cloudwatch",
    options: {
      logGroupName: `/aws/app/${process.env.SERVICE_NAME}`,
      logStreamName: `${process.env.NODE_ENV}-${Date.now()}`,
      awsRegion: process.env.AWS_REGION || "us-east-1",
      awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
      awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  },
});
```

### CloudWatch Insights Query

```
fields @timestamp, @message, requestId
| filter level = "ERROR"
| filter duration > 1000
| stats count() by @message
```

---

## Grafana Loki

```typescript
const logger = pino({
  transport: {
    target: "pino-loki",
    options: {
      batching: true,
      interval: 5000,
      host: process.env.LOKI_HOST || "http://localhost:3100",
      labels: {
        service: process.env.SERVICE_NAME,
        environment: process.env.NODE_ENV,
      },
    },
  },
});
```

### LogQL Examples

```
{service="my-app", environment="production"} |= "error"
{service="my-app"} | json | duration > 1000
{service="my-app"} | pattern "<_> status=<status>"
```

---

## Installation

```bash
npm install pino pino-pretty
# Cloud transports
npm install pino-datadog   # For Datadog
npm install pino-cloudwatch # For AWS CloudWatch
npm install pino-loki      # For Grafana Loki
```
