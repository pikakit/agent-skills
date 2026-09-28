# Tailwind Kit Full Agent Rules

> Deterministic compilation of 4 source rules for tailwind-kit v4.0.0. Do not edit directly.

## Rule Index

- [Component Extraction](#rule-components) (standard, reference, source: `rules/components.md`)
- [Production verification gates](#rule-production-gates) (high, process, source: `rules/production-gates.md`)
- [Responsive & Container Queries](#rule-responsive) (standard, reference, source: `rules/responsive.md`)
- [Tailwind v4 Configuration](#rule-v4-config) (standard, reference, source: `rules/v4-config.md`)

<a id="rule-components"></a>

## Component Extraction

**Impact:** standard
**Kind:** reference
**Source:** `rules/components.md`

# Component Extraction

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

# Component Extraction

> React components first. @apply only for truly static patterns. Use cva for variants.

---

## When to Extract

| Signal | Action |
|--------|--------|
| Same class combo 3+ times | Extract component |
| Complex state variants | Use `cva` for variant map |
| Design system element | Extract + document + type |

---

## cn() Utility (Essential)

```typescript
// lib/utils.ts — merge Tailwind classes safely
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Usage — last class wins, no conflicts
cn('px-4 py-2', 'px-6')        // → 'py-2 px-6'
cn('text-red-500', false && 'hidden')  // → 'text-red-500'
```

---

## Button (cva + TypeScript)

```tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base classes (always applied)
  'inline-flex items-center justify-center rounded-md font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:   'bg-primary text-white hover:bg-primary/90',
        secondary: 'bg-surface border border-zinc-200 hover:bg-zinc-50',
        ghost:     'hover:bg-zinc-100 dark:hover:bg-zinc-800',
        danger:    'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
}

// Usage
<Button variant="primary" size="lg">Save</Button>
<Button variant="ghost">Cancel</Button>
<Button variant="danger" disabled>Delete</Button>
```

---

## Card

```tsx
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-zinc-200 bg-white shadow-sm',
        'dark:border-zinc-800 dark:bg-zinc-950',
        className,
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: CardProps) {
  return <div className={cn('p-6 pb-0', className)} {...props} />
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={cn('p-6', className)} {...props} />
}

// Usage
<Card>
  <CardHeader><h3>Title</h3></CardHeader>
  <CardContent><p>Content</p></CardContent>
</Card>
```

---

## Input

```tsx
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          'h-10 w-full rounded-md border px-3 text-sm',
          'bg-white dark:bg-zinc-950',
          'border-zinc-200 dark:border-zinc-800',
          'placeholder:text-zinc-400',
          'focus:outline-none focus:ring-2 focus:ring-primary/50',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500 focus:ring-red-500/50',
          className,
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

// Usage
<Input label="Email" type="email" placeholder="you@example.com" />
<Input label="Password" error="Required" />
```

---

## @apply (Static Only — Use Sparingly)

```css
/* Only for patterns that never need props or state */
.prose-content h2 {
  @apply text-2xl font-bold mt-8 mb-4 text-zinc-900 dark:text-white;
}

.prose-content p {
  @apply text-base leading-relaxed text-zinc-600 dark:text-zinc-400;
}
```

> ⚠️ **Avoid heavy @apply.** If it needs variants, props, or state → use React component + cva.

---

## Class Ordering Convention

```html
<div class="
  /* 1. Layout */     flex items-center justify-between
  /* 2. Sizing */     w-full h-12
  /* 3. Spacing */    px-4 py-2 gap-4
  /* 4. Typography */ text-sm font-medium
  /* 5. Colors */     bg-white text-zinc-900
  /* 6. Borders */    border border-zinc-200 rounded-lg
  /* 7. Effects */    shadow-sm
  /* 8. Transitions */transition-all duration-200
  /* 9. States */     hover:bg-zinc-50 focus:ring-2
  /* 10. Dark */      dark:bg-zinc-900 dark:text-white
  /* 11. Responsive */md:flex-row md:text-base
">
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| String concat for variants | `cva` + variant map |
| `className={condition ? 'a' : 'b'}` | `cn()` with conditional |
| Heavy @apply for everything | React component + cva |
| Skip TypeScript on props | Type all component props |
| Duplicate class sets | Extract shared component |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [responsive.md](responsive.md) | Responsive patterns |
| [v4-config.md](v4-config.md) | @theme setup |
| [SKILL.md](../SKILL.md) | Patterns overview |

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-production-gates"></a>

## Production verification gates

**Impact:** high
**Kind:** process
**Source:** `rules/production-gates.md`

# Production verification gates

## Preconditions

- Confirm the target platform and dependency versions from the repository.
- Capture a reproducible baseline and define observable acceptance criteria.
- Identify a recoverable rollback point before changing code or configuration.

## Procedure

1. Apply the smallest change that satisfies the documented requirement.
2. Exercise the affected success and failure paths with the narrowest reliable check.
3. Run the repository typecheck, tests, and policy checks that cover the changed surface.
4. Inspect diagnostics for redacted, actionable evidence; a missing or failed checker is not success.

## Rollback

Restore the recorded baseline when a required check errors, the result is inconclusive, or a new regression appears. Re-run the baseline check after restoration.

## Exit Gate

Finish only when required checks execute and pass, acceptance behavior is reproduced, rollback remains available, and residual risks are reported explicitly.

<a id="rule-responsive"></a>

## Responsive & Container Queries

**Impact:** standard
**Kind:** reference
**Source:** `rules/responsive.md`

# Responsive & Container Queries

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

# Responsive & Container Queries

> Mobile-first always. Container queries for components. Viewport breakpoints for page layout.

---

## Breakpoint System

| Prefix | Min Width | Target |
|--------|-----------|--------|
| (none) | 0px | Mobile-first base |
| `sm:` | 640px | Large phone |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Laptop |
| `xl:` | 1280px | Desktop |
| `2xl:` | 1536px | Large desktop |

---

## Mobile-First Pattern

```html
<!-- Base = mobile, then override for larger -->
<div class="flex flex-col md:flex-row gap-4">
  <div class="w-full md:w-1/2 lg:w-1/3">
    <p class="text-sm md:text-base lg:text-lg">
      Responsive text
    </p>
  </div>
</div>
```

---

## Container Queries (v4 Native)

| Type | Prefix | Responds To |
|------|--------|-------------|
| Viewport | `md:` | Browser window width |
| Container | `@md:` | Parent container width |

```html
<!-- Define container on parent -->
<div class="@container">
  <!-- Children respond to parent width, not viewport -->
  <div class="flex flex-col @sm:flex-row @md:grid @md:grid-cols-3 gap-4">
    <div>Card 1</div>
    <div>Card 2</div>
    <div>Card 3</div>
  </div>
</div>

<!-- Named containers for nested contexts -->
<div class="@container/sidebar">
  <nav class="@sm/sidebar:flex @md/sidebar:flex-col">
    Links
  </nav>
</div>
```

**When to use which:**

| Scenario | Use |
|----------|-----|
| Page-level layout (header, sidebar) | Viewport `md:` |
| Reusable components (card, widget) | Container `@md:` |
| Dashboard panels | Container `@md:` |

---

## Responsive Grid Patterns

```html
<!-- Auto-fit: fills available space, wraps naturally -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  <!-- Cards -->
</div>

<!-- Auto-fit with minmax (no breakpoints needed) -->
<div class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
  <!-- Cards auto-wrap based on available space -->
</div>

<!-- Sidebar + content layout -->
<div class="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
  <aside class="hidden lg:block">Sidebar</aside>
  <main>Content</main>
</div>
```

---

## Responsive Typography

```html
<!-- Fluid heading -->
<h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
  Responsive Heading
</h1>

<!-- Fluid body with line height -->
<p class="text-sm md:text-base lg:text-lg leading-relaxed md:leading-loose">
  Body text that adapts to screen size
</p>

<!-- Clamp (v4 arbitrary) — smooth scaling without breakpoints -->
<h1 class="text-[clamp(1.5rem,4vw,3rem)] font-bold">
  Fluid without breakpoints
</h1>
```

---

## Show / Hide

```html
<!-- Hide on mobile, show on desktop -->
<nav class="hidden lg:flex">Desktop nav</nav>

<!-- Show on mobile, hide on desktop -->
<button class="lg:hidden">☰ Menu</button>

<!-- Show only on specific range -->
<div class="hidden md:block xl:hidden">Tablet only</div>
```

---

## Responsive Images

```html
<!-- Aspect ratio container -->
<div class="aspect-video overflow-hidden rounded-lg">
  <img
    src="/hero.jpg"
    alt="Hero"
    class="h-full w-full object-cover"
  />
</div>

<!-- Responsive image with srcset (HTML) -->
<img
  srcset="/img-400.jpg 400w, /img-800.jpg 800w, /img-1200.jpg 1200w"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  src="/img-800.jpg"
  alt="Responsive"
  class="w-full rounded-lg"
/>
```

---

## Full Layout Example

```html
<div class="min-h-screen flex flex-col">
  <!-- Header -->
  <header class="sticky top-0 z-50 border-b bg-white/80 backdrop-blur dark:bg-zinc-950/80">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
      <div class="font-bold text-lg">Logo</div>
      <nav class="hidden md:flex gap-6 text-sm">
        <a href="#">Features</a>
        <a href="#">Pricing</a>
      </nav>
      <button class="md:hidden">☰</button>
    </div>
  </header>

  <!-- Main with optional sidebar -->
  <div class="mx-auto flex w-full max-w-7xl flex-1 px-4 lg:px-8">
    <aside class="hidden lg:block w-64 shrink-0 border-r py-8 pr-6">
      Sidebar
    </aside>
    <main class="flex-1 py-8 lg:pl-8">
      Content
    </main>
  </div>

  <!-- Footer -->
  <footer class="border-t py-8">
    <div class="mx-auto max-w-7xl px-4 lg:px-8 text-sm text-zinc-500">
      © 2025
    </div>
  </footer>
</div>
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Desktop-first (override down) | Mobile-first (build up) |
| Viewport breakpoints for components | Container queries `@md:` |
| Fixed pixel widths everywhere | Use `max-w-7xl`, `w-full` |
| Skip `aspect-ratio` | Use `aspect-video`, `aspect-square` |
| Hard-code show/hide in JS | Use `hidden md:block` |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [components.md](components.md) | Component extraction |
| [v4-config.md](v4-config.md) | @theme setup + breakpoints |
| [SKILL.md](../SKILL.md) | Layout patterns |

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-v4-config"></a>

## Tailwind v4 Configuration

**Impact:** standard
**Kind:** reference
**Source:** `rules/v4-config.md`

# Tailwind v4 Configuration

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

# Tailwind v4 Configuration

## Full Theme Configuration

```css
@theme {
  /* Colors - OKLCH for perceptual uniformity */
  --color-primary: oklch(0.7 0.15 250);
  --color-primary-hover: oklch(0.65 0.18 250);
  --color-secondary: oklch(0.6 0.1 180);

  --color-surface: oklch(0.98 0 0);
  --color-surface-dark: oklch(0.15 0 0);
  --color-surface-elevated: oklch(1 0 0);

  --color-text: oklch(0.2 0 0);
  --color-text-muted: oklch(0.5 0 0);
  --color-text-inverse: oklch(0.95 0 0);

  /* Spacing scale */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  --spacing-xl: 4rem;

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --font-display: 'Outfit', sans-serif;

  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}
```

## Extending vs Overriding

| Action | Use When |
|--------|----------|
| **Extend** | Adding new values alongside defaults |
| **Override** | Replacing default scale entirely |
| **Semantic tokens** | Project-specific naming |

## OKLCH Color Format

```
oklch(lightness chroma hue)
     0-1       0-0.4  0-360
```

- **Lightness:** 0 = black, 1 = white
- **Chroma:** 0 = gray, higher = more colorful
- **Hue:** 0 = red, 120 = green, 240 = blue

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
