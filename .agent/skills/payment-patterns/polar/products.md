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
});
```

---

## Pricing Types

### Recurring (Subscriptions)

```typescript
{
  type: 'recurring',
  recurringInterval: 'month', // or 'year'
  priceAmount: 2900,
  priceCurrency: 'usd',
}
```

### One-Time

```typescript
{
  type: 'one_time',
  priceAmount: 9900,
  priceCurrency: 'usd',
}
```

### Usage-Based

```typescript
{
  type: 'usage',
  usageType: 'metered',
  meter: {
    slug: 'api_calls',
    aggregation: 'sum',
  },
  priceAmount: 10, // $0.10 per unit
  priceCurrency: 'usd',
}
```

---

## Report Usage

```typescript
// Report API usage for billing
await polar.subscriptions.recordUsage({
  subscriptionId: 'sub_xxx',
  usage: {
    meter: 'api_calls',
    quantity: 1000,
    timestamp: new Date().toISOString(),
  },
});
```

---

## List Products

```typescript
const products = await polar.products.list({
  organizationId: process.env.POLAR_ORGANIZATION_ID,
});
```

---

⚡ PikaKit v3.9.71
