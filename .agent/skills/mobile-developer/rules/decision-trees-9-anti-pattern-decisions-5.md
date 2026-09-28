---
"title": "Decision Trees: Anti-Pattern Decisions through Related"
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
  - "title": "Android Core App Quality"
    "url": "https://developer.android.com/quality-guidelines/core-app-quality"
  - "title": "Apple Human Interface Guidelines"
    "url": "https://developer.apple.com/design/human-interface-guidelines"
---

# Decision Trees: Anti-Pattern Decisions through Related

## Decision

> Framework selection, state management, storage strategy, and context-based decisions.
> **These are THINKING guides, not copy-paste answers.**

---

## 9. Anti-Pattern Decisions

### ❌ Decision Anti-Patterns

| Anti-Pattern | Why It's Bad | Better Approach |
|--------------|--------------|-----------------|
| **Redux for simple app** | Massive overkill | Zustand or context |
| **Native for MVP** | Slow development | Cross-platform MVP |
| **Drawer for 3 sections** | Hidden navigation | Tab bar |
| **AsyncStorage for tokens** | Insecure | SecureStore |
| **No offline consideration** | Broken on subway | Plan from start |
| **Same stack for all projects** | Doesn't fit context | Evaluate per project |

---

> Framework selection, state management, storage strategy, and context-based decisions.
> **These are THINKING guides, not copy-paste answers.**

---

## 10. Quick Reference

### Framework Quick Pick

```
OTA needed?           → React Native + Expo
Identical UI?         → Flutter
Maximum performance?  → Native
Web team?            → React Native
Quick prototype?     → Expo
```

### State Quick Pick

```
Simple app?          → Zustand / Provider
Server-heavy?        → TanStack Query / Riverpod
Enterprise?          → Redux / BLoC
Atomic state?        → Jotai
```

### Storage Quick Pick

```
Secrets?             → SecureStore / Keychain
Settings?            → AsyncStorage / UserDefaults
Structured data?     → SQLite
API cache?           → Query library
```

---

> **Remember:** These trees are guides for THINKING, not rules to follow blindly. Every project has unique constraints. ASK clarifying questions when requirements are vague, and choose based on actual needs, not defaults.

---

> Framework selection, state management, storage strategy, and context-based decisions.
> **These are THINKING guides, not copy-paste answers.**

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [mobile-navigation.md](mobile-navigation-1-navigation-selection-decision-tree.md) | Deep-dive on navigation patterns |
| [mobile-backend.md](mobile-backend-mobile-backend-mindset.md) | Backend patterns for mobile clients |
| [mobile-performance.md](mobile-performance-1-the-mobile-performance-mindset.md) | Performance optimization |
| [mobile-testing.md](mobile-testing-mobile-testing-mindset.md) | Testing strategy selection |
| [../frameworks/react-native.md](react-native-framework-decision.md) | RN patterns after selection |
| [../frameworks/flutter.md](flutter-widget-architecture.md) | Flutter patterns after selection |
| [../frameworks/native.md](native-when-to-go-native.md) | Native patterns after selection |

---

## Use When

Use when the documented constraints match observed repository and runtime evidence.

## Avoid When

Avoid when a simpler option satisfies the same constraints or evidence is unavailable.

## Trade-offs

Compare correctness, accessibility, operations, performance, migration cost, and reversibility.

## Verification

Test a representative scenario and the most important failure mode.
