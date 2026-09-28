---
"title": "Subscribe to Derived State"
"kind": "code"
"impact": "standard"
"tags":
  - "rerender"
  - "derived-state"
  - "media-query"
  - "optimization"
"applies_to":
  - "node"
  - "web"
"last_reviewed": "2026-09-28"
"sources":
  - "url": "https://nextjs.org/docs"
    "title": "Official documentation"
---

# Subscribe to Derived State

## Subscribe to Derived State

Subscribe to derived boolean state instead of continuous values to reduce re-render frequency.

## Incorrect
```tsx
function Sidebar() {
  const width = useWindowWidth()  // updates continuously
  const isMobile = width < 768
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}
```

## Correct
```tsx
function Sidebar() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}
```

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.
