# Project Planner Full Agent Rules

> Deterministic compilation of 1 source rules for project-planner v3.9.224. Do not edit directly.

## Rule Index

- [Project Plan Architecture and Release Gate](#rule-engineering-spec) (high, process, source: `rules/engineering-spec.md`)

<a id="rule-engineering-spec"></a>

## Project Plan Architecture and Release Gate

**Impact:** high
**Kind:** process
**Source:** `rules/engineering-spec.md`

# Project Plan Architecture and Release Gate

## Preconditions

- Identify project requirements, target architecture, constraints, and stakeholder acceptance criteria.
- Deconstruct project scope into hierarchical, non-overlapping work breakdown phases.
- Define explicit agent skill assignments, verification checkpoints, and rollback strategies.

## Procedure

1. Validate problem statement and confirm architectural invariants before generating tasks.
2. Structure implementation sequence into logical phases with measurable deliverables.
3. Establish dependencies between tasks to enable safe parallel execution without file collision.
4. Define test and validation gates for each phase (unit, integration, regression).
5. Document PLAN.md with explicit risk disclosures, resource boundaries, and criteria for success.

## Rollback

Abort execution and revise the project plan when fundamental assumptions fail, dependency deadlocks occur, or unforeseen breaking changes arise.

## Exit Gate

Pass when PLAN.md covers all user requirements, phase tasks have assigned skills and acceptance criteria, dependency order is acyclic, and rollback paths are defined.
