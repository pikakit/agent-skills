---
"title": "Backend Patterns: Database Query Optimization"
"kind": "process"
"impact": "high"
"tags":
  - "backend-patterns-database-query-optimization"
"applies_to":
  - "web"
  - "node"
"last_reviewed": "2026-09-28"
"sources":
  - "url": "https://web.dev/articles/vitals"
    "title": "Official documentation"
---

# Backend Patterns: Database Query Optimization

## Preconditions

Record the current behavior, target environment, acceptance criteria, and a recoverable baseline before starting.

## Procedure

> Database and caching optimization patterns for backend performance. **Profile first, optimize second.**

---

## Database Query Optimization

### Indexing Strategy

| Query Pattern | Index Type | Example |
|---------------|------------|---------|
| Equality (`WHERE x = ?`) | B-tree | `CREATE INDEX idx_email ON users(email)` |
| Range (`WHERE x > ?`) | B-tree | `CREATE INDEX idx_created ON orders(created_at)` |
| Multi-column | Composite | `CREATE INDEX idx_user_status ON orders(user_id, status)` |
| Full-text search | Full-text / GIN | `CREATE INDEX idx_search ON posts USING GIN(to_tsvector(content))` |
| JSON fields | GIN | `CREATE INDEX idx_meta ON users USING GIN(metadata)` |

### Query Analysis

```sql
-- Always check slow queries
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';

-- Look for:
-- ✅ Index Scan (fast)
-- ❌ Seq Scan on large table (needs index)
-- ❌ Nested Loop with high row counts (possible N+1)
```

### Query Logging (Development)

```typescript
// Prisma: enable query logging
const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
  ],
})

prisma.$on('query', (e) => {
  if (e.duration > 100) { // Log queries > 100ms
    console.warn(`Slow query (${e.duration}ms): ${e.query}`)
  }
})

// Drizzle: use logger
const db = drizzle(pool, { logger: true })
```

---

## Rollback

Restore the recorded baseline if a required command errors, evidence becomes inconclusive, or the change introduces a regression.

## Exit Gate

Complete only with fresh, reproducible evidence for the intended behavior and all relevant project checks passing.
