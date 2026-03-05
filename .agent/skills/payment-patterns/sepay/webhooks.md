---
name: sepay-webhooks
description: SePay webhook handling — signature verification, payment matching, partial payments, idempotency, and error recovery
---

# SePay Webhook Handling

> Receive real-time bank transfer notifications. **Always verify signatures. Always check amounts.**

---

## Webhook Events

| Event | Description | Action |
|-------|-------------|--------|
| `payment.received` | Bank transfer detected | Match referenceCode, verify amount |
| `payment.confirmed` | Payment confirmed by bank | Finalize order |
| `payment.failed` | Payment reversed/failed | Revert order status |

---

## Webhook Payload

```json
{
  "id": 12345,
  "gateway": "VCB",
  "transactionDate": "2025-01-15 10:30:00",
  "accountNumber": "1234567890",
  "subAccount": null,
  "transferType": "in",
  "transferAmount": 500000,
  "accumulated": 15000000,
  "code": null,
  "content": "DH001 thanh toan don hang",
  "referenceCode": "DH001",
  "description": "NGUYEN VAN A chuyen tien"
}
```

---

## Webhook Handler (Express)

```typescript
import { verifySepayWebhook } from '../scripts/sepay-webhook-verify.js'

app.post('/webhooks/sepay',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const payload = req.body.toString()
    const signature = req.headers['x-sepay-signature'] as string

    // 1. Verify signature
    const verification = verifySepayWebhook(payload, signature, process.env.SEPAY_WEBHOOK_SECRET!)
    if (!verification.valid) {
      console.error(`SePay webhook failed: ${verification.error}`)
      return res.status(401).json({ error: 'Invalid signature' })
    }

    // 2. Parse payload
    let event: SepayWebhookPayload
    try {
      event = JSON.parse(payload)
    } catch {
      return res.status(400).json({ error: 'Invalid JSON' })
    }

    // 3. Idempotency check
    const existing = await db.processedWebhook.findUnique({
      where: { eventId: String(event.id) }
    })
    if (existing) {
      return res.json({ received: true }) // Already processed
    }

    // 4. Process
    try {
      if (event.transferType === 'in') {
        await handleIncomingTransfer(event)
      }

      // 5. Mark processed
      await db.processedWebhook.create({
        data: { eventId: String(event.id), processedAt: new Date() }
      })

      res.json({ received: true })
    } catch (err) {
      console.error('Webhook processing error:', err)
      res.status(500).json({ error: 'Processing failed' })
    }
  }
)
```

### Hono Version

```typescript
import { sepayWebhookMiddlewareHono } from '../scripts/sepay-webhook-verify.js'

app.post('/webhooks/sepay',
  sepayWebhookMiddlewareHono(process.env.SEPAY_WEBHOOK_SECRET!),
  async (c) => {
    const event = c.get('sepayEvent')

    const existing = await db.processedWebhook.findUnique({
      where: { eventId: String(event.id) }
    })
    if (existing) return c.json({ received: true })

    if (event.transferType === 'in') {
      await handleIncomingTransfer(event)
    }

    await db.processedWebhook.create({
      data: { eventId: String(event.id), processedAt: new Date() }
    })

    return c.json({ received: true })
  }
)
```

---

## Payment Matching

```typescript
async function handleIncomingTransfer(event: SepayWebhookPayload) {
  // Extract reference code from transfer content
  const refCode = extractReferenceCode(event.content)
  if (!refCode) {
    console.warn(`No reference code found in: "${event.content}"`)
    await logUnmatchedTransfer(event)
    return
  }

  // Find order
  const order = await db.order.findFirst({
    where: { referenceCode: refCode, status: { in: ['PENDING'] } }
  })

  if (!order) {
    console.warn(`No pending order for ref: ${refCode}`)
    await logUnmatchedTransfer(event)
    return
  }

  // Verify amount
  const amount = event.transferAmount
  if (amount === order.totalAmount) {
    // Exact match — mark as paid
    await db.order.update({
      where: { id: order.id },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        paidAmount: amount,
        transactionId: String(event.id),
        payerName: event.description,
      },
    })
    console.log(`Order ${order.id} paid: ${amount} VND`)

  } else if (amount < order.totalAmount) {
    // Underpaid — notify, don't auto-confirm
    await db.order.update({
      where: { id: order.id },
      data: {
        status: 'UNDERPAID',
        paidAmount: amount,
        transactionId: String(event.id),
      },
    })
    console.warn(`Order ${order.id} underpaid: ${amount} vs ${order.totalAmount}`)
    await notifyAdmin(`Underpaid order ${order.id}: received ${amount}, expected ${order.totalAmount}`)

  } else {
    // Overpaid — process order, flag for refund
    await db.order.update({
      where: { id: order.id },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        paidAmount: amount,
        transactionId: String(event.id),
        needsRefund: true,
        refundAmount: amount - order.totalAmount,
      },
    })
    console.warn(`Order ${order.id} overpaid: ${amount} vs ${order.totalAmount}`)
    await notifyAdmin(`Overpaid order ${order.id}: refund ${amount - order.totalAmount} VND`)
  }
}
```

---

## Reference Code Extraction

```typescript
// Reference codes follow pattern: DH + orderId (e.g., "DH001", "DH12345")
function extractReferenceCode(content: string): string | null {
  if (!content) return null

  // Try exact match first
  const match = content.match(/\b(DH\d+)\b/i)
  if (match) return match[1].toUpperCase()

  // Try flexible match (customers may add spaces)
  const flexible = content.replace(/\s+/g, '').match(/(DH\d+)/i)
  if (flexible) return flexible[1].toUpperCase()

  return null
}
```

> **Tip:** Choose a reference code prefix that's unlikely to appear in normal transfer descriptions. `DH` (đơn hàng) works well for Vietnamese contexts.

---

## Webhook Types

```typescript
interface SepayWebhookPayload {
  id: number
  gateway: string              // Bank code: 'VCB', 'TCB', etc.
  transactionDate: string      // '2025-01-15 10:30:00'
  accountNumber: string        // Your bank account
  subAccount: string | null
  transferType: 'in' | 'out'   // 'in' = incoming
  transferAmount: number       // Amount in VND
  accumulated: number          // Running balance
  code: string | null
  content: string              // Transfer description (contains refCode)
  referenceCode: string | null // May be parsed by SePay
  description: string          // Sender info
}
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Skip signature verification | Always verify (use sepay-webhook-verify.js) |
| Match by amount only | Match by referenceCode + verify amount |
| Auto-confirm underpaid orders | Flag for admin review |
| Ignore unmatched transfers | Log for reconciliation |
| Use `await` in non-async handler | Always use async handler |
| Process webhooks without idempotency | Check event ID before processing |
| Trust transfer content format | Parse flexibly (customers add spaces/text) |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [overview.md](overview.md) | Authentication, payment flow |
| [sdk.md](sdk.md) | VietQR generation, transaction queries |
| [../scripts/sepay-webhook-verify.js](../scripts/sepay-webhook-verify.js) | Verification script |
| [../polar/webhooks.md](../polar/webhooks.md) | Compare: Polar webhook patterns |
