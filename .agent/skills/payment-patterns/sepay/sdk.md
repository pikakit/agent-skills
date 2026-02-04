# SePay SDK Integration

> Generate VietQR codes and process bank transfers.

---

## Generate VietQR Code

```typescript
import { SePay } from 'sepay-sdk';

const sepay = new SePay({
  apiKey: process.env.SEPAY_API_KEY,
  merchantId: process.env.SEPAY_MERCHANT_ID,
});

// Generate payment QR
const qr = await sepay.createQR({
  amount: 500000, // VND
  referenceCode: `ORDER-${orderId}`,
  description: 'Payment for Order #123',
  bankAccount: process.env.BANK_ACCOUNT,
  bankCode: 'VCB', // Vietcombank
});

// Response
// {
//   qrDataURL: 'data:image/png;base64,...',
//   qrContent: '00020101021238...',
//   referenceCode: 'ORDER-123',
//   expiresAt: '2025-01-01T12:00:00Z'
// }
```

---

## Supported Banks (44+)

| Bank Code | Name |
|-----------|------|
| `VCB` | Vietcombank |
| `TCB` | Techcombank |
| `ACB` | ACB |
| `VPB` | VPBank |
| `MBB` | MB Bank |
| `BIDV` | BIDV |
| `VIB` | VIB |
| `TPB` | TPBank |
| `OCB` | OCB |
| ... | 35+ more |

---

## Transaction Status Check

```typescript
// Check if payment received
const transaction = await sepay.getTransaction({
  referenceCode: 'ORDER-123',
});

if (transaction.status === 'COMPLETED') {
  // Mark order as paid
}
```

---

## Status Codes

| Status | Meaning |
|--------|---------|
| `PENDING` | QR generated, awaiting payment |
| `COMPLETED` | Payment received |
| `EXPIRED` | QR code expired |
| `CANCELLED` | Payment cancelled |

---

⚡ PikaKit v3.2.0
