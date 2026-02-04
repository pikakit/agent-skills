# Authentication Security Patterns

> Specific implementation patterns for secure authentication systems.

---

## 2FA TOTP Implementation

### Flow (4 Steps)

```
1. User enables 2FA
   → Generate secret (32 chars, base32)
   → Create QR code with otpauth:// URI
   → Show QR to user

2. User scans with authenticator app
   → Google Authenticator, Authy, 1Password

3. User enters code to verify
   → Validate TOTP code
   → If valid, enable 2FA on account

4. Generate backup codes
   → 10 one-time codes (8 chars each)
   → Store hashed, mark used on consumption
```

### Code Pattern

```typescript
import { authenticator } from 'otplib';

// Generate secret
const secret = authenticator.generateSecret();

// Verify code
const isValid = authenticator.verify({ token: userCode, secret });
```

---

## Account Lockout

### Parameters

| Setting | Value | Reason |
|---------|-------|--------|
| Max attempts | 5 | Balance security vs UX |
| Lock duration | 15-30 min | Auto-unlock |
| Progressive delay | 2^n seconds | Slow brute force |

### Implementation

```typescript
const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

async function checkLockout(userId: string) {
  const attempts = await getFailedAttempts(userId);
  if (attempts.count >= MAX_ATTEMPTS) {
    const lockExpiry = attempts.lastAttempt + LOCK_DURATION_MS;
    if (Date.now() < lockExpiry) {
      throw new AccountLockedError(lockExpiry);
    }
    await resetAttempts(userId); // Auto-unlock
  }
}
```

---

## Password Reset Token

### Security Requirements

| Aspect | Requirement |
|--------|-------------|
| Expiry | 15 minutes |
| Storage | Hashed (SHA-256) |
| Usage | One-time only |
| Length | 32+ characters |
| Entropy | Cryptographically random |

### Flow

```
1. User requests reset
   → Generate secure token (crypto.randomBytes)
   → Hash token before storing
   → Send unhashed token via email

2. User clicks link
   → Hash received token
   → Compare with stored hash
   → If match + not expired → allow reset

3. After password change
   → Delete token from DB
   → Invalidate all existing sessions
```

### Code Pattern

```typescript
import crypto from 'crypto';

// Generate token
const token = crypto.randomBytes(32).toString('hex');
const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

// Store hashedToken, expires = Date.now() + 15 * 60 * 1000
// Send token (unhashed) to user email
```

---

## Session Security

### Best Practices

- Store JWT in `httpOnly` cookies (not localStorage)
- Set `SameSite=Strict` for CSRF protection
- Use short-lived access tokens (15 min)
- Use long-lived refresh tokens (7 days)
- Rotate refresh tokens on use

---

⚡ PikaKit v3.2.0
