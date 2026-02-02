---
name: studio
description: >-
  AI-powered design intelligence with 50+ styles, 97 color palettes, 57 font pairings,
  and anti-AI-slop design system generation. Triggers on: design system, UI design,
  color palette, typography, style guide. Coordinates with: frontend-specialist, design-system.
metadata:
  category: "design"
  triggers: "design system, UI design, color palette, typography, style guide"
  success_metrics: "design system generated, styles matched"
  coordinates_with: "frontend-specialist, design-system"
---

# Studio - Design Intelligence Skill

> Comprehensive design database with 50+ styles, 97 color palettes, 57 font pairings, 99 UX guidelines, and 25 chart types across 9 technology stacks.

---

## 🎯 Purpose

Generate design systems, color palettes, and typography recommendations based on product type, industry, and style preferences. **Searchable database with priority-based recommendations.**

---

## 📂 Skill Structure

```
studio/
├── SKILL.md           # This file (entry point)
├── data/              # CSV databases
│   ├── colors.csv     # 97 color palettes
│   ├── styles.csv     # 50+ design styles
│   ├── typography.csv # 57 font pairings
│   ├── ux-guidelines.csv
│   ├── charts.csv
│   └── ...
└── scripts-js/        # Search & generation
    ├── search.js      # Main search CLI
    ├── design_system.js
    └── core.js
```

---

## 🔧 Quick Reference

### Generate Design System

```bash
node .agent/skills/studio/scripts-js/search.js "<query>" --design-system [-p "Project Name"]
```

### Search Specific Category

```bash
# Colors
node .agent/skills/studio/scripts-js/search.js "fintech dark" --category colors

# Styles  
node .agent/skills/studio/scripts-js/search.js "minimal professional" --category styles

# Typography
node .agent/skills/studio/scripts-js/search.js "modern tech" --category typography
```

---

## 📊 Database Contents

| Category | Count | Description |
|----------|-------|-------------|
| **Styles** | 50+ | Design aesthetics (minimal, playful, elegant...) |
| **Colors** | 97 | Curated palettes with hex codes |
| **Typography** | 57 | Font pairings (heading + body) |
| **UX Guidelines** | 99 | Best practices and patterns |
| **Charts** | 25 | Data visualization types |
| **Stacks** | 9 | Technology implementations |

---

## 🤖 Meta-Agents Integration

| Phase | Agent | Action |
| ----- | ----- | ------ |
| **Design Planning** | `learner` | Analyze past successful design patterns |
| **Style Selection** | `critic` | Arbitrate conflicting design choices |
| **Post-Design** | `learner` | Log design decisions for future reference |
| **Accessibility** | `assessor` | Evaluate accessibility and UX risks |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `/studio` | Workflow | User-facing command |
| `frontend-specialist` | Agent | Uses this skill for UI work |
| `design-system` | Skill | Companion skill |

---

## 📖 References

For detailed documentation, see:
- `data/` - Raw CSV databases
- `scripts-js/` - Search implementation
