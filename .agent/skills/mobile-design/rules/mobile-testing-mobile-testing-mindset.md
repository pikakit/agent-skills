---
"title": "Mobile Testing: MOBILE TESTING MINDSET through 2. Testing Pyramid for Mobile"
"kind": "process"
"impact": "high"
"tags":
  - "mobile"
  - "testing"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Official documentation"
    "url": "https://www.w3.org/WAI/standards-guidelines/wcag/"
---

# Mobile Testing: MOBILE TESTING MINDSET through 2. Testing Pyramid for Mobile

## Preconditions

Capture the baseline, target environment, acceptance criteria, and rollback point.

## Procedure

> **Mobile testing is NOT web testing. Different constraints, different strategies.**
> This file teaches WHEN to use each testing approach and WHY.
> **Code examples are minimal - focus on decision-making.**

---

## 🧠 MOBILE TESTING MINDSET

```
Mobile testing differs from web:
├── Real devices matter (emulators hide bugs)
├── Platform differences (iOS vs Android behavior)
├── Network conditions vary wildly
├── Battery/performance under test
├── App lifecycle (background, killed, restored)
├── Permissions and system dialogs
└── Touch interactions vs clicks
```

---

> **Mobile testing is NOT web testing. Different constraints, different strategies.**
> This file teaches WHEN to use each testing approach and WHY.
> **Code examples are minimal - focus on decision-making.**

---

## 🚫 AI MOBILE TESTING ANTI-PATTERNS

| ❌ AI Default | Why It's Wrong | ✅ Mobile-Correct |
|---------------|----------------|-------------------|
| Jest-only testing | Misses native layer | Jest + E2E on device |
| Enzyme patterns | Deprecated, web-focused | React Native Testing Library |
| Browser-based E2E (Cypress) | Can't test native features | Detox / Maestro |
| Mock everything | Misses integration bugs | Real device testing |
| Ignore platform tests | iOS/Android differ | Platform-specific cases |
| Skip performance tests | Mobile perf is critical | Profile on low-end device |
| Test only happy path | Mobile has more edge cases | Offline, permissions, interrupts |
| 100% unit test coverage | False security | Pyramid balance |
| Copy web testing patterns | Different environment | Mobile-specific tools |

---

> **Mobile testing is NOT web testing. Different constraints, different strategies.**
> This file teaches WHEN to use each testing approach and WHY.
> **Code examples are minimal - focus on decision-making.**

---

## 1. Testing Tool Selection

### Decision Tree

```
WHAT ARE YOU TESTING?
        │
        ├── Pure functions, utilities, helpers
        │   └── Jest (unit tests)
        │       └── No special mobile setup needed
        │
        ├── Individual components (isolated)
        │   ├── React Native → React Native Testing Library
        │   └── Flutter → flutter_test (widget tests)
        │
        ├── Components with hooks, context, navigation
        │   ├── React Native → RNTL + mocked providers
        │   └── Flutter → integration_test package
        │
        ├── Full user flows (login, checkout, etc.)
        │   ├── Detox (React Native, fast, reliable)
        │   ├── Maestro (Cross-platform, YAML-based)
        │   └── Appium (Legacy, slow, last resort)
        │
        └── Performance, memory, battery
            ├── Flashlight (RN performance)
            ├── Flutter DevTools
            └── Real device profiling (Xcode/Android Studio)
```

### Tool Comparison

| Tool | Platform | Speed | Reliability | Use When |
|------|----------|-------|-------------|----------|
| **Jest** | RN | ⚡⚡⚡ | ⚡⚡⚡ | Unit tests, logic |
| **RNTL** | RN | ⚡⚡⚡ | ⚡⚡ | Component tests |
| **flutter_test** | Flutter | ⚡⚡⚡ | ⚡⚡⚡ | Widget tests |
| **Detox** | RN | ⚡⚡ | ⚡⚡⚡ | E2E, critical flows |
| **Maestro** | Both | ⚡⚡ | ⚡⚡ | E2E, cross-platform |
| **Appium** | Both | ⚡ | ⚡ | Legacy, last resort |

---

> **Mobile testing is NOT web testing. Different constraints, different strategies.**
> This file teaches WHEN to use each testing approach and WHY.
> **Code examples are minimal - focus on decision-making.**

---

## 2. Testing Pyramid for Mobile

```
                    ┌───────────────┐
                    │    E2E Tests  │  10%
                    │  (Real device) │  Slow, expensive, essential
                    ├───────────────┤
                    │  Integration  │  20%
                    │    Tests      │  Component + context
                    ├───────────────┤
                    │  Component    │  30%
                    │    Tests      │  Isolated UI
                    ├───────────────┤
                    │   Unit Tests  │  40%
                    │    (Jest)     │  Pure logic
                    └───────────────┘
```

### Why This Distribution?

| Level | Why This % |
|-------|------------|
| **E2E 10%** | Slow, flaky, but catches integration bugs |
| **Integration 20%** | Tests real user flows without full app |
| **Component 30%** | Fast feedback on UI changes |
| **Unit 40%** | Fastest, most stable, logic coverage |

> 🔴 **If you have 90% unit tests and 0% E2E, you're testing the wrong things.**

---

## Rollback

Restore the baseline if required tooling errors or the procedure introduces a regression.

## Exit Gate

Require fresh evidence for the intended behavior and all applicable project checks.
