---
"title": "Platform Ios: iOS Layout & Spacing through 5. iOS Navigation Patterns"
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

# Platform Ios: iOS Layout & Spacing through 5. iOS Navigation Patterns

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Human Interface Guidelines (HIG) essentials, iOS design conventions, SF Pro typography, and native patterns.
> **Read this file when building for iPhone/iPad.**

---

## 4. iOS Layout & Spacing

### Safe Areas

```
+-------------------------------------+
------------ Status Bar ------------|| ? Top safe area inset
+-------------------------------------+
|                                     |
|                                     |
|         Safe Content Area           |
|                                     |
|                                     |
+-------------------------------------+
---------- Home Indicator ---------- ? Bottom safe area inset
+-------------------------------------+

RULE: Never place interactive content in unsafe areas.
```

### Standard Margins & Padding

| Element | Margin | Notes |
|---------|--------|-------|
| Screen edge ? content | 16pt | Standard horizontal margin |
| Grouped table sections | 16pt top/bottom | Breathing room |
| List item padding | 16pt horizontal | Standard cell padding |
| Card internal padding | 16pt | Content within cards |
| Button internal padding | 12pt vertical, 16pt horizontal | Minimum |

### iOS Grid System

```
iPhone Grid (Standard):
+-- 16pt margins (left/right)
+-- 8pt minimum spacing
+-- Content in 8pt multiples

iPhone Grid (Compact):
+-- 8pt margins (when needed)
+-- 4pt minimum spacing

iPad Grid:
+-- 20pt margins (or more)
+-- Consider multi-column layouts
```

---

> Human Interface Guidelines (HIG) essentials, iOS design conventions, SF Pro typography, and native patterns.
> **Read this file when building for iPhone/iPad.**

---

## 5. iOS Navigation Patterns

### Navigation Types

| Pattern | Use Case | Implementation |
|---------|----------|----------------|
| **Tab Bar** | 3-5 top-level sections | Bottom, always visible |
| **Navigation Controller** | Hierarchical drill-down | Stack-based, back button |
| **Modal** | Focused task, interruption | Sheet or full-screen |
| **Sidebar** | iPad, multi-column | Left sidebar (iPad) |

### Tab Bar Guidelines

```
+-------------------------------------+
|                                     |
|         Content Area                |
|                                     |
+-------------------------------------+
|  ??     ??     ?     d?     ??    | ? Tab bar (49pt height)
| Home   Search  New   Saved  Profile |
+-------------------------------------+

Rules:
+-- 3-5 items maximum
+-- Icons: SF Symbols or custom (25 × 25pt)
+-- Labels: Always include (accessibility)
+-- Active state: Filled icon + tint color
+-- Tab bar always visible (don't hide on scroll)
```

### Navigation Bar Guidelines

```
+-------------------------------------+
| < Back     Page Title      Edit    | ? Navigation bar (44pt)
+-------------------------------------+
|                                     |
|         Content Area                |
|                                     |
+-------------------------------------+

Rules:
+-- Back button: System chevron + previous title (or "Back")
+-- Title: Centered, dynamic font
+-- Right actions: Max 2 items
+-- Large title: Collapses on scroll (optional)
+-- Prefer text buttons over icons (clarity)
```

### Modal Presentations

| Style | Use Case | Appearance |
|-------|----------|------------|
| **Sheet (default)** | Secondary tasks | Card slides up, parent visible |
| **Full Screen** | Immersive tasks | Covers entire screen |
| **Popover** | iPad, quick info | Arrow-pointed bubble |
| **Alert** | Critical interruption | Centered dialog |
| **Action Sheet** | Choices from context | Bottom sheet with options |

### Gestures

| Gesture | iOS Convention |
|---------|----------------|
| **Edge swipe (left)** | Navigate back |
| **Pull down (sheet)** | Dismiss modal |
| **Long press** | Context menu |
| **Deep press** | Peek/Pop (legacy) |
| **Two-finger swipe** | Scroll in nested scroll |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
