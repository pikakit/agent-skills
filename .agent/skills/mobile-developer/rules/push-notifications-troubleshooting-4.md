---
"title": "Push Notifications: Troubleshooting through Related"
"kind": "reference"
"impact": "high"
"tags":
  - "push"
  - "notifications"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Android Notifications Overview"
    "url": "https://developer.android.com/develop/ui/views/notifications"
  - "title": "Apple User Notifications"
    "url": "https://developer.apple.com/documentation/usernotifications"
---

# Push Notifications: Troubleshooting through Related

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Not receiving on iOS | Missing APNs certificate/key | Upload p8 key in Firebase Console |
| Not receiving on Android | Missing channel (8.0+) | Create channel before sending |
| Delayed delivery | Low priority | Set `priority: "high"` (Android) |
| Token expired | User reinstalled / long inactive | Handle `onNewToken` callback |
| Foreground not displaying | Not handled | Use notifee/flutter_local_notifications |
| Background handler not firing | Not registered at top level | Register before `runApp()` / `AppRegistry` |

---

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Ask permission immediately | Ask after user sees value |
| Send same notification to all | Segment and personalize |
| Only promotional content | Mix value + promotional |
| Ignore opt-out signals | Reduce frequency for disengaged |
| Deep link to home screen | Deep link to relevant content |
| Store tokens in plaintext | Encrypt at rest |
| Skip Android 13 permission | Request POST_NOTIFICATIONS |

---

> **Philosophy:** Respect the user's attention. Every notification should provide value.

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [app-store-optimization.md](app-store-optimization-core-aso-elements.md) | Re-engagement strategy |
| [deep-linking.md](deep-linking-deep-link-types.md) | Push → deep link routing |
| [../frameworks/react-native.md](react-native-framework-decision.md) | RN notification setup |
| [../frameworks/flutter.md](flutter-widget-architecture.md) | Flutter notification setup |
| [../frameworks/native.md](native-when-to-go-native.md) | Native iOS/Android handlers |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
