---
"title": "Use Explicit Conditional Rendering"
"kind": "code"
"impact": "standard"
"tags":
  - "rendering"
  - "conditional"
  - "jsx"
  - "falsy-values"
"applies_to":
  - "node"
  - "web"
"last_reviewed": "2026-09-28"
"sources":
  - "url": "https://nextjs.org/docs"
    "title": "Official documentation"
---

# Use Explicit Conditional Rendering

## Use Explicit Conditional Rendering

Use explicit ternary operators (`? :`) instead of `&&` for conditional rendering when the condition can be `0`, `NaN`, or other falsy values that render.

## Incorrect
```tsx
function Badge({ count }: { count: number }) {
  return (
    <div>
      {count && <span className="badge">{count}</span>}
    </div>
  )
}

// When count = 0, renders: <div>0</div>
// When count = 5, renders: <div><span class="badge">5</span></div>
```

## Correct
```tsx
function Badge({ count }: { count: number }) {
  return (
    <div>
      {count > 0 ? <span className="badge">{count}</span> : null}
    </div>
  )
}

// When count = 0, renders: <div></div>
// When count = 5, renders: <div><span class="badge">5</span></div>
```

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.
