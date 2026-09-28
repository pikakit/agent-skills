---
"title": "Animation Guide: Scroll Animation Principles through Related"
"kind": "process"
"impact": "high"
"tags":
  - "animation"
  - "guide"
"applies_to":
  - "web"
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Official documentation"
    "url": "https://www.w3.org/WAI/standards-guidelines/wcag/"
---

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
