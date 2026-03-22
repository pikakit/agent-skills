---
name: nextjs-pro
description: >-
  Next.js App Router & React performance patterns. Server Components, data fetching, routing,
  caching, and 57 optimization rules across 8 categories. Triggers on: Next.js, App Router,
  RSC, React, frontend, performance, SSR, SSG.
metadata:
  author: pikakit
  version: "2.0.0"
---

# Next.js Pro â€” App Router & React Performance

> Server-first. 3 data strategies. 4 route files. 57 rules. 8 categories. CWV targets.

**Philosophy:** Performance is a feature. Waterfalls are the enemy. Server first.

---

## When to Use

| Situation | Action |
|-----------|--------|
| Building React frontend | Use App Router patterns |
| Server vs Client decision | Use component decision tree |
| Data fetching strategy | Route by volatility |
| Performance patterns | Read rules/ by category |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Server/Client component decision | React architecture (â†’ react-architect) |
| Data fetching strategy (3 options) | CSS/styling (â†’ tailwind-kit) |
| Routing conventions (4 files) | Design system (â†’ design-system) |
| 57 performance rules (8 categories) | Performance profiling (â†’ perf-optimizer) |

**Expert decision skill:** Produces patterns and rule references. Does not write code.

---

## Server vs Client Decision (Binary)

```
Need useState / useEffect / event handlers?
â”œâ”€â”€ YES â†’ 'use client'
â””â”€â”€ NO  â†’ Server Component (default, no directive)
```

| Type | Use For |
|------|---------|
| **Server** | Data fetching, layouts, static content |
| **Client** | Forms, buttons, interactive UI |

---

## Data Fetching (3 Strategies â€” Fixed)

| Volatility | Strategy | Cache Config | Use Case |
|-----------|----------|-------------|----------|
| Static | Default | `cache: 'force-cache'` | Content pages |
| Periodic | ISR | `revalidate: 60` | Dynamic but cacheable |
| Real-time | Dynamic | `cache: 'no-store'` | Live data |

---

## Route Conventions (4 Files â€” Fixed)

| File | Purpose | Required |
|------|---------|----------|
| `page.tsx` | Route UI | Yes |
| `layout.tsx` | Shared layout | Yes (root) |
| `loading.tsx` | Loading state (Suspense) | Recommended |
| `error.tsx` | Error boundary | Recommended |

---

## Core Web Vitals Targets (Fixed)

| Metric | Target |
|--------|--------|
| LCP | < 2,500 ms |
| INP | < 200 ms |
| CLS | < 0.1 |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNKNOWN_CATEGORY` | Yes | Rule category not one of 8 |
| `ERR_INVALID_VOLATILITY` | Yes | Data volatility not recognized |

**Zero internal retries.** Deterministic; same context = same pattern.

---

## Anti-Patterns

| âŒ Don't | âœ… Do |
|---------|-------|
| `'use client'` everywhere | Server Component by default |
| Fetch data in Client Components | Fetch in Server Components |
| Barrel imports (`index.js`) | Direct imports |
| Nested awaits (waterfall) | `Promise.all()` (parallel) |
| Skip loading/error states | Use loading.tsx + error.tsx |

---

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | JavaScript Performance | HIGH | `js-` |
| 2 | Re-render Optimization | HIGH | `rerender-` |
| 3 | Rendering Performance | HIGH | `rendering-` |
| 4 | Server-Side Performance | HIGH | `server-` |
| 5 | Eliminating Waterfalls | MEDIUM | `async-` |
| 6 | Bundle Size Optimization | MEDIUM | `bundle-` |
| 7 | Client-Side Data Fetching | MEDIUM | `client-` |
| 8 | Advanced Patterns | MEDIUM | `advanced-` |
| 9 | Engineering Spec | LOW | `engineering-` |

## Quick Reference

### 1. JavaScript Performance (HIGH)

- `js-batch-dom-css` - js-batch-dom-css
- `js-cache-function-results` - js-cache-function-results
- `js-cache-property-access` - js-cache-property-access
- `js-cache-storage` - js-cache-storage
- `js-combine-iterations` - js-combine-iterations
- `js-early-exit` - js-early-exit
- `js-hoist-regexp` - js-hoist-regexp
- `js-index-maps` - js-index-maps
- `js-length-check-first` - js-length-check-first
- `js-min-max-loop` - js-min-max-loop
- `js-set-map-lookups` - js-set-map-lookups
- `js-tosorted-immutable` - js-tosorted-immutable

### 2. Re-render Optimization (HIGH)

- `rerender-defer-reads` - rerender-defer-reads
- `rerender-dependencies` - rerender-dependencies
- `rerender-derived-state-no-effect` - rerender-derived-state-no-effect
- `rerender-derived-state` - rerender-derived-state
- `rerender-functional-setstate` - rerender-functional-setstate
- `rerender-lazy-state-init` - rerender-lazy-state-init
- `rerender-memo-with-default-value` - rerender-memo-with-default-value
- `rerender-memo` - rerender-memo
- `rerender-move-effect-to-event` - rerender-move-effect-to-event
- `rerender-simple-expression-in-memo` - rerender-simple-expression-in-memo
- `rerender-transitions` - rerender-transitions
- `rerender-use-ref-transient-values` - rerender-use-ref-transient-values

### 3. Rendering Performance (HIGH)

- `rendering-activity` - rendering-activity
- `rendering-animate-svg-wrapper` - rendering-animate-svg-wrapper
- `rendering-conditional-render` - rendering-conditional-render
- `rendering-content-visibility` - rendering-content-visibility
- `rendering-hoist-jsx` - rendering-hoist-jsx
- `rendering-hydration-no-flicker` - rendering-hydration-no-flicker
- `rendering-hydration-suppress-warning` - rendering-hydration-suppress-warning
- `rendering-svg-precision` - rendering-svg-precision
- `rendering-usetransition-loading` - rendering-usetransition-loading

### 4. Server-Side Performance (HIGH)

- `server-after-nonblocking` - server-after-nonblocking
- `server-auth-actions` - server-auth-actions
- `server-cache-lru` - server-cache-lru
- `server-cache-react` - server-cache-react
- `server-dedup-props` - server-dedup-props
- `server-parallel-fetching` - server-parallel-fetching
- `server-serialization` - server-serialization

### 5. Eliminating Waterfalls (MEDIUM)

- `async-api-routes` - async-api-routes
- `async-defer-await` - async-defer-await
- `async-dependencies` - async-dependencies
- `async-parallel` - async-parallel
- `async-suspense-boundaries` - async-suspense-boundaries

### 6. Bundle Size Optimization (MEDIUM)

- `bundle-barrel-imports` - bundle-barrel-imports
- `bundle-conditional` - bundle-conditional
- `bundle-defer-third-party` - bundle-defer-third-party
- `bundle-dynamic-imports` - bundle-dynamic-imports
- `bundle-preload` - bundle-preload

### 7. Client-Side Data Fetching (MEDIUM)

- `client-event-listeners` - client-event-listeners
- `client-localstorage-schema` - client-localstorage-schema
- `client-passive-event-listeners` - client-passive-event-listeners
- `client-swr-dedup` - client-swr-dedup

### 8. Advanced Patterns (MEDIUM)

- `advanced-event-handler-refs` - advanced-event-handler-refs
- `advanced-init-once` - advanced-init-once
- `advanced-use-latest` - advanced-use-latest

### 9. Engineering Spec (LOW)

- `engineering-spec` - Next.js Pro â€” Engineering Specification

## How to Use

Read individual rule files for detailed explanations and code examples:

```
rules/advanced-event-handler-refs.md
rules/advanced-init-once.md
```

Each rule file contains:
- Brief explanation of why it matters
- Incorrect code example with explanation
- Correct code example with explanation
- Additional context and references

## Full Compiled Document

For the complete guide with all rules expanded: `AGENTS.md`


## ðŸ“‘ Content Map

| Category | Files | Focus | When to Read |
|----------|-------|-------|--------------|
| `rules/async-*.md` | 5 | Waterfalls, parallel fetch | Data fetching |
| `rules/bundle-*.md` | 5 | Tree-shaking, lazy loading | Bundle size |
| `rules/server-*.md` | 7 | RSC, caching, actions | Server Components |
| `rules/client-*.md` | 4 | Events, SWR, localStorage | Client Components |
| `rules/rendering-*.md` | 9 | Hydration, transitions | Rendering issues |
| `rules/rerender-*.md` | 12 | Memo, state, effects | Re-render prevention |
| `rules/js-*.md` | 12 | Micro-patterns | JS performance |
| `rules/advanced-*.md` | 3 | Event refs, init-once, useLatest | Advanced patterns |
| `rules/_*.md, schema.json` | 3 | Section catalog, template, schema | Rule authoring |
| [engineering-spec.md](rules/engineering-spec.md) | 1 | Full engineering spec | Architecture review |

**Selective reading:** Read ONLY the category relevant to current task.

---

## ðŸ”— Related

| Item | Type | Purpose |
|------|------|---------|
| `react-architect` | Skill | React patterns |
| `tailwind-kit` | Skill | Styling |
| `perf-optimizer` | Skill | Performance profiling |

---

âš¡ PikaKit v3.9.105
