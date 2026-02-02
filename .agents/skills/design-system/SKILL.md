---
name: design-system
description: >-
  Design thinking and decision-making for web UI. Color theory, typography, visual effects, and UX psychology.
  Triggers on: design, UI, UX, color palette, typography, component design.
  Coordinates with: web-core, tailwind-kit, visual-excellence.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
metadata:
  category: "architecture"
  success_metrics: "design system documented, UX audit passed"
  coordinates_with: "web-core, tailwind-kit, visual-excellence"
---

# Frontend Design System

> **Philosophy:** Every pixel has purpose. Restraint is luxury. User psychology drives decisions.

## 📚 Atomic Rules (Knowledge)

| Rule                                                     | Description                            |
| -------------------------------------------------------- | -------------------------------------- |
| [rules/ux-psychology.md](rules/ux-psychology.md)         | 🔴 **REQUIRED** - Core psychology laws |
| [rules/color-system.md](rules/color-system.md)           | Color theory and palette selection     |
| [rules/typography-system.md](rules/typography-system.md) | Font pairing and scale                 |
| [rules/visual-effects.md](rules/visual-effects.md)       | Shadows, gradients, glassmorphism      |
| [rules/animation-guide.md](rules/animation-guide.md)     | Motion principles                      |
| [rules/motion-graphics.md](rules/motion-graphics.md)     | Advanced motion (Lottie, 3D)           |
| [rules/decision-trees.md](rules/decision-trees.md)       | Framework for design decisions         |

## 🔧 Scripts (Execution)

| Script                | Purpose             |
| --------------------- | ------------------- |
| `scripts/ux_audit.py` | UX Pyschology Audit |

## ⚠️ Critical Anti-Patterns

- **Purple Ban**: Do not use generic purple themes.
- **Bento Ban**: Do not default to Bento grids without reason.
- **Dark Mode Default**: Do not assume dark mode unless requested.

## 🎨 Studio Integration

**Path:** `.agent/studio/`

Use Studio for AI-powered design recommendations:

```bash
# Generate complete design system
node .agent/studio/scripts-js/search.js "<query>" --design-system

# Search specific domain
node .agent/studio/scripts-js/search.js "<query>" --domain style
```

**Available Domains:** style, color, typography, landing, ux, chart, product

**Recommended Workflow:** Use `/studio` workflow for comprehensive UI design.
