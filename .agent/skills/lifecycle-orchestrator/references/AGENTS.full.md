# Lifecycle Orchestrator Full Agent Rules

> Deterministic compilation of 1 source rules for lifecycle-orchestrator v3.9.224. Do not edit directly.

## Rule Index

- [Lifecycle Orchestration Release Gate](#rule-engineering-spec) (high, process, source: `rules/engineering-spec.md`)

<a id="rule-engineering-spec"></a>

## Lifecycle Orchestration Release Gate

**Impact:** high
**Kind:** process
**Source:** `rules/engineering-spec.md`

# Lifecycle Orchestration Release Gate

## Preconditions

- Define task boundaries, participating agent roles, execution sequence, and success criteria.
- Confirm persistent storage for execution state, phase checkpoints, and conflict logs.
- Identify failure escalation thresholds and human intervention triggers.

## Procedure

1. Initialize task execution with unique trace identifier and verified dependency order.
2. Coordinate specialist agents sequentially or in parallel based on ownership boundaries.
3. Validate phase outputs against acceptance criteria before allowing downstream progression.
4. Detect stalls, cyclic delegations, or schema mismatches and trigger automated recovery.
5. Record phase completion metrics, file modification counts, and residual risk assessments.

## Rollback

Trigger rollback to the last verified phase checkpoint when unrecoverable errors occur or validation fails across retry limits. Revert intermediate modifications.

## Exit Gate

Pass when all phases reach terminal success, validation checks pass with zero blocking errors, rollback targets are preserved, and summary reports are emitted.
