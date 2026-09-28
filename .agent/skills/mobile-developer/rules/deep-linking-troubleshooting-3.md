---
"title": "Deep Linking: Troubleshooting through Related"
"kind": "reference"
"impact": "high"
"tags":
  - "deep"
  - "linking"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Android App Links"
    "url": "https://developer.android.com/training/app-links"
  - "title": "Apple Associated Domains"
    "url": "https://developer.apple.com/documentation/xcode/supporting-associated-domains"
---

# Deep Linking: Troubleshooting through Related

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> **Philosophy:** Every screen should be linkable. Users expect seamless web-to-app transitions.

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Links open in browser | AASA/assetlinks not found | Check file hosting, HTTPS, no redirects |
| Intermittent failures | System caching | Clear link cache, reinstall app |
| Only works on some links | Path matching wrong | Check path patterns in AASA/manifest |
| Doesn't work after install | Deferred linking not set up | Use Branch.io |
| AASA not found by Apple | Invalid JSON | Validate JSON (no comments), check Content-Type |
| App Links not verified | SHA256 mismatch | Re-generate fingerprint: `keytool -list -v` |

---

> **Philosophy:** Every screen should be linkable. Users expect seamless web-to-app transitions.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Use URI schemes for web-to-app | Use Universal Links / App Links |
| Rely on Firebase Dynamic Links | Migrate to Branch.io or custom |
| Put comments in AASA JSON | Valid JSON only |
| Skip deferred deep linking | Handle install-then-open flow |
| Ignore link previews | Add OG meta tags |
| Track without consent | ATT + GDPR compliance |

---

> **Philosophy:** Every screen should be linkable. Users expect seamless web-to-app transitions.

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [app-store-optimization.md](app-store-optimization-core-aso-elements.md) | Store listing with deep link targets |
| [push-notifications.md](push-notifications-platform-services.md) | Push → deep link to screen |
| [../frameworks/react-native.md](react-native-framework-decision.md) | RN navigation config |
| [../frameworks/flutter.md](flutter-widget-architecture.md) | GoRouter deep linking |
| [../frameworks/native.md](native-when-to-go-native.md) | SwiftUI/Compose navigation |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
