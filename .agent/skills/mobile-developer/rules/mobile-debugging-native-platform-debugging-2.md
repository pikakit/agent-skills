---
"title": "Mobile Debugging: Native Platform Debugging through Memory Leak Detection"
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

# Mobile Debugging: Native Platform Debugging through Memory Leak Detection

## Preconditions

Capture the baseline, target environment, acceptance criteria, and rollback point.

## Procedure

> **Stop console.log() debugging!**
> Mobile apps have complex native layers. Text logs are not enough.

---

## Native Platform Debugging

### iOS (Xcode)

| Tool | Purpose | Access |
|------|---------|--------|
| **Console.app** | System logs, crash reports | Applications → Utilities |
| **Xcode Instruments** | Time Profiler, Allocations, Leaks | Product → Profile |
| **View Debugger** | 3D UI hierarchy | Debug → View Debugging |
| **Memory Graph** | Retain cycle detection | Debug → Debug Memory Graph |
| **Network Link Conditioner** | Simulate slow networks | Settings → Developer |

### Android (Android Studio)

| Tool | Purpose | Access |
|------|---------|--------|
| **Logcat** | System logs, crash traces | `adb logcat` or Android Studio |
| **Android Profiler** | CPU, Memory, Network, Energy | View → Tool Windows → Profiler |
| **Layout Inspector** | UI hierarchy debugging | Tools → Layout Inspector |
| **StrictMode** | Detect disk/network on main thread | Enable in Developer Options |
| **GPU Rendering** | Frame rendering profiler | Developer Options → Profile GPU |

### Key Native Commands

```bash
# Android — filter for crashes
adb logcat *:E | grep -i 'fatal\|crash\|exception'

# Android — clear and watch
adb logcat -c && adb logcat *:W

# Android — specific app
adb logcat --pid=$(adb shell pidof -s com.example.myapp)

# iOS — open device logs
open /Applications/Utilities/Console.app

# iOS — view crash logs
xcrun simctl spawn booted log stream --predicate 'process == "MyApp"'
```

---

> **Stop console.log() debugging!**
> Mobile apps have complex native layers. Text logs are not enough.

---

## Network Debugging

### Problem: No Browser DevTools Network Tab

**Solution 1: Built-in tools**
- React Native DevTools (RN 0.76+): Network tab
- Reactotron: Auto-captures all requests
- Flutter DevTools: Network tab

**Solution 2: Proxy (see ALL traffic including native SDKs)**

| Tool | Platform | Free | SSL Support |
|------|----------|:----:|:-----------:|
| **Proxyman** | macOS | ✅ (basic) | ✅ |
| **Charles Proxy** | All | Trial | ✅ |
| **mitmproxy** | All | ✅ | ✅ |

```
Setup:
1. Install proxy tool
2. Install SSL certificate on device/simulator
3. Configure device proxy settings → proxy IP:port
4. See ALL HTTP/HTTPS traffic
```

---

> **Stop console.log() debugging!**
> Mobile apps have complex native layers. Text logs are not enough.

---

## Memory Leak Detection

### Common Leak Sources

| Source | Platform | Detection |
|--------|----------|-----------|
| Uncleared timers | RN/Flutter | Profiler → steady memory growth |
| Event listeners not removed | RN | Profiler + useEffect cleanup |
| Stream subscriptions | Flutter | DevTools Memory tab |
| Large image cache | Both | Memory tab → allocation timeline |
| Async after unmount | RN | LogBox warning + AbortController |
| AnimationController not disposed | Flutter | DevTools Memory + lint |

### Memory Profiling Workflow

```
1. Open profiler (DevTools / Instruments / Android Profiler)
2. Perform suspected leaking action
3. Navigate away from screen
4. Force garbage collection (GC button)
5. Check: does memory return to baseline?
6. If NO → leak detected
7. Take heap snapshot to find retained objects
```

### React Native Memory Check

```typescript
// Check for cleanup
useEffect(() => {
  const subscription = eventEmitter.addListener('event', handler);
  const interval = setInterval(fetchData, 5000);
  const controller = new AbortController();

  return () => {
    subscription.remove();     // ✅ Clean listener
    clearInterval(interval);   // ✅ Clean timer
    controller.abort();        // ✅ Cancel async
  };
}, []);
```

### Flutter Memory Check

```dart
@override
void dispose() {
  _controller.dispose();       // ✅ Animation controller
  _subscription.cancel();      // ✅ Stream subscription
  _textController.dispose();   // ✅ Text controller
  _focusNode.dispose();        // ✅ Focus node
  super.dispose();
}
```

---

## Rollback

Restore the baseline if required tooling errors or the procedure introduces a regression.

## Exit Gate

Require fresh evidence for the intended behavior and all applicable project checks.
