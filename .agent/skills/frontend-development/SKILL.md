---
name: frontend-development
description: >-
  Modern React and TypeScript development with Suspense, TanStack Query, MUI v7.
  Lazy loading, features directory, no early returns for loading states.
  Triggers on: React, TypeScript, TanStack Query, MUI, frontend, component, hook.
  Coordinates with: frontend-design, react-architect, typescript-expert.
metadata:
  version: "1.0.0"
  category: "framework"
  triggers: "React, TypeScript, TanStack Query, MUI, frontend, component, hook, useSuspenseQuery"
  success_metrics: "no early returns, useSuspenseQuery used, features directory structure"
  coordinates_with: "frontend-design, react-architect, typescript-expert"
---

# Frontend Development

> Modern React with Suspense, TanStack Query, MUI v7. No early returns.

---

## Prerequisites

**Required:**
- React 18.3+
- TypeScript 5.7+
- TanStack Query v5
- MUI v7 (Material-UI)

**Optional:**
- TanStack Router (file-based routing)

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Create component | Follow component pattern |
| Fetch data | Use `useSuspenseQuery` |
| Loading state | Wrap in `<SuspenseLoader>` - NO early returns |
| New feature | Create features/ directory structure |
| Heavy component | Lazy load with `React.lazy()` |

---

## Core Principles

| Principle | Rule |
|-----------|------|
| **No Early Returns** | ❌ `if (isLoading) return <Spinner />` |
| **Suspense First** | ✅ Wrap in `<SuspenseLoader>` |
| **useSuspenseQuery** | Data guaranteed, no null checks |
| **Features Directory** | Organize by feature, not type |
| **Lazy Load Heavy** | DataGrid, charts, editors → `React.lazy()` |
| **Inline Styles** | <100 lines inline, >100 lines separate file |

---

## Component Pattern

```typescript
import React, { useState, useCallback } from 'react';
import { Box, Paper } from '@mui/material';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { FeatureData } from '~types/feature';

interface Props {
  id: number;
  onAction?: () => void;
}

export const MyComponent: React.FC<Props> = ({ id, onAction }) => {
  const [state, setState] = useState('');
  
  const { data } = useSuspenseQuery({
    queryKey: ['feature', id],
    queryFn: () => featureApi.getFeature(id),
  });

  const handleAction = useCallback(() => {
    onAction?.();
  }, [onAction]);

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 3 }}>{data.title}</Paper>
    </Box>
  );
};

export default MyComponent;
```

---

## Data Fetching

```typescript
// ✅ CORRECT - useSuspenseQuery
const { data } = useSuspenseQuery({
  queryKey: ['posts', status],
  queryFn: () => postsApi.getPosts({ status }),
});
// data is guaranteed defined

// ❌ WRONG - Early return
if (isLoading) return <Spinner />; // DON'T DO THIS
```

---

## Feature Structure

```
src/features/my-feature/
├── api/
│   └── myFeatureApi.ts     # API service
├── components/
│   └── MyFeature.tsx       # Components
├── hooks/
│   └── useMyFeature.ts     # Custom hooks
├── types/
│   └── index.ts            # Types
└── index.ts                # Public exports
```

---

## Import Aliases

```typescript
import { apiClient } from '@/lib/apiClient';
import type { User } from '~types/user';
import { SuspenseLoader } from '~components/SuspenseLoader';
import { authApi } from '~features/auth';
```

---

## MUI v7 Grid (Breaking Change!)

```typescript
// ✅ MUI v7
<Grid size={{ xs: 12, md: 6 }}>

// ❌ Old syntax (wrong)
<Grid xs={12} md={6}>
```

---

## 📑 Content Map

| File | Description |
|------|-------------|
| `references/component-patterns.md` | Structure, props, exports |
| `references/data-fetching.md` | TanStack Query patterns |
| `references/file-organization.md` | Features directory |
| `references/mui-styling.md` | MUI v7, sx prop |
| `references/performance.md` | Lazy loading, memo |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Layout shift on load | Use Suspense, not early returns |
| `data` possibly undefined | Use `useSuspenseQuery` |
| Grid layout broken | Use MUI v7 `size={{ xs: 12 }}` syntax |
| Imports too long | Set up path aliases in vite.config.ts |
| Component too large | Extract to features/ directory |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `frontend-design` | Skill | UI design patterns |
| `react-architect` | Skill | React architecture |
| `typescript-expert` | Skill | TypeScript patterns |
| `nextjs-pro` | Skill | Next.js specifics |

---

⚡ PikaKit v3.9.66
