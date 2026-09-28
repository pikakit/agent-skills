---
"title": "Color System: Color Theory Fundamentals through 3. Color Psychology - Meaning & Selection"
"kind": "reference"
"impact": "high"
"tags":
  - "color"
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

# Color System: Color Theory Fundamentals through 3. Color Psychology - Meaning & Selection

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Color theory principles, selection process, and decision-making guidelines.
> **No memorized hex codes - learn to THINK about color.**

---

## 1. Color Theory Fundamentals

### The Color Wheel

```
                    YELLOW
                      │
           Yellow-    │    Yellow-
           Green      │    Orange
              ╲       │       ╱
               ╲      │      ╱
    GREEN ─────────── ● ─────────── ORANGE
               ╱      │      ╲
              ╱       │       ╲
           Blue-      │    Red-
           Green      │    Orange
                      │
                     RED
                      │
                   PURPLE
                  ╱       ╲
             Blue-         Red-
             Purple        Purple
                  ╲       ╱
                    BLUE
```

### Color Relationships

| Scheme | How to Create | When to Use |
|--------|---------------|-------------|
| **Monochromatic** | Pick ONE hue, vary only lightness/saturation | Minimal, professional, cohesive |
| **Analogous** | Pick 2-3 ADJACENT hues on wheel | Harmonious, calm, nature-inspired |
| **Complementary** | Pick OPPOSITE hues on wheel | High contrast, vibrant, attention |
| **Split-Complementary** | Base + 2 colors adjacent to complement | Dynamic but balanced |
| **Triadic** | 3 hues EQUIDISTANT on wheel | Vibrant, playful, creative |

### How to Choose a Scheme:
1. **What's the project mood?** Calm → Analogous. Bold → Complementary.
2. **How many colors needed?** Minimal → Monochromatic. Complex → Triadic.
3. **Who's the audience?** Conservative → Monochromatic. Young → Triadic.

---

> Color theory principles, selection process, and decision-making guidelines.
> **No memorized hex codes - learn to THINK about color.**

---

## 2. The 60-30-10 Rule

### Distribution Principle
```
┌─────────────────────────────────────────────────┐
│                                                 │
│     60% PRIMARY (Background, large areas)       │
│     → Should be neutral or calming              │
│     → Carries the overall tone                  │
│                                                 │
├────────────────────────────────────┬────────────┤
│                                    │            │
│   30% SECONDARY                    │ 10% ACCENT │
│   (Cards, sections, headers)       │ (CTAs,     │
│   → Supports without dominating    │ highlights)│
│                                    │ → Draws    │
│                                    │   attention│
└────────────────────────────────────┴────────────┘
```

### Implementation Pattern
```css
:root {
  /* 60% - Pick based on light/dark mode and mood */
  --color-bg: /* neutral: white, off-white, or dark gray */
  --color-surface: /* slightly different from bg */
  
  /* 30% - Pick based on brand or context */
  --color-secondary: /* muted version of primary or neutral */
  
  /* 10% - Pick based on desired action/emotion */
  --color-accent: /* vibrant, attention-grabbing */
}
```

---

> Color theory principles, selection process, and decision-making guidelines.
> **No memorized hex codes - learn to THINK about color.**

---

## 3. Color Psychology - Meaning & Selection

### How to Choose Based on Context

| If Project Is... | Consider These Hues | Why |
|------------------|---------------------|-----|
| **Finance, Tech, Healthcare** | Blues, Teals | Trust, stability, calm |
| **Eco, Wellness, Nature** | Greens, Earth tones | Growth, health, organic |
| **Food, Energy, Youth** | Orange, Yellow, Warm | Appetite, excitement, warmth |
| **Luxury, Beauty, Creative** | Deep Teal, Gold, Black | Sophistication, premium |
| **Urgency, Sales, Alerts** | Red, Orange | Action, attention, passion |

### Emotional Associations (For Decision Making)

| Hue Family | Positive Associations | Cautions |
|------------|----------------------|----------|
| **Blue** | Trust, calm, professional | Can feel cold, corporate |
| **Green** | Growth, nature, success | Can feel boring if overused |
| **Red** | Passion, urgency, energy | High arousal, use sparingly |
| **Orange** | Warmth, friendly, creative | Can feel cheap if saturated |
| **Purple** | ⚠️ **BANNED** - AI overuses this! | Use Deep Teal/Maroon/Emerald instead |
| **Yellow** | Optimism, attention, happy | Hard to read, use as accent |
| **Black** | Elegance, power, modern | Can feel heavy |
| **White** | Clean, minimal, open | Can feel sterile |

### Selection Process:
1. **What industry?** → Narrow to 2-3 hue families
2. **What emotion?** → Pick primary hue
3. **What contrast?** → Decide light vs dark mode
4. **ASK USER** → Confirm before proceeding

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
