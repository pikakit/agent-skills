# Polar Webhook Handling

> Handle subscription lifecycle and payment events.

---

## Webhook Events

| Event | When |
|-------|------|
| `checkout.created` | Checkout session started |
| `checkout.updated` | Checkout status changed |
| `subscription.created` | New subscription activated |
| `subscription.updated` | Plan changed, renewed |
| `subscription.canceled` | Subscription ended |
| `order.created` | One-time purchase completed |
| `benefit.granted` | Benefit delivered |
| `benefit.revoked` | Benefit removed |

---

## Webhook Handler

```typescript
import crypto from 'crypto';

function verifyPolarWebhook(payload: string, signature: string): boolean {
  const expectedSig = crypto
    .createHmac('sha256', process.env.POLAR_WEBHOOK_SECRET!)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSig)
  );
}

app.post('/webhooks/polar', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['polar-signature'] as string;
  
  if (!verifyPolarWebhook(req.body.toString(), signature)) {
    return res.status(401).send('Invalid signature');
  }
  
  const event = JSON.parse(req.body.toString());
  
  switch (event.type) {
    case 'subscription.created':
      await handleSubscriptionCreated(event.data);
      break;
    case 'subscription.canceled':
      await handleSubscriptionCanceled(event.data);
      break;
    case 'benefit.granted':
      await handleBenefitGranted(event.data);
      break;
  }
  
  res.json({ received: true });
});
```

---

## Subscription Handlers

```typescript
async function handleSubscriptionCreated(data: PolarSubscription) {
  const userId = data.metadata?.userId;
  
  await db.user.update({
    where: { id: userId },
    data: {
      subscriptionId: data.id,
      plan: data.productId,
      status: 'active',
    },
  });
}

async function handleSubscriptionCanceled(data: PolarSubscription) {
  const userId = data.metadata?.userId;
  
  await db.user.update({
    where: { id: userId },
    data: {
      status: 'canceled',
      canceledAt: new Date(),
    },
  });
}
```

---

## Idempotency

```typescript
// Prevent duplicate processing
const processed = await db.processedWebhook.findUnique({
  where: { eventId: event.id }
});

if (processed) {
  return res.json({ received: true });
}

await handleEvent(event);
await db.processedWebhook.create({ data: { eventId: event.id } });
```

---

⚡ PikaKit v3.9.71
