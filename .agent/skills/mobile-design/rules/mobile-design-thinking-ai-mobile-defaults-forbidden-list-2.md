---
"title": "Mobile Design Thinking: AI MOBILE DEFAULTS (FORBIDDEN LIST) through COMPONENT DECOMPOSITION (MANDATORY)"
"kind": "reference"
"impact": "high"
"tags":
  - "mobile"
  - "design"
  - "thinking"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Official documentation"
    "url": "https://www.w3.org/WAI/standards-guidelines/wcag/"
---

# Mobile Design Thinking: AI MOBILE DEFAULTS (FORBIDDEN LIST) through COMPONENT DECOMPOSITION (MANDATORY)

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **This file prevents AI from using memorized patterns and forces genuine thinking.**
> Mechanisms to prevent standard AI training defaults in mobile development.
> **The mobile equivalent of frontend's layout decomposition approach.**

---

## 🚫 AI MOBILE DEFAULTS (FORBIDDEN LIST)

### Using These Patterns Automatically is FORBIDDEN!

The following patterns are "defaults" that AIs learned from training data.
Before using any of these, **QUESTION them and CONSIDER ALTERNATIVES!**

```
┌─────────────────────────────────────────────────────────────────┐
│                 🚫 AI MOBILE SAFE HARBOR                        │
│           (Default Patterns - Never Use Without Questioning)    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  NAVIGATION DEFAULTS:                                           │
│  ├── Tab bar for every project (Would drawer be better?)        │
│  ├── Fixed 5 tabs (Are 3 enough? For 6+, drawer?)               │
│  ├── "Home" tab on left (What does user behavior say?)          │
│  └── Hamburger menu (Is it outdated now?)                       │
│                                                                 │
│  STATE MANAGEMENT DEFAULTS:                                     │
│  ├── Redux everywhere (Is Zustand/Jotai sufficient?)            │
│  ├── Global state for everything (Isn't local state enough?)   │
│  ├── Context Provider hell (Is atom-based better?)              │
│  └── BLoC for every Flutter project (Is Riverpod more modern?)  │
│                                                                 │
│  LIST IMPLEMENTATION DEFAULTS:                                  │
│  ├── FlatList as default (Is FlashList more performant?)        │
│  ├── windowSize=21 (Is it really needed?)                       │
│  ├── removeClippedSubviews (Always?)                            │
│  └── ListView.builder (Is ListView.separated better?)           │
│                                                                 │
│  UI PATTERN DEFAULTS:                                           │
│  ├── FAB bottom-right (Is bottom-left more accessible?)         │
│  ├── Pull-to-refresh on every list (Is it needed everywhere?)   │
│  ├── Swipe-to-delete from left (Is right better?)               │
│  └── Bottom sheet for every modal (Is full screen better?)      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

> **This file prevents AI from using memorized patterns and forces genuine thinking.**
> Mechanisms to prevent standard AI training defaults in mobile development.
> **The mobile equivalent of frontend's layout decomposition approach.**

---

## 🔍 COMPONENT DECOMPOSITION (MANDATORY)

### Decomposition Analysis for Every Screen

Before designing any screen, perform this analysis:

```
SCREEN: [Screen Name]
├── PRIMARY ACTION: [What is the main action?]
│   └── Is it in thumb zone? [Yes/No → Why?]
│
├── TOUCH TARGETS: [All tappable elements]
│   ├── [Element 1]: [Size]pt → Sufficient?
│   ├── [Element 2]: [Size]pt → Sufficient?
│   └── Spacing: [Gap]pt → Accidental tap risk?
│
├── SCROLLABLE CONTENT:
│   ├── Is it a list? → FlatList/FlashList [Why this choice?]
│   ├── Item count: ~[N] → Performance consideration?
│   └── Fixed height? → Is getItemLayout needed?
│
├── STATE REQUIREMENTS:
│   ├── Is local state sufficient?
│   ├── Do I need to lift state?
│   └── Is global required? [Why?]
│
├── PLATFORM DIFFERENCES:
│   ├── iOS: [Anything different needed?]
│   └── Android: [Anything different needed?]
│
├── OFFLINE CONSIDERATION:
│   ├── Should this screen work offline?
│   └── Cache strategy: [Yes/No/Which one?]
│
└── PERFORMANCE IMPACT:
    ├── Any heavy components?
    ├── Is memoization needed?
    └── Animation performance?
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
