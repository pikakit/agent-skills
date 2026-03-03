# Stripe Integration Patterns

> Secure Stripe integration for payments and subscriptions.

---

## One-Time Payments (Checkout)

### Flow

```
1. Create Checkout Session (server)
2. Redirect to Stripe Checkout
3. Handle success/cancel redirects
4. Verify via webhook (checkout.session.completed)
```

### Code Pattern

```typescript
// Create Checkout Session
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
  success_url: `${domain}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${domain}/cancel`,
  metadata: { orderId: order.id }, // For webhook matching
});
```

---

## Subscriptions (Billing)

### Lifecycle Events

| Event | Action |
|-------|--------|
| `customer.subscription.created` | Provision access |
| `customer.subscription.updated` | Update plan level |
| `customer.subscription.deleted` | Revoke access |
| `invoice.payment_succeeded` | Confirm payment |
| `invoice.payment_failed` | Notify user, retry |

### Subscription Creation

```typescript
const subscription = await stripe.subscriptions.create({
  customer: customerId,
  items: [{ price: priceId }],
  payment_behavior: 'default_incomplete',
  expand: ['latest_invoice.payment_intent'],
});
```

---

## Webhook Handling (CRITICAL)

### Signature Verification

```typescript
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    // Process event
    switch (event.type) {
      case 'checkout.session.completed':
        handleCheckoutComplete(event.data.object);
        break;
      case 'invoice.payment_failed':
        handlePaymentFailed(event.data.object);
        break;
    }
    
    res.json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});
```

### Idempotency

```typescript
// Use event ID for idempotency
const processed = await db.processedEvents.findUnique({
  where: { eventId: event.id }
});

if (processed) {
  return res.json({ received: true }); // Already processed
}

// Process and mark as handled
await handleEvent(event);
await db.processedEvents.create({ data: { eventId: event.id } });
```

---

## Failed Payment Handling

### Retry Strategy

| Attempt | Wait | Action |
|---------|------|--------|
| 1 | Immediate | Auto-retry |
| 2 | 3 days | Email reminder |
| 3 | 5 days | Final warning |
| 4 | 7 days | Subscription canceled |

---

## Security Checklist

- [ ] Webhook signature verification enabled
- [ ] Idempotency keys for all mutations
- [ ] HTTPS only for all endpoints
- [ ] No card data stored locally
- [ ] PCI compliance maintained

---

⚡ PikaKit v3.9.72
