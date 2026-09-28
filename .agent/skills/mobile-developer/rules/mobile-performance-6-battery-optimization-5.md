---
"title": "Mobile Performance: Battery Optimization through 8. Performance Testing"
"kind": "reference"
"impact": "high"
"tags":
  - "mobile-developer"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Android Performance Overview"
    "url": "https://developer.android.com/topic/performance"
---

# Mobile Performance: Battery Optimization through 8. Performance Testing

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 6. Battery Optimization

### Battery Drain Sources

| Source | Impact | Mitigation |
|--------|--------|------------|
| **Screen on** | ?? Highest | Dark mode on OLED |
| **GPS continuous** | ?? Very high | Use significant change |
| **Network requests** | ?? High | Batch, cache aggressively |
| **Animations** | ?? Medium | Reduce when low battery |
| **Background work** | ?? Medium | Defer non-critical |
| **CPU computation** | ?? Lower | Offload to backend |

### OLED Battery Saving

```
OLED screens: Black pixels = OFF = 0 power

Dark mode savings:
+-- True black (#000000) ? Maximum savings
+-- Dark gray (#1a1a1a) ? Slight savings
+-- Any color ? Some power
+-- White (#FFFFFF) ? Maximum power

RULE: On dark mode, use true black for backgrounds.
```

### Background Task Guidelines

```
iOS:
+-- Background refresh: Limited, system-scheduled
+-- Push notifications: Use for important updates
+-- Background modes: Location, audio, VoIP only
+-- Background tasks: Max ~30 seconds

Android:
+-- WorkManager: System-scheduled, battery-aware
+-- Foreground service: Visible to user, continuous
+-- JobScheduler: Batch network operations
+-- Doze mode: Respect it, batch operations
```

---

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 7. Network Performance

### Offline-First Architecture

```
                    +--------------+
                    |     UI       |
                    +--------------+
                           |
                    +------?-------+
                    |   Cache      | ? Read from cache FIRST
                    +--------------+
                           |
                    +------?-------+
                    |   Network    | ? Update cache from network
                    +--------------+

Benefits:
+-- Instant UI (no loading spinner for cached data)
+-- Works offline
+-- Reduces data usage
+-- Better UX on slow networks
```

### Request Optimization

```
BATCH: Combine multiple requests into one
+-- 10 small requests ? 1 batch request
+-- Reduces connection overhead
+-- Better for battery (radio on once)

CACHE: Don't re-fetch unchanged data
+-- ETag/If-None-Match headers
+-- Cache-Control headers
+-- Stale-while-revalidate pattern

COMPRESS: Reduce payload size
+-- gzip/brotli compression
+-- Request only needed fields (GraphQL)
+-- Paginate large lists
```

---

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 8. Performance Testing

### What to Test

| Metric | Target | Tool |
|--------|--------|------|
| **Frame rate** | = 60fps | Performance overlay |
| **Memory** | Stable, no growth | Profiler |
| **Cold start** | < 2s | Manual timing |
| **TTI (Time to Interactive)** | < 3s | Lighthouse |
| **List scroll** | No jank | Manual feel |
| **Animation smoothness** | No drops | Performance monitor |

### Test on Real Devices

```
?? NEVER trust only:
+-- Simulator/emulator (faster than real)
+-- Dev mode (slower than release)
+-- High-end devices only

? ALWAYS test on:
+-- Low-end Android (< $200 phone)
+-- Older iOS device (iPhone 8 or SE)
+-- Release/profile build
+-- With real data (not 10 items)
```

### Performance Monitoring Checklist

```markdown
## During Development
- [ ] Performance overlay enabled
- [ ] Watching for dropped frames
- [ ] Memory usage stable
- [ ] No console warnings about performance

## Before Release
- [ ] Tested on low-end device
- [ ] Profiled memory over extended use
- [ ] Cold start time measured
- [ ] List scroll tested with 1000+ items
- [ ] Animations tested at 60fps
- [ ] Network tested on slow 3G
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
