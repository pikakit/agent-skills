---
"title": "Platform Android: Android Accessibility through 10. Android Checklist"
"kind": "reference"
"impact": "high"
"tags":
  - "platform"
  - "android"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Official documentation"
    "url": "https://www.w3.org/WAI/standards-guidelines/wcag/"
---

# Platform Android: Android Accessibility through 10. Android Checklist

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Material Design 3 essentials, Android design conventions, Roboto typography, and native patterns.
> **Read this file when building for Android devices.**

---

## 9. Android Accessibility

### TalkBack Requirements

```
Every interactive element needs:
├── contentDescription (what it is)
├── Correct semantics (button, checkbox, etc.)
├── State announcements (selected, disabled)
└── Grouping where logical

Jetpack Compose:
Modifier.semantics {
    contentDescription = "Play button"
    role = Role.Button
}

React Native:
accessibilityLabel="Play button"
accessibilityRole="button"
accessibilityState={{ disabled: false }}
```

### Touch Target Size

```
MANDATORY: 48dp × 48dp minimum

Even if visual element is smaller:
├── Icon: 24dp visual, 48dp touch area
├── Checkbox: 20dp visual, 48dp touch area
└── Add padding to reach 48dp

Spacing between targets: 8dp minimum
```

### Font Scaling

```
Android supports font scaling:
├── 85% (smaller)
├── 100% (default)
├── 115%, 130%, 145%...
├── Up to 200% (largest)

RULE: Test your UI at 200% font scale.
Use sp units and avoid fixed heights.
```

### Reduce Motion

```kotlin
// Check motion preference
val reduceMotion = Settings.Global.getFloat(
    contentResolver,
    Settings.Global.ANIMATOR_DURATION_SCALE,
    1f
) == 0f

if (reduceMotion) {
    // Skip or reduce animations
}
```

---

> Material Design 3 essentials, Android design conventions, Roboto typography, and native patterns.
> **Read this file when building for Android devices.**

---

## 10. Android Checklist

### Before Every Android Screen

- [ ] Using Material 3 components
- [ ] Touch targets ≥ 48dp
- [ ] Ripple effect on all touchables
- [ ] Roboto or Material type scale
- [ ] Semantic colors (dynamic color support)
- [ ] Back navigation works correctly

### Before Android Release

- [ ] Dark theme tested
- [ ] Dynamic color tested (if supported)
- [ ] All font sizes tested (200% scale)
- [ ] TalkBack tested
- [ ] Predictive back implemented (Android 14+)
- [ ] Edge-to-edge display (Android 15+)
- [ ] Different screen sizes tested (phones, tablets)
- [ ] Navigation patterns match platform (back, gestures)

---

> **Remember:** Android users expect Material Design. Custom designs that ignore Material patterns feel foreign and broken. Use Material components as your foundation, customize thoughtfully.
---



---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [../SKILL.md](../SKILL.md) | MFRI scoring, platform differences |
| [platform-ios.md](platform-ios-1-human-interface-guidelines-philosophy.md) | iOS counterpart |
| [touch-psychology.md](touch-psychology-1-fitts-law-for-touch.md) | Touch interaction patterns |
| [mobile-typography.md](mobile-typography-1-mobile-typography-fundamentals.md) | Roboto details |
| [engineering-spec.md](production-gates.md) | Full engineering spec |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
