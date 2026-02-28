---
name: caching-strategy
description: >-
  Multi-layer caching architecture for high-performance applications.
  Redis, CDN, browser cache, service workers, stale-while-revalidate.
  Triggers on: cache, Redis, CDN, service worker, SWR, performance, TTL.
  Coordinates with: perf-optimizer, api-architect, server-ops.
allowed-tools: Read, Write, Edit, Glob, Grep
metadata:
  version: "1.0.0"
  category: "architecture"
  triggers: "cache, Redis, CDN, service worker, SWR, memoization, TTL, invalidation"
  success_metrics: "cache hit rate >80%, latency reduced, invalidation working"
  coordinates_with: "perf-optimizer, api-architect, server-ops"
---

# Caching Strategy

> Multi-layer caching principles for FAANG-grade performance.
> **Learn to THINK about caching, not cache everything blindly.**

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Choosing cache layer | Check decision tree below |
| Redis implementation | Read `references/redis.md` |
| CDN / edge caching | Read `references/cdn.md` |
| Browser & SW caching | Read `references/browser-cache.md` |
| App-level caching (SWR) | Read `references/application-cache.md` |

---

## 🎯 Selective Reading Rule

**Read ONLY files relevant to the request!** Check content map, find what you need.

---

## Cache Layer Decision Tree

```
What are you caching?
├── Static assets (JS, CSS, images, fonts)
│   ├── Global audience → CDN (Cloudflare, Vercel Edge)
│   └── Single region → Nginx / reverse proxy
├── API responses
│   ├── Identical for all users → CDN + Cache-Control headers
│   ├── Per-user data → Redis (server-side)
│   └── Client-side → TanStack Query / SWR / Apollo Cache
├── Database query results
│   └── Redis (cache-aside pattern)
├── Computed / aggregated data
│   └── Redis with scheduled refresh
└── Session / auth data
    └── Redis (see auth-patterns skill)
```

---

## The 5 Cache Layers

```
┌─────────────────────────────────────────────┐
│  Layer 1: Browser Cache (Cache-Control)     │ ← Fastest (0ms)
├─────────────────────────────────────────────┤
│  Layer 2: Service Worker (Cache API)        │ ← Offline support
├─────────────────────────────────────────────┤
│  Layer 3: CDN / Edge Cache                  │ ← Global latency
├─────────────────────────────────────────────┤
│  Layer 4: Application Cache (Redis/Memcached│ ← DB offload
├─────────────────────────────────────────────┤
│  Layer 5: Database Query Cache              │ ← Query plan cache
└─────────────────────────────────────────────┘
```

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| `references/redis.md` | Redis patterns: cache-aside, write-through, pub/sub, Lua | Server-side caching |
| `references/cdn.md` | CDN config, cache busting, edge caching | Static assets, API cache |
| `references/browser-cache.md` | Service Workers, Cache API, Cache-Control | Client-side, offline |
| `references/application-cache.md` | In-memory, LRU, TanStack Query, SWR | App-level data cache |

### Also See (existing skills)

| File | Skill | What It Covers |
|------|-------|----------------|
| `backend-patterns.md` | `perf-optimizer` | Redis cache-aside basic pattern, TTL guidelines |

---

## Core Principles

| Principle | Application |
|-----------|-------------|
| **Cache closest to user** | Browser > CDN > App > DB |
| **Invalidation > Expiry** | Proactive invalidation when data changes |
| **TTL based on data volatility** | Static: long, dynamic: short |
| **Cache key determinism** | Same input → same cache key |
| **Graceful degradation** | App works when cache is down |

---

## Cache Invalidation Strategies

| Strategy | How | Best For |
|----------|-----|----------|
| **TTL expiry** | Auto-expire after time | Simple, acceptable staleness |
| **Write-through** | Update cache on write | Strong consistency needed |
| **Event-driven** | Pub/Sub on data change | Distributed systems |
| **Tag-based** | Invalidate by tag/group | Related data sets |
| **Versioned keys** | `user:v3:123` | Bulk invalidation |

---

## ✅ Decision Checklist

- [ ] **Identified what to cache?** (not everything!)
- [ ] **Chosen appropriate layer?** (browser vs CDN vs Redis)
- [ ] **Set TTL based on data volatility?**
- [ ] **Planned invalidation strategy?**
- [ ] **Handled cache miss gracefully?**
- [ ] **Considered thundering herd?** (locks, stale-while-revalidate)
- [ ] **Cache key uniqueness verified?** (include all varying params)

---

## ❌ Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|------|
| Cache everything | Cache based on access pattern |
| Same TTL for all data | TTL matches data volatility |
| Forget invalidation | Plan invalidation at design time |
| Cache PII without encryption | Encrypt sensitive cached data |
| Ignore thundering herd | Use locks or stale-while-revalidate |
| Cache without monitoring | Track hit rate, miss rate, latency |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `perf-optimizer` | Skill | Performance benchmarks |
| `api-architect` | Skill | Cache-Control headers, API caching |
| `server-ops` | Skill | Redis infrastructure |
| `event-driven` | Skill | Event-based invalidation |

---

⚡ PikaKit v3.9.66
