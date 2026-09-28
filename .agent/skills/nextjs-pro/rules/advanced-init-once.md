---
"title": "Initialize App Once, Not Per Mount"
"kind": "code"
"impact": "standard"
"tags":
  - "initialization"
  - "useEffect"
  - "app-startup"
  - "side-effects"
"applies_to":
  - "node"
  - "web"
"last_reviewed": "2026-09-28"
"sources":
  - "url": "https://nextjs.org/docs"
    "title": "Official documentation"
---

# Initialize App Once, Not Per Mount

## Initialize App Once, Not Per Mount

Do not put app-wide initialization that must run once per app load inside `useEffect([])` of a component. Components can remount and effects will re-run. Use a module-level guard or top-level init in the entry module instead.

## Incorrect
```tsx
function Comp() {
  useEffect(() => {
    loadFromStorage()
    checkAuthToken()
  }, [])

  // ...
}
```

## Correct
```tsx
let didInit = false

function Comp() {
  useEffect(() => {
    if (didInit) return
    didInit = true
    loadFromStorage()
    checkAuthToken()
  }, [])

  // ...
}
```

Reference: [Initializing the application](https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application)

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.
