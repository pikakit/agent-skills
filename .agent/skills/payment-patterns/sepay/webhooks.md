# SePay Webhook Handling

> Receive real-time bank transfer notifications.

---

## Webhook Events

| Event | Description |
|-------|-------------|
| `payment.received` | Bank transfer received |
| `payment.confirmed` | Payment confirmed by bank |
| `payment.failed` | Payment failed/reversed |

---

## Webhook Payload

```json
{
  "event": "payment.received",
  "data": {
    "id": "txn_abc123",
    "referenceCode": "ORDER-123",
    "amount": 500000,
    "currency": "VND",
    "bankCode": "VCB",
    "bankAccount": "1234567890",
    "senderName": "NGUYEN VAN A",
    "senderAccount": "0987654321",
    "description": "ORDER-123 thanh toan",
    "timestamp": "2025-01-01T12:00:00Z"
  },
  "signature": "sha256=..."
}
```

---

## Signature Verification (CRITICAL)

```typescript
import crypto from 'crypto';

function verifyWebhook(payload: string, signature: string): boolean {
  const expectedSig = crypto
    .createHmac('sha256', process.env.SEPAY_WEBHOOK_SECRET!)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature.replace('sha256=', '')),
    Buffer.from(expectedSig)
  );
}

// Express handler
app.post('/webhooks/sepay', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-sepay-signature'] as string;
  
  if (!verifyWebhook(req.body.toString(), signature)) {
    return res.status(401).send('Invalid signature');
  }
  
  const event = JSON.parse(req.body.toString());
  
  switch (event.event) {
    case 'payment.received':
      await handlePaymentReceived(event.data);
      break;
  }
  
  res.json({ received: true });
});
```

---

## Matching Payments to Orders

```typescript
async function handlePaymentReceived(data: SepayPayment) {
  // Extract reference code from description
  const refCode = data.referenceCode || extractRefFromDesc(data.description);
  
  // Find order
  const order = await db.order.findUnique({
    where: { referenceCode: refCode }
  });
  
  if (!order) {
    console.error(`No order found for ref: ${refCode}`);
    return;
  }
  
  // Verify amount
  if (data.amount !== order.totalAmount) {
    console.error(`Amount mismatch: ${data.amount} vs ${order.totalAmount}`);
    return;
  }
  
  // Mark as paid
  await db.order.update({
    where: { id: order.id },
    data: { status: 'PAID', paidAt: new Date() }
  });
}
```

---

## Idempotency

```typescript
// Store processed webhook IDs
const processed = await db.processedWebhook.findUnique({
  where: { eventId: event.data.id }
});

if (processed) {
  return res.json({ received: true }); // Already processed
}

await handleEvent(event);
await db.processedWebhook.create({ data: { eventId: event.data.id } });
```

---

⚡ PikaKit v3.9.67
