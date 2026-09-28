---
"title": "Mobile Testing: What to Test at Each Level through 6. Performance Testing"
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
  - "title": "Test apps on Android"
    "url": "https://developer.android.com/training/testing"
  - "title": "XCTest Documentation"
    "url": "https://developer.apple.com/documentation/xctest"
---

# Mobile Testing: What to Test at Each Level through 6. Performance Testing

## Preconditions

Capture the baseline, target environment, acceptance criteria, and rollback point.

## Procedure

> **Mobile testing is NOT web testing. Different constraints, different strategies.**
> This file teaches WHEN to use each testing approach and WHY.
> **Code examples are minimal - focus on decision-making.**

---

## 3. What to Test at Each Level

### Unit Tests (Jest)

```
✅ TEST:
├── Utility functions (formatDate, calculatePrice)
├── State reducers (Redux, Zustand stores)
├── API response transformers
├── Validation logic
└── Business rules

❌ DON'T TEST:
├── Component rendering (use component tests)
├── Navigation (use integration tests)
├── Native modules (mock them)
└── Third-party libraries
```

### Component Tests (RNTL / flutter_test)

```
✅ TEST:
├── Component renders correctly
├── User interactions (tap, type, swipe)
├── Loading/error/empty states
├── Accessibility labels exist
└── Props change behavior

❌ DON'T TEST:
├── Internal implementation details
├── Snapshot everything (only key components)
├── Styling specifics (brittle)
└── Third-party component internals
```

### Integration Tests

```
✅ TEST:
├── Form submission flows
├── Navigation between screens
├── State persistence across screens
├── API integration (with mocked server)
└── Context/provider interactions

❌ DON'T TEST:
├── Every possible path (use unit tests)
├── Third-party services (mock them)
└── Backend logic (backend tests)
```

### E2E Tests

```
✅ TEST:
├── Critical user journeys (login, purchase, signup)
├── Offline → online transitions
├── Deep link handling
├── Push notification navigation
├── Permission flows
└── Payment flows

❌ DON'T TEST:
├── Every edge case (too slow)
├── Visual regression (use snapshot tests)
├── Non-critical features
└── Backend-only logic
```

---

> **Mobile testing is NOT web testing. Different constraints, different strategies.**
> This file teaches WHEN to use each testing approach and WHY.
> **Code examples are minimal - focus on decision-making.**

---

## 4. Platform-Specific Testing

### What Differs Between iOS and Android?

| Area | iOS Behavior | Android Behavior | Test Both? |
|------|--------------|------------------|------------|
| **Back navigation** | Edge swipe | System back button | ✅ YES |
| **Permissions** | Ask once, settings | Ask each time, rationale | ✅ YES |
| **Keyboard** | Different appearance | Different behavior | ✅ YES |
| **Date picker** | Wheel/modal | Material dialog | ⚠️ If custom UI |
| **Push format** | APNs payload | FCM payload | ✅ YES |
| **Deep links** | Universal Links | App Links | ✅ YES |
| **Gestures** | Some unique | Material gestures | ⚠️ If custom |

### Platform Testing Strategy

```
FOR EACH PLATFORM:
├── Run unit tests (same on both)
├── Run component tests (same on both)
├── Run E2E on REAL DEVICE
│   ├── iOS: iPhone (not just simulator)
│   └── Android: Mid-range device (not flagship)
└── Test platform-specific features separately
```

---

> **Mobile testing is NOT web testing. Different constraints, different strategies.**
> This file teaches WHEN to use each testing approach and WHY.
> **Code examples are minimal - focus on decision-making.**

---

## 5. Offline & Network Testing

### Offline Scenarios to Test

| Scenario | What to Verify |
|----------|----------------|
| Start app offline | Shows cached data or offline message |
| Go offline mid-action | Action queued, not lost |
| Come back online | Queue synced, no duplicates |
| Slow network (2G) | Loading states, timeouts work |
| Flaky network | Retry logic, error recovery |

### How to Test Network Conditions

```
APPROACH:
├── Unit tests: Mock NetInfo, test logic
├── Integration: Mock API responses, test UI
├── E2E (Detox): Use device.setURLBlacklist()
├── E2E (Maestro): Use network conditions
└── Manual: Use Charles Proxy / Network Link Conditioner
```

---

> **Mobile testing is NOT web testing. Different constraints, different strategies.**
> This file teaches WHEN to use each testing approach and WHY.
> **Code examples are minimal - focus on decision-making.**

---

## 6. Performance Testing

### What to Measure

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **App startup** | < 2 seconds | Profiler, Flashlight |
| **Screen transition** | < 300ms | React DevTools |
| **List scroll** | 60 FPS | Profiler, feel |
| **Memory** | Stable, no leaks | Instruments / Android Profiler |
| **Bundle size** | Minimize | Metro bundler analysis |

### When to Performance Test

```
PERFORMANCE TEST:
├── Before release (required)
├── After adding heavy features
├── After upgrading dependencies
├── When users report slowness
└── On CI (optional, automated benchmarks)

WHERE TO TEST:
├── Real device (REQUIRED)
├── Low-end device (Galaxy A series, old iPhone)
├── NOT on emulator (lies about performance)
└── With production-like data (not 3 items)
```

---

## Rollback

Restore the baseline if required tooling errors or the procedure introduces a regression.

## Exit Gate

Require fresh evidence for the intended behavior and all applicable project checks.
