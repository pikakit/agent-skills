---
name: studio
description: >-
  AI-powered design intelligence with 50+ styles, 97 color palettes, 57 font pairings,
  and anti-AI-slop design system generation. Triggers on: design system, UI design,
  color palette, typography, style guide. Coordinates with: frontend-specialist, design-system.
metadata:
  version: "1.0.0"
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

## When to Use

| Situation | Action |
|-----------|--------|
| Need color palette | Search colors by industry/mood |
| Need typography | Search font pairings |
| Full design system | Use `--design-system` flag |
| Avoid generic AI look | Follow Anti-AI-Slop rules |

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

## ❌ Anti-AI-Slop Rules

> **Purpose:** Avoid generic designs that are recognizable as "AI-generated".

### Fonts to AVOID

| Don't Use | Use Instead |
|-----------|-------------|
| Inter | Playfair Display, Cormorant |
| Roboto | Syne, Outfit |
| Arial | Source Sans Pro, Work Sans |
| System fonts | Fraunces, IBM Plex |

**Why:** These fonts are too common, every AI suggests them → immediately recognizable as AI-generated.

### Colors to AVOID

| Don't Use | Use Instead |
|-----------|-------------|
| #FF0000 (pure red) | #DC2626, #EF4444 |
| #00FF00 (pure green) | #10B981, #059669 |
| #0000FF (pure blue) | #3B82F6, #2563EB |
| #800080 (pure purple) | #8B5CF6, #7C3AED |

**Why:** Pure RGB colors look cheap and unprofessional.

### Shadows to AVOID

```css
/* ❌ Generic AI shadow */
box-shadow: 0 2px 4px rgba(0,0,0,0.1);

/* ✅ Intentional, dramatic */
box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
```

### Backgrounds to AVOID

| Don't Use | Use Instead |
|-----------|-------------|
| Solid #FFFFFF | Subtle gradients, noise textures |
| Solid #000000 | Dark gradients, pattern overlays |
| Plain colors | Gradient meshes, glass effects |

### Animations to AVOID

```css
/* ❌ Micro-interactions everywhere */
:hover { transform: scale(1.05); }

/* ✅ One orchestrated page load */
.hero { animation: fadeInUp 0.6s ease-out; }
.hero-cta { animation: fadeInUp 0.6s ease-out 0.3s backwards; }
```

**Rule:** One orchestrated animation > many scattered micro-interactions.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Style not found | Check exact name in `data/styles.csv` |
| Color palette clash | Use adjacent colors from same palette row |
| Font loading slow | Use Google Fonts subset or local fonts |
| Animation too heavy | Reduce duration, simplify easing |

---

## 📖 References

For detailed documentation, see:
- `data/` - Raw CSV databases
- `scripts-js/` - Search implementation


---

⚡ PikaKit v3.9.67
