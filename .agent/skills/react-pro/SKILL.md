---
name: react-pro
summary: >-
  Modern React patterns, component architecture, state management, TypeScript best practices,
  and modern React development with Suspense, TanStack Query, MUI v7, and lazy loading.
  Triggers on: React, component, hooks, state management, Redux, Zustand, TypeScript, TanStack Query, MUI, frontend.
  Coordinates with: nextjs-pro, design-system, typescript-expert.
metadata:
  version: "2.0.0"
  category: "architecture"
  triggers: "React, component, hooks, state management, Redux, Zustand, TypeScript, TanStack Query, MUI, frontend"
  success_metrics: "components render, no prop drilling, state correctly scoped, lazy loading active"
  coordinates_with: "nextjs-pro, design-system, typescript-expert"
---

# React Architect — Component & State Architecture

> 4 component types. 4 state levels. Composition over inheritance. Profile before memoizing.

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Component design | Check component type classification |
| State management | Use complexity → solution routing |
| Hook reuse | Check extraction criteria |
| Performance issues | Use signal → action mapping |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Component classification (4 types) | Next.js patterns (→ nextjs-pro) |
| State management routing (4 levels) | TypeScript patterns (→ typescript-expert) |
| Hook extraction criteria | UI design (→ design-system) |
| Performance signal→action | Code implementation |

**Expert decision skill:** Produces architecture decisions. Does not write code.

---

## Component Types (4 — Deterministic)

| Type | Use For | State Model |
|------|---------|-------------|
| **Server** | Data fetching, static content | None |
| **Client** | Interactivity, browser APIs | useState, effects |
| **Presentational** | UI display | Props only |
| **Container** | Logic/orchestration | Heavy state |

**Design Rules:**
- One responsibility per component (≤ 150 lines)
- Props down, events up
- Composition over inheritance

---

## State Management Routing (Deterministic)

| Complexity | Solution |
|------------|----------|
| Simple (single component) | `useState`, `useReducer` |
| Shared local (subtree) | `Context` |
| Server state (API data) | React Query, SWR |
| Complex global (app-wide) | Zustand, Redux Toolkit |

## State Placement (4 Scopes)

| Scope | Where |
|-------|-------|
| Single component | `useState` |
| Parent-child | Lift state up |
| Subtree | Context |
| App-wide | Global store |

---

## Hook Patterns

### When to Extract Custom Hook

| Pattern | Extract When |
|---------|-------------|
| `useLocalStorage` | Same storage logic in 2+ components |
| `useDebounce` | Multiple debounced values |
| `useFetch` | Repeated fetch patterns |
| `useForm` | Complex form state reused |

### Hook Rules (Non-Negotiable)

- Hooks at top level only (no conditionals)
- Same order every render
- Custom hooks prefix with `use`
- Clean up effects on unmount

---

## Performance Signals (4 — Fixed)

| Signal | Action |
|--------|--------|
| Slow renders | Profile first (DevTools) |
| Large lists (> 100 items) | Virtualize |
| Expensive calculation | `useMemo` |
| Unstable callbacks causing re-renders | `useCallback` |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNKNOWN_COMPLEXITY` | Yes | State complexity not one of 4 |
| `ERR_UNKNOWN_SCOPE` | Yes | State scope not one of 4 |

**Zero internal retries.** Same context = same recommendation.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Use global state for local concerns | Start with useState, escalate as needed |
| Prop drill > 3 levels | Use Context or state library |
| Memoize everything | Profile first, memoize measured bottlenecks |
| Mix data fetching with UI | Separate server/container from presentational |
| Create God components (> 300 lines) | Split into focused components (≤ 150 lines) |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [patterns.md](references/patterns.md) | React 19, Composition, Performance, TypeScript, Testing | Advanced patterns |
| [engineering-spec.md](references/engineering-spec.md) | Full spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `nextjs-pro` | Skill | Next.js patterns |
| `typescript-expert` | Skill | TypeScript |
| `design-system` | Skill | UI design |

---

⚡ PikaKit v3.9.101
