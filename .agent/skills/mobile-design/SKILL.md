---
name: mobile-design
description: >-
  Mobile-first design and engineering doctrine for iOS and Android apps.
  Covers touch interaction, performance, platform conventions, offline behavior.
  Triggers on: mobile design, iOS, Android, touch, responsive mobile.
  Coordinates with: mobile-first, mobile-developer, design-system.
metadata:
  category: "mobile-games"
  version: "2.0.0"
  triggers: "mobile design, iOS, Android, touch, responsive"
  coordinates_with: "mobile-first, mobile-developer, design-system"
  success_metrics: "MFRI > 5, platform guidelines followed"
---

# Mobile Design System

> **Purpose:** Mobile-first, touch-first, platform-respectful design

---

## Core Philosophy

```
Touch-first → Battery-conscious → Platform-respectful → Offline-capable
```

**Core Law:** Mobile is NOT a small desktop.

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Designing mobile UI | Follow MFRI principles |
| iOS vs Android | Check platform guidelines |
| Touch interactions | Use touch patterns |
| Accessibility | Check a11y requirements |

---

## Quick Reference: Ask First

| Aspect | Must Ask |
|--------|----------|
| Platform | iOS, Android, or both? |
| Framework | React Native, Flutter, native? |
| Navigation | Tabs, stack, drawer? |
| Offline | Must work offline? |
| Devices | Phone only or tablet too? |

---

## MFRI (Mobile Feasibility & Risk Index)

| Dimension | Question |
|-----------|----------|
| Platform Clarity | Target platform defined? |
| Interaction Complexity | How complex are gestures? |
| Performance Risk | Heavy lists, animations, media? |
| Offline Dependence | Breaks without network? |
| Accessibility Risk | Motor, visual, cognitive impact? |

| Score | Action |
|-------|--------|
| 6-10 | Safe - proceed |
| 3-5 | Add validation |
| 0-2 | Simplify first |
| <0 | Redesign required |

---

## Platform Differences

| Element | iOS | Android |
|---------|-----|---------|
| Back | No button | System back |
| Navigation | Bottom tabs | Bottom nav drawer |
| Typography | SF Pro | Roboto |
| Radius | Rounded | Varies |

---

## Touch Targets

| Guideline | Minimum |
|-----------|---------|
| **iOS** | 44×44 pt |
| **Android** | 48×48 dp |
| **Spacing** | 8dp between |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Desktop patterns | Touch-first design |
| Hover states | Tap/press states |
| Small tap targets | 44×44pt minimum |
| Assume network | Design for offline |

---

## References

- [references/platform-guidelines.md](references/platform-guidelines.md)
- [references/touch-patterns.md](references/touch-patterns.md)
- [references/accessibility.md](references/accessibility.md)

---

> **Remember:** Never default to your favorite stack or pattern.

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `mobile-first` | Skill | Orchestrator |
| `mobile-developer` | Skill | Implementation |
| `design-system` | Skill | Design patterns |

---

⚡ PikaKit v3.2.0
