---
title: Integrating Payment Processing
description: Implement secure payment processing with PikaKit - Stripe, Polar, PayPal, SePay
section: guides
category: workflows
order: 10
---

# Integrating Payment Processing

Learn how to integrate payment processing with **PikaKit** - from one-time payments to subscriptions, webhooks, and revenue optimization.

## Overview

- **Goal**: Implement secure payment processing with provider integration.
- **Time**: 25-50 minutes (vs 5-10 hours manually).
- **Agents Used**: `project-planner`, `backend-specialist`, `test-engineer`, `security-auditor`.
- **Workflows**: `/plan`, `/cook`, `/validate`.

## Prerequisites

- Existing application with user accounts.
- Payment provider account (Stripe, Polar, etc.).
- SSL certificate (required for payments).
- Business/tax information configured.

## Payment Providers

| Provider | Best For | Features | Setup Time |
|----------|----------|----------|------------|
| Stripe | Global, SaaS | Cards, wallets, subscriptions | 25 min |
| Polar | Creator economy | Subscriptions, products | 20 min |
| SePay | Vietnam market | Bank transfer, e-wallets | 20 min |
| PayPal | Global fallback | Cards, Balance | 30 min |

## Step-by-Step Workflow

### Step 1: Choose & Plan

Select provider based on your needs:

```bash
# For SaaS subscriptions
/plan "integrate Stripe for subscription billing"

# For creator platforms
/plan "integrate Polar payments"

# For Vietnamese market
/plan "integrate SePay for bank transfers"
```

### Step 2: Implement Stripe (Most Common)

Use the Tactical Workflow (`/cook`) to implement the full integration:

```bash
/cook "integrate Stripe payment processing with one-time and subscription payments"
```

**Implementation Details**:
- **Setup**: Installs Stripe SDK, configures API keys.
- **Database**: Adds `Payment` and `Subscription` models.
- **Endpoints**: `create-intent`, `confirm`, `webhooks`.
- **Frontend**: Adds Payment Form and Subscription UI components.

### Step 3: Implement Subscriptions

```bash
/cook "implement subscription tiers with monthly and annual billing"
```

**Features**:
- Synced Plan configuration (Starter, Pro, Enterprise).
- Proration and upgrades/downgrades.
- Trial period handling (e.g., 14 days).

### Step 4: Webhook Handling

Webhooks are critical for sync.

```bash
/cook "implement comprehensive Stripe webhook handling"
```

**Events Handled**:
- `payment_intent.succeeded`: Grant access.
- `payment_intent.payment_failed`: Notify user/retry.
- `customer.subscription.deleted`: Revoke access.

### Step 5: Implement Polar (for Creators)

```bash
/cook "integrate Polar for digital products and subscriptions"
```

**Features**:
- Polar SDK setup.
- Webhook handling (`order.created`, `subscription.created`).
- Customer portal integration.

### Step 6: Add Vietnamese Payment (SePay)

```bash
/cook "integrate SePay for bank transfer payments"
```

**Features**:
- Generating QR codes for bank transfers.
- Polling for payment status.
- Confirming transaction via SePay webhooks.

### Step 7: Revenue Optimization

**Coupons**:
```bash
/cook "Implement coupon and discount code system"
```

**Abandoned Cart**:
```bash
/cook "Add abandoned checkout email automation"
```

**Tax Calculation**:
```bash
/cook "Add automatic tax calculation with TaxJar integration"
```

### Step 8: Testing Payments

Run comprehensive payment tests:

```bash
/validate
```

**Coverage**:
- **Unit**: Payment intent logic, Coupon validation.
- **Integration**: Webhook processing, End-to-end payment flows.
- **Security**: Webhook signature verification, Idempotency checks.

### Step 9: Documentation

Generate integration docs:

```bash
/chronicle
```

## Complete Example: SaaS Subscription Platform

**Scenario**: Implement a 3-tier SaaS subscription system.

1.  **Plan**: `/plan "design SaaS payment system with Free, Pro, Enterprise tiers"`
2.  **Core**: `/cook "integrate Stripe with subscription models"`
3.  **Features**:
    *   `/cook "implement 14-day free trial"`
    *   `/cook "add team billing and seat management"`
    *   `/cook "implement usage-based billing logic"`
4.  **Verify**: `/validate`
5.  **Deploy**: `/launch`

## Best Practices

1.  **Idempotency**: Always check `idempotencyKey` to prevent double charges.
2.  **PCI Compliance**: Never store raw card numbers. Use Stripe Elements / Tokenization.
3.  **Webhooks**: Build robust retry mechanisms for failed webhooks.
4.  **Security**: Verify webhook signatures to prevent spoofing.

## Troubleshooting

### Issue: Webhook Failures
**Solution**:
```bash
# Test locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Fix with PikaKit
/fix "Stripe webhooks returning 400 error"
```

### Issue: Payment Declines
**Solution**:
```bash
/fix "analyze payment decline patterns in logs"
```

## Next Steps

- **[Implementing Authentication](./implementing-authentication.md)**: Secure your user accounts.
- **[Building a REST API](./building-rest-api.md)**: Create the backend.
- **[Feature Development](./feature-development.md)**: Add more value features.

---

**Key Takeaway**: PikaKit simplifies the complexity of payment integrations (webhooks, security, subscriptions) into reliable, automated workflows.
