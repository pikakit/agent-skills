---
"title": "Flutter: CI/CD & Build through Related Sub-Skills"
"kind": "reference"
"impact": "high"
"tags":
  - "flutter"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Continuous delivery with Flutter"
    "url": "https://docs.flutter.dev/deployment/cd"
---

# Flutter: CI/CD & Build through Related Sub-Skills

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **Philosophy:** Everything is a widget. Composition over inheritance. Dart-first.

---

## CI/CD & Build

### Fastlane

```bash
# iOS
fastlane ios beta     # TestFlight
fastlane ios release  # App Store

# Android
fastlane android beta     # Internal testing
fastlane android release  # Play Store
```

### Codemagic / GitHub Actions

```yaml
# codemagic.yaml
workflows:
  flutter-release:
    triggering:
      events: [push]
      branch_patterns: [main]
    scripts:
      - name: Build
        script: flutter build appbundle --release
    publishing:
      google_play:
        track: internal
```

---

> **Philosophy:** Everything is a widget. Composition over inheritance. Dart-first.

---

## Platform-Specific Code

```dart
import 'dart:io' show Platform;

Widget build(BuildContext context) {
  if (Platform.isIOS) {
    return CupertinoButton(child: Text('iOS Style'));
  }
  return ElevatedButton(child: Text('Material Style'));
}

// Or use flutter_platform_widgets for automatic switching
```

---

> **Philosophy:** Everything is a widget. Composition over inheritance. Dart-first.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Deep widget nesting | Extract to smaller widgets |
| Business logic in widgets | Clean Architecture layers |
| Ignore widget keys | Use keys for list items |
| Blocking main isolate | Use `compute()` for heavy work |
| Use Provider for new projects | Use Riverpod |
| Ignore sealed classes | Use exhaustive pattern matching |
| Skip error handling | Result type + global handlers |
| Hardcode API keys in code | Use `--dart-define` |

---

> **Philosophy:** Everything is a widget. Composition over inheritance. Dart-first.

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
