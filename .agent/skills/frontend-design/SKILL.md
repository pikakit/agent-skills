---
name: frontend-design
description: >-
  Create distinctive, production-grade frontend interfaces with exceptional design quality.
  Anti-AI-slop aesthetics, bold typography, cohesive color systems, intentional motion.
  Triggers on: frontend design, UI design, landing page, design from screenshot, anti-generic.
  Coordinates with: design-system, studio, ai-artist.
metadata:
  version: "2.0.0"
  category: "design"
  triggers: "frontend design, UI design, landing page, design from screenshot, anti-generic, visual design"
  success_metrics: "distinctive design, zero AI-slop violations, design extracted accurately"
  coordinates_with: "design-system, studio, ai-artist"
---

# Frontend Design — Distinctive Interfaces

> Bold, committed, memorable. No "safe middle." Every decision demands a direction.

---

## Prerequisites

**Required:** HTML, CSS, JavaScript knowledge; React for component workflows.
**Optional:** `ai-artist` (asset generation), `studio` (design systems).

---

## When to Use

| Situation | Action |
|-----------|--------|
| Replicate from screenshot | Workflow 1: Extract → Document → Implement → Verify |
| Build from scratch | Workflow 2: Direction → Typography → Color → Motion |
| Avoid generic UI | Run anti-slop check |
| Typography decisions | Read `references/typography.md` |
| Color direction | Read `references/color-systems.md` |
| Architecture review | Read `references/engineering-spec.md` |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Aesthetic direction selection (5 styles) | Design tokens (→ design-system) |
| Anti-AI-slop enforcement (4 bans) | AI style search (→ studio) |
| Screenshot design extraction | Asset generation (→ ai-artist) |
| Typography pairing guidance | WCAG accessibility (→ web-design-guidelines) |
| Color commitment strategy | CSS implementation (→ tailwind-kit) |
| Motion choreography | Component architecture |

**Pure decision skill:** Produces design direction and specifications. Zero side effects.

---

## Aesthetic Directions (Pick ONE — Commit Fully)

| Direction | Key Traits |
|-----------|-----------|
| **Brutally Minimal** | Monospace, black/white, generous whitespace |
| **Editorial Magazine** | Large display fonts, multi-column, dramatic imagery |
| **Retro-Futuristic** | Neon gradients, geometric, synthwave |
| **Organic Natural** | Earth tones, flowing shapes, soft shadows |
| **Industrial Utilitarian** | Exposed grids, monospace, technical |

---

## Anti-AI-Slop Bans (Enforced on ALL Outputs)

| # | Banned Pattern | Alternative |
|---|---------------|-------------|
| 1 | Generic fonts alone (Inter, Roboto) | Distinctive display font pairing |
| 2 | Pure RGB colors (#FF0000, #0000FF) | Color theory palettes with nuance |
| 3 | Basic drop shadows (0 2px 4px) | Intentional shadow systems or none |
| 4 | Scattered micro-interactions | One orchestrated entrance sequence |

> Full anti-slop rules: see `studio` skill (single source of truth).

---

## Design Constraints (Fixed)

| Constraint | Value |
|-----------|-------|
| Max font families | 2 (display + body) |
| Min heading size | 48px (via `clamp(48px, 8vw, 120px)`) |
| Max brand colors | 3 (dominant + accent + neutral) |
| Motion pattern | 1 orchestrated entrance per view |
| Base animation duration | 600ms ease-out |
| Stagger delay | 200ms between elements |

---

## Two Workflows

### Workflow 1: From Screenshots
1. Analyze screenshot — extract colors, fonts, spacing, layout
2. Document extracted specs in `design-guidelines.md`
3. Implement matching design
4. Verify side-by-side (≥ 95% accuracy)

### Workflow 2: From Scratch
1. Choose aesthetic direction (commit to one)
2. Select typography pairing
3. Commit color system (dominant + accent + neutral)
4. Design motion choreography
5. Run anti-slop check
6. Implement

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_MISSING_BRAND_TONE` | Yes | Brand tone not provided |
| `ERR_MISSING_PROJECT_TYPE` | Yes | Project type not provided |
| `ERR_SCREENSHOT_NOT_FOUND` | Yes | Screenshot path invalid |
| `ERR_REFERENCE_NOT_FOUND` | No | Reference file missing |
| `WARN_AI_SLOP` | Yes | Generic AI pattern detected |

**Zero internal retries.** Deterministic; same context = same direction.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Choose "safe middle" aesthetics | Commit to one bold direction |
| Use Inter/Roboto as only font | Pair distinctive display + body fonts |
| Use timid muted colors | Commit: dominant + sharp accent |
| Scatter random animations | One orchestrated entrance sequence |
| Copy layout patterns | Break the grid, add asymmetry |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [typography.md](references/typography.md) | Font pairings, sizing systems | Typography decisions |
| [color-systems.md](references/color-systems.md) | Color palettes, commitments | Color direction |
| [motion-design.md](references/motion-design.md) | Animation patterns | Motion design |
| [spatial-composition.md](references/spatial-composition.md) | Layout breaking, asymmetry | Layout innovation |
| [design-extraction.md](references/design-extraction.md) | Screenshot analysis process | Replicate designs |
| [engineering-spec.md](references/engineering-spec.md) | Full engineering spec | Architecture review |

**Selective reading:** Read ONLY files relevant to the request.

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `design-system` | Skill | Design tokens, systems |
| `studio` | Skill | Styles, palettes, fonts |
| `ai-artist` | Skill | Asset generation |
| `/studio` | Workflow | Design system creation |

---

⚡ PikaKit v3.9.77
