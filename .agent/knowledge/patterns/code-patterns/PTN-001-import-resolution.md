---
id: PTN-001
category: code-patterns
confidence: high
source: SIG-001
---

# Missing Import in Modular React Component System

## Context
- **Environment**: TypeScript monorepo with multiple interdependent packages
- **Condition**: Deeply nested components, dynamic imports via Turbopack or Webpack
- **Problem**: Relative paths (e.g. `../../../utils/cn`) break instantly upon refactoring or module shifting.

## Solution MUST include:
1. **Check tsconfig paths**: Validate that `compilerOptions.paths` contains the `@/*` mask mapping to `src/*`.
2. **Verify export type**: Ensure the module actually exports the expected type (named vs default).
3. **Ensure barrel file sync**: If querying an index router, ensure the barrel file (`index.ts`) is exporting the latest version.

## Enforcement
This pattern has `HIGH` confidence. For all new component creations and TS file refactorings, the system MUST apply absolute path aliasing via `@/` rather than drilling via relative path directories.
