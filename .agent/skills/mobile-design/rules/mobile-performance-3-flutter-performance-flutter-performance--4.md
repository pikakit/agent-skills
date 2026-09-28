---
"title": "Mobile Performance: Flutter Performance - Flutter Performance Checklist through 5. Memory Management"
"kind": "reference"
"impact": "high"
"tags":
  - "mobile"
  - "performance"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Official documentation"
    "url": "https://www.w3.org/WAI/standards-guidelines/wcag/"
---

# Mobile Performance: Flutter Performance - Flutter Performance Checklist through 5. Memory Management

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 3. Flutter Performance

### Flutter Performance Checklist

```markdown
## Before Every Widget
- [ ] const constructor added (if no runtime args)
- [ ] const keywords on static children
- [ ] Minimal setState scope
- [ ] Using selectors for provider watches

## Before Every List
- [ ] Using ListView.builder (NOT ListView with children)
- [ ] itemExtent provided (if fixed height)
- [ ] Image caching with size limits

## Before Any Animation
- [ ] Using Impeller (Flutter 3.16+)
- [ ] Avoiding Opacity widget (use FadeTransition)
- [ ] TickerProviderStateMixin for AnimationController

## Before Any Release
- [ ] All dispose() methods implemented
- [ ] No print() in production
- [ ] Tested in profile/release mode
- [ ] DevTools performance overlay checked
```

---

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 4. Animation Performance (Both Platforms)

### The 60fps Imperative

```
Human eye detects:
├── < 24 fps → "Slideshow" (broken)
├── 24-30 fps → "Choppy" (uncomfortable)
├── 30-45 fps → "Noticeably not smooth"
├── 45-60 fps → "Smooth" (acceptable)
├── 60 fps → "Buttery" (target)
└── 120 fps → "Premium" (ProMotion devices)

NEVER ship < 60fps animations.
```

### GPU vs CPU Animation

```
GPU-ACCELERATED (FAST):          CPU-BOUND (SLOW):
├── transform: translate          ├── width, height
├── transform: scale              ├── top, left, right, bottom
├── transform: rotate             ├── margin, padding
├── opacity                       ├── border-radius (animated)
└── (Composited, off main)        └── box-shadow (animated)

RULE: Only animate transform and opacity.
Everything else causes layout recalculation.
```

### Animation Timing Guide

| Animation Type | Duration | Easing |
|----------------|----------|--------|
| Micro-interaction | 100-200ms | ease-out |
| Standard transition | 200-300ms | ease-out |
| Page transition | 300-400ms | ease-in-out |
| Complex/dramatic | 400-600ms | ease-in-out |
| Loading skeletons | 1000-1500ms | linear (loop) |

### Spring Physics

```javascript
// React Native Reanimated
withSpring(targetValue, {
  damping: 15,      // How quickly it settles (higher = faster stop)
  stiffness: 150,   // How "tight" the spring (higher = faster)
  mass: 1,          // Weight of the object
})

// Flutter
SpringSimulation(
  SpringDescription(
    mass: 1,
    stiffness: 150,
    damping: 15,
  ),
  start,
  end,
  velocity,
)

// Natural feel ranges:
// Damping: 10-20 (bouncy to settled)
// Stiffness: 100-200 (loose to tight)
// Mass: 0.5-2 (light to heavy)
```

---

> Deep dive into React Native and Flutter performance optimization, 60fps animations, memory management, and battery considerations.
> **This file covers the #1 area where AI-generated code FAILS.**

---

## 5. Memory Management

### Common Memory Leaks

| Source | Platform | Solution |
|--------|----------|----------|
| Timers | Both | Clear in cleanup/dispose |
| Event listeners | Both | Remove in cleanup/dispose |
| Subscriptions | Both | Cancel in cleanup/dispose |
| Large images | Both | Limit cache, resize |
| Async after unmount | RN | isMounted check or AbortController |
| Animation controllers | Flutter | Dispose controllers |

### Image Memory

```
Image memory = width × height × 4 bytes (RGBA)

1080p image = 1920 × 1080 × 4 = 8.3 MB
4K image = 3840 × 2160 × 4 = 33.2 MB

10 4K images = 332 MB → App crash!

RULE: Always resize images to display size (or 2-3x for retina).
```

### Memory Profiling

```
React Native:
├── Flipper → Memory tab
├── Xcode Instruments (iOS)
└── Android Studio Profiler

Flutter:
├── DevTools → Memory tab
├── Observatory
└── flutter run --profile
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
