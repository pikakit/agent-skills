---
name: payment-patterns
description: >-
  Payment integration with SePay (Vietnamese payments) and Polar (global SaaS monetization).
  Webhook security, subscription lifecycle, usage-based billing, automated benefits.
  Triggers on: payment, SePay, Polar, subscription, checkout, webhook, VietQR.
  Coordinates with: api-architect, security-scanner.
allowed-tools: Read, Write, Edit, Glob, Grep
metadata:
  version: "2.0.0"
  category: "integration"
  triggers: "payment, SePay, Polar, subscription, checkout, webhook, VietQR"
  success_metrics: "webhook verified, idempotent, subscription handled"
  coordinates_with: "api-architect, security-scanner"
---

# Payment Integration

> SePay for Vietnamese market. Polar for global SaaS. Secure, automated, production-ready.

---

## Prerequisites

**API Access:**
- **SePay**: API key from [sepay.vn](https://my.sepay.vn) → Settings → API
- **Polar**: Access token from [polar.sh](https://polar.sh/settings) → Developers

**Environment Variables:**
```bash
# SePay
SEPAY_API_KEY=your_sepay_api_key

# Polar
POLAR_ACCESS_TOKEN=your_polar_access_token
POLAR_WEBHOOK_SECRET=your_webhook_secret
```

---

## When to Use

| Situation | Platform | Reference |
|-----------|----------|-----------|
| Vietnamese market (VND) | SePay | `sepay/overview.md` |
| VietQR/bank transfer | SePay | `sepay/sdk.md` |
| Global SaaS subscriptions | Polar | `polar/overview.md` |
| Usage-based billing | Polar | `polar/products.md` |
| Automated benefits | Polar | `polar/benefits.md` |
| Webhook handling | Both | `*/webhooks.md` |

---

## Platform Selection

| Feature | SePay | Polar |
|---------|-------|-------|
| Payment methods | QR, bank transfer, cards | Cards, subscriptions, usage-based |
| Bank monitoring | 44+ VN banks | N/A |
| Tax handling | Manual | MoR (global compliance) |
| Subscriptions | Manual | Full lifecycle |
| Benefits automation | Manual | GitHub, Discord, licenses |
| Rate limit | 2 calls/sec | 300 req/min |
| Customer portal | No | Built-in |

**Choose SePay**: Vietnamese market, VND, bank transfers, VietQR
**Choose Polar**: Global SaaS, subscriptions, usage billing, automated benefits

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| `sepay/overview.md` | SePay auth, concepts | VN integration |
| `sepay/sdk.md` | SePay SDK integration | VN checkout |
| `sepay/webhooks.md` | Bank notification handling | VN webhooks |
| `polar/overview.md` | Polar auth, concepts | Global SaaS |
| `polar/products.md` | Product/pricing setup | Subscriptions |
| `polar/checkouts.md` | Checkout flow | Payment flow |
| `polar/webhooks.md` | Event handling | Polar webhooks |
| `polar/benefits.md` | Automated delivery | GitHub/Discord/licenses |

---

## 🔧 Scripts

| Script | Purpose | Command |
|--------|---------|---------|
| `sepay-webhook-verify.js` | SePay signature verification | `node scripts/sepay-webhook-verify.js` |
| `polar-webhook-verify.js` | Polar signature verification | `node scripts/polar-webhook-verify.js` |

---

## Quick Start

### SePay (Vietnamese)

1. Load `sepay/overview.md` for auth
2. Load `sepay/sdk.md` for integration
3. Load `sepay/webhooks.md` for notifications
4. Use `scripts/sepay-webhook-verify.js`

### Polar (Global SaaS)

1. Load `polar/overview.md` for auth
2. Load `polar/products.md` for products
3. Load `polar/checkouts.md` for checkout
4. Load `polar/webhooks.md` for events
5. Use `scripts/polar-webhook-verify.js`

---

## Core Principles

| Principle | Application |
|-----------|-------------|
| **Verify Signatures** | Always verify webhook signatures |
| **Idempotency** | Use idempotency keys for mutations |
| **Test First** | Use sandbox/test mode before prod |
| **Store Minimally** | Don't store full card numbers |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Skip signature verification | Always verify webhooks |
| Store raw card data | Use tokenization |
| Process without idempotency | Use idempotency keys |
| Ignore failed webhooks | Implement retry queue |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Webhook signature fails | Check secret key, verify raw body not parsed |
| Duplicate transactions | Implement idempotency keys |
| Payment not reflecting | Check webhook endpoint registered correctly |
| Rate limit exceeded | SePay: 2 calls/sec; Polar: 300 req/min |
| Sandbox vs Production | Verify using correct API keys for environment |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `api-architect` | Skill | API design |
| `security-scanner` | Skill | Payment security |
| `/cook` | Workflow | Implement payments |

---

⚡ PikaKit v3.9.66
