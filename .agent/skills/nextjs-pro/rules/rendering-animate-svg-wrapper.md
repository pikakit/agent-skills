---
"title": "Animate SVG Wrapper Instead of SVG Element"
"kind": "code"
"impact": "standard"
"tags":
  - "rendering"
  - "svg"
  - "css"
  - "animation"
  - "performance"
"applies_to":
  - "node"
  - "web"
"last_reviewed": "2026-09-28"
"sources":
  - "url": "https://nextjs.org/docs"
    "title": "Official documentation"
---

# Animate SVG Wrapper Instead of SVG Element

## Animate SVG Wrapper Instead of SVG Element

Many browsers don't have hardware acceleration for CSS3 animations on SVG elements. Wrap SVG in a `<div>` and animate the wrapper instead.

## Incorrect
```tsx
function LoadingSpinner() {
  return (
    <svg 
      className="animate-spin"
      width="24" 
      height="24" 
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" />
    </svg>
  )
}
```

## Correct
```tsx
function LoadingSpinner() {
  return (
    <div className="animate-spin">
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" />
      </svg>
    </div>
  )
}
```

This applies to all CSS transforms and transitions (`transform`, `opacity`, `translate`, `scale`, `rotate`). The wrapper div allows browsers to use GPU acceleration for smoother animations.

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.
