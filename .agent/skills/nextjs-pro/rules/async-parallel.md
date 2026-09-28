---
"title": "Promise.all() for Independent Operations"
"kind": "code"
"impact": "critical"
"tags":
  - "async"
  - "parallelization"
  - "promises"
  - "waterfalls"
"applies_to":
  - "node"
  - "web"
"last_reviewed": "2026-09-28"
"sources":
  - "url": "https://nextjs.org/docs"
    "title": "Official documentation"
---

# Promise.all() for Independent Operations

## Promise.all() for Independent Operations

When async operations have no interdependencies, execute them concurrently using `Promise.all()`.

## Incorrect
```typescript
const user = await fetchUser()
const posts = await fetchPosts()
const comments = await fetchComments()
```

## Correct
```typescript
const [user, posts, comments] = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchComments()
])
```

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.
