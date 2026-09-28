---
"title": "Typography System: Modular Scale Principles through 4. Line Length Principles"
"kind": "reference"
"impact": "high"
"tags":
  - "typography"
  - "system"
"applies_to":
  - "web"
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Official documentation"
    "url": "https://www.w3.org/WAI/standards-guidelines/wcag/"
---

# Typography System: Modular Scale Principles through 4. Line Length Principles

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Typography principles and decision-making - learn to think, not memorize.
> **No fixed font names or sizes - understand the system.**

---

## 1. Modular Scale Principles

### What is a Modular Scale?

```
A mathematical relationship between font sizes:
├── Pick a BASE size (usually body text)
├── Pick a RATIO (multiplier)
└── Generate all sizes using: base × ratio^n
```

### Common Ratios and When to Use

| Ratio | Value | Feeling | Best For |
|-------|-------|---------|----------|
| Minor Second | 1.067 | Very subtle | Dense UI, small screens |
| Major Second | 1.125 | Subtle | Compact interfaces |
| Minor Third | 1.2 | Comfortable | Mobile apps, cards |
| Major Third | 1.25 | Balanced | General web (most common) |
| Perfect Fourth | 1.333 | Noticeable | Editorial, blogs |
| Perfect Fifth | 1.5 | Dramatic | Headlines, marketing |
| Golden Ratio | 1.618 | Maximum impact | Hero sections, display |

### Generate Your Scale

```
Given: base = YOUR_BASE_SIZE, ratio = YOUR_RATIO

Scale:
├── xs:  base ÷ ratio²
├── sm:  base ÷ ratio
├── base: YOUR_BASE_SIZE
├── lg:  base × ratio
├── xl:  base × ratio²
├── 2xl: base × ratio³
├── 3xl: base × ratio⁴
└── ... continue as needed
```

### Choosing Base Size

| Context | Base Size Range | Why |
|---------|-----------------|-----|
| Mobile-first | 16-18px | Readability on small screens |
| Desktop app | 14-16px | Information density |
| Editorial | 18-21px | Long-form reading comfort |
| Accessibility focus | 18px+ | Easier to read |

---

> Typography principles and decision-making - learn to think, not memorize.
> **No fixed font names or sizes - understand the system.**

---

## 2. Font Pairing Principles

### What Makes Fonts Work Together

```
Contrast + Harmony:
├── Different ENOUGH to create hierarchy
├── Similar ENOUGH to feel cohesive
└── Usually: serif + sans, or display + neutral
```

### Pairing Strategies

| Strategy | How | Result |
|----------|-----|--------|
| **Contrast** | Serif heading + Sans body | Classic, editorial feel |
| **Same Family** | One variable font, different weights | Cohesive, modern |
| **Same Designer** | Fonts by same foundry | Often harmonious proportions |
| **Era Match** | Fonts from same time period | Historical consistency |

### What to Look For

```
When pairing, compare:
├── x-height (height of lowercase letters)
├── Letter width (narrow vs wide)
├── Stroke contrast (thin/thick variation)
└── Overall mood (formal vs casual)
```

### Safe Pairing Patterns

| Heading Style | Body Style | Mood |
|---------------|------------|------|
| Geometric sans | Humanist sans | Modern, friendly |
| Display serif | Clean sans | Editorial, sophisticated |
| Neutral sans | Same sans | Minimal, tech |
| Bold geometric | Light geometric | Contemporary |

### Avoid

- ❌ Two decorative fonts together
- ❌ Similar fonts that conflict
- ❌ More than 2-3 font families
- ❌ Fonts with very different x-heights

---

> Typography principles and decision-making - learn to think, not memorize.
> **No fixed font names or sizes - understand the system.**

---

## 3. Line Height Principles

### The Relationship

```
Line height depends on:
├── Font size (larger text = less line height needed)
├── Line length (longer lines = more line height)
├── Font design (some fonts need more space)
└── Content type (headings vs body)
```

### Guidelines by Context

| Content Type | Line Height Range | Why |
|--------------|-------------------|-----|
| **Headings** | 1.1 - 1.3 | Short lines, want compact |
| **Body text** | 1.4 - 1.6 | Comfortable reading |
| **Long-form** | 1.6 - 1.8 | Maximum readability |
| **UI elements** | 1.2 - 1.4 | Space efficiency |

### Adjustment Factors

- **Longer line length** → Increase line height
- **Larger font size** → Decrease line height ratio
- **All caps** → May need more line height
- **Tight tracking** → May need more line height

---

> Typography principles and decision-making - learn to think, not memorize.
> **No fixed font names or sizes - understand the system.**

---

## 4. Line Length Principles

### Optimal Reading Width

```
The sweet spot: 45-75 characters per line
├── < 45: Too choppy, breaks flow
├── 45-75: Comfortable reading
├── > 75: Eye tracking strain
```

### How to Measure

```css
/* Character-based (recommended) */
max-width: 65ch; /* ch = width of "0" character */

/* This adapts to font size automatically */
```

### Context Adjustments

| Context | Character Range |
|---------|-----------------|
| Desktop article | 60-75 characters |
| Mobile | 35-50 characters |
| Sidebar text | 30-45 characters |
| Wide monitors | Still cap at ~75ch |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
