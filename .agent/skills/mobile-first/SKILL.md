---
name: mobile-first
description: >-
  Mobile development orchestrator for iOS and Android. Routes to framework-specific patterns
  (React Native, Flutter, Native) and publishing strategies (ASO, deep linking, push).
  Triggers on: mobile, responsive, touch, React Native, Flutter, iOS, Android.
  Coordinates with: mobile-developer, design-system, perf-optimizer.
metadata:
  category: "framework"
  success_metrics: "mobile audit passed, responsive design"
  coordinates_with: "mobile-developer, design-system, perf-optimizer"
---

# Mobile Development Orchestrator

> **Philosophy:** Touch-first. Battery-conscious. Platform-respectful. Offline-capable.
> **Core Principle:** Mobile is NOT a small desktop. THINK mobile constraints, ASK platform choice.

---

## Sub-Skill Routing

### Framework Selection

| If building with... | Use Sub-Skill |
|---------------------|---------------|
| React Native / Expo | [frameworks/react-native.md](frameworks/react-native.md) |
| Flutter / Dart | [frameworks/flutter.md](frameworks/flutter.md) |
| SwiftUI / Kotlin Compose | [frameworks/native.md](frameworks/native.md) |

### Publishing & Distribution

| If you need... | Use Sub-Skill |
|----------------|---------------|
| App Store visibility | [publishing/app-store-optimization.md](publishing/app-store-optimization.md) |
| Universal/App Links | [publishing/deep-linking.md](publishing/deep-linking.md) |
| FCM/APNs setup | [publishing/push-notifications.md](publishing/push-notifications.md) |

### Design References

| Priority | File | Content |
|----------|------|---------|
| 🔴 **CRITICAL** | [references/mobile-design-thinking.md](references/mobile-design-thinking.md) | Anti-memorization, forces thinking |
| 🔴 **CRITICAL** | [references/touch-psychology.md](references/touch-psychology.md) | Fitts' Law, gestures, thumb zone |
| 🔴 **CRITICAL** | [references/mobile-performance.md](references/mobile-performance.md) | RN/Flutter 60fps, memory |
| 🟡 Platform | [references/platform-ios.md](references/platform-ios.md) | iOS HIG, SF Pro, SwiftUI |
| 🟡 Platform | [references/platform-android.md](references/platform-android.md) | Material Design 3, Roboto |

---

## 🔧 Runtime Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `scripts/mobile_audit.py` | Mobile UX & Touch Audit | `python scripts/mobile_audit.py <project_path>` |

---

## ⚠️ MANDATORY: Ask Before Assuming

| Aspect | Ask | Why |
|--------|-----|-----|
| **Platform** | "iOS, Android, or both?" | Affects EVERY decision |
| **Framework** | "React Native, Flutter, or native?" | Determines patterns |
| **Navigation** | "Tab bar, drawer, or stack-based?" | Core UX decision |
| **Offline** | "Does this need to work offline?" | Affects data strategy |

---

## Framework Decision Tree

```
WHAT ARE YOU BUILDING?
├── OTA updates + rapid iteration → React Native + Expo
│   └── Read: frameworks/react-native.md
├── Pixel-perfect custom UI → Flutter
│   └── Read: frameworks/flutter.md
├── Deep native features (iOS) → SwiftUI
│   └── Read: frameworks/native.md
├── Deep native features (Android) → Kotlin + Compose
│   └── Read: frameworks/native.md
└── Existing codebase → Match current framework
```

---

## Quick Reference: Platform Defaults

| Element | iOS | Android |
|---------|-----|---------|
| **Primary Font** | SF Pro | Roboto |
| **Min Touch Target** | 44pt × 44pt | 48dp × 48dp |
| **Back Navigation** | Edge swipe left | System back button |
| **Bottom Tab Icons** | SF Symbols | Material Symbols |

---

## Pre-Development Checkpoint

```
🧠 CHECKPOINT (fill before coding):

Platform:   [ iOS / Android / Both ]
Framework:  [ React Native / Flutter / SwiftUI / Kotlin ]
Sub-skills Read: [ List files you've read ]

3 Principles I Will Apply:
1. _______________
2. _______________
3. _______________
```

---

> **Remember:** Mobile users are impatient, interrupted, using imprecise fingers on small screens. Design for the WORST conditions.

