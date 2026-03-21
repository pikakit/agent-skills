# design-system

**Version 1.0.0**
Engineering
March 2026

> **Note:**
> This document is for agents and LLMs to follow when working on design-system domain.
> Optimized for automation and consistency by AI-assisted workflows.

---

# Design System â€” UI Design Decisions

> Every pixel has purpose. Restraint is luxury. User psychology drives decisions.

---

## Prerequisites

**Required:** None â€” Design System is a knowledge-based skill with no external dependencies.

---

## When to Use

| Situation | Action |
|-----------|--------|
| Color selection | Invoke color-palette; read `rules/color-system.md` |
| Typography | Invoke typography-system; read `rules/typography-system.md` |
| Visual effects | Invoke visual-effect; read `rules/visual-effects.md` |
| Animation/motion | Invoke animation-select; read `rules/animation-guide.md` |
| UX validation | Invoke ux-audit; read `rules/ux-psychology.md` |
| Design decisions | Read `rules/decision-trees.md` |
| Architecture review | Read `rules/engineering-spec.md` |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Color theory (3 harmony types + semantic palette) | CSS/Tailwind generation (â†’ tailwind-kit) |
| Typography system (max 2 families, modular scale) | AI style recommendations (â†’ studio) |
| Visual effects selection criteria | Component implementation |
| Animation principles (3 functional categories) | WCAG accessibility (â†’ web-design-guidelines) |
| UX psychology audit (Hick's, Fitts's, Gestalt) | Image/asset generation (â†’ ai-artist) |
| 3 design anti-pattern bans | Frontend code architecture (â†’ frontend-design) |

**Pure decision skill:** Produces design specifications. Zero side effects (except UX audit script reads files).

---

## âš ï¸ Anti-Pattern Bans (Enforced on ALL Outputs)

| # | Ban | Reason |
|---|-----|--------|
| 1 | **Purple Ban** | Do not use generic purple themes (AI-generated clichÃ©) |
| 2 | **Bento Ban** | Do not default to Bento grids without explicit justification |
| 3 | **Dark Mode Default** | Do not assume dark mode unless `dark_mode_requested = true` |

---

## Color System (Quick Reference)

| Project + Mood | Harmony |
|---------------|---------|
| Professional / Corporate | Complementary |
| Creative / Playful | Triadic |
| Minimal / Luxury | Analogous |

Every palette includes: primary, secondary, accent, 5 neutrals, 4 semantic (success/warning/error/info).

---

## Typography Rules

| Rule | Constraint |
|------|-----------|
| Max font families | 2 (heading + body) |
| Scale | Modular ratio (1.25 or 1.333) |
| Line height | 1.4â€“1.6 for body text |

---

## Animation Categories

| Category | Purpose | Duration |
|----------|---------|----------|
| **Feedback** | Confirm user action | 100â€“200ms |
| **Orientation** | Guide spatial awareness | 200â€“400ms |
| **Continuity** | Connect state transitions | 300â€“500ms |

Every animation must serve one of these 3 functions. Decorative-only motion is not allowed.

---

## Studio Integration

```bash
# Generate complete design system
node .agent/skills/studio/scripts-js/search.js "<query>" --design-system

# Search specific domain
node .agent/skills/studio/scripts-js/search.js "<query>" --domain style
```

**Available domains:** style, color, typography, landing, ux, chart, product

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_MISSING_PROJECT_TYPE` | Yes | Project type not provided |
| `ERR_MISSING_BRAND_MOOD` | Yes | Brand mood not provided |
| `ERR_RULE_NOT_FOUND` | No | Rule file missing |
| `WARN_ANTI_PATTERN` | Yes | Purple/bento/dark mode ban violated |
| `WARN_UX_VIOLATION` | Yes | UX psychology law violated |

**Zero internal retries.** Deterministic; same context = same design.

---

## ðŸ“‘ Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [ux-psychology.md](rules/ux-psychology.md) | ðŸ”´ **REQUIRED** â€” Core UX psychology laws | Always |
| [color-system.md](rules/color-system.md) | Color theory and palette selection | Color decisions |
| [typography-system.md](rules/typography-system.md) | Font pairing and scale | Typography |
| [visual-effects.md](rules/visual-effects.md) | Shadows, gradients, glassmorphism | Effects selection |
| [animation-guide.md](rules/animation-guide.md) | Motion principles | Animation |
| [motion-graphics.md](rules/motion-graphics.md) | Advanced motion (Lottie, 3D) | Complex animation |
| [decision-trees.md](rules/decision-trees.md) | Design decision framework | All decisions |
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec | Architecture review |

| Script | Purpose |
|--------|---------|
| `scripts/ux_audit.js` | UX psychology audit |
| `scripts/accessibility_checker.js` | WCAG compliance audit |

**Selective reading:** Read ONLY files relevant to the request.

---

## ðŸ”— Related

| Item | Type | Purpose |
|------|------|---------|
| `studio` | Skill | AI-powered design recommendations |
| `tailwind-kit` | Skill | CSS/Tailwind implementation |
| `frontend-design` | Skill | Frontend code architecture |
| `/studio` | Workflow | Comprehensive design workflow |

---

âš¡ PikaKit v3.9.105

---

## Detailed Rules


---

### Rule: animation-guide

---
name: animation-guide
description: Animation principles â€” duration psychology, easing, micro-interactions, loading states, scroll animations
---

# Animation Guidelines Reference

> Animation principles and timing psychology - learn to decide, not copy.
> **No fixed durations to memorize - understand what affects timing.**

---

## 1. Duration Principles

### What Affects Timing

```
Factors that determine animation speed:
â”œâ”€â”€ DISTANCE: Further travel = longer duration
â”œâ”€â”€ SIZE: Larger elements = slower animations
â”œâ”€â”€ COMPLEXITY: Complex = slower to process
â”œâ”€â”€ IMPORTANCE: Critical actions = clear feedback
â””â”€â”€ CONTEXT: Urgent = fast, luxurious = slow
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

## 2. Easing Principles

### What Easing Does

```
Easing = how speed changes over time
â”œâ”€â”€ Linear: constant speed (mechanical, robotic)
â”œâ”€â”€ Ease-out: fast start, slow end (natural entry)
â”œâ”€â”€ Ease-in: slow start, fast end (natural exit)
â””â”€â”€ Ease-in-out: slow both ends (smooth, deliberate)
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

## 3. Micro-Interaction Principles

### What Makes Good Micro-Interactions

```
Purpose of micro-interactions:
â”œâ”€â”€ FEEDBACK: Confirm the action happened
â”œâ”€â”€ GUIDANCE: Show what's possible
â”œâ”€â”€ STATUS: Indicate current state
â””â”€â”€ DELIGHT: Small moments of joy
```

### Button States

```
Hover â†’ slight visual change (lift, color, scale)
Active â†’ pressed feeling (scale down, shadow change)
Focus â†’ clear indicator (outline, ring)
Loading â†’ progress indicator (spinner, skeleton)
Success â†’ confirmation (check, color)
```

### Principles

1. **Respond immediately** (under 100ms perception)
2. **Match the action** (press = `scale(0.95)`, hover = `translateY(-4px) + glow`)
3. **Be bold but smooth** (Usta iÅŸi hissettir)
4. **Be consistent** (same actions = same feedback)

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
â”œâ”€â”€ Show layout shape immediately
â”œâ”€â”€ Animate subtly (shimmer, pulse)
â”œâ”€â”€ Replace with content when ready
â””â”€â”€ Feels faster than spinner
```

### Progress Indicators

```
When to show progress:
â”œâ”€â”€ User-initiated action
â”œâ”€â”€ File uploads/downloads
â”œâ”€â”€ Multi-step processes
â””â”€â”€ Long operations

When NOT needed:
â”œâ”€â”€ Very quick operations
â”œâ”€â”€ Background tasks
â””â”€â”€ Initial page loads (skeleton better)
```

---

## 5. Page Transitions Principles

### Transition Strategy

```
Simple rule: exit fast, enter slower
â”œâ”€â”€ Outgoing content fades quickly
â”œâ”€â”€ Incoming content animates in
â””â”€â”€ Avoids "everything moving at once"
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
â”œâ”€â”€ Forward â†’ slide from right
â”œâ”€â”€ Backward â†’ slide from left
â”œâ”€â”€ Deeper â†’ scale up from center
â”œâ”€â”€ Back up â†’ scale down
```

---

## 6. Scroll Animation Principles

### Progressive Reveal

```
Content appears as user scrolls:
â”œâ”€â”€ Reduces initial cognitive load
â”œâ”€â”€ Rewards exploration
â”œâ”€â”€ Must not feel sluggish
â””â”€â”€ Option to disable (accessibility)
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

## 8. Feedback Animation Principles

### Success States

```
Celebrate appropriately:
â”œâ”€â”€ Minor action â†’ subtle check/color
â”œâ”€â”€ Major action â†’ more pronounced animation
â”œâ”€â”€ Completion â†’ satisfying animation
â””â”€â”€ Match brand personality
```

### Error States

```
Draw attention without panic:
â”œâ”€â”€ Color change (semantic red)
â”œâ”€â”€ Shake animation (brief!)
â”œâ”€â”€ Focus on error field
â””â”€â”€ Clear messaging
```

### Timing

- Success: slightly longer (enjoy the moment)
- Error: quick (don't delay action)
- Loading: continuous until complete

---

## 9. Performance Principles

### What's Cheap to Animate

```
GPU-accelerated (FAST):
â”œâ”€â”€ transform: translate, scale, rotate
â””â”€â”€ opacity: 0 to 1

CPU-intensive (SLOW):
â”œâ”€â”€ width, height
â”œâ”€â”€ top, left, right, bottom
â”œâ”€â”€ margin, padding
â”œâ”€â”€ border-radius changes
â””â”€â”€ box-shadow changes
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

- âŒ Same timing values every project
- âŒ Animation for animation's sake
- âŒ Ignoring reduced-motion preference
- âŒ Animating expensive properties
- âŒ Too many things animating at once
- âŒ Delays that frustrate users

---

> **Remember**: Animation is communication. Every motion should have meaning and serve the user experience.

---

âš¡ PikaKit v3.9.105

---

## ðŸ”— Related

| File | When to Read |
|------|-------------|
| [motion-graphics.md](motion-graphics.md) | Advanced Lottie, GSAP, particle effects |
| [visual-effects.md](visual-effects.md) | CSS effects to animate |
| [ux-psychology.md](ux-psychology.md) | Feedback psychology for micro-interactions |
| [../SKILL.md](../SKILL.md) | Animation categories quick reference |

---

### Rule: color-system

---
name: color-system
description: Color theory, 60-30-10 rule, HSL palette generation, dark mode, WCAG accessibility, Purple Ban
---

# Color System Reference

> Color theory principles, selection process, and decision-making guidelines.
> **No memorized hex codes - learn to THINK about color.**

---

## 1. Color Theory Fundamentals

### The Color Wheel

```
                    YELLOW
                      â”‚
           Yellow-    â”‚    Yellow-
           Green      â”‚    Orange
              â•²       â”‚       â•±
               â•²      â”‚      â•±
    GREEN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ â— â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ ORANGE
               â•±      â”‚      â•²
              â•±       â”‚       â•²
           Blue-      â”‚    Red-
           Green      â”‚    Orange
                      â”‚
                     RED
                      â”‚
                   PURPLE
                  â•±       â•²
             Blue-         Red-
             Purple        Purple
                  â•²       â•±
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
1. **What's the project mood?** Calm â†’ Analogous. Bold â†’ Complementary.
2. **How many colors needed?** Minimal â†’ Monochromatic. Complex â†’ Triadic.
3. **Who's the audience?** Conservative â†’ Monochromatic. Young â†’ Triadic.

---

## 2. The 60-30-10 Rule

### Distribution Principle
```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                                                 â”‚
â”‚     60% PRIMARY (Background, large areas)       â”‚
â”‚     â†’ Should be neutral or calming              â”‚
â”‚     â†’ Carries the overall tone                  â”‚
â”‚                                                 â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                    â”‚            â”‚
â”‚   30% SECONDARY                    â”‚ 10% ACCENT â”‚
â”‚   (Cards, sections, headers)       â”‚ (CTAs,     â”‚
â”‚   â†’ Supports without dominating    â”‚ highlights)â”‚
â”‚                                    â”‚ â†’ Draws    â”‚
â”‚                                    â”‚   attentionâ”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
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
| **Purple** | âš ï¸ **BANNED** - AI overuses this! | Use Deep Teal/Maroon/Emerald instead |
| **Yellow** | Optimism, attention, happy | Hard to read, use as accent |
| **Black** | Elegance, power, modern | Can feel heavy |
| **White** | Clean, minimal, open | Can feel sterile |

### Selection Process:
1. **What industry?** â†’ Narrow to 2-3 hue families
2. **What emotion?** â†’ Pick primary hue
3. **What contrast?** â†’ Decide light vs dark mode
4. **ASK USER** â†’ Confirm before proceeding

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
  50  (lightest) â†’ L: 97%
  100            â†’ L: 94%
  200            â†’ L: 86%
  300            â†’ L: 74%
  400            â†’ L: 66%
  500 (base)     â†’ L: 50-60%
  600            â†’ L: 48%
  700            â†’ L: 38%
  800            â†’ L: 30%
  900 (darkest)  â†’ L: 20%
```

### Saturation Adjustments

| Context | Saturation Level |
|---------|-----------------|
| **Professional/Corporate** | Lower (40-60%) |
| **Playful/Youth** | Higher (70-90%) |
| **Dark Mode** | Reduce by 10-20% |
| **Accessibility** | Ensure contrast, may need adjustment |

---

## 5. Context-Based Selection Guide

### Instead of Copying Palettes, Follow This Process:

**Step 1: Identify the Context**
```
What type of project?
â”œâ”€â”€ E-commerce â†’ Need trust + urgency balance
â”œâ”€â”€ SaaS/Dashboard â†’ Need low-fatigue, data focus
â”œâ”€â”€ Health/Wellness â†’ Need calming, natural feel
â”œâ”€â”€ Luxury/Premium â†’ Need understated elegance
â”œâ”€â”€ Creative/Portfolio â†’ Need personality, memorable
â””â”€â”€ Other â†’ ASK the user
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

## 6. Dark Mode Principles

### Key Rules (No Fixed Codes)

1. **Never pure black** â†’ Use very dark gray with slight hue
2. **Never pure white text** â†’ Use 87-92% lightness
3. **Reduce saturation** â†’ Vibrant colors strain eyes in dark mode
4. **Elevation = brightness** â†’ Higher elements slightly lighter

### Contrast in Dark Mode

```
Background layers (darker â†’ lighter as elevation increases):
Layer 0 (base)    â†’ Darkest
Layer 1 (cards)   â†’ Slightly lighter
Layer 2 (modals)  â†’ Even lighter
Layer 3 (popups)  â†’ Lightest dark
```

### Adapting Colors for Dark Mode

| Light Mode | Dark Mode Adjustment |
|------------|---------------------|
| High saturation accent | Reduce saturation 10-20% |
| Pure white background | Dark gray with brand hue tint |
| Black text | Light gray (not pure white) |
| Colorful backgrounds | Desaturated, darker versions |

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

## 9. Anti-Patterns to Avoid

### âŒ DON'T:
- Copy the same hex codes every project
- Default to purple/violet (AI tendency)
- Default to dark mode + neon (AI tendency)
- Use pure black (#000000) backgrounds
- Use pure white (#FFFFFF) text on dark
- Ignore user's industry context
- Skip asking user preference

### âœ… DO:
- Generate fresh palette per project
- Ask user about color preferences
- Consider industry and audience
- Use HSL for flexible manipulation
- Test contrast and accessibility
- Offer light AND dark options

---

> **Remember**: Colors are decisions, not defaults. Every project deserves thoughtful selection based on its unique context.

---

âš¡ PikaKit v3.9.105

---

## ðŸ”— Related

| File | When to Read |
|------|-------------|
| [ux-psychology.md](ux-psychology.md) | Emotion-color mapping and trust signals |
| [decision-trees.md](decision-trees.md) | Color selection decision tree |
| [visual-effects.md](visual-effects.md) | Gradient and glow effects using palette |
| [../SKILL.md](../SKILL.md) | Purple Ban enforcement |

---

### Rule: color-systems

---
name: color-systems
description: Color commitment strategy â€” dominant + accent + neutral, 4 aesthetic palettes, dark mode
---

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

| âŒ Don't | âœ… Do |
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

âš¡ PikaKit v3.9.105

---

## ðŸ”— Related

| File | When to Read |
|------|-------------|
| [typography.md](typography.md) | Font pairings that complement colors |
| [motion-design.md](motion-design.md) | Animate color transitions |
| [../SKILL.md](../SKILL.md) | Max 3 brand colors constraint |

---

### Rule: decision-trees

---
name: decision-trees
description: Design decision framework â€” master tree, audience routing, color/typography/layout selection, page templates
---

# Decision Trees & Context Templates

> Context-based design THINKING, not fixed solutions.
> **These are decision GUIDES, not copy-paste templates.**
> **For UX psychology principles (Hick's, Fitts', etc.) see:** [ux-psychology.md](ux-psychology.md)

---

## âš ï¸ How to Use This File

This file helps you DECIDE, not copy.

- Decision trees â†’ Help you THINK through options
- Templates â†’ Show STRUCTURE and PRINCIPLES, not exact values
- **Always ask user preferences** before applying
- **Generate fresh palettes** based on context, don't copy hex codes
- **Apply UX laws** from ux-psychology.md to validate decisions

---

## 1. Master Decision Tree

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                     WHAT ARE YOU BUILDING?                   â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                              â”‚
        â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
        â”‚                     â”‚                     â”‚
        â–¼                     â–¼                     â–¼
   E-COMMERCE            SaaS/APP              CONTENT
   - Product pages       - Dashboard           - Blog
   - Checkout            - Tools               - Portfolio
   - Catalog             - Admin               - Landing
        â”‚                     â”‚                     â”‚
        â–¼                     â–¼                     â–¼
   PRINCIPLES:           PRINCIPLES:           PRINCIPLES:
   - Trust               - Functionality       - Storytelling
   - Action              - Clarity             - Emotion
   - Urgency             - Efficiency          - Creativity
```

---

## 2. Audience Decision Tree

### Who is your target user?

```
TARGET AUDIENCE
      â”‚
      â”œâ”€â”€ Gen Z (18-25)
      â”‚   â”œâ”€â”€ Colors: Bold, vibrant, unexpected combinations
      â”‚   â”œâ”€â”€ Type: Large, expressive, variable
      â”‚   â”œâ”€â”€ Layout: Mobile-first, vertical, snackable
      â”‚   â”œâ”€â”€ Effects: Motion, gamification, interactive
      â”‚   â””â”€â”€ Approach: Authentic, fast, no corporate feel
      â”‚
      â”œâ”€â”€ Millennials (26-41)
      â”‚   â”œâ”€â”€ Colors: Muted, earthy, sophisticated
      â”‚   â”œâ”€â”€ Type: Clean, readable, functional
      â”‚   â”œâ”€â”€ Layout: Responsive, card-based, organized
      â”‚   â”œâ”€â”€ Effects: Subtle, purposeful only
      â”‚   â””â”€â”€ Approach: Value-driven, transparent, sustainable
      â”‚
      â”œâ”€â”€ Gen X (42-57)
      â”‚   â”œâ”€â”€ Colors: Professional, trusted, conservative
      â”‚   â”œâ”€â”€ Type: Familiar, clear, no-nonsense
      â”‚   â”œâ”€â”€ Layout: Traditional hierarchy, predictable
      â”‚   â”œâ”€â”€ Effects: Minimal, functional feedback
      â”‚   â””â”€â”€ Approach: Direct, efficient, reliable
      â”‚
      â”œâ”€â”€ Boomers (58+)
      â”‚   â”œâ”€â”€ Colors: High contrast, simple, clear
      â”‚   â”œâ”€â”€ Type: Large sizes, high readability
      â”‚   â”œâ”€â”€ Layout: Simple, linear, uncluttered
      â”‚   â”œâ”€â”€ Effects: None or very minimal
      â”‚   â””â”€â”€ Approach: Clear, detailed, trustworthy
      â”‚
      â””â”€â”€ B2B / Enterprise
          â”œâ”€â”€ Colors: Professional palette, muted
          â”œâ”€â”€ Type: Clean, data-friendly, scannable
          â”œâ”€â”€ Layout: Grid-based, organized, efficient
          â”œâ”€â”€ Effects: Professional, subtle
          â””â”€â”€ Approach: Expert, solution-focused, ROI-driven
```

---

## 3. Color Selection Decision Tree

### Instead of fixed hex codes, use this process:

```
WHAT EMOTION/ACTION DO YOU WANT?
            â”‚
            â”œâ”€â”€ Trust & Security
            â”‚   â””â”€â”€ Consider: Blue family, professional neutrals
            â”‚       â†’ ASK user for specific shade preference
            â”‚
            â”œâ”€â”€ Growth & Health
            â”‚   â””â”€â”€ Consider: Green family, natural tones
            â”‚       â†’ ASK user if eco/nature/wellness focus
            â”‚
            â”œâ”€â”€ Urgency & Action
            â”‚   â””â”€â”€ Consider: Warm colors (orange/red) as ACCENTS
            â”‚       â†’ Use sparingly, ASK if appropriate
            â”‚
            â”œâ”€â”€ Luxury & Premium
            â”‚   â””â”€â”€ Consider: Deep darks, metallics, restrained palette
            â”‚       â†’ ASK about brand positioning
            â”‚
            â”œâ”€â”€ Creative & Playful
            â”‚   â””â”€â”€ Consider: Multi-color, unexpected combinations
            â”‚       â†’ ASK about brand personality
            â”‚
            â””â”€â”€ Calm & Minimal
                â””â”€â”€ Consider: Neutrals with single accent
                    â†’ ASK what accent color fits brand
```

### The Process:
1. Identify the emotion needed
2. Narrow to color FAMILY
3. ASK user for preference within family
4. Generate fresh palette using HSL principles

---

## 4. Typography Decision Tree

```
WHAT'S THE CONTENT TYPE?
          â”‚
          â”œâ”€â”€ Data-Heavy (Dashboard, SaaS)
          â”‚   â”œâ”€â”€ Style: Sans-serif, clear, compact
          â”‚   â”œâ”€â”€ Scale: Tighter ratio (1.125-1.2)
          â”‚   â””â”€â”€ Priority: Scannability, density
          â”‚
          â”œâ”€â”€ Editorial (Blog, Magazine)
          â”‚   â”œâ”€â”€ Style: Serif heading + Sans body works well
          â”‚   â”œâ”€â”€ Scale: More dramatic (1.333+)
          â”‚   â””â”€â”€ Priority: Reading comfort, hierarchy
          â”‚
          â”œâ”€â”€ Modern Tech (Startup, SaaS Marketing)
          â”‚   â”œâ”€â”€ Style: Geometric or humanist sans
          â”‚   â”œâ”€â”€ Scale: Balanced (1.25)
          â”‚   â””â”€â”€ Priority: Modern feel, clarity
          â”‚
          â”œâ”€â”€ Luxury (Fashion, Premium)
          â”‚   â”œâ”€â”€ Style: Elegant serif or thin sans
          â”‚   â”œâ”€â”€ Scale: Dramatic (1.5-1.618)
          â”‚   â””â”€â”€ Priority: Sophistication, whitespace
          â”‚
          â””â”€â”€ Playful (Kids, Games, Casual)
              â”œâ”€â”€ Style: Rounded, friendly fonts
              â”œâ”€â”€ Scale: Varied, expressive
              â””â”€â”€ Priority: Fun, approachable, readable
```

### Selection Process:
1. Identify content type
2. Choose style DIRECTION
3. ASK user if they have brand fonts
4. Select fonts that match direction

---

## 5. E-commerce Guidelines {#e-commerce}

### Key Principles (Not Fixed Rules)
- **Trust first:** How will you show security?
- **Action-oriented:** Where are the CTAs?
- **Scannable:** Can users compare quickly?

### Color Thinking:
```
E-commerce typically needs:
â”œâ”€â”€ Trust color (often blue family) â†’ ASK preference
â”œâ”€â”€ Clean background (white/neutral) â†’ depends on brand
â”œâ”€â”€ Action accent (for CTAs, sales) â†’ depends on urgency level
â”œâ”€â”€ Success/error semantics â†’ standard conventions work
â””â”€â”€ Brand integration â†’ ASK about existing colors
```

### Layout Principles:
```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  HEADER: Brand + Search + Cart                      â”‚
â”‚  (Keep essential actions visible)                   â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  TRUST ZONE: Why trust this site?                   â”‚
â”‚  (Shipping, returns, security - if applicable)      â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  HERO: Primary message or offer                     â”‚
â”‚  (Clear CTA, single focus)                          â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  CATEGORIES: Easy navigation                        â”‚
â”‚  (Visual, filterable, scannable)                    â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  PRODUCTS: Easy comparison                          â”‚
â”‚  (Price, rating, quick actions visible)             â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  SOCIAL PROOF: Why others trust                     â”‚
â”‚  (Reviews, testimonials - if available)             â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  FOOTER: All the details                            â”‚
â”‚  (Policies, contact, trust badges)                  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### Psychology to Apply:
- Hick's Law: Limit navigation choices
- Fitts' Law: Size CTAs appropriately
- Social proof: Show where relevant
- Scarcity: Use honestly if at all

---

## 6. SaaS Dashboard Guidelines {#saas}

### Key Principles
- **Functional first:** Data clarity over decoration
- **Calm UI:** Reduce cognitive load
- **Consistent:** Predictable patterns

### Color Thinking:
```
Dashboard typically needs:
â”œâ”€â”€ Background: Light OR dark (ASK preference)
â”œâ”€â”€ Surface: Slight contrast from background
â”œâ”€â”€ Primary accent: For key actions
â”œâ”€â”€ Data colors: Success/warning/danger semantics
â””â”€â”€ Muted: For secondary information
```

### Layout Principles:
```
Consider these patterns (not mandated):

OPTION A: Sidebar + Content
â”œâ”€â”€ Fixed sidebar for navigation
â””â”€â”€ Main area for content

OPTION B: Top nav + Content
â”œâ”€â”€ Horizontal navigation
â””â”€â”€ More horizontal content space

OPTION C: Collapsed + Expandable
â”œâ”€â”€ Icon-only sidebar expands
â””â”€â”€ Maximum content area

â†’ ASK user about their navigation preference
```

### Psychology to Apply:
- Hick's Law: Group navigation items
- Miller's Law: Chunk information
- Cognitive Load: Whitespace, consistency

---

## 7. Landing Page Guidelines {#landing-page}

### Key Principles
- **Hero-centric:** First impression matters most
- **Single focus:** One primary CTA
- **Emotional:** Connect before selling

### Color Thinking:
```
Landing page typically needs:
â”œâ”€â”€ Brand primary: Hero background or accent
â”œâ”€â”€ Clean secondary: Most of page
â”œâ”€â”€ CTA color: Stands out from everything
â”œâ”€â”€ Supporting: For sections, testimonials
â””â”€â”€ ASK about brand colors first!
```

### Structure Principles:
```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  Navigation: Minimal, CTA visible                   â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  HERO: Hook + Value + CTA                          â”‚
â”‚  (Most important section, biggest impact)           â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  PROBLEM: What pain do they have?                   â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  SOLUTION: How you solve it                         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  PROOF: Why believe you?                            â”‚
â”‚  (Testimonials, logos, stats)                       â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  HOW: Simple explanation of process                 â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  PRICING: If applicable                             â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  FAQ: Address objections                            â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  FINAL CTA: Repeat main action                      â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### Psychology to Apply:
- Visceral: Beautiful hero impression
- Serial Position: Key info top/bottom
- Social Proof: Testimonials work

---

## 8. Portfolio Guidelines {#portfolio}

### Key Principles
- **Personality:** Show who you are
- **Work-focused:** Let projects speak
- **Memorable:** Stand out from templates

### Color Thinking:
```
Portfolio is personal - many options:
â”œâ”€â”€ Minimal: Neutrals + one signature accent
â”œâ”€â”€ Bold: Unexpected color choices
â”œâ”€â”€ Dark: Moody, artistic feel
â”œâ”€â”€ Light: Clean, professional feel
â””â”€â”€ ASK about personal brand identity!
```

### Structure Principles:
```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  Navigation: Unique to your personality             â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  INTRO: Who you are, what you do                   â”‚
â”‚  (Make it memorable, not generic)                   â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  WORK: Featured projects                            â”‚
â”‚  (Large, visual, interactive)                       â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  ABOUT: Personal story                              â”‚
â”‚  (Creates connection)                               â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  CONTACT: Easy to reach                             â”‚
â”‚  (Clear, direct)                                    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### Psychology to Apply:
- Von Restorff: Be uniquely memorable
- Reflective: Personal story creates connection
- Emotional: Personality over professionalism

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

## 10. Complexity Estimation

### Quick Projects (Hours)
```
Simple landing page
Small portfolio
Basic form
Single component
```
â†’ Approach: Minimal decisions, focused execution

### Medium Projects (Days)
```
Multi-page site
Dashboard with modules
E-commerce category
Complex forms
```
â†’ Approach: Establish tokens, custom components

### Large Projects (Weeks)
```
Full SaaS application
E-commerce platform
Custom design system
Complex workflows
```
â†’ Approach: Full design system, documentation, testing

---

> **Remember**: These templates show STRUCTURE and THINKING process. Every project needs fresh color, typography, and styling decisions based on its unique context. ASK when unclear.

---

âš¡ PikaKit v3.9.105

---

## ðŸ”— Related

| File | When to Read |
|------|-------------|
| [ux-psychology.md](ux-psychology.md) | UX laws applied in each template |
| [color-system.md](color-system.md) | HSL palette generation after color decision |
| [typography-system.md](typography-system.md) | Font selection after type decision |
| [../SKILL.md](../SKILL.md) | Anti-pattern bans and quick reference |

---

### Rule: design-extraction

---
name: design-extraction
description: Screenshot analysis process â€” 4-step extract-document-implement-verify workflow
---

# Design Extraction from Screenshots

> Never jump straight to code. Analyze first.

---

## Extraction Process

```
Screenshot â†’ Analyze â†’ Document â†’ Implement â†’ Verify
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

| âŒ Mistake | âœ… Fix |
|-----------|-------|
| Guessing colors | Use eyedropper tool |
| Assuming fonts | Identify with WhatFont |
| Ignoring spacing | Measure precisely |
| Skipping small details | Note every shadow, border |
| One-off extraction | Create reusable system |

---

âš¡ PikaKit v3.9.105

---

## ðŸ”— Related

| File | When to Read |
|------|-------------|
| [color-systems.md](color-systems.md) | Extracted color systematization |
| [typography.md](typography.md) | Identify extracted font pairings |
| [../SKILL.md](../SKILL.md) | Workflow 1: From Screenshots |

---

### Rule: engineering-spec

---
name: frontend-design-engineering-spec
description: Full 21-section engineering spec â€” contracts, anti-slop enforcement, compliance matrix, production checklist
---

# Frontend Design â€” Engineering Specification

> Production-grade specification for distinctive frontend interface design decisions at FAANG scale.

---

## 1. Overview

Frontend Design provides structured decision frameworks for creating distinctive, production-grade web interfaces: aesthetic direction selection (5 styles), anti-AI-slop enforcement, design extraction from screenshots, typography pairing, color system commitment, and motion orchestration. The skill operates as an expert knowledge base with 5 reference files â€” it produces design direction decisions, aesthetic specifications, and implementation guidance. It does not write CSS, create components, or render UI.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None â€” new spec for first hardening

---

## 2. Problem Statement

Frontend design at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Generic AI-generated UIs | 75% of AI-built interfaces use Inter + purple gradient + bento grid | Indistinguishable products |
| Timid color choices | 60% of projects use safe, muted palettes | No visual identity |
| Scattered animations | 45% of motion has no choreographic purpose | Visual noise, performance cost |
| Layout conformity | 70% of layouts follow identical card-grid patterns | No design differentiation |

Frontend Design eliminates these with bold aesthetic direction commitment, anti-AI-slop rules, and intentional design decisions.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Distinctive aesthetics | 1 of 5 committed directions; no "safe middle" |
| G2 | Anti-AI-slop | No generic fonts (Inter/Roboto alone), no pure RGB, no basic shadows |
| G3 | Bold typography | Display font + body font pairing; heading â‰¥ 48px |
| G4 | Committed color | Dominant primary + sharp accent; no more than 3 brand colors |
| G5 | Orchestrated motion | Single entrance sequence with staggered timing |
| G6 | Faithful reproduction | Screenshot â†’ implementation match â‰¥ 95% accuracy |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | CSS/Tailwind code generation | Owned by `tailwind-kit` / caller |
| NG2 | Design token systems | Owned by `design-system` skill |
| NG3 | AI-powered style search | Owned by `studio` skill |
| NG4 | Asset/image generation | Owned by `ai-artist` skill |
| NG5 | Component architecture | Framework-specific concern |
| NG6 | WCAG accessibility | Owned by `web-design-guidelines` skill |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Aesthetic direction selection (5 styles) | Decision framework | CSS implementation |
| Anti-AI-slop enforcement (4 banned patterns) | Ban list and alternatives | Automated linting |
| Design extraction from screenshots | Extraction process (4 steps) | Screenshot capture |
| Typography pairing guidance | Font pair selection, sizing rules | Font loading |
| Color system commitment | Palette strategy (dominant + accent) | CSS custom properties |
| Motion orchestration | Choreography patterns | Animation library code |

**Side-effect boundary:** Frontend Design produces design decisions, aesthetic guidelines, and implementation specifications. It does not create files, write CSS, or render components.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "aesthetic-direction" | "screenshot-extract" | "typography-guide" |
                              # "color-system" | "motion-guide" | "anti-slop-check" |
                              # "full-design-spec"
Context: {
  project_type: string        # "landing-page" | "dashboard" | "e-commerce" | "saas" | "portfolio"
  brand_tone: string          # "bold" | "minimal" | "editorial" | "retro" | "organic" | "industrial"
  screenshot_url: string | null  # URL or path to screenshot for extraction
  existing_fonts: Array<string> | null  # Already committed fonts
  existing_colors: Array<string> | null  # Already committed hex values
  content_type: string | null # "text-heavy" | "data-heavy" | "media-heavy" | "mixed"
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "success" | "violations" | "error"
Data: {
  aesthetic: {
    direction: string         # "brutally-minimal" | "editorial-magazine" |
                              # "retro-futuristic" | "organic-natural" | "industrial-utilitarian"
    description: string
    key_traits: Array<string>
  } | null
  extraction: {
    colors: Array<string>     # Hex values extracted
    fonts: Array<string>      # Identified font families
    spacing: string           # Spacing system description
    layout: string            # Layout structure description
  } | null
  typography: {
    display_font: string      # Recommended display font
    body_font: string         # Recommended body font
    min_heading_size: string   # e.g., "clamp(48px, 8vw, 120px)"
    line_height: number       # e.g., 0.95 for headings
  } | null
  color: {
    dominant: string          # Primary color hex
    accent: string            # Accent color hex
    neutral: string           # Neutral color hex
    max_brand_colors: number  # Always 3
  } | null
  motion: {
    pattern: string           # "staggered-entrance" | "scroll-reveal" | "orchestrated-sequence"
    duration_ms: number       # Base duration
    stagger_ms: number        # Delay between elements
  } | null
  anti_slop_violations: Array<{
    pattern: string
    alternative: string
  }> | null
  reference_file: string | null
  metadata: {
    contract_version: string
    backward_compatibility: string
  }
}
Error: ErrorSchema | null
```

#### Error Schema

```
Code: string                  # From Error Taxonomy (Section 11)
Message: string
Request_Type: string
Recoverable: boolean
```

#### Deterministic Guarantees

- Same `brand_tone` = same aesthetic direction.
- Aesthetic selection is deterministic: tone â†’ direction mapping is fixed.
- Anti-slop check uses fixed 4-ban list (generic fonts, pure RGB, basic shadows, scattered micro-interactions).
- Typography always pairs display + body font; heading minimum 48px.
- Color system always limits to 3 brand colors (dominant + accent + neutral).
- Motion always uses one orchestrated entrance pattern.

#### What Agents May Assume

- Aesthetic direction is committed (no "safe middle" options).
- Typography pairing is distinctive (not Inter/Roboto default).
- Color palette includes dominant, accent, and neutral.
- Anti-slop check covers all 4 banned AI patterns.

#### What Agents Must NOT Assume

- The skill generates CSS, HTML, or component code.
- Font files are available or loaded.
- Color values pass WCAG contrast requirements (â†’ web-design-guidelines).
- The skill creates design system tokens (â†’ design-system).

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Aesthetic direction | None; decision output |
| Screenshot extract | None; analysis output |
| Typography guide | None; recommendation |
| Color system | None; palette specification |
| Motion guide | None; choreography recommendation |
| Anti-slop check | None; violation list |

### 6.2 Workflow Contract

#### Workflow 1: From Screenshots

```
1. Receive screenshot URL/path
2. Invoke screenshot-extract to analyze design
3. Document extracted specs (caller's responsibility)
4. Implement matching design (caller's responsibility)
5. Verify side-by-side (caller's responsibility)
```

#### Workflow 2: From Scratch

```
1. Define project type and brand tone
2. Invoke aesthetic-direction for committed style
3. Invoke typography-guide for font pairing
4. Invoke color-system for palette
5. Invoke motion-guide for choreography
6. Invoke anti-slop-check to validate decisions
7. Implement design (caller's responsibility)
```

#### Execution Guarantees

- Each invocation produces a complete, self-contained recommendation.
- Anti-slop check can be invoked at any point for validation.

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Invalid request type | Return error to caller | Use supported type |
| Missing brand tone | Return error to caller | Supply brand tone |
| Anti-slop violation | Return violations status | Revise design choice |
| Screenshot not found | Return error to caller | Supply valid screenshot |

#### Retry Boundaries

- Zero internal retries. Deterministic output.

#### Isolation Model

- Each invocation is stateless and independent.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Aesthetic direction | Yes | Same tone = same direction |
| Screenshot extract | Yes | Same screenshot = same analysis |
| Typography guide | Yes | Same context = same pairing |
| Color system | Yes | Same context = same palette |
| Motion guide | Yes | Same context = same choreography |
| Anti-slop check | Yes | Same input = same violations |

---

## 7. Execution Model

### 3-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Parse** | Validate request type, brand tone, project type | Validated input or error |
| **Evaluate** | Traverse aesthetic decision tree; check anti-slop bans | Design recommendation |
| **Emit** | Return structured output with reference file link | Complete output schema |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Fixed aesthetic directions | 5 styles; no hybrid or "safe" options |
| Fixed anti-slop bans | 4 bans: generic fonts, pure RGB, basic shadows, scattered motion |
| Fixed typography minimum | Heading â‰¥ 48px; max 2 font families |
| Fixed color limit | Max 3 brand colors (dominant + accent + neutral) |
| Fixed motion rule | One orchestrated entrance; no scattered micro-interactions |
| Bold commitment | Every decision demands a committed direction |
| No external calls | All decisions based on embedded rules + reference files |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

Each invocation produces an identical output for identical inputs. No design history, no accumulated preferences.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported type |
| Missing brand tone | Return `ERR_MISSING_BRAND_TONE` | Supply brand tone |
| Missing project type | Return `ERR_MISSING_PROJECT_TYPE` | Supply project type |
| Screenshot not found | Return `ERR_SCREENSHOT_NOT_FOUND` | Supply valid path |
| Anti-slop violation | Return `WARN_AI_SLOP` with violations | Revise design |
| Reference file missing | Return `ERR_REFERENCE_NOT_FOUND` | Verify installation |

**Invariant:** Every failure returns a structured error. No silent fallback to "safe" defaults.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not supported |
| `ERR_MISSING_BRAND_TONE` | Validation | Yes | Brand tone not provided |
| `ERR_MISSING_PROJECT_TYPE` | Validation | Yes | Project type not provided |
| `ERR_SCREENSHOT_NOT_FOUND` | Validation | Yes | Screenshot path invalid |
| `ERR_REFERENCE_NOT_FOUND` | Infrastructure | No | Reference file missing |
| `WARN_AI_SLOP` | Design | Yes | Generic AI pattern detected |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Decision timeout | N/A | N/A | Synchronous; < 50ms |
| Internal retries | Zero | Zero | Deterministic output |

---

## 13. Observability & Logging Schema

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "frontend-design",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "brand_tone": "string|null",
  "aesthetic_direction": "string|null",
  "anti_slop_violations": "number",
  "status": "success|violations|error",
  "error_code": "string|null",
  "duration_ms": "number"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Direction selected | INFO | aesthetic_direction, brand_tone |
| Anti-slop violation | WARN | pattern, alternative |
| Decision failed | ERROR | error_code, message |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `frontenddesign.decision.duration` | Histogram | ms |
| `frontenddesign.direction.selected` | Counter | per direction |
| `frontenddesign.slop_violation.count` | Counter | per pattern |
| `frontenddesign.request_type.distribution` | Counter | per type |

---

## 14. Security & Trust Model

### Data Handling

- Frontend Design does not access user data, credentials, or PII.
- Screenshot paths are used for analysis guidance; no file access by this skill.
- Color values and font names are treated as configuration data.

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | CPU-bound decision tree | < 50ms; scales linearly |
| Concurrency | Stateless invocations | Unlimited parallel |
| Reference storage | 5 files (~8 KB total) | Static; no growth |
| Memory per invocation | < 1 MB | No accumulation |
| Network | Zero network calls | No external dependency |

---

## 16. Concurrency Model

Fully parallel. No shared state. No coordination required.

---

## 17. Resource Lifecycle Management

All resources scoped to invocation. No persistent handles.

---

## 18. Performance Constraints

| Operation | P50 Target | P99 Target | Hard Limit |
|-----------|-----------|-----------|------------|
| Direction selection | < 5 ms | < 15 ms | 50 ms |
| Full design spec | < 15 ms | < 40 ms | 100 ms |
| Anti-slop check | < 3 ms | < 10 ms | 30 ms |
| Output size | â‰¤ 1,000 chars | â‰¤ 3,000 chars | 5,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Aesthetic direction too extreme | Low | Client rejection | 5 directions cover broad spectrum |
| Anti-slop false positive | Medium | Blocks valid choices | 4 specific bans, not blanket rules |
| Typography pairing mismatch | Low | Readability issues | Display + body pairing is well-established |
| Color fails WCAG contrast | Medium | Accessibility violation | Downstream check by web-design-guidelines |
| Screenshot extraction inaccurate | Medium | Wrong implementation | 4-step verification process |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | âœ… | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | âœ… | Entry point under 200 lines |
| Prerequisites documented | âœ… | HTML/CSS/JS + optional skills |
| When to Use section | âœ… | Workflow-based routing table |
| Core content matches skill type | âœ… | Expert type: decision trees, aesthetic selection |
| Troubleshooting section | âœ… | Anti-patterns table |
| Related section | âœ… | Cross-links to design-system, studio, ai-artist |
| Content Map for multi-file | âœ… | Links to 5 reference files + engineering-spec.md |
| Contract versioning | âœ… | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | âœ… | This table with âœ…/âŒ + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | 5 aesthetic directions with committed traits | âœ… |
| **Functionality** | Anti-AI-slop enforcement (4 banned patterns) | âœ… |
| **Functionality** | 2 workflows (from screenshot, from scratch) | âœ… |
| **Functionality** | Typography pairing (display + body, heading â‰¥ 48px) | âœ… |
| **Functionality** | Color commitment (dominant + accent + neutral, max 3) | âœ… |
| **Functionality** | Motion orchestration (single entrance pattern) | âœ… |
| **Contracts** | Input/output/error schemas in pseudo-schema format | âœ… |
| **Contracts** | Contract versioning with semver | âœ… |
| **Failure** | Error taxonomy with 6 categorized codes | âœ… |
| **Failure** | No silent fallback to "safe" defaults | âœ… |
| **Failure** | Zero internal retries | âœ… |
| **Determinism** | Fixed directions, fixed bans, fixed limits | âœ… |
| **Security** | No PII, no credential exposure | âœ… |
| **Observability** | Structured log schema with 5 mandatory fields | âœ… |
| **Observability** | 4 metrics defined | âœ… |
| **Performance** | P50/P99 targets for all operations | âœ… |
| **Scalability** | Stateless; unlimited parallel invocations | âœ… |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | âœ… |

---

âš¡ PikaKit v3.9.105

---

## ðŸ”— Related

| File | When to Read |
|------|-------------|
| [typography.md](typography.md) | Font pairings and scale |
| [color-systems.md](color-systems.md) | Color commitment strategy |
| [motion-design.md](motion-design.md) | Animation choreography |
| [spatial-composition.md](spatial-composition.md) | Layout innovation |
| [design-extraction.md](design-extraction.md) | Screenshot analysis |
| [../SKILL.md](../SKILL.md) | Quick reference and anti-slop bans |

---

### Rule: motion-design

---
name: motion-design
description: Orchestrated entrances â€” CSS stagger, Framer Motion variants, Anime.js timeline, duration guide
---

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

| âŒ Don't | âœ… Do |
|---------|-------|
| Animate everything | Selective, purposeful motion |
| Random timing | Consistent timing system |
| Competing animations | Single focal point |
| Slow entrances (>1s) | Quick, impactful (<600ms) |
| Animation without purpose | Motion that guides attention |

---

âš¡ PikaKit v3.9.105

---

## ðŸ”— Related

| File | When to Read |
|------|-------------|
| [spatial-composition.md](spatial-composition.md) | Layout to animate |
| [color-systems.md](color-systems.md) | Color transitions |
| [../SKILL.md](../SKILL.md) | 1 orchestrated entrance rule |

---

### Rule: motion-graphics

---
name: motion-graphics
description: Advanced motion â€” Lottie, GSAP, SVG animation, 3D CSS, particles, scroll-driven animations
---

# Motion Graphics Reference

> Advanced animation techniques for premium web experiences - Lottie, GSAP, SVG, 3D, Particles.
> **Learn the principles, create WOW effects.**

---

## 1. Lottie Animations

### What is Lottie?

```
JSON-based vector animations:
â”œâ”€â”€ Exported from After Effects via Bodymovin
â”œâ”€â”€ Lightweight (smaller than GIF/video)
â”œâ”€â”€ Scalable (vector-based, no pixelation)
â”œâ”€â”€ Interactive (control playback, segments)
â””â”€â”€ Cross-platform (web, iOS, Android, React Native)
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

## 2. GSAP (GreenSock)

### What Makes GSAP Different

```
Professional timeline-based animation:
â”œâ”€â”€ Precise control over sequences
â”œâ”€â”€ ScrollTrigger for scroll-driven animations
â”œâ”€â”€ MorphSVG for shape transitions
â”œâ”€â”€ Physics-based easing
â””â”€â”€ Works with any DOM element
```

### Core Concepts

| Concept | Purpose |
|---------|---------|
| **Tween** | Single Aâ†’B animation |
| **Timeline** | Sequenced/overlapping animations |
| **ScrollTrigger** | Scroll position controls playback |
| **Stagger** | Cascade effect across elements |

### When to Use GSAP

- âœ… Complex sequenced animations
- âœ… Scroll-triggered reveals
- âœ… Precise timing control needed
- âœ… SVG morphing effects
- âŒ Simple hover/focus effects (use CSS)
- âŒ Performance-critical mobile (heavier)

### Principles

- Use timeline for orchestration (not individual tweens)
- Stagger delay: 0.05-0.15s between items
- ScrollTrigger: start at 70-80% viewport entry
- Kill animations on unmount (prevent memory leaks)

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
â”œâ”€â”€ Set dasharray to path length
â”œâ”€â”€ Set dashoffset equal to dasharray (hidden)
â”œâ”€â”€ Animate dashoffset to 0 (revealed)
â””â”€â”€ Create "drawing" effect
```

### When to Use SVG Animations

- âœ… Logo reveals, brand moments
- âœ… Icon state transitions (hamburger â†” X)
- âœ… Infographics, data visualization
- âœ… Interactive illustrations
- âŒ Photo-realistic content (use video)
- âŒ Very complex scenes (performance)

### Principles

- Get path length dynamically for accuracy
- Duration: 1-3s for full drawings
- Easing: ease-out for natural feel
- Simple fills complement, don't compete

---

## 4. 3D CSS Transforms

### Core Properties

```
CSS 3D Space:
â”œâ”€â”€ perspective: depth of 3D field (500-1500px typical)
â”œâ”€â”€ transform-style: preserve-3d (enable children 3D)
â”œâ”€â”€ rotateX/Y/Z: rotation per axis
â”œâ”€â”€ translateZ: move toward/away from viewer
â””â”€â”€ backface-visibility: show/hide back side
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
- âš ï¸ Disable or reduce on mobile

### When to Use

- âœ… Hero backgrounds (atmospheric)
- âœ… Success celebrations (confetti burst)
- âœ… Tech visualization (connected nodes)
- âŒ Content-heavy pages (distraction)
- âŒ Low-powered devices (battery drain)

---

## 6. Scroll-Driven Animations

### Native CSS (Modern)

```
CSS Scroll Timelines:
â”œâ”€â”€ animation-timeline: scroll() - document scroll
â”œâ”€â”€ animation-timeline: view() - element in viewport
â”œâ”€â”€ animation-range: entry/exit thresholds
â””â”€â”€ No JavaScript required
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

## 7. Performance Principles

### GPU vs CPU Animation

```
CHEAP (GPU-accelerated):
â”œâ”€â”€ transform (translate, scale, rotate)
â”œâ”€â”€ opacity
â””â”€â”€ filter (use sparingly)

EXPENSIVE (triggers reflow):
â”œâ”€â”€ width, height
â”œâ”€â”€ top, left, right, bottom
â”œâ”€â”€ padding, margin
â””â”€â”€ complex box-shadow
```

### Optimization Checklist

- [ ] Animate only transform/opacity
- [ ] Use `will-change` before heavy animations (remove after)
- [ ] Test on low-end devices
- [ ] Implement `prefers-reduced-motion`
- [ ] Lazy load animation libraries
- [ ] Throttle scroll-based calculations

---

## 8. Motion Graphics Decision Tree

```
What animation do you need?
â”‚
â”œâ”€â”€ Complex branded animation?
â”‚   â””â”€â”€ Lottie (After Effects export)
â”‚
â”œâ”€â”€ Sequenced scroll-triggered?
â”‚   â””â”€â”€ GSAP + ScrollTrigger
â”‚
â”œâ”€â”€ Logo/icon animation?
â”‚   â””â”€â”€ SVG animation (stroke or morph)
â”‚
â”œâ”€â”€ Interactive 3D effect?
â”‚   â””â”€â”€ CSS 3D Transforms (simple) or Three.js (complex)
â”‚
â”œâ”€â”€ Atmospheric background?
â”‚   â””â”€â”€ tsParticles or Canvas
â”‚
â””â”€â”€ Simple entrance/hover?
    â””â”€â”€ CSS @keyframes or Framer Motion
```

---

## 9. Anti-Patterns

| âŒ Don't | âœ… Do |
|----------|-------|
| Animate everything at once | Stagger and sequence |
| Use heavy libraries for simple effects | Start with CSS |
| Ignore reduced-motion | Always provide fallback |
| Block main thread | Optimize for 60fps |
| Same particles every project | Match brand/context |
| Complex effects on mobile | Feature detection |

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

> **Remember**: Motion graphics should enhance, not distract. Every animation must serve a PURPOSEâ€”feedback, guidance, delight, or storytelling.

---

âš¡ PikaKit v3.9.105

---

## ðŸ”— Related

| File | When to Read |
|------|-------------|
| [animation-guide.md](animation-guide.md) | Core animation timing and easing principles |
| [visual-effects.md](visual-effects.md) | CSS glassmorphism, gradients, shadows |
| [ux-psychology.md](ux-psychology.md) | Emotional design and feedback psychology |
| [../SKILL.md](../SKILL.md) | Animation categories quick reference |

---

### Rule: spatial-composition

---
name: spatial-composition
description: Layout innovation â€” asymmetric grids, overlapping elements, diagonal flow, negative space
---

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

| âŒ Generic | âœ… Distinctive |
|-----------|---------------|
| Everything centered | Intentional asymmetry |
| Equal padding everywhere | Varied spacing with purpose |
| Straight edges only | Occasional diagonals, curves |
| No overlap | Strategic layering |
| Predictable grid | Broken expectations |

---

âš¡ PikaKit v3.9.105

---

## ðŸ”— Related

| File | When to Read |
|------|-------------|
| [motion-design.md](motion-design.md) | Animate layout transitions |
| [typography.md](typography.md) | Typography scale for layout hierarchy |
| [../SKILL.md](../SKILL.md) | Aesthetic directions and constraints |

---

### Rule: typography

---
name: typography
description: Distinctive font pairings, fluid typography scale, display vs body rules, variable fonts
---

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

| âŒ Don't | âœ… Do |
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

âš¡ PikaKit v3.9.105

---

## ðŸ”— Related

| File | When to Read |
|------|-------------|
| [color-systems.md](color-systems.md) | Color palette to complement typography |
| [spatial-composition.md](spatial-composition.md) | Layout for text-heavy pages |
| [../SKILL.md](../SKILL.md) | Design constraints and anti-slop bans |

---

### Rule: typography-system

---
name: typography-system
description: Modular scale, font pairing, line height/length, fluid typography, weight hierarchy, F-pattern reading
---

# Typography System Reference

> Typography principles and decision-making - learn to think, not memorize.
> **No fixed font names or sizes - understand the system.**

---

## 1. Modular Scale Principles

### What is a Modular Scale?

```
A mathematical relationship between font sizes:
â”œâ”€â”€ Pick a BASE size (usually body text)
â”œâ”€â”€ Pick a RATIO (multiplier)
â””â”€â”€ Generate all sizes using: base Ã— ratio^n
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
â”œâ”€â”€ xs:  base Ã· ratioÂ²
â”œâ”€â”€ sm:  base Ã· ratio
â”œâ”€â”€ base: YOUR_BASE_SIZE
â”œâ”€â”€ lg:  base Ã— ratio
â”œâ”€â”€ xl:  base Ã— ratioÂ²
â”œâ”€â”€ 2xl: base Ã— ratioÂ³
â”œâ”€â”€ 3xl: base Ã— ratioâ´
â””â”€â”€ ... continue as needed
```

### Choosing Base Size

| Context | Base Size Range | Why |
|---------|-----------------|-----|
| Mobile-first | 16-18px | Readability on small screens |
| Desktop app | 14-16px | Information density |
| Editorial | 18-21px | Long-form reading comfort |
| Accessibility focus | 18px+ | Easier to read |

---

## 2. Font Pairing Principles

### What Makes Fonts Work Together

```
Contrast + Harmony:
â”œâ”€â”€ Different ENOUGH to create hierarchy
â”œâ”€â”€ Similar ENOUGH to feel cohesive
â””â”€â”€ Usually: serif + sans, or display + neutral
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
â”œâ”€â”€ x-height (height of lowercase letters)
â”œâ”€â”€ Letter width (narrow vs wide)
â”œâ”€â”€ Stroke contrast (thin/thick variation)
â””â”€â”€ Overall mood (formal vs casual)
```

### Safe Pairing Patterns

| Heading Style | Body Style | Mood |
|---------------|------------|------|
| Geometric sans | Humanist sans | Modern, friendly |
| Display serif | Clean sans | Editorial, sophisticated |
| Neutral sans | Same sans | Minimal, tech |
| Bold geometric | Light geometric | Contemporary |

### Avoid

- âŒ Two decorative fonts together
- âŒ Similar fonts that conflict
- âŒ More than 2-3 font families
- âŒ Fonts with very different x-heights

---

## 3. Line Height Principles

### The Relationship

```
Line height depends on:
â”œâ”€â”€ Font size (larger text = less line height needed)
â”œâ”€â”€ Line length (longer lines = more line height)
â”œâ”€â”€ Font design (some fonts need more space)
â””â”€â”€ Content type (headings vs body)
```

### Guidelines by Context

| Content Type | Line Height Range | Why |
|--------------|-------------------|-----|
| **Headings** | 1.1 - 1.3 | Short lines, want compact |
| **Body text** | 1.4 - 1.6 | Comfortable reading |
| **Long-form** | 1.6 - 1.8 | Maximum readability |
| **UI elements** | 1.2 - 1.4 | Space efficiency |

### Adjustment Factors

- **Longer line length** â†’ Increase line height
- **Larger font size** â†’ Decrease line height ratio
- **All caps** â†’ May need more line height
- **Tight tracking** â†’ May need more line height

---

## 4. Line Length Principles

### Optimal Reading Width

```
The sweet spot: 45-75 characters per line
â”œâ”€â”€ < 45: Too choppy, breaks flow
â”œâ”€â”€ 45-75: Comfortable reading
â”œâ”€â”€ > 75: Eye tracking strain
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

## 5. Responsive Typography Principles

### The Problem

```
Fixed sizes don't scale well:
â”œâ”€â”€ Desktop size too big on mobile
â”œâ”€â”€ Mobile size too small on desktop
â””â”€â”€ Breakpoint jumps feel jarring
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
| Body text | Slight scaling (1rem â†’ 1.125rem) |
| Subheadings | Moderate scaling |
| Headings | More dramatic scaling |
| Display text | Most dramatic scaling |

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
â”œâ”€â”€ 400 body + 700 heading = good
â”œâ”€â”€ 400 body + 500 emphasis = subtle
â”œâ”€â”€ 600 heading + 700 subheading = too similar
```

### Avoid

- âŒ Too many weights (max 3-4 per page)
- âŒ Adjacent weights for hierarchy (400/500)
- âŒ Heavy weights for long text

---

## 7. Letter Spacing (Tracking)

### Principles

```
Large text (headings): tighter tracking
â”œâ”€â”€ Letters are big, gaps feel larger
â””â”€â”€ Slight negative tracking looks better

Small text (body): normal or slightly wider
â”œâ”€â”€ Improves readability at small sizes
â””â”€â”€ Never negative for body text

ALL CAPS: always wider tracking
â”œâ”€â”€ Uppercase lacks ascenders/descenders
â””â”€â”€ Needs more space to feel right
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

## 8. Hierarchy Principles

### Visual Hierarchy Through Type

```
Ways to create hierarchy:
â”œâ”€â”€ SIZE (most obvious)
â”œâ”€â”€ WEIGHT (bold stands out)
â”œâ”€â”€ COLOR (contrast levels)
â”œâ”€â”€ SPACING (margins separate sections)
â””â”€â”€ POSITION (top = important)
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

## 9. Readability Psychology

### F-Pattern Reading

```
Users scan in F-pattern:
â”œâ”€â”€ Across the top (first line)
â”œâ”€â”€ Down the left side
â”œâ”€â”€ Across again (subheading)
â””â”€â”€ Continue down left
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

- âŒ Same fonts every project
- âŒ Too many font families
- âŒ Ignoring readability for style
- âŒ Fixed sizes without responsiveness
- âŒ Decorative fonts for body text

---

> **Remember**: Typography is about communication clarity. Choose based on content needs and audience, not personal preference.

---

âš¡ PikaKit v3.9.105

---

## ðŸ”— Related

| File | When to Read |
|------|-------------|
| [decision-trees.md](decision-trees.md) | Typography decision tree by content type |
| [ux-psychology.md](ux-psychology.md) | Readability psychology and cognitive load |
| [color-system.md](color-system.md) | Text contrast and accessibility |
| [../SKILL.md](../SKILL.md) | Typography quick rules |

---

### Rule: ux-psychology

---
name: ux-psychology
description: Core UX laws (Hick's, Fitts', Miller's, Von Restorff), emotional design, trust signals, cognitive load, persona guide
---

# UX Psychology Reference

> Deep dive into UX laws, emotional design, trust building, and behavioral psychology.

---

## 1. Core UX Laws

### Hick's Law

**Principle:** The time to make a decision increases logarithmically with the number of choices.

```
Decision Time = a + b Ã— logâ‚‚(n + 1)
Where n = number of choices
```

**Application:**
- Navigation: Max 5-7 top-level items
- Forms: Break into steps (progressive disclosure)
- Options: Default selections when possible
- Filters: Prioritize most-used, hide advanced

**Example:**
```
âŒ Bad: 15 menu items in one nav
âœ… Good: 5 main categories + "More" 

âŒ Bad: 20 form fields at once
âœ… Good: 3-step wizard with 5-7 fields each
```

---

### Fitts' Law

**Principle:** Time to reach a target = function of distance and size.

```
MT = a + b Ã— logâ‚‚(1 + D/W)
Where D = distance, W = width
```

**Application:**
- CTAs: Make primary buttons larger (min 44px height)
- Touch targets: 44Ã—44px minimum on mobile
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

**Principle:** Average person can hold 7Â±2 chunks in working memory.

**Application:**
- Lists: Group into chunks of 5-7 items
- Navigation: Max 7 menu items
- Content: Break long content with headings
- Phone numbers: 555-123-4567 (chunked)

**Chunking Example:**
```
âŒ 5551234567
âœ… 555-123-4567

âŒ Long paragraph of text without breaks
âœ… Short paragraphs
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

## 2. Emotional Design (Don Norman)

### Three Levels of Processing

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  VISCERAL (Lizard Brain)                                    â”‚
â”‚  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€                                      â”‚
â”‚  â€¢ Immediate, automatic reaction                            â”‚
â”‚  â€¢ First impressions (first 50ms)                          â”‚
â”‚  â€¢ Aesthetics: colors, shapes, imagery                      â”‚
â”‚  â€¢ "Wow, this looks beautiful!"                            â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  BEHAVIORAL (Functional Brain)                              â”‚
â”‚  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€                              â”‚
â”‚  â€¢ Usability and function                                   â”‚
â”‚  â€¢ Pleasure from effective use                              â”‚
â”‚  â€¢ Performance, reliability, ease                           â”‚
â”‚  â€¢ "This works exactly how I expected!"                    â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  REFLECTIVE (Conscious Brain)                               â”‚
â”‚  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€                              â”‚
â”‚  â€¢ Conscious thought and meaning                            â”‚
â”‚  â€¢ Personal identity and values                             â”‚
â”‚  â€¢ Long-term memory and loyalty                             â”‚
â”‚  â€¢ "This brand represents who I am"                        â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
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
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  HEADER: Trust banner ("Free shipping | 30-day    â”‚
â”‚          returns | Secure checkout")               â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  HERO: Social proof ("Trusted by 10,000+")        â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  PRODUCT: Reviews visible, security badges         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  CHECKOUT: Payment icons, SSL badge, guarantee     â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  FOOTER: Contact info, policies, certifications    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
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
  content: 'ðŸ”’ Secure form';
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
/* Visual noise â†’ Clean */
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
    Advanced Options â–¼
  </button>
  <div class="filters-advanced" hidden>
    <!-- Complex filters hidden -->
  </div>
</div>
```

**4. Use Familiar Patterns**
```
âœ… Standard navigation placement
âœ… Expected icon meanings (ðŸ” = search)
âœ… Conventional form layouts
âœ… Common gesture patterns (swipe, pinch)
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
  <span class="avatar">ðŸ‘¤</span>
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

## 6. User Persona Quick Reference

### Gen Z (Born 1997-2012)

```
CHARACTERISTICS:
- Digital natives, mobile-first
- Value authenticity, diversity
- Short attention spans
- Visual learners

DESIGN APPROACH:
â”œâ”€â”€ Colors: Vibrant, hypercolor, bold gradients
â”œâ”€â”€ Typography: Large, variable, experimental
â”œâ”€â”€ Layout: Vertical scroll, mobile-native
â”œâ”€â”€ Interactions: Fast, gamified, gesture-based
â”œâ”€â”€ Content: Short-form video, memes, stories
â””â”€â”€ Trust: Peer reviews > authority
```

### Millennials (Born 1981-1996)

```
CHARACTERISTICS:
- Value experiences over things
- Research before buying
- Socially conscious
- Price-sensitive but quality-aware

DESIGN APPROACH:
â”œâ”€â”€ Colors: Muted pastels, earth tones
â”œâ”€â”€ Typography: Clean, readable sans-serif
â”œâ”€â”€ Layout: Responsive, card-based
â”œâ”€â”€ Interactions: Smooth, purposeful animations
â”œâ”€â”€ Content: Value-driven, transparent
â””â”€â”€ Trust: Reviews, sustainability, values
```

### Gen X (Born 1965-1980)

```
CHARACTERISTICS:
- Independent, self-reliant
- Value efficiency
- Skeptical of marketing
- Balanced tech comfort

DESIGN APPROACH:
â”œâ”€â”€ Colors: Professional, trustworthy
â”œâ”€â”€ Typography: Familiar, conservative
â”œâ”€â”€ Layout: Clear hierarchy, traditional
â”œâ”€â”€ Interactions: Functional, not flashy
â”œâ”€â”€ Content: Direct, fact-based
â””â”€â”€ Trust: Expertise, track record
```

### Baby Boomers (Born 1946-1964)

```
CHARACTERISTICS:
- Detail-oriented
- Loyal when trusted
- Value personal service
- Less tech-confident

DESIGN APPROACH:
â”œâ”€â”€ Colors: High contrast, simple palette
â”œâ”€â”€ Typography: Large (18px+), high contrast
â”œâ”€â”€ Layout: Simple, linear, spacious
â”œâ”€â”€ Interactions: Minimal, clear feedback
â”œâ”€â”€ Content: Comprehensive, detailed
â””â”€â”€ Trust: Phone numbers, real people
```

---

## 7. Emotion Color Mapping

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  EMOTION          â”‚  COLORS           â”‚  USE       â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  Trust            â”‚  Blue, Green      â”‚  Finance   â”‚
â”‚  Excitement       â”‚  Red, Orange      â”‚  Sales     â”‚
â”‚  Calm             â”‚  Blue, Soft green â”‚  Wellness  â”‚
â”‚  Luxury           â”‚  Black, Gold      â”‚  Premium   â”‚
â”‚  Creativity       â”‚  Teal, Pink       â”‚  Art       â”‚
â”‚  Energy           â”‚  Yellow, Orange   â”‚  Sports    â”‚
â”‚  Nature           â”‚  Green, Brown     â”‚  Eco       â”‚
â”‚  Happiness        â”‚  Yellow, Orange   â”‚  Kids      â”‚
â”‚  Sophistication   â”‚  Gray, Navy       â”‚  Corporate â”‚
â”‚  Urgency          â”‚  Red              â”‚  Errors    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

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

âš¡ PikaKit v3.9.105

---

## ðŸ”— Related

| File | When to Read |
|------|-------------|
| [decision-trees.md](decision-trees.md) | Apply UX laws to design decisions |
| [color-system.md](color-system.md) | Emotion-color mapping for trust/urgency |
| [animation-guide.md](animation-guide.md) | Feedback animation timing |
| [../SKILL.md](../SKILL.md) | Anti-pattern bans and quick reference |

---

### Rule: visual-effects

---
name: visual-effects
description: Glassmorphism, neumorphism, shadow hierarchy, gradients, glow, overlays, modern CSS techniques
---

# Visual Effects Reference

> Modern CSS effect principles and techniques - learn the concepts, create variations.
> **No fixed values to copy - understand the patterns.**

---

## 1. Glassmorphism Principles

### What Makes Glassmorphism Work

```
Key Properties:
â”œâ”€â”€ Semi-transparent background (not solid)
â”œâ”€â”€ Backdrop blur (frosted glass effect)
â”œâ”€â”€ Subtle border (for definition)
â””â”€â”€ Often: light shadow for depth
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
- âœ… Over colorful/image backgrounds
- âœ… Modals, overlays, cards
- âœ… Navigation bars with scrolling content behind
- âŒ Text-heavy content (readability issues)
- âŒ Simple solid backgrounds (pointless)

### When NOT to Use
- Low contrast situations
- Accessibility-critical content
- Performance-constrained devices

---

## 2. Neomorphism Principles

### What Makes Neomorphism Work

```
Key Concept: Soft, extruded elements using DUAL shadows
â”œâ”€â”€ Light shadow (from light source direction)
â”œâ”€â”€ Dark shadow (opposite direction)
â””â”€â”€ Background matches surrounding (same color)
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
âš ï¸ **Low contrast** - use sparingly, ensure clear boundaries

### When to Use
- Decorative elements
- Subtle interactive states
- Minimalist UI with flat colors

---

## 3. Shadow Hierarchy Principles

### Concept: Shadows Indicate Elevation

```
Higher elevation = larger shadow
â”œâ”€â”€ Level 0: No shadow (flat on surface)
â”œâ”€â”€ Level 1: Subtle shadow (slightly raised)
â”œâ”€â”€ Level 2: Medium shadow (cards, buttons)
â”œâ”€â”€ Level 3: Large shadow (modals, dropdowns)
â””â”€â”€ Level 4: Deep shadow (floating elements)
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

## 4. Gradient Principles

### Types and When to Use

| Type | Pattern | Use Case |
|------|---------|----------|
| **Linear** | Color A â†’ Color B along line | Backgrounds, buttons, headers |
| **Radial** | Center â†’ outward | Spotlights, focal points |
| **Conic** | Around center | Pie charts, creative effects |

### Creating Harmonious Gradients

```
Good Gradient Rules:
â”œâ”€â”€ Use ADJACENT colors on wheel (analogous)
â”œâ”€â”€ Or same hue with different lightness
â”œâ”€â”€ Avoid complementary (can look harsh)
â””â”€â”€ Add middle stops for smoother transitions
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
â”œâ”€â”€ Each at different position
â”œâ”€â”€ Each with transparent falloff
â”œâ”€â”€ **Mandatory for "Wow" factor in Hero sections**
â””â”€â”€ Creates organic, colorful effect (Search: "Aurora Gradient CSS")
```

---

## 5. Border Effects Principles

### Gradient Borders

```
Technique: Pseudo-element with gradient background
â”œâ”€â”€ Element has padding = border width
â”œâ”€â”€ Pseudo-element fills with gradient
â””â”€â”€ Mask or clip creates border effect
```

### Animated Borders

```
Technique: Rotating gradient or conic sweep
â”œâ”€â”€ Pseudo-element larger than content
â”œâ”€â”€ Animation rotates the gradient
â””â”€â”€ Overflow hidden clips to shape
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

## 8. Modern CSS Techniques

### Container Queries (Concept)

```
Instead of viewport breakpoints:
â”œâ”€â”€ Component responds to ITS container
â”œâ”€â”€ Truly modular, reusable components
â””â”€â”€ Syntax: @container (condition) { }
```

### :has() Selector (Concept)

```
Parent styling based on children:
â”œâ”€â”€ "Parent that has X child"
â”œâ”€â”€ Enables previously impossible patterns
â””â”€â”€ Progressive enhancement approach
```

### Scroll-Driven Animations (Concept)

```
Animation progress tied to scroll:
â”œâ”€â”€ Entry/exit animations on scroll
â”œâ”€â”€ Parallax effects
â”œâ”€â”€ Progress indicators
â””â”€â”€ View-based or scroll-based timeline
```

---

## 9. Performance Principles

### GPU-Accelerated Properties

```
CHEAP to animate (GPU):
â”œâ”€â”€ transform (translate, scale, rotate)
â””â”€â”€ opacity

EXPENSIVE to animate (CPU):
â”œâ”€â”€ width, height
â”œâ”€â”€ top, left, right, bottom
â”œâ”€â”€ margin, padding
â””â”€â”€ box-shadow (recalculates)
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

## 10. Effect Selection Checklist

Before applying any effect:

- [ ] **Does it serve a purpose?** (not just decoration)
- [ ] **Is it appropriate for the context?** (brand, audience)
- [ ] **Have you varied from previous projects?** (avoid repetition)
- [ ] **Is it accessible?** (contrast, motion sensitivity)
- [ ] **Is it performant?** (especially on mobile)
- [ ] **Did you ask user preference?** (if style open-ended)

### Anti-Patterns

- âŒ Glassmorphism on every element (kitsch)
- âŒ Dark + neon as default (lazy AI look)
- âŒ **Static/Flat designs with no depth (FAILED)**
- âŒ Effects that hurt readability
- âŒ Animations without purpose

---

> **Remember**: Effects enhance meaning. Choose based on purpose and context, not because it "looks cool."

---

âš¡ PikaKit v3.9.105

---

## ðŸ”— Related

| File | When to Read |
|------|-------------|
| [animation-guide.md](animation-guide.md) | Animation timing for effects |
| [motion-graphics.md](motion-graphics.md) | Advanced Lottie, GSAP, 3D effects |
| [color-system.md](color-system.md) | Color for gradients and glows |
| [../SKILL.md](../SKILL.md) | Anti-pattern bans |
