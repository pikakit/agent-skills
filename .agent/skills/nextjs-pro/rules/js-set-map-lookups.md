---
"title": "Use Set/Map for O(1) Lookups"
"kind": "code"
"impact": "standard"
"tags":
  - "javascript"
  - "set"
  - "map"
  - "data-structures"
  - "performance"
"applies_to":
  - "node"
  - "web"
"last_reviewed": "2026-09-28"
"sources":
  - "url": "https://nextjs.org/docs"
    "title": "Official documentation"
---

# Use Set/Map for O(1) Lookups

## Use Set/Map for O(1) Lookups

Convert arrays to Set/Map for repeated membership checks.

## Incorrect
```typescript
const allowedIds = ['a', 'b', 'c', ...]
items.filter(item => allowedIds.includes(item.id))
```

## Correct
```typescript
const allowedIds = new Set(['a', 'b', 'c', ...])
items.filter(item => allowedIds.has(item.id))
```

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.
