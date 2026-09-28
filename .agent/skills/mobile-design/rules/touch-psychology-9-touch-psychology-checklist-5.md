---
"title": "Touch Psychology: Touch Psychology Checklist through 10. Quick Reference Card"
"kind": "reference"
"impact": "high"
"tags":
  - "touch"
  - "psychology"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Official documentation"
    "url": "https://www.w3.org/WAI/standards-guidelines/wcag/"
---

# Touch Psychology: Touch Psychology Checklist through 10. Quick Reference Card

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Deep dive into mobile touch interaction, Fitts' Law for touch, thumb zone anatomy, gesture psychology, and haptic feedback.
> **This is the mobile equivalent of ux-psychology.md - CRITICAL for all mobile work.**

---

## 9. Touch Psychology Checklist

### Before Every Screen

- [ ] **All touch targets ≥ 44-48px?**
- [ ] **Primary CTA in thumb zone?**
- [ ] **Destructive actions require confirmation?**
- [ ] **Gesture alternatives exist (visible buttons)?**
- [ ] **Haptic feedback on important actions?**
- [ ] **Immediate visual feedback on tap?**
- [ ] **Loading states for actions > 100ms?**

### Before Release

- [ ] **Tested on smallest supported device?**
- [ ] **Tested one-handed on large phone?**
- [ ] **All gestures have visible alternatives?**
- [ ] **Haptics work correctly (test on device)?**
- [ ] **Touch targets tested with accessibility settings?**
- [ ] **No tiny close buttons or icons?**

---

> Deep dive into mobile touch interaction, Fitts' Law for touch, thumb zone anatomy, gesture psychology, and haptic feedback.
> **This is the mobile equivalent of ux-psychology.md - CRITICAL for all mobile work.**

---

## 10. Quick Reference Card

### Touch Target Sizes

```
                     iOS        Android     WCAG
Minimum:           44pt       48dp       44px
Recommended:       48pt+      56dp+      -
Spacing:           8pt+       8dp+       8px+
```

### Thumb Zone Actions

```
TOP:      Navigation, settings, back (infrequent)
MIDDLE:   Content, secondary actions
BOTTOM:   Primary CTA, tab bar, FAB (frequent)
```

### Haptic Selection

```
Light:    Selection, toggle, minor
Medium:   Tap, standard action
Heavy:    Confirm, complete, drop
Success:  Task done
Error:    Failed action
Warning:  Attention needed
```

---

> **Remember:** Every touch is a conversation between user and device. Make it feel natural, responsive, and respectful of human fingers—not precise cursor points.
---



---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [../SKILL.md](../SKILL.md) | Touch target standards (44pt/48dp) |
| [platform-ios.md](platform-ios-1-human-interface-guidelines-philosophy.md) | iOS haptics, gestures |
| [platform-android.md](platform-android-1-material-design-3-philosophy.md) | Android touch feedback |
| [mobile-navigation.md](mobile-navigation-1-navigation-selection-decision-tree.md) | Gesture-based navigation |
| [engineering-spec.md](production-gates.md) | Full engineering spec |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
