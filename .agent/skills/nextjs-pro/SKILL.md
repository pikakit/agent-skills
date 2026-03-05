---
name: nextjs-pro
description: >-
  Next.js App Router & React performance patterns. Server Components, data fetching,
  routing, caching, and 57 optimization rules across 8 categories.
  Triggers on: Next.js, App Router, RSC, React, frontend, performance, SSR, SSG.
  Coordinates with: design-system, tailwind-kit, react-architect.
metadata:
  category: "framework"
  version: "2.0.0"
  triggers: "Next.js, React, App Router, RSC, frontend, performance"
  success_metrics: "LCP < 2.5s, INP < 200ms, CLS < 0.1, build passes"
  coordinates_with: "design-system, tailwind-kit, react-architect"
---

# Next.js Pro — App Router & React Performance

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
| Server/Client component decision | React architecture (→ react-architect) |
| Data fetching strategy (3 options) | CSS/styling (→ tailwind-kit) |
| Routing conventions (4 files) | Design system (→ design-system) |
| 57 performance rules (8 categories) | Performance profiling (→ perf-optimizer) |

**Expert decision skill:** Produces patterns and rule references. Does not write code.

---

## Server vs Client Decision (Binary)

```
Need useState / useEffect / event handlers?
├── YES → 'use client'
└── NO  → Server Component (default, no directive)
```

| Type | Use For |
|------|---------|
| **Server** | Data fetching, layouts, static content |
| **Client** | Forms, buttons, interactive UI |

---

## Data Fetching (3 Strategies — Fixed)

| Volatility | Strategy | Cache Config | Use Case |
|-----------|----------|-------------|----------|
| Static | Default | `cache: 'force-cache'` | Content pages |
| Periodic | ISR | `revalidate: 60` | Dynamic but cacheable |
| Real-time | Dynamic | `cache: 'no-store'` | Live data |

---

## Route Conventions (4 Files — Fixed)

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

| ❌ Don't | ✅ Do |
|---------|-------|
| `'use client'` everywhere | Server Component by default |
| Fetch data in Client Components | Fetch in Server Components |
| Barrel imports (`index.js`) | Direct imports |
| Nested awaits (waterfall) | `Promise.all()` (parallel) |
| Skip loading/error states | Use loading.tsx + error.tsx |

---

## 📑 Content Map

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
| [engineering-spec.md](references/engineering-spec.md) | 1 | Full engineering spec | Architecture review |

**Selective reading:** Read ONLY the category relevant to current task.

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `react-architect` | Skill | React patterns |
| `tailwind-kit` | Skill | Styling |
| `perf-optimizer` | Skill | Performance profiling |

---

⚡ PikaKit v3.9.80
