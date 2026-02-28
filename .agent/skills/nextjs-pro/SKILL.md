---
name: nextjs-pro
description: >-
  Next.js App Router & React performance patterns. Server Components, data fetching,
  routing, caching, and 60+ optimization rules.
  Triggers on: Next.js, App Router, RSC, React, frontend, performance, SSR, SSG.
  Coordinates with: design-system, tailwind-kit, react-architect.
metadata:
  category: "framework"
  version: "2.0.0"
  triggers: "Next.js, React, App Router, RSC, frontend, performance"
  coordinates_with: "design-system, tailwind-kit, react-architect"
  success_metrics: "Core Web Vitals pass, build passes"
---

# Next.js & React Frontend

> **Purpose:** Modern frontend patterns with Next.js App Router and React performance

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Building React frontend | Use App Router patterns |
| Performance optimization | Check Core Web Vitals |
| Data fetching | Use Server Components |
| Routing decisions | See routing rules |

---

## Quick Reference

| Task | Pattern |
|------|---------|
| **Server Component** | Default (no directive) |
| **Client Component** | `'use client'` at top |
| **Data Fetch** | fetch in Server Component |
| **ISR** | `revalidate: 60` |
| **Dynamic** | `cache: 'no-store'` |

---

## Server vs Client Decision

```
Need useState/useEffect/events?
├── YES → 'use client'
└── NO  → Server Component (default)
```

| Type | Use For |
|------|---------|
| **Server** | Data fetching, layouts, static |
| **Client** | Forms, buttons, interactive UI |

---

## Data Fetching

| Pattern | Cache | Use |
|---------|-------|-----|
| Default | Static (build) | Content pages |
| `revalidate: 60` | ISR | Dynamic but cacheable |
| `no-store` | None | Real-time data |

---

## Routing Conventions

| File | Purpose |
|------|---------|
| `page.tsx` | Route UI |
| `layout.tsx` | Shared layout |
| `loading.tsx` | Loading state |
| `error.tsx` | Error boundary |

---

## Performance Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| `'use client'` everywhere | Server by default |
| Fetch in client | Fetch in server |
| Barrel imports (`index.js`) | Direct imports |
| Nested awaits | Parallel fetch |
| Skip loading states | Use Suspense |

---

## Rules Library (60+ Patterns)

Detailed optimization rules in `rules/`:

| Category | Files | Focus |
|----------|-------|-------|
| `async-*.md` | 5 | Waterfalls, parallel fetch |
| `bundle-*.md` | 5 | Tree-shaking, lazy loading |
| `server-*.md` | 8 | RSC, caching, actions |
| `client-*.md` | 4 | Events, SWR, localStorage |
| `rendering-*.md` | 10 | Hydration, transitions |
| `rerender-*.md` | 12 | Memo, state, effects |
| `js-*.md` | 11 | Micro-optimizations |

### Critical Rules

```
📂 rules/
├── async-parallel.md          # Parallel data fetching
├── bundle-barrel-imports.md   # Avoid barrel files
├── server-auth-actions.md     # Secure server actions
├── rendering-hydration-*.md   # No hydration flicker
└── rerender-memo.md           # Proper memoization
```

---

## Project Structure

```
app/
├── (marketing)/
│   └── page.tsx
├── (dashboard)/
│   ├── layout.tsx
│   └── page.tsx
└── api/
    └── route.ts
```

---

> **Philosophy:** Performance is a feature. Waterfalls are the enemy. Server first.

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `react-architect` | Skill | React patterns |
| `tailwind-kit` | Skill | Styling |
| `perf-optimizer` | Skill | Performance |

---

⚡ PikaKit v3.9.68
