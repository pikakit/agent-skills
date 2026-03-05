---
name: polar-webhooks
description: Polar webhook handling with StandardWebhooks verification, subscription lifecycle, idempotency, and retry handling
---

# Polar Webhook Handling

> Handle subscription lifecycle and payment events. **Always verify signatures. Always be idempotent.**

---

## Webhook Events

| Event | When | Action |
|-------|------|--------|
| `checkout.created` | Checkout session started | Optional: track funnel |
| `checkout.updated` | Checkout status changed | Check for `succeeded` |
| `subscription.created` | New subscription activated | Grant access |
| `subscription.updated` | Plan changed, renewed, payment failed | Update status |
| `subscription.canceled` | Subscription ended | Schedule access removal |
| `subscription.revoked` | Immediately revoked | Remove access now |
| `order.created` | One-time purchase completed | Deliver product |
| `benefit.granted` | Benefit delivered to customer | Log delivery |
| `benefit.revoked` | Benefit removed from customer | Remove access |

---

## Webhook Verification (StandardWebhooks)

Polar uses **StandardWebhooks** format with 3 headers:

| Header | Purpose |
|--------|---------|
| `webhook-id` | Unique event ID (for idempotency) |
| `webhook-timestamp` | Unix timestamp (for replay protection) |
| `webhook-signature` | HMAC-SHA256 signature |

### Using @polar-sh/sdk (Recommended)

```typescript
import { validateEvent, WebhookVerificationError } from '@polar-sh/sdk/webhooks'

app.post('/webhooks/polar',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    try {
      const event = validateEvent(
        req.body,                              // Raw body (Buffer)
        req.headers as Record<string, string>, // Headers
        process.env.POLAR_WEBHOOK_SECRET!      // Secret
      )

      await handleEvent(event)
      res.json({ received: true })
    } catch (err) {
      if (err instanceof WebhookVerificationError) {
        console.error('Webhook verification failed:', err.message)
        return res.status(403).json({ error: 'Invalid signature' })
      }
      console.error('Webhook processing error:', err)
      res.status(500).json({ error: 'Processing failed' })
    }
  }
)
```

### Manual Verification

```typescript
import crypto from 'node:crypto'

function verifyPolarWebhook(
  body: string,
  webhookId: string,
  timestamp: string,
  signature: string,
  secret: string
): boolean {
  // Reject old events (> 5 minutes) to prevent replay attacks
  const now = Math.floor(Date.now() / 1000)
  if (Math.abs(now - parseInt(timestamp)) > 300) return false

  // Construct signed content
  const signedContent = `${webhookId}.${timestamp}.${body}`

  // Decode base64 secret
  const secretBytes = Buffer.from(secret.split('_')[1] || secret, 'base64')

  // Compute expected signature
  const expected = crypto
    .createHmac('sha256', secretBytes)
    .update(signedContent)
    .digest('base64')

  // Compare signatures (constant-time)
  const signatures = signature.split(' ')
  return signatures.some(sig => {
    const sigValue = sig.split(',')[1] || sig
    try {
      return crypto.timingSafeEqual(
        Buffer.from(expected),
        Buffer.from(sigValue)
      )
    } catch { return false }
  })
}
```

---

## Event Handler

```typescript
async function handleEvent(event: WebhookEvent) {
  // Idempotency check first
  const existing = await db.webhookEvent.findUnique({
    where: { eventId: event.id }
  })
  if (existing) return // Already processed

  switch (event.type) {
    case 'subscription.created':
      await handleSubscriptionCreated(event.data)
      break
    case 'subscription.updated':
      await handleSubscriptionUpdated(event.data)
      break
    case 'subscription.canceled':
      await handleSubscriptionCanceled(event.data)
      break
    case 'subscription.revoked':
      await handleSubscriptionRevoked(event.data)
      break
    case 'order.created':
      await handleOrderCreated(event.data)
      break
    case 'benefit.granted':
      await handleBenefitGranted(event.data)
      break
    case 'benefit.revoked':
      await handleBenefitRevoked(event.data)
      break
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  // Mark as processed (idempotency)
  await db.webhookEvent.create({
    data: { eventId: event.id, type: event.type, processedAt: new Date() }
  })
}
```

---

## Subscription Handlers

```typescript
async function handleSubscriptionCreated(data: PolarSubscription) {
  const userId = data.metadata?.userId
  if (!userId) {
    console.error('Missing userId in subscription metadata')
    return
  }

  await db.user.update({
    where: { id: userId },
    data: {
      subscriptionId: data.id,
      productId: data.productId,
      subscriptionStatus: 'active',
      currentPeriodEnd: new Date(data.currentPeriodEnd),
    },
  })
}

async function handleSubscriptionUpdated(data: PolarSubscription) {
  await db.user.update({
    where: { subscriptionId: data.id },
    data: {
      subscriptionStatus: data.status,
      productId: data.productId, // May change on upgrade/downgrade
      currentPeriodEnd: new Date(data.currentPeriodEnd),
      cancelAtPeriodEnd: data.cancelAtPeriodEnd,
    },
  })
}

async function handleSubscriptionCanceled(data: PolarSubscription) {
  await db.user.update({
    where: { subscriptionId: data.id },
    data: {
      subscriptionStatus: 'canceled',
      canceledAt: new Date(),
      // Access continues until currentPeriodEnd
    },
  })
}

async function handleSubscriptionRevoked(data: PolarSubscription) {
  // Immediate access removal (fraud, chargeback, etc.)
  await db.user.update({
    where: { subscriptionId: data.id },
    data: {
      subscriptionStatus: 'revoked',
      canceledAt: new Date(),
    },
  })
}
```

---

## Retry Behavior

Polar retries failed webhooks automatically:

```
Retry schedule:
├── Immediately (first attempt)
├── 5 minutes
├── 30 minutes
├── 2 hours
├── 12 hours
└── 24 hours (final)

Your endpoint MUST:
├── Return 2xx within 30 seconds
├── Return 2xx for already-processed events (idempotency)
├── Return 4xx for verification failures (no retry)
└── Return 5xx for temporary failures (triggers retry)
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Parse JSON before verifying signature | Verify raw body first |
| Skip idempotency check | Check event ID before processing |
| Process webhook synchronously if slow | Return 200 immediately, process async |
| Trust event data without verification | Always verify signature |
| Ignore `subscription.revoked` | Handle immediate access removal |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [overview.md](overview.md) | Subscription lifecycle states |
| [checkouts.md](checkouts.md) | What triggers checkout events |
| [benefits.md](benefits.md) | Benefit grant/revoke events |
| [products.md](products.md) | Product IDs in events |
| [../../scripts/polar-webhook-verify.js](../scripts/polar-webhook-verify.js) | Standalone verification script |
