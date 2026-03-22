---
name: react-pro
description: >-
  Modern React patterns, component architecture, state management, TypeScript best practices,
  and modern React development with Suspense, TanStack Query, MUI v7, and lazy loading.
  Triggers on: React, component, hooks, state management, Redux, Zustand, TypeScript, TanStack
  Query, MUI, frontend.
metadata:
  author: pikakit
  version: "2.0.0"
---

# React Architect â€” Component & State Architecture

> 4 component types. 4 state levels. Composition over inheritance. Profile before memoizing.

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Component design | Check component type classification |
| State management | Use complexity â†’ solution routing |
| Hook reuse | Check extraction criteria |
| Performance issues | Use signal â†’ action mapping |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Component classification (4 types) | Next.js patterns (â†’ nextjs-pro) |
| State management routing (4 levels) | TypeScript patterns (â†’ typescript-expert) |
| Hook extraction criteria | UI design (â†’ design-system) |
| Performance signalâ†’action | Code implementation |

**Expert decision skill:** Produces architecture decisions. Does not write code.

---

## Component Types (4 â€” Deterministic)

| Type | Use For | State Model |
|------|---------|-------------|
| **Server** | Data fetching, static content | None |
| **Client** | Interactivity, browser APIs | useState, effects |
| **Presentational** | UI display | Props only |
| **Container** | Logic/orchestration | Heavy state |

**Design Rules:**
- One responsibility per component (â‰¤ 150 lines)
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

## Performance Signals (4 â€” Fixed)

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

| âŒ Don't | âœ… Do |
|---------|-------|
| Use global state for local concerns | Start with useState, escalate as needed |
| Prop drill > 3 levels | Use Context or state library |
| Memoize everything | Profile first, memoize measured bottlenecks |
| Mix data fetching with UI | Separate server/container from presentational |
| Create God components (> 300 lines) | Split into focused components (â‰¤ 150 lines) |

---

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | General | LOW | `general-` |
| 2 | Component Patterns | LOW | `component-` |
| 3 | Data Management | LOW | `data-` |
| 4 | Engineering Spec | LOW | `engineering-` |
| 5 | File Organization | LOW | `file-` |
| 6 | MUI Styling | LOW | `mui-` |

## Quick Reference

### 1. General (LOW)

- `patterns` - React Advanced Patterns
- `performance` - Performance Optimization

### 2. Component Patterns (LOW)

- `component-patterns` - Component Patterns

### 3. Data Management (LOW)

- `data-fetching` - Data Fetching with TanStack Query

### 4. Engineering Spec (LOW)

- `engineering-spec` - Frontend Development — Engineering Specification

### 5. File Organization (LOW)

- `file-organization` - File Organization

### 6. MUI Styling (LOW)

- `mui-styling` - MUI v7 Styling

## How to Use

Read individual rule files for detailed explanations and code examples:

```
rules/component-patterns.md
rules/data-fetching.md
```

Each rule file contains:
- Brief explanation of why it matters
- Incorrect code example with explanation
- Correct code example with explanation
- Additional context and references

## Full Compiled Document

For the complete guide with all rules expanded: `AGENTS.md`


## ðŸ“‘ Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [patterns.md](rules/patterns.md) | React 19, Composition, Performance, TypeScript, Testing | Advanced patterns |
| [engineering-spec.md](rules/engineering-spec.md) | Full spec | Architecture review |

---

## ðŸ”— Related

| Item | Type | Purpose |
|------|------|---------|
| `nextjs-pro` | Skill | Next.js patterns |
| `typescript-expert` | Skill | TypeScript |
| `design-system` | Skill | UI design |

---

âš¡ PikaKit v3.9.105
