---
description: Performance optimizer with bundle analysis, N+1 query fixes, Redis caching, and k6 load testing
---

# Performance Optimization Workflow

Systematic performance optimization: profile, tune database, add caching, validate with load testing.

## ðŸŽ¯ Purpose

This workflow uses the **performance-audit** chain to:

- Profile application performance (Lighthouse, bundle size, API latency)
- Optimize database queries (indexes, N+1 fixes)
- Implement caching layers (Redis, CDN)
- Validate improvements with load testing

## ðŸ¤– Meta-Agents Integration

| Phase | Agent | Action |
| ----- | ----- | ------ |
| **Pre-Optimize** | `recovery` | Save current state before changes |
| **Optimization** | `orchestrator` | Coordinate parallel optimization tasks |
| **Post-Optimize** | `learner` | Log optimization patterns for reuse |
| **Failure** | `recovery` | Rollback if optimization degrades performance |

```
Flow:
recovery.save() â†’ orchestrator.run(optimizations)
       â†“
benchmark â†’ worse? â†’ recovery.restore()
       â†“
better â†’ learner.log(optimization_patterns)
```

---

## ðŸ”— Chain: performance-audit

**Skills Loaded (4):**

- `perf-optimizer` - Performance profiling (Core Web Vitals, bundle analysis)
- `data-modeler` - Query optimization, index recommendations
- `perf-optimizer` - Redis caching, CDN configuration
- `perf-optimizer` - k6/Artillery load testing, scalability validation

## ðŸ“– Usage

```bash
/optimize <description>
```

### Examples

```bash
# Basic optimization
/optimize my-slow-api

# With specific target
/optimize checkout flow (target: p95 <200ms)

# Production optimization
/optimize production app (10K+ users)
```

## ðŸ”„ Workflow Steps

This workflow automatically:

1. **Performance Profiling**
   - Run Lighthouse audit (Core Web Vitals)
   - Analyze bundle size
   - Profile API response times
   - Identify slow database queries

2. **Database Optimization**
   - Detect N+1 queries
   - Add missing indexes
   - Optimize slow queries
   - Tune connection pool

3. **Cache Implementation**
   - Setup Redis cache
   - Configure CDN (Cloudflare/Vercel)
   - Set HTTP caching headers
   - Implement cache-aside pattern

4. **Load Testing**
   - Run realistic user scenarios
   - Test at target scale (10K+ users)
   - Measure p95 latency, error rate
   - Identify remaining bottlenecks

## âœ… Success Criteria

After running `/optimize`, you will have:

âœ“ **Bottlenecks Identified** - Slow queries, large bundles
âœ“ **Performance Improved** - 50%+ latency reduction
âœ“ **Caching Implemented** - >80% cache hit rate
âœ“ **Load Test Passed** - Supports target concurrent users

## ðŸ“Š What Gets Optimized

### Frontend

- Bundle size reduction (code splitting)
- Image optimization (WebP, lazy loading)
- Core Web Vitals (LCP <2.5s, CLS <0.1)

### Backend

- Database query optimization (indexes, N+1 fixes)
- Redis caching (80%+ hit rate)
- API response time (p95 <200ms)
- Connection pool tuning

### Infrastructure

- CDN configuration
- HTTP caching headers
- Horizontal scaling recommendations

## ðŸŽ¨ Performance Targets

| Metric               | Target  | Critical |
| -------------------- | ------- | -------- |
| **p95 Latency**      | <200ms  | <500ms   |
| **Error Rate**       | <0.5%   | <1%      |
| **Cache Hit Rate**   | >80%    | >70%     |
| **Concurrent Users** | 10,000+ | 5,000+   |

## ðŸ” Related Workflows

- `/benchmark` - Run load tests only (no optimization)
- `/monitor` - Setup monitoring after optimization
- `/launch` - Deploy optimized version

## ðŸ’¡ Tips

**When to use `/optimize`:**

- API response times >500ms
- High database load
- Poor Lighthouse scores
- Before launch to production

**Best practices:**

- Profile BEFORE optimizing
- Fix database issues first (biggest impact)
- Add caching second
- Validate with load tests
- Monitor after deployment

## ðŸ“š Example Output

```bash
You: "/optimize my-slow-api"

Agent: Loading performance-audit chain
       â†“
Skills: perf-optimizer, data-modeler, perf-optimizer, perf-optimizer
       â†“

[1/4] ðŸ” Performance Profiling
   âš ï¸ API p95 latency: 850ms (target: <200ms)
   âŒ Database queries: 15 per request
   âŒ Slow query: users.findMany (2.5s)
   âš ï¸ No caching detected

[2/4] ðŸ—„ï¸ Database Tuning
   âœ… Added index: idx_users_email
   âœ… Fixed N+1: user posts (15 queries â†’ 1)
   âœ… Connection pool: 10 â†’ 20
   âœ… Query time: 2.5s â†’ 50ms (98% faster)

[3/4] âš¡ Cache Optimization
   âœ… Redis configured
   âœ… Cache-aside pattern implemented
   âœ… CDN configured for static assets
   âœ… Cache hit rate: 85%
   âœ… Database load: 1000 qps â†’ 150 qps

[4/4] ðŸ§ª Load Testing
   Testing: 5,000 concurrent users
   âœ… p95 latency: 180ms (target: <200ms âœ“)
   âœ… Error rate: 0.2% (target: <1% âœ“)
   âœ… Throughput: 4,150 rps
   âœ… PASS

ðŸ“Š Performance Improvement:
   - Latency: 850ms â†’ 180ms (79% faster)
   - Database load: 85% reduction
   - Supports: 5,000+ users âœ…

âœ… Optimization complete!

Files modified:
   âœ“ Add indexes to schema
   âœ“ Redis cache setup (lib/cache/)
   âœ“ CDN config (next.config.js)
   âœ“ Load test script (tests/load/)
```

## ðŸš¨ Common Bottlenecks Fixed

| Issue                 | Solution                    | Impact                |
| --------------------- | --------------------------- | --------------------- |
| N+1 queries           | Use `include` or JOINs      | 90%+ faster           |
| Missing indexes       | Add indexes on foreign keys | 95%+ faster           |
| No caching            | Redis + CDN                 | 70% DB load reduction |
| Small connection pool | Increase to 20-50           | Eliminates timeouts   |

---

**Version:** 1.0.0  
**Chain:** performance-audit  
**Added:** v3.5.0 (FAANG upgrade - Phase 2)

