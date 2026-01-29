---
name: database-tuner
description: >-
  Database query optimization. Slow query detection, N+1 fixes, missing index identification, connection pool tuning.
  Triggers on: slow query, database optimization, N+1 problem, index, connection pool.
  Coordinates with: perf-optimizer, cache-optimizer, data-modeler.
allowed-tools: Read, Write, Glob, Grep
metadata:
  category: "devops"
  success_metrics: "Query time reduced by 50%+, indexes added, N+1 fixed"
  coordinates_with: "perf-optimizer, cache-optimizer, data-modeler"
---

# Database Tuning

> Find and fix slow queries, optimize indexes, tune connection pools

## 🎯 Purpose

Systematically optimize database performance: detect slow queries, fix N+1 problems, add missing indexes, and tune connection pools for production scale.

---

## 1. Slow Query Detection

### Prisma Logging

```typescript
const prisma = new PrismaClient({
  log: [{ emit: "event", level: "query" }],
});

prisma.$on("query", (e) => {
  if (e.duration > 100) {
    console.warn(`⚠️ Slow query (${e.duration}ms): ${e.query}`);
  }
});
```

### PostgreSQL Slow Query Log

```sql
-- Enable slow query logging
ALTER SYSTEM SET log_min_duration_statement = 100; -- 100ms threshold
SELECT pg_reload_conf();

-- View slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

---

## 2. N+1 Query Detection & Fix

### Before (N+1 Problem)

```typescript
// ❌ 1 + N queries
const users = await prisma.user.findMany();
for (const user of users) {
  const posts = await prisma.post.findMany({ where: { authorId: user.id } });
}
// If 100 users → 101 queries!
```

### After (Optimized)

```typescript
// ✅ 1 query with JOIN
const users = await prisma.user.findMany({
  include: { posts: true },
});
// Always 1 query
```

---

## 3. Missing Index Identification

### Detect via EXPLAIN ANALYZE

```sql
-- Slow query
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'user@example.com';
-- Output: Seq Scan on users (cost=0..1500 rows=1) -- FULL TABLE SCAN!

-- Add index
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);

-- After index
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'user@example.com';
-- Output: Index Scan using idx_users_email (cost=0.29..8.31 rows=1)
-- 98% faster!
```

### Common Index Patterns

| Column Type    | Index Type | Use Case      |
| -------------- | ---------- | ------------- |
| Foreign keys   | B-tree     | JOINs         |
| Email/Username | B-tree     | Exact match   |
| Timestamps     | B-tree     | Range queries |
| JSON fields    | GIN        | JSONB queries |
| Full-text      | GIN/GiST   | Text search   |

---

## 4. Query Optimization

### Use SELECT specific columns

```sql
-- ❌ Slow
SELECT * FROM users WHERE active = true;

-- ✅ Fast
SELECT id, email, name FROM users WHERE active = true;
```

### Avoid SELECT DISTINCT when possible

```sql
-- ❌ Slow (forces sort)
SELECT DISTINCT category FROM products;

-- ✅ Fast (use GROUP BY)
SELECT category FROM products GROUP BY category;
```

### Use LIMIT for large result sets

```sql
-- ❌ Fetch all 1M rows
SELECT * FROM events ORDER BY created_at DESC;

-- ✅ Fetch first 100
SELECT * FROM events ORDER BY created_at DESC LIMIT 100;
```

---

## 5. Connection Pool Tuning

### Prisma Configuration

```typescript
// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Connection pool settings
  connection_limit = 20   // Max connections
  pool_timeout     = 30    // Seconds before timeout
}
```

### Recommended Pool Sizes

| Environment | Pool Size | Reason       |
| ----------- | --------- | ------------ |
| Development | 5         | Low traffic  |
| Staging     | 10-15     | Testing      |
| Production  | 20-50     | High traffic |

**Formula:** `pool_size = (cpu_cores * 2) + disk_spindles`

---

## 6. Database Maintenance

### Analyze Tables (PostgreSQL)

```sql
-- Update statistics for query planner
ANALYZE users;

-- Auto-vacuum settings
ALTER TABLE users SET (autovacuum_vacuum_scale_factor = 0.1);
```

### Index Maintenance

```sql
-- Find unused indexes
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0 AND indexname NOT LIKE 'pg_toast%';

-- Drop unused index
DROP INDEX CONCURRENTLY idx_unused;
```

---

## 7. Query Caching Strategy

```typescript
// Cache frequent queries
const cachedUsers = await getCached(
  "users:active",
  () => prisma.user.findMany({ where: { active: true } }),
  3600, // 1 hour TTL
);
```

---

## 8. Performance Targets

| Metric                | Target | Critical |
| --------------------- | ------ | -------- |
| Query time            | <100ms | <500ms   |
| Connection pool usage | \<80%  | \<95%    |
| Index hit rate        | \>95%  | \>90%    |
| Cache hit rate        | \>80%  | \>70%    |

---

> **Key Takeaway:** Index foreign keys, fix N+1 queries, and tune connection pools. These 3 actions solve 90% of database performance issues.
