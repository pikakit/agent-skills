---
"title": "Motion Graphics: Lottie Animations through 4. 3D CSS Transforms"
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
