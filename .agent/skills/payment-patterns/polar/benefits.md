# Polar Benefits Automation

> Automatically deliver perks when customers purchase.

---

## Benefit Types

| Type | Delivery |
|------|----------|
| `github_repository` | Auto-grant repo access |
| `discord` | Auto-assign Discord role |
| `license_keys` | Auto-generate license |
| `downloadables` | Unlock file downloads |
| `custom` | Webhook to your server |

---

## Create GitHub Benefit

```typescript
const benefit = await polar.benefits.create({
  organizationId: process.env.POLAR_ORGANIZATION_ID,
  type: 'github_repository',
  description: 'Access to private repository',
  properties: {
    repository_owner: 'your-org',
    repository_name: 'private-repo',
    permission: 'pull', // or 'push', 'admin'
  },
});

// Attach to product
await polar.products.update({
  id: 'prod_xxx',
  benefitIds: [benefit.id],
});
```

---

## Create Discord Benefit

```typescript
const benefit = await polar.benefits.create({
  type: 'discord',
  description: 'Premium Discord role',
  properties: {
    guild_id: '123456789',
    role_id: '987654321',
  },
});
```

---

## Create License Key Benefit

```typescript
const benefit = await polar.benefits.create({
  type: 'license_keys',
  description: 'Software license',
  properties: {
    prefix: 'MYAPP',
    activations: {
      limit: 3, // Max 3 devices
      enable_user_admin: true,
    },
    expires: {
      days: 365, // 1 year validity
    },
  },
});
```

---

## Custom Benefit (Webhook)

```typescript
// Create custom benefit
const benefit = await polar.benefits.create({
  type: 'custom',
  description: 'API access',
  properties: {
    webhook_url: 'https://your-app.com/webhooks/polar/benefit',
  },
});

// Handle on your server
app.post('/webhooks/polar/benefit', (req, res) => {
  const { event, data } = req.body;
  
  if (event === 'benefit.granted') {
    // Generate API key for user
    await createApiKey(data.customer.email);
  }
  
  res.json({ received: true });
});
```

---

## Check Benefit Access

```typescript
async function hasAccess(userId: string, benefitId: string): boolean {
  const grants = await polar.benefits.listGrants({
    benefitId,
    customerId: userId,
  });
  
  return grants.items.some(grant => grant.isActive);
}
```

---

⚡ PikaKit v3.9.70
