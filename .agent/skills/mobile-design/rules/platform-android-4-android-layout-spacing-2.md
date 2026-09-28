---
"title": "Platform Android: Android Layout & Spacing through 5. Android Navigation Patterns"
"kind": "reference"
"impact": "high"
"tags":
  - "platform"
  - "android"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Official documentation"
    "url": "https://www.w3.org/WAI/standards-guidelines/wcag/"
---

# Platform Android: Android Layout & Spacing through 5. Android Navigation Patterns

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Material Design 3 essentials, Android design conventions, Roboto typography, and native patterns.
> **Read this file when building for Android devices.**

---

## 4. Android Layout & Spacing

### Layout Grid

```
Android uses 8dp baseline grid:

All spacing in multiples of 8dp:
├── 4dp: Component internal (half-step)
├── 8dp: Minimum spacing
├── 16dp: Standard spacing
├── 24dp: Section spacing
├── 32dp: Large spacing

Margins:
├── Compact (phone): 16dp
├── Medium (small tablet): 24dp
├── Expanded (large): 24dp+ or columns
```

### Responsive Layout

```
Window Size Classes:

COMPACT (< 600dp width):
├── Phones in portrait
├── Single column layout
├── Bottom navigation

MEDIUM (600-840dp width):
├── Tablets, foldables
├── Consider 2 columns
├── Navigation rail option

EXPANDED (> 840dp width):
├── Large tablets, desktop
├── Multi-column layouts
├── Navigation drawer
```

### Canonical Layouts

| Layout | Use Case | Window Class |
|--------|----------|--------------|
| **List-Detail** | Email, messages | Medium, Expanded |
| **Feed** | Social, news | All |
| **Supporting Pane** | Reference content | Medium, Expanded |

---

> Material Design 3 essentials, Android design conventions, Roboto typography, and native patterns.
> **Read this file when building for Android devices.**

---

## 5. Android Navigation Patterns

### Navigation Components

| Component | Use Case | Position |
|-----------|----------|----------|
| **Bottom Navigation** | 3-5 top-level destinations | Bottom |
| **Navigation Rail** | Tablets, foldables | Left side, vertical |
| **Navigation Drawer** | Many destinations, large screens | Left side, hidden/visible |
| **Top App Bar** | Current context, actions | Top |

### Bottom Navigation

```
┌─────────────────────────────────────┐
│                                     │
│         Content Area                │
│                                     │
├─────────────────────────────────────┤
│  🏠     🔍     ➕     ❤️     👤    │ ← 80dp height
│ Home   Search  FAB   Saved  Profile│
└─────────────────────────────────────┘

Rules:
├── 3-5 destinations
├── Icons: Material Symbols (24dp)
├── Labels: Always visible (accessibility)
├── Active: Filled icon + indicator pill
├── Badge: For notifications
├── FAB can integrate (optional)
```

### Top App Bar

```
Types:
├── Center-aligned: Logo apps, simple
├── Small: Compact, scrolls away
├── Medium: Title + actions, collapses
├── Large: Display title, collapses to small

┌─────────────────────────────────────┐
│  ☰   App Title              🔔 ⋮  │ ← 64dp (small)
├─────────────────────────────────────┤
│                                     │
│         Content Area                │
└─────────────────────────────────────┘

Actions: Max 3 icons, overflow menu ( ⋮ ) for more
```

### Navigation Rail (Tablets)

```
┌───────┬─────────────────────────────┐
│  ≡    │                             │
│       │                             │
│  🏠   │                             │
│ Home  │       Content Area          │
│       │                             │
│  🔍   │                             │
│Search │                             │
│       │                             │
│  👤   │                             │
│Profile│                             │
└───────┴─────────────────────────────┘

Width: 80dp
Icons: 24dp
Labels: Below icon
FAB: Can be at top
```

### Back Navigation

```
Android provides system back:
├── Back button (3-button nav)
├── Back gesture (swipe from edge)
├── Predictive back (Android 14+)

Your app must:
├── Handle back correctly (pop stack)
├── Support predictive back animation
├── Never hijack/override back unexpectedly
└── Confirm before discarding unsaved work
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
