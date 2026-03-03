# Redis Caching Patterns

> Advanced Redis patterns beyond basic cache-aside.
> **See also:** `perf-optimizer/backend-patterns.md` for basic cache-aside and TTL guidelines.

---

## Pattern Selection

| Pattern | Use When | Consistency |
|---------|----------|-------------|
| Cache-Aside | Read-heavy, tolerates staleness | Eventual |
| Write-Through | Need strong consistency | Strong |
| Write-Behind | Write-heavy, can defer writes | Eventual |
| Read-Through | Abstract cache from app | Eventual |
| Refresh-Ahead | Predictable access patterns | Near real-time |

---

## Cache-Aside (Enhanced)

> Basic pattern in `perf-optimizer/backend-patterns.md`. Below: advanced considerations.

### Thundering Herd Protection

```typescript
async function getWithLock<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = 3600,
): Promise<T> {
  // 1. Check cache
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  // 2. Try to acquire lock
  const lockKey = `lock:${key}`;
  const acquired = await redis.set(lockKey, '1', 'EX', 30, 'NX');

  if (!acquired) {
    // Another request is rebuilding — wait and retry
    await sleep(100);
    return getWithLock(key, fetchFn, ttl);
  }

  try {
    // 3. Double-check after acquiring lock
    const recheck = await redis.get(key);
    if (recheck) return JSON.parse(recheck);

    // 4. Fetch and cache
    const data = await fetchFn();
    await redis.setex(key, ttl, JSON.stringify(data));
    return data;
  } finally {
    await redis.del(lockKey);
  }
}
```

### Stale-While-Revalidate

```typescript
async function getWithSWR<T>(
  key: string,
  fetchFn: () => Promise<T>,
  freshTTL: number = 300,    // 5 min fresh
  staleTTL: number = 3600,   // 60 min stale allowed
): Promise<T> {
  const raw = await redis.get(key);

  if (raw) {
    const { data, timestamp } = JSON.parse(raw);
    const age = Date.now() - timestamp;

    if (age < freshTTL * 1000) {
      return data; // Fresh — serve directly
    }

    if (age < staleTTL * 1000) {
      // Stale — serve but revalidate in background
      setImmediate(async () => {
        const fresh = await fetchFn();
        await redis.setex(key, staleTTL, JSON.stringify({
          data: fresh, timestamp: Date.now(),
        }));
      });
      return data;
    }
  }

  // Missing or expired — fetch synchronously
  const data = await fetchFn();
  await redis.setex(key, staleTTL, JSON.stringify({
    data, timestamp: Date.now(),
  }));
  return data;
}
```

---

## Write-Through Pattern

```typescript
async function updateUser(userId: string, data: UserUpdate) {
  // 1. Update DB first
  const user = await db.user.update({
    where: { id: userId },
    data,
  });

  // 2. Update cache immediately
  await redis.setex(`user:${userId}`, 3600, JSON.stringify(user));

  // 3. Invalidate related caches
  await redis.del(`user:${userId}:permissions`);
  await redis.del(`org:${user.orgId}:members`);

  return user;
}
```

---

## Cache Key Strategy

### Naming Convention

```
{prefix}:{entity}:{id}              → cache:user:123
{prefix}:{entity}:{id}:{field}      → cache:user:123:profile
{prefix}:{entity}:list:{hash}       → cache:user:list:abc123
{prefix}:{entity}:count:{filter}    → cache:user:count:active
```

### Key Hashing for Complex Queries

```typescript
import crypto from 'crypto';

function cacheKey(prefix: string, params: object): string {
  const hash = crypto
    .createHash('md5')
    .update(JSON.stringify(params))
    .digest('hex')
    .slice(0, 12);
  return `${prefix}:${hash}`;
}

// Usage
const key = cacheKey('posts:list', { page: 1, limit: 20, tag: 'tech' });
// → "posts:list:a1b2c3d4e5f6"
```

---

## Tag-Based Invalidation

```typescript
// When caching, associate tags
async function cacheWithTags(
  key: string, data: unknown, ttl: number, tags: string[],
) {
  await redis.setex(key, ttl, JSON.stringify(data));
  for (const tag of tags) {
    await redis.sadd(`tag:${tag}`, key);
    await redis.expire(`tag:${tag}`, ttl);
  }
}

// Invalidate all keys with a tag
async function invalidateTag(tag: string) {
  const keys = await redis.smembers(`tag:${tag}`);
  if (keys.length > 0) {
    await redis.del(...keys);
    await redis.del(`tag:${tag}`);
  }
}

// Usage
await cacheWithTags('post:123', postData, 3600, ['posts', 'user:456']);
await invalidateTag('user:456'); // Clears all caches for user 456
```

---

## Monitoring

| Metric | Target | How |
|--------|--------|-----|
| Hit rate | > 80% | `INFO stats` → keyspace_hits / total |
| Memory usage | < 75% maxmemory | `INFO memory` |
| Eviction rate | ~ 0 | `INFO stats` → evicted_keys |
| Latency | < 1ms avg | `LATENCY HISTORY` |

---

⚡ PikaKit v3.9.72
