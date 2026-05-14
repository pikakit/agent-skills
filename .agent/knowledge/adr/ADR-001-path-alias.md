---
id: ADR-001
status: accepted
date: 2026-04-12
---

# ADR-001: Use Path Alias Instead of Relative Imports

## Context
Code mobility severely drops when massive amounts of files rely on strict relative depths (`../`, `../../`). Migrating a folder instantly shatters all associated dependencies, creating unnecessary manual refactoring workloads during large-scale operations.

## Decision
All imports referencing root `src/` modular components, hooks, or assets MUST utilize path aliases (e.g. `@/components/`, `@/lib/`).

## Consequences (Tradeoffs)
### Pros
- **Maintainability**: Moving files deep within `components` requires 0 updates to its own internal alias imports.
- **Readability**: The origin of the import is explicitly legible at first glance.

### Cons
- **Requires TSConfig + Bundler Sync**: The `tsconfig.json` paths array must perfectly mirror the bundler's resolution alias (e.g., Next.js `next.config.mjs` or Webpack `resolve.alias`), otherwise the IDE will accept it but the build will fail. 
