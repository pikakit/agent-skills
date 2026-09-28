---
"title": "Build Index Maps for Repeated Lookups"
"kind": "code"
"impact": "standard"
"tags":
  - "javascript"
  - "map"
  - "indexing"
  - "optimization"
  - "performance"
"applies_to":
  - "node"
  - "web"
"last_reviewed": "2026-09-28"
"sources":
  - "url": "https://nextjs.org/docs"
    "title": "Official documentation"
---

# Build Index Maps for Repeated Lookups

## Build Index Maps for Repeated Lookups

Multiple `.find()` calls by the same key should use a Map.

## Incorrect
```typescript
function processOrders(orders: Order[], users: User[]) {
  return orders.map(order => ({
    ...order,
    user: users.find(u => u.id === order.userId)
  }))
}
```

## Correct
```typescript
function processOrders(orders: Order[], users: User[]) {
  const userById = new Map(users.map(u => [u.id, u]))

  return orders.map(order => ({
    ...order,
    user: userById.get(order.userId)
  }))
}
```

Build map once (O(n)), then all lookups are O(1).
For 1000 orders × 1000 users: 1M ops → 2K ops.

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.
