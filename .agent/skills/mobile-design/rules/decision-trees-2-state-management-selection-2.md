---
"title": "Decision Trees: State Management Selection through 3. Navigation Pattern Selection"
"kind": "decision"
"impact": "high"
"tags":
  - "decision"
  - "trees"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Official documentation"
    "url": "https://www.w3.org/WAI/standards-guidelines/wcag/"
---

# Decision Trees: State Management Selection through 3. Navigation Pattern Selection

## Decision

> Framework selection, state management, storage strategy, and context-based decisions.
> **These are THINKING guides, not copy-paste answers.**

---

## 2. State Management Selection

### React Native State Decision

```
WHAT'S YOUR STATE COMPLEXITY?
        │
        ├── Simple app, few screens, minimal shared state
        │   │
        │   └── Zustand (or just useState/Context)
        │       ├── Minimal boilerplate
        │       ├── Easy to understand
        │       └── Scales OK to medium
        │
        ├── Primarily server data (API-driven)
        │   │
        │   └── TanStack Query (React Query) + Zustand
        │       ├── Query for server state
        │       ├── Zustand for UI state
        │       └── Excellent caching, refetching
        │
        ├── Complex app with many features
        │   │
        │   └── Redux Toolkit + RTK Query
        │       ├── Predicable, debuggable
        │       ├── RTK Query for API
        │       └── Good for large teams
        │
        └── Atomic, granular state needs
            │
            └── Jotai
                ├── Atom-based (like Recoil)
                ├── Minimizes re-renders
                └── Good for derived state
```

### Flutter State Decision

```
WHAT'S YOUR STATE COMPLEXITY?
        │
        ├── Simple app, learning Flutter
        │   │
        │   └── Provider (or setState)
        │       ├── Official, simple
        │       ├── Built into Flutter
        │       └── Good for small apps
        │
        ├── Modern, type-safe, testable
        │   │
        │   └── Riverpod 2.0
        │       ├── Compile-time safety
        │       ├── Code generation
        │       ├── Excellent for medium-large apps
        │       └── Recommended for new projects
        │
        ├── Enterprise, strict patterns needed
        │   │
        │   └── BLoC
        │       ├── Event → State pattern
        │       ├── Very testable
        │       ├── More boilerplate
        │       └── Good for large teams
        │
        └── Quick prototyping
            │
            └── GetX (with caution)
                ├── Fast to implement
                ├── Less strict patterns
                └── Can become messy at scale
```

### State Management Anti-Patterns

```
❌ DON'T:
├── Use global state for everything
├── Mix state management approaches
├── Store server state in local state
├── Skip state normalization
├── Overuse Context (re-render heavy)
└── Put navigation state in app state

✅ DO:
├── Server state → Query library
├── UI state → Minimal, local first
├── Lift state only when needed
├── Choose ONE approach per project
└── Keep state close to where it's used
```

---

> Framework selection, state management, storage strategy, and context-based decisions.
> **These are THINKING guides, not copy-paste answers.**

---

## 3. Navigation Pattern Selection

```
HOW MANY TOP-LEVEL DESTINATIONS?
        │
        ├── 2 destinations
        │   └── Consider: Top tabs or simple stack
        │
        ├── 3-5 destinations (equal importance)
        │   └── ✅ Tab Bar / Bottom Navigation
        │       ├── Most common pattern
        │       └── Easy discovery
        │
        ├── 5+ destinations
        │   │
        │   ├── All important → Drawer Navigation
        │   │                   └── Hidden but many options
        │   │
        │   └── Some less important → Tab bar + drawer hybrid
        │
        └── Single linear flow?
            └── Stack Navigation only
                └── Onboarding, checkout, etc.
```

### Navigation by App Type

| App Type | Pattern | Reason |
|----------|---------|--------|
| Social (Instagram) | Tab bar | Frequent switching |
| E-commerce | Tab bar + stack | Categories as tabs |
| Email (Gmail) | Drawer + list-detail | Many folders |
| Settings | Stack only | Deep drill-down |
| Onboarding | Stack wizard | Linear flow |
| Messaging | Tab (chats) + stack | Threads |

---

## Use When

Use when the documented constraints match observed repository and runtime evidence.

## Avoid When

Avoid when a simpler option satisfies the same constraints or evidence is unavailable.

## Trade-offs

Compare correctness, accessibility, operations, performance, migration cost, and reversibility.

## Verification

Test a representative scenario and the most important failure mode.
