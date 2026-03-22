---
name: mobile-design
description: >-
  Mobile-first design and engineering doctrine for iOS and Android apps. Covers touch
  interaction, performance, platform conventions, offline behavior. Triggers on: mobile design,
  iOS, Android, touch, responsive mobile.
metadata:
  author: pikakit
  version: "2.0.0"
---

# Mobile Design â€” Mobile-First Design Doctrine

> Touch-first. Platform-respectful. MFRI scored. 44Ã—44pt / 48Ã—48dp minimum.

**Core Law:** Mobile is NOT a small desktop.

---

## When to Use

| Situation | Action |
|-----------|--------|
| Designing mobile UI | Score with MFRI |
| iOS vs Android | Check platform guidelines |
| Touch interactions | Use touch target standards |
| Accessibility audit | Check a11y requirements |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| MFRI scoring (5 dimensions) | Mobile orchestration (â†’ mobile-first) |
| Platform guidelines (iOS/Android) | Mobile implementation (â†’ mobile-developer) |
| Touch target standards | Design system components (â†’ design-system) |
| Typography routing (SF Pro/Roboto) | API design (â†’ api-architect) |

**Expert decision skill:** Produces design decisions. Does not write code or create components.

---

## 5 Must-Ask Questions (Before Any Design)

| # | Question | Options |
|---|----------|---------|
| 1 | Platform? | iOS, Android, or both |
| 2 | Framework? | React Native, Flutter, native |
| 3 | Navigation? | Tabs, stack, drawer |
| 4 | Offline? | Must work offline? |
| 5 | Devices? | Phone only or tablet too |

---

## MFRI Scoring (Mobile Feasibility & Risk Index)

| Dimension | Assessment |
|-----------|------------|
| Platform Clarity | Target platform defined? |
| Interaction Complexity | How complex are gestures? |
| Performance Risk | Heavy lists, animations, media? |
| Offline Dependence | Breaks without network? |
| Accessibility Risk | Motor, visual, cognitive impact? |

| Score | Action |
|-------|--------|
| 6-10 | âœ… Safe â€” proceed |
| 3-5 | âš ï¸ Add validation |
| 0-2 | ðŸ”´ Simplify first |
| < 0 | âŒ Redesign required |

---

## Platform Differences (Fixed)

| Element | iOS | Android |
|---------|-----|---------|
| Back | No button | System back |
| Navigation | Bottom tabs | Bottom nav / drawer |
| Typography | **SF Pro** | **Roboto** |
| Corner radius | Rounded (continuous) | Varies (MD3) |

---

## Touch Targets (Fixed)

| Standard | Minimum |
|----------|---------|
| **iOS** | 44Ã—44 pt |
| **Android** | 48Ã—48 dp |
| **Spacing** | 8dp between targets |

---

## Core Philosophy (Fixed Order)

```
Touch-first â†’ Battery-conscious â†’ Platform-respectful â†’ Offline-capable
```

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNKNOWN_PLATFORM` | Yes | Platform not ios/android/both |
| `ERR_MISSING_PLATFORM` | Yes | Platform not provided |
| `WARN_LOW_MFRI` | Yes | MFRI score below 3 |

**Zero internal retries.** Deterministic; same context = same assessment.

---

## Anti-Patterns

| âŒ Don't | âœ… Do |
|---------|-------|
| Apply desktop patterns | Touch-first design |
| Use hover states | Tap and press states |
| Small tap targets | 44Ã—44pt (iOS) / 48Ã—48dp (Android) |
| Assume network | Design for offline |
| Mix platform conventions | Respect iOS HIG / Material Design |

---

## ðŸ“‘ Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [platform-ios.md](rules/platform-ios.md) | iOS HIG guidelines | iOS design |
| [platform-android.md](rules/platform-android.md) | Material Design guidelines | Android design |
| [touch-psychology.md](rules/touch-psychology.md) | Touch interaction patterns | Touch UX |
| [mobile-navigation.md](rules/mobile-navigation.md) | Navigation patterns | Nav decisions |
| [mobile-typography.md](rules/mobile-typography.md) | Typography systems | Font selection |
| [mobile-color-system.md](rules/mobile-color-system.md) | Color palettes | Color decisions |
| [mobile-performance.md](rules/mobile-performance.md) | Performance guidelines | Perf concerns |
| [mobile-testing.md](rules/mobile-testing.md) | Testing strategies | QA planning |
| [mobile-debugging.md](rules/mobile-debugging.md) | Debugging patterns | Bug fixing |
| [mobile-backend.md](rules/mobile-backend.md) | Backend integration | API decisions |
| [mobile-design-thinking.md](rules/mobile-design-thinking.md) | Design methodology | Design process |
| [decision-trees.md](rules/decision-trees.md) | Decision frameworks | Complex decisions |
| [mobile_audit.js](scripts/mobile_audit.js) | Mobile design audit CLI | Design audit |
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec | Architecture review |

**Selective reading:** Read ONLY files relevant to current design question.

---

## ðŸ”— Related

| Item | Type | Purpose |
|------|------|---------|
| `mobile-first` | Skill | Mobile orchestrator |
| `mobile-developer` | Skill | Implementation |
| `design-system` | Skill | Design patterns |

---

âš¡ PikaKit v3.9.105
