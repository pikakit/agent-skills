---
"title": "React Native: Expo-Specific Patterns through Related Sub-Skills"
"kind": "reference"
"impact": "high"
"tags":
  - "react"
  - "native"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "React Documentation"
    "url": "https://react.dev/learn"
  - "title": "Vitest Testing Guide"
    "url": "https://vitest.dev/guide/"
---

# React Native: Expo-Specific Patterns through Related Sub-Skills

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **Philosophy:** Native-first thinking. Expo when possible. New Architecture by default.

---

## Expo-Specific Patterns

### Config Plugins

```javascript
// app.config.js
export default {
  expo: {
    plugins: [
      ['expo-camera', { cameraPermission: 'Allow camera for scanning' }],
      ['expo-location', { locationAlwaysPermission: false }],
    ],
  },
};
```

---

> **Philosophy:** Native-first thinking. Expo when possible. New Architecture by default.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Use `index` as key in lists | Use unique IDs |
| Store large data in AsyncStorage | Use MMKV or WatermelonDB |
| Ignore New Architecture | Enable Fabric + TurboModules |
| Mix business logic in components | Separate hooks/services (MVVM) |
| Skip error boundaries | Wrap every navigator with ErrorBoundary |
| Hardcode API keys in JS | Use `react-native-config` + Keychain |

---

> **Philosophy:** Native-first thinking. Expo when possible. New Architecture by default.

---

## 🔗 Related Sub-Skills

| File | When to Read |
|------|-------------|
| [publishing/app-store-optimization.md](app-store-optimization-core-aso-elements.md) | Preparing for App Store / Play Store |
| [publishing/deep-linking.md](deep-linking-deep-link-types.md) | Universal links, app links |
| [publishing/push-notifications.md](push-notifications-platform-services.md) | FCM / APNs setup |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
