# Responsive & Container Queries

## Breakpoint System

| Prefix | Min Width | Target |
|--------|-----------|--------|
| (none) | 0px | Mobile-first base |
| `sm:` | 640px | Large phone |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Laptop |
| `xl:` | 1280px | Desktop |
| `2xl:` | 1536px | Large desktop |

## Mobile-First Pattern

```html
<!-- Base = mobile, then override for larger -->
<div class="w-full md:w-1/2 lg:w-1/3">
  <p class="text-sm md:text-base lg:text-lg">
    Responsive text
  </p>
</div>
```

## Container Queries (v4 Native)

### Breakpoint vs Container

| Type | Responds To |
|------|-------------|
| `md:` | Viewport width |
| `@md:` | Parent container width |

### Usage

```html
<!-- Define container on parent -->
<div class="@container">
  <!-- Use container breakpoints on children -->
  <div class="@sm:flex @md:grid @lg:hidden">
    Content
  </div>
</div>
```

### Named Containers

```html
<div class="@container/card">
  <div class="@sm/card:flex">
    Only responds to card container
  </div>
</div>
```

## When to Use

| Scenario | Use |
|----------|-----|
| Page layouts | Viewport breakpoints (`md:`) |
| Component-level | Container queries (`@md:`) |
| Reusable components | Container queries |
