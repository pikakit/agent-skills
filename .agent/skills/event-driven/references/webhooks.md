# Webhook Design Patterns

> Design, deliver, and consume webhooks reliably.
> **See also:** `payment-patterns` skill for payment-specific webhook patterns.

---

## Webhook Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Your App   │     │  Event Queue │     │   Consumer  │
│  (producer)  │───▶ │  (async)    │───▶ │  (receiver) │
└──────────────┘     └──────────────┘     └──────────────┘
                                                │
                                          Retry on failure
```

---

## Sending Webhooks (Producer Side)

### Webhook Delivery Service

```typescript
interface WebhookConfig {
  url: string;
  secret: string;
  events: string[];      // ["order.created", "order.updated"]
  active: boolean;
}

async function deliverWebhook(config: WebhookConfig, event: DomainEvent) {
  const payload = JSON.stringify(event);

  // Generate signature
  const signature = crypto
    .createHmac('sha256', config.secret)
    .update(payload)
    .digest('hex');

  const response = await fetch(config.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Webhook-Signature': `sha256=${signature}`,
      'X-Webhook-ID': event.id,
      'X-Webhook-Timestamp': Date.now().toString(),
    },
    body: payload,
    signal: AbortSignal.timeout(30000), // 30s timeout
  });

  if (!response.ok) {
    throw new WebhookDeliveryError(response.status);
  }
}
```

### Retry Strategy

```typescript
const RETRY_DELAYS = [
  60,       // 1 minute
  300,      // 5 minutes
  1800,     // 30 minutes
  7200,     // 2 hours
  86400,    // 24 hours
];

async function deliverWithRetry(config: WebhookConfig, event: DomainEvent) {
  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
    try {
      await deliverWebhook(config, event);
      return; // Success
    } catch (error) {
      if (attempt < RETRY_DELAYS.length) {
        await scheduleRetry(config, event, RETRY_DELAYS[attempt]);
      } else {
        // Max retries exceeded → notify, disable webhook
        await notifyWebhookFailure(config, event);
        await disableWebhook(config.id);
      }
    }
  }
}
```

---

## Receiving Webhooks (Consumer Side)

### Signature Verification

```typescript
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  const received = signature.replace('sha256=', '');

  // Timing-safe comparison (prevent timing attacks)
  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(received),
  );
}

// Express middleware
function webhookMiddleware(secret: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const signature = req.headers['x-webhook-signature'] as string;
    const rawBody = req.body; // Need raw body, not parsed

    if (!verifyWebhookSignature(rawBody, signature, secret)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    next();
  };
}
```

### Idempotent Processing

```typescript
app.post('/webhooks/orders', webhookMiddleware(secret), async (req, res) => {
  const event = req.body;
  const webhookId = req.headers['x-webhook-id'] as string;

  // Idempotency check
  const processed = await redis.get(`webhook:${webhookId}`);
  if (processed) {
    return res.status(200).json({ status: 'already_processed' });
  }

  try {
    // Respond quickly (within 5s)
    res.status(200).json({ status: 'accepted' });

    // Process asynchronously
    await processWebhookEvent(event);
    await redis.setex(`webhook:${webhookId}`, 86400 * 7, 'processed');

  } catch (error) {
    // Log but don't fail — provider will retry
    console.error('Webhook processing error:', error);
  }
});
```

---

## Webhook Design Checklist

### As Producer

- [ ] Sign all webhook payloads (HMAC-SHA256)
- [ ] Include webhook ID header (for idempotency)
- [ ] Include timestamp header (for replay protection)
- [ ] Implement exponential retry (5 attempts)
- [ ] Set 30s timeout per delivery
- [ ] Log all delivery attempts
- [ ] Auto-disable after max retries

### As Consumer

- [ ] Verify signature before processing
- [ ] Respond within 5s (200 OK)
- [ ] Process asynchronously (queue after ack)
- [ ] Implement idempotency (by webhook ID)
- [ ] Check timestamp freshness (reject > 5min old)
- [ ] Handle out-of-order events

---

## Replay Protection

```typescript
function isWebhookFresh(timestampHeader: string): boolean {
  const webhookTime = parseInt(timestampHeader);
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  return Math.abs(now - webhookTime) < fiveMinutes;
}
```

---

⚡ PikaKit v3.9.73
