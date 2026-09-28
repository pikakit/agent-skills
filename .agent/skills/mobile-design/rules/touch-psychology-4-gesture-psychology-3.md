---
"title": "Touch Psychology: Gesture Psychology through 5. Haptic Feedback Patterns"
"kind": "reference"
"impact": "high"
"tags":
  - "touch"
  - "psychology"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Official documentation"
    "url": "https://www.w3.org/WAI/standards-guidelines/wcag/"
---

# Touch Psychology: Gesture Psychology through 5. Haptic Feedback Patterns

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Deep dive into mobile touch interaction, Fitts' Law for touch, thumb zone anatomy, gesture psychology, and haptic feedback.
> **This is the mobile equivalent of ux-psychology.md - CRITICAL for all mobile work.**

---

## 4. Gesture Psychology

### Gesture Discoverability Problem

```
Problem: Gestures are INVISIBLE.
├── User must discover/remember them
├── No hover/visual hint
├── Different mental model than tap
└── Many users never discover gestures

Solution: Always provide visible alternative
├── Swipe to delete → Also show delete button or menu
├── Pull to refresh → Also show refresh button
├── Pinch to zoom → Also show zoom controls
└── Gestures as shortcuts, not only way
```

### Common Gesture Conventions

| Gesture | Universal Meaning | Usage |
|---------|-------------------|-------|
| **Tap** | Select, activate | Primary action |
| **Double tap** | Zoom in, like/favorite | Quick action |
| **Long press** | Context menu, selection mode | Secondary options |
| **Swipe horizontal** | Navigation, delete, actions | List actions |
| **Swipe down** | Refresh, dismiss | Pull to refresh |
| **Pinch** | Zoom in/out | Maps, images |
| **Two-finger scroll** | Scroll within scroll | Nested scrolls |

### Gesture Affordance Design

```
Swipe actions need visual hints:

┌─────────────────────────────────────────┐
│  ┌───┐                                  │
│  │ ≡ │  Item with hidden actions...   → │ ← Edge hint (partial color)
│  └───┘                                  │
└─────────────────────────────────────────┘

✅ Good: Slight color peek at edge suggesting swipe
✅ Good: Drag handle icon ( ≡ ) suggesting reorder
✅ Good: Onboarding tooltip explaining gesture
❌ Bad: Hidden gestures with no visual affordance
```

### Platform Gesture Differences

| Gesture | iOS | Android |
|---------|-----|---------|
| **Back** | Edge swipe from left | System back button/gesture |
| **Share** | Action sheet | Share sheet |
| **Context menu** | Long press / Force touch | Long press |
| **Dismiss modal** | Swipe down | Back button or swipe |
| **Delete in list** | Swipe left, tap delete | Swipe left, immediate or undo |

---

> Deep dive into mobile touch interaction, Fitts' Law for touch, thumb zone anatomy, gesture psychology, and haptic feedback.
> **This is the mobile equivalent of ux-psychology.md - CRITICAL for all mobile work.**

---

## 5. Haptic Feedback Patterns

### Why Haptics Matter

```
Haptics provide:
├── Confirmation without looking
├── Richer, more premium feel
├── Accessibility (blind users)
├── Reduced error rate
└── Emotional satisfaction

Without haptics:
├── Feels "cheap" or web-like
├── User unsure if action registered
└── Missed opportunity for delight
```

### iOS Haptic Types

| Type | Intensity | Use Case |
|------|-----------|----------|
| `selection` | Light | Picker scroll, toggle, selection |
| `light` | Light | Minor actions, hover equivalent |
| `medium` | Medium | Standard tap confirmation |
| `heavy` | Strong | Important completed, drop |
| `success` | Pattern | Task completed successfully |
| `warning` | Pattern | Warning, attention needed |
| `error` | Pattern | Error occurred |

### Android Haptic Types

| Type | Use Case |
|------|----------|
| `CLICK` | Standard tap feedback |
| `HEAVY_CLICK` | Important actions |
| `DOUBLE_CLICK` | Confirm actions |
| `TICK` | Scroll/scrub feedback |
| `LONG_PRESS` | Long press activation |
| `REJECT` | Error/invalid action |

### Haptic Usage Guidelines

```
✅ DO use haptics for:
├── Button taps
├── Toggle switches
├── Picker/slider values
├── Pull to refresh trigger
├── Successful action completion
├── Errors and warnings
├── Swipe action thresholds
└── Important state changes

❌ DON'T use haptics for:
├── Every scroll position
├── Every list item
├── Background events
├── Passive displays
└── Too frequently (haptic fatigue)
```

### Haptic Intensity Mapping

| Action Importance | Haptic Level | Example |
|-------------------|--------------|---------|
| Minor/Browsing | Light / None | Scrolling, hovering |
| Standard Action | Medium / Selection | Tap, toggle |
| Significant Action | Heavy / Success | Complete, confirm |
| Critical/Destructive | Heavy / Warning | Delete, payment |
| Error | Error pattern | Failed action |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
