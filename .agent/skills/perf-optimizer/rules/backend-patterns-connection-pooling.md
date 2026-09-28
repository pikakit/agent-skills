---
"title": "Backend Patterns: Connection Pooling"
"kind": "reference"
"impact": "high"
"tags":
  - "backend-patterns-connection-pooling"
"applies_to":
  - "web"
  - "node"
"last_reviewed": "2026-09-28"
"sources":
  - "url": "https://web.dev/articles/vitals"
    "title": "Official documentation"
---

# Backend Patterns: Connection Pooling

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> Database and caching optimization patterns for backend performance. **Profile first, optimize second.**

---

## Connection Pooling

### Why It Matters

```
Without pooling:
  Request → Open connection → Query → Close connection
  100 concurrent requests → 100 connections opened/closed
  → Connection overhead dominates response time

With pooling:
  Request → Borrow connection → Query → Return to pool
  100 concurrent requests → 10-20 pooled connections reused
  → Near-zero connection overhead
```

### Configuration

```typescript
// Prisma — connection pool is automatic
// Tune via connection string
const DATABASE_URL = 'postgresql://user:pass@host:5432/db?connection_limit=20&pool_timeout=10'

// Drizzle + node-postgres
import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                // Max connections in pool
  idleTimeoutMillis: 30000,  // Close idle connections after 30s
  connectionTimeoutMillis: 5000, // Fail if can't connect in 5s
})

const db = drizzle(pool)
```

### Pool Sizing

| Environment | Pool Size | Rationale |
|-------------|-----------|-----------|
| Development | 5 | Low concurrency |
| Staging | 10 | Moderate load |
| Production | 20-50 | `connections = (CPU cores * 2) + disk spindles` |
| Serverless | 1-5 | Short-lived, use connection proxy (PgBouncer) |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
