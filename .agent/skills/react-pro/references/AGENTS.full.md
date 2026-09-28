# React Pro Full Agent Rules

> Deterministic compilation of 14 source rules for react-pro v4.0.0. Do not edit directly.

## Rule Index

- [React.FC with TypeScript, useCallback for handlers, default export.](#rule-component-patterns) (high, reference, source: `rules/component-patterns.md`)
- [Compound Components Pattern](#rule-composition-compound) (high, reference, source: `rules/composition-compound.md`)
- [Data Fetching with TanStack Query](#rule-data-fetching) (high, reference, source: `rules/data-fetching.md`)
- [Error Boundary Pattern](#rule-error-boundary) (high, reference, source: `rules/error-boundary.md`)
- [Organize by feature, not by type. Features directory structure.](#rule-file-organization) (standard, reference, source: `rules/file-organization.md`)
- [Custom Hooks Patterns](#rule-hooks-custom) (standard, reference, source: `rules/hooks-custom.md`)
- [MUI v7 Styling](#rule-mui-styling) (standard, reference, source: `rules/mui-styling.md`)
- [React Advanced Patterns (Deprecated)](#rule-patterns) (standard, reference, source: `rules/patterns.md`)
- [React Performance Optimization](#rule-performance-optimization) (high, process, source: `rules/performance-optimization.md`)
- [Performance Optimization](#rule-performance) (standard, reference, source: `rules/performance.md`)
- [Production verification gates](#rule-production-gates) (high, process, source: `rules/production-gates.md`)
- [React 19 Patterns](#rule-react19-hooks) (high, reference, source: `rules/react19-hooks.md`)
- [Zustand & React Query State Management](#rule-state-management) (high, reference, source: `rules/state-management.md`)
- [React Testing Patterns](#rule-testing-patterns) (standard, process, source: `rules/testing-patterns.md`)

<a id="rule-component-patterns"></a>

## React.FC with TypeScript, useCallback for handlers, default export.

**Impact:** high
**Kind:** reference
**Source:** `rules/component-patterns.md`

# React.FC with TypeScript, useCallback for handlers, default export.

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

# Component Patterns

> React.FC with TypeScript, useCallback for handlers, default export.

---

## Standard Component Structure

```typescript
import React, { useState, useCallback } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { useSuspenseQuery } from '@tanstack/react-query';
import { featureApi } from '../api/featureApi';
import type { FeatureData } from '~types/feature';

interface MyComponentProps {
  id: number;
  title?: string;
  onAction?: (id: number) => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  id,
  title = 'Default Title',
  onAction
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data } = useSuspenseQuery({
    queryKey: ['feature', id],
    queryFn: () => featureApi.getById(id),
  });

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleAction = useCallback(() => {
    onAction?.(id);
  }, [id, onAction]);

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">{title}</Typography>
        <Typography>{data.content}</Typography>
        <Button onClick={handleAction}>Action</Button>
      </Paper>
    </Box>
  );
};

export default MyComponent;
```

---

## Key Patterns

| Pattern | Rule |
|---------|------|
| Props Interface | Explicit, named `ComponentNameProps` |
| Default Props | Destructure with defaults |
| Event Handlers | `useCallback` if passed to children |
| Named Export | `export const Component` |
| Default Export | At bottom for lazy loading |

---

## useCallback Rules

```typescript
// ✅ USE - Handler passed to child component
const handleClick = useCallback(() => {
  doSomething();
}, []);
<ChildComponent onClick={handleClick} />

// ✅ USE - Handler depends on props/state
const handleSubmit = useCallback(() => {
  onSubmit(formData);
}, [onSubmit, formData]);

// ❌ SKIP - Handler used inline only
<Button onClick={() => setOpen(true)}>
```

---

## Props Patterns

```typescript
// Required vs Optional
interface Props {
  id: number;           // Required
  title?: string;       // Optional
  onChange?: () => void; // Optional callback
}

// Children
interface Props {
  children: React.ReactNode;
}

// Render Props
interface Props {
  renderItem: (item: Item) => React.ReactNode;
}
```

---

## Exports

```typescript
// Named export (for direct imports)
export const MyComponent: React.FC<Props> = () => { ... };

// Default export (for lazy loading)
export default MyComponent;
```

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [data-fetching.md](data-fetching.md) | useSuspenseQuery for data layer |
| [mui-styling.md](mui-styling.md) | MUI v7 sx prop patterns |
| [file-organization.md](file-organization.md) | Where to place components |
| [../SKILL.md](../SKILL.md) | Core rules and anti-patterns |

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-composition-compound"></a>

## Compound Components Pattern

**Impact:** high
**Kind:** reference
**Source:** `rules/composition-compound.md`

# Compound Components Pattern

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

# Compound Components Pattern

> Context-based compound components for flexible, slot-based APIs.

---

## Implementation

```tsx
import { createContext, useContext, useState, type ReactNode } from 'react'

// Context for internal state
const TabsContext = createContext<{
  active: string
  setActive: (id: string) => void
} | null>(null)

function useTabs() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tabs components must be used within <Tabs>')
  return ctx
}

// Parent — provides context
function Tabs({ defaultTab, children }: { defaultTab: string; children: ReactNode }) {
  const [active, setActive] = useState(defaultTab)
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  )
}

// Child — consumes context
function TabList({ children }: { children: ReactNode }) {
  return <div className="tab-list" role="tablist">{children}</div>
}

function Tab({ id, children }: { id: string; children: ReactNode }) {
  const { active, setActive } = useTabs()
  return (
    <button role="tab" aria-selected={active === id} onClick={() => setActive(id)}>
      {children}
    </button>
  )
}

function TabPanel({ id, children }: { id: string; children: ReactNode }) {
  const { active } = useTabs()
  if (active !== id) return null
  return <div role="tabpanel">{children}</div>
}

// Attach sub-components
Tabs.List = TabList
Tabs.Tab = Tab
Tabs.Panel = TabPanel
```

## Usage

```tsx
<Tabs defaultTab="overview">
  <Tabs.List>
    <Tabs.Tab id="overview">Overview</Tabs.Tab>
    <Tabs.Tab id="settings">Settings</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel id="overview">Overview content</Tabs.Panel>
  <Tabs.Panel id="settings">Settings content</Tabs.Panel>
</Tabs>
```

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-data-fetching"></a>

## Data Fetching with TanStack Query

**Impact:** high
**Kind:** reference
**Source:** `rules/data-fetching.md`

# Data Fetching with TanStack Query

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

# Data Fetching with TanStack Query

> Use `useSuspenseQuery` - data is guaranteed, no null checks.

---

## Primary Pattern: useSuspenseQuery

```typescript
import { useSuspenseQuery } from '@tanstack/react-query';

// Inside component
const { data } = useSuspenseQuery({
  queryKey: ['posts', { status: 'published' }],
  queryFn: () => postsApi.getPosts({ status: 'published' }),
});

// data is GUARANTEED defined (no null checks needed)
```

---

## Query Key Patterns

```typescript
// Simple key
queryKey: ['posts']

// With parameters
queryKey: ['posts', { status, page }]

// Nested resource
queryKey: ['posts', postId, 'comments']

// User-specific
queryKey: ['user', userId, 'settings']
```

---

## Mutations

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

const createPost = useMutation({
  mutationFn: (data: CreatePostData) => postsApi.create(data),
  onSuccess: () => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ['posts'] });
    showSnackbar('Post created!', 'success');
  },
  onError: (error) => {
    showSnackbar(error.message, 'error');
  },
});

// Usage
createPost.mutate({ title: 'New Post', content: '...' });
```

---

## API Service Layer

```typescript
// src/features/posts/api/postsApi.ts
import { apiClient } from '@/lib/apiClient';
import type { Post, CreatePostData } from '../types';

export const postsApi = {
  getAll: async (): Promise<Post[]> => {
    const { data } = await apiClient.get('/posts');
    return data;
  },

  getById: async (id: number): Promise<Post> => {
    const { data } = await apiClient.get(`/posts/${id}`);
    return data;
  },

  create: async (payload: CreatePostData): Promise<Post> => {
    const { data } = await apiClient.post('/posts', payload);
    return data;
  },

  update: async (id: number, payload: Partial<Post>): Promise<Post> => {
    const { data } = await apiClient.patch(`/posts/${id}`, payload);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/posts/${id}`);
  },
};
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| `const { data, isLoading }` + early return | `useSuspenseQuery` + Suspense |
| Inline fetch in component | API service layer |
| `useEffect` + `fetch` | `useSuspenseQuery` |
| Manual loading states | Suspense boundaries |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [component-patterns.md](component-patterns.md) | Component structure using useSuspenseQuery |
| [performance.md](performance.md) | Lazy loading and memoization |
| [file-organization.md](file-organization.md) | Where to place api/ services |
| [../SKILL.md](../SKILL.md) | No early returns rule |

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-error-boundary"></a>

## Error Boundary Pattern

**Impact:** high
**Kind:** reference
**Source:** `rules/error-boundary.md`

# Error Boundary Pattern

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

# Error Boundary Pattern

> Class-based error boundary that catches render errors and shows fallback UI.

---

## Implementation

```tsx
import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean; error: Error | null }

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
    // Send to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div role="alert">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
```

## Usage

```tsx
// Wrap at route/feature level
<ErrorBoundary fallback={<ErrorPage />}>
  <UserDashboard />
</ErrorBoundary>
```

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-file-organization"></a>

## Organize by feature, not by type. Features directory structure.

**Impact:** standard
**Kind:** reference
**Source:** `rules/file-organization.md`

# Organize by feature, not by type. Features directory structure.

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

# File Organization

> Organize by feature, not by type. Features directory structure.

---

## Features Directory

```
src/
├── features/
│   ├── posts/
│   │   ├── api/
│   │   │   └── postsApi.ts
│   │   ├── components/
│   │   │   ├── PostList.tsx
│   │   │   ├── PostCard.tsx
│   │   │   └── PostForm.tsx
│   │   ├── hooks/
│   │   │   └── usePosts.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts          # Public exports
│   │
│   ├── comments/
│   │   ├── api/
│   │   ├── components/
│   │   └── index.ts
│   │
│   └── auth/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       └── index.ts
│
├── components/               # Truly shared/reusable
│   ├── SuspenseLoader.tsx
│   ├── CustomAppBar.tsx
│   └── ErrorBoundary.tsx
│
├── lib/                      # Utilities
│   ├── apiClient.ts
│   └── queryClient.ts
│
├── types/                    # Global types
│   ├── user.ts
│   └── common.ts
│
└── routes/                   # TanStack Router
    ├── posts/
    │   ├── index.tsx         # /posts
    │   ├── create/index.tsx  # /posts/create
    │   └── $postId/index.tsx # /posts/:postId
    └── __root.tsx
```

---

## Import Aliases

Configure in `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~types': path.resolve(__dirname, './src/types'),
      '~components': path.resolve(__dirname, './src/components'),
      '~features': path.resolve(__dirname, './src/features'),
    },
  },
});
```

Also add to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "~types/*": ["./src/types/*"],
      "~components/*": ["./src/components/*"],
      "~features/*": ["./src/features/*"]
    }
  }
}
```

---

## Public Exports (index.ts)

```typescript
// src/features/posts/index.ts

// Components
export { PostList } from './components/PostList';
export { PostCard } from './components/PostCard';

// Hooks
export { usePosts } from './hooks/usePosts';

// API
export { postsApi } from './api/postsApi';

// Types
export type { Post, CreatePostData } from './types';
```

---

## Anti-Pattern: Type-Based Organization

```
// ❌ DON'T organize by type
src/
├── api/
│   ├── postsApi.ts
│   ├── commentsApi.ts
│   └── authApi.ts
├── components/
│   ├── PostList.tsx
│   ├── CommentList.tsx
│   └── LoginForm.tsx
├── hooks/
│   ├── usePosts.ts
│   └── useComments.ts
```

Problem: Related code scattered across folders.

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [component-patterns.md](component-patterns.md) | Component structure within features |
| [data-fetching.md](data-fetching.md) | API service layer per feature |
| [../SKILL.md](../SKILL.md) | Features directory requirement |

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-hooks-custom"></a>

## Custom Hooks Patterns

**Impact:** standard
**Kind:** reference
**Source:** `rules/hooks-custom.md`

# Custom Hooks Patterns

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

# Custom Hooks Patterns

> Reusable hooks for common patterns: debounce, localStorage, and more.

---

## useDebounce

```tsx
function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}
```

## useLocalStorage

```tsx
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}
```

## Usage

```tsx
function SearchPage() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)
  const [theme, setTheme] = useLocalStorage('theme', 'dark')
  // ...
}
```

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-mui-styling"></a>

## MUI v7 Styling

**Impact:** standard
**Kind:** reference
**Source:** `rules/mui-styling.md`

# MUI v7 Styling

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

# MUI v7 Styling

> sx prop for styling, Grid with size prop, inline vs separate files.

---

## sx Prop Pattern

```typescript
import { Box, Paper } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

// Define styles object
const styles: Record<string, SxProps<Theme>> = {
  container: {
    p: 2,
    bgcolor: 'background.paper',
    borderRadius: 2,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 3,
  },
  content: {
    p: 3,
    minHeight: 200,
  },
};

// Apply in component
<Box sx={styles.container}>
  <Box sx={styles.header}>Header</Box>
  <Paper sx={styles.content}>Content</Paper>
</Box>
```

---

## MUI v7 Grid (Breaking Change!)

```typescript
import { Grid } from '@mui/material';

// ✅ MUI v7 syntax
<Grid container spacing={2}>
  <Grid size={{ xs: 12, md: 6, lg: 4 }}>
    <Paper>Item 1</Paper>
  </Grid>
  <Grid size={{ xs: 12, md: 6, lg: 4 }}>
    <Paper>Item 2</Paper>
  </Grid>
</Grid>

// ❌ OLD syntax (wrong in v7)
<Grid xs={12} md={6}>  // DON'T USE
```

---

## Inline vs Separate Styles

| Lines | Location |
|-------|----------|
| <100 | Inline in component file |
| >100 | Separate `.styles.ts` file |

```typescript
// MyComponent.styles.ts (for >100 lines)
import type { SxProps, Theme } from '@mui/material';

export const styles: Record<string, SxProps<Theme>> = {
  container: { ... },
  header: { ... },
  // ... many more styles
};
```

```typescript
// MyComponent.tsx
import { styles } from './MyComponent.styles';

<Box sx={styles.container}>
```

---

## Theme Access

```typescript
// Access theme in sx
sx={{
  bgcolor: 'primary.main',
  color: 'text.secondary',
  p: theme => theme.spacing(2),

  // Responsive
  width: { xs: '100%', md: '50%' },
}}
```

---

## Common sx Properties

| Short | CSS Property |
|-------|--------------|
| `p` | padding |
| `m` | margin |
| `px`, `py` | padding x/y |
| `mx`, `my` | margin x/y |
| `bgcolor` | backgroundColor |
| `display` | display |
| `gap` | gap |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [component-patterns.md](component-patterns.md) | Component structure with MUI |
| [performance.md](performance.md) | Lazy load heavy MUI components |
| [../SKILL.md](../SKILL.md) | MUI v7 Grid breaking change |

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-patterns"></a>

## React Advanced Patterns (Deprecated)

**Impact:** standard
**Kind:** reference
**Source:** `rules/patterns.md`

# React Advanced Patterns (Deprecated)

## Scope

This reference applies only to the platforms declared in metadata and the versions confirmed in the target repository.

## Guidance

# React Advanced Patterns — DEPRECATED

> This file has been split into focused rule files. Read the individual files instead.

| Old Section | New File |
|-------------|----------|
| React 19 Patterns | [react19-hooks.md](react19-hooks.md) |
| Composition Patterns | [composition-compound.md](composition-compound.md) |
| State Management | [state-management.md](state-management.md) |
| Error Boundary | [error-boundary.md](error-boundary.md) |
| Custom Hooks | [hooks-custom.md](hooks-custom.md) |
| Performance | [performance-optimization.md](performance-optimization.md) |
| Testing | [testing-patterns.md](testing-patterns.md) |

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-performance-optimization"></a>

## React Performance Optimization

**Impact:** high
**Kind:** process
**Source:** `rules/performance-optimization.md`

# React Performance Optimization

## Preconditions

Record the current behavior, target environment, acceptance criteria, and a recoverable baseline before starting.

## Procedure

# React Performance Optimization

> Priority-based performance optimization: waterfalls → bundle → re-renders → lists.

---

## Priority Matrix

| Priority | Category | Action |
|:--------:|----------|--------|
| 1 | Eliminate waterfalls | `Promise.all()`, parallel fetch, Suspense streaming |
| 2 | Bundle size | Direct imports (no barrels), `dynamic()`, lazy load |
| 3 | Re-renders | React Compiler (19), then `useMemo`/`useCallback` |
| 4 | Large lists | Virtualize with `@tanstack/react-virtual` |

## Virtualized List (10K+ items)

```tsx
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  })

  return (
    <div ref={parentRef} style={{ height: 400, overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(row => (
          <div key={row.key} style={{
            position: 'absolute',
            top: row.start,
            height: row.size,
            width: '100%',
          }}>
            {items[row.index].name}
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Premature `useMemo`/`useCallback` | Profile first (React Compiler handles most) |
| Barrel file re-exports | Direct imports for smaller bundles |
| God components (> 300 lines) | Split at 150 lines |

## Rollback

Restore the recorded baseline if a required command errors, evidence becomes inconclusive, or the change introduces a regression.

## Exit Gate

Complete only with fresh, reproducible evidence for the intended behavior and all relevant project checks passing.

<a id="rule-performance"></a>

## Performance Optimization

**Impact:** standard
**Kind:** reference
**Source:** `rules/performance.md`

# Performance Optimization

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

# Performance Optimization

> Lazy load heavy components, memoize expensive computations.

---

## Lazy Loading

```typescript
import React, { lazy } from 'react';
import { SuspenseLoader } from '~components/SuspenseLoader';

// Lazy load heavy components
const DataGrid = lazy(() =>
  import('@mui/x-data-grid').then(m => ({ default: m.DataGrid }))
);
const RichTextEditor = lazy(() => import('./RichTextEditor'));
const ChartComponent = lazy(() => import('./Chart'));

// Usage with SuspenseLoader
<SuspenseLoader>
  <DataGrid rows={data} columns={columns} />
</SuspenseLoader>
```

---

## What to Lazy Load

| Component Type | Lazy Load? |
|----------------|------------|
| DataGrid, Tables | ✅ Yes |
| Charts (Recharts, Chart.js) | ✅ Yes |
| Rich Text Editors | ✅ Yes |
| Code Editors (Monaco) | ✅ Yes |
| Map Components | ✅ Yes |
| Dialog/Modal content | ✅ Yes |
| Simple buttons, inputs | ❌ No |
| Layout components | ❌ No |

---

## useMemo

```typescript
import { useMemo } from 'react';

// ✅ Expensive computation
const filteredData = useMemo(() => {
  return data
    .filter(item => item.status === filter)
    .sort((a, b) => b.date - a.date)
    .map(item => ({ ...item, computed: heavyFn(item) }));
}, [data, filter]);

// ❌ Don't memoize simple values
const label = `Hello ${name}`; // No useMemo needed
```

---

## useCallback

```typescript
import { useCallback } from 'react';

// ✅ Handler passed to children
const handleClick = useCallback(() => {
  console.log('clicked');
}, []);

<MemoizedChild onClick={handleClick} />

// ❌ Inline handler (no memoization needed)
<button onClick={() => setOpen(true)}>
```

---

## React.memo

```typescript
import React from 'react';

// For expensive pure components
const ExpensiveList = React.memo(({ items }) => {
  return items.map(item => <ExpensiveItem key={item.id} item={item} />);
});

// With custom comparison
const OptimizedComponent = React.memo(
  ({ data }) => <div>{data.value}</div>,
  (prevProps, nextProps) => prevProps.data.id === nextProps.data.id
);
```

---

## Bundle Analysis

```bash
# Vite bundle analyzer
npm install -D rollup-plugin-visualizer

# In vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

plugins: [
  visualizer({ open: true })
]

# Build and analyze
npm run build
```

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [component-patterns.md](component-patterns.md) | useCallback rules for components |
| [data-fetching.md](data-fetching.md) | Query caching for performance |
| [../SKILL.md](../SKILL.md) | Lazy load heavy components rule |

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

<a id="rule-react19-hooks"></a>

## React 19 Patterns

**Impact:** high
**Kind:** reference
**Source:** `rules/react19-hooks.md`

# React 19 Patterns

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

# React 19 Patterns

> Modern React 19 hooks for form submissions and optimistic UI updates.

---

## useActionState (Form Submissions)

```tsx
import { useActionState } from 'react'

async function createUser(prev: State, formData: FormData) {
  const name = formData.get('name') as string
  const res = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ name }),
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) return { error: 'Failed to create user' }
  return { error: null, success: true }
}

type State = { error: string | null; success?: boolean }

function CreateUserForm() {
  const [state, action, isPending] = useActionState(createUser, { error: null })

  return (
    <form action={action}>
      <input name="name" required disabled={isPending} />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create User'}
      </button>
      {state.error && <p className="error">{state.error}</p>}
      {state.success && <p className="success">User created!</p>}
    </form>
  )
}
```

## useOptimistic (Instant UI Updates)

```tsx
import { useOptimistic } from 'react'

function TodoList({ todos }: { todos: Todo[] }) {
  const [optimisticTodos, addOptimistic] = useOptimistic(
    todos,
    (current, newTodo: Todo) => [...current, newTodo]
  )

  async function handleAdd(formData: FormData) {
    const title = formData.get('title') as string
    const tempTodo = { id: crypto.randomUUID(), title, completed: false }

    addOptimistic(tempTodo)  // Instant UI update
    await createTodo(title)  // Server call (may fail → reverts automatically)
  }

  return (
    <div>
      <form action={handleAdd}>
        <input name="title" required />
        <button type="submit">Add</button>
      </form>
      <ul>
        {optimisticTodos.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-state-management"></a>

## Zustand & React Query State Management

**Impact:** high
**Kind:** reference
**Source:** `rules/state-management.md`

# Zustand & React Query State Management

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

# State Management Patterns

> Zustand for global client state, React Query for server state.

---

## Zustand (Global State)

```tsx
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthStore {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: async (email, password) => {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
          headers: { 'Content-Type': 'application/json' },
        })
        const { user, token } = await res.json()
        set({ user, token })
      },
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'auth-storage' }
  )
)

// Usage — auto re-renders on change
function NavBar() {
  const { user, logout } = useAuthStore()
  if (!user) return <LoginButton />
  return <button onClick={logout}>{user.name}</button>
}
```

## React Query (Server State)

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

function UserList() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(r => r.json()),
    staleTime: 5 * 60 * 1000, // 5 min cache
  })

  const queryClient = useQueryClient()
  const createUser = useMutation({
    mutationFn: (data: UserCreate) =>
      fetch('/api/users', { method: 'POST', body: JSON.stringify(data) }).then(r => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })

  if (isLoading) return <Skeleton />
  if (error) return <ErrorMessage error={error} />

  return (
    <div>
      {users.map((u: User) => <UserCard key={u.id} user={u} />)}
      <button onClick={() => createUser.mutate({ name: 'New User' })}>
        {createUser.isPending ? 'Creating...' : 'Add User'}
      </button>
    </div>
  )
}
```

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-testing-patterns"></a>

## React Testing Patterns

**Impact:** standard
**Kind:** process
**Source:** `rules/testing-patterns.md`

# React Testing Patterns

## Preconditions

Record the current behavior, target environment, acceptance criteria, and a recoverable baseline before starting.

## Procedure

# React Testing Patterns

> AAA pattern (Arrange-Act-Assert) with React Testing Library and userEvent.

---

## Component Testing

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('creates user on form submit', async () => {
  const user = userEvent.setup()
  render(<CreateUserForm />)

  await user.type(screen.getByRole('textbox', { name: /name/i }), 'John')
  await user.click(screen.getByRole('button', { name: /create/i }))

  expect(await screen.findByText(/user created/i)).toBeInTheDocument()
})

test('shows error on failed submission', async () => {
  server.use(http.post('/api/users', () => HttpResponse.json({}, { status: 500 })))
  const user = userEvent.setup()
  render(<CreateUserForm />)

  await user.type(screen.getByRole('textbox', { name: /name/i }), 'John')
  await user.click(screen.getByRole('button', { name: /create/i }))

  expect(await screen.findByText(/failed/i)).toBeInTheDocument()
})
```

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| `useEffect` for data fetching | React Query / use() / Server Components |
| Index as key in dynamic lists | Stable unique ID |
| Prop drill > 3 levels | Compound components or Zustand |

## Rollback

Restore the recorded baseline if a required command errors, evidence becomes inconclusive, or the change introduces a regression.

## Exit Gate

Complete only with fresh, reproducible evidence for the intended behavior and all relevant project checks passing.
