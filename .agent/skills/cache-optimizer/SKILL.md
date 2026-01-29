---
name: cache-optimizer
description: >-
  Redis/Memcached cache setup, cache invalidation strategy, CDN configuration (Cloudflare, Vercel Edge), HTTP caching headers.
  Triggers on: cache, Redis, CDN, caching strategy, performance.
  Coordinates with: perf-optimizer, database-tuner, load-tester.
allowed-tools: Read, Write, Glob
metadata:
  category: "devops"
  success_metrics: "Cache hit rate >80%, latency reduced by 50%+"
  coordinates_with: "perf-optimizer, database-tuner, load-tester"
---

# Cache Optimization

> Implement caching layers: Redis, CDN, HTTP headers

## 🎯 Purpose

Reduce database load and improve response times through strategic caching at multiple layers: application (Redis), CDN edge, and HTTP browser caching.

---

## 1. Redis Cache Setup

### Install & Configure

```bash
npm install ioredis
```

```typescript
// lib/cache/redis.ts
import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: true,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redis.on("error", (err) => console.error("Redis error:", err));
redis.on("connect", () => console.log("✅ Redis connected"));
```

---

## 2. Cache-Aside Pattern

```typescript
export async function getCached<T>(key: string, fetcher: () => Promise<T>, ttl: number = 3600): Promise<T> {
  // Try cache
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  // Cache miss - fetch
  const data = await fetcher();

  // Save to cache
  await redis.setex(key, ttl, JSON.stringify(data));

  return data;
}

// Usage
const user = await getCached(
  `user:${userId}`,
  () => db.user.findUnique({ where: { id: userId } }),
  3600, // 1 hour
);
```

---

## 3. Cache Invalidation

### Time-based (TTL)

```typescript
await redis.setex("user:123", 3600, JSON.stringify(user)); // 1 hour
```

### Event-based

```typescript
async function updateUser(userId: string, data: any) {
  await db.user.update({ where: { id: userId }, data });
  await redis.del(`user:${userId}`); // Invalidate
}
```

### Tag-based

```typescript
// Tag cache keys
await redis.set("user:123", userData);
await redis.sadd("tag:users", "user:123");

// Invalidate all users
const keys = await redis.smembers("tag:users");
await redis.del(...keys);
```

---

## 4. CDN Configuration

### Cloudflare Page Rules

```typescript
// Cloudflare API
const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/pagerules`, {
  method: "POST",
  headers: {
    "X-Auth-Email": process.env.CF_EMAIL,
    "X-Auth-Key": process.env.CF_API_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    targets: [{ target: "url", constraint: { operator: "matches", value: "*.example.com/static/*" } }],
    actions: [
      { id: "cache_level", value: "cache_everything" },
      { id: "edge_cache_ttl", value: 2592000 }, // 30 days
    ],
  }),
});
```

### Vercel Edge Config

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=120",
          },
        ],
      },
      {
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};
```

---

## 5. HTTP Caching Headers

### Cache-Control Values

| Pattern        | Header                        | Use Case         |
| -------------- | ----------------------------- | ---------------- |
| **No cache**   | `no-store`                    | Sensitive data   |
| **Revalidate** | `no-cache`                    | Always fresh     |
| **Public**     | `public, max-age=3600`        | Static assets    |
| **Private**    | `private, max-age=300`        | User-specific    |
| **Immutable**  | `immutable, max-age=31536000` | Versioned assets |

---

## 6. Cache Strategies by Content Type

| Content           | Strategy         | TTL    |
| ----------------- | ---------------- | ------ |
| **User session**  | Redis            | 1 hour |
| **API responses** | Redis + HTTP     | 5 min  |
| **Static assets** | CDN              | 1 year |
| **HTML pages**    | CDN + Revalidate | 60 sec |
| **Images/Videos** | CDN              | 1 year |

---

## 7. Cache Performance Metrics

```typescript
export async function getCacheStats() {
  const info = await redis.info("stats");
  const hitRate = parseFloat(info.match(/keyspace_hits:(\d+)/)?.[1] || "0");
  const missRate = parseFloat(info.match(/keyspace_misses:(\d+)/)?.[1] || "0");

  return {
    hitRate: (hitRate / (hitRate + missRate)) * 100,
    memory: await redis.info("memory"),
    keys: await redis.dbsize(),
  };
}
```

**Target:** >80% hit rate

---

## 8. Advanced: Cache Warming

```typescript
// Pre-populate cache with frequently accessed data
async function warmCache() {
  const popularProducts = await db.product.findMany({
    where: { views: { gt: 1000 } },
    take: 100,
  });

  for (const product of popularProducts) {
    await redis.setex(`product:${product.id}`, 7200, JSON.stringify(product));
  }
}

// Run on app startup
warmCache();
```

---

> **Key Takeaway:** Database queries are 100x slower than cache. Cache aggressively, invalidate precisely.
