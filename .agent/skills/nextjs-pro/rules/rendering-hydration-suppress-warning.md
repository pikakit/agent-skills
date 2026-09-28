---
"title": "Suppress Expected Hydration Mismatches"
"kind": "code"
"impact": "standard"
"tags":
  - "rendering"
  - "hydration"
  - "ssr"
  - "nextjs"
"applies_to":
  - "node"
  - "web"
"last_reviewed": "2026-09-28"
"sources":
  - "url": "https://nextjs.org/docs"
    "title": "Official documentation"
---

# Suppress Expected Hydration Mismatches

## Suppress Expected Hydration Mismatches

In SSR frameworks (e.g., Next.js), some values are intentionally different on server vs client (random IDs, dates, locale/timezone formatting). For these *expected* mismatches, wrap the dynamic text in an element with `suppressHydrationWarning` to prevent noisy warnings. Do not use this to hide real bugs. Don’t overuse it.

## Incorrect
```tsx
function Timestamp() {
  return <span>{new Date().toLocaleString()}</span>
}
```

## Correct
```tsx
function Timestamp() {
  return (
    <span suppressHydrationWarning>
      {new Date().toLocaleString()}
    </span>
  )
}
```

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.
