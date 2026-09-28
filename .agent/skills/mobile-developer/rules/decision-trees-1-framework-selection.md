---
"title": "Decision Trees: Framework Selection"
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
  - "title": "Guide to app architecture"
    "url": "https://developer.android.com/topic/architecture"
  - "title": "Apple Developer Documentation"
    "url": "https://developer.apple.com/documentation"
---

# Decision Trees: Framework Selection

## Decision

> Framework selection, state management, storage strategy, and context-based decisions.
> **These are THINKING guides, not copy-paste answers.**

---

## 1. Framework Selection

### Master Decision Tree

```
WHAT ARE YOU BUILDING?
        │
        ├── Need OTA updates without app store review?
        │   │
        │   ├── Yes → React Native + Expo
        │   │         ├── Expo Go for development
        │   │         ├── EAS Update for production OTA
        │   │         └── Best for: rapid iteration, web teams
        │   │
        │   └── No → Continue ▼
        │
        ├── Need pixel-perfect custom UI across platforms?
        │   │
        │   ├── Yes → Flutter
        │   │         ├── Custom rendering engine
        │   │         ├── Single UI for iOS + Android
        │   │         └── Best for: branded, visual apps
        │   │
        │   └── No → Continue ▼
        │
        ├── Heavy native features (ARKit, HealthKit, specific sensors)?
        │   │
        │   ├── iOS only → SwiftUI / UIKit
        │   │              └── Maximum native capability
        │   │
        │   ├── Android only → Kotlin + Jetpack Compose
        │   │                  └── Maximum native capability
        │   │
        │   └── Both → Consider native with shared logic
        │              └── Kotlin Multiplatform for shared
        │
        ├── Existing web team + TypeScript codebase?
        │   │
        │   └── Yes → React Native
        │             ├── Familiar paradigm for React devs
        │             ├── Share code with web (limited)
        │             └── Large ecosystem
        │
        └── Enterprise with existing Flutter team?
            │
            └── Yes → Flutter
                      └── Leverage existing expertise
```

### Framework Comparison

| Factor | React Native | Flutter | Native (Swift/Kotlin) |
|--------|-------------|---------|----------------------|
| **OTA Updates** | ✅ Expo | ❌ No | ❌ No |
| **Learning Curve** | Low (React devs) | Medium | Higher |
| **Performance** | Good | Excellent | Best |
| **UI Consistency** | Platform-native | Identical | Platform-native |
| **Bundle Size** | Medium | Larger | Smallest |
| **Native Access** | Via bridges | Via channels | Direct |
| **Hot Reload** | ✅ | ✅ | ✅ (Xcode 15+) |

### When to Choose Native

```
CHOOSE NATIVE WHEN:
├── Maximum performance required (games, 3D)
├── Deep OS integration needed
├── Platform-specific features are core
├── Team has native expertise
├── App store presence is primary
└── Long-term maintenance priority

AVOID NATIVE WHEN:
├── Limited budget/time
├── Need rapid iteration
├── Identical UI on both platforms
├── Team is web-focused
└── Cross-platform is priority
```

---

## Use When

Use when the documented constraints match observed repository and runtime evidence.

## Avoid When

Avoid when a simpler option satisfies the same constraints or evidence is unavailable.

## Trade-offs

Compare correctness, accessibility, operations, performance, migration cost, and reversibility.

## Verification

Test a representative scenario and the most important failure mode.
