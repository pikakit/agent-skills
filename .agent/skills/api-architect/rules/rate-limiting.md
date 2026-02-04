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
