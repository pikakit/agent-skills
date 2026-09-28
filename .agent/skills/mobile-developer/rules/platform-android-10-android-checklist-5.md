---
"title": "Platform Android: Android Checklist"
"kind": "reference"
"impact": "high"
"tags":
  - "mobile-developer"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Material Design 3 Mobile"
    "url": "https://developer.android.com/design/ui/mobile"
  - "title": "Jetpack Compose Documentation"
    "url": "https://developer.android.com/develop/ui/compose"
---

# Platform Android: Android Checklist

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Material Design 3 essentials, Android design conventions, Roboto typography, and native patterns.
> **Read this file when building for Android devices.**

---

## 10. Android Checklist

### Before Every Android Screen

- [ ] Using Material 3 components
- [ ] Touch targets = 48dp
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

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
