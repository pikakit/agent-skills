---
name: stripe-patterns
description: Stripe integration patterns — Checkout, Subscriptions, Webhooks, Customer Portal, Refunds, and Stripe CLI testing
---

# Stripe Integration Patterns

> Secure Stripe integration for payments and subscriptions. **Webhook-first architecture. No card data stored locally.**

---

## Setup

```typescript
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})
```

**Environment Variables:**

| Variable | Source | Required |
|----------|--------|:--------:|
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API Keys | ✅ |
| `STRIPE_WEBHOOK_SECRET` | Stripe CLI or Dashboard → Webhooks → Signing secret | ✅ |
| `STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → API Keys (for client-side) | Client |

---

## One-Time Payments (Checkout)

```
Flow:
1. Create Checkout Session (server-side)
2. Redirect customer to Stripe-hosted checkout
3. Customer pays → redirected to success URL
4. Webhook: checkout.session.completed → grant access
```

```typescript
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  payment_method_types: ['card'],
  line_items: [{
    price_data: {
      currency: 'usd',
      product_data: { name: 'Product Name' },
      unit_amount: 2000, // $20.00 in cents
    },
    quantity: 1,
  }],
  success_url: `${process.env.APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.APP_URL}/cancel`,
  metadata: { orderId: order.id }, // For webhook matching
})

// Redirect to session.url
```

---

## Subscriptions (Billing)

```typescript
// Create subscription checkout
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  line_items: [{ price: 'price_xxx', quantity: 1 }],
  success_url: `${process.env.APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.APP_URL}/pricing`,
  metadata: { userId: user.id },
  subscription_data: {
    trial_period_days: 14,
    metadata: { userId: user.id },
  },
})
```

### Lifecycle Events

| Event | When | Action |
|-------|------|--------|
| `customer.subscription.created` | New subscription | Grant access |
| `customer.subscription.updated` | Plan change, renewal | Update tier |
| `customer.subscription.deleted` | Cancelled + period ended | Revoke access |
| `invoice.payment_succeeded` | Recurring payment OK | Log payment |
| `invoice.payment_failed` | Payment failed | Notify user, retry |

---

## Webhook Handling (CRITICAL)

```typescript
app.post('/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'] as string

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message)
      return res.status(400).json({ error: 'Invalid signature' })
    }

    // Idempotency check
    const processed = await db.stripeEvent.findUnique({
      where: { eventId: event.id }
    })
    if (processed) return res.json({ received: true })

    // Handle event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object as Stripe.Checkout.Session)
        break
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break
    }

    // Mark processed
    await db.stripeEvent.create({
      data: { eventId: event.id, type: event.type, processedAt: new Date() }
    })

    res.json({ received: true })
  }
)
```

> **⚠️ Never grant access on the success page.** Always use webhooks.

---

## Customer Portal

```typescript
// Create portal session for self-service management
const portalSession = await stripe.billingPortal.sessions.create({
  customer: customerId,
  return_url: `${process.env.APP_URL}/account`,
})

// Redirect to portalSession.url
// Customer can: update payment method, change plan, cancel, view invoices
```

---

## Refunds

```typescript
// Full refund
const refund = await stripe.refunds.create({
  payment_intent: 'pi_xxx',
})

// Partial refund
const partialRefund = await stripe.refunds.create({
  payment_intent: 'pi_xxx',
  amount: 500, // $5.00 in cents
})

// Handle refund webhook
case 'charge.refunded':
  const charge = event.data.object as Stripe.Charge
  await db.order.update({
    where: { stripePaymentIntentId: charge.payment_intent },
    data: {
      status: charge.amount_refunded === charge.amount ? 'REFUNDED' : 'PARTIAL_REFUND',
      refundedAmount: charge.amount_refunded,
    },
  })
  break
```

---

## Failed Payment Handling

| Attempt | Wait | Action |
|---------|------|--------|
| 1 | Immediate | Auto-retry by Stripe |
| 2 | 3 days | Email reminder |
| 3 | 5 days | Final warning |
| 4 | 7 days | Subscription canceled |

```typescript
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const userId = invoice.subscription_details?.metadata?.userId
  if (!userId) return

  await db.user.update({
    where: { id: userId },
    data: { subscriptionStatus: 'past_due' },
  })

  // Send email
  await sendEmail(invoice.customer_email!, 'payment-failed', {
    amount: (invoice.amount_due / 100).toFixed(2),
    nextRetry: invoice.next_payment_attempt
      ? new Date(invoice.next_payment_attempt * 1000)
      : null,
  })
}
```

---

## Stripe CLI (Local Testing)

```bash
# Install
brew install stripe/stripe-cli/stripe  # macOS
# or download from stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/webhooks/stripe

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger invoice.payment_failed
stripe trigger customer.subscription.deleted
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Grant access on success page | Use webhooks only |
| Store raw card numbers | Use Stripe Elements / Checkout |
| Skip webhook signature | Always `constructEvent()` |
| Ignore `invoice.payment_failed` | Handle payment failures + notify |
| Process without idempotency | Check event ID before processing |
| Use test keys in production | Validate env at startup |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [polar/overview.md](polar/overview.md) | Alternative: Polar (simpler, MoR) |
| [sepay/overview.md](sepay/overview.md) | Alternative: SePay (Vietnam market) |
| [scripts/polar-webhook-verify.js](scripts/polar-webhook-verify.js) | Webhook verification patterns |
