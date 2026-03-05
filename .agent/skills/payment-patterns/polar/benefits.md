---
name: polar-benefits
description: Polar automated benefit delivery — GitHub, Discord, license keys, downloadables, and custom webhook benefits
---

# Polar Benefits Automation

> Automatically deliver perks when customers purchase. **Benefits are auto-granted and auto-revoked.**

---

## Benefit Types

| Type | Delivery | Auto-Revoke | Setup |
|------|----------|:-----------:|-------|
| `github_repository` | Grant repo access via GitHub API | ✅ | Connect GitHub App |
| `discord` | Assign Discord role | ✅ | Connect Discord Bot |
| `license_keys` | Generate unique license key | ✅ Deactivate | Configure prefix + limits |
| `downloadables` | Unlock file downloads | ✅ | Upload files to Polar |
| `custom` | Webhook to your server | Manual | Implement webhook handler |

---

## Create GitHub Repository Benefit

```typescript
const benefit = await polar.benefits.create({
  organizationId: process.env.POLAR_ORGANIZATION_ID,
  type: 'github_repository',
  description: 'Access to premium source code',
  properties: {
    repository_owner: 'your-org',
    repository_name: 'premium-repo',
    permission: 'pull', // 'pull' | 'push' | 'admin'
  },
})

// Attach to product
await polar.products.update({
  id: 'prod_xxx',
  benefitIds: [benefit.id],
})
```

**What happens:**
- Customer purchases → Polar invites their GitHub account to repo
- Customer cancels → Polar removes access automatically

---

## Create Discord Benefit

```typescript
const benefit = await polar.benefits.create({
  organizationId: process.env.POLAR_ORGANIZATION_ID,
  type: 'discord',
  description: 'Premium Discord role',
  properties: {
    guild_id: '123456789012345678',
    role_id: '987654321098765432',
  },
})
```

**Prerequisites:**
1. Add Polar Discord Bot to your server
2. Place Polar Bot role **above** the benefit role in Discord settings
3. Customer must connect their Discord account on Polar

---

## Create License Key Benefit

```typescript
const benefit = await polar.benefits.create({
  organizationId: process.env.POLAR_ORGANIZATION_ID,
  type: 'license_keys',
  description: 'Software license',
  properties: {
    prefix: 'MYAPP',           // Key format: MYAPP-XXXX-XXXX-XXXX
    activations: {
      limit: 3,                // Max 3 devices
      enable_user_admin: true, // User can deactivate devices
    },
    expires: {
      days: 365,               // 1 year validity
    },
  },
})
```

### Validate License Key

```typescript
// In your application — validate license at startup
async function validateLicense(key: string): Promise<boolean> {
  try {
    const result = await polar.licenseKeys.validate({
      key,
      organizationId: process.env.POLAR_ORGANIZATION_ID,
    })
    return result.valid
  } catch {
    return false
  }
}

// Activate license on a device
async function activateLicense(key: string, deviceId: string) {
  const result = await polar.licenseKeys.activate({
    key,
    label: deviceId,           // e.g., machine ID or fingerprint
    organizationId: process.env.POLAR_ORGANIZATION_ID,
  })

  if (!result.valid) {
    throw new Error('License activation failed: ' + (result.error || 'unknown'))
  }
  return result
}
```

---

## Create Downloadable Benefit

```typescript
const benefit = await polar.benefits.create({
  organizationId: process.env.POLAR_ORGANIZATION_ID,
  type: 'downloadables',
  description: 'Premium templates pack',
  properties: {
    files: [
      { name: 'templates-v2.zip' }, // Upload via Polar dashboard
    ],
  },
})
```

---

## Custom Benefit (Webhook)

```typescript
// Create custom benefit
const benefit = await polar.benefits.create({
  organizationId: process.env.POLAR_ORGANIZATION_ID,
  type: 'custom',
  description: 'API access — 10,000 calls/month',
  properties: {
    note: 'Your API key will be emailed within 5 minutes',
  },
})
```

### Handle Custom Benefit Webhook

```typescript
import { validateEvent, WebhookVerificationError } from '@polar-sh/sdk/webhooks'

app.post('/webhooks/polar/benefits',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    // ALWAYS verify signature — even for benefit webhooks
    try {
      const event = validateEvent(
        req.body,
        req.headers as Record<string, string>,
        process.env.POLAR_WEBHOOK_SECRET!
      )

      switch (event.type) {
        case 'benefit.granted': {
          const { customer, benefit } = event.data
          // Generate API key for customer
          const apiKey = await createApiKey(customer.email, {
            rateLimit: 10000,
            expiresAt: benefit.expiresAt,
          })
          // Email API key to customer
          await sendEmail(customer.email, 'Your API Key', { apiKey })
          break
        }
        case 'benefit.revoked': {
          const { customer } = event.data
          // Deactivate API key
          await revokeApiKey(customer.email)
          break
        }
      }

      res.json({ received: true })
    } catch (err) {
      if (err instanceof WebhookVerificationError) {
        return res.status(403).json({ error: 'Invalid signature' })
      }
      console.error('Benefit webhook error:', err)
      res.status(500).json({ error: 'Processing failed' })
    }
  }
)
```

---

## Check Benefit Access

```typescript
async function hasAccess(customerId: string, benefitId: string): Promise<boolean> {
  try {
    const grants = await polar.benefits.listGrants({
      benefitId,
      customerId,
    })
    return grants.items.some(grant => grant.isGranted && !grant.isRevoked)
  } catch {
    return false
  }
}
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Process custom benefit webhook without verification | Always verify signature |
| Grant benefits manually | Attach to products → auto-delivery |
| Forget to handle `benefit.revoked` | Always revoke access on cancel |
| Use high activation limits | Limit to 3-5 devices (prevent sharing) |
| Skip license validation in app | Validate on every startup |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [products.md](products.md) | Attaching benefits to products |
| [webhooks.md](webhooks.md) | Benefit grant/revoke events |
| [checkouts.md](checkouts.md) | Customer flow before benefits |
| [overview.md](overview.md) | Benefit types overview |
