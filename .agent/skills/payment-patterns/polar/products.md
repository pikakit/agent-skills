---
name: polar-products
description: Polar products and pricing — create, update, archive products with recurring, one-time, and usage-based pricing
---

# Polar Products & Pricing

> Configure products with subscriptions, one-time, and usage-based pricing.

---

## Create Product

```typescript
const product = await polar.products.create({
  name: 'Pro Plan',
  description: 'Full access to all features',
  organizationId: process.env.POLAR_ORGANIZATION_ID,
  prices: [
    {
      type: 'recurring',
      recurringInterval: 'month',
      priceAmount: 2900, // $29.00 in cents
      priceCurrency: 'usd',
    },
    {
      type: 'recurring',
      recurringInterval: 'year',
      priceAmount: 29000, // $290.00 (save 2 months)
      priceCurrency: 'usd',
    }
  ],
  benefits: ['benefit_github_access', 'benefit_discord_role'],
})
```

---

## Pricing Types

### Recurring (Subscriptions)

```typescript
{
  type: 'recurring',
  recurringInterval: 'month', // or 'year'
  priceAmount: 2900,          // $29.00 in cents
  priceCurrency: 'usd',
}
```

### One-Time

```typescript
{
  type: 'one_time',
  priceAmount: 9900,          // $99.00
  priceCurrency: 'usd',
}
```

### Usage-Based (Metered)

```typescript
{
  type: 'usage',
  usageType: 'metered',
  meter: {
    slug: 'api_calls',
    aggregation: 'sum',       // 'sum' | 'max' | 'last'
  },
  priceAmount: 10,            // $0.10 per unit
  priceCurrency: 'usd',
}
```

### Free Tier

```typescript
{
  type: 'one_time',
  priceAmount: 0,             // Free
  priceCurrency: 'usd',
}
```

---

## Report Usage (Metered Billing)

```typescript
// Report API usage at end of period or on each event
await polar.subscriptions.recordUsage({
  subscriptionId: 'sub_xxx',
  usage: {
    meter: 'api_calls',
    quantity: 1000,
    timestamp: new Date().toISOString(),
  },
})
```

### Usage Tracking Pattern

```typescript
// Middleware to track API usage per subscription
async function trackUsage(req: Request, res: Response, next: NextFunction) {
  const userId = req.user?.id
  if (!userId) return next()

  // Increment local counter (batch report, don't call API per request)
  await redis.incr(`usage:${userId}:api_calls`)
  next()
}

// Batch report every hour (cron job)
async function reportUsageBatch() {
  const keys = await redis.keys('usage:*:api_calls')

  for (const key of keys) {
    const userId = key.split(':')[1]
    const count = parseInt(await redis.getdel(key) || '0')
    if (count === 0) continue

    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user?.subscriptionId) continue

    await polar.subscriptions.recordUsage({
      subscriptionId: user.subscriptionId,
      usage: {
        meter: 'api_calls',
        quantity: count,
        timestamp: new Date().toISOString(),
      },
    })
  }
}
```

---

## Update Product

```typescript
await polar.products.update({
  id: 'prod_xxx',
  name: 'Pro Plan (Updated)',
  description: 'Updated description',
  benefitIds: ['benefit_github', 'benefit_discord', 'benefit_license'],
})
```

> **Note:** Updating prices may affect existing subscribers. Create a new price and archive the old one instead.

---

## Archive Product

```typescript
// Archive (soft-delete) — existing subscribers keep access
await polar.products.update({
  id: 'prod_xxx',
  isArchived: true,
})

// Archived products:
// - Not shown in new checkouts
// - Existing subscribers continue normally
// - Can be unarchived later
```

---

## List Products

```typescript
const products = await polar.products.list({
  organizationId: process.env.POLAR_ORGANIZATION_ID,
  isArchived: false, // Exclude archived
})

for (const product of products.items) {
  console.log(`${product.name}: ${product.prices.length} prices`)
}
```

---

## Common Product Structures

| SaaS Tier | Monthly | Yearly | Benefits |
|-----------|---------|--------|----------|
| **Free** | $0 | — | Community Discord |
| **Pro** | $29/mo | $290/yr | GitHub repo, Discord role |
| **Team** | $99/mo | $990/yr | All Pro + license keys + priority support |
| **Enterprise** | Custom | Custom | All Team + custom benefits |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Delete products | Archive (preserves subscriber access) |
| Update prices on existing products | Create new price, archive old |
| Report usage on every API call | Batch usage reporting (hourly/daily) |
| Hardcode product IDs | Store in env vars or config |
| Skip metered billing aggregation | Choose correct aggregation (sum/max/last) |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [checkouts.md](checkouts.md) | Creating checkout with productPriceId |
| [benefits.md](benefits.md) | Attaching benefits to products |
| [webhooks.md](webhooks.md) | Subscription events for products |
| [overview.md](overview.md) | Pricing models overview |
