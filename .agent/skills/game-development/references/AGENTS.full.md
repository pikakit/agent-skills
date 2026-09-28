# Game Development Full Agent Rules

> Deterministic compilation of 1 source rules for game-development v3.9.224. Do not edit directly.

## Rule Index

- [Game Architecture and Performance Release Gate](#rule-engineering-spec) (high, process, source: `rules/engineering-spec.md`)

<a id="rule-engineering-spec"></a>

## Game Architecture and Performance Release Gate

**Impact:** high
**Kind:** process
**Source:** `rules/engineering-spec.md`

# Game Architecture and Performance Release Gate

## Preconditions

- Identify target platform (web, desktop, mobile, console), target frame rate (30/60/120 FPS), and memory budgets.
- Define asset pipeline constraints: texture compression formats, audio categories, and draw call limits.
- Confirm state synchronization model for local or multiplayer game loops.

## Procedure

1. Verify deterministic core game loop separating input processing, fixed-step simulation, and rendering interpolation.
2. Audit scene hierarchy and component lifecycle to ensure zero per-frame heap allocations in update loops.
3. Validate asset pooling for dynamic entities (projectiles, particles, audio sources) to prevent GC pauses.
4. Profile rendering performance: verify draw call batching, LOD groups, occlusion culling, and texture atlas usage.
5. Execute regression test suites covering save/load integrity, physics stability, and input latency under load.

## Rollback

Restore the previous asset bundle or engine script revision if frame drops, asset leaks, or physics instabilities exceed budget.

## Exit Gate

Pass when game loop achieves target FPS on target hardware, memory usage remains within platform bounds, assets are pooled, and build artifacts pass packaging verification.
