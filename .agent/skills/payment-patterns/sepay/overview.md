---
name: sepay-overview
description: SePay Vietnamese payment gateway — REST API authentication, payment flow, VietQR concepts, and rate limits
---

# SePay Integration Overview

> Vietnamese payment gateway with VietQR and 44+ banks. Bank transfer monitoring with real-time webhooks.

---

## Authentication (REST API)

SePay uses a REST API with Bearer token authentication:

```typescript
const SEPAY_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://my.sepay.vn/userapi'
  : 'https://my.sepay.vn/userapi' // SePay uses same URL, test mode via dashboard

async function sepayRequest(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${SEPAY_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${process.env.SEPAY_API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(`SePay API error ${response.status}: ${error.message || response.statusText}`)
  }

  return response.json()
}
```

**Environment Variables:**

| Variable | Source | Required |
|----------|--------|:--------:|
| `SEPAY_API_KEY` | [my.sepay.vn](https://my.sepay.vn) → Settings → API Key | ✅ |
| `SEPAY_WEBHOOK_SECRET` | Webhook settings → Secret Key | For webhooks |
| `SEPAY_BANK_ACCOUNT` | Your linked bank account number | For QR |

---

## Core Concepts

| Concept | Description |
|---------|-------------|
| **VietQR** | QR code standard (NAPAS/EMVCo) for bank transfers in Vietnam |
| **Bank Monitoring** | SePay monitors your bank account for incoming transfers |
| **Reference Code** | Unique string in transfer description to match payments to orders |
| **Transfer Content** | Customer's transfer note — must contain reference code |

---

## Payment Flow

```
1. Your app creates order with unique referenceCode (e.g., "DH001")
2. Generate VietQR with referenceCode in transfer content
3. Customer scans QR with banking app (Vietcombank, MB, ...)
4. Customer transfers VND to your bank account
5. SePay detects incoming transfer via bank API integration
6. SePay sends webhook to your server with transaction details
7. Your server matches referenceCode → confirms order
8. Display payment success to customer
```

### Payment Status Flow

```
Order created (PENDING)
│
├── QR generated → waiting for transfer
│   ├── Transfer received (webhook) → amount matches → PAID ✅
│   ├── Transfer received → amount mismatch → UNDERPAID / OVERPAID ⚠️
│   └── No transfer within timeout → EXPIRED ❌
│
└── Manual cancellation → CANCELLED
```

---

## Rate Limits

| Endpoint | Limit | Action on Exceed |
|----------|-------|-----------------|
| All APIs | 2 requests/second | 429 Too Many Requests |

```typescript
// Simple rate limiter for SePay API calls
let lastCall = 0

async function rateLimitedRequest(endpoint: string, options?: RequestInit) {
  const now = Date.now()
  const elapsed = now - lastCall
  if (elapsed < 500) { // 2 calls/sec = 500ms between calls
    await new Promise(r => setTimeout(r, 500 - elapsed))
  }
  lastCall = Date.now()
  return sepayRequest(endpoint, options)
}
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Hardcode API key | Environment variable |
| Skip webhook verification | Always verify signature |
| Match payments by amount only | Match by referenceCode + amount |
| Ignore partial payments | Handle underpaid/overpaid cases |
| Poll API rapidly | Respect 2 req/sec limit |
| Trust transfer description blindly | Validate referenceCode format |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [sdk.md](sdk.md) | VietQR generation and transaction queries |
| [webhooks.md](webhooks.md) | Bank transfer notifications |
| [../scripts/sepay-webhook-verify.js](../scripts/sepay-webhook-verify.js) | Webhook signature verification |
| [../polar/overview.md](../polar/overview.md) | Alternative: global SaaS payments |
