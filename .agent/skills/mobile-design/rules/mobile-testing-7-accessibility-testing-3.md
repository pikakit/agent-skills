---
"title": "Mobile Testing: Accessibility Testing through Related"
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

# Mobile Testing: Accessibility Testing through Related

## Preconditions

Capture the baseline, target environment, acceptance criteria, and rollback point.

## Procedure

> **Mobile testing is NOT web testing. Different constraints, different strategies.**
> This file teaches WHEN to use each testing approach and WHY.
> **Code examples are minimal - focus on decision-making.**

---

## 7. Accessibility Testing

### What to Verify

| Element | Check |
|---------|-------|
| Interactive elements | Have accessibilityLabel |
| Images | Have alt text or decorative flag |
| Forms | Labels linked to inputs |
| Buttons | Role = button |
| Touch targets | ≥ 44x44 (iOS) / 48x48 (Android) |
| Color contrast | WCAG AA minimum |

### How to Test

```
AUTOMATED:
├── React Native: jest-axe
├── Flutter: Accessibility checker in tests
└── Lint rules for missing labels

MANUAL:
├── Enable VoiceOver (iOS) / TalkBack (Android)
├── Navigate entire app with screen reader
├── Test with increased text size
└── Test with reduced motion
```

---

> **Mobile testing is NOT web testing. Different constraints, different strategies.**
> This file teaches WHEN to use each testing approach and WHY.
> **Code examples are minimal - focus on decision-making.**

---

## 8. CI/CD Integration

### What to Run Where

| Stage | Tests | Devices |
|-------|-------|---------|
| **PR** | Unit + Component | None (fast) |
| **Merge to main** | + Integration | Simulator/Emulator |
| **Pre-release** | + E2E | Real devices (farm) |
| **Nightly** | Full suite | Device farm |

### Device Farm Options

| Service | Pros | Cons |
|---------|------|------|
| **Firebase Test Lab** | Free tier, Google devices | Android focus |
| **AWS Device Farm** | Wide selection | Expensive |
| **BrowserStack** | Good UX | Expensive |
| **Local devices** | Free, reliable | Limited variety |

---

> **Mobile testing is NOT web testing. Different constraints, different strategies.**
> This file teaches WHEN to use each testing approach and WHY.
> **Code examples are minimal - focus on decision-making.**

---

## 📝 MOBILE TESTING CHECKLIST

### Before PR
- [ ] Unit tests for new logic
- [ ] Component tests for new UI
- [ ] No console.logs in tests
- [ ] Tests pass on CI

### Before Release
- [ ] E2E on real iOS device
- [ ] E2E on real Android device
- [ ] Tested on low-end device
- [ ] Offline scenarios verified
- [ ] Performance acceptable
- [ ] Accessibility verified

### What to Skip (Consciously)
- [ ] 100% coverage (aim for meaningful coverage)
- [ ] Every visual permutation (use snapshots sparingly)
- [ ] Third-party library internals
- [ ] Backend logic (separate tests)

---

> **Mobile testing is NOT web testing. Different constraints, different strategies.**
> This file teaches WHEN to use each testing approach and WHY.
> **Code examples are minimal - focus on decision-making.**

---

## 🎯 Testing Questions to Ask

Before writing tests, answer:

1. **What could break?** → Test that
2. **What's critical for users?** → E2E test that
3. **What's complex logic?** → Unit test that
4. **What's platform-specific?** → Test on both platforms
5. **What happens offline?** → Test that scenario

> **Remember:** Good mobile testing is about testing the RIGHT things, not EVERYTHING. A flaky E2E test is worse than no test. A failing unit test that catches a bug is worth 100 passing trivial tests.

---

> **Mobile testing is NOT web testing. Different constraints, different strategies.**
> This file teaches WHEN to use each testing approach and WHY.
> **Code examples are minimal - focus on decision-making.**

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [../SKILL.md](../SKILL.md) | MFRI scoring, audit script |
| [mobile-debugging.md](mobile-debugging.md) | Debugging strategies |
| [mobile-performance.md](mobile-performance-1-the-mobile-performance-mindset.md) | Performance testing |
| [engineering-spec.md](production-gates.md) | Full engineering spec |

---

## Rollback

Restore the baseline if required tooling errors or the procedure introduces a regression.

## Exit Gate

Require fresh evidence for the intended behavior and all applicable project checks.
