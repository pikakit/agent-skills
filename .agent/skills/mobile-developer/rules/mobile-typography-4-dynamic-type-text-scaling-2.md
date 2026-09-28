---
"title": "Mobile Typography: Dynamic Type / Text Scaling through 7. Typography Anti-Patterns"
"kind": "reference"
"impact": "high"
"tags":
  - "mobile"
  - "typography"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Material Design 3 Typography"
    "url": "https://developer.android.com/design/ui/mobile/guides/styles/typography"
  - "title": "Apple HIG Typography"
    "url": "https://developer.apple.com/design/human-interface-guidelines/typography"
---

# Mobile Typography: Dynamic Type / Text Scaling through 7. Typography Anti-Patterns

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Type scale, system fonts, Dynamic Type, accessibility, and dark mode typography.
> **Typography failures are the #1 cause of unreadable mobile apps.**

---

## 4. Dynamic Type / Text Scaling

### iOS Dynamic Type (MANDATORY)

```swift
// ❌ WRONG: Fixed size (doesn't scale)
Text("Hello")
    .font(.system(size: 17))

// ✅ CORRECT: Dynamic Type
Text("Hello")
    .font(.body) // Scales with user setting

// Custom font with scaling
Text("Hello")
    .font(.custom("MyFont", size: 17, relativeTo: .body))
```

### Android Text Scaling (MANDATORY)

```
ALWAYS use sp for text:
├── sp = Scale-independent pixels
├── Scales with user font preference
├── dp does NOT scale (don't use for text)

User can scale from 85% to 200%:
├── Default (100%): 14sp = 14dp
├── Largest (200%): 14sp = 28dp

Test at 200%!
```

### Scaling Challenges

```
Problems at large text sizes:
├── Text overflows containers
├── Buttons become too tall
├── Icons look small relative to text
├── Layouts break

Solutions:
├── Use flexible containers (not fixed height)
├── Allow text wrapping
├── Scale icons with text
├── Test at extremes during development
├── Use scrollable containers for long text
```

---

> Type scale, system fonts, Dynamic Type, accessibility, and dark mode typography.
> **Typography failures are the #1 cause of unreadable mobile apps.**

---

## 5. Typography Accessibility

### Minimum Sizes

| Element | Minimum | Recommended |
|---------|---------|-------------|
| Body text | 14px/pt/sp | 16px/pt/sp |
| Secondary text | 12px/pt/sp | 13-14px/pt/sp |
| Captions | 11px/pt/sp | 12px/pt/sp |
| Buttons | 14px/pt/sp | 14-16px/pt/sp |
| **Nothing smaller** | 11px | - |

### Contrast Requirements (WCAG)

```
Normal text (< 18pt or < 14pt bold):
├── AA: 4.5:1 ratio minimum
├── AAA: 7:1 ratio recommended

Large text (≥ 18pt or ≥ 14pt bold):
├── AA: 3:1 ratio minimum
├── AAA: 4.5:1 ratio recommended

Logos/decorative: No requirement
```

### Line Height for Accessibility

```
WCAG Success Criterion 1.4.12:

Line height (line spacing): ≥ 1.5×
Paragraph spacing: ≥ 2× font size
Letter spacing: ≥ 0.12× font size
Word spacing: ≥ 0.16× font size

Mobile recommendation:
├── Body: 1.4-1.6 line height
├── Headings: 1.2-1.3 line height
├── Never below 1.2
```

---

> Type scale, system fonts, Dynamic Type, accessibility, and dark mode typography.
> **Typography failures are the #1 cause of unreadable mobile apps.**

---

## 6. Dark Mode Typography

### Color Adjustments

```
Light Mode:               Dark Mode:
├── Black text (#000)     ├── White/light gray (#E0E0E0)
├── High contrast         ├── Slightly reduced contrast
├── Full saturation       ├── Desaturated colors
└── Dark = emphasis       └── Light = emphasis

RULE: Don't use pure white (#FFF) on dark.
Use off-white (#E0E0E0 to #F0F0F0) to reduce eye strain.
```

### Dark Mode Hierarchy

| Level | Light Mode | Dark Mode |
|-------|------------|-----------|
| Primary text | #000000 | #E8E8E8 |
| Secondary text | #666666 | #A0A0A0 |
| Tertiary text | #999999 | #707070 |
| Disabled text | #CCCCCC | #505050 |

### Weight in Dark Mode

```
Dark mode text appears thinner due to halation
(light bleeding into dark background)

Consider:
├── Using medium weight for body (instead of regular)
├── Increasing letter-spacing slightly
├── Testing on actual OLED displays
└── Using slightly bolder weight than light mode
```

---

> Type scale, system fonts, Dynamic Type, accessibility, and dark mode typography.
> **Typography failures are the #1 cause of unreadable mobile apps.**

---

## 7. Typography Anti-Patterns

### ❌ Common Mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| **Fixed font sizes** | Ignores accessibility | Use dynamic sizing |
| **Too small text** | Unreadable | Min 14pt/sp |
| **Low contrast** | Invisible in sunlight | Min 4.5:1 |
| **Long lines** | Hard to track | Max 60 chars |
| **Tight line height** | Cramped, hard to read | Min 1.4× |
| **Too many sizes** | Visual chaos | Max 5-7 sizes |
| **All caps body** | Hard to read | Headlines only |
| **Light gray on white** | Impossible in bright light | Higher contrast |

### ❌ AI Typography Mistakes

```
AI tends to:
├── Use fixed px values instead of pt/sp
├── Skip Dynamic Type support
├── Use too small text (12-14px body)
├── Ignore line height settings
├── Use low contrast "aesthetic" grays
├── Apply same scale to mobile as desktop
└── Skip testing at large text sizes

RULE: Typography must SCALE.
Test at smallest and largest settings.
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
