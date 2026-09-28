---
"title": "Mobile Typography: Mobile Typography Fundamentals through 3. Type Scale"
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

# Mobile Typography: Mobile Typography Fundamentals through 3. Type Scale

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Type scale, system fonts, Dynamic Type, accessibility, and dark mode typography.
> **Typography failures are the #1 cause of unreadable mobile apps.**

---

## 1. Mobile Typography Fundamentals

### Why Mobile Type is Different

```
DESKTOP:                        MOBILE:
├── 20-30" viewing distance     ├── 12-15" viewing distance
├── Large viewport              ├── Small viewport, narrow
├── Hover for details           ├── Tap/scroll for details
├── Controlled lighting         ├── Variable (outdoor, etc.)
├── Fixed font size             ├── User-controlled sizing
└── Long reading sessions       └── Quick scanning
```

### Mobile Type Rules

| Rule | Desktop | Mobile |
|------|---------|--------|
| **Minimum body size** | 14px | 16px (14pt/14sp) |
| **Maximum line length** | 75 characters | 40-60 characters |
| **Line height** | 1.4-1.5 | 1.4-1.6 (more generous) |
| **Font weight** | Varies | Regular dominant, bold sparingly |
| **Contrast** | AA (4.5:1) | AA minimum, AAA preferred |

---

> Type scale, system fonts, Dynamic Type, accessibility, and dark mode typography.
> **Typography failures are the #1 cause of unreadable mobile apps.**

---

## 2. System Fonts

### iOS: SF Pro Family

```
San Francisco (SF) Family:
├── SF Pro Display: Large text (≥ 20pt)
├── SF Pro Text: Body text (< 20pt)
├── SF Pro Rounded: Friendly contexts
├── SF Mono: Monospace
└── SF Compact: Apple Watch, compact UI

Features:
├── Optical sizing (auto-adjusts)
├── Dynamic tracking (spacing)
├── Tabular/proportional figures
├── Excellent legibility
```

### Android: Roboto Family

```
Roboto Family:
├── Roboto: Default sans-serif
├── Roboto Flex: Variable font
├── Roboto Serif: Serif option
├── Roboto Mono: Monospace
├── Roboto Condensed: Narrow spaces

Features:
├── Optimized for screens
├── Wide language support
├── Multiple weights
├── Good at small sizes
```

### When to Use System Fonts

```
✅ USE system fonts when:
├── Brand doesn't mandate custom font
├── Reading efficiency is priority
├── App feels native/integrated important
├── Performance is critical
├── Wide language support needed

❌ AVOID system fonts when:
├── Brand identity requires custom
├── Design differentiation needed
├── Editorial/magazine style
└── (But still support accessibility)
```

### Custom Font Considerations

```
If using custom fonts:
├── Include all weights needed
├── Subset for file size
├── Test at all Dynamic Type sizes
├── Provide fallback to system
├── Test rendering quality
└── Check language support
```

---

> Type scale, system fonts, Dynamic Type, accessibility, and dark mode typography.
> **Typography failures are the #1 cause of unreadable mobile apps.**

---

## 3. Type Scale

### iOS Type Scale (Built-in)

| Style | Size | Weight | Line Height |
|-------|------|--------|-------------|
| Large Title | 34pt | Bold | 41pt |
| Title 1 | 28pt | Bold | 34pt |
| Title 2 | 22pt | Bold | 28pt |
| Title 3 | 20pt | Semibold | 25pt |
| Headline | 17pt | Semibold | 22pt |
| Body | 17pt | Regular | 22pt |
| Callout | 16pt | Regular | 21pt |
| Subhead | 15pt | Regular | 20pt |
| Footnote | 13pt | Regular | 18pt |
| Caption 1 | 12pt | Regular | 16pt |
| Caption 2 | 11pt | Regular | 13pt |

### Android Type Scale (Material 3)

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Display Large | 57sp | 400 | 64sp |
| Display Medium | 45sp | 400 | 52sp |
| Display Small | 36sp | 400 | 44sp |
| Headline Large | 32sp | 400 | 40sp |
| Headline Medium | 28sp | 400 | 36sp |
| Headline Small | 24sp | 400 | 32sp |
| Title Large | 22sp | 400 | 28sp |
| Title Medium | 16sp | 500 | 24sp |
| Title Small | 14sp | 500 | 20sp |
| Body Large | 16sp | 400 | 24sp |
| Body Medium | 14sp | 400 | 20sp |
| Body Small | 12sp | 400 | 16sp |
| Label Large | 14sp | 500 | 20sp |
| Label Medium | 12sp | 500 | 16sp |
| Label Small | 11sp | 500 | 16sp |

### Creating Custom Scale

```
If creating custom scale, use modular ratio:

Recommended ratios:
├── 1.125 (Major second): Dense UI
├── 1.200 (Minor third): Compact
├── 1.250 (Major third): Balanced (common)
├── 1.333 (Perfect fourth): Spacious
└── 1.500 (Perfect fifth): Dramatic

Example with 1.25 ratio, 16px base:
├── xs: 10px (16 ÷ 1.25 ÷ 1.25)
├── sm: 13px (16 ÷ 1.25)
├── base: 16px
├── lg: 20px (16 × 1.25)
├── xl: 25px (16 × 1.25 × 1.25)
├── 2xl: 31px
├── 3xl: 39px
└── 4xl: 49px
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
