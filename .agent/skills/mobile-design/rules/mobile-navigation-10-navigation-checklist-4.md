---
"title": "Mobile Navigation: Navigation Checklist"
"kind": "reference"
"impact": "high"
"tags":
  - "mobile"
  - "navigation"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Official documentation"
    "url": "https://www.w3.org/WAI/standards-guidelines/wcag/"
---

# Mobile Navigation: Navigation Checklist

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Navigation patterns, deep linking, back handling, and tab/stack/drawer decisions.
> **Navigation is the skeleton of your app—get it wrong and everything feels broken.**

---

## 10. Navigation Checklist

### Before Navigation Architecture

- [ ] App type determined (tabs/drawer/stack)
- [ ] Number of top-level destinations counted
- [ ] Deep link URL scheme planned
- [ ] Auth flow integrated with navigation
- [ ] Tablet/large screen considered

### Before Every Screen

- [ ] Can user navigate back? (not dead end)
- [ ] Deep link to this screen planned
- [ ] State preserved on navigate away/back
- [ ] Transition appropriate for relationship
- [ ] Auth required? Handled?

### Before Release

- [ ] All deep links tested
- [ ] Back button works everywhere
- [ ] Tab states preserved correctly
- [ ] Edge swipe back works (iOS)
- [ ] Predictive back works (Android 14+)
- [ ] Universal/App links configured
- [ ] Push notification deep links work

---

> **Remember:** Navigation is invisible when done right. Users shouldn't think about HOW to get somewhere—they just get there. If they notice navigation, something is wrong.
---



---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [../SKILL.md](../SKILL.md) | 5 must-ask questions (navigation) |
| [platform-ios.md](platform-ios-1-human-interface-guidelines-philosophy.md) | iOS tab bars, nav bars |
| [platform-android.md](platform-android-1-material-design-3-philosophy.md) | Android bottom nav, drawer |
| [touch-psychology.md](touch-psychology-1-fitts-law-for-touch.md) | Gesture-based navigation |
| [engineering-spec.md](production-gates.md) | Full engineering spec |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
