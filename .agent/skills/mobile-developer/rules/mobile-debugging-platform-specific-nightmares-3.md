---
"title": "Mobile Debugging: Platform-Specific Nightmares through Related"
"kind": "process"
"impact": "high"
"tags":
  - "mobile"
  - "debugging"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Debug your app in Android Studio"
    "url": "https://developer.android.com/studio/debug"
  - "title": "Diagnosing issues in Xcode"
    "url": "https://developer.apple.com/documentation/xcode/diagnosing-issues-using-crash-reports-and-device-logs"
---

# Mobile Debugging: Platform-Specific Nightmares through Related

## Preconditions

Capture the baseline, target environment, acceptance criteria, and rollback point.

## Procedure

> **Stop console.log() debugging!**
> Mobile apps have complex native layers. Text logs are not enough.

---

## Platform-Specific Nightmares

### Android

| Problem | Cause | Fix |
|---------|-------|-----|
| Gradle sync fail | Java version mismatch | Check `JAVA_HOME`, use JDK 17 |
| Emulator `localhost` | Different network | Use `10.0.2.2` instead of `127.0.0.1` |
| Cached builds | Stale native artifacts | `./gradlew clean` |
| Duplicate classes | Dependency conflict | Check `./gradlew dependencies` |
| R8/ProGuard | Strips used classes | Add keep rules |

### iOS

| Problem | Cause | Fix |
|---------|-------|-----|
| Pod issues | Cache/version mismatch | `pod deintegrate && pod install` |
| Signing errors | Team ID / bundle ID | Check Signing & Capabilities |
| Build cache | Stale artifacts | Product → Clean Build Folder |
| Simulator crash | Missing entitlements | Check .entitlements file |
| Archive fails | Debug-only code | Check `#if DEBUG` guards |

### React Native Build Cleaning

```bash
# Nuclear clean (when nothing works)
# Android
cd android && ./gradlew clean && cd ..

# iOS
cd ios && pod deintegrate && pod install && cd ..

# Metro cache
npx react-native start --reset-cache

# Watchman
watchman watch-del-all
```

### Flutter Build Cleaning

```bash
flutter clean
flutter pub get
cd ios && pod install && cd ..
```

---

> **Stop console.log() debugging!**
> Mobile apps have complex native layers. Text logs are not enough.

---

## Performance Debugging

### "The UI is Laggy" — Don't Guess, Measure

| Framework | Tool | Access |
|-----------|------|--------|
| React Native | Performance Monitor | Shake menu → Show Perf Monitor |
| React Native | React DevTools Profiler | Press `j` in Metro |
| Flutter | Performance Overlay | `flutter run --profile`, press `P` |
| Flutter | DevTools Performance tab | Press `v` in terminal |
| Android | GPU Rendering bars | Developer Options |
| iOS | Core Animation FPS | Instruments |

### What to Look For

```
JS Thread drops (React Native):
├── Heavy computation in render
├── Large JSON parsing
├── Complex filtering/sorting
└── Fix: move to useMemo, workers

UI Thread drops (Both):
├── Too many views
├── Heavy images
├── Layout thrashing
└── Fix: reduce views, optimize images

Main Thread jank (Flutter):
├── Heavy build() methods
├── Synchronous I/O
├── Large widget trees
└── Fix: const constructors, isolates
```

---

> **Stop console.log() debugging!**
> Mobile apps have complex native layers. Text logs are not enough.

---

## Troubleshooting

| Symptom | First Check | Second Check | Third Check |
|---------|-------------|--------------|-------------|
| Crash on launch | Info.plist / Manifest | Native module versions | Clean build |
| White screen | JS bundle loading | Metro/build errors | Entry point |
| Slow startup | Bundle size | Initialization code | Lazy loading |
| Network fails | SSL/Certificate | Proxy settings | ATS config (iOS) |
| Memory growing | Timer cleanup | Image cache limits | Heap snapshot |
| Laggy scroll | List virtualization | Image sizes | Re-render count |

---

> **Stop console.log() debugging!**
> Mobile apps have complex native layers. Text logs are not enough.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| `console.log` everything | Use Reactotron / DevTools |
| "It works on simulator" | Test on real device |
| "Reinstall node_modules" | Clean native build first |
| Ignore native logs | Read logcat / Console.app |
| Guess at performance | Measure with profiler |
| Debug in dev mode | Profile in release/profile mode |
| Skip memory profiling | Check for leaks before release |

---

> **Stop console.log() debugging!**
> Mobile apps have complex native layers. Text logs are not enough.

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [mobile-performance.md](mobile-performance-1-the-mobile-performance-mindset.md) | Performance optimization techniques |
| [mobile-testing.md](mobile-testing-mobile-testing-mindset.md) | Testing strategies including E2E |
| [mobile-backend.md](mobile-backend-mobile-backend-mindset.md) | API/network debugging context |
| [platform-ios.md](platform-ios-1-human-interface-guidelines-philosophy.md) | iOS-specific debugging tools |
| [platform-android.md](platform-android-1-material-design-3-philosophy.md) | Android-specific debugging tools |
| [../frameworks/react-native.md](react-native-framework-decision.md) | RN architecture and error handling |
| [../frameworks/flutter.md](flutter-widget-architecture.md) | Flutter architecture and error handling |

---

## Rollback

Restore the baseline if required tooling errors or the procedure introduces a regression.

## Exit Gate

Require fresh evidence for the intended behavior and all applicable project checks.
