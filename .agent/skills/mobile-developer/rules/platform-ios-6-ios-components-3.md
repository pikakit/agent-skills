---
"title": "Platform Ios: iOS Components through 8. SF Symbols"
"kind": "reference"
"impact": "high"
"tags":
  - "mobile-developer"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Apple Human Interface Guidelines"
    "url": "https://developer.apple.com/design/human-interface-guidelines"
---

# Platform Ios: iOS Components through 8. SF Symbols

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

+------------------------------+
|         Tinted               | ? Primary action (filled)
+------------------------------|
|         Bordered             | ? Secondary action (outline)
+------------------------------|
|         Plain                | ? Tertiary action (text only)
+------------------------------+

Sizes:
+-- Mini: Tight spaces
+-- Small: Compact UI
+-- Medium: Inline actions
+-- Large: Primary CTAs (44pt minimum height)
```

### Lists & Tables

```
List Styles:

.plain         ? No separators, edge-to-edge
.insetGrouped  ? Rounded cards (default iOS 14+)
.grouped       ? Full-width sections
.sidebar       ? iPad sidebar navigation

Cell Accessories:
+-- Disclosure indicator (>) ? Navigates to detail
+-- Detail button (i) ? Shows info without navigation
+-- Checkmark (?) ? Selection
+-- Reorder (=) ? Drag to reorder
+-- Delete (-) ? Swipe/edit mode delete
```

### Text Fields

```
iOS Text Field Anatomy:

+-------------------------------------+
| ?? Search...                    ?  |
+-------------------------------------+
  ?                               ?
  Leading icon                   Clear button

Borders: Rounded rectangle
Height: 36pt minimum
Placeholder: Secondary text color
Clear button: Appears when has text
```

### Segmented Controls

```
When to Use:
+-- 2-5 related options
+-- Filter content
+-- Switch views

+-----------------------+
|  All  | Active| Done  |
+-----------------------+

Rules:
+-- Equal width segments
+-- Text or icons (not both mixed)
+-- Max 5 segments
+-- Consider tabs if more complex
```

---

> Human Interface Guidelines (HIG) essentials, iOS design conventions, SF Pro typography, and native patterns.
> **Read this file when building for iPhone/iPad.**

---

## 7. iOS Specific Patterns

### Pull to Refresh

```
Native UIRefreshControl behavior:
+-- Pull beyond threshold ? Spinner appears
+-- Release ? Refresh action triggered
+-- Loading state ? Spinner spins
+-- Complete ? Spinner disappears

RULE: Always use native UIRefreshControl (don't custom build).
```

### Swipe Actions

```
iOS swipe actions:

? Swipe Left (Destructive)      Swipe Right (Constructive) ?
+-------------------------------------------------------------+
|                    List Item Content                        |
+-------------------------------------------------------------+

Left swipe reveals: Archive, Delete, Flag
Right swipe reveals: Pin, Star, Mark as Read

Full swipe: Triggers first action
```

### Context Menus

```
Long press ? Context menu appears

+-----------------------------+
|       Preview Card          |
+-----------------------------+
|  ?? Copy                    |
|  ?? Share                   |
|  ? Add to...               |
+-----------------------------+
|  ??? Delete          (Red)   |
+-----------------------------+

Rules:
+-- Preview: Show enlarged content
+-- Actions: Related to content
+-- Destructive: Last, in red
+-- Max ~8 actions (scrollable if more)
```

### Sheets & Half-Sheets

```
iOS 15+ Sheets:

+-------------------------------------+
|                                     |
|        Parent View (dimmed)          |
|                                     |
+-------------------------------------+
|  ---  (Grabber)                     | ? Drag to resize
|                                     |
|        Sheet Content                |
|                                     |
|                                     |
+-------------------------------------+

Detents:
+-- .medium ? Half screen
+-- .large ? Full screen (with safe area)
+-- Custom ? Specific height
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
+-- Ultralight / Thin / Light
+-- Regular / Medium / Semibold
+-- Bold / Heavy / Black

Scales:
+-- .small ? Inline with small text
+-- .medium ? Standard UI
+-- .large ? Emphasis, standalone
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
