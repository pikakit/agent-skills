---
"title": "Organize by feature, not by type. Features directory structure."
"kind": "reference"
"impact": "standard"
"tags":
  - "file"
  - "organization"
"applies_to":
  - "web"
"last_reviewed": "2026-09-28"
"sources":
  - "url": "https://react.dev/reference/react"
    "title": "Official documentation"
---

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
