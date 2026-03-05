---
name: polar-overview
description: Polar SDK authentication, core concepts, pricing models, subscription lifecycle, and rate limits
---

# Polar Integration Overview

> Global SaaS monetization with subscriptions, usage billing, and automated benefits.

---

## Authentication

```typescript
import { Polar } from '@polar-sh/sdk'

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
})
```

**Environment Variables:**

| Variable | Source | Required |
|----------|--------|:--------:|
| `POLAR_ACCESS_TOKEN` | [polar.sh](https://polar.sh/settings) → Developers → Access Tokens | ✅ |
| `POLAR_ORGANIZATION_ID` | Organization settings → ID | ✅ |
| `POLAR_WEBHOOK_SECRET` | Webhook settings → Secret | For webhooks |

**Sandbox Mode:**

```typescript
// Use sandbox for development/testing
const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: 'sandbox', // 'sandbox' | 'production'
})
```

---

## Core Concepts

| Concept | Description |
|---------|-------------|
| **Products** | What you sell (subscriptions, one-time, usage-based) |
| **Prices** | How much it costs (recurring, one-time, metered) |
| **Checkouts** | Payment sessions — redirect customer to Polar-hosted page |
| **Subscriptions** | Recurring billing with lifecycle management |
| **Benefits** | Auto-delivered perks (GitHub, Discord, licenses, custom) |
| **Customers** | Polar manages customer records and portal |
| **MoR** | Merchant of Record — Polar handles global tax compliance |
| **Meters** | Usage counters for metered billing |

---

## Pricing Models

| Model | Use Case | Billing |
|-------|----------|---------|
| **Recurring** | Monthly/yearly subscriptions | Auto-charges on cycle |
| **One-time** | Single purchases, lifetime deals | Charge once |
| **Usage-based** | API calls, credits, compute | Charge at period end |
| **Pay what you want** | Tips, donations, flexible pricing | Customer sets amount |
| **Free** | Free tier with benefits | No charge |

---

## Subscription Lifecycle

```
Customer subscribes
│
├── active
│   ├── Renews automatically
│   ├── Can upgrade/downgrade
│   └── Benefits active
│
├── past_due (payment failed)
│   ├── Polar retries automatically
│   ├── Benefits still active (grace period)
│   └── → active (if retry succeeds)
│   └── → canceled (if all retries fail)
│
├── canceled
│   ├── Access until end of billing period
│   ├── Benefits revoked at period end
│   └── Customer can resubscribe
│
└── expired
    ├── Billing period ended after cancellation
    ├── All benefits revoked
    └── Customer must create new subscription
```

### Handle Lifecycle in Code

```typescript
async function checkAccess(userId: string): Promise<boolean> {
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user?.subscriptionId) return false

  // Allow access during active and past_due (grace period)
  return ['active', 'past_due'].includes(user.subscriptionStatus)
}

async function handleSubscriptionUpdate(data: PolarSubscription) {
  await db.user.update({
    where: { id: data.metadata?.userId },
    data: {
      subscriptionStatus: data.status,
      currentPeriodEnd: new Date(data.currentPeriodEnd),
      cancelAtPeriodEnd: data.cancelAtPeriodEnd,
    },
  })
}
```

---

## Benefit Types

| Type | Delivery | Revocation |
|------|----------|-----------|
| `github_repository` | Auto-grant repo access via GitHub API | Auto-revoke on cancel |
| `discord` | Auto-assign Discord role | Auto-remove on cancel |
| `license_keys` | Auto-generate unique license key | Deactivate on cancel |
| `downloadables` | Unlock file downloads | Revoke access on cancel |
| `custom` | Webhook to your server | Webhook revocation event |

---

## Rate Limits

| Type | Limit | Action on Exceed |
|------|-------|-----------------|
| API requests | 300/minute | 429 Too Many Requests |

```typescript
// Handle rate limiting
try {
  const result = await polar.products.list({ organizationId: orgId })
} catch (err) {
  if (err.statusCode === 429) {
    const retryAfter = err.headers?.['retry-after'] || 60
    await sleep(retryAfter * 1000)
    // Retry
  }
}
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Hardcode access token | Environment variable |
| Skip sandbox testing | Always test in sandbox first |
| Poll API for payment status | Use webhooks |
| Ignore subscription lifecycle states | Handle all states (active, past_due, canceled) |
| Store payment data in your DB | Let Polar manage via MoR |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [products.md](products.md) | Creating products and pricing |
| [checkouts.md](checkouts.md) | Payment session flow |
| [webhooks.md](webhooks.md) | Event handling |
| [benefits.md](benefits.md) | Automated benefit delivery |
| [../stripe.md](../stripe.md) | Alternative: Stripe patterns |
