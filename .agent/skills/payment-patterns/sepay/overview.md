# SePay Integration Overview

> Vietnamese payment gateway with VietQR and 44+ banks.

---

## Authentication

```typescript
const sepay = new SePay({
  apiKey: process.env.SEPAY_API_KEY,
  merchantId: process.env.SEPAY_MERCHANT_ID,
});
```

**Environment Variables:**
- `SEPAY_API_KEY`: API key from SePay dashboard
- `SEPAY_MERCHANT_ID`: Your merchant ID
- `SEPAY_WEBHOOK_SECRET`: Webhook signature secret

---

## Core Concepts

| Concept | Description |
|---------|-------------|
| **VietQR** | QR code for bank transfers (NAPAS standard) |
| **Bank Monitoring** | Real-time notifications for incoming transfers |
| **Reference Code** | Unique identifier for matching payments |

---

## Payment Flow

```
1. Generate VietQR with unique reference code
2. Customer scans and transfers to your bank account
3. SePay detects incoming transfer via bank API
4. Webhook fires with transaction details
5. Match reference code → confirm order
```

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| All APIs | 2 calls/second |

---

## Sandbox vs Production

| Mode | API URL |
|------|---------|
| Sandbox | `https://sandbox.sepay.vn/api` |
| Production | `https://api.sepay.vn/api` |

---

⚡ PikaKit v3.9.68
