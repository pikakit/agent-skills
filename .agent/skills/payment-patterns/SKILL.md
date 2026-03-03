---
name: payment-patterns
description: >-
  Payment integration with SePay (Vietnamese payments) and Polar (global SaaS monetization).
  Webhook security, subscription lifecycle, usage-based billing, automated benefits.
  Triggers on: payment, SePay, Polar, subscription, checkout, webhook, VietQR.
  Coordinates with: api-architect, security-scanner.
metadata:
  version: "2.0.0"
  category: "integration"
  triggers: "payment, SePay, Polar, subscription, checkout, webhook, VietQR"
  success_metrics: "webhook verified, idempotent, platform selected"
  coordinates_with: "api-architect, security-scanner"
---

# Payment Patterns — SePay & Polar Integration

> 2 platforms. Webhook signatures mandatory. Idempotency keys required. No raw card storage.

---

## Prerequisites

| Platform | Credential | Source |
|----------|-----------|--------|
| SePay | `SEPAY_API_KEY` | [sepay.vn](https://my.sepay.vn) → Settings → API |
| Polar | `POLAR_ACCESS_TOKEN` | [polar.sh](https://polar.sh/settings) → Developers |
| Polar | `POLAR_WEBHOOK_SECRET` | Polar webhook settings |

---

## When to Use

| Situation | Platform | Reference |
|-----------|----------|-----------|
| Vietnamese market (VND) | SePay | `sepay/overview.md` |
| VietQR / bank transfer | SePay | `sepay/sdk.md` |
| Global SaaS subscriptions | Polar | `polar/overview.md` |
| Usage-based billing | Polar | `polar/products.md` |
| Automated benefits | Polar | `polar/benefits.md` |
| Webhook handling | Both | `*/webhooks.md` |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Platform selection (SePay vs Polar) | API design (→ api-architect) |
| Webhook verification scripts | Security auditing (→ security-scanner) |
| Rate limit documentation | Payment processing |
| Subscription lifecycle guidance | PCI DSS certification |

**Expert decision skill:** Produces integration guidance. Does not call payment APIs.

---

## Platform Selection (Deterministic)

| Feature | SePay | Polar |
|---------|-------|-------|
| **Market** | Vietnam (VND) | Global |
| **Methods** | QR, bank transfer, cards | Cards, subscriptions, usage |
| **Banks** | 44+ Vietnamese banks | N/A |
| **Tax** | Manual | MoR (global compliance) |
| **Subscriptions** | Manual | Full lifecycle |
| **Benefits** | Manual | GitHub, Discord, licenses |
| **Rate limit** | 2 calls/sec | 300 req/min |
| **Portal** | No | Built-in |

**Choose SePay:** Vietnamese market, VND, bank transfers, VietQR
**Choose Polar:** Global SaaS, subscriptions, usage billing, automated benefits

---

## Core Principles (Fixed)

| Principle | Enforcement |
|-----------|-------------|
| Verify webhook signatures | Always; use raw body, not parsed JSON |
| Idempotency keys | All mutation operations |
| No raw card storage | Tokenization only |
| Test-first | Sandbox/test mode before production |
| Credentials via env vars | Never hardcode API keys |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNKNOWN_MARKET` | Yes | Market not vietnam or global |
| `ERR_UNKNOWN_PLATFORM` | Yes | Platform not sepay or polar |

**Zero internal retries.** Deterministic; same context = same guidance.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Skip webhook signature verification | Always verify with provided scripts |
| Store raw card numbers | Use tokenization |
| Process without idempotency keys | Use keys for all mutations |
| Ignore failed webhooks | Implement retry queue |
| Hardcode API keys | Use environment variables |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Webhook signature fails | Check secret key; verify raw body not parsed |
| Duplicate transactions | Implement idempotency keys |
| Payment not reflecting | Check webhook endpoint registration |
| Rate limit exceeded | SePay: 2/sec; Polar: 300/min |
| Sandbox vs production | Verify correct API keys for environment |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [sepay/overview.md](sepay/overview.md) | SePay auth, concepts | VN integration |
| [sepay/sdk.md](sepay/sdk.md) | SePay SDK | VN checkout |
| [sepay/webhooks.md](sepay/webhooks.md) | Bank notifications | VN webhooks |
| [polar/overview.md](polar/overview.md) | Polar auth, concepts | Global SaaS |
| [polar/products.md](polar/products.md) | Products/pricing | Subscriptions |
| [polar/checkouts.md](polar/checkouts.md) | Checkout flow | Payment flow |
| [polar/webhooks.md](polar/webhooks.md) | Event handling | Polar webhooks |
| [polar/benefits.md](polar/benefits.md) | Automated delivery | Benefits |
| [scripts/sepay-webhook-verify.js](scripts/sepay-webhook-verify.js) | SePay sig verify | Webhook setup |
| [scripts/polar-webhook-verify.js](scripts/polar-webhook-verify.js) | Polar sig verify | Webhook setup |
| [engineering-spec.md](references/engineering-spec.md) | Full spec | Architecture review |

**Selective reading:** Load ONLY the platform files relevant to your market.

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `api-architect` | Skill | API design |
| `security-scanner` | Skill | Payment security |
| `/cook` | Workflow | Implementation |

---

⚡ PikaKit v3.9.74
