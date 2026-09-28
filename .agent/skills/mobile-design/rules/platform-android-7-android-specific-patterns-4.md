---
"title": "Platform Android: Android-Specific Patterns through 8. Material Symbols"
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

# Platform Android: Android-Specific Patterns through 8. Material Symbols

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Material Design 3 essentials, Android design conventions, Roboto typography, and native patterns.
> **Read this file when building for Android devices.**

---

## 7. Android-Specific Patterns

### Snackbars

```
Position: Bottom, above navigation
Duration: 4-10 seconds
Action: One optional text action

┌─────────────────────────────────────────────────┐
│  Archived 1 item                    [ UNDO ]    │
└─────────────────────────────────────────────────┘

Rules:
├── Brief message, single line if possible
├── Max 2 lines
├── One action (text, not icon)
├── Can be dismissed by swipe
└── Don't stack, queue them
```

### Bottom Sheets

```
Types:
├── Standard: Interactive content
├── Modal: Blocks background (with scrim)

Modal Bottom Sheet:
┌─────────────────────────────────────┐
│                                     │
│        (Scrim over content)         │
│                                     │
├═════════════════════════════════════┤
│  ─────  (Drag handle, optional)     │
│                                     │
│        Sheet Content                │
│                                     │
│        Actions / Options            │
│                                     │
└─────────────────────────────────────┘

Corner radius: 28dp (top corners)
```

### Dialogs

```
Types:
├── Basic: Title + content + actions
├── Full-screen: Complex editing (mobile)
├── Date/Time picker
├── Confirmation dialog

┌─────────────────────────────────────┐
│              Title                  │
│                                     │
│       Supporting text that          │
│       explains the dialog           │
│                                     │
│           [ Cancel ]  [ Confirm ]   │
└─────────────────────────────────────┘

Rules:
├── Centered on screen
├── Scrim behind (dim background)
├── Max 2 actions aligned right
├── Destructive action can be on left
```

### Pull to Refresh

```
Android uses SwipeRefreshLayout pattern:

┌─────────────────────────────────────┐
│         ○ (Spinner)                 │ ← Circular progress
├─────────────────────────────────────┤
│                                     │
│         Content                     │
│                                     │
└─────────────────────────────────────┘

Spinner: Material circular indicator
Position: Top center, pulls down with content
```

### Ripple Effect

```
Every touchable element needs ripple:

Touch down → Ripple expands from touch point
Touch up → Ripple completes and fades

Color: 
├── On light: Black at ~12% opacity
├── On dark: White at ~12% opacity
├── On colored: Appropriate contrast

This is MANDATORY for Android feel.
```

---

> Material Design 3 essentials, Android design conventions, Roboto typography, and native patterns.
> **Read this file when building for Android devices.**

---

## 8. Material Symbols

### Usage Guidelines

```
Material Symbols: Google's icon library

Styles:
├── Outlined: Default, most common
├── Rounded: Softer, friendly
├── Sharp: Angular, precise

Variable font axes:
├── FILL: 0 (outline) to 1 (filled)
├── wght: 100-700 (weight)
├── GRAD: -25 to 200 (emphasis)
├── opsz: 20, 24, 40, 48 (optical size)
```

### Icon Sizes

| Size | Usage |
|------|-------|
| 20dp | Dense UI, inline |
| 24dp | Standard (most common) |
| 40dp | Larger touch targets |
| 48dp | Emphasis, standalone |

### States

```
Icon States:
├── Default: Full opacity
├── Disabled: 38% opacity
├── Hover/Focus: Container highlight
├── Selected: Filled variant + tint

Active vs Inactive:
├── Inactive: Outlined
├── Active: Filled + indicator
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
