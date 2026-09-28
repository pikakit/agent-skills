---
"title": "Mobile Design Thinking: ?? ANTI-MEMORIZATION TEST through ?? CONTEXT-BASED DECISION PROTOCOL"
"kind": "reference"
"impact": "high"
"tags":
  - "mobile-developer"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Material Design 3 Mobile"
    "url": "https://developer.android.com/design/ui/mobile"
  - "title": "Apple Human Interface Guidelines"
    "url": "https://developer.apple.com/design/human-interface-guidelines"
---

# Mobile Design Thinking: ?? ANTI-MEMORIZATION TEST through ?? CONTEXT-BASED DECISION PROTOCOL

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **This file prevents AI from using memorized patterns and forces genuine thinking.**
> Mechanisms to prevent standard AI training defaults in mobile development.
> **The mobile equivalent of frontend's layout decomposition approach.**

---

## ?? ANTI-MEMORIZATION TEST

### Ask Yourself Before Every Solution

```
+-----------------------------------------------------------------+
|                    ANTI-MEMORIZATION CHECKLIST                  |
+-----------------------------------------------------------------|
|                                                                 |
|  ? Did I pick this solution "because I always do it this way"?  |
|    ? If YES: STOP. Consider alternatives.                       |
|                                                                 |
|  ? Is this a pattern I've seen frequently in training data?     |
|    ? If YES: Is it REALLY suitable for THIS project?            |
|                                                                 |
|  ? Did I write this solution automatically without thinking?    |
|    ? If YES: Step back, do decomposition.                       |
|                                                                 |
|  ? Did I consider an alternative approach?                      |
|    ? If NO: Think of at least 2 alternatives, then decide.      |
|                                                                 |
|  ? Did I think platform-specifically?                           |
|    ? If NO: Analyze iOS and Android separately.                 |
|                                                                 |
|  ? Did I consider performance impact of this solution?          |
|    ? If NO: What is the memory, CPU, battery impact?            |
|                                                                 |
|  ? Is this solution suitable for THIS project's CONTEXT?        |
|    ? If NO: Customize based on context.                         |
|                                                                 |
+-----------------------------------------------------------------+
```

---

> **This file prevents AI from using memorized patterns and forces genuine thinking.**
> Mechanisms to prevent standard AI training defaults in mobile development.
> **The mobile equivalent of frontend's layout decomposition approach.**

---

## ?? CONTEXT-BASED DECISION PROTOCOL

### Think Differently Based on Project Type

```
DETERMINE PROJECT TYPE:
        |
        +-- E-Commerce App
        |   +-- Navigation: Tab (Home, Search, Cart, Account)
        |   +-- Lists: Product grids (memoized, image optimized)
        |   +-- Performance: Image caching CRITICAL
        |   +-- Offline: Cart persistence, product cache
        |   +-- Special: Checkout flow, payment security
        |
        +-- Social/Content App
        |   +-- Navigation: Tab (Feed, Search, Create, Notify, Profile)
        |   +-- Lists: Infinite scroll, complex items
        |   +-- Performance: Feed rendering CRITICAL
        |   +-- Offline: Feed cache, draft posts
        |   +-- Special: Real-time updates, media handling
        |
        +-- Productivity/SaaS App
        |   +-- Navigation: Drawer or adaptive (mobile tab, tablet rail)
        |   +-- Lists: Data tables, forms
        |   +-- Performance: Data sync
        |   +-- Offline: Full offline editing
        |   +-- Special: Conflict resolution, background sync
        |
        +-- Utility App
        |   +-- Navigation: Minimal (stack-only possible)
        |   +-- Lists: Probably minimal
        |   +-- Performance: Fast startup
        |   +-- Offline: Core feature offline
        |   +-- Special: Widget, shortcuts
        |
        +-- Media/Streaming App
            +-- Navigation: Tab (Home, Search, Library, Profile)
            +-- Lists: Horizontal carousels, vertical feeds
            +-- Performance: Preloading, buffering
            +-- Offline: Download management
            +-- Special: Background playback, casting
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
