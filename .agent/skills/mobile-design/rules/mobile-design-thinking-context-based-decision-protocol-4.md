---
"title": "Mobile Design Thinking: CONTEXT-BASED DECISION PROTOCOL through SPIRIT OVER CHECKLIST (Mobile Edition)"
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

# Mobile Design Thinking: CONTEXT-BASED DECISION PROTOCOL through SPIRIT OVER CHECKLIST (Mobile Edition)

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **This file prevents AI from using memorized patterns and forces genuine thinking.**
> Mechanisms to prevent standard AI training defaults in mobile development.
> **The mobile equivalent of frontend's layout decomposition approach.**

---

## 📊 CONTEXT-BASED DECISION PROTOCOL

### Think Differently Based on Project Type

```
DETERMINE PROJECT TYPE:
        │
        ├── E-Commerce App
        │   ├── Navigation: Tab (Home, Search, Cart, Account)
        │   ├── Lists: Product grids (memoized, image optimized)
        │   ├── Performance: Image caching CRITICAL
        │   ├── Offline: Cart persistence, product cache
        │   └── Special: Checkout flow, payment security
        │
        ├── Social/Content App
        │   ├── Navigation: Tab (Feed, Search, Create, Notify, Profile)
        │   ├── Lists: Infinite scroll, complex items
        │   ├── Performance: Feed rendering CRITICAL
        │   ├── Offline: Feed cache, draft posts
        │   └── Special: Real-time updates, media handling
        │
        ├── Productivity/SaaS App
        │   ├── Navigation: Drawer or adaptive (mobile tab, tablet rail)
        │   ├── Lists: Data tables, forms
        │   ├── Performance: Data sync
        │   ├── Offline: Full offline editing
        │   └── Special: Conflict resolution, background sync
        │
        ├── Utility App
        │   ├── Navigation: Minimal (stack-only possible)
        │   ├── Lists: Probably minimal
        │   ├── Performance: Fast startup
        │   ├── Offline: Core feature offline
        │   └── Special: Widget, shortcuts
        │
        └── Media/Streaming App
            ├── Navigation: Tab (Home, Search, Library, Profile)
            ├── Lists: Horizontal carousels, vertical feeds
            ├── Performance: Preloading, buffering
            ├── Offline: Download management
            └── Special: Background playback, casting
```

---

> **This file prevents AI from using memorized patterns and forces genuine thinking.**
> Mechanisms to prevent standard AI training defaults in mobile development.
> **The mobile equivalent of frontend's layout decomposition approach.**

---

## 🔄 INTERACTION BREAKDOWN

### Analysis for Every Gesture

Before adding any gesture:

```
GESTURE: [Gesture Type]
├── DISCOVERABILITY:
│   └── How will users discover this gesture?
│       ├── Is there a visual hint?
│       ├── Will it be shown in onboarding?
│       └── Is there a button alternative? (MANDATORY)
│
├── PLATFORM CONVENTION:
│   ├── What does this gesture mean on iOS?
│   ├── What does this gesture mean on Android?
│   └── Am I deviating from platform convention?
│
├── ACCESSIBILITY:
│   ├── Can motor-impaired users perform this gesture?
│   ├── Is there a VoiceOver/TalkBack alternative?
│   └── Does it work with switch control?
│
├── CONFLICT CHECK:
│   ├── Does it conflict with system gestures?
│   │   ├── iOS: Edge swipe back
│   │   ├── Android: Back gesture
│   │   └── Home indicator swipe
│   └── Is it consistent with other app gestures?
│
└── FEEDBACK:
    ├── Is haptic feedback defined?
    ├── Is visual feedback sufficient?
    └── Is audio feedback needed?
```

---

> **This file prevents AI from using memorized patterns and forces genuine thinking.**
> Mechanisms to prevent standard AI training defaults in mobile development.
> **The mobile equivalent of frontend's layout decomposition approach.**

---

## 🎭 SPIRIT OVER CHECKLIST (Mobile Edition)

### Passing the Checklist is Not Enough!

| ❌ Self-Deception | ✅ Honest Assessment |
|-------------------|----------------------|
| "Touch target is 44px" (but on edge, unreachable) | "Can user reach it one-handed?" |
| "I used FlatList" (but didn't memoize) | "Is scroll smooth?" |
| "Platform-specific nav" (but only icons differ) | "Does iOS feel like iOS, Android like Android?" |
| "Offline support exists" (but error message is generic) | "What can user actually do offline?" |
| "Loading state exists" (but just a spinner) | "Does user know how long to wait?" |

> 🔴 **Passing the checklist is NOT the goal. Creating great mobile UX IS the goal.**

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
