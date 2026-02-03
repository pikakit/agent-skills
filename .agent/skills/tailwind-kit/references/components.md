# Component Extraction

## When to Extract

| Signal | Action |
|--------|--------|
| Same class combo 3+ times | Extract component |
| Complex state variants | Extract component |
| Design system element | Extract + document |

## Extraction Methods

### 1. React/Vue Component (Preferred)

```tsx
// components/Button.tsx
export function Button({ children, variant = 'primary' }) {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover',
    secondary: 'bg-surface border border-zinc-200 hover:bg-zinc-50'
  };
  
  return (
    <button className={`
      px-4 py-2 rounded-md font-medium
      transition-colors duration-150
      ${variants[variant]}
    `}>
      {children}
    </button>
  );
}
```

### 2. @apply in CSS (Static Only)

```css
/* Only for truly static patterns */
.btn-primary {
  @apply px-4 py-2 rounded-md font-medium;
  @apply bg-primary text-white;
  @apply hover:bg-primary-hover;
  @apply transition-colors duration-150;
}
```

> ⚠️ **Warning:** Avoid heavy @apply usage. Prefer React components.

### 3. Design Tokens

```css
@theme {
  --button-padding: 0.5rem 1rem;
  --button-radius: 0.5rem;
  --button-font: 500;
}
```

## Class Organization Order

```html
<div class="
  <!-- 1. Layout -->
  flex items-center justify-between
  
  <!-- 2. Sizing -->
  w-full h-12
  
  <!-- 3. Spacing -->
  px-4 py-2 gap-4
  
  <!-- 4. Typography -->
  text-sm font-medium
  
  <!-- 5. Colors -->
  bg-white text-zinc-900
  
  <!-- 6. Borders -->
  border border-zinc-200 rounded-lg
  
  <!-- 7. Effects -->
  shadow-sm
  
  <!-- 8. Transitions -->
  transition-all duration-200
  
  <!-- 9. States -->
  hover:bg-zinc-50 focus:ring-2
">
```
