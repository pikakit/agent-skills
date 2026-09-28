# Design System Full Agent Rules

> Deterministic compilation of 30 source rules for design-system v4.0.0. Do not edit directly.

## Rule Index

- [Animation Guide: Duration Principles through 5. Page Transitions Principles](#rule-animation-guide-1-duration-principles) (high, process, source: `rules/animation-guide-1-duration-principles.md`)
- [Animation Guide: Scroll Animation Principles through Related](#rule-animation-guide-6-scroll-animation-principles-2) (high, process, source: `rules/animation-guide-6-scroll-animation-principles-2.md`)
- [Color System: Color Theory Fundamentals through 3. Color Psychology - Meaning & Selection](#rule-color-system-1-color-theory-fundamentals) (high, reference, source: `rules/color-system-1-color-theory-fundamentals.md`)
- [Color System: Palette Generation Principles through 8. Color Selection Checklist](#rule-color-system-4-palette-generation-principles-2) (high, reference, source: `rules/color-system-4-palette-generation-principles-2.md`)
- [Color System: Anti-Patterns to Avoid through Related](#rule-color-system-9-anti-patterns-to-avoid-3) (high, reference, source: `rules/color-system-9-anti-patterns-to-avoid-3.md`)
- [Dominant colors with sharp accents outperform timid, evenly-distributed palettes.](#rule-color-systems) (standard, reference, source: `rules/color-systems.md`)
- [Decision Trees: Color Selection Decision Tree through 4. Typography Decision Tree](#rule-decision-trees-3-color-selection-decision-tree-2) (high, decision, source: `rules/decision-trees-3-color-selection-decision-tree-2.md`)
- [Decision Trees: E-commerce Guidelines {#e-commerce} through 6. SaaS Dashboard Guidelines {#saas}](#rule-decision-trees-5-e-commerce-guidelines-e-commerce-3) (high, decision, source: `rules/decision-trees-5-e-commerce-guidelines-e-commerce-3.md`)
- [Decision Trees: Landing Page Guidelines {#landing-page}](#rule-decision-trees-7-landing-page-guidelines-landing-page-4) (high, decision, source: `rules/decision-trees-7-landing-page-guidelines-landing-page-4.md`)
- [Decision Trees: Portfolio Guidelines {#portfolio} through Related](#rule-decision-trees-8-portfolio-guidelines-portfolio-5) (high, decision, source: `rules/decision-trees-8-portfolio-guidelines-portfolio-5.md`)
- [Decision Trees: How to Use This File through 2. Audience Decision Tree](#rule-decision-trees-how-to-use-this-file) (high, decision, source: `rules/decision-trees-how-to-use-this-file.md`)
- [Design Extraction from Screenshots](#rule-design-extraction) (standard, reference, source: `rules/design-extraction.md`)
- [One orchestrated animation > many scattered micro-interactions.](#rule-motion-design) (standard, reference, source: `rules/motion-design.md`)
- [Motion Graphics: Lottie Animations through 4. 3D CSS Transforms](#rule-motion-graphics-1-lottie-animations) (high, reference, source: `rules/motion-graphics-1-lottie-animations.md`)
- [Motion Graphics: Particle Effects through 10. Quick Reference](#rule-motion-graphics-5-particle-effects-2) (high, reference, source: `rules/motion-graphics-5-particle-effects-2.md`)
- [Motion Graphics: Related](#rule-motion-graphics-related-3) (high, reference, source: `rules/motion-graphics-related-3.md`)
- [Production verification gates](#rule-production-gates) (high, process, source: `rules/production-gates.md`)
- [Break the grid. Create unexpected layouts.](#rule-spatial-composition) (standard, reference, source: `rules/spatial-composition.md`)
- [Typography System: Modular Scale Principles through 4. Line Length Principles](#rule-typography-system-1-modular-scale-principles) (high, reference, source: `rules/typography-system-1-modular-scale-principles.md`)
- [Typography System: Responsive Typography Principles through 10. Typography Selection Checklist](#rule-typography-system-5-responsive-typography-principles-2) (high, reference, source: `rules/typography-system-5-responsive-typography-principles-2.md`)
- [Typography System: Related](#rule-typography-system-related-3) (high, reference, source: `rules/typography-system-related-3.md`)
- [Typography for Distinctive Design](#rule-typography) (standard, reference, source: `rules/typography.md`)
- [Ux Psychology: Core UX Laws](#rule-ux-psychology-1-core-ux-laws) (high, reference, source: `rules/ux-psychology-1-core-ux-laws.md`)
- [Ux Psychology: Emotional Design (Don Norman)](#rule-ux-psychology-2-emotional-design-don-norman-2) (high, reference, source: `rules/ux-psychology-2-emotional-design-don-norman-2.md`)
- [Ux Psychology: Trust Building System through 4. Cognitive Load Management](#rule-ux-psychology-3-trust-building-system-3) (high, reference, source: `rules/ux-psychology-3-trust-building-system-3.md`)
- [Ux Psychology: Persuasive Design (Ethical) through 7. Emotion Color Mapping](#rule-ux-psychology-5-persuasive-design-ethical-4) (high, reference, source: `rules/ux-psychology-5-persuasive-design-ethical-4.md`)
- [Ux Psychology: Psychology Checklist through Related](#rule-ux-psychology-8-psychology-checklist-5) (high, reference, source: `rules/ux-psychology-8-psychology-checklist-5.md`)
- [Visual Effects: Glassmorphism Principles through 4. Gradient Principles](#rule-visual-effects-1-glassmorphism-principles) (high, reference, source: `rules/visual-effects-1-glassmorphism-principles.md`)
- [Visual Effects: Border Effects Principles through 10. Effect Selection Checklist](#rule-visual-effects-5-border-effects-principles-2) (high, reference, source: `rules/visual-effects-5-border-effects-principles-2.md`)
- [Visual Effects: Related](#rule-visual-effects-related-3) (high, reference, source: `rules/visual-effects-related-3.md`)

<a id="rule-animation-guide-1-duration-principles"></a>

## Animation Guide: Duration Principles through 5. Page Transitions Principles

**Impact:** high
**Kind:** process
**Source:** `rules/animation-guide-1-duration-principles.md`

# Animation Guide: Duration Principles through 5. Page Transitions Principles

## Preconditions

Capture the baseline, target environment, acceptance criteria, and rollback point.

## Procedure

> Animation principles and timing psychology - learn to decide, not copy.
> **No fixed durations to memorize - understand what affects timing.**

---

## 1. Duration Principles

### What Affects Timing

```
Factors that determine animation speed:
├── DISTANCE: Further travel = longer duration
├── SIZE: Larger elements = slower animations
├── COMPLEXITY: Complex = slower to process
├── IMPORTANCE: Critical actions = clear feedback
└── CONTEXT: Urgent = fast, luxurious = slow
```

### Duration Ranges by Purpose

| Purpose | Range | Why |
|---------|-------|-----|
| Instant feedback | 50-100ms | Below perception threshold |
| Micro-interactions | 100-200ms | Quick but noticeable |
| Standard transitions | 200-300ms | Comfortable pace |
| Complex animations | 300-500ms | Time to follow |
| Page transitions | 400-600ms | Smooth handoff |
| **Wow/Premium Effects** | 800ms+ | Dramatic, organic spring-based, layered |

### Choosing Duration

Ask yourself:
1. How far is the element moving?
2. How important is it to notice this change?
3. Is the user waiting, or is this background?

---

> Animation principles and timing psychology - learn to decide, not copy.
> **No fixed durations to memorize - understand what affects timing.**

---

## 2. Easing Principles

### What Easing Does

```
Easing = how speed changes over time
├── Linear: constant speed (mechanical, robotic)
├── Ease-out: fast start, slow end (natural entry)
├── Ease-in: slow start, fast end (natural exit)
└── Ease-in-out: slow both ends (smooth, deliberate)
```

### When to Use Each

| Easing | Best For | Feels Like |
|--------|----------|------------|
| **Ease-out** | Elements entering | Arriving, settling |
| **Ease-in** | Elements leaving | Departing, exiting |
| **Ease-in-out** | Emphasis, loops | Deliberate, smooth |
| **Linear** | Continuous motion | Mechanical, constant |
| **Bounce/Elastic** | Playful UI | Fun, energetic |

### The Pattern

```css
/* Entering view = ease-out (decelerate) */
.enter {
  animation-timing-function: ease-out;
}

/* Leaving view = ease-in (accelerate) */
.exit {
  animation-timing-function: ease-in;
}

/* Continuous = ease-in-out */
.continuous {
  animation-timing-function: ease-in-out;
}
```

---

> Animation principles and timing psychology - learn to decide, not copy.
> **No fixed durations to memorize - understand what affects timing.**

---

## 3. Micro-Interaction Principles

### What Makes Good Micro-Interactions

```
Purpose of micro-interactions:
├── FEEDBACK: Confirm the action happened
├── GUIDANCE: Show what's possible
├── STATUS: Indicate current state
└── DELIGHT: Small moments of joy
```

### Button States

```
Hover → slight visual change (lift, color, scale)
Active → pressed feeling (scale down, shadow change)
Focus → clear indicator (outline, ring)
Loading → progress indicator (spinner, skeleton)
Success → confirmation (check, color)
```

### Principles

1. **Respond immediately** (under 100ms perception)
2. **Match the action** (press = `scale(0.95)`, hover = `translateY(-4px) + glow`)
3. **Be bold but smooth** (Usta işi hissettir)
4. **Be consistent** (same actions = same feedback)

---

> Animation principles and timing psychology - learn to decide, not copy.
> **No fixed durations to memorize - understand what affects timing.**

---

## 4. Loading States Principles

### Types by Context

| Situation | Approach |
|-----------|----------|
| Quick load (<1s) | No indicator needed |
| Medium (1-3s) | Spinner or simple animation |
| Long (3s+) | Progress bar or skeleton |
| Unknown duration | Indeterminate indicator |

### Skeleton Screens

```
Purpose: Reduce perceived wait time
├── Show layout shape immediately
├── Animate subtly (shimmer, pulse)
├── Replace with content when ready
└── Feels faster than spinner
```

### Progress Indicators

```
When to show progress:
├── User-initiated action
├── File uploads/downloads
├── Multi-step processes
└── Long operations

When NOT needed:
├── Very quick operations
├── Background tasks
└── Initial page loads (skeleton better)
```

---

> Animation principles and timing psychology - learn to decide, not copy.
> **No fixed durations to memorize - understand what affects timing.**

---

## 5. Page Transitions Principles

### Transition Strategy

```
Simple rule: exit fast, enter slower
├── Outgoing content fades quickly
├── Incoming content animates in
└── Avoids "everything moving at once"
```

### Common Patterns

| Pattern | When to Use |
|---------|-------------|
| **Fade** | Safe default, works everywhere |
| **Slide** | Sequential navigation (prev/next) |
| **Scale** | Opening/closing modals |
| **Shared element** | Maintaining visual continuity |

### Direction Matching

```
Navigation direction = animation direction
├── Forward → slide from right
├── Backward → slide from left
├── Deeper → scale up from center
├── Back up → scale down
```

---

## Rollback

Restore the baseline if required tooling errors or the procedure introduces a regression.

## Exit Gate

Require fresh evidence for the intended behavior and all applicable project checks.

<a id="rule-animation-guide-6-scroll-animation-principles-2"></a>

## Animation Guide: Scroll Animation Principles through Related

**Impact:** high
**Kind:** process
**Source:** `rules/animation-guide-6-scroll-animation-principles-2.md`

# Animation Guide: Scroll Animation Principles through Related

## Preconditions

Capture the baseline, target environment, acceptance criteria, and rollback point.

## Procedure

> Animation principles and timing psychology - learn to decide, not copy.
> **No fixed durations to memorize - understand what affects timing.**

---

## 6. Scroll Animation Principles

### Progressive Reveal

```
Content appears as user scrolls:
├── Reduces initial cognitive load
├── Rewards exploration
├── Must not feel sluggish
└── Option to disable (accessibility)
```

### Trigger Points

| When to Trigger | Effect |
|-----------------|--------|
| Just entering viewport | Standard reveal |
| Centered in viewport | For emphasis |
| Partially visible | Earlier reveal |
| Fully visible | Late trigger |

### Animation Properties

- Fade in (opacity)
- Slide up (transform)
- Scale (transform)
- Combination of above

### Performance

- Use Intersection Observer
- Animate only transform/opacity
- Reduce on mobile if needed

---

> Animation principles and timing psychology - learn to decide, not copy.
> **No fixed durations to memorize - understand what affects timing.**

---

## 7. Hover Effects Principles

### Matching Effect to Action

| Element | Effect | Intent |
|---------|--------|--------|
| **Clickable card** | Lift + shadow | "This is interactive" |
| **Button** | Color/brightness change | "Press me" |
| **Image** | Zoom/scale | "View closer" |
| **Link** | Underline/color | "Navigate here" |

### Principles

1. **Signal interactivity** - hover shows it's clickable
2. **Don't overdo it** - subtle changes work
3. **Match importance** - bigger change = more important
4. **Touch alternatives** - hover doesn't work on mobile

---

> Animation principles and timing psychology - learn to decide, not copy.
> **No fixed durations to memorize - understand what affects timing.**

---

## 8. Feedback Animation Principles

### Success States

```
Celebrate appropriately:
├── Minor action → subtle check/color
├── Major action → more pronounced animation
├── Completion → satisfying animation
└── Match brand personality
```

### Error States

```
Draw attention without panic:
├── Color change (semantic red)
├── Shake animation (brief!)
├── Focus on error field
└── Clear messaging
```

### Timing

- Success: slightly longer (enjoy the moment)
- Error: quick (don't delay action)
- Loading: continuous until complete

---

> Animation principles and timing psychology - learn to decide, not copy.
> **No fixed durations to memorize - understand what affects timing.**

---

## 9. Performance Principles

### What's Cheap to Animate

```
GPU-accelerated (FAST):
├── transform: translate, scale, rotate
└── opacity: 0 to 1

CPU-intensive (SLOW):
├── width, height
├── top, left, right, bottom
├── margin, padding
├── border-radius changes
└── box-shadow changes
```

### Optimization Strategies

1. **Animate transform/opacity** whenever possible
2. **Avoid layout triggers** (size/position changes)
3. **Use will-change sparingly** (hints to browser)
4. **Test on low-end devices** (not just dev machine)

### Respecting User Preferences

```css
@media (prefers-reduced-motion: reduce) {
  /* Honor this preference */
  /* Essential animations only */
  /* Reduce or remove decorative motion */
}
```

---

> Animation principles and timing psychology - learn to decide, not copy.
> **No fixed durations to memorize - understand what affects timing.**

---

## 10. Animation Decision Checklist

Before adding animation:

- [ ] **Is there a purpose?** (feedback/guidance/delight)
- [ ] **Is timing appropriate?** (not too fast/slow)
- [ ] **Did you pick correct easing?** (enter/exit/emphasis)
- [ ] **Is it performant?** (transform/opacity only)
- [ ] **Tested reduced motion?** (accessibility)
- [ ] **Consistent with other animations?** (same timing feel)
- [ ] **Not your default settings?** (variety check)
- [ ] **Asked user about style if unclear?**

### Anti-Patterns

- ❌ Same timing values every project
- ❌ Animation for animation's sake
- ❌ Ignoring reduced-motion preference
- ❌ Animating expensive properties
- ❌ Too many things animating at once
- ❌ Delays that frustrate users

---

> **Remember**: Animation is communication. Every motion should have meaning and serve the user experience.

---

> Animation principles and timing psychology - learn to decide, not copy.
> **No fixed durations to memorize - understand what affects timing.**

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [motion-graphics.md](motion-graphics-1-lottie-animations.md) | Advanced Lottie, GSAP, particle effects |
| [visual-effects.md](visual-effects-1-glassmorphism-principles.md) | CSS effects to animate |
| [ux-psychology.md](ux-psychology-1-core-ux-laws.md) | Feedback psychology for micro-interactions |
| [../SKILL.md](../SKILL.md) | Animation categories quick reference |

---

## Rollback

Restore the baseline if required tooling errors or the procedure introduces a regression.

## Exit Gate

Require fresh evidence for the intended behavior and all applicable project checks.

<a id="rule-color-system-1-color-theory-fundamentals"></a>

## Color System: Color Theory Fundamentals through 3. Color Psychology - Meaning & Selection

**Impact:** high
**Kind:** reference
**Source:** `rules/color-system-1-color-theory-fundamentals.md`

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

<a id="rule-color-system-4-palette-generation-principles-2"></a>

## Color System: Palette Generation Principles through 8. Color Selection Checklist

**Impact:** high
**Kind:** reference
**Source:** `rules/color-system-4-palette-generation-principles-2.md`

# Color System: Palette Generation Principles through 8. Color Selection Checklist

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Color theory principles, selection process, and decision-making guidelines.
> **No memorized hex codes - learn to THINK about color.**

---

## 4. Palette Generation Principles

### From a Single Color (HSL Method)

Instead of memorizing hex codes, learn to **manipulate HSL**:

```
HSL = Hue, Saturation, Lightness

Hue (0-360): The color family
  0/360 = Red
  60 = Yellow
  120 = Green
  180 = Cyan
  240 = Blue
  300 = Purple

Saturation (0-100%): Color intensity
  Low = Muted, sophisticated
  High = Vibrant, energetic

Lightness (0-100%): Brightness
  0% = Black
  50% = Pure color
  100% = White
```

### Generating a Full Palette

Given ANY base color, create a scale:

```
Lightness Scale:
  50  (lightest) → L: 97%
  100            → L: 94%
  200            → L: 86%
  300            → L: 74%
  400            → L: 66%
  500 (base)     → L: 50-60%
  600            → L: 48%
  700            → L: 38%
  800            → L: 30%
  900 (darkest)  → L: 20%
```

### Saturation Adjustments

| Context | Saturation Level |
|---------|-----------------|
| **Professional/Corporate** | Lower (40-60%) |
| **Playful/Youth** | Higher (70-90%) |
| **Dark Mode** | Reduce by 10-20% |
| **Accessibility** | Ensure contrast, may need adjustment |

---

> Color theory principles, selection process, and decision-making guidelines.
> **No memorized hex codes - learn to THINK about color.**

---

## 5. Context-Based Selection Guide

### Instead of Copying Palettes, Follow This Process:

**Step 1: Identify the Context**
```
What type of project?
├── E-commerce → Need trust + urgency balance
├── SaaS/Dashboard → Need low-fatigue, data focus
├── Health/Wellness → Need calming, natural feel
├── Luxury/Premium → Need understated elegance
├── Creative/Portfolio → Need personality, memorable
└── Other → ASK the user
```

**Step 2: Select Primary Hue Family**
```
Based on context, pick ONE:
- Blue family (trust)
- Green family (growth)
- Warm family (energy)
- Neutral family (elegant)
- OR ask user preference
```

**Step 3: Decide Light/Dark Mode**
```
Consider:
- User preference?
- Industry standard?
- Content type? (text-heavy = light preferred)
- Time of use? (evening app = dark option)
```

**Step 4: Generate Palette Using Principles**
- Use HSL manipulation
- Follow 60-30-10 rule
- Check contrast (WCAG)
- Test with actual content

---

> Color theory principles, selection process, and decision-making guidelines.
> **No memorized hex codes - learn to THINK about color.**

---

## 6. Dark Mode Principles

### Key Rules (No Fixed Codes)

1. **Never pure black** → Use very dark gray with slight hue
2. **Never pure white text** → Use 87-92% lightness
3. **Reduce saturation** → Vibrant colors strain eyes in dark mode
4. **Elevation = brightness** → Higher elements slightly lighter

### Contrast in Dark Mode

```
Background layers (darker → lighter as elevation increases):
Layer 0 (base)    → Darkest
Layer 1 (cards)   → Slightly lighter
Layer 2 (modals)  → Even lighter
Layer 3 (popups)  → Lightest dark
```

### Adapting Colors for Dark Mode

| Light Mode | Dark Mode Adjustment |
|------------|---------------------|
| High saturation accent | Reduce saturation 10-20% |
| Pure white background | Dark gray with brand hue tint |
| Black text | Light gray (not pure white) |
| Colorful backgrounds | Desaturated, darker versions |

---

> Color theory principles, selection process, and decision-making guidelines.
> **No memorized hex codes - learn to THINK about color.**

---

## 7. Accessibility Guidelines

### Contrast Requirements (WCAG)

| Level | Normal Text | Large Text |
|-------|-------------|------------|
| AA (minimum) | 4.5:1 | 3:1 |
| AAA (enhanced) | 7:1 | 4.5:1 |

### How to Check Contrast

1. **Convert colors to luminance**
2. **Calculate ratio**: (lighter + 0.05) / (darker + 0.05)
3. **Adjust until ratio meets requirement**

### Safe Patterns

| Use Case | Guideline |
|----------|-----------|
| **Text on light bg** | Use lightness 35% or less |
| **Text on dark bg** | Use lightness 85% or more |
| **Primary on white** | Ensure dark enough variant |
| **Buttons** | High contrast between bg and text |

---

> Color theory principles, selection process, and decision-making guidelines.
> **No memorized hex codes - learn to THINK about color.**

---

## 8. Color Selection Checklist

Before finalizing any color choice, verify:

- [ ] **Asked user preference?** (if not specified)
- [ ] **Matches project context?** (industry, audience)
- [ ] **Follows 60-30-10?** (proper distribution)
- [ ] **WCAG compliant?** (contrast checked)
- [ ] **Works in both modes?** (if dark mode needed)
- [ ] **NOT your default/favorite?** (variety check)
- [ ] **Different from last project?** (avoid repetition)

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.

<a id="rule-color-system-9-anti-patterns-to-avoid-3"></a>

## Color System: Anti-Patterns to Avoid through Related

**Impact:** high
**Kind:** reference
**Source:** `rules/color-system-9-anti-patterns-to-avoid-3.md`

# Color System: Anti-Patterns to Avoid through Related

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Color theory principles, selection process, and decision-making guidelines.
> **No memorized hex codes - learn to THINK about color.**

---

## 9. Anti-Patterns to Avoid

### ❌ DON'T:
- Copy the same hex codes every project
- Default to purple/violet (AI tendency)
- Default to dark mode + neon (AI tendency)
- Use pure black (#000000) backgrounds
- Use pure white (#FFFFFF) text on dark
- Ignore user's industry context
- Skip asking user preference

### ✅ DO:
- Generate fresh palette per project
- Ask user about color preferences
- Consider industry and audience
- Use HSL for flexible manipulation
- Test contrast and accessibility
- Offer light AND dark options

---

> **Remember**: Colors are decisions, not defaults. Every project deserves thoughtful selection based on its unique context.

---

> Color theory principles, selection process, and decision-making guidelines.
> **No memorized hex codes - learn to THINK about color.**

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [ux-psychology.md](ux-psychology-1-core-ux-laws.md) | Emotion-color mapping and trust signals |
| [decision-trees.md](decision-trees-how-to-use-this-file.md) | Color selection decision tree |
| [visual-effects.md](visual-effects-1-glassmorphism-principles.md) | Gradient and glow effects using palette |
| [../SKILL.md](../SKILL.md) | Purple Ban enforcement |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.

<a id="rule-color-systems"></a>

## Dominant colors with sharp accents outperform timid, evenly-distributed palettes.

**Impact:** standard
**Kind:** reference
**Source:** `rules/color-systems.md`

# Dominant colors with sharp accents outperform timid, evenly-distributed palettes.

## Scope

This reference applies only to the platforms declared in metadata and the versions confirmed in the target repository.

## Guidance

# Color Systems

> Dominant colors with sharp accents outperform timid, evenly-distributed palettes.

---

## Principle: Commit Fully

Don't distribute color evenly. Choose:
- **1 dominant color** (60-70% of palette)
- **1 sharp accent** (10-20% for emphasis)
- **1-2 neutrals** (supporting roles)

---

## Color System Setup

```css
:root {
  /* Primary - dominant presence */
  --color-primary: #1A202C;
  --color-primary-light: #2D3748;
  --color-primary-dark: #0F1419;

  /* Accent - sharp, attention-grabbing */
  --color-accent: #F56565;
  --color-accent-hover: #E53E3E;

  /* Neutrals - supporting */
  --color-neutral-50: #FAFAFA;
  --color-neutral-100: #F5F5F5;
  --color-neutral-200: #E5E5E5;
  --color-neutral-300: #D4D4D4;
  --color-neutral-700: #525252;
  --color-neutral-900: #171717;

  /* Semantic */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
}
```

---

## Aesthetic Palettes

### Dark + Bold Accent
```css
--color-bg: #0F0F0F;
--color-text: #FAFAFA;
--color-accent: #FF6B35;
```

### Light Editorial
```css
--color-bg: #FAFAF9;
--color-text: #1C1917;
--color-accent: #DC2626;
```

### Muted Earth
```css
--color-bg: #F5F1EB;
--color-text: #3D3D3D;
--color-accent: #8B7355;
```

### Neon Cyber
```css
--color-bg: #0D1117;
--color-text: #C9D1D9;
--color-accent: #58A6FF;
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| 5+ equally-weighted colors | 1 dominant + 1 accent |
| Default blue (#0066CC) | Distinctive, contextual colors |
| Random gradient | Intentional gradient direction |
| No dark mode | Full dark mode support |
| Hard-coded colors | CSS variables |

---

## Dark Mode

```css
:root {
  --color-bg: #FAFAFA;
  --color-text: #1A1A1A;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1A1A1A;
    --color-text: #FAFAFA;
  }
}

/* Or manual toggle */
[data-theme="dark"] {
  --color-bg: #1A1A1A;
  --color-text: #FAFAFA;
}
```

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [typography.md](typography.md) | Font pairings that complement colors |
| [motion-design.md](motion-design.md) | Animate color transitions |
| [../SKILL.md](../SKILL.md) | Max 3 brand colors constraint |

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-decision-trees-3-color-selection-decision-tree-2"></a>

## Decision Trees: Color Selection Decision Tree through 4. Typography Decision Tree

**Impact:** high
**Kind:** decision
**Source:** `rules/decision-trees-3-color-selection-decision-tree-2.md`

# Decision Trees: Color Selection Decision Tree through 4. Typography Decision Tree

## Decision

> Context-based design THINKING, not fixed solutions.
> **These are decision GUIDES, not copy-paste templates.**
> **For UX psychology principles (Hick's, Fitts', etc.) see:** [ux-psychology.md](ux-psychology-1-core-ux-laws.md)

---

## 3. Color Selection Decision Tree

### Instead of fixed hex codes, use this process:

```
WHAT EMOTION/ACTION DO YOU WANT?
            │
            ├── Trust & Security
            │   └── Consider: Blue family, professional neutrals
            │       → ASK user for specific shade preference
            │
            ├── Growth & Health
            │   └── Consider: Green family, natural tones
            │       → ASK user if eco/nature/wellness focus
            │
            ├── Urgency & Action
            │   └── Consider: Warm colors (orange/red) as ACCENTS
            │       → Use sparingly, ASK if appropriate
            │
            ├── Luxury & Premium
            │   └── Consider: Deep darks, metallics, restrained palette
            │       → ASK about brand positioning
            │
            ├── Creative & Playful
            │   └── Consider: Multi-color, unexpected combinations
            │       → ASK about brand personality
            │
            └── Calm & Minimal
                └── Consider: Neutrals with single accent
                    → ASK what accent color fits brand
```

### The Process:
1. Identify the emotion needed
2. Narrow to color FAMILY
3. ASK user for preference within family
4. Generate fresh palette using HSL principles

---

> Context-based design THINKING, not fixed solutions.
> **These are decision GUIDES, not copy-paste templates.**
> **For UX psychology principles (Hick's, Fitts', etc.) see:** [ux-psychology.md](ux-psychology-1-core-ux-laws.md)

---

## 4. Typography Decision Tree

```
WHAT'S THE CONTENT TYPE?
          │
          ├── Data-Heavy (Dashboard, SaaS)
          │   ├── Style: Sans-serif, clear, compact
          │   ├── Scale: Tighter ratio (1.125-1.2)
          │   └── Priority: Scannability, density
          │
          ├── Editorial (Blog, Magazine)
          │   ├── Style: Serif heading + Sans body works well
          │   ├── Scale: More dramatic (1.333+)
          │   └── Priority: Reading comfort, hierarchy
          │
          ├── Modern Tech (Startup, SaaS Marketing)
          │   ├── Style: Geometric or humanist sans
          │   ├── Scale: Balanced (1.25)
          │   └── Priority: Modern feel, clarity
          │
          ├── Luxury (Fashion, Premium)
          │   ├── Style: Elegant serif or thin sans
          │   ├── Scale: Dramatic (1.5-1.618)
          │   └── Priority: Sophistication, whitespace
          │
          └── Playful (Kids, Games, Casual)
              ├── Style: Rounded, friendly fonts
              ├── Scale: Varied, expressive
              └── Priority: Fun, approachable, readable
```

### Selection Process:
1. Identify content type
2. Choose style DIRECTION
3. ASK user if they have brand fonts
4. Select fonts that match direction

---

## Use When

Use when the documented constraints match observed repository and runtime evidence.

## Avoid When

Avoid when a simpler option satisfies the same constraints or evidence is unavailable.

## Trade-offs

Compare correctness, accessibility, operations, performance, migration cost, and reversibility.

## Verification

Test a representative scenario and the most important failure mode.

<a id="rule-decision-trees-5-e-commerce-guidelines-e-commerce-3"></a>

## Decision Trees: E-commerce Guidelines {#e-commerce} through 6. SaaS Dashboard Guidelines {#saas}

**Impact:** high
**Kind:** decision
**Source:** `rules/decision-trees-5-e-commerce-guidelines-e-commerce-3.md`

# Decision Trees: E-commerce Guidelines {#e-commerce} through 6. SaaS Dashboard Guidelines {#saas}

## Decision

> Context-based design THINKING, not fixed solutions.
> **These are decision GUIDES, not copy-paste templates.**
> **For UX psychology principles (Hick's, Fitts', etc.) see:** [ux-psychology.md](ux-psychology-1-core-ux-laws.md)

---

## 5. E-commerce Guidelines {#e-commerce}

### Key Principles (Not Fixed Rules)
- **Trust first:** How will you show security?
- **Action-oriented:** Where are the CTAs?
- **Scannable:** Can users compare quickly?

### Color Thinking:
```
E-commerce typically needs:
├── Trust color (often blue family) → ASK preference
├── Clean background (white/neutral) → depends on brand
├── Action accent (for CTAs, sales) → depends on urgency level
├── Success/error semantics → standard conventions work
└── Brand integration → ASK about existing colors
```

### Layout Principles:
```
┌────────────────────────────────────────────────────┐
│  HEADER: Brand + Search + Cart                      │
│  (Keep essential actions visible)                   │
├────────────────────────────────────────────────────┤
│  TRUST ZONE: Why trust this site?                   │
│  (Shipping, returns, security - if applicable)      │
├────────────────────────────────────────────────────┤
│  HERO: Primary message or offer                     │
│  (Clear CTA, single focus)                          │
├────────────────────────────────────────────────────┤
│  CATEGORIES: Easy navigation                        │
│  (Visual, filterable, scannable)                    │
├────────────────────────────────────────────────────┤
│  PRODUCTS: Easy comparison                          │
│  (Price, rating, quick actions visible)             │
├────────────────────────────────────────────────────┤
│  SOCIAL PROOF: Why others trust                     │
│  (Reviews, testimonials - if available)             │
├────────────────────────────────────────────────────┤
│  FOOTER: All the details                            │
│  (Policies, contact, trust badges)                  │
└────────────────────────────────────────────────────┘
```

### Psychology to Apply:
- Hick's Law: Limit navigation choices
- Fitts' Law: Size CTAs appropriately
- Social proof: Show where relevant
- Scarcity: Use honestly if at all

---

> Context-based design THINKING, not fixed solutions.
> **These are decision GUIDES, not copy-paste templates.**
> **For UX psychology principles (Hick's, Fitts', etc.) see:** [ux-psychology.md](ux-psychology-1-core-ux-laws.md)

---

## 6. SaaS Dashboard Guidelines {#saas}

### Key Principles
- **Functional first:** Data clarity over decoration
- **Calm UI:** Reduce cognitive load
- **Consistent:** Predictable patterns

### Color Thinking:
```
Dashboard typically needs:
├── Background: Light OR dark (ASK preference)
├── Surface: Slight contrast from background
├── Primary accent: For key actions
├── Data colors: Success/warning/danger semantics
└── Muted: For secondary information
```

### Layout Principles:
```
Consider these patterns (not mandated):

OPTION A: Sidebar + Content
├── Fixed sidebar for navigation
└── Main area for content

OPTION B: Top nav + Content
├── Horizontal navigation
└── More horizontal content space

OPTION C: Collapsed + Expandable
├── Icon-only sidebar expands
└── Maximum content area

→ ASK user about their navigation preference
```

### Psychology to Apply:
- Hick's Law: Group navigation items
- Miller's Law: Chunk information
- Cognitive Load: Whitespace, consistency

---

## Use When

Use when the documented constraints match observed repository and runtime evidence.

## Avoid When

Avoid when a simpler option satisfies the same constraints or evidence is unavailable.

## Trade-offs

Compare correctness, accessibility, operations, performance, migration cost, and reversibility.

## Verification

Test a representative scenario and the most important failure mode.

<a id="rule-decision-trees-7-landing-page-guidelines-landing-page-4"></a>

## Decision Trees: Landing Page Guidelines {#landing-page}

**Impact:** high
**Kind:** decision
**Source:** `rules/decision-trees-7-landing-page-guidelines-landing-page-4.md`

# Decision Trees: Landing Page Guidelines {#landing-page}

## Decision

> Context-based design THINKING, not fixed solutions.
> **These are decision GUIDES, not copy-paste templates.**
> **For UX psychology principles (Hick's, Fitts', etc.) see:** [ux-psychology.md](ux-psychology-1-core-ux-laws.md)

---

## 7. Landing Page Guidelines {#landing-page}

### Key Principles
- **Hero-centric:** First impression matters most
- **Single focus:** One primary CTA
- **Emotional:** Connect before selling

### Color Thinking:
```
Landing page typically needs:
├── Brand primary: Hero background or accent
├── Clean secondary: Most of page
├── CTA color: Stands out from everything
├── Supporting: For sections, testimonials
└── ASK about brand colors first!
```

### Structure Principles:
```
┌────────────────────────────────────────────────────┐
│  Navigation: Minimal, CTA visible                   │
├────────────────────────────────────────────────────┤
│  HERO: Hook + Value + CTA                          │
│  (Most important section, biggest impact)           │
├────────────────────────────────────────────────────┤
│  PROBLEM: What pain do they have?                   │
├────────────────────────────────────────────────────┤
│  SOLUTION: How you solve it                         │
├────────────────────────────────────────────────────┤
│  PROOF: Why believe you?                            │
│  (Testimonials, logos, stats)                       │
├────────────────────────────────────────────────────┤
│  HOW: Simple explanation of process                 │
├────────────────────────────────────────────────────┤
│  PRICING: If applicable                             │
├────────────────────────────────────────────────────┤
│  FAQ: Address objections                            │
├────────────────────────────────────────────────────┤
│  FINAL CTA: Repeat main action                      │
└────────────────────────────────────────────────────┘
```

### Psychology to Apply:
- Visceral: Beautiful hero impression
- Serial Position: Key info top/bottom
- Social Proof: Testimonials work

---

## Use When

Use when the documented constraints match observed repository and runtime evidence.

## Avoid When

Avoid when a simpler option satisfies the same constraints or evidence is unavailable.

## Trade-offs

Compare correctness, accessibility, operations, performance, migration cost, and reversibility.

## Verification

Test a representative scenario and the most important failure mode.

<a id="rule-decision-trees-8-portfolio-guidelines-portfolio-5"></a>

## Decision Trees: Portfolio Guidelines {#portfolio} through Related

**Impact:** high
**Kind:** decision
**Source:** `rules/decision-trees-8-portfolio-guidelines-portfolio-5.md`

# Decision Trees: Portfolio Guidelines {#portfolio} through Related

## Decision

> Context-based design THINKING, not fixed solutions.
> **These are decision GUIDES, not copy-paste templates.**
> **For UX psychology principles (Hick's, Fitts', etc.) see:** [ux-psychology.md](ux-psychology-1-core-ux-laws.md)

---

## 8. Portfolio Guidelines {#portfolio}

### Key Principles
- **Personality:** Show who you are
- **Work-focused:** Let projects speak
- **Memorable:** Stand out from templates

### Color Thinking:
```
Portfolio is personal - many options:
├── Minimal: Neutrals + one signature accent
├── Bold: Unexpected color choices
├── Dark: Moody, artistic feel
├── Light: Clean, professional feel
└── ASK about personal brand identity!
```

### Structure Principles:
```
┌────────────────────────────────────────────────────┐
│  Navigation: Unique to your personality             │
├────────────────────────────────────────────────────┤
│  INTRO: Who you are, what you do                   │
│  (Make it memorable, not generic)                   │
├────────────────────────────────────────────────────┤
│  WORK: Featured projects                            │
│  (Large, visual, interactive)                       │
├────────────────────────────────────────────────────┤
│  ABOUT: Personal story                              │
│  (Creates connection)                               │
├────────────────────────────────────────────────────┤
│  CONTACT: Easy to reach                             │
│  (Clear, direct)                                    │
└────────────────────────────────────────────────────┘
```

### Psychology to Apply:
- Von Restorff: Be uniquely memorable
- Reflective: Personal story creates connection
- Emotional: Personality over professionalism

---

> Context-based design THINKING, not fixed solutions.
> **These are decision GUIDES, not copy-paste templates.**
> **For UX psychology principles (Hick's, Fitts', etc.) see:** [ux-psychology.md](ux-psychology-1-core-ux-laws.md)

---

## 9. Pre-Design Checklists

### Before Starting ANY Design

- [ ] **Audience defined?** (who exactly)
- [ ] **Primary goal identified?** (what action)
- [ ] **Constraints known?** (time, brand, tech)
- [ ] **Content available?** (or placeholders needed)
- [ ] **User preferences asked?** (colors, style, layout)

### Before Choosing Colors

- [ ] **Asked user preference?**
- [ ] **Considered context?** (industry, emotion)
- [ ] **Different from your default?**
- [ ] **Checked accessibility?**

### Before Finalizing Layout

- [ ] **Hierarchy clear?**
- [ ] **Primary CTA obvious?**
- [ ] **Mobile considered?**
- [ ] **Content fits structure?**

### Before Delivery

- [ ] **Looks premium, not generic?**
- [ ] **Would you be proud of this?**
- [ ] **Different from last project?**

---

> Context-based design THINKING, not fixed solutions.
> **These are decision GUIDES, not copy-paste templates.**
> **For UX psychology principles (Hick's, Fitts', etc.) see:** [ux-psychology.md](ux-psychology-1-core-ux-laws.md)

---

## 10. Complexity Estimation

### Quick Projects (Hours)
```
Simple landing page
Small portfolio
Basic form
Single component
```
→ Approach: Minimal decisions, focused execution

### Medium Projects (Days)
```
Multi-page site
Dashboard with modules
E-commerce category
Complex forms
```
→ Approach: Establish tokens, custom components

### Large Projects (Weeks)
```
Full SaaS application
E-commerce platform
Custom design system
Complex workflows
```
→ Approach: Full design system, documentation, testing

---

> **Remember**: These templates show STRUCTURE and THINKING process. Every project needs fresh color, typography, and styling decisions based on its unique context. ASK when unclear.

---

> Context-based design THINKING, not fixed solutions.
> **These are decision GUIDES, not copy-paste templates.**
> **For UX psychology principles (Hick's, Fitts', etc.) see:** [ux-psychology.md](ux-psychology-1-core-ux-laws.md)

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [ux-psychology.md](ux-psychology-1-core-ux-laws.md) | UX laws applied in each template |
| [color-system.md](color-system-1-color-theory-fundamentals.md) | HSL palette generation after color decision |
| [typography-system.md](typography-system-1-modular-scale-principles.md) | Font selection after type decision |
| [../SKILL.md](../SKILL.md) | Anti-pattern bans and quick reference |

---

## Use When

Use when the documented constraints match observed repository and runtime evidence.

## Avoid When

Avoid when a simpler option satisfies the same constraints or evidence is unavailable.

## Trade-offs

Compare correctness, accessibility, operations, performance, migration cost, and reversibility.

## Verification

Test a representative scenario and the most important failure mode.

<a id="rule-decision-trees-how-to-use-this-file"></a>

## Decision Trees: How to Use This File through 2. Audience Decision Tree

**Impact:** high
**Kind:** decision
**Source:** `rules/decision-trees-how-to-use-this-file.md`

# Decision Trees: How to Use This File through 2. Audience Decision Tree

## Decision

> Context-based design THINKING, not fixed solutions.
> **These are decision GUIDES, not copy-paste templates.**
> **For UX psychology principles (Hick's, Fitts', etc.) see:** [ux-psychology.md](ux-psychology-1-core-ux-laws.md)

---

## ⚠️ How to Use This File

This file helps you DECIDE, not copy.

- Decision trees → Help you THINK through options
- Templates → Show STRUCTURE and PRINCIPLES, not exact values
- **Always ask user preferences** before applying
- **Generate fresh palettes** based on context, don't copy hex codes
- **Apply UX laws** from ux-psychology.md to validate decisions

---

> Context-based design THINKING, not fixed solutions.
> **These are decision GUIDES, not copy-paste templates.**
> **For UX psychology principles (Hick's, Fitts', etc.) see:** [ux-psychology.md](ux-psychology-1-core-ux-laws.md)

---

## 1. Master Decision Tree

```
┌─────────────────────────────────────────────────────────────┐
│                     WHAT ARE YOU BUILDING?                   │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
   E-COMMERCE            SaaS/APP              CONTENT
   - Product pages       - Dashboard           - Blog
   - Checkout            - Tools               - Portfolio
   - Catalog             - Admin               - Landing
        │                     │                     │
        ▼                     ▼                     ▼
   PRINCIPLES:           PRINCIPLES:           PRINCIPLES:
   - Trust               - Functionality       - Storytelling
   - Action              - Clarity             - Emotion
   - Urgency             - Efficiency          - Creativity
```

---

> Context-based design THINKING, not fixed solutions.
> **These are decision GUIDES, not copy-paste templates.**
> **For UX psychology principles (Hick's, Fitts', etc.) see:** [ux-psychology.md](ux-psychology-1-core-ux-laws.md)

---

## 2. Audience Decision Tree

### Who is your target user?

```
TARGET AUDIENCE
      │
      ├── Gen Z (18-25)
      │   ├── Colors: Bold, vibrant, unexpected combinations
      │   ├── Type: Large, expressive, variable
      │   ├── Layout: Mobile-first, vertical, snackable
      │   ├── Effects: Motion, gamification, interactive
      │   └── Approach: Authentic, fast, no corporate feel
      │
      ├── Millennials (26-41)
      │   ├── Colors: Muted, earthy, sophisticated
      │   ├── Type: Clean, readable, functional
      │   ├── Layout: Responsive, card-based, organized
      │   ├── Effects: Subtle, purposeful only
      │   └── Approach: Value-driven, transparent, sustainable
      │
      ├── Gen X (42-57)
      │   ├── Colors: Professional, trusted, conservative
      │   ├── Type: Familiar, clear, no-nonsense
      │   ├── Layout: Traditional hierarchy, predictable
      │   ├── Effects: Minimal, functional feedback
      │   └── Approach: Direct, efficient, reliable
      │
      ├── Boomers (58+)
      │   ├── Colors: High contrast, simple, clear
      │   ├── Type: Large sizes, high readability
      │   ├── Layout: Simple, linear, uncluttered
      │   ├── Effects: None or very minimal
      │   └── Approach: Clear, detailed, trustworthy
      │
      └── B2B / Enterprise
          ├── Colors: Professional palette, muted
          ├── Type: Clean, data-friendly, scannable
          ├── Layout: Grid-based, organized, efficient
          ├── Effects: Professional, subtle
          └── Approach: Expert, solution-focused, ROI-driven
```

---

## Use When

Use when the documented constraints match observed repository and runtime evidence.

## Avoid When

Avoid when a simpler option satisfies the same constraints or evidence is unavailable.

## Trade-offs

Compare correctness, accessibility, operations, performance, migration cost, and reversibility.

## Verification

Test a representative scenario and the most important failure mode.

<a id="rule-design-extraction"></a>

## Design Extraction from Screenshots

**Impact:** standard
**Kind:** reference
**Source:** `rules/design-extraction.md`

# Design Extraction from Screenshots

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

# Design Extraction from Screenshots

> Never jump straight to code. Analyze first.

---

## Extraction Process

```
Screenshot → Analyze → Document → Implement → Verify
```

### Step 1: Analyze Screenshot

Extract these elements:

| Category | What to Extract |
|----------|-----------------|
| **Colors** | All hex codes (primary, accent, neutral, background) |
| **Typography** | Font families, sizes, weights, line-heights |
| **Spacing** | Margin/padding patterns, spacing scale |
| **Layout** | Grid structure, flexbox patterns, positioning |
| **Components** | Button styles, card styles, form elements |
| **Visual** | Shadows, borders, gradients, textures |

---

### Step 2: Document Findings

Create `design-guidelines.md`:

```markdown
# Extracted Design System

## Colors
- Primary: #2D3748
- Accent: #ED8936
- Background: #F7FAFC
- Text: #1A202C

## Typography
### Headings
- Font: Playfair Display
- Sizes: 48px (h1), 32px (h2), 24px (h3)
- Weight: 700
- Line-height: 1.2

### Body
- Font: Source Sans Pro
- Size: 16px
- Weight: 400
- Line-height: 1.6

## Spacing Scale
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

## Layout
- Max width: 1200px
- Grid: 12 columns
- Gutter: 24px

## Components
### Buttons
- Padding: 12px 24px
- Border-radius: 8px
- Font-weight: 600
```

---

### Step 3: Implement with Precision

```css
/* Match EXACT specifications */
:root {
  --color-primary: #2D3748;
  --color-accent: #ED8936;
  --color-background: #F7FAFC;

  --font-heading: 'Playfair Display', serif;
  --font-body: 'Source Sans Pro', sans-serif;

  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
}

.heading {
  font-family: var(--font-heading);
  font-size: 48px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-primary);
}
```

---

### Step 4: Verify Quality

Compare implementation to original:

| Check | Criteria |
|-------|----------|
| **Colors** | Exact hex match |
| **Typography** | Font, size, weight, line-height |
| **Spacing** | Margins, padding consistent |
| **Layout** | Grid alignment, proportions |
| **Components** | Visual identical |
| **Responsiveness** | Same breakpoint behavior |

---

## Common Extraction Mistakes

| ❌ Mistake | ✅ Fix |
|-----------|-------|
| Guessing colors | Use eyedropper tool |
| Assuming fonts | Identify with WhatFont |
| Ignoring spacing | Measure precisely |
| Skipping small details | Note every shadow, border |
| One-off extraction | Create reusable system |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [color-systems.md](color-systems.md) | Extracted color systematization |
| [typography.md](typography.md) | Identify extracted font pairings |
| [../SKILL.md](../SKILL.md) | Workflow 1: From Screenshots |

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-motion-design"></a>

## One orchestrated animation > many scattered micro-interactions.

**Impact:** standard
**Kind:** reference
**Source:** `rules/motion-design.md`

# One orchestrated animation > many scattered micro-interactions.

## Scope

This reference applies only to the platforms declared in metadata and the versions confirmed in the target repository.

## Guidance

# Motion Design

> One orchestrated animation > many scattered micro-interactions.

---

## Principle: Orchestrated Entrances

Don't scatter animations. Create one impactful page load sequence:

```css
/* Staggered entrance animation */
.hero-title {
  animation: fadeInUp 0.6s ease-out;
}

.hero-subtitle {
  animation: fadeInUp 0.6s ease-out 0.2s;
  animation-fill-mode: backwards;
}

.hero-cta {
  animation: fadeInUp 0.6s ease-out 0.4s;
  animation-fill-mode: backwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## Animation Timing

| Easing | Use Case |
|--------|----------|
| `ease-out` | Entrances (fast start, slow end) |
| `ease-in` | Exits (slow start, fast end) |
| `ease-in-out` | Continuous motion |
| `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy, playful |

---

## Duration Guidelines

| Element | Duration |
|---------|----------|
| Micro-interactions | 100-200ms |
| Component transitions | 200-400ms |
| Page transitions | 400-600ms |
| Hero animations | 600-1000ms |

---

## React Motion Library

```jsx
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

function Hero() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 variants={fadeUp}>Title</motion.h1>
      <motion.p variants={fadeUp}>Subtitle</motion.p>
      <motion.button variants={fadeUp}>CTA</motion.button>
    </motion.div>
  );
}
```

---

## Anime.js for Complex Animations

```javascript
import anime from 'animejs';

// Timeline for orchestrated sequence
const tl = anime.timeline({
  easing: 'easeOutExpo',
  duration: 750
});

tl
  .add({
    targets: '.hero-title',
    opacity: [0, 1],
    translateY: [50, 0]
  })
  .add({
    targets: '.hero-subtitle',
    opacity: [0, 1],
    translateY: [30, 0]
  }, '-=500') // Overlap by 500ms
  .add({
    targets: '.hero-cta',
    opacity: [0, 1],
    scale: [0.9, 1]
  }, '-=400');
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Animate everything | Selective, purposeful motion |
| Random timing | Consistent timing system |
| Competing animations | Single focal point |
| Slow entrances (>1s) | Quick, impactful (<600ms) |
| Animation without purpose | Motion that guides attention |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [spatial-composition.md](spatial-composition.md) | Layout to animate |
| [color-systems.md](color-systems.md) | Color transitions |
| [../SKILL.md](../SKILL.md) | 1 orchestrated entrance rule |

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-motion-graphics-1-lottie-animations"></a>

## Motion Graphics: Lottie Animations through 4. 3D CSS Transforms

**Impact:** high
**Kind:** reference
**Source:** `rules/motion-graphics-1-lottie-animations.md`

# Motion Graphics: Lottie Animations through 4. 3D CSS Transforms

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Advanced animation techniques for premium web experiences - Lottie, GSAP, SVG, 3D, Particles.
> **Learn the principles, create WOW effects.**

---

## 1. Lottie Animations

### What is Lottie?

```
JSON-based vector animations:
├── Exported from After Effects via Bodymovin
├── Lightweight (smaller than GIF/video)
├── Scalable (vector-based, no pixelation)
├── Interactive (control playback, segments)
└── Cross-platform (web, iOS, Android, React Native)
```

### When to Use Lottie

| Use Case | Why Lottie? |
|----------|-------------|
| **Loading animations** | Branded, smooth, lightweight |
| **Empty states** | Engaging illustrations |
| **Onboarding flows** | Complex multi-step animations |
| **Success/Error feedback** | Delightful micro-interactions |
| **Animated icons** | Consistent cross-platform |

### Principles

- Keep file size under 100KB for performance
- Use loop sparingly (avoid distraction)
- Provide static fallback for reduced-motion
- Lazy load animation files when possible

### Sources

- LottieFiles.com (free library)
- After Effects + Bodymovin (custom)
- Figma plugins (export from design)

---

> Advanced animation techniques for premium web experiences - Lottie, GSAP, SVG, 3D, Particles.
> **Learn the principles, create WOW effects.**

---

## 2. GSAP (GreenSock)

### What Makes GSAP Different

```
Professional timeline-based animation:
├── Precise control over sequences
├── ScrollTrigger for scroll-driven animations
├── MorphSVG for shape transitions
├── Physics-based easing
└── Works with any DOM element
```

### Core Concepts

| Concept | Purpose |
|---------|---------|
| **Tween** | Single A→B animation |
| **Timeline** | Sequenced/overlapping animations |
| **ScrollTrigger** | Scroll position controls playback |
| **Stagger** | Cascade effect across elements |

### When to Use GSAP

- ✅ Complex sequenced animations
- ✅ Scroll-triggered reveals
- ✅ Precise timing control needed
- ✅ SVG morphing effects
- ❌ Simple hover/focus effects (use CSS)
- ❌ Performance-critical mobile (heavier)

### Principles

- Use timeline for orchestration (not individual tweens)
- Stagger delay: 0.05-0.15s between items
- ScrollTrigger: start at 70-80% viewport entry
- Kill animations on unmount (prevent memory leaks)

---

> Advanced animation techniques for premium web experiences - Lottie, GSAP, SVG, 3D, Particles.
> **Learn the principles, create WOW effects.**

---

## 3. SVG Animations

### Types of SVG Animation

| Type | Technique | Use Case |
|------|-----------|----------|
| **Line Drawing** | stroke-dashoffset | Logo reveals, signatures |
| **Morph** | Path interpolation | Icon transitions |
| **Transform** | rotate, scale, translate | Interactive icons |
| **Color** | fill/stroke transition | State changes |

### Line Drawing Principles

```
How stroke-dashoffset drawing works:
├── Set dasharray to path length
├── Set dashoffset equal to dasharray (hidden)
├── Animate dashoffset to 0 (revealed)
└── Create "drawing" effect
```

### When to Use SVG Animations

- ✅ Logo reveals, brand moments
- ✅ Icon state transitions (hamburger ↔ X)
- ✅ Infographics, data visualization
- ✅ Interactive illustrations
- ❌ Photo-realistic content (use video)
- ❌ Very complex scenes (performance)

### Principles

- Get path length dynamically for accuracy
- Duration: 1-3s for full drawings
- Easing: ease-out for natural feel
- Simple fills complement, don't compete

---

> Advanced animation techniques for premium web experiences - Lottie, GSAP, SVG, 3D, Particles.
> **Learn the principles, create WOW effects.**

---

## 4. 3D CSS Transforms

### Core Properties

```
CSS 3D Space:
├── perspective: depth of 3D field (500-1500px typical)
├── transform-style: preserve-3d (enable children 3D)
├── rotateX/Y/Z: rotation per axis
├── translateZ: move toward/away from viewer
└── backface-visibility: show/hide back side
```

### Common 3D Patterns

| Pattern | Use Case |
|---------|----------|
| **Card flip** | Reveals, flashcards, product views |
| **Tilt on hover** | Interactive cards, 3D depth |
| **Parallax layers** | Hero sections, immersive scrolling |
| **3D carousel** | Image galleries, sliders |

### Principles

- Perspective: 800-1200px for subtle, 400-600px for dramatic
- Keep transforms simple (rotate + translate)
- Ensure backface-visibility: hidden for flips
- Test on Safari (different rendering)

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.

<a id="rule-motion-graphics-5-particle-effects-2"></a>

## Motion Graphics: Particle Effects through 10. Quick Reference

**Impact:** high
**Kind:** reference
**Source:** `rules/motion-graphics-5-particle-effects-2.md`

# Motion Graphics: Particle Effects through 10. Quick Reference

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Advanced animation techniques for premium web experiences - Lottie, GSAP, SVG, 3D, Particles.
> **Learn the principles, create WOW effects.**

---

## 5. Particle Effects

### Types of Particle Systems

| Type | Feel | Use Case |
|------|------|----------|
| **Geometric** | Tech, network | SaaS, tech sites |
| **Confetti** | Celebration | Success moments |
| **Snow/Rain** | Atmospheric | Seasonal, mood |
| **Dust/Bokeh** | Dreamy | Photography, luxury |
| **Fireflies** | Magical | Games, fantasy |

### Libraries

| Library | Best For |
|---------|----------|
| **tsParticles** | Configurable, lightweight |
| **particles.js** | Simple backgrounds |
| **Canvas API** | Custom, maximum control |
| **Three.js** | Complex 3D particles |

### Principles

- Default: 30-50 particles (not overwhelming)
- Movement: slow, organic (speed 0.5-2)
- Opacity: 0.3-0.6 (don't compete with content)
- Connections: subtle lines for "network" feel
- ⚠️ Disable or reduce on mobile

### When to Use

- ✅ Hero backgrounds (atmospheric)
- ✅ Success celebrations (confetti burst)
- ✅ Tech visualization (connected nodes)
- ❌ Content-heavy pages (distraction)
- ❌ Low-powered devices (battery drain)

---

> Advanced animation techniques for premium web experiences - Lottie, GSAP, SVG, 3D, Particles.
> **Learn the principles, create WOW effects.**

---

## 6. Scroll-Driven Animations

### Native CSS (Modern)

```
CSS Scroll Timelines:
├── animation-timeline: scroll() - document scroll
├── animation-timeline: view() - element in viewport
├── animation-range: entry/exit thresholds
└── No JavaScript required
```

### Principles

| Trigger Point | Use Case |
|---------------|----------|
| **Entry 0%** | When element starts entering |
| **Entry 50%** | When half visible |
| **Cover 50%** | When centered in viewport |
| **Exit 100%** | When fully exited |

### Best Practices

- Reveal animations: start at ~25% entry
- Parallax: continuous scroll progress
- Sticky elements: use cover range
- Always test scroll performance

---

> Advanced animation techniques for premium web experiences - Lottie, GSAP, SVG, 3D, Particles.
> **Learn the principles, create WOW effects.**

---

## 7. Performance Principles

### GPU vs CPU Animation

```
CHEAP (GPU-accelerated):
├── transform (translate, scale, rotate)
├── opacity
└── filter (use sparingly)

EXPENSIVE (triggers reflow):
├── width, height
├── top, left, right, bottom
├── padding, margin
└── complex box-shadow
```

### Optimization Checklist

- [ ] Animate only transform/opacity
- [ ] Use `will-change` before heavy animations (remove after)
- [ ] Test on low-end devices
- [ ] Implement `prefers-reduced-motion`
- [ ] Lazy load animation libraries
- [ ] Throttle scroll-based calculations

---

> Advanced animation techniques for premium web experiences - Lottie, GSAP, SVG, 3D, Particles.
> **Learn the principles, create WOW effects.**

---

## 8. Motion Graphics Decision Tree

```
What animation do you need?
│
├── Complex branded animation?
│   └── Lottie (After Effects export)
│
├── Sequenced scroll-triggered?
│   └── GSAP + ScrollTrigger
│
├── Logo/icon animation?
│   └── SVG animation (stroke or morph)
│
├── Interactive 3D effect?
│   └── CSS 3D Transforms (simple) or Three.js (complex)
│
├── Atmospheric background?
│   └── tsParticles or Canvas
│
└── Simple entrance/hover?
    └── CSS @keyframes or Framer Motion
```

---

> Advanced animation techniques for premium web experiences - Lottie, GSAP, SVG, 3D, Particles.
> **Learn the principles, create WOW effects.**

---

## 9. Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| Animate everything at once | Stagger and sequence |
| Use heavy libraries for simple effects | Start with CSS |
| Ignore reduced-motion | Always provide fallback |
| Block main thread | Optimize for 60fps |
| Same particles every project | Match brand/context |
| Complex effects on mobile | Feature detection |

---

> Advanced animation techniques for premium web experiences - Lottie, GSAP, SVG, 3D, Particles.
> **Learn the principles, create WOW effects.**

---

## 10. Quick Reference

| Effect | Tool | Performance |
|--------|------|-------------|
| Loading spinner | CSS/Lottie | Light |
| Staggered reveal | GSAP/Framer | Medium |
| SVG path draw | CSS stroke | Light |
| 3D card flip | CSS transforms | Light |
| Particle background | tsParticles | Heavy |
| Scroll parallax | GSAP ScrollTrigger | Medium |
| Shape morphing | GSAP MorphSVG | Medium |

---

> **Remember**: Motion graphics should enhance, not distract. Every animation must serve a PURPOSE—feedback, guidance, delight, or storytelling.

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.

<a id="rule-motion-graphics-related-3"></a>

## Motion Graphics: Related

**Impact:** high
**Kind:** reference
**Source:** `rules/motion-graphics-related-3.md`

# Motion Graphics: Related

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Advanced animation techniques for premium web experiences - Lottie, GSAP, SVG, 3D, Particles.
> **Learn the principles, create WOW effects.**

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [animation-guide.md](animation-guide-1-duration-principles.md) | Core animation timing and easing principles |
| [visual-effects.md](visual-effects-1-glassmorphism-principles.md) | CSS glassmorphism, gradients, shadows |
| [ux-psychology.md](ux-psychology-1-core-ux-laws.md) | Emotional design and feedback psychology |
| [../SKILL.md](../SKILL.md) | Animation categories quick reference |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.

<a id="rule-production-gates"></a>

## Production verification gates

**Impact:** high
**Kind:** process
**Source:** `rules/production-gates.md`

# Production verification gates

## Preconditions

- Confirm the target platform and dependency versions from the repository.
- Capture a reproducible baseline and define observable acceptance criteria.
- Identify a recoverable rollback point before changing code or configuration.

## Procedure

1. Apply the smallest change that satisfies the documented requirement.
2. Exercise the affected success and failure paths with the narrowest reliable check.
3. Run the repository typecheck, tests, and policy checks that cover the changed surface.
4. Inspect diagnostics for redacted, actionable evidence; a missing or failed checker is not success.

## Rollback

Restore the recorded baseline when a required check errors, the result is inconclusive, or a new regression appears. Re-run the baseline check after restoration.

## Exit Gate

Finish only when required checks execute and pass, acceptance behavior is reproduced, rollback remains available, and residual risks are reported explicitly.

<a id="rule-spatial-composition"></a>

## Break the grid. Create unexpected layouts.

**Impact:** standard
**Kind:** reference
**Source:** `rules/spatial-composition.md`

# Break the grid. Create unexpected layouts.

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

# Spatial Composition

> Break the grid. Create unexpected layouts.

---

## Principle: Break Expectations

Don't default to centered, symmetrical layouts. Create visual tension:

- **Asymmetric arrangements**
- **Overlapping elements**
- **Diagonal flow**
- **Generous negative space OR controlled density**

---

## Grid Breaking Techniques

### Asymmetric Grid
```css
.layout {
  display: grid;
  grid-template-columns: 2fr 1fr; /* Unequal columns */
  gap: 48px;
}

/* Or magazine-style */
.layout-magazine {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto auto;
}

.featured {
  grid-column: 2 / 3;
  grid-row: 1 / 3;
}
```

### Overlapping Elements
```css
.card-overlap {
  position: relative;
}

.card-image {
  position: relative;
  z-index: 1;
}

.card-content {
  position: relative;
  z-index: 2;
  margin-top: -60px;
  margin-left: 40px;
  background: white;
  padding: 32px;
}
```

### Diagonal Flow
```css
.diagonal-section {
  clip-path: polygon(0 0, 100% 5%, 100% 100%, 0 95%);
  padding: 120px 0;
}

/* Or with transform */
.diagonal-bg {
  transform: skewY(-3deg);
}

.diagonal-content {
  transform: skewY(3deg); /* Counter-rotate content */
}
```

---

## Negative Space

### Generous Whitespace
```css
.hero {
  padding: 160px 0;
  min-height: 100vh;
}

.section {
  padding: 120px 0;
}

.content {
  max-width: 720px; /* Narrow reading width */
  margin: 0 auto;
}
```

### Controlled Density
```css
.dense-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px; /* Tight gap */
}

.dense-card {
  padding: 16px;
  aspect-ratio: 1;
}
```

---

## Position Breaking

### Off-center Hero
```css
.hero {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 80px;
  align-items: center;
}

.hero-content {
  padding-left: 10%; /* Offset from edge */
}

.hero-image {
  margin-right: -80px; /* Bleed off edge */
}
```

### Sticky Sidebar
```css
.layout-sticky {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 48px;
}

.sidebar {
  position: sticky;
  top: 24px;
  height: fit-content;
}
```

---

## Anti-Patterns

| ❌ Generic | ✅ Distinctive |
|-----------|---------------|
| Everything centered | Intentional asymmetry |
| Equal padding everywhere | Varied spacing with purpose |
| Straight edges only | Occasional diagonals, curves |
| No overlap | Strategic layering |
| Predictable grid | Broken expectations |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [motion-design.md](motion-design.md) | Animate layout transitions |
| [typography.md](typography.md) | Typography scale for layout hierarchy |
| [../SKILL.md](../SKILL.md) | Aesthetic directions and constraints |

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-typography-system-1-modular-scale-principles"></a>

## Typography System: Modular Scale Principles through 4. Line Length Principles

**Impact:** high
**Kind:** reference
**Source:** `rules/typography-system-1-modular-scale-principles.md`

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

<a id="rule-typography-system-5-responsive-typography-principles-2"></a>

## Typography System: Responsive Typography Principles through 10. Typography Selection Checklist

**Impact:** high
**Kind:** reference
**Source:** `rules/typography-system-5-responsive-typography-principles-2.md`

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

<a id="rule-typography-system-related-3"></a>

## Typography System: Related

**Impact:** high
**Kind:** reference
**Source:** `rules/typography-system-related-3.md`

# Typography System: Related

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Typography principles and decision-making - learn to think, not memorize.
> **No fixed font names or sizes - understand the system.**

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [decision-trees.md](decision-trees-how-to-use-this-file.md) | Typography decision tree by content type |
| [ux-psychology.md](ux-psychology-1-core-ux-laws.md) | Readability psychology and cognitive load |
| [color-system.md](color-system-1-color-theory-fundamentals.md) | Text contrast and accessibility |
| [../SKILL.md](../SKILL.md) | Typography quick rules |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.

<a id="rule-typography"></a>

## Typography for Distinctive Design

**Impact:** standard
**Kind:** reference
**Source:** `rules/typography.md`

# Typography for Distinctive Design

## Scope

This reference applies only to the platforms declared in metadata and the versions confirmed in the target repository.

## Guidance

# Typography for Distinctive Design

> Break the default. Stop using Inter, Roboto, Arial.

---

## Distinctive Font Pairings

| Pairing | Display | Body | Mood |
|---------|---------|------|------|
| **Editorial** | Playfair Display | Source Sans Pro | Elegant, magazine |
| **Modern Tech** | Syne | IBM Plex Sans | Bold, technical |
| **Refined** | Fraunces | Work Sans | Warm, crafted |
| **Clean Cut** | DM Serif Display | DM Sans | Sharp, professional |
| **Brutalist** | Space Mono | Space Grotesk | Raw, technical |
| **Luxe** | Cormorant Garamond | Inter | Sophisticated |

---

## Typography Scale

```css
:root {
  /* Fluid typography with clamp */
  --text-xs: clamp(12px, 1vw, 14px);
  --text-sm: clamp(14px, 1.2vw, 16px);
  --text-base: clamp(16px, 1.5vw, 18px);
  --text-lg: clamp(18px, 2vw, 20px);
  --text-xl: clamp(24px, 3vw, 30px);
  --text-2xl: clamp(32px, 4vw, 40px);
  --text-3xl: clamp(40px, 5vw, 56px);
  --text-4xl: clamp(48px, 6vw, 72px);
  --text-hero: clamp(56px, 8vw, 120px);
}

/* Line heights */
--leading-tight: 0.95;
--leading-snug: 1.1;
--leading-normal: 1.5;
--leading-relaxed: 1.65;
```

---

## Display vs Body

**Display fonts** (headings): Character, personality, memorable
- Use sparingly: hero, h1, h2
- Large sizes: 32px+
- Tight line-height: 0.95-1.1
- Negative letter-spacing: -0.02em to -0.04em

**Body fonts** (text): Readable, neutral, comfortable
- Use everywhere else
- 16-20px base size
- Relaxed line-height: 1.5-1.65
- Normal letter-spacing

---

## Anti-Pattern: Generic Typography

| ❌ Don't | ✅ Do |
|---------|-------|
| Inter everywhere | Distinctive display + neutral body |
| System fonts | Custom Google Fonts |
| Same size for all headings | Clear hierarchy with scale |
| Default line-height | Tight for display, relaxed for body |
| No letter-spacing | Adjust per context |

---

## Loading Fonts

```html
<!-- Preconnect for performance -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Load specific weights -->
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Sans+Pro:wght@400;600&display=swap" rel="stylesheet">
```

---

## Variable Fonts

For advanced control:

```css
@font-face {
  font-family: 'Inter Variable';
  src: url('/fonts/Inter-Variable.woff2') format('woff2');
  font-weight: 100 900;
}

.dynamic-weight {
  font-family: 'Inter Variable', sans-serif;
  font-weight: 450; /* Any value 100-900 */
}
```

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [color-systems.md](color-systems.md) | Color palette to complement typography |
| [spatial-composition.md](spatial-composition.md) | Layout for text-heavy pages |
| [../SKILL.md](../SKILL.md) | Design constraints and anti-slop bans |

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-ux-psychology-1-core-ux-laws"></a>

## Ux Psychology: Core UX Laws

**Impact:** high
**Kind:** reference
**Source:** `rules/ux-psychology-1-core-ux-laws.md`

# Ux Psychology: Core UX Laws

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Deep dive into UX laws, emotional design, trust building, and behavioral psychology.

---

## 1. Core UX Laws

### Hick's Law

**Principle:** The time to make a decision increases logarithmically with the number of choices.

```
Decision Time = a + b × log₂(n + 1)
Where n = number of choices
```

**Application:**
- Navigation: Max 5-7 top-level items
- Forms: Break into steps (progressive disclosure)
- Options: Default selections when possible
- Filters: Prioritize most-used, hide advanced

**Example:**
```
❌ Bad: 15 menu items in one nav
✅ Good: 5 main categories + "More"

❌ Bad: 20 form fields at once
✅ Good: 3-step wizard with 5-7 fields each
```

---

### Fitts' Law

**Principle:** Time to reach a target = function of distance and size.

```
MT = a + b × log₂(1 + D/W)
Where D = distance, W = width
```

**Application:**
- CTAs: Make primary buttons larger (min 44px height)
- Touch targets: 44×44px minimum on mobile
- Placement: Important actions near natural cursor position
- Corners: "Magic corners" (infinite edge = easy to hit)

**Button Sizing:**
```css
/* Size by importance */
.btn-primary { height: 48px; padding: 0 24px; }
.btn-secondary { height: 40px; padding: 0 16px; }
.btn-tertiary { height: 36px; padding: 0 12px; }

/* Mobile touch targets */
@media (hover: none) {
  .btn { min-height: 44px; min-width: 44px; }
}
```

---

### Miller's Law

**Principle:** Average person can hold 7±2 chunks in working memory.

**Application:**
- Lists: Group into chunks of 5-7 items
- Navigation: Max 7 menu items
- Content: Break long content with headings
- Phone numbers: 555-123-4567 (chunked)

**Chunking Example:**
```
❌ 5551234567
✅ 555-123-4567

❌ Long paragraph of text without breaks
✅ Short paragraphs
   With bullet points
   And subheadings
```

---

### Von Restorff Effect (Isolation Effect)

**Principle:** An item that stands out is more likely to be remembered.

**Application:**
- CTA buttons: Distinct color from other elements
- Pricing: Highlight recommended plan
- Important info: Visual differentiation
- New features: Badge or callout

**Example:**
```css
/* All buttons gray, primary stands out */
.btn { background: #E5E7EB; }
.btn-primary { background: #3B82F6; }

/* Recommended plan highlighted */
.pricing-card { border: 1px solid #E5E7EB; }
.pricing-card.popular {
  border: 2px solid #3B82F6;
  box-shadow: var(--shadow-lg);
}
```

---

### Serial Position Effect

**Principle:** Items at the beginning (primacy) and end (recency) of a list are remembered best.

**Application:**
- Navigation: Most important items first and last
- Lists: Key info at top and bottom
- Forms: Most critical fields at start
- CTAs: Repeat at top and bottom of long pages

**Example:**
```
Navigation: Home | [key items] | Contact

Long landing page:
- CTA at hero (top)
- Content sections
- CTA repeated at bottom
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.

<a id="rule-ux-psychology-2-emotional-design-don-norman-2"></a>

## Ux Psychology: Emotional Design (Don Norman)

**Impact:** high
**Kind:** reference
**Source:** `rules/ux-psychology-2-emotional-design-don-norman-2.md`

# Ux Psychology: Emotional Design (Don Norman)

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Deep dive into UX laws, emotional design, trust building, and behavioral psychology.

---

## 2. Emotional Design (Don Norman)

### Three Levels of Processing

```
┌─────────────────────────────────────────────────────────────┐
│  VISCERAL (Lizard Brain)                                    │
│  ─────────────────────                                      │
│  • Immediate, automatic reaction                            │
│  • First impressions (first 50ms)                          │
│  • Aesthetics: colors, shapes, imagery                      │
│  • "Wow, this looks beautiful!"                            │
├─────────────────────────────────────────────────────────────┤
│  BEHAVIORAL (Functional Brain)                              │
│  ─────────────────────────────                              │
│  • Usability and function                                   │
│  • Pleasure from effective use                              │
│  • Performance, reliability, ease                           │
│  • "This works exactly how I expected!"                    │
├─────────────────────────────────────────────────────────────┤
│  REFLECTIVE (Conscious Brain)                               │
│  ─────────────────────────────                              │
│  • Conscious thought and meaning                            │
│  • Personal identity and values                             │
│  • Long-term memory and loyalty                             │
│  • "This brand represents who I am"                        │
└─────────────────────────────────────────────────────────────┘
```

### Designing for Each Level

**Visceral:**
```css
/* Beautiful first impression */
.hero {
  background: linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%);
  color: white;
}

/* Pleasing microinteractions */
.button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

**Behavioral:**
```javascript
// Instant feedback
button.onclick = () => {
  button.disabled = true;
  button.textContent = 'Saving...';

  save().then(() => {
    showSuccess('Saved!');  // Immediate confirmation
  });
};
```

**Reflective:**
```html
<!-- Brand story and values -->
<section class="about">
  <h2>Why We Exist</h2>
  <p>We believe technology should empower, not complicate...</p>
</section>

<!-- Social proof connecting to identity -->
<blockquote>
  "This tool helped me become the designer I wanted to be."
</blockquote>
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.

<a id="rule-ux-psychology-3-trust-building-system-3"></a>

## Ux Psychology: Trust Building System through 4. Cognitive Load Management

**Impact:** high
**Kind:** reference
**Source:** `rules/ux-psychology-3-trust-building-system-3.md`

# Ux Psychology: Trust Building System through 4. Cognitive Load Management

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Deep dive into UX laws, emotional design, trust building, and behavioral psychology.

---

## 3. Trust Building System

### Trust Signal Categories

| Category | Elements | Implementation |
|----------|----------|----------------|
| **Security** | SSL, badges, encryption | Visible padlock, security logos on forms |
| **Social Proof** | Reviews, testimonials, logos | Star ratings, customer photos, brand logos |
| **Transparency** | Policies, pricing, contact | Clear links, no hidden fees, real address |
| **Professional** | Design quality, consistency | No broken elements, consistent branding |
| **Authority** | Certifications, awards, media | "As seen in...", industry certifications |

### Trust Signal Placement

```
┌────────────────────────────────────────────────────┐
│  HEADER: Trust banner ("Free shipping | 30-day    │
│          returns | Secure checkout")               │
├────────────────────────────────────────────────────┤
│  HERO: Social proof ("Trusted by 10,000+")        │
├────────────────────────────────────────────────────┤
│  PRODUCT: Reviews visible, security badges         │
├────────────────────────────────────────────────────┤
│  CHECKOUT: Payment icons, SSL badge, guarantee     │
├────────────────────────────────────────────────────┤
│  FOOTER: Contact info, policies, certifications    │
└────────────────────────────────────────────────────┘
```

### Trust-Building CSS Patterns

```css
/* Trust badge styling */
.trust-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #F0FDF4;  /* Light green = security */
  border-radius: 2px; /* Sharp for trust = precision feel */
  font-size: 14px;
  color: #166534;
}

/* Secure form indicator */
.secure-form::before {
  content: '🔒 Secure form';
  display: block;
  font-size: 12px;
  color: #166534;
  margin-bottom: 8px;
}

/* Testimonial card */
.testimonial {
  display: flex;
  gap: 16px;
  padding: 24px;
  background: white;
  border-radius: 16px; /* Friendly = larger radius */
  box-shadow: var(--shadow-sm);
}

.testimonial-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;  /* Real photos > initials */
}
```

---

> Deep dive into UX laws, emotional design, trust building, and behavioral psychology.

---

## 4. Cognitive Load Management

### Three Types of Cognitive Load

| Type | Definition | Designer's Role |
|------|------------|-----------------|
| **Intrinsic** | Inherent complexity of task | Break into smaller steps |
| **Extraneous** | Load from poor design | Eliminate this! |
| **Germane** | Effort for learning | Support and encourage |

### Reduction Strategies

**1. Simplify (Reduce Extraneous)**
```css
/* Visual noise → Clean */
.card-busy {
  border: 2px solid red;
  background: linear-gradient(...);
  box-shadow: 0 0 20px ...;
  /* Too much! */
}

.card-clean {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
  /* Calm, focused */
}
```

**2. Chunk Information**
```html
<!-- Overwhelming -->
<form>
  <!-- 15 fields at once -->
</form>

<!-- Chunked -->
<form>
  <fieldset>
    <legend>Step 1: Personal Info</legend>
    <!-- 3-4 fields -->
  </fieldset>
  <fieldset>
    <legend>Step 2: Shipping</legend>
    <!-- 3-4 fields -->
  </fieldset>
</form>
```

**3. Progressive Disclosure**
```html
<!-- Hide complexity until needed -->
<div class="filters">
  <div class="filters-basic">
    <!-- Common filters visible -->
  </div>
  <button onclick="toggleAdvanced()">
    Advanced Options ▼
  </button>
  <div class="filters-advanced" hidden>
    <!-- Complex filters hidden -->
  </div>
</div>
```

**4. Use Familiar Patterns**
```
✅ Standard navigation placement
✅ Expected icon meanings (🔍 = search)
✅ Conventional form layouts
✅ Common gesture patterns (swipe, pinch)
```

**5. Offload Information**
```html
<!-- Don't make users remember -->
<label>
  Card Number
  <input type="text" inputmode="numeric"
         autocomplete="cc-number"
         placeholder="1234 5678 9012 3456">
</label>

<!-- Show what they entered -->
<div class="order-summary">
  <p>Shipping to: <strong>John Doe, 123 Main St...</strong></p>
  <a href="#">Edit</a>
</div>
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.

<a id="rule-ux-psychology-5-persuasive-design-ethical-4"></a>

## Ux Psychology: Persuasive Design (Ethical) through 7. Emotion Color Mapping

**Impact:** high
**Kind:** reference
**Source:** `rules/ux-psychology-5-persuasive-design-ethical-4.md`

# Ux Psychology: Persuasive Design (Ethical) through 7. Emotion Color Mapping

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Deep dive into UX laws, emotional design, trust building, and behavioral psychology.

---

## 5. Persuasive Design (Ethical)

### Ethical Persuasion Techniques

| Technique | Ethical Use | Dark Pattern (Avoid) |
|-----------|-------------|----------------------|
| **Scarcity** | Real stock levels | Fake countdown timers |
| **Social Proof** | Genuine reviews | Fake testimonials |
| **Authority** | Real credentials | Misleading badges |
| **Urgency** | Real deadlines | Manufactured FOMO |
| **Commitment** | Progress saving | Guilt-tripping |

### Nudge Patterns

**Smart Defaults:**
```html
<!-- Pre-select the recommended option -->
<input type="radio" name="plan" value="monthly">
<input type="radio" name="plan" value="annual" checked>
  Annual (Save 20%)
```

**Anchoring:**
```html
<!-- Show original price to frame discount -->
<div class="price">
  <span class="original">$99</span>
  <span class="current">$79</span>
  <span class="savings">Save 20%</span>
</div>
```

**Social Proof:**
```html
<!-- Real-time activity -->
<div class="activity">
  <span class="avatar">👤</span>
  <span>Sarah from NYC just purchased</span>
</div>

<!-- Aggregate proof -->
<p>Join 50,000+ designers who use our tool</p>
```

**Progress & Commitment:**
```html
<!-- Show progress to encourage completion -->
<div class="progress">
  <div class="progress-bar" style="width: 60%"></div>
  <span>60% complete - almost there!</span>
</div>
```

---

> Deep dive into UX laws, emotional design, trust building, and behavioral psychology.

---

## 6. User Persona Quick Reference

### Gen Z (Born 1997-2012)

```
CHARACTERISTICS:
- Digital natives, mobile-first
- Value authenticity, diversity
- Short attention spans
- Visual learners

DESIGN APPROACH:
├── Colors: Vibrant, hypercolor, bold gradients
├── Typography: Large, variable, experimental
├── Layout: Vertical scroll, mobile-native
├── Interactions: Fast, gamified, gesture-based
├── Content: Short-form video, memes, stories
└── Trust: Peer reviews > authority
```

### Millennials (Born 1981-1996)

```
CHARACTERISTICS:
- Value experiences over things
- Research before buying
- Socially conscious
- Price-sensitive but quality-aware

DESIGN APPROACH:
├── Colors: Muted pastels, earth tones
├── Typography: Clean, readable sans-serif
├── Layout: Responsive, card-based
├── Interactions: Smooth, purposeful animations
├── Content: Value-driven, transparent
└── Trust: Reviews, sustainability, values
```

### Gen X (Born 1965-1980)

```
CHARACTERISTICS:
- Independent, self-reliant
- Value efficiency
- Skeptical of marketing
- Balanced tech comfort

DESIGN APPROACH:
├── Colors: Professional, trustworthy
├── Typography: Familiar, conservative
├── Layout: Clear hierarchy, traditional
├── Interactions: Functional, not flashy
├── Content: Direct, fact-based
└── Trust: Expertise, track record
```

### Baby Boomers (Born 1946-1964)

```
CHARACTERISTICS:
- Detail-oriented
- Loyal when trusted
- Value personal service
- Less tech-confident

DESIGN APPROACH:
├── Colors: High contrast, simple palette
├── Typography: Large (18px+), high contrast
├── Layout: Simple, linear, spacious
├── Interactions: Minimal, clear feedback
├── Content: Comprehensive, detailed
└── Trust: Phone numbers, real people
```

---

> Deep dive into UX laws, emotional design, trust building, and behavioral psychology.

---

## 7. Emotion Color Mapping

```
┌────────────────────────────────────────────────────┐
│  EMOTION          │  COLORS           │  USE       │
├───────────────────┼───────────────────┼────────────┤
│  Trust            │  Blue, Green      │  Finance   │
│  Excitement       │  Red, Orange      │  Sales     │
│  Calm             │  Blue, Soft green │  Wellness  │
│  Luxury           │  Black, Gold      │  Premium   │
│  Creativity       │  Teal, Pink       │  Art       │
│  Energy           │  Yellow, Orange   │  Sports    │
│  Nature           │  Green, Brown     │  Eco       │
│  Happiness        │  Yellow, Orange   │  Kids      │
│  Sophistication   │  Gray, Navy       │  Corporate │
│  Urgency          │  Red              │  Errors    │
└───────────────────┴───────────────────┴────────────┘
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.

<a id="rule-ux-psychology-8-psychology-checklist-5"></a>

## Ux Psychology: Psychology Checklist through Related

**Impact:** high
**Kind:** reference
**Source:** `rules/ux-psychology-8-psychology-checklist-5.md`

# Ux Psychology: Psychology Checklist through Related

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Deep dive into UX laws, emotional design, trust building, and behavioral psychology.

---

## 8. Psychology Checklist

### Before Launch

- [ ] **Hick's Law:** No more than 7 choices in navigation
- [ ] **Fitts' Law:** Primary CTAs are large and reachable
- [ ] **Miller's Law:** Content is chunked appropriately
- [ ] **Von Restorff:** CTAs stand out from surroundings
- [ ] **Trust:** Security badges, reviews, policies visible
- [ ] **Emotional:** Design evokes intended feeling
- [ ] **Cognitive Load:** Interface is clean, not overwhelming
- [ ] **Familiar Patterns:** Standard conventions used
- [ ] **Feedback:** All actions have clear responses
- [ ] **Accessibility:** Inclusive for all users

---

> Deep dive into UX laws, emotional design, trust building, and behavioral psychology.

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [decision-trees.md](decision-trees-how-to-use-this-file.md) | Apply UX laws to design decisions |
| [color-system.md](color-system-1-color-theory-fundamentals.md) | Emotion-color mapping for trust/urgency |
| [animation-guide.md](animation-guide-1-duration-principles.md) | Feedback animation timing |
| [../SKILL.md](../SKILL.md) | Anti-pattern bans and quick reference |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.

<a id="rule-visual-effects-1-glassmorphism-principles"></a>

## Visual Effects: Glassmorphism Principles through 4. Gradient Principles

**Impact:** high
**Kind:** reference
**Source:** `rules/visual-effects-1-glassmorphism-principles.md`

# Visual Effects: Glassmorphism Principles through 4. Gradient Principles

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Modern CSS effect principles and techniques - learn the concepts, create variations.
> **No fixed values to copy - understand the patterns.**

---

## 1. Glassmorphism Principles

### What Makes Glassmorphism Work

```
Key Properties:
├── Semi-transparent background (not solid)
├── Backdrop blur (frosted glass effect)
├── Subtle border (for definition)
└── Often: light shadow for depth
```

### The Pattern (Customize Values)

```css
.glass {
  /* Transparency: adjust opacity based on content readability */
  background: rgba(R, G, B, OPACITY);
  /* OPACITY: 0.1-0.3 for dark bg, 0.5-0.8 for light bg */

  /* Blur: higher = more frosted */
  backdrop-filter: blur(AMOUNT);
  /* AMOUNT: 8-12px subtle, 16-24px strong */

  /* Border: defines edges */
  border: 1px solid rgba(255, 255, 255, OPACITY);
  /* OPACITY: 0.1-0.3 typically */

  /* Radius: match your design system */
  border-radius: YOUR_RADIUS;
}
```

### When to Use Glassmorphism
- ✅ Over colorful/image backgrounds
- ✅ Modals, overlays, cards
- ✅ Navigation bars with scrolling content behind
- ❌ Text-heavy content (readability issues)
- ❌ Simple solid backgrounds (pointless)

### When NOT to Use
- Low contrast situations
- Accessibility-critical content
- Performance-constrained devices

---

> Modern CSS effect principles and techniques - learn the concepts, create variations.
> **No fixed values to copy - understand the patterns.**

---

## 2. Neomorphism Principles

### What Makes Neomorphism Work

```
Key Concept: Soft, extruded elements using DUAL shadows
├── Light shadow (from light source direction)
├── Dark shadow (opposite direction)
└── Background matches surrounding (same color)
```

### The Pattern

```css
.neo-raised {
  /* Background MUST match parent */
  background: SAME_AS_PARENT;

  /* Two shadows: light direction + dark direction */
  box-shadow:
    OFFSET OFFSET BLUR rgba(light-color),
    -OFFSET -OFFSET BLUR rgba(dark-color);

  /* OFFSET: typically 6-12px */
  /* BLUR: typically 12-20px */
}

.neo-pressed {
  /* Inset creates "pushed in" effect */
  box-shadow:
    inset OFFSET OFFSET BLUR rgba(dark-color),
    inset -OFFSET -OFFSET BLUR rgba(light-color);
}
```

### Accessibility Warning
⚠️ **Low contrast** - use sparingly, ensure clear boundaries

### When to Use
- Decorative elements
- Subtle interactive states
- Minimalist UI with flat colors

---

> Modern CSS effect principles and techniques - learn the concepts, create variations.
> **No fixed values to copy - understand the patterns.**

---

## 3. Shadow Hierarchy Principles

### Concept: Shadows Indicate Elevation

```
Higher elevation = larger shadow
├── Level 0: No shadow (flat on surface)
├── Level 1: Subtle shadow (slightly raised)
├── Level 2: Medium shadow (cards, buttons)
├── Level 3: Large shadow (modals, dropdowns)
└── Level 4: Deep shadow (floating elements)
```

### Shadow Properties to Adjust

```css
box-shadow: OFFSET-X OFFSET-Y BLUR SPREAD COLOR;

/* Offset: direction of shadow */
/* Blur: softness (larger = softer) */
/* Spread: size expansion */
/* Color: typically black with low opacity */
```

### Principles for Natural Shadows

1. **Y-offset larger than X** (light comes from above)
2. **Low opacity** (5-15% for subtle, 15-25% for pronounced)
3. **Multiple layers** for realism (ambient + direct)
4. **Blur scales with offset** (larger offset = larger blur)

### Dark Mode Shadows
- Shadows less visible on dark backgrounds
- May need to increase opacity
- Or use glow/highlight instead

---

> Modern CSS effect principles and techniques - learn the concepts, create variations.
> **No fixed values to copy - understand the patterns.**

---

## 4. Gradient Principles

### Types and When to Use

| Type | Pattern | Use Case |
|------|---------|----------|
| **Linear** | Color A → Color B along line | Backgrounds, buttons, headers |
| **Radial** | Center → outward | Spotlights, focal points |
| **Conic** | Around center | Pie charts, creative effects |

### Creating Harmonious Gradients

```
Good Gradient Rules:
├── Use ADJACENT colors on wheel (analogous)
├── Or same hue with different lightness
├── Avoid complementary (can look harsh)
└── Add middle stops for smoother transitions
```

### Gradient Syntax Pattern

```css
.gradient {
  background: linear-gradient(
    DIRECTION,           /* angle or to-keyword */
    COLOR-STOP-1,        /* color + optional position */
    COLOR-STOP-2,
    /* ... more stops */
  );
}

/* DIRECTION examples: */
/* 90deg, 135deg, to right, to bottom right */
```

### Mesh Gradients

```
Multiple radial gradients overlapped:
├── Each at different position
├── Each with transparent falloff
├── **Mandatory for "Wow" factor in Hero sections**
└── Creates organic, colorful effect (Search: "Aurora Gradient CSS")
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.

<a id="rule-visual-effects-5-border-effects-principles-2"></a>

## Visual Effects: Border Effects Principles through 10. Effect Selection Checklist

**Impact:** high
**Kind:** reference
**Source:** `rules/visual-effects-5-border-effects-principles-2.md`

# Visual Effects: Border Effects Principles through 10. Effect Selection Checklist

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Modern CSS effect principles and techniques - learn the concepts, create variations.
> **No fixed values to copy - understand the patterns.**

---

## 5. Border Effects Principles

### Gradient Borders

```
Technique: Pseudo-element with gradient background
├── Element has padding = border width
├── Pseudo-element fills with gradient
└── Mask or clip creates border effect
```

### Animated Borders

```
Technique: Rotating gradient or conic sweep
├── Pseudo-element larger than content
├── Animation rotates the gradient
└── Overflow hidden clips to shape
```

### Glow Borders

```css
/* Multiple box-shadows create glow */
box-shadow:
  0 0 SMALL-BLUR COLOR,
  0 0 MEDIUM-BLUR COLOR,
  0 0 LARGE-BLUR COLOR;

/* Each layer adds to the glow */
```

---

> Modern CSS effect principles and techniques - learn the concepts, create variations.
> **No fixed values to copy - understand the patterns.**

---

## 6. Glow Effects Principles

### Text Glow

```css
text-shadow:
  0 0 BLUR-1 COLOR,
  0 0 BLUR-2 COLOR,
  0 0 BLUR-3 COLOR;

/* Multiple layers = stronger glow */
/* Larger blur = softer spread */
```

### Element Glow

```css
box-shadow:
  0 0 BLUR-1 COLOR,
  0 0 BLUR-2 COLOR;

/* Use color matching element for realistic glow */
/* Lower opacity for subtle, higher for neon */
```

### Pulsing Glow Animation

```css
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 SMALL-BLUR COLOR; }
  50% { box-shadow: 0 0 LARGE-BLUR COLOR; }
}

/* Easing and duration affect feel */
```

---

> Modern CSS effect principles and techniques - learn the concepts, create variations.
> **No fixed values to copy - understand the patterns.**

---

## 7. Overlay Techniques

### Gradient Overlay on Images

```
Purpose: Improve text readability over images
Pattern: Gradient from transparent to opaque
Position: Where text will appear
```

```css
.overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    DIRECTION,
    transparent PERCENTAGE,
    rgba(0,0,0,OPACITY) 100%
  );
}
```

### Colored Overlay

```css
/* Blend mode or layered gradient */
background:
  linear-gradient(YOUR-COLOR-WITH-OPACITY),
  url('image.jpg');
```

---

> Modern CSS effect principles and techniques - learn the concepts, create variations.
> **No fixed values to copy - understand the patterns.**

---

## 8. Modern CSS Techniques

### Container Queries (Concept)

```
Instead of viewport breakpoints:
├── Component responds to ITS container
├── Truly modular, reusable components
└── Syntax: @container (condition) { }
```

### :has() Selector (Concept)

```
Parent styling based on children:
├── "Parent that has X child"
├── Enables previously impossible patterns
└── Progressive enhancement approach
```

### Scroll-Driven Animations (Concept)

```
Animation progress tied to scroll:
├── Entry/exit animations on scroll
├── Parallax effects
├── Progress indicators
└── View-based or scroll-based timeline
```

---

> Modern CSS effect principles and techniques - learn the concepts, create variations.
> **No fixed values to copy - understand the patterns.**

---

## 9. Performance Principles

### GPU-Accelerated Properties

```
CHEAP to animate (GPU):
├── transform (translate, scale, rotate)
└── opacity

EXPENSIVE to animate (CPU):
├── width, height
├── top, left, right, bottom
├── margin, padding
└── box-shadow (recalculates)
```

### will-change Usage

```css
/* Use sparingly, only for heavy animations */
.heavy-animation {
  will-change: transform;
}

/* Remove after animation if possible */
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable or minimize animations */
  /* Respect user preference */
}
```

---

> Modern CSS effect principles and techniques - learn the concepts, create variations.
> **No fixed values to copy - understand the patterns.**

---

## 10. Effect Selection Checklist

Before applying any effect:

- [ ] **Does it serve a purpose?** (not just decoration)
- [ ] **Is it appropriate for the context?** (brand, audience)
- [ ] **Have you varied from previous projects?** (avoid repetition)
- [ ] **Is it accessible?** (contrast, motion sensitivity)
- [ ] **Is it performant?** (especially on mobile)
- [ ] **Did you ask user preference?** (if style open-ended)

### Anti-Patterns

- ❌ Glassmorphism on every element (kitsch)
- ❌ Dark + neon as default (lazy AI look)
- ❌ **Static/Flat designs with no depth (FAILED)**
- ❌ Effects that hurt readability
- ❌ Animations without purpose

---

> **Remember**: Effects enhance meaning. Choose based on purpose and context, not because it "looks cool."

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.

<a id="rule-visual-effects-related-3"></a>

## Visual Effects: Related

**Impact:** high
**Kind:** reference
**Source:** `rules/visual-effects-related-3.md`

# Visual Effects: Related

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Modern CSS effect principles and techniques - learn the concepts, create variations.
> **No fixed values to copy - understand the patterns.**

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [animation-guide.md](animation-guide-1-duration-principles.md) | Animation timing for effects |
| [motion-graphics.md](motion-graphics-1-lottie-animations.md) | Advanced Lottie, GSAP, 3D effects |
| [color-system.md](color-system-1-color-theory-fundamentals.md) | Color for gradients and glows |
| [../SKILL.md](../SKILL.md) | Anti-pattern bans |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
