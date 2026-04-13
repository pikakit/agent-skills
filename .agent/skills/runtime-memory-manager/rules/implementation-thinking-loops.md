---
title: The Thinking Loops
impact: HIGH
impactDescription: drives continuous dynamic evaluation of runtime schemas
tags: scripts, execution, nodejs, cron
---

## The Thinking Loops

**Impact: HIGH (drives continuous dynamic evaluation of runtime schemas)**

The `runtime-memory-manager` relies on two essential Node.js scripts within the `scripts/` directory to facilitate its "Make it Think" phase.

### 1. Pattern Clustering (`scripts/pattern-clustering.ts`)

This script acts as the cognitive processing center. It reads new runtime logs, calculates bounded-influence confidence matrices, processes cosine similarity against active `patterns`, and updates `decay_weight` using `Math.exp(-λ*t)`.

**Execution Protocol:**
Run this script via TypeScript runners (e.g. `bun` or `ts-node`) periodically or via auto-hooks.
```bash
bun .agents/skills/runtime-memory-manager/scripts/pattern-clustering.ts
```

### 2. Promotion Engine (`scripts/promotion-engine.ts`)

This script is the final authorization gate protecting the Semantic Layer. It enforces cooldown limits (avoiding spam), measures pattern stability, calculates user corrections from the `pattern_feedback` pipeline, and changes candidate status to `promoted`.

**Execution Protocol:**
Run this script sequentially directly after the Clustering loop finishes.
```bash
bun .agents/skills/runtime-memory-manager/scripts/promotion-engine.ts
```
