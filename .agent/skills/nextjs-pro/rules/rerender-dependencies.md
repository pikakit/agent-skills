---
"title": "Narrow Effect Dependencies"
"kind": "code"
"impact": "standard"
"tags":
  - "rerender"
  - "useEffect"
  - "dependencies"
  - "optimization"
"applies_to":
  - "node"
  - "web"
"last_reviewed": "2026-09-28"
"sources":
  - "url": "https://nextjs.org/docs"
    "title": "Official documentation"
---

# Narrow Effect Dependencies

## Narrow Effect Dependencies

Specify primitive dependencies instead of objects to minimize effect re-runs.

## Incorrect
```tsx
useEffect(() => {
  console.log(user.id)
}, [user])
```

## Correct
```tsx
useEffect(() => {
  console.log(user.id)
}, [user.id])
```

**For derived state, compute outside effect:**

```tsx
// Incorrect: runs on width=767, 766, 765...
useEffect(() => {
  if (width < 768) {
    enableMobileMode()
  }
}, [width])

// Correct: runs only on boolean transition
const isMobile = width < 768
useEffect(() => {
  if (isMobile) {
    enableMobileMode()
  }
}, [isMobile])
```

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.
