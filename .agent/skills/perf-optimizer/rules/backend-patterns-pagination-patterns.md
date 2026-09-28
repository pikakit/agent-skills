---
"title": "Backend Patterns: Pagination Patterns"
"kind": "reference"
"impact": "high"
"tags":
  - "backend-patterns-pagination-patterns"
"applies_to":
  - "web"
  - "node"
"last_reviewed": "2026-09-28"
"sources":
  - "url": "https://web.dev/articles/vitals"
    "title": "Official documentation"
---

# Backend Patterns: Pagination Patterns

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> Database and caching optimization patterns for backend performance. **Profile first, optimize second.**

---

## Pagination Patterns

### Offset Pagination (Simple, for small datasets)

```typescript
// ❌ Offset gets slower as page number grows
const users = await db.user.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
  orderBy: { createdAt: 'desc' },
})
// Page 1000: DB must scan and skip 999 * pageSize rows
```

### Cursor Pagination (Efficient, for large datasets)

```typescript
// ✅ Cursor is consistently fast regardless of page depth
const users = await db.user.findMany({
  take: pageSize,
  ...(cursor && {
    skip: 1, // Skip the cursor item itself
    cursor: { id: cursor },
  }),
  orderBy: { createdAt: 'desc' },
})

const nextCursor = users.length === pageSize ? users[users.length - 1].id : null

return { items: users, nextCursor }
```

### When to Use Each

| Pattern | Use When |
|---------|----------|
| **Offset** | Admin tables, small datasets (< 10K rows), need page numbers |
| **Cursor** | Infinite scroll, large datasets, real-time feeds, API endpoints |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
