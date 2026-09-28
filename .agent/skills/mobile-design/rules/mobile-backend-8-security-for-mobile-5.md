---
"title": "Mobile Backend: Security for Mobile through Related"
"kind": "reference"
"impact": "high"
"tags":
  - "mobile"
  - "backend"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Official documentation"
    "url": "https://www.w3.org/WAI/standards-guidelines/wcag/"
---

# Mobile Backend: Security for Mobile through Related

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **This file covers backend/API patterns SPECIFIC to mobile clients.**
> Generic backend patterns are in `nodejs-best-practices` and `api-patterns`.
> **Mobile backend is NOT the same as web backend. Different constraints, different patterns.**

---

## 8. Security for Mobile

### Device Attestation

```
VERIFY REAL DEVICE (not emulator/bot):
├── iOS: DeviceCheck API
│   └── Server verifies with Apple
├── Android: Play Integrity API (replaces SafetyNet)
│   └── Server verifies with Google
└── Fail closed: Reject if attestation fails
```

### Request Signing

```
CLIENT:
├── Create signature = HMAC(timestamp + path + body, secret)
├── Send: X-Signature: {signature}
├── Send: X-Timestamp: {timestamp}
└── Send: X-Device-ID: {device_id}

SERVER:
├── Validate timestamp (within 5 minutes)
├── Recreate signature with same inputs
├── Compare signatures
└── Reject if mismatch (tampering detected)
```

### Rate Limiting

```
MOBILE-SPECIFIC LIMITS:
├── Per device (X-Device-ID)
├── Per user (after auth)
├── Per endpoint (stricter for sensitive)
└── Sliding window preferred

HEADERS:
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
Retry-After: 60 (when 429)
```

---

> **This file covers backend/API patterns SPECIFIC to mobile clients.**
> Generic backend patterns are in `nodejs-best-practices` and `api-patterns`.
> **Mobile backend is NOT the same as web backend. Different constraints, different patterns.**

---

## 9. Monitoring & Analytics

### Required Headers from Mobile

```
Every mobile request should include:
├── X-App-Version: 2.1.0
├── X-Platform: ios | android
├── X-OS-Version: 17.0
├── X-Device-Model: iPhone15,2
├── X-Device-ID: uuid (persistent)
├── X-Request-ID: uuid (per request, for tracing)
├── Accept-Language: tr-TR
└── X-Timezone: Europe/Istanbul
```

### What to Log

```
FOR EACH REQUEST:
├── All headers above
├── Endpoint, method, status
├── Response time
├── Error details (if any)
└── User ID (if authenticated)

ALERTS:
├── Error rate > 5% per version
├── P95 latency > 2 seconds
├── Specific version crash spike
├── Auth failure spike (attack?)
└── Push delivery failure spike
```

---

> **This file covers backend/API patterns SPECIFIC to mobile clients.**
> Generic backend patterns are in `nodejs-best-practices` and `api-patterns`.
> **Mobile backend is NOT the same as web backend. Different constraints, different patterns.**

---

## 📝 MOBILE BACKEND CHECKLIST

### Before API Design
- [ ] Identified mobile-specific requirements?
- [ ] Planned offline behavior?
- [ ] Designed sync strategy?
- [ ] Considered bandwidth constraints?

### For Every Endpoint
- [ ] Response as small as possible?
- [ ] Pagination cursor-based?
- [ ] Proper caching headers?
- [ ] Mobile error format with actions?

### Authentication
- [ ] Token refresh implemented?
- [ ] Silent re-auth flow?
- [ ] Multi-device logout?
- [ ] Secure token storage guidance?

### Push Notifications
- [ ] FCM + APNs configured?
- [ ] Token lifecycle managed?
- [ ] Silent vs display push defined?
- [ ] Sensitive data NOT in push payload?

### Release
- [ ] Version check endpoint ready?
- [ ] Feature flags configured?
- [ ] Force update mechanism?
- [ ] Monitoring headers required?

---

> **Remember:** Mobile backend must be resilient to bad networks, respect battery life, and handle interrupted sessions gracefully. The client cannot be trusted, but it also cannot be hung up—provide offline capabilities and clear error recovery paths.

---

> **This file covers backend/API patterns SPECIFIC to mobile clients.**
> Generic backend patterns are in `nodejs-best-practices` and `api-patterns`.
> **Mobile backend is NOT the same as web backend. Different constraints, different patterns.**

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [../SKILL.md](../SKILL.md) | MFRI offline dependence dimension |
| [mobile-performance.md](mobile-performance-1-the-mobile-performance-mindset.md) | API performance, caching |
| [mobile-testing.md](mobile-testing-mobile-testing-mindset.md) | Backend integration testing |
| [engineering-spec.md](production-gates.md) | Full engineering spec |
| `api-architect` | API design patterns |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
