---
"title": "Cache Property Access in Loops"
"kind": "code"
"impact": "standard"
"tags":
  - "javascript"
  - "loops"
  - "optimization"
  - "caching"
"applies_to":
  - "node"
  - "web"
"last_reviewed": "2026-09-28"
"sources":
  - "url": "https://nextjs.org/docs"
    "title": "Official documentation"
---

# Cache Property Access in Loops

## Cache Property Access in Loops

Cache object property lookups in hot paths.

## Incorrect
```typescript
for (let i = 0; i < arr.length; i++) {
  process(obj.config.settings.value)
}
```

## Correct
```typescript
const value = obj.config.settings.value
const len = arr.length
for (let i = 0; i < len; i++) {
  process(value)
}
```

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.
