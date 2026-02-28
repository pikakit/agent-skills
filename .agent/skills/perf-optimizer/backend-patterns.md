# Backend Performance Patterns

> Database and caching optimization patterns for backend performance.

---

## N+1 Query Detection & Fix

### Pattern Recognition

```
❌ N+1 Problem:
users.forEach(user => {
  const posts = await db.posts.findMany({ where: { userId: user.id } });
});
// 1 query for users + N queries for posts = N+1 queries
```

### Detection Signs

| Symptom | Indicator |
|---------|-----------|
| Slow list endpoints | Check query count |
| ORM lazy loading | `findMany` inside loops |
| GraphQL resolvers | Nested field without DataLoader |

### Fix Patterns

```typescript
// ✅ Eager Loading (Prisma)
const users = await prisma.user.findMany({
  include: { posts: true }
});

// ✅ Batch Query
const userIds = users.map(u => u.id);
const posts = await prisma.post.findMany({
  where: { userId: { in: userIds } }
});

// ✅ DataLoader (for GraphQL)
const postLoader = new DataLoader(async (userIds) => {
  const posts = await prisma.post.findMany({
    where: { userId: { in: userIds } }
  });
  return userIds.map(id => posts.filter(p => p.userId === id));
});
```

---

## Redis Caching Patterns

### Cache-Aside Pattern

```typescript
async function getUser(userId: string) {
  // 1. Check cache
  const cached = await redis.get(`user:${userId}`);
  if (cached) return JSON.parse(cached);

  // 2. Miss → fetch from DB
  const user = await db.user.findUnique({ where: { id: userId } });

  // 3. Set cache with TTL
  await redis.setex(`user:${userId}`, 3600, JSON.stringify(user));

  return user;
}
```

### TTL Guidelines

| Data Type | TTL | Reason |
|-----------|-----|--------|
| Static reference | 24h | Rarely changes |
| User profile | 1h | Occasional updates |
| Session data | 15-30min | Security |
| Real-time data | 30s-5min | Freshness matters |
| Computed aggregates | 5-15min | Expensive to compute |

### Cache Invalidation

```typescript
// On write, delete related keys
async function updateUser(userId: string, data: UserUpdate) {
  await db.user.update({ where: { id: userId }, data });
  
  // Invalidate caches
  await redis.del(`user:${userId}`);
  await redis.del(`user:${userId}:profile`);
  await redis.del(`user:${userId}:permissions`);
}
```

### Cache Key Naming Convention

```
{entity}:{id}              → user:123
{entity}:{id}:{field}      → user:123:profile
{entity}:list:{params}     → user:list:page=1&limit=20
{entity}:count:{filter}    → user:count:active=true
```

---

## Database Query Optimization

### Indexing Strategy

| Query Pattern | Index Type |
|---------------|------------|
| Equality (`WHERE x = ?`) | B-tree index |
| Range (`WHERE x > ?`) | B-tree index |
| Full-text search | Full-text index |
| JSON fields | GIN index (PostgreSQL) |

### Query Analysis

```sql
-- Always analyze slow queries
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
```

---

⚡ PikaKit v3.9.67
