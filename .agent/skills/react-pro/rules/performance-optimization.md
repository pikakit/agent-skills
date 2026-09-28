---
"title": "React Performance Optimization"
"kind": "process"
"impact": "high"
"tags":
  - "performance"
  - "virtual"
  - "memo"
  - "lazy"
  - "bundle"
"applies_to":
  - "web"
"last_reviewed": "2026-09-28"
"sources":
  - "url": "https://react.dev/reference/react"
    "title": "Official documentation"
---

# React Performance Optimization

## Preconditions

Record the current behavior, target environment, acceptance criteria, and a recoverable baseline before starting.

## Procedure

# React Performance Optimization

> Priority-based performance optimization: waterfalls → bundle → re-renders → lists.

---

## Priority Matrix

| Priority | Category | Action |
|:--------:|----------|--------|
| 1 | Eliminate waterfalls | `Promise.all()`, parallel fetch, Suspense streaming |
| 2 | Bundle size | Direct imports (no barrels), `dynamic()`, lazy load |
| 3 | Re-renders | React Compiler (19), then `useMemo`/`useCallback` |
| 4 | Large lists | Virtualize with `@tanstack/react-virtual` |

## Virtualized List (10K+ items)

```tsx
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  })

  return (
    <div ref={parentRef} style={{ height: 400, overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(row => (
          <div key={row.key} style={{
            position: 'absolute',
            top: row.start,
            height: row.size,
            width: '100%',
          }}>
            {items[row.index].name}
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Premature `useMemo`/`useCallback` | Profile first (React Compiler handles most) |
| Barrel file re-exports | Direct imports for smaller bundles |
| God components (> 300 lines) | Split at 150 lines |

## Rollback

Restore the recorded baseline if a required command errors, evidence becomes inconclusive, or the change introduces a regression.

## Exit Gate

Complete only with fresh, reproducible evidence for the intended behavior and all relevant project checks passing.
