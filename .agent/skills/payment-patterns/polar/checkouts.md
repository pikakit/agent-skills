# Polar Checkout Flow

> Create payment sessions and handle redirects.

---

## Create Checkout Session

```typescript
const checkout = await polar.checkouts.create({
  productPriceId: 'price_xxx',
  successUrl: `${process.env.APP_URL}/success?checkout_id={CHECKOUT_ID}`,
  cancelUrl: `${process.env.APP_URL}/cancel`,
  customerEmail: user.email,
  metadata: {
    userId: user.id,
  },
});

// Redirect to checkout.url
redirect(checkout.url);
```

---

## Checkout Options

```typescript
const checkout = await polar.checkouts.create({
  productPriceId: 'price_xxx',
  successUrl: '...',
  
  // Pre-fill customer info
  customerEmail: 'john@example.com',
  customerName: 'John Doe',
  
  // Attach metadata
  metadata: {
    userId: 'user_123',
    campaign: 'launch2025',
  },
  
  // Custom styling
  theme: 'dark',
  
  // Trial period
  subscriptionTrialDays: 14,
});
```

---

## After Checkout

```typescript
// Success page: verify checkout completed
app.get('/success', async (req, res) => {
  const checkoutId = req.query.checkout_id;
  
  const checkout = await polar.checkouts.get({ id: checkoutId });
  
  if (checkout.status === 'succeeded') {
    // Grant access
    await grantAccess(checkout.metadata.userId);
    res.render('success');
  } else {
    res.redirect('/pricing');
  }
});
```

---

## Customer Portal

```typescript
// Generate customer portal URL for self-service
const portal = await polar.customers.getPortalUrl({
  customerId: 'cus_xxx',
});

// Redirect to portal.url
// Customer can manage subscriptions, invoices, payment methods
```

---

⚡ PikaKit v3.9.73
