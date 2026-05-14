---
id: CON-001
topic: architecture/import-strategy
impact: cross-domain
---

# Import Resolution Strategy in TypeScript Monorepo

## Overview
As projects scale beyond 20+ specialized modules, manual resolution tracking via relative pathing becomes fragile, leading to brittle refactors and build-order circular dependencies.

## Key Mechanics Included
1. **Path Alias Mapping (`@/*`)**: Standardizes global origin so that deep component hierarchies do not care about depth-of-folder.
2. **Barrel Files (`index.ts`)**: Aggregates module subsets. Warning: High risk of Circular Dependency if cross-wired incorrectly.
3. **Circular Dependencies Guard**: A → B → A relationships are strictly forbidden. If a helper loop is discovered, extract logic to a standalone utility C.
4. **Build Order Consistency**: Ensure `.d.ts` definitions are synced ahead of module execution sequences.

## Associated Patterns
- [[PTN-001-import-resolution]]

## Associated ADRs
- [[ADR-001-path-alias]]
