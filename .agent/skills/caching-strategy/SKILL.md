---
name: caching-strategy
description: >-
  Multi-layer caching architecture for high-performance applications.
  Redis, CDN, browser cache, service workers, stale-while-revalidate.
  Deterministic layer selection with fixed TTL per volatility class.
  Triggers on: cache, Redis, CDN, service worker, SWR, performance, TTL.
  Coordinates with: perf-optimizer, api-architect, server-ops.
metadata:
  version: "2.0.0"
  category: "architecture"
  triggers: "cache, Redis, CDN, service worker, SWR, memoization, TTL, invalidation"
  success_metrics: "cache hit rate ≥80%, invalidation strategy defined, stampede protection included"
  coordinates_with: "perf-optimizer, api-architect, server-ops"
---

# Caching Strategy

> Multi-layer caching decisions. Cache closest to user. Invalidation before expiry. Zero thundering herd.

---

## Prerequisites

**Required:** None — Caching Strategy is a knowledge-based skill with no external dependencies.

**Optional:**
- `perf-optimizer` skill (for performance benchmarking)
- `event-driven` skill (for event-based invalidation patterns)

---

## When to Use

| Situation | Reference |
|-----------|-----------|
| Choosing cache layer | Decision tree below |
| Redis patterns (cache-aside, write-through) | `references/redis.md` |
| CDN / edge caching | `references/cdn.md` |
| Browser cache + service workers | `references/browser-cache.md` |
| App-level caching (SWR, TanStack Query) | `references/application-cache.md` |
| Architecture review, contracts | `references/engineering-spec.md` |

**Selective Reading Rule:** Read ONLY the file matching the current request.

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Cache layer selection (5 layers) | Cache backend provisioning (→ server-ops) |
| Invalidation strategy selection | Event bus implementation (→ event-driven) |
| TTL assignment per volatility class | Performance benchmarking (→ perf-optimizer) |
| Cache key design patterns | API Cache-Control headers (→ api-architect) |
| Stampede protection strategy | Cache encryption implementation |

**Pure decision skill:** Produces architecture guidance. Zero network calls, zero infrastructure changes.

---

## The 5 Cache Layers

| Layer | Technology | Latency | Use Case |
|-------|-----------|---------|----------|
| **1. Browser Cache** | Cache-Control headers | 0 ms | Static assets, immutable resources |
| **2. Service Worker** | Cache API | < 1 ms | Offline support, custom strategies |
| **3. CDN / Edge** | Cloudflare, Vercel Edge | 5–50 ms | Global static delivery, public API responses |
| **4. Application** | Redis, Memcached, in-memory | 1–10 ms | Per-user data, DB query offload |
| **5. Database Query** | Query plan cache | 10–50 ms | Repeated complex queries |

---

## Cache Layer Decision Tree

```
What are you caching?
├── Static assets (JS, CSS, images, fonts)
│   ├── Global audience → CDN + immutable Cache-Control
│   └── Single region → Nginx / reverse proxy
├── API responses
│   ├── Same for all users → CDN + Cache-Control (TTL: hourly)
│   ├── Per-user data → Redis cache-aside (TTL: minutely)
│   └── Client-side → TanStack Query / SWR (stale-while-revalidate)
├── Database query results
│   └── Redis cache-aside (TTL based on volatility)
├── Computed / aggregated data
│   └── Redis with scheduled refresh (TTL: hourly)
└── Session / auth data
    └── Redis (see auth-patterns skill)
```

---

## Invalidation Strategies

| Strategy | Trigger | Consistency | Use When |
|----------|---------|-------------|----------|
| **TTL expiry** | Time-based auto-expire | Eventual | Simple; acceptable staleness |
| **Write-through** | Update cache on every write | Read-after-write | Strong consistency needed |
| **Event-driven** | Pub/Sub on data change | Eventual (fast) | Distributed systems |
| **Tag-based** | Invalidate by tag/group | Eventual | Related data sets |
| **Versioned keys** | `entity:v{N}:id` | Immediate | Bulk invalidation |

---

## Fixed TTL per Volatility

| Volatility | TTL | Example |
|-----------|-----|---------|
| `immutable` | 365 days (`max-age=31536000, immutable`) | Hashed static assets |
| `hourly` | 3600 seconds | Aggregated analytics |
| `minutely` | 60 seconds | User profile data |
| `real-time` | 10 seconds (or no cache) | Live feed, stock prices |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not one of the 6 supported types |
| `ERR_MISSING_CONTEXT` | Yes | Required context field is null or empty |
| `ERR_CONSTRAINT_CONFLICT` | Yes | Contradictory constraints |
| `ERR_INVALID_DATA_TYPE` | No | Data type not recognized |
| `ERR_INVALID_VOLATILITY` | No | Volatility not one of: immutable, hourly, minutely, real-time |
| `ERR_INVALID_CONSISTENCY` | No | Consistency not one of: eventual, read-after-write, strong |
| `ERR_REFERENCE_NOT_FOUND` | No | Reference file missing |

**Zero internal retries.** Deterministic output; same context = same recommendation.

---

## Decision Checklist

- [ ] **Identified what to cache?** (not everything — only high-read, low-write data)
- [ ] **Chosen appropriate layer?** (closest to user that satisfies consistency)
- [ ] **Set TTL based on data volatility?** (immutable/hourly/minutely/real-time)
- [ ] **Planned invalidation strategy?** (defined before TTL, not after)
- [ ] **Handled cache miss path?** (fallback to origin with timeout)
- [ ] **Addressed thundering herd?** (locks or stale-while-revalidate for multi-instance)
- [ ] **Cache key includes all varying parameters?** (user, version, locale)
- [ ] **PII cached with encryption?** (flagged for compliance)

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Cache everything | Cache based on read/write ratio and access patterns |
| Same TTL for all data | TTL matches data volatility class |
| Add caching without invalidation plan | Define invalidation strategy before implementation |
| Cache PII without encryption | Encrypt sensitive data; exclude raw PII from keys |
| Ignore thundering herd | Use locks or stale-while-revalidate for multi-instance |
| Cache without monitoring | Track hit rate, miss rate, eviction rate, latency |

---

## � Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [redis.md](references/redis.md) | Redis patterns: cache-aside, write-through, pub/sub, Lua | Server-side caching |
| [cdn.md](references/cdn.md) | CDN config, cache busting, edge caching | Static assets, API cache |
| [browser-cache.md](references/browser-cache.md) | Service Workers, Cache API, Cache-Control | Client-side, offline |
| [application-cache.md](references/application-cache.md) | In-memory, LRU, TanStack Query, SWR | App-level data cache |
| [engineering-spec.md](references/engineering-spec.md) | Full engineering spec: contracts, security, scalability | Architecture review |

---

## �🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `perf-optimizer` | Skill | Performance benchmarks and profiling |
| `api-architect` | Skill | Cache-Control headers, API caching |
| `server-ops` | Skill | Redis infrastructure provisioning |
| `event-driven` | Skill | Event-based cache invalidation |

---

⚡ PikaKit v3.9.70
