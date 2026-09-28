---
"title": "Motion Graphics: Particle Effects through 10. Quick Reference"
"kind": "reference"
"impact": "high"
"tags":
  - "motion"
  - "graphics"
"applies_to":
  - "web"
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Official documentation"
    "url": "https://www.w3.org/WAI/standards-guidelines/wcag/"
---

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
