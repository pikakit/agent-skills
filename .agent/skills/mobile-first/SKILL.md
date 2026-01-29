---
name: mobile-first
description: >-
  Mobile-first design thinking and decision-making for iOS and Android apps. Touch interaction,
  performance patterns, platform conventions.
  Triggers on: mobile, responsive, touch, React Native, Flutter.
  Coordinates with: design-system, perf-optimizer.
metadata:
  category: "framework"
  success_metrics: "mobile audit passed, responsive design"
  coordinates_with: "design-system, perf-optimizer"
---

# Mobile Design System

> **Philosophy:** Touch-first. Battery-conscious. Platform-respectful. Offline-capable.
> **Core Principle:** Mobile is NOT a small desktop. THINK mobile constraints, ASK platform choice.

## 🔧 Runtime Scripts

| Script                    | Purpose                 | Usage                                           |
| ------------------------- | ----------------------- | ----------------------------------------------- |
| `scripts/mobile_audit.py` | Mobile UX & Touch Audit | `python scripts/mobile_audit.py <project_path>` |

## 📚 Reference Files (Read Before Working!)

| Priority        | File                                                              | Content                            |
| --------------- | ----------------------------------------------------------------- | ---------------------------------- |
| 🔴 **CRITICAL** | [mobile-design-thinking.md](references/mobile-design-thinking.md) | Anti-memorization, forces thinking |
| 🔴 **CRITICAL** | [touch-psychology.md](references/touch-psychology.md)             | Fitts' Law, gestures, thumb zone   |
| 🔴 **CRITICAL** | [mobile-performance.md](references/mobile-performance.md)         | RN/Flutter 60fps, memory           |
| 🟡 Platform     | [platform-ios.md](references/platform-ios.md)                     | iOS HIG, SF Pro, SwiftUI           |
| 🟡 Platform     | [platform-android.md](references/platform-android.md)             | Material Design 3, Roboto          |
| ⚪ Optional     | [mobile-navigation.md](references/mobile-navigation.md)           | Tab/Stack/Drawer, deep linking     |
| ⚪ Optional     | [mobile-typography.md](references/mobile-typography.md)           | System fonts, Dynamic Type         |
| ⚪ Optional     | [mobile-color-system.md](references/mobile-color-system.md)       | OLED, dark mode, battery           |
| ⚪ Optional     | [decision-trees.md](references/decision-trees.md)                 | Framework/state selection          |
| ⚪ Optional     | [anti-patterns.md](references/anti-patterns.md)                   | Common AI mistakes to avoid        |

## ⚠️ MANDATORY: Ask Before Assuming

| Aspect         | Ask                                 | Why                    |
| -------------- | ----------------------------------- | ---------------------- |
| **Platform**   | "iOS, Android, or both?"            | Affects EVERY decision |
| **Framework**  | "React Native, Flutter, or native?" | Determines patterns    |
| **Navigation** | "Tab bar, drawer, or stack-based?"  | Core UX decision       |
| **Offline**    | "Does this need to work offline?"   | Affects data strategy  |

## Quick Reference: Platform Defaults

| Element              | iOS             | Android            |
| -------------------- | --------------- | ------------------ |
| **Primary Font**     | SF Pro          | Roboto             |
| **Min Touch Target** | 44pt × 44pt     | 48dp × 48dp        |
| **Back Navigation**  | Edge swipe left | System back button |
| **Bottom Tab Icons** | SF Symbols      | Material Symbols   |

## Framework Decision Tree

```
WHAT ARE YOU BUILDING?
├── OTA updates + rapid iteration → React Native + Expo
├── Pixel-perfect custom UI → Flutter
├── Deep native features (iOS) → SwiftUI
├── Deep native features (Android) → Kotlin + Compose
└── Existing codebase → Match current framework
```

## Pre-Development Checkpoint

```
🧠 CHECKPOINT (fill before coding):

Platform:   [ iOS / Android / Both ]
Framework:  [ React Native / Flutter / SwiftUI / Kotlin ]
Files Read: [ List files you've read ]

3 Principles I Will Apply:
1. _______________
2. _______________
3. _______________
```

> **Remember:** Mobile users are impatient, interrupted, using imprecise fingers on small screens. Design for the WORST conditions.
