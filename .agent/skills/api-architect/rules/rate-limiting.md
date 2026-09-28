---
title: "Rate Limiting Principles"
kind: decision
impact: high
tags: [api, rate-limiting, resilience]
applies_to: [api-architect]
last_reviewed: "2026-09-28"
sources:
  - title: OWASP Unrestricted Resource Consumption
    url: https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/
---

# Rate Limiting Principles

> Protect your API from abuse and overload.

## Why Rate Limit

```
Protect against:
├── Brute force attacks
├── Resource exhaustion
├── Cost overruns (if pay-per-use)
└── Unfair usage
```

## Strategy Selection

| Type | How | When |
|------|-----|------|
| **Token bucket** | Burst allowed, refills over time | Most APIs |
| **Sliding window** | Smooth distribution | Strict limits |
| **Fixed window** | Simple counters per window | Basic needs |

## Response Headers

```
Include in headers:
├── X-RateLimit-Limit (max requests)
├── X-RateLimit-Remaining (requests left)
├── X-RateLimit-Reset (when limit resets)
└── Return 429 when exceeded
```

## Redis Implementation Pattern

```typescript
// Sliding window with Redis
const key = `ratelimit:${userId}:${endpoint}`;
const current = await redis.incr(key);
if (current === 1) {
  await redis.expire(key, windowSeconds);
}
if (current > maxRequests) {
  throw new RateLimitError();
}
```

**Recommended Limits:**
| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Public API | 100 | 1 min |
| Authenticated | 1000 | 1 min |
| Auth endpoints | 5 | 15 min |
| File uploads | 10 | 1 hour |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [security-testing.md](security-testing.md) | Rate limit bypass testing |
| [auth.md](auth.md) | Auth endpoint limits |
| [SKILL.md](../SKILL.md) | Full decision framework |

## Decision

Select a limiter from the protected resource, abuse model, fairness unit, burst tolerance, and distributed consistency needs. Derive limits from capacity tests and product policy, not universal numbers.

## Use When

Apply limits to authentication, expensive queries, third-party calls, write bursts, and tenant-scoped resources. Combine request counts with concurrency, payload, and cost limits where needed.

## Avoid When

Avoid one global counter, client-supplied identity keys, silent drops, or in-memory-only enforcement across an independently scaled fleet.

## Trade-offs

Stricter distributed accuracy costs latency and availability; approximate local enforcement is faster but permits bounded overshoot.

## Verification

Load-test steady, burst, distributed, retry, and failover behavior. Verify `429` responses and retry metadata without leaking account existence.
