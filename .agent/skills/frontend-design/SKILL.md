---
name: frontend-design
description: >-
  Create distinctive, production-grade frontend interfaces with exceptional design quality.
  Anti-AI-slop aesthetics, bold typography, cohesive color systems, intentional motion.
  Triggers on: frontend design, UI design, landing page, design from screenshot, anti-generic.
  Coordinates with: design-system, studio, ai-artist.
metadata:
  version: "1.0.0"
  category: "design"
  triggers: "frontend design, UI design, landing page, design from screenshot, anti-generic, visual design"
  success_metrics: "distinctive design, no generic aesthetics, design extracted accurately"
  coordinates_with: "design-system, studio, ai-artist"
---

# Frontend Design

> Create distinctive interfaces that avoid "AI slop" aesthetics. Bold, intentional, memorable.

---

## Prerequisites

**Required:**
- HTML, CSS, JavaScript knowledge
- React (for component workflows)

**Optional:**
- `ai-artist` skill for asset generation
- `studio` skill for design systems

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Replicate from screenshot | Use Workflow 1: Extract → Implement → Verify |
| Build from scratch | Use Workflow 2: Design Thinking → Bold Direction → Execute |
| Avoid generic UI | Follow anti-AI-slop principles |
| Need distinctive typography | See `references/typography.md` |

---

## Two Workflows

### Workflow 1: From Screenshots

```
Screenshot → Extract Design System → Implement → Verify
```

1. **Analyze screenshot** - Extract colors, fonts, spacing, layout
2. **Document** - Create `design-guidelines.md` with specs
3. **Implement** - Match exact specifications
4. **Verify** - Compare side-by-side

### Workflow 2: From Scratch

```
Purpose → Bold Direction → Execute with Precision
```

1. **Design Thinking** - Purpose, tone, constraints, differentiation
2. **Choose Aesthetic** - Commit to extreme direction
3. **Execute** - Meticulous attention to detail

---

## Anti-AI-Slop Principles

> **Full rules:** See `studio` skill → Anti-AI-Slop Rules section (single source of truth).

**Quick summary:** Avoid generic fonts (Inter, Roboto), pure RGB colors, basic shadows, and scattered micro-interactions. Choose bold, distinctive aesthetics instead.

---

## Aesthetic Directions

| Style | Description |
|-------|-------------|
| **Brutally Minimal** | Monospace, black/white, generous whitespace |
| **Editorial Magazine** | Large display fonts, multi-column, dramatic imagery |
| **Retro-Futuristic** | Neon gradients, geometric, synthwave |
| **Organic Natural** | Earth tones, flowing shapes, soft shadows |
| **Industrial Utilitarian** | Exposed grids, monospace, technical |

---

## Quick Reference

### Typography

```css
/* Distinctive pairing */
:root {
  --font-display: 'Playfair Display', serif;
  --font-body: 'Source Sans Pro', sans-serif;
}

.heading {
  font-family: var(--font-display);
  font-size: clamp(48px, 8vw, 120px);
  font-weight: 700;
  line-height: 0.95;
}
```

### Color (Commit Fully)

```css
:root {
  --color-primary: #1A202C;
  --color-accent: #F56565;
  --color-neutral: #E2E8F0;
}
```

### Motion (Orchestrated)

```css
.hero-title { animation: fadeInUp 0.6s ease-out; }
.hero-subtitle { animation: fadeInUp 0.6s ease-out 0.2s backwards; }
.hero-cta { animation: fadeInUp 0.6s ease-out 0.4s backwards; }
```

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| `references/typography.md` | Font pairings, sizing systems | Typography decisions |
| `references/color-systems.md` | Color palettes, commitments | Color direction |
| `references/motion-design.md` | Animation patterns, anime.js | Motion design |
| `references/spatial-composition.md` | Layout breaking, asymmetry | Layout innovation |
| `references/design-extraction.md` | Screenshot analysis process | Replicate designs |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Design looks generic | Choose bolder aesthetic direction |
| Typography bland | Use distinctive display font pairing |
| Colors timid | Commit to dominant + sharp accent |
| Layout boring | Break the grid, add asymmetry |
| Motion scattered | Focus on one orchestrated entrance |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `design-system` | Skill | Design tokens, systems |
| `studio` | Skill | Styles, palettes, fonts |
| `ai-artist` | Skill | Asset generation |
| `/studio` | Workflow | Design system creation |

---

⚡ PikaKit v3.9.67
