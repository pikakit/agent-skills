---
"title": "Platform Ios: iOS Specific Patterns through 8. SF Symbols"
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

# Platform Ios: iOS Specific Patterns through 8. SF Symbols

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Human Interface Guidelines (HIG) essentials, iOS design conventions, SF Pro typography, and native patterns.
> **Read this file when building for iPhone/iPad.**

---

## 7. iOS Specific Patterns

### Pull to Refresh

```
Native UIRefreshControl behavior:
├── Pull beyond threshold → Spinner appears
├── Release → Refresh action triggered
├── Loading state → Spinner spins
├── Complete → Spinner disappears

RULE: Always use native UIRefreshControl (don't custom build).
```

### Swipe Actions

```
iOS swipe actions:

← Swipe Left (Destructive)      Swipe Right (Constructive) →
┌─────────────────────────────────────────────────────────────┐
│                    List Item Content                        │
└─────────────────────────────────────────────────────────────┘

Left swipe reveals: Archive, Delete, Flag
Right swipe reveals: Pin, Star, Mark as Read

Full swipe: Triggers first action
```

### Context Menus

```
Long press → Context menu appears

┌─────────────────────────────┐
│       Preview Card          │
├─────────────────────────────┤
│  📋 Copy                    │
│  📤 Share                   │
│  ➕ Add to...               │
├─────────────────────────────┤
│  🗑️ Delete          (Red)   │
└─────────────────────────────┘

Rules:
├── Preview: Show enlarged content
├── Actions: Related to content
├── Destructive: Last, in red
└── Max ~8 actions (scrollable if more)
```

### Sheets & Half-Sheets

```
iOS 15+ Sheets:

┌─────────────────────────────────────┐
│                                     │
│        Parent View (dimmed)          │
│                                     │
├─────────────────────────────────────┤
│  ═══  (Grabber)                     │ ← Drag to resize
│                                     │
│        Sheet Content                │
│                                     │
│                                     │
└─────────────────────────────────────┘

Detents:
├── .medium → Half screen
├── .large → Full screen (with safe area)
├── Custom → Specific height
```

---

> Human Interface Guidelines (HIG) essentials, iOS design conventions, SF Pro typography, and native patterns.
> **Read this file when building for iPhone/iPad.**

---

## 8. SF Symbols

### Usage Guidelines

```
SF Symbols: Apple's icon library (5000+ icons)

Weights: Match text weight
├── Ultralight / Thin / Light
├── Regular / Medium / Semibold
├── Bold / Heavy / Black

Scales:
├── .small → Inline with small text
├── .medium → Standard UI
├── .large → Emphasis, standalone
```

### Symbol Configurations

```swift
// SwiftUI
Image(systemName: "star.fill")
    .font(.title2)
    .foregroundStyle(.yellow)

// With rendering mode
Image(systemName: "heart.fill")
    .symbolRenderingMode(.multicolor)

// Animated (iOS 17+)
Image(systemName: "checkmark.circle")
    .symbolEffect(.bounce)
```

### Symbol Best Practices

| Guideline | Implementation |
|-----------|----------------|
| Match text weight | Symbol weight = font weight |
| Use standard symbols | Users recognize them |
| Multicolor when meaningful | Not just decoration |
| Fallback for older iOS | Check availability |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
