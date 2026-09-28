---
"title": "Data Fetching with TanStack Query"
"kind": "reference"
"impact": "high"
"tags":
  - "data"
  - "fetching"
"applies_to":
  - "web"
"last_reviewed": "2026-09-28"
"sources":
  - "url": "https://react.dev/reference/react"
    "title": "Official documentation"
---

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
