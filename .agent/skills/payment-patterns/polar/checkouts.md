---
name: polar-checkouts
description: Polar checkout sessions — creation, options, error handling, discounts, success verification, and customer portal
---

# Polar Checkout Flow

> Create payment sessions and handle redirects. **Never store card data — Polar hosts the checkout page.**

---

## Create Checkout Session

```typescript
const checkout = await polar.checkouts.create({
  productPriceId: 'price_xxx',
  successUrl: `${process.env.APP_URL}/success?checkout_id={CHECKOUT_ID}`,
  cancelUrl: `${process.env.APP_URL}/pricing`,
  customerEmail: user.email,
  metadata: {
    userId: user.id, // CRITICAL: pass userId for webhook matching
  },
})

// Redirect customer to Polar-hosted checkout
redirect(checkout.url)
```

---

## Checkout Options

```typescript
const checkout = await polar.checkouts.create({
  productPriceId: 'price_xxx',
  successUrl: `${process.env.APP_URL}/success?checkout_id={CHECKOUT_ID}`,

  // Pre-fill customer info
  customerEmail: 'john@example.com',
  customerName: 'John Doe',

  // Attach metadata (available in webhooks)
  metadata: {
    userId: 'user_123',
    campaign: 'launch2025',
    referrer: 'partner_abc',
  },

  // Subscription trial
  subscriptionTrialDays: 14,

  // Discount code
  discountId: 'discount_xxx',

  // Custom styling
  theme: 'dark',

  // Allow promotion codes
  allowDiscountCodes: true,
})
```

---

## Error Handling

```typescript
async function createCheckout(userId: string, priceId: string) {
  try {
    const checkout = await polar.checkouts.create({
      productPriceId: priceId,
      successUrl: `${process.env.APP_URL}/success?checkout_id={CHECKOUT_ID}`,
      cancelUrl: `${process.env.APP_URL}/pricing`,
      metadata: { userId },
    })

    return { url: checkout.url }
  } catch (err) {
    if (err.statusCode === 422) {
      // Invalid price ID or product configuration
      throw new Error('Invalid product configuration')
    }
    if (err.statusCode === 429) {
      // Rate limited
      throw new Error('Too many requests, please try again')
    }
    if (err.statusCode === 401) {
      // Invalid access token
      console.error('Polar auth failed — check POLAR_ACCESS_TOKEN')
      throw new Error('Payment service unavailable')
    }
    // Network or unexpected error
    console.error('Checkout creation failed:', err)
    throw new Error('Unable to create checkout session')
  }
}
```

---

## After Checkout — Success Page

```typescript
// Success page: verify checkout completed
// IMPORTANT: Don't grant access here — use webhooks!
// This page is just for UX confirmation.

app.get('/success', async (req, res) => {
  const checkoutId = req.query.checkout_id as string
  if (!checkoutId) return res.redirect('/pricing')

  try {
    const checkout = await polar.checkouts.get({ id: checkoutId })

    if (checkout.status === 'succeeded') {
      // Show confirmation (access granted via webhook)
      res.render('success', {
        productName: checkout.product.name,
        customerEmail: checkout.customerEmail,
      })
    } else {
      // Checkout not completed
      res.redirect('/pricing')
    }
  } catch {
    res.redirect('/pricing')
  }
})
```

> **⚠️ Never grant access on the success page.** Customers can manipulate URLs. Always use webhooks to verify payment and grant access.

---

## Customer Portal

```typescript
// Generate self-service portal URL
// Customer can manage: subscriptions, invoices, payment methods
const portal = await polar.customerSessions.create({
  customerId: 'cus_xxx',
})

redirect(portal.customerPortalUrl)
```

### Portal Capabilities

| Feature | Available |
|---------|:---------:|
| View invoices | ✅ |
| Update payment method | ✅ |
| Cancel subscription | ✅ |
| Change plan (upgrade/downgrade) | ✅ |
| Download receipts | ✅ |

---

## Discounts / Coupons

```typescript
// Create a discount
const discount = await polar.discounts.create({
  organizationId: process.env.POLAR_ORGANIZATION_ID,
  name: 'Launch 50% Off',
  code: 'LAUNCH50',
  type: 'percentage',
  amount: 50,              // 50% off
  maxRedemptions: 100,     // Limit uses
  startsAt: '2025-01-01',
  endsAt: '2025-12-31',
  products: ['prod_xxx'],  // Apply to specific products
})

// Apply discount at checkout
const checkout = await polar.checkouts.create({
  productPriceId: 'price_xxx',
  successUrl: '...',
  discountId: discount.id,
})
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Grant access on success page | Grant access via webhook only |
| Skip `metadata.userId` | Always pass userId for webhook matching |
| Build custom checkout page | Use Polar-hosted checkout |
| Hardcode success/cancel URLs | Use environment variables |
| Ignore checkout errors | Handle 422, 429, 401 specifically |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [webhooks.md](webhooks.md) | Handle checkout.updated events |
| [products.md](products.md) | Product/price IDs for checkout |
| [overview.md](overview.md) | Authentication setup |
| [benefits.md](benefits.md) | What's delivered after payment |
