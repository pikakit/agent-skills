---
name: frontend-development
description: >-
  Modern React and TypeScript development with Suspense, TanStack Query, MUI v7.
  Lazy loading, features directory, no early returns for loading states.
  Triggers on: React, TypeScript, TanStack Query, MUI, frontend, component, hook.
  Coordinates with: frontend-design, react-architect, typescript-expert.
metadata:
  version: "2.0.0"
  category: "framework"
  triggers: "React, TypeScript, TanStack Query, MUI, frontend, component, hook, useSuspenseQuery"
  success_metrics: "no early returns, useSuspenseQuery used, features directory structure"
  coordinates_with: "frontend-design, react-architect, typescript-expert"
---

# Frontend Development — React + TypeScript + MUI v7

> Suspense-first. No early returns. `useSuspenseQuery` — data always defined.

---

## Prerequisites

**Required:** React 18.3+, TypeScript 5.7+, TanStack Query v5, MUI v7.
**Optional:** TanStack Router (file-based routing).

---

## When to Use

| Situation | Action |
|-----------|--------|
| Create component | Follow component pattern (Suspense-first) |
| Fetch data | Use `useSuspenseQuery` — never `useQuery` |
| Loading state | Wrap in `<SuspenseLoader>` — NO early returns |
| New feature | Create `features/` directory structure |
| Heavy component | Lazy load with `React.lazy()` |
| Architecture review | Read `references/engineering-spec.md` |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Component patterns (Suspense-first, no early returns) | UI design (→ frontend-design) |
| Data fetching (`useSuspenseQuery` + `SuspenseLoader`) | React architecture (→ react-architect) |
| Features directory structure (4 subdirs) | TypeScript patterns (→ typescript-expert) |
| MUI v7 syntax enforcement | Next.js specifics (→ nextjs-pro) |
| Lazy loading rules | CSS/Tailwind (→ tailwind-kit) |

**Pure decision skill:** Produces code patterns and structure recommendations. Zero side effects.

---

## Core Rules (Non-Negotiable)

| Rule | Enforcement |
|------|------------|
| **No early returns** | ❌ `if (isLoading) return <Spinner/>` — NEVER |
| **Suspense-first** | ✅ Wrap in `<SuspenseLoader>` always |
| **`useSuspenseQuery`** | `data` is guaranteed defined — no null checks |
| **Features directory** | `src/features/{name}/` with api/, components/, hooks/, types/ |
| **Lazy load heavy** | DataGrid, charts, editors → `React.lazy()` |
| **Style threshold** | ≤ 100 lines inline `sx`; > 100 lines separate file |
| **MUI v7 Grid** | `size={{ xs: 12, md: 6 }}` — NOT `xs={12}` |

---

## Component Pattern

```typescript
import { useSuspenseQuery } from '@tanstack/react-query';
import { Box, Paper } from '@mui/material';

export const MyComponent: React.FC<Props> = ({ id }) => {
  const { data } = useSuspenseQuery({
    queryKey: ['feature', id],
    queryFn: () => featureApi.getFeature(id),
  });
  // data is ALWAYS defined — no null check needed
  return <Paper sx={{ p: 3 }}>{data.title}</Paper>;
};
```

---

## Feature Structure

```
src/features/my-feature/
├── api/           # API service
├── components/    # Components
├── hooks/         # Custom hooks
├── types/         # Types
└── index.ts       # Public exports
```

---

## MUI v7 Grid (Breaking Change!)

```typescript
// ✅ MUI v7 — correct
<Grid size={{ xs: 12, md: 6 }}>

// ❌ Old syntax — WRONG
<Grid xs={12} md={6}>
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

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNSUPPORTED_MUI` | No | MUI version not v7 |
| `ERR_MISSING_NAME` | Yes | Component/feature name missing |
| `ERR_REFERENCE_NOT_FOUND` | No | Reference file missing |
| `WARN_EARLY_RETURN` | Yes | Loading early return detected |
| `WARN_LEGACY_GRID` | Yes | Old MUI Grid syntax detected |

**Zero internal retries.** Deterministic; same context = same pattern.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| `if (isLoading) return <Spinner/>` | `<SuspenseLoader>` wrapper |
| `useQuery` with null checks | `useSuspenseQuery` — data defined |
| Organize by file type | Organize by feature |
| `<Grid xs={12}>` (v6) | `<Grid size={{ xs: 12 }}>` (v7) |
| Eager load DataGrid | `React.lazy()` for heavy components |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [component-patterns.md](references/component-patterns.md) | Structure, props, exports | Component creation |
| [data-fetching.md](references/data-fetching.md) | TanStack Query patterns | Data layer |
| [file-organization.md](references/file-organization.md) | Features directory | Project structure |
| [mui-styling.md](references/mui-styling.md) | MUI v7, sx prop | Styling |
| [performance.md](references/performance.md) | Lazy loading, memo | Performance |
| [engineering-spec.md](references/engineering-spec.md) | Full engineering spec | Architecture review |

**Selective reading:** Read ONLY files relevant to the request.

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `frontend-design` | Skill | UI design patterns |
| `react-architect` | Skill | React architecture |
| `typescript-expert` | Skill | TypeScript patterns |
| `nextjs-pro` | Skill | Next.js specifics |

---

⚡ PikaKit v3.9.74
