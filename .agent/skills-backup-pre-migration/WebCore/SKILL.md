---
name: WebCore
version: 3.0.0
description: Comprehensive React and Next.js best practices, performance optimization, and architectural patterns.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
tags: react, nextjs, performance, server-components, client-components
---

# Frontend Engineering Skill
**(Based on Vercel React Best Practices)**

> **Philosophy:** Performance is a feature. Waterfalls are the enemy.

## 📚 Atomic Rules (Knowledge)

This skill contains **60+ detailed engineering rules** covering:

1. **Waterfalls**: Eliminating blocking requests.
2. **Bundle Size**: Tree-shaking, lazy loading.
3. **Server Performance**: RSC optimization, caching.
4. **Client Performance**: Event listeners, re-renders.
5. **Rendering**: Hydration, suspense, transitions.

| Category | Description |
|----------|-------------|
| [rules/async-*.md](rules/) | Async patterns & waterfalls |
| [rules/bundle-*.md](rules/) | Bundle size optimization |
| [rules/server-*.md](rules/) | Server Components & Actions |
| [rules/client-*.md](rules/) | Client hooks & events |
| [rules/rendering-*.md](rules/) | Rendering strategies |
| [rules/js-*.md](rules/) | JavaScript micro-optimizations |

## ⚠️ Critical Anti-Patterns

- **Waterfall Fetching**: Nesting `await` calls unnecessarily.
- **Barrel Imports**: Importing from `index.js` instead of direct paths.
- **Unsafe Server Actions**: Missing auth checks in server actions.
- **Client-Side Heavy**: Fetching large datasets in client components.
