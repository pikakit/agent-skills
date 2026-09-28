---
"title": "Platform Ios: iOS Accessibility through 10. iOS Checklist"
"kind": "reference"
"impact": "high"
"tags":
  - "platform"
  - "ios"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Official documentation"
    "url": "https://www.w3.org/WAI/standards-guidelines/wcag/"
---

# Platform Ios: iOS Accessibility through 10. iOS Checklist

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Human Interface Guidelines (HIG) essentials, iOS design conventions, SF Pro typography, and native patterns.
> **Read this file when building for iPhone/iPad.**

---

## 9. iOS Accessibility

### VoiceOver Requirements

```
Every interactive element needs:
├── Accessibility label (what it is)
├── Accessibility hint (what it does) - optional
├── Accessibility traits (button, link, etc.)
└── Accessibility value (current state)

SwiftUI:
.accessibilityLabel("Play")
.accessibilityHint("Plays the selected track")

React Native:
accessibilityLabel="Play"
accessibilityHint="Plays the selected track"
accessibilityRole="button"
```

### Dynamic Type Scaling

```
MANDATORY: Support Dynamic Type

Users can set text size from:
├── xSmall → 14pt body
├── Small → 15pt body
├── Medium → 16pt body
├── Large (Default) → 17pt body
├── xLarge → 19pt body
├── xxLarge → 21pt body
├── xxxLarge → 23pt body
├── Accessibility sizes → up to 53pt

Your app MUST scale gracefully at all sizes.
```

### Reduce Motion

```
Respect motion preferences:

@Environment(\.accessibilityReduceMotion) var reduceMotion

if reduceMotion {
    // Use instant transitions
} else {
    // Use animations
}

React Native:
import { AccessibilityInfo } from 'react-native';
AccessibilityInfo.isReduceMotionEnabled()
```

---

> Human Interface Guidelines (HIG) essentials, iOS design conventions, SF Pro typography, and native patterns.
> **Read this file when building for iPhone/iPad.**

---

## 10. iOS Checklist

### Before Every iOS Screen

- [ ] Using SF Pro or SF Symbols
- [ ] Dynamic Type supported
- [ ] Safe areas respected
- [ ] Navigation follows HIG (back gesture works)
- [ ] Tab bar items ≤ 5
- [ ] Touch targets ≥ 44pt

### Before iOS Release

- [ ] Dark mode tested
- [ ] All text sizes tested (Accessibility Inspector)
- [ ] VoiceOver tested
- [ ] Edge swipe back works everywhere
- [ ] Keyboard avoidance implemented
- [ ] Notch/Dynamic Island handled
- [ ] Home indicator area respected
- [ ] Native components used where possible

---

> **Remember:** iOS users have strong expectations from other iOS apps. Deviating from HIG patterns feels "broken" to them. When in doubt, use the native component.
---



---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [../SKILL.md](../SKILL.md) | MFRI scoring, platform differences |
| [platform-android.md](platform-android-1-material-design-3-philosophy.md) | Android counterpart |
| [touch-psychology.md](touch-psychology-1-fitts-law-for-touch.md) | Touch interaction patterns |
| [mobile-typography.md](mobile-typography-1-mobile-typography-fundamentals.md) | SF Pro details |
| [engineering-spec.md](production-gates.md) | Full engineering spec |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
