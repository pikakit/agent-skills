---
"title": "Optimize SVG Precision"
"kind": "code"
"impact": "standard"
"tags":
  - "rendering"
  - "svg"
  - "optimization"
  - "svgo"
"applies_to":
  - "node"
  - "web"
"last_reviewed": "2026-09-28"
"sources":
  - "url": "https://nextjs.org/docs"
    "title": "Official documentation"
---

# Optimize SVG Precision

## Optimize SVG Precision

Reduce SVG coordinate precision to decrease file size. The optimal precision depends on the viewBox size, but in general reducing precision should be considered.

## Incorrect
```svg
<path d="M 10.293847 20.847362 L 30.938472 40.192837" />
```

## Correct
```svg
<path d="M 10.3 20.8 L 30.9 40.2" />
```

**Automate with SVGO:**

```bash
npx svgo --precision=1 --multipass icon.svg
```

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.
