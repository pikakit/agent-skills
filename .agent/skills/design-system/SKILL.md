---
name: design-system
description: >-
  Design thinking and decision-making for web UI. Color theory, typography, visual effects, and
  UX psychology. Triggers on: design, UI, UX, color palette, typography, component design.
metadata:
  author: pikakit
  version: "2.0.0"
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

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Color | LOW | `color-` |
| 2 | Motion | LOW | `motion-` |
| 3 | Animation | LOW | `animation-` |
| 4 | Decision | LOW | `decision-` |
| 5 | Design | LOW | `design-` |
| 6 | Engineering Spec | LOW | `engineering-` |
| 7 | Spatial | LOW | `spatial-` |
| 8 | Typography | LOW | `typography-` |
| 9 | General | LOW | `general-` |
| 10 | Ux | LOW | `ux-` |
| 11 | Visual | LOW | `visual-` |

## Quick Reference

### 1. Color (LOW)

- `color-system` - Color System Reference
- `color-systems` - Color Systems

### 2. Motion (LOW)

- `motion-design` - Motion Design
- `motion-graphics` - Motion Graphics Reference

### 3. Animation (LOW)

- `animation-guide` - Animation Guidelines Reference

### 4. Decision (LOW)

- `decision-trees` - Decision Trees & Context Templates

### 5. Design (LOW)

- `design-extraction` - Design Extraction from Screenshots

### 6. Engineering Spec (LOW)

- `engineering-spec` - Frontend Design — Engineering Specification

### 7. Spatial (LOW)

- `spatial-composition` - Spatial Composition

### 8. Typography (LOW)

- `typography-system` - Typography System Reference

### 9. General (LOW)

- `typography` - Typography for Distinctive Design

### 10. Ux (LOW)

- `ux-psychology` - UX Psychology Reference

### 11. Visual (LOW)

- `visual-effects` - Visual Effects Reference

## How to Use

Read individual rule files for detailed explanations and code examples:

```
rules/animation-guide.md
rules/color-system.md
```

Each rule file contains:
- Brief explanation of why it matters
- Incorrect code example with explanation
- Correct code example with explanation
- Additional context and references

## Full Compiled Document

For the complete guide with all rules expanded: `AGENTS.md`


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
