---
"title": "Backend Patterns: Redis Caching Patterns"
"kind": "reference"
"impact": "high"
"tags":
  - "backend-patterns-redis-caching-patterns"
"applies_to":
  - "web"
  - "node"
"last_reviewed": "2026-09-28"
"sources":
  - "url": "https://web.dev/articles/vitals"
    "title": "Official documentation"
---

# Backend Patterns: Redis Caching Patterns

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> Database and caching optimization patterns for backend performance. **Profile first, optimize second.**

---

## Redis Caching Patterns

### Cache-Aside Pattern (Most Common)

```typescript
import { Redis } from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

async function getUser(userId: string) {
  // 1. Check cache
  const cached = await redis.get(`user:${userId}`)
  if (cached) return JSON.parse(cached)

  // 2. Cache miss → fetch from DB
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) return null

  // 3. Set cache with TTL
  await redis.setex(`user:${userId}`, 3600, JSON.stringify(user))

  return user
}
```

### TTL Guidelines

| Data Type | TTL | Reason |
|-----------|-----|--------|
| Static config | 24h | Rarely changes |
| User profile | 1h | Occasional updates |
| Product listings | 15-30min | Moderate changes |
| Session data | 15-30min | Security |
| Real-time data | 30s-5min | Freshness critical |
| Computed aggregates | 5-15min | Expensive to compute |
| Search results | 5min | Changes frequently |

### Cache Invalidation

```typescript
// Write-through: update DB + invalidate cache
async function updateUser(userId: string, data: UserUpdate) {
  const user = await db.user.update({ where: { id: userId }, data })

  // Invalidate all related cache keys
  await redis.del(`user:${userId}`)
  await redis.del(`user:${userId}:profile`)
  await redis.del(`user:${userId}:permissions`)

  return user
}

// Pattern: invalidate on write, not on read
// If cache miss rate is high → increase TTL
// If stale data is a problem → decrease TTL
```

### Cache Key Naming Convention

```
{entity}:{id}              → user:123
{entity}:{id}:{field}      → user:123:profile
{entity}:list:{params}     → user:list:page=1&limit=20
{entity}:count:{filter}    → user:count:active=true
{prefix}:{entity}:{id}     → v2:user:123  (versioned)
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
