---
name: tailwind-kit
description: >-
  Tailwind CSS v4 principles. CSS-first configuration, container queries, modern patterns.
  Triggers on: Tailwind, CSS, styling, utility classes.
  Coordinates with: design-system, web-core.
metadata:
  category: "architecture"
  version: "2.0.0"
  triggers: "Tailwind, CSS, styling, utility classes"
  coordinates_with: "design-system, web-core"
  success_metrics: "styles applied, design consistent"
---

# Tailwind CSS v4 Patterns

> **Purpose:** Modern utility-first CSS with CSS-native configuration

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Styling components | Use utility classes |
| Theme setup | CSS-first @theme |
| Dark mode | Use dark: prefix |
| Responsive | Mobile-first breakpoints |

---

## Quick Reference

| Task | Pattern |
|------|---------|
| **Theme** | `@theme { --color-primary: oklch(...); }` |
| **Container Query** | `@container` + `@sm:`, `@md:`, `@lg:` |
| **Dark Mode** | `dark:bg-zinc-900 dark:text-white` |
| **Center** | `flex items-center justify-center` |
| **Responsive** | `w-full md:w-1/2 lg:w-1/3` |

---

## Tailwind v4 Changes

| v3 (Legacy) | v4 (Current) |
|-------------|--------------|
| `tailwind.config.js` | CSS-based `@theme` |
| PostCSS plugin | Oxide engine (10x faster) |
| JIT mode | Native, always-on |

---

## Core Patterns

### Theme (CSS-First)

```css
@theme {
  --color-primary: oklch(0.7 0.15 250);
  --color-surface: oklch(0.98 0 0);
  --font-sans: 'Inter', system-ui, sans-serif;
  --spacing-md: 1rem;
}
```

### Container Queries

| Type | Responds To |
|------|-------------|
| `md:` | Viewport width |
| `@md:` | Parent container width |

### Dark Mode

```html
<div class="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
```

### Responsive (Mobile-First)

```html
<div class="w-full md:w-1/2 lg:w-1/3">
```

---

## Layout Patterns

| Pattern | Classes |
|---------|---------|
| Center both | `flex items-center justify-center` |
| Vertical stack | `flex flex-col gap-4` |
| Space between | `flex justify-between items-center` |
| Auto-fit grid | `grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]` |

---

## Color System (OKLCH)

| Layer | Example | Purpose |
|-------|---------|---------|
| **Primitive** | `--blue-500` | Raw values |
| **Semantic** | `--color-primary` | Purpose-based |
| **Component** | `--button-bg` | Component-specific |

---

## Typography

| Class | Size | Use |
|-------|------|-----|
| `text-xs` | 0.75rem | Labels |
| `text-sm` | 0.875rem | Secondary |
| `text-base` | 1rem | Body |
| `text-lg` | 1.125rem | Lead |
| `text-xl+` | 1.25rem+ | Headings |

---

## Animation

| Class | Effect |
|-------|--------|
| `animate-spin` | Rotation |
| `animate-pulse` | Opacity pulse |
| `transition-all duration-200` | Smooth transition |
| `hover:scale-105` | Hover grow |

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

## References

For detailed patterns, see:
- [references/v4-config.md](references/v4-config.md) - Full v4 configuration
- [references/responsive.md](references/responsive.md) - Breakpoints & container queries
- [references/components.md](references/components.md) - Component extraction

---

> **Remember:** Tailwind v4 is CSS-first. Config file is now optional.

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `design-system` | Skill | Design patterns |
| `nextjs-pro` | Skill | Next.js styling |
| `studio` | Skill | AI design |

---

⚡ PikaKit v3.9.67
