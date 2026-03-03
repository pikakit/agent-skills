# Polar Integration Patterns

> Creator economy monetization with Polar.

---

## Overview

Polar is designed for:
- Open source maintainers
- Content creators
- Indie developers
- Community-based products

---

## Integration Flow

```
1. Create Polar account and connect to project
2. Set up products/subscriptions in Polar dashboard
3. Implement checkout using Polar SDK
4. Handle webhooks for access provisioning
```

---

## Setup

```typescript
import { Polar } from '@polar-sh/sdk';

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
});
```

---

## Creating Checkout Sessions

```typescript
// Create checkout for a product
const checkout = await polar.checkouts.create({
  productId: 'prod_xxx',
  successUrl: `${domain}/success`,
  metadata: { userId: user.id },
});

// Redirect user to checkout.url
```

---

## Webhook Events

| Event | Action |
|-------|--------|
| `checkout.created` | Log checkout attempt |
| `checkout.updated` | Update checkout status |
| `subscription.created` | Grant access |
| `subscription.updated` | Update tier |
| `subscription.canceled` | Revoke access |

### Webhook Handler

```typescript
app.post('/webhooks/polar', async (req, res) => {
  const signature = req.headers['polar-signature'];
  
  // Verify signature (use Polar SDK method)
  const event = polar.webhooks.verify(req.body, signature);
  
  switch (event.type) {
    case 'subscription.created':
      await grantAccess(event.data.subscription);
      break;
    case 'subscription.canceled':
      await revokeAccess(event.data.subscription);
      break;
  }
  
  res.json({ received: true });
});
```

---

## Benefits Provider (Access Control)

```typescript
// Check if user has active subscription
async function hasAccess(userId: string, benefitId: string): Promise<boolean> {
  const grants = await polar.benefits.listGrants({
    benefitId,
    userId,
  });
  
  return grants.items.some(grant => grant.isActive);
}
```

---

## Best Practices

1. **Start Simple**: Use Polar's hosted checkout first
2. **Webhook First**: Rely on webhooks, not redirect callbacks
3. **Idempotency**: Handle duplicate webhook deliveries
4. **Graceful Degradation**: If Polar is down, queue operations

---

⚡ PikaKit v3.9.74
