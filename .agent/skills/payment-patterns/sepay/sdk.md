---
name: sepay-sdk
description: SePay VietQR generation, transaction queries, payment expiry handling, and error patterns
---

# SePay SDK — VietQR & Transactions

> Generate VietQR codes and track bank transfer payments.

---

## Generate VietQR Code

SePay provides a VietQR generation API following the NAPAS/EMVCo standard:

```typescript
// Generate QR for bank transfer
async function createPaymentQR(order: { id: string; amount: number }) {
  const referenceCode = `DH${order.id}` // Prefix for easy identification

  // SePay QR URL format (static QR — no API call needed)
  const qrUrl = new URL('https://qr.sepay.vn/img')
  qrUrl.searchParams.set('acc', process.env.SEPAY_BANK_ACCOUNT!)
  qrUrl.searchParams.set('bank', process.env.SEPAY_BANK_CODE!) // e.g., 'VCB'
  qrUrl.searchParams.set('amount', String(order.amount))
  qrUrl.searchParams.set('des', referenceCode) // Transfer description
  qrUrl.searchParams.set('template', 'compact') // 'compact' | 'compact2' | 'print'

  return {
    qrImageUrl: qrUrl.toString(),
    referenceCode,
    amount: order.amount,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 min expiry
  }
}
```

### Usage in API Route

```typescript
app.post('/api/orders/:id/pay', async (req, res) => {
  const order = await db.order.findUnique({ where: { id: req.params.id } })
  if (!order) return res.status(404).json({ error: 'Order not found' })
  if (order.status !== 'PENDING') return res.status(400).json({ error: 'Order not payable' })

  try {
    const payment = await createPaymentQR(order)

    // Store reference code for webhook matching
    await db.order.update({
      where: { id: order.id },
      data: {
        referenceCode: payment.referenceCode,
        paymentExpiresAt: payment.expiresAt,
      },
    })

    res.json({
      qrImageUrl: payment.qrImageUrl,
      referenceCode: payment.referenceCode,
      amount: payment.amount,
      expiresAt: payment.expiresAt,
    })
  } catch (err) {
    console.error('QR generation failed:', err)
    res.status(500).json({ error: 'Unable to generate payment QR' })
  }
})
```

---

## Check Transaction via API

```typescript
// Query transactions from your linked bank account
async function getTransactions(filters?: {
  accountNumber?: string
  fromDate?: string  // YYYY-MM-DD
  toDate?: string
  limit?: number
}) {
  const params = new URLSearchParams()
  if (filters?.accountNumber) params.set('account_number', filters.accountNumber)
  if (filters?.fromDate) params.set('transaction_date_min', filters.fromDate)
  if (filters?.toDate) params.set('transaction_date_max', filters.toDate)
  params.set('limit', String(filters?.limit || 20))

  return sepayRequest(`/transactions/list?${params}`)
}

// Check if specific payment arrived
async function checkPayment(referenceCode: string): Promise<boolean> {
  const result = await getTransactions({
    fromDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  })

  return result.transactions?.some(
    (tx: any) => tx.transaction_content?.includes(referenceCode)
  ) ?? false
}
```

---

## Supported Banks (44+)

| Bank Code | Name | Popular |
|-----------|------|:-------:|
| `VCB` | Vietcombank | ⭐ |
| `TCB` | Techcombank | ⭐ |
| `MBB` | MB Bank | ⭐ |
| `ACB` | ACB | ⭐ |
| `BIDV` | BIDV | ⭐ |
| `VPB` | VPBank | ⭐ |
| `TPB` | TPBank | |
| `VIB` | VIB | |
| `OCB` | OCB | |
| `MSB` | Maritime Bank | |
| `SHB` | SHB | |
| `STB` | Sacombank | |
| `EIB` | Eximbank | |
| `HDB` | HDBank | |
| `SCB` | SCB | |

Full list: [sepay.vn/banks](https://my.sepay.vn)

---

## Payment Expiry Handling

```typescript
// Cron job: expire unpaid orders (run every 5 minutes)
async function expireStaleOrders() {
  const expired = await db.order.updateMany({
    where: {
      status: 'PENDING',
      paymentExpiresAt: { lt: new Date() },
    },
    data: { status: 'EXPIRED' },
  })

  if (expired.count > 0) {
    console.log(`Expired ${expired.count} unpaid orders`)
  }
}
```

### Client-Side Countdown

```typescript
// Show countdown timer to customer
function PaymentTimer({ expiresAt }: { expiresAt: Date }) {
  const [remaining, setRemaining] = useState(
    Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000))
  )

  useEffect(() => {
    const timer = setInterval(() => {
      const secs = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000))
      setRemaining(secs)
      if (secs <= 0) clearInterval(timer)
    }, 1000)
    return () => clearInterval(timer)
  }, [expiresAt])

  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  return <span>{mins}:{secs.toString().padStart(2, '0')}</span>
}
```

---

## Transaction Status Codes

| Status | Meaning | Action |
|--------|---------|--------|
| `PENDING` | QR generated, awaiting payment | Show QR + countdown |
| `PAID` | Transfer received + verified | Grant access |
| `EXPIRED` | QR timeout (no payment) | Offer to regenerate |
| `CANCELLED` | User/admin cancelled | Return to cart |
| `UNDERPAID` | Amount less than expected | Notify customer |
| `OVERPAID` | Amount more than expected | Process + flag for refund |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Use fictional `SePay` class | Use REST API with `fetch` |
| Generate QR without expiry | Always set expiry (15-30 min) |
| Skip amount verification | Always verify amount matches order |
| Match by description text only | Use structured referenceCode prefix |
| Let orders stay PENDING forever | Cron job to expire stale orders |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [overview.md](overview.md) | Authentication, core concepts |
| [webhooks.md](webhooks.md) | Real-time payment notifications |
| [../scripts/sepay-webhook-verify.js](../scripts/sepay-webhook-verify.js) | Signature verification |
