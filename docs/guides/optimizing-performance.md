---
title: Optimizing Performance
description: Identify and fix performance bottlenecks with PikaKit - profiling, caching, database optimization
section: guides
category: workflows
order: 11
---

# Optimizing Performance

Learn how to identify and fix performance bottlenecks with **PikaKit** - from profiling and analysis to implementation of caching, database optimization, and code improvements.

## Overview

- **Goal**: Identify and resolve performance bottlenecks systematically.
- **Time**: 30-60 minutes (vs 4-12 hours manually).
- **Agents Used**: `debug-pro`, `code-review`, `test-engineer`, `perf-optimizer`.
- **Workflows**: `/diagnose`, `/cook`, `/validate`, `/fix`.

## Prerequisites

- Application with performance issues.
- Monitoring/profiling tools installed.
- Performance baseline metrics.

## Performance Targets

| Metric | Good | Acceptable | Poor |
|--------|------|------------|------|
| API Response Time | <200ms | 200-500ms | >500ms |
| Page Load Time | <2s | 2-4s | >4s |
| Database Query | <50ms | 50-200ms | >200ms |
| Memory Usage | <512MB | 512MB-2GB | >2GB |

## Step-by-Step Workflow

### Step 1: Identify Performance Issues

Start by profiling your application:

```bash
/diagnose "analyze application performance and identify bottlenecks"
```

**Analysis output**:
- **Critical Issues**: N+1 queries, Large images, Missing cache.
- **Warning Issues**: Inefficient algorithms, Large bundle size, Memory leaks.
- **Performance Score**: e.g., 34/100 (Poor).

### Step 2: Fix Database Performance

#### N+1 Query Problem

```bash
/cook "fix N+1 query problem in user service with eager loading"
```

**Result**:
- Query count: 156 → 1.
- Response time: 2,847ms → 87ms (97% improvement).

#### Add Database Indexes

```bash
/cook "add database indexes for frequently queried fields"
```

### Step 3: Implement Caching

#### Redis Cache

```bash
/cook "implement Redis caching for frequently accessed data"
```

**Features**:
- Cache-aside pattern.
- TTL configuration.
- Cache invalidation on update.

**Result**:
- Cache hit rate: 0% → 87%.
- Response time: 456ms → 23ms.

#### CDN Integration

```bash
/cook "integrate CloudFlare CDN for static assets"
```

### Step 4: Optimize Frontend

#### Code Splitting

```bash
/cook "implement code splitting and lazy loading"
```

**Result**:
- Bundle size: 4.2MB → 687KB (84% reduction).
- Initial load: 6s → 1.2s.

#### Image Optimization

```bash
/cook "optimize images with WebP compression and lazy loading"
```

**Result**:
- Image size: 12.4MB → 2.1MB (83% reduction).

### Step 5: Optimize Algorithms

#### Replace Inefficient Algorithm

```bash
/cook "replace O(n²) algorithm with O(n) hash map solution"
```

**Result**: 99.2% faster (523ms → 4ms).

### Step 6: Async Operations

#### Background Jobs

```bash
/cook "move email sending to background queue with Bull"
```

**Result**:
- API response: 890ms → 45ms.
- Non-blocking operations.

### Step 7: Memory Optimization

#### Fix Memory Leaks

```bash
/fix "fix memory leak in WebSocket handler"
```

### Step 8: Performance Testing

Run load tests to verify improvements:

```bash
/validate
```

**Performance test results**:
- Avg response: 2,847ms → 87ms (97% faster).
- Requests/sec: 23 → 892 (38x more).
- Error rate: 12.4% → 0.1%.

### Step 9: Monitoring

```bash
/cook "implement performance monitoring with metrics and alerts"
```

**Alerts configured**:
- Response time >500ms.
- Error rate >1%.
- Memory usage >80%.

## Complete Example: Slow E-Commerce API

**Initial Issues**:
- Product listing: 4.2s response time.
- Search: 6.8s with 1000 products.
- Homepage: 9.2s load time.

**Optimization Steps**:
1.  `/diagnose "analyze e-commerce API performance"`
2.  `/cook "fix N+1 queries and add indexes"`
3.  `/cook "implement Redis caching for products"`
4.  `/cook "implement code splitting and image optimization"`
5.  `/validate`

**Results**:
- Product listing: 4.2s → 124ms (97% faster).
- Search: 6.8s → 89ms (99% faster).
- Homepage: 9.2s → 1.4s (85% faster).

## Best Practices

1.  **Measure First**: Always profile before optimizing.
2.  **Focus on Impact**: Optimize high-frequency, user-facing operations first.
3.  **Cache Aggressively**: Browser, CDN, App (Redis), Database layers.
4.  **Use Correct Data Structures**: Hash map for lookups (O(1)), Set for uniqueness.

## Troubleshooting

### Issue: Still Slow After Optimization
**Solution**:
```bash
/diagnose "deep performance analysis with detailed metrics"
```

### Issue: Cache Not Hitting
**Solution**:
```bash
/fix --quick "Redis cache hit rate below 50%"
```

## Next Steps

- **[Debugging & Fixing](./debugging-workflow.md)**: Debug issues.
- **[Refactoring Code](./refactoring-code.md)**: Improve code quality.
- **[Building a REST API](./building-rest-api.md)**: API development.

---

**Key Takeaway**: PikaKit enables systematic performance optimization with profiling, analysis, and implementation of best practices - turning slow applications into fast ones in under an hour.
