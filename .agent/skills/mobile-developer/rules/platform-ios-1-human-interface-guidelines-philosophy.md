---
"title": "Platform Ios: Human Interface Guidelines Philosophy through 3. iOS Color System"
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

# Platform Ios: Human Interface Guidelines Philosophy through 3. iOS Color System

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Human Interface Guidelines (HIG) essentials, iOS design conventions, SF Pro typography, and native patterns.
> **Read this file when building for iPhone/iPad.**

---

## 1. Human Interface Guidelines Philosophy

### Core Apple Design Principles

```
CLARITY:
+-- Text is legible at every size
+-- Icons are precise and lucid
+-- Adornments are subtle and appropriate
+-- Focus on functionality drives design

DEFERENCE:
+-- UI helps people understand and interact
+-- Content fills the screen
+-- UI never competes with content
+-- Translucency hints at more content

DEPTH:
+-- Distinct visual layers convey hierarchy
+-- Transitions provide sense of depth
+-- Touch reveals functionality
+-- Content is elevated over UI
```

### iOS Design Values

| Value | Implementation |
|-------|----------------|
| **Aesthetic Integrity** | Design matches function (game ? productivity) |
| **Consistency** | Use system controls, familiar patterns |
| **Direct Manipulation** | Touch directly affects content |
| **Feedback** | Actions are acknowledged |
| **Metaphors** | Real-world comparisons aid understanding |
| **User Control** | User initiates actions, can cancel |

---

> Human Interface Guidelines (HIG) essentials, iOS design conventions, SF Pro typography, and native patterns.
> **Read this file when building for iPhone/iPad.**

---

## 2. iOS Typography

### SF Pro Font Family

```
iOS System Fonts:
+-- SF Pro Text: Body text (< 20pt)
+-- SF Pro Display: Large titles (= 20pt)
+-- SF Pro Rounded: Friendly contexts
+-- SF Mono: Code, tabular data
+-- SF Compact: Apple Watch, smaller screens
```

### iOS Type Scale (Dynamic Type)

| Style | Default Size | Weight | Usage |
|-------|--------------|--------|-------|
| **Large Title** | 34pt | Bold | Navigation bar (scroll collapse) |
| **Title 1** | 28pt | Bold | Page titles |
| **Title 2** | 22pt | Bold | Section headers |
| **Title 3** | 20pt | Semibold | Subsection headers |
| **Headline** | 17pt | Semibold | Emphasized body |
| **Body** | 17pt | Regular | Primary content |
| **Callout** | 16pt | Regular | Secondary content |
| **Subhead** | 15pt | Regular | Tertiary content |
| **Footnote** | 13pt | Regular | Caption, timestamps |
| **Caption 1** | 12pt | Regular | Annotations |
| **Caption 2** | 11pt | Regular | Fine print |

### Dynamic Type Support (MANDATORY)

```swift
// ? WRONG: Fixed font size
Text("Hello")
    .font(.system(size: 17))

// ? CORRECT: Dynamic Type
Text("Hello")
    .font(.body) // Scales with user settings

// React Native equivalent
<Text style={{ fontSize: 17 }}> // ? Fixed
<Text style={styles.body}> // Use a dynamic scale system
```

### Font Weight Usage

| Weight | iOS Constant | Use Case |
|--------|--------------|----------|
| Regular (400) | `.regular` | Body text |
| Medium (500) | `.medium` | Buttons, emphasis |
| Semibold (600) | `.semibold` | Subheadings |
| Bold (700) | `.bold` | Titles, key info |
| Heavy (800) | `.heavy` | Rarely, marketing |

---

> Human Interface Guidelines (HIG) essentials, iOS design conventions, SF Pro typography, and native patterns.
> **Read this file when building for iPhone/iPad.**

---

## 3. iOS Color System

### System Colors (Semantic)

```
Use semantic colors for automatic dark mode:

Primary:
+-- .label ? Primary text
+-- .secondaryLabel ? Secondary text
+-- .tertiaryLabel ? Tertiary text
+-- .quaternaryLabel ? Watermarks

Backgrounds:
+-- .systemBackground ? Main background
+-- .secondarySystemBackground ? Grouped content
+-- .tertiarySystemBackground ? Elevated content

Fills:
+-- .systemFill ? Large shapes
+-- .secondarySystemFill ? Medium shapes
+-- .tertiarySystemFill ? Small shapes
+-- .quaternarySystemFill ? Subtle shapes
```

### System Accent Colors

| Color | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| Blue | #007AFF | #0A84FF | Links, highlights, default tint |
| Green | #34C759 | #30D158 | Success, positive |
| Red | #FF3B30 | #FF453A | Errors, destructive |
| Orange | #FF9500 | #FF9F0A | Warnings |
| Yellow | #FFCC00 | #FFD60A | Attention |
| Purple | #AF52DE | #BF5AF2 | Special features |
| Pink | #FF2D55 | #FF375F | Affection, favorites |
| Teal | #5AC8FA | #64D2FF | Information |

### Dark Mode Considerations

```
iOS Dark Mode is not inverted light mode:

LIGHT MODE:              DARK MODE:
+-- White backgrounds    +-- True black (#000) or near-black
+-- High saturation      +-- Desaturated colors
+-- Black text           +-- White/light gray text
+-- Drop shadows         +-- Glows or no shadows

RULE: Always use semantic colors for automatic adaptation.
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
