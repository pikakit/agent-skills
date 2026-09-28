---
"title": "Typography System: Responsive Typography Principles through 10. Typography Selection Checklist"
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

# Typography System: Responsive Typography Principles through 10. Typography Selection Checklist

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Typography principles and decision-making - learn to think, not memorize.
> **No fixed font names or sizes - understand the system.**

---

## 5. Responsive Typography Principles

### The Problem

```
Fixed sizes don't scale well:
├── Desktop size too big on mobile
├── Mobile size too small on desktop
└── Breakpoint jumps feel jarring
```

### Fluid Typography (clamp)

```css
/* Syntax: clamp(MIN, PREFERRED, MAX) */
font-size: clamp(
  MINIMUM_SIZE,
  FLUID_CALCULATION,
  MAXIMUM_SIZE
);

/* FLUID_CALCULATION typically: 
   base + viewport-relative-unit */
```

### Scaling Strategy

| Element | Scaling Behavior |
|---------|-----------------|
| Body text | Slight scaling (1rem → 1.125rem) |
| Subheadings | Moderate scaling |
| Headings | More dramatic scaling |
| Display text | Most dramatic scaling |

---

> Typography principles and decision-making - learn to think, not memorize.
> **No fixed font names or sizes - understand the system.**

---

## 6. Weight and Emphasis Principles

### Semantic Weight Usage

| Weight Range | Name | Use For |
|--------------|------|---------|
| 300-400 | Light/Normal | Body text, paragraphs |
| 500 | Medium | Subtle emphasis |
| 600 | Semibold | Subheadings, labels |
| 700 | Bold | Headings, strong emphasis |
| 800-900 | Heavy/Black | Display, hero text |

### Creating Contrast

```
Good contrast = skip at least 2 weight levels
├── 400 body + 700 heading = good
├── 400 body + 500 emphasis = subtle
├── 600 heading + 700 subheading = too similar
```

### Avoid

- ❌ Too many weights (max 3-4 per page)
- ❌ Adjacent weights for hierarchy (400/500)
- ❌ Heavy weights for long text

---

> Typography principles and decision-making - learn to think, not memorize.
> **No fixed font names or sizes - understand the system.**

---

## 7. Letter Spacing (Tracking)

### Principles

```
Large text (headings): tighter tracking
├── Letters are big, gaps feel larger
└── Slight negative tracking looks better

Small text (body): normal or slightly wider
├── Improves readability at small sizes
└── Never negative for body text

ALL CAPS: always wider tracking
├── Uppercase lacks ascenders/descenders
└── Needs more space to feel right
```

### Adjustment Guidelines

| Context | Tracking Adjustment |
|---------|---------------------|
| Display/Hero | -2% to -4% |
| Headings | -1% to -2% |
| Body text | 0% (normal) |
| Small text | +1% to +2% |
| ALL CAPS | +5% to +10% |

---

> Typography principles and decision-making - learn to think, not memorize.
> **No fixed font names or sizes - understand the system.**

---

## 8. Hierarchy Principles

### Visual Hierarchy Through Type

```
Ways to create hierarchy:
├── SIZE (most obvious)
├── WEIGHT (bold stands out)
├── COLOR (contrast levels)
├── SPACING (margins separate sections)
└── POSITION (top = important)
```

### Typical Hierarchy

| Level | Characteristics |
|-------|-----------------|
| Primary (H1) | Largest, boldest, most distinct |
| Secondary (H2) | Noticeably smaller but still bold |
| Tertiary (H3) | Medium size, may use weight only |
| Body | Standard size and weight |
| Caption/Meta | Smaller, often lighter color |

### Testing Hierarchy

Ask: "Can I tell what's most important at a glance?"

If squinting at the page, the hierarchy should still be clear.

---

> Typography principles and decision-making - learn to think, not memorize.
> **No fixed font names or sizes - understand the system.**

---

## 9. Readability Psychology

### F-Pattern Reading

```
Users scan in F-pattern:
├── Across the top (first line)
├── Down the left side
├── Across again (subheading)
└── Continue down left
```

**Implication**: Key info on left and in headings

### Chunking for Comprehension

- Short paragraphs (3-4 lines max)
- Clear subheadings
- Bullet points for lists
- White space between sections

### Cognitive Ease

- Familiar fonts = easier reading
- High contrast = less strain
- Consistent patterns = predictable

---

> Typography principles and decision-making - learn to think, not memorize.
> **No fixed font names or sizes - understand the system.**

---

## 10. Typography Selection Checklist

Before finalizing typography:

- [ ] **Asked user for font preferences?**
- [ ] **Considered brand/context?**
- [ ] **Selected appropriate scale ratio?**
- [ ] **Limited to 2-3 font families?**
- [ ] **Tested readability at all sizes?**
- [ ] **Checked line length (45-75ch)?**
- [ ] **Verified contrast for accessibility?**
- [ ] **Different from your last project?**

### Anti-Patterns

- ❌ Same fonts every project
- ❌ Too many font families
- ❌ Ignoring readability for style
- ❌ Fixed sizes without responsiveness
- ❌ Decorative fonts for body text

---

> **Remember**: Typography is about communication clarity. Choose based on content needs and audience, not personal preference.

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
