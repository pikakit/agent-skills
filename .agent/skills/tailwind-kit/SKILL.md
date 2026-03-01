---
name: tailwind-kit
description: >-
  Tailwind CSS v4 principles. CSS-first configuration, container queries, modern patterns.
  Triggers on: Tailwind, CSS, styling, utility classes.
  Coordinates with: design-system, web-core.
metadata:
  version: "2.0.0"
  category: "architecture"
  triggers: "Tailwind, CSS, styling, utility classes"
  success_metrics: "styles applied, design consistent"
  coordinates_with: "design-system, web-core"
---

# Tailwind Kit — Tailwind CSS v4 Patterns

> CSS-first `@theme`. OKLCH colors. Container queries. Mobile-first responsive.

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Styling components | Use utility classes |
| Theme setup | CSS-first `@theme` |
| Dark mode | Use `dark:` prefix |
| Responsive | Mobile-first breakpoints |
| Migrating v3 → v4 | Check migration table |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Tailwind class recommendations | Design theory (→ design-system) |
| @theme configuration (OKLCH) | Next.js integration (→ nextjs-pro) |
| v3 → v4 migration paths | AI design (→ studio) |
| Layout + responsive patterns | CSS processing pipeline |

**Expert decision skill:** Produces class recommendations. Does not write files.

---

## v3 → v4 Migration (3 Breaking Changes)

| v3 (Legacy) | v4 (Current) |
|-------------|-------------|
| `tailwind.config.js` | CSS-based `@theme` |
| PostCSS plugin | Oxide engine (10× faster) |
| JIT mode | Native, always-on |

---

## Core Patterns (4 — Fixed)

### Theme (CSS-First)
```css
@theme {
  --color-primary: oklch(0.7 0.15 250);
  --color-surface: oklch(0.98 0 0);
  --font-sans: 'Inter', system-ui, sans-serif;
}
```

### Responsive vs Container
| Prefix | Responds To |
|--------|-------------|
| `md:` | Viewport width |
| `@md:` | Parent container width |

### Dark Mode
```html
<div class="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
```

---

## Layout Patterns (4 — Deterministic)

| Pattern | Classes |
|---------|---------|
| Center both | `flex items-center justify-center` |
| Vertical stack | `flex flex-col gap-4` |
| Space between | `flex justify-between items-center` |
| Auto-fit grid | `grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]` |

---

## OKLCH Color System (3 Layers)

| Layer | Example | Purpose |
|-------|---------|---------|
| Primitive | `--blue-500` | Raw values |
| Semantic | `--color-primary` | Purpose-based |
| Component | `--button-bg` | Component-specific |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNKNOWN_LAYOUT` | Yes | Layout type not one of 4 |
| `ERR_UNKNOWN_COLOR_LAYER` | Yes | Color layer not one of 3 |
| `ERR_VERSION_MISMATCH` | Yes | Mixing v3 config with v4 |

**Zero internal retries.** Same use case = same class recommendation.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Arbitrary values everywhere | Use design system scale |
| `!important` | Fix specificity |
| Inline `style=` | Use utilities |
| Heavy `@apply` | Prefer components |
| Mix v3 config with v4 | Migrate fully |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [v4-config.md](references/v4-config.md) | Full v4 configuration | New project setup |
| [responsive.md](references/responsive.md) | Breakpoints + container queries | Responsive design |
| [components.md](references/components.md) | Component extraction | Component patterns |
| [engineering-spec.md](references/engineering-spec.md) | Full spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `design-system` | Skill | Design patterns |
| `nextjs-pro` | Skill | Next.js styling |
| `studio` | Skill | AI design |

---

⚡ PikaKit v3.9.70
