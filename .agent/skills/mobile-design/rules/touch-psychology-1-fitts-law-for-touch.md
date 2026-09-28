---
"title": "Touch Psychology: Fitts' Law for Touch"
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

# Touch Psychology: Fitts' Law for Touch

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Deep dive into mobile touch interaction, Fitts' Law for touch, thumb zone anatomy, gesture psychology, and haptic feedback.
> **This is the mobile equivalent of ux-psychology.md - CRITICAL for all mobile work.**

---

## 1. Fitts' Law for Touch

### The Fundamental Difference

```
DESKTOP (Mouse/Trackpad):
├── Cursor size: 1 pixel (precision)
├── Visual feedback: Hover states
├── Error cost: Low (easy to retry)
└── Target acquisition: Fast, precise

MOBILE (Finger):
├── Contact area: ~7mm diameter (imprecise)
├── Visual feedback: No hover, only tap
├── Error cost: High (frustrating retries)
├── Occlusion: Finger covers the target
└── Target acquisition: Slower, needs larger targets
```

### Fitts' Law Formula Adapted

```
Touch acquisition time = a + b × log₂(1 + D/W)

Where:
├── D = Distance to target
├── W = Width of target
└── For touch: W must be MUCH larger than desktop
```

### Minimum Touch Target Sizes

| Platform | Minimum | Recommended | Use For |
|----------|---------|-------------|---------|
| **iOS (HIG)** | 44pt × 44pt | 48pt+ | All tappable elements |
| **Android (Material)** | 48dp × 48dp | 56dp+ | All tappable elements |
| **WCAG 2.2** | 44px × 44px | - | Accessibility compliance |
| **Critical Actions** | - | 56-64px | Primary CTAs, destructive actions |

### Visual Size vs Hit Area

```
┌─────────────────────────────────────┐
│                                     │
│    ┌─────────────────────────┐      │
│    │                         │      │
│    │    [  BUTTON  ]         │ ← Visual: 36px
│    │                         │      │
│    └─────────────────────────┘      │
│                                     │ ← Hit area: 48px (padding extends)
└─────────────────────────────────────┘

✅ CORRECT: Visual can be smaller if hit area is minimum 44-48px
❌ WRONG: Making hit area same as small visual element
```

### Application Rules

| Element | Visual Size | Hit Area |
|---------|-------------|----------|
| Icon buttons | 24-32px | 44-48px (padding) |
| Text links | Any | 44px height minimum |
| List items | Full width | 48-56px height |
| Checkboxes/Radio | 20-24px | 44-48px tap area |
| Close/X buttons | 24px | 44px minimum |
| Tab bar items | Icon 24-28px | Full tab width, 49px height (iOS) |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
