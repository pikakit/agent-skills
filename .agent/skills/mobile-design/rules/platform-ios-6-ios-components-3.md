---
"title": "Platform Ios: iOS Components"
"kind": "reference"
"impact": "high"
"tags":
  - "platform"
  - "ios"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Official documentation"
    "url": "https://www.w3.org/WAI/standards-guidelines/wcag/"
---

# Platform Ios: iOS Components

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Human Interface Guidelines (HIG) essentials, iOS design conventions, SF Pro typography, and native patterns.
> **Read this file when building for iPhone/iPad.**

---

## 6. iOS Components

### Buttons

```
Button Styles (UIKit/SwiftUI):

┌──────────────────────────────┐
│         Tinted               │ ← Primary action (filled)
├──────────────────────────────┤
│         Bordered             │ ← Secondary action (outline)
├──────────────────────────────┤
│         Plain                │ ← Tertiary action (text only)
└──────────────────────────────┘

Sizes:
├── Mini: Tight spaces
├── Small: Compact UI
├── Medium: Inline actions
├── Large: Primary CTAs (44pt minimum height)
```

### Lists & Tables

```
List Styles:

.plain         → No separators, edge-to-edge
.insetGrouped  → Rounded cards (default iOS 14+)
.grouped       → Full-width sections
.sidebar       → iPad sidebar navigation

Cell Accessories:
├── Disclosure indicator (>) → Navigates to detail
├── Detail button (i) → Shows info without navigation
├── Checkmark (✓) → Selection
├── Reorder (≡) → Drag to reorder
└── Delete (-) → Swipe/edit mode delete
```

### Text Fields

```
iOS Text Field Anatomy:

┌─────────────────────────────────────┐
│ 🔍 Search...                    ✕  │
└─────────────────────────────────────┘
  ↑                               ↑
  Leading icon                   Clear button

Borders: Rounded rectangle
Height: 36pt minimum
Placeholder: Secondary text color
Clear button: Appears when has text
```

### Segmented Controls

```
When to Use:
├── 2-5 related options
├── Filter content
├── Switch views

┌───────┬───────┬───────┐
│  All  │ Active│ Done  │
└───────┴───────┴───────┘

Rules:
├── Equal width segments
├── Text or icons (not both mixed)
├── Max 5 segments
└── Consider tabs if more complex
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
