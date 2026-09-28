---
"title": "Mobile Debugging: Debugging Mindset through Flutter Debugging Tools"
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

# Mobile Debugging: Debugging Mindset through Flutter Debugging Tools

## Preconditions

Capture the baseline, target environment, acceptance criteria, and rollback point.

## Procedure

> **Stop console.log() debugging!**
> Mobile apps have complex native layers. Text logs are not enough.

---

## Debugging Mindset

```
Web Debugging:      Mobile Debugging:
┌──────────────┐    ┌──────────────┐
│  Browser     │    │  JS Bridge   │
│  DevTools    │    │  Native UI   │
│  Network Tab │    │  GPU/Memory  │
└──────────────┘    │  Threads     │
                    └──────────────┘
```

**Key Differences:**
1. **Native Layer** — JS code works, but app crashes? It's likely native (Java/Obj-C/Swift/Kotlin).
2. **Deployment** — You can't just "refresh". State gets lost or stuck.
3. **Network** — SSL Pinning, proxy settings are harder.
4. **Device Logs** — `adb logcat` and Console.app are your truth.

---

> **Stop console.log() debugging!**
> Mobile apps have complex native layers. Text logs are not enough.

---

## Crash Triage: Red Screen vs Crash to Home

### JS Error (Red Screen / LogBox)

```
SYMPTOMS:
├── Red error screen (dev mode)
├── LogBox warning or error
├── "undefined is not an object"
├── "Cannot read property of null"

DIAGNOSIS:
├── Read the stack trace on screen
├── Check component tree
├── Look for missing imports / undefined props
└── Usually clear from the error message
```

### Native Crash (App Closes to Home Screen)

```
SYMPTOMS:
├── App disappears without JS error
├── White flash then home screen
├── Hang → force close

DIAGNOSIS:
├── Android: adb logcat *:E | grep -i 'fatal\|crash'
├── iOS: Xcode → Window → Devices → View Device Logs
├── Check Info.plist / AndroidManifest.xml
└── Check native module compatibility

COMMON CAUSES:
├── Missing permission declaration
├── Native module version mismatch
├── Memory exhaustion (OOM)
├── Incorrect entitlements (iOS)
└── ProGuard/R8 stripping required classes (Android)
```

> **💡 Pro Tip:** If app crashes immediately on launch, inspect native configuration first, then verify the failure with platform logs.

---

> **Stop console.log() debugging!**
> Mobile apps have complex native layers. Text logs are not enough.

---

## React Native Debugging Tools

### Primary Tools

| Tool | Purpose | Status |
|------|---------|--------|
| **React DevTools** | Component tree, props, state inspection | ✅ Active (recommended) |
| **React Native DevTools** | Integrated debugger (RN 0.76+) | ✅ Active |
| **Reactotron** | State/API/Redux/AsyncStorage inspection | ✅ Active |
| **Expo Dev Tools** | Element inspector, network, performance | ✅ Active (Expo projects) |
| ~~Flipper~~ | ~~Layout/Network/DB~~ | ❌ **Deprecated for RN** |

> **Note:** Flipper was deprecated from React Native in late 2024. Use React Native DevTools (built-in) or Reactotron instead.

### React Native DevTools (RN 0.76+)

```
Access: press j in Metro terminal
├── Component Inspector
├── Network Inspector  
├── Console
├── Profiler
└── Works in dev mode only
```

### Reactotron Setup

```bash
npm install reactotron-react-native
```

```typescript
// ReactotronConfig.ts
import Reactotron from 'reactotron-react-native';

Reactotron.configure()
  .useReactNative({
    networking: { ignoreUrls: /symbolicate/ },
    storybook: true,
  })
  .connect();
```

Features: API requests, state snapshots, Redux actions, AsyncStorage, custom logs.

---

> **Stop console.log() debugging!**
> Mobile apps have complex native layers. Text logs are not enough.

---

## Flutter Debugging Tools

### Flutter DevTools

```
Access: flutter run → press v (opens DevTools in browser)

Available tabs:
├── Flutter Inspector — Widget tree, layout explorer
├── Performance — Frame rendering, jank detection
├── CPU Profiler — Function-level CPU usage
├── Memory — Allocation tracking, leak detection
├── Network — HTTP requests
├── Logging — Structured logs
└── App Size — Bundle analysis
```

### Flutter-Specific Debugging

```dart
// Layout debugging
debugPaintSizeEnabled = true;       // Show widget boundaries
debugPaintBaselinesEnabled = true;  // Show text baselines
debugPaintPointersEnabled = true;   // Show touch points

// Performance debugging
debugProfileBuildsEnabled = true;   // Log widget builds
debugPrintRebuildDirtyWidgets = true; // Print rebuild reasons

// Always run in profile mode for perf testing:
// flutter run --profile
```

### Widget Inspector

```
Access: press i in terminal (or DevTools)
├── Select widget on device
├── See widget tree hierarchy
├── View properties and constraints
├── Hot-reload after changes
└── Debug layout overflow issues
```

---

## Rollback

Restore the baseline if required tooling errors or the procedure introduces a regression.

## Exit Gate

Require fresh evidence for the intended behavior and all applicable project checks.
