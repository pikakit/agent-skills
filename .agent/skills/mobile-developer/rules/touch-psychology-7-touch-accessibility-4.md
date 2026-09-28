---
"title": "Touch Psychology: Touch Accessibility through 10. Quick Reference Card"
"kind": "reference"
"impact": "high"
"tags":
  - "mobile-developer"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Apple HIG Haptics"
    "url": "https://developer.apple.com/design/human-interface-guidelines/playing-haptics"
  - "title": "Material Design Accessibility Foundations"
    "url": "https://developer.android.com/design/ui/mobile/guides/foundations/accessibility"
---

# Touch Psychology: Touch Accessibility through 10. Quick Reference Card

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Deep dive into mobile touch interaction, Fitts' Law for touch, thumb zone anatomy, gesture psychology, and haptic feedback.
> **This is the mobile equivalent of ux-psychology.md - CRITICAL for all mobile work.**

---

## 7. Touch Accessibility

### Motor Impairment Considerations

```
Users with motor impairments may:
+-- Have tremors (need larger targets)
+-- Use assistive devices (different input method)
+-- Have limited reach (one-handed necessity)
+-- Need more time (avoid timeouts)
+-- Make accidental touches (need confirmation)

Design responses:
+-- Generous touch targets (48dp+)
+-- Adjustable timing for gestures
+-- Undo for destructive actions
+-- Switch control support
+-- Voice control support
```

### Touch Target Spacing (A11y)

```
WCAG 2.2 Success Criterion 2.5.8:

Touch targets MUST have:
+-- Width: = 44px
+-- Height: = 44px
+-- Spacing: = 8px from adjacent targets

OR the target is:
+-- Inline (within text)
+-- User-controlled (user can resize)
+-- Essential (no alternative design)
```

### Accessible Touch Patterns

| Pattern | Accessible Implementation |
|---------|---------------------------|
| Swipe actions | Provide menu alternative |
| Drag and drop | Provide select + move option |
| Pinch zoom | Provide zoom buttons |
| Force touch | Provide long press alternative |
| Shake gesture | Provide button alternative |

---

> Deep dive into mobile touch interaction, Fitts' Law for touch, thumb zone anatomy, gesture psychology, and haptic feedback.
> **This is the mobile equivalent of ux-psychology.md - CRITICAL for all mobile work.**

---

## 8. Emotion in Touch

### The Premium Feel

```
What makes touch feel "premium":
+-- Instant response (< 50ms)
+-- Appropriate haptic feedback
+-- Smooth 60fps animations
+-- Correct resistance/physics
+-- Sound feedback (when appropriate)
+-- Attention to spring physics
```

### Emotional Touch Feedback

| Emotion | Touch Response |
|---------|----------------|
| Success | Haptic success + confetti/check |
| Error | Haptic error + shake animation |
| Warning | Haptic warning + attention color |
| Delight | Unexpected smooth animation |
| Power | Heavy haptic on significant action |

### Trust Building Through Touch

```
Trust signals in touch interactions:
+-- Consistent behavior (same action = same response)
+-- Reliable feedback (never fails silently)
+-- Secure feel for sensitive actions
+-- Professional animations (not janky)
+-- No accidental actions (confirmation for destructive)
```

---

> Deep dive into mobile touch interaction, Fitts' Law for touch, thumb zone anatomy, gesture psychology, and haptic feedback.
> **This is the mobile equivalent of ux-psychology.md - CRITICAL for all mobile work.**

---

## 9. Touch Psychology Checklist

### Before Every Screen

- [ ] **All touch targets = 44-48px?**
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

> **Remember:** Every touch is a conversation between user and device. Make it feel natural, responsive, and respectful of human fingers — not precise cursor points.

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
