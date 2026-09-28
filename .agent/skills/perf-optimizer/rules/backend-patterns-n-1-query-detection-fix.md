---
"title": "Backend Patterns: N+1 Query Detection & Fix"
"kind": "reference"
"impact": "high"
"tags":
  - "backend-patterns-n-1-query-detection-fix"
"applies_to":
  - "web"
  - "node"
"last_reviewed": "2026-09-28"
"sources":
  - "url": "https://web.dev/articles/vitals"
    "title": "Official documentation"
---

# Backend Patterns: N+1 Query Detection & Fix

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> Database and caching optimization patterns for backend performance. **Profile first, optimize second.**

---

## N+1 Query Detection & Fix

### Detection Signs

| Symptom | Indicator |
|---------|-----------|
| Slow list endpoints | Check query count with logging |
| ORM lazy loading | `findMany` / `find` inside loops |
| GraphQL resolvers | Nested field without DataLoader |
| Response time scales with data | 10 items = OK, 1000 items = slow |

### The Problem

```typescript
// ❌ N+1: 1 query for users + N queries for posts
const users = await db.user.findMany()
for (const user of users) {
  const posts = await db.post.findMany({ where: { userId: user.id } })
  user.posts = posts
}
// 101 queries for 100 users!
```

### Fix Patterns

```typescript
// ✅ Fix 1: Eager Loading (Prisma)
const users = await prisma.user.findMany({
  include: { posts: true }
})
// 2 queries total (1 for users + 1 for posts with IN clause)

// ✅ Fix 1: Eager Loading (Drizzle)
const users = await db.query.users.findMany({
  with: { posts: true }
})
```

```typescript
// ✅ Fix 2: Batch Query (manual)
const users = await db.user.findMany()
const userIds = users.map(u => u.id)
const posts = await db.post.findMany({
  where: { userId: { in: userIds } }
})

// Group posts by userId
const postsByUser = new Map<string, Post[]>()
for (const post of posts) {
  const list = postsByUser.get(post.userId) || []
  list.push(post)
  postsByUser.set(post.userId, list)
}
```

```typescript
// ✅ Fix 3: DataLoader (for GraphQL)
import DataLoader from 'dataloader'

const postLoader = new DataLoader(async (userIds: readonly string[]) => {
  const posts = await db.post.findMany({
    where: { userId: { in: [...userIds] } }
  })
  return userIds.map(id => posts.filter(p => p.userId === id))
})

// In resolver — auto-batched and cached per request
const userPosts = await postLoader.load(userId)
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
