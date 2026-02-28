---
name: react-architect
description: >-
  Modern React patterns and principles. Hooks, composition, performance, TypeScript best practices.
  Triggers on: React, component, hooks, state management, Redux, Zustand.
  Coordinates with: nextjs-pro, design-system.
metadata:
  version: "1.0.0"
  category: "architecture"
  triggers: "React, component, hooks, state management, Redux, Zustand"
  success_metrics: "components render, no prop drilling"
  coordinates_with: "nextjs-pro, design-system, typescript-expert"
---

# React Patterns

> Principles for building production-ready React applications.

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Component design | Check component types |
| State management | Use selection guide |
| Hooks patterns | See hook patterns |
| Performance | See `references/patterns.md` |

---

## 1. Component Design Principles

### Component Types

| Type               | Use                   | State             |
| ------------------ | --------------------- | ----------------- |
| **Server**         | Data fetching, static | None              |
| **Client**         | Interactivity         | useState, effects |
| **Presentational** | UI display            | Props only        |
| **Container**      | Logic/state           | Heavy state       |

### Design Rules

- One responsibility per component
- Props down, events up
- Composition over inheritance
- Prefer small, focused components

---

## 2. Hook Patterns

### When to Extract Hooks

| Pattern             | Extract When              |
| ------------------- | ------------------------- |
| **useLocalStorage** | Same storage logic needed |
| **useDebounce**     | Multiple debounced values |
| **useFetch**        | Repeated fetch patterns   |
| **useForm**         | Complex form state        |

### Hook Rules

- Hooks at top level only
- Same order every render
- Custom hooks start with "use"
- Clean up effects on unmount

---

## 3. State Management Selection

| Complexity     | Solution               |
| -------------- | ---------------------- |
| Simple         | useState, useReducer   |
| Shared local   | Context                |
| Server state   | React Query, SWR       |
| Complex global | Zustand, Redux Toolkit |

### State Placement

| Scope            | Where         |
| ---------------- | ------------- |
| Single component | useState      |
| Parent-child     | Lift state up |
| Subtree          | Context       |
| App-wide         | Global store  |

---

## 4. Performance Quick Tips

| Signal           | Action        |
| ---------------- | ------------- |
| Slow renders     | Profile first |
| Large lists      | Virtualize    |
| Expensive calc   | useMemo       |
| Stable callbacks | useCallback   |

> For priority categories and deep dive, see `references/patterns.md`

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| `references/patterns.md` | React 19, Composition, Performance, TypeScript, Testing, Anti-Patterns | Advanced patterns |

---

> **Remember:** React is about composition. Build small, combine thoughtfully.

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `nextjs-pro` | Skill | Next.js patterns |
| `typescript-expert` | Skill | TypeScript |
| `design-system` | Skill | UI design |

---

⚡ PikaKit v3.9.66
