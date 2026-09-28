# Data Modeler Full Agent Rules

> Deterministic compilation of 7 source rules for data-modeler v4.0.0. Do not edit directly.

## Rule Index

- [Database Selection](#rule-database-selection) (high, reference, source: `rules/database-selection.md`)
- [Production Data Model Decision](#rule-engineering-spec) (high, decision, source: `rules/engineering-spec.md`)
- [Database Indexing](#rule-indexing) (high, reference, source: `rules/indexing.md`)
- [Compatible Database Migrations](#rule-migrations) (critical, reference, source: `rules/migrations.md`)
- [Query Optimization](#rule-optimization) (high, reference, source: `rules/optimization.md`)
- [ORM and Query Builder Selection](#rule-orm-selection) (high, reference, source: `rules/orm-selection.md`)
- [Relational Schema Design](#rule-schema-design) (high, reference, source: `rules/schema-design.md`)

<a id="rule-database-selection"></a>

## Database Selection

**Impact:** high
**Kind:** reference
**Source:** `rules/database-selection.md`

# Database Selection

> Choose database based on context, not default. Never assume PostgreSQL.

## Scope

Apply to selecting a storage engine from consistency, access, concurrency, durability, residency, availability, and operational constraints.

## Guidance

---

## Decision Tree

```
What are your requirements?
│
├── Full relational features needed
│   ├── Self-hosted / VPS → PostgreSQL
│   └── Serverless → Neon (branching, scale-to-zero)
│
├── Edge deployment / Ultra-low latency
│   └── Turso (edge SQLite, global replication)
│
├── AI / Vector search
│   └── PostgreSQL + pgvector (HNSW index)
│
├── Simple / Embedded / Local / Prototype
│   └── SQLite (zero config, single file)
│
└── Global distribution + MySQL
    └── PlanetScale (Vitess-backed)
```

---

## Comparison Matrix

| Database | Best For | Hosting | Latency | Cost (Start) | Trade-offs |
|----------|----------|---------|---------|--------------|------------|
| **PostgreSQL** | Full features, complex queries | Self-managed | 5–20 ms | Free (self) | Needs hosting, ops |
| **Neon** | Serverless PG, branching | Managed | 10–30 ms | Free tier | Cold start on scale-to-zero |
| **Turso** | Edge, low latency | Edge | 1–5 ms | Free tier | SQLite limitations (no stored procs) |
| **SQLite** | Simple, embedded, local | None | < 1 ms | Free | Single-writer, no network access |
| **PlanetScale** | MySQL, global scale | Managed | 10–50 ms | Free tier | No foreign keys (app-level) |
| **Supabase** | PG + Auth + Storage | Managed | 10–30 ms | Free tier | Vendor lock-in risk |

---

## Selection by Project Type

| Project Type | Recommended | Why |
|-------------|-------------|-----|
| SaaS web app | Neon or PostgreSQL | Full relational, serverless scaling |
| Mobile app backend | Neon or Supabase | Auth integration, REST/GraphQL |
| Edge-first app | Turso | Global replication, < 5ms reads |
| CLI tool / Desktop | SQLite | Zero config, embedded |
| AI/ML app | PostgreSQL + pgvector | Vector similarity search |
| Prototype / MVP | SQLite or Neon | Fast setup, free |

---

## Connection Patterns

```typescript
// PostgreSQL (node-postgres)
import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Neon (serverless driver)
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);
const users = await sql`SELECT * FROM users WHERE id = ${userId}`;

// Turso (libsql)
import { createClient } from '@libsql/client';
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// SQLite (better-sqlite3)
import Database from 'better-sqlite3';
const db = new Database('app.db');
```

---

## Questions to Ask User

1. What's the deployment environment? (serverless / VPS / edge)
2. How complex are the queries? (simple CRUD / joins / analytics)
3. Is edge/low-latency critical?
4. Vector search needed?
5. Budget constraints?
6. Team's database experience?

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Default to PostgreSQL for a prototype | Use SQLite for simple apps |
| Use SQLite for multi-user web app | Use PostgreSQL/Neon for concurrent access |
| Ignore cold start on serverless DB | Design for connection pooling |
| Choose DB by popularity | Choose by deployment context + query patterns |

---



---

## Verification

Validate the choice with representative reads, writes, concurrency, failure, backup/restore, residency, and cost assumptions. Record rejected alternatives and the migration path if scale or consistency requirements change.

## Related

| File | When to Read |
|------|-------------|
| [orm-selection.md](orm-selection.md) | ORM for chosen database |
| [schema-design.md](schema-design.md) | Schema after DB selected |
| [SKILL.md](../SKILL.md) | Decision checklist |

---

⚡ PikaKit v3.9.224

<a id="rule-engineering-spec"></a>

## Production Data Model Decision

**Impact:** high
**Kind:** decision
**Source:** `rules/engineering-spec.md`

# Production Data Model Decision

## Decision

Select storage from consistency, access, latency, availability, residency, and operational requirements. Encode invariants with database constraints, choose indexes from measured query plans, and evolve schemas through compatibility-preserving phases. Keep backup, restore, retention, and deletion behavior part of the model.

## Use When

- Selecting a database, schema, key, relationship, index, partition, or ORM.
- Planning a backfill, online migration, retention rule, or high-volume query path.
- Correcting integrity drift, lock contention, N+1 access, or poor query plans.

## Avoid When

- No access patterns or consistency requirements are known.
- The task is only transport/API shape with no persistence decision.
- A production migration would proceed without owner approval, backup, and rehearsal.

## Trade-offs

- Normalization strengthens integrity but can increase joins on read-heavy paths.
- Denormalization reduces read work but introduces synchronization and repair obligations.
- Additional indexes accelerate selected reads while increasing writes, storage, and vacuum work.
- ORM convenience improves delivery speed but can obscure query shape and database-specific controls.

## Verification

Test constraints, transaction races, representative query plans, lock duration, replication lag, and data reconciliation. Rehearse expand/backfill/switch/contract migrations with old and new application versions. Verify backup restore, deletion/retention behavior, monitoring, and either rollback or an approved forward-fix path.

<a id="rule-indexing"></a>

## Database Indexing

**Impact:** high
**Kind:** reference
**Source:** `rules/indexing.md`

# Indexing Principles

> When and how to create indexes effectively. Index for known queries, not speculatively.

## Scope

Apply to index choice, column order, selectivity, predicates, expression indexes, write cost, and measured query plans.

## Guidance

---

## When to Create Indexes

```
Index these:
├── Columns in WHERE clauses (equality + range)
├── Columns in JOIN conditions (FK columns)
├── Columns in ORDER BY (sorting)
├── Unique constraints (auto-indexed)
└── Frequently filtered columns

Don't over-index:
├── Write-heavy tables (slower inserts/updates)
├── Low-cardinality columns (boolean, status with 3 values)
├── Columns rarely queried
└── Small tables (< 1000 rows — seq scan is fine)
```

---

## Index Type Selection

| Type | Use For | PostgreSQL Syntax |
|------|---------|-------------------|
| **B-tree** | General purpose, equality & range | Default — no keyword needed |
| **Hash** | Equality only (faster than B-tree for `=`) | `USING HASH` |
| **GIN** | JSONB, arrays, full-text search | `USING GIN` |
| **GiST** | Geometric, range types, spatial | `USING GiST` |
| **HNSW** | Vector similarity (pgvector) | `USING hnsw` |

### SQL Examples

```sql
-- B-tree (default) — equality + range
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_orders_created ON orders (created_at DESC);

-- Hash — equality only
CREATE INDEX idx_users_status ON users USING HASH (status);

-- GIN — JSONB fields
CREATE INDEX idx_products_metadata ON products USING GIN (metadata);

-- GIN — full-text search
CREATE INDEX idx_posts_search ON posts USING GIN (to_tsvector('english', title || ' ' || body));

-- GiST — spatial
CREATE INDEX idx_locations_coords ON locations USING GiST (coordinates);

-- HNSW — vector (pgvector)
CREATE INDEX idx_embeddings_vector ON items USING hnsw (embedding vector_cosine_ops);
```

---

## Composite Index Rules

```
Order matters for composite indexes:
├── 1. Equality columns FIRST
├── 2. Range/sort columns LAST
├── 3. Most selective column first (among equals)
└── 4. Match the query's WHERE + ORDER BY pattern
```

### Example

```sql
-- Query: WHERE status = 'active' AND created_at > '2025-01-01' ORDER BY created_at DESC
CREATE INDEX idx_orders_status_created
  ON orders (status, created_at DESC);

-- ✅ status (equality) first, created_at (range + sort) second
-- ❌ Wrong: (created_at, status) — can't use index for status equality
```

---

## Index with Prisma & Drizzle

```prisma
// Prisma — schema.prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  authorId  String   @map("author_id")
  status    String
  createdAt DateTime @default(now()) @map("created_at")

  @@index([authorId])
  @@index([status, createdAt(sort: Desc)])
}
```

```typescript
// Drizzle — schema.ts
import { index } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  authorId: uuid('author_id').notNull(),
  status: text('status').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  authorIdx: index('idx_posts_author').on(table.authorId),
  statusCreatedIdx: index('idx_posts_status_created').on(table.status, table.createdAt),
}));
```

---

## Verify Index Usage

```sql
-- Check if query uses index
EXPLAIN ANALYZE
SELECT * FROM orders
WHERE status = 'active' AND created_at > '2025-01-01'
ORDER BY created_at DESC
LIMIT 20;

-- Look for:
-- ✅ "Index Scan" or "Index Only Scan"
-- ❌ "Seq Scan" on large tables = missing index
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Index every column | Index for known query patterns |
| Skip indexes on foreign keys | Always index FK columns |
| Use B-tree for JSONB queries | Use GIN for JSONB |
| Create index blocking production | Use `CREATE INDEX CONCURRENTLY` |
| Ignore index size and maintenance | Monitor with `pg_stat_user_indexes` |

---



---

## Verification

Capture before/after plans and representative latency, rows, buffers, write cost, and index size. Verify production-safe creation, monitoring, and rollback; remove unused indexes only after observing the complete workload cycle.

## Related

| File | When to Read |
|------|-------------|
| [optimization.md](optimization.md) | EXPLAIN ANALYZE for query tuning |
| [schema-design.md](schema-design.md) | Schema that indexes support |
| [SKILL.md](../SKILL.md) | Index type quick reference |

---

⚡ PikaKit v3.9.224

<a id="rule-migrations"></a>

## Compatible Database Migrations

**Impact:** critical
**Kind:** reference
**Source:** `rules/migrations.md`

# Migration Principles

> Safe migration strategy for zero-downtime schema changes.

## Scope

Apply to expand/backfill/switch/contract schema changes, lock risk, application compatibility, data reconciliation, rollback, and forward-fix decisions.

## Guidance

---

## Safe Migration Patterns

```
For zero-downtime changes:
│
├── Adding column
│   └── Add as nullable → backfill → add NOT NULL constraint
│
├── Removing column
│   └── Stop reading → deploy → stop writing → deploy → DROP column
│
├── Renaming column
│   └── Add new column → copy data → deploy app → drop old column
│
├── Adding index
│   └── CREATE INDEX CONCURRENTLY (non-blocking)
│
└── Changing column type
    └── Add new column → copy → switch → drop old
```

> **Rule:** Never make breaking changes in one step. Always use multi-phase migrations.

---

## Migration Classification

| Type | Risk | Strategy |
|------|------|----------|
| **Additive** | Low | Add nullable column, add table, add index |
| **Destructive** | High | Drop column, change type, drop table |
| **Data migration** | Medium | Backfill, transform, merge |

---

## ORM Migration Commands

### Prisma

```bash
# Generate migration (review SQL before applying)
npx prisma migrate dev --name add_user_avatar

# Apply to production (no generation, just apply)
npx prisma migrate deploy

# Reset database (development only!)
npx prisma migrate reset

# View migration status
npx prisma migrate status
```

### Drizzle

```bash
# Generate migration SQL
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit migrate

# Push schema directly (development only)
npx drizzle-kit push

# View DB in browser
npx drizzle-kit studio
```

---

## Multi-Phase Migration Example

### Adding NOT NULL Column (Safe)

```sql
-- Phase 1: Add nullable column
ALTER TABLE users ADD COLUMN avatar_url TEXT;

-- Phase 2: Backfill data
UPDATE users SET avatar_url = 'https://default-avatar.png' WHERE avatar_url IS NULL;

-- Phase 3: Add NOT NULL (after backfill complete)
ALTER TABLE users ALTER COLUMN avatar_url SET NOT NULL;
ALTER TABLE users ALTER COLUMN avatar_url SET DEFAULT 'https://default-avatar.png';
```

### Renaming Column (Safe)

```sql
-- Phase 1: Add new column
ALTER TABLE users ADD COLUMN display_name TEXT;

-- Phase 2: Copy data
UPDATE users SET display_name = full_name;

-- Phase 3: Deploy app reading from display_name
-- Phase 4: Drop old column
ALTER TABLE users DROP COLUMN full_name;
```

---

## Rollback Strategy

| Migration Type | Rollback Method |
|---------------|-----------------|
| Add column | `ALTER TABLE DROP COLUMN` |
| Add index | `DROP INDEX` |
| Add table | `DROP TABLE` |
| Drop column | **Cannot undo** — data lost |
| Change type | Restore from backup |

> **Rule:** Always have a rollback plan. Test rollback in staging before production.

---

## Serverless Database Features

### Neon (Serverless PostgreSQL)

| Feature | Benefit | Migration Impact |
|---------|---------|-----------------|
| Database branching | Test migrations on branch | Safe preview |
| Scale to zero | Cost savings | Cold start on reconnect |
| Point-in-time restore | Recovery | Rollback to any point |

### Turso (Edge SQLite)

| Feature | Benefit | Migration Impact |
|---------|---------|-----------------|
| Edge replication | Low latency globally | Schema changes replicate |
| Embedded replicas | Local reads | Eventual consistency |
| SQLite compatible | Simple migrations | No ALTER TABLE limitations |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Run destructive migration in one step | Use multi-phase migration |
| Skip testing migration on data copy | Test on staging with production-size data |
| Lock tables during migration | Use `CONCURRENTLY` for indexes |
| Run `migrate reset` in production | Only use `migrate deploy` in production |
| Skip rollback plan | Document rollback before applying |

---



---

## Verification

Rehearse on production-shaped data, measure locks and replication lag, test old/new application compatibility, reconcile every backfilled row, and exercise rollback or the approved forward-fix before production.

## Related

| File | When to Read |
|------|-------------|
| [schema-design.md](schema-design.md) | Schema before migration |
| [indexing.md](indexing.md) | Index migrations |
| [database-selection.md](database-selection.md) | Serverless DB features |
| [SKILL.md](../SKILL.md) | Decision checklist |

---

⚡ PikaKit v3.9.224

<a id="rule-optimization"></a>

## Query Optimization

**Impact:** high
**Kind:** reference
**Source:** `rules/optimization.md`

# Query Optimization

> N+1 problem, EXPLAIN ANALYZE, optimization priorities with real examples.

## Scope

Apply to query counts, execution plans, pagination, caching, contention, and measurement-driven optimization.

## Guidance

---

## N+1 Problem

```
What is N+1?
├── 1 query to get parent records (e.g., 20 users)
├── N queries to get related records (20 × posts query)
└── Result: 21 queries instead of 1–2. Very slow!
```

### Detection & Fix

```typescript
// ❌ N+1 — Prisma (fetching posts separately)
const users = await prisma.user.findMany();
for (const user of users) {
  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
  });
}
// Result: 1 + N queries

// ✅ Fixed — Prisma (include)
const users = await prisma.user.findMany({
  include: { posts: true },
});
// Result: 2 queries (1 users + 1 posts with IN clause)

// ✅ Fixed — Drizzle (explicit join)
const result = await db
  .select()
  .from(users)
  .leftJoin(posts, eq(posts.authorId, users.id));
// Result: 1 query with JOIN
```

---

## EXPLAIN ANALYZE

```sql
-- Always EXPLAIN ANALYZE before optimizing
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT u.*, COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON p.author_id = u.id
WHERE u.status = 'active'
GROUP BY u.id
ORDER BY post_count DESC
LIMIT 20;
```

### Reading the Output

| Look For | Meaning | Action |
|----------|---------|--------|
| `Seq Scan` on large table | Full table scan | Add index |
| `Nested Loop` with high rows | N+1 at SQL level | Rewrite as JOIN |
| `Sort` with high cost | Sorting unsorted data | Add index with ORDER |
| `Hash Join` | Large dataset join | Usually OK; check memory |
| `actual rows` >> `rows` | Bad row estimate | Run `ANALYZE` on table |

---

## Optimization Priorities

| Priority | Action | Impact |
|----------|--------|--------|
| 1 | **Add missing indexes** | 10–100x faster |
| 2 | **Fix N+1 queries** | N → 2 queries |
| 3 | **Select only needed columns** | Less I/O |
| 4 | **Use proper JOINs** | Avoid subqueries |
| 5 | **Paginate at DB level** | Don't fetch all rows |
| 6 | **Cache hot queries** | Offload DB |

---

## Pagination Patterns

```typescript
// ❌ Offset pagination (slow on large datasets)
const page2 = await db.select().from(posts)
  .orderBy(desc(posts.createdAt))
  .offset(20)  // DB still scans first 20 rows
  .limit(20);

// ✅ Cursor pagination (fast, consistent)
const page2 = await db.select().from(posts)
  .where(lt(posts.createdAt, lastCursor))
  .orderBy(desc(posts.createdAt))
  .limit(20);
```

| Method | Performance | Use When |
|--------|------------|----------|
| Offset | O(offset + limit) | Small datasets, admin panels |
| Cursor | O(limit) | Large datasets, infinite scroll, APIs |

---

## Common Slow Patterns

```sql
-- ❌ SELECT * (fetches all columns)
SELECT * FROM users WHERE id = 1;

-- ✅ Select only needed
SELECT id, name, email FROM users WHERE id = 1;

-- ❌ LIKE with leading wildcard (no index)
SELECT * FROM users WHERE name LIKE '%john%';

-- ✅ Full-text search with GIN index
SELECT * FROM users WHERE to_tsvector('english', name) @@ to_tsquery('john');

-- ❌ COUNT(*) on large tables
SELECT COUNT(*) FROM orders;

-- ✅ Approximate count
SELECT reltuples AS estimate FROM pg_class WHERE relname = 'orders';
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Optimize without EXPLAIN | Always EXPLAIN ANALYZE first |
| Use SELECT * in production | Select only needed columns |
| Use offset pagination for large data | Use cursor pagination |
| Use LIKE '%term%' for search | Use full-text search with GIN |
| Ignore N+1 queries | Use JOIN or include/loader |

---



---

## Verification

Compare query count and execution plans using representative parameters and volume. Measure latency percentiles, database CPU/I/O, lock waits, cache hit behavior, and correctness; retain a rollback when plans regress.

## Related

| File | When to Read |
|------|-------------|
| [indexing.md](indexing.md) | Create indexes for slow queries |
| [orm-selection.md](orm-selection.md) | ORM-level N+1 prevention |
| [SKILL.md](../SKILL.md) | Decision checklist |

---

⚡ PikaKit v3.9.224

<a id="rule-orm-selection"></a>

## ORM and Query Builder Selection

**Impact:** high
**Kind:** reference
**Source:** `rules/orm-selection.md`

# ORM Selection

> Choose ORM based on deployment, DX needs, and N+1 prevention strategy.

## Scope

Apply to selecting an ORM or query builder from runtime, SQL control, migrations, typing, deployment, observability, and team constraints.

## Guidance

---

## Decision Tree

```
What's the context?
│
├── Edge deployment / Bundle size matters
│   └── Drizzle (smallest, SQL-like, edge-ready)
│
├── Best DX / Schema-first / Rapid prototyping
│   └── Prisma (migrations, studio, relations)
│
├── Maximum SQL control with type safety
│   └── Kysely (query builder, no schema file)
│
├── Raw SQL needed
│   └── node-postgres / better-sqlite3 + manual types
│
└── Python ecosystem
    └── SQLAlchemy 2.0 (async support)
```

---

## Comparison Matrix

| Feature | Drizzle | Prisma | Kysely |
|---------|---------|--------|--------|
| Bundle size | ~7 KB | ~2 MB | ~30 KB |
| Edge-ready | ✅ | ❌ | ✅ |
| Schema definition | TypeScript | `.prisma` file | None (inferred) |
| Migrations | `drizzle-kit` | `prisma migrate` | Manual / custom |
| Relations | Manual joins | `include` API | Manual joins |
| N+1 prevention | Explicit joins | `include` depth limits | Explicit joins |
| Type safety | Full (SQL-like) | Full (generated) | Full (inferred) |
| Studio/GUI | Drizzle Studio | Prisma Studio | None |
| Learning curve | Medium (SQL knowledge) | Low | Medium |

---

## Code Comparison

### Schema Definition

```typescript
// Drizzle — TypeScript schema
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  authorId: uuid('author_id').references(() => users.id).notNull(),
});
```

```prisma
// Prisma — .prisma schema
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  posts     Post[]
  createdAt DateTime @default(now()) @map("created_at")
}

model Post {
  id       String @id @default(cuid())
  title    String
  author   User   @relation(fields: [authorId], references: [id])
  authorId String @map("author_id")
}
```

### Query — Fetch User with Posts

```typescript
// Drizzle — explicit join (no N+1)
const result = await db
  .select()
  .from(users)
  .leftJoin(posts, eq(posts.authorId, users.id))
  .where(eq(users.id, userId));

// Prisma — include (watch for N+1 depth)
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: { posts: true },  // ⚠️ Limit depth: never nest > 2 levels
});

// Kysely — SQL builder
const result = await db
  .selectFrom('users')
  .leftJoin('posts', 'posts.author_id', 'users.id')
  .where('users.id', '=', userId)
  .selectAll()
  .execute();
```

---

## N+1 Prevention by ORM

| ORM | N+1 Risk | Prevention |
|-----|---------|------------|
| Drizzle | Low | Explicit `leftJoin` / `innerJoin` |
| Prisma | Medium | `include` with depth limit; avoid nested `include` > 2 |
| Kysely | Low | Explicit join queries |
| Raw SQL | None | You write the JOIN |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Use Prisma for edge functions | Use Drizzle (smaller bundle) |
| Nest Prisma `include` 3+ levels | Limit to 2 levels; separate queries |
| Use raw SQL for CRUD | Use ORM for type safety |
| Choose ORM without considering deployment | Match ORM to runtime (edge vs Node) |

---



---

## Verification

Implement representative transactions, joins, migrations, errors, and bulk operations. Inspect emitted SQL and plans, test connection lifecycle and runtime compatibility, and record an escape hatch for unsupported database features.

## Related

| File | When to Read |
|------|-------------|
| [database-selection.md](database-selection.md) | Choose database first |
| [schema-design.md](schema-design.md) | Schema patterns after ORM selected |
| [optimization.md](optimization.md) | N+1 and query optimization |
| [SKILL.md](../SKILL.md) | Decision checklist |

---

⚡ PikaKit v3.9.224

<a id="rule-schema-design"></a>

## Relational Schema Design

**Impact:** high
**Kind:** reference
**Source:** `rules/schema-design.md`

# Schema Design Principles

> Normalization, primary keys, timestamps, relationships with ORM examples.

## Scope

Apply to entities, keys, relationships, constraints, normalization, denormalization, tenancy, timestamps, and data lifecycle.

## Guidance

---

## Normalization Decision

```
When to normalize (separate tables):
├── Data is repeated across rows
├── Updates would need multiple changes
├── Relationships are clear (1:N, N:M)
└── Query patterns use JOINs

When to denormalize (embed/duplicate):
├── Read performance critical (dashboards)
├── Data rarely changes (audit logs)
├── Always fetched together (user + profile)
└── Simpler queries needed (reporting)
```

---

## Primary Key Selection

| Type | Use When | Example |
|------|----------|---------|
| **UUID v4** | Distributed systems, security | `550e8400-e29b-41d4-a716-446655440000` |
| **ULID** | UUID + sortable by time | `01ARZ3NDEKTSV4RRFFQ69G5FAV` |
| **cuid2** | Short, collision-resistant | `clh3am6x20000` |
| **Auto-increment** | Simple apps, single database | `1, 2, 3...` |

> **Default:** Use `cuid()` (Prisma) or `uuid()` (Drizzle) for new projects.

---

## Timestamp Strategy

```typescript
// Drizzle — every table gets these
import { timestamp } from 'drizzle-orm/pg-core';

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
};

// Prisma — every model gets these
// createdAt DateTime  @default(now()) @map("created_at")
// updatedAt DateTime  @updatedAt      @map("updated_at")
```

> **Rule:** Always use `TIMESTAMPTZ` (with timezone), never `TIMESTAMP`.

---

## Relationship Patterns

| Type | When | Implementation |
|------|------|----------------|
| **One-to-One** | Extension data (user → profile) | FK + unique constraint on child |
| **One-to-Many** | Parent-children (user → posts) | FK on child table |
| **Many-to-Many** | Both sides have many (posts ↔ tags) | Junction table |
| **Self-referential** | Tree structures (comments → replies) | FK referencing same table |

### Prisma Example (1:N + N:M)

```prisma
model User {
  id    String @id @default(cuid())
  posts Post[]
}

model Post {
  id       String @id @default(cuid())
  author   User   @relation(fields: [authorId], references: [id])
  authorId String @map("author_id")
  tags     PostTag[]
}

model Tag {
  id    String    @id @default(cuid())
  name  String    @unique
  posts PostTag[]
}

model PostTag {
  postId String @map("post_id")
  tagId  String @map("tag_id")
  post   Post   @relation(fields: [postId], references: [id])
  tag    Tag    @relation(fields: [tagId], references: [id])
  @@id([postId, tagId])
}
```

---

## Foreign Key ON DELETE

| Action | Behavior | Use When |
|--------|----------|----------|
| `CASCADE` | Delete children with parent | Comments when post deleted |
| `SET NULL` | Children become orphans | Author deleted, posts remain |
| `RESTRICT` | Prevent delete if children exist | User has active orders |
| `SET DEFAULT` | Children get default value | Rare; prefer SET NULL |

> **Default:** Use `RESTRICT` for safety. Explicitly choose `CASCADE` only when appropriate.

---

## Soft Delete Pattern

```typescript
// Drizzle
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// Query — exclude soft-deleted
const activeUsers = await db
  .select()
  .from(users)
  .where(isNull(users.deletedAt));
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Use `TIMESTAMP` without timezone | Use `TIMESTAMPTZ` always |
| Store JSON when relational fits | Normalize into related tables |
| Auto-increment IDs in distributed systems | Use UUID/ULID/cuid |
| Skip `ON DELETE` strategy | Explicitly define for every FK |
| `CASCADE` delete by default | Default to `RESTRICT`; explicitly choose |

---



---

## Verification

Test database constraints, transaction races, tenant isolation, cascade behavior, retention/deletion, and representative queries. Review generated migrations and restore a backup before approving destructive changes.

## Related

| File | When to Read |
|------|-------------|
| [indexing.md](indexing.md) | Index after schema designed |
| [migrations.md](migrations.md) | Migrate schema changes safely |
| [orm-selection.md](orm-selection.md) | ORM for schema definition |
| [SKILL.md](../SKILL.md) | Decision checklist |

---

⚡ PikaKit v3.9.224
