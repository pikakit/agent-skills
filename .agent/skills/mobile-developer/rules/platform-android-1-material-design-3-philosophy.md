---
"title": "Platform Android: Material Design 3 Philosophy through 3. Material Color System"
"kind": "reference"
"impact": "high"
"tags":
  - "mobile-developer"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Material Design 3 Mobile"
    "url": "https://developer.android.com/design/ui/mobile"
  - "title": "Jetpack Compose Documentation"
    "url": "https://developer.android.com/develop/ui/compose"
---

# Platform Android: Material Design 3 Philosophy through 3. Material Color System

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Material Design 3 essentials, Android design conventions, Roboto typography, and native patterns.
> **Read this file when building for Android devices.**

---

## 1. Material Design 3 Philosophy

### Core Material Principles

```
MATERIAL AS METAPHOR:
+-- Surfaces exist in 3D space
+-- Light and shadow define hierarchy
+-- Motion provides continuity
+-- Bold, graphic, intentional design

ADAPTIVE DESIGN:
+-- Responds to device capabilities
+-- One UI for all form factors
+-- Dynamic color from wallpaper
+-- Personalized per user

ACCESSIBLE BY DEFAULT:
+-- Large touch targets
+-- Clear visual hierarchy
+-- Semantic colors
+-- Motion respects preferences
```

### Material Design Values

| Value | Implementation |
|-------|----------------|
| **Dynamic Color** | Colors adapt to wallpaper/user preference |
| **Personalization** | User-specific themes |
| **Accessibility** | Built into every component |
| **Responsiveness** | Works on all screen sizes |
| **Consistency** | Unified design language |

---

> Material Design 3 essentials, Android design conventions, Roboto typography, and native patterns.
> **Read this file when building for Android devices.**

---

## 2. Android Typography

### Roboto Font Family

```
Android System Fonts:
+-- Roboto: Default sans-serif
+-- Roboto Flex: Variable font (API 33+)
+-- Roboto Serif: Serif alternative
+-- Roboto Mono: Monospace
+-- Google Sans: Google products (special license)
```

### Material Type Scale

| Role | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| **Display Large** | 57sp | Regular | 64sp | Hero text, splash |
| **Display Medium** | 45sp | Regular | 52sp | Large headers |
| **Display Small** | 36sp | Regular | 44sp | Medium headers |
| **Headline Large** | 32sp | Regular | 40sp | Page titles |
| **Headline Medium** | 28sp | Regular | 36sp | Section headers |
| **Headline Small** | 24sp | Regular | 32sp | Subsections |
| **Title Large** | 22sp | Regular | 28sp | Dialogs, cards |
| **Title Medium** | 16sp | Medium | 24sp | Lists, navigation |
| **Title Small** | 14sp | Medium | 20sp | Tabs, secondary |
| **Body Large** | 16sp | Regular | 24sp | Primary content |
| **Body Medium** | 14sp | Regular | 20sp | Secondary content |
| **Body Small** | 12sp | Regular | 16sp | Captions |
| **Label Large** | 14sp | Medium | 20sp | Buttons, FAB |
| **Label Medium** | 12sp | Medium | 16sp | Navigation |
| **Label Small** | 11sp | Medium | 16sp | Chips, badges |

### Scalable Pixels (sp)

```
sp = Scale-independent pixels

sp automatically scales with:
+-- User font size preference
+-- Display density
+-- Accessibility settings

RULE: ALWAYS use sp for text, dp for everything else.
```

### Font Weight Usage

| Weight | Use Case |
|--------|----------|
| Regular (400) | Body text, display |
| Medium (500) | Buttons, labels, emphasis |
| Bold (700) | Rarely, strong emphasis only |

---

> Material Design 3 essentials, Android design conventions, Roboto typography, and native patterns.
> **Read this file when building for Android devices.**

---

## 3. Material Color System

### Dynamic Color (Material You)

```
Android 12+ Dynamic Color:

User's wallpaper ? Color extraction ? App theme

Your app automatically adapts to:
+-- Primary color (from wallpaper)
+-- Secondary color (complementary)
+-- Tertiary color (accent)
+-- Surface colors (derived)
+-- All semantic colors adjust

RULE: Implement dynamic color for personalized feel.
```

### Semantic Color Roles

```
Surface Colors:
+-- Surface ? Main background
+-- SurfaceVariant ? Cards, containers
+-- SurfaceTint ? Elevation overlay
+-- InverseSurface ? Snackbars, tooltips

On-Surface Colors:
+-- OnSurface ? Primary text
+-- OnSurfaceVariant ? Secondary text
+-- Outline ? Borders, dividers
+-- OutlineVariant ? Subtle dividers

Primary Colors:
+-- Primary ? Key actions, FAB
+-- OnPrimary ? Text on primary
+-- PrimaryContainer ? Less emphasis
+-- OnPrimaryContainer ? Text on container

Secondary/Tertiary: Similar pattern
```

### Error, Warning, Success Colors

| Role | Light | Dark | Usage |
|------|-------|------|-------|
| Error | #B3261E | #F2B8B5 | Errors, destructive |
| OnError | #FFFFFF | #601410 | Text on error |
| ErrorContainer | #F9DEDC | #8C1D18 | Error backgrounds |

### Dark Theme

```
Material Dark Theme:

+-- Background: #121212 (not pure black by default)
+-- Surface: #1E1E1E, #232323, etc. (elevation)
+-- Elevation: Higher = lighter overlay
+-- Reduce saturation on colors
+-- Check contrast ratios

Elevation overlays (dark mode):
+-- 0dp ? 0% overlay
+-- 1dp ? 5% overlay
+-- 3dp ? 8% overlay
+-- 6dp ? 11% overlay
+-- 8dp ? 12% overlay
+-- 12dp ? 14% overlay
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
