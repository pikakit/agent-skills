# Polar Integration Overview

> Global SaaS monetization with subscriptions, usage billing, and automated benefits.

---

## Authentication

```typescript
import { Polar } from '@polar-sh/sdk';

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
});
```

**Environment Variables:**
- `POLAR_ACCESS_TOKEN`: API token from Polar dashboard
- `POLAR_ORGANIZATION_ID`: Your organization ID
- `POLAR_WEBHOOK_SECRET`: Webhook signature secret

---

## Core Concepts

| Concept | Description |
|---------|-------------|
| **Products** | What you sell (subscriptions, one-time, usage) |
| **Checkouts** | Payment sessions for products |
| **Subscriptions** | Recurring billing lifecycle |
| **Benefits** | Auto-delivered perks (GitHub, Discord, licenses) |
| **MoR** | Merchant of Record (Polar handles tax) |

---

## Pricing Models

| Model | Use Case |
|-------|----------|
| **Recurring** | Monthly/yearly subscriptions |
| **One-time** | Single purchases |
| **Usage-based** | Pay-per-use, API calls, credits |
| **Pay what you want** | Tips, donations |

---

## Benefit Types

| Type | Description |
|------|-------------|
| `github_repository` | Private repo access |
| `discord` | Discord role assignment |
| `license_keys` | Software license generation |
| `downloadables` | File downloads |
| `custom` | Webhook-triggered custom logic |

---

## Rate Limits

| Type | Limit |
|------|-------|
| API requests | 300/minute |

---

⚡ PikaKit v3.9.71
