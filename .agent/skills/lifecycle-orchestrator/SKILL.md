---
name: lifecycle-orchestrator
description: This skill should be used when the user asks to coordinate a multi-phase implementation, manage checkpoints and rollback, sequence multiple agents, or run an end-to-end delivery workflow.
metadata:
  id: lifecycle-orchestrator
  schema_version: "2.0.0"
  type: knowledge
  category: meta
  risk_tier: high
  version: "3.9.224"
  author: pikakit
  triggers: ["coordinate a multi-phase implementation", "manage checkpoints and rollback", "sequence multiple agents", "run an end-to-end delivery workflow"]
  negative_triggers: ["make a single-file edit", "answer a code question", "write a task plan without execution"]
  coordinates_with: [project-planner, execution-reporter, problem-checker]
  capabilities: ["phase orchestration", "checkpoint planning", "rollback coordination", "handoff control"]
  platforms: [cross-platform]
  last_reviewed: "2026-09-28"
  review_interval_days: 180
---

# Lifecycle Orchestrator

Coordinate complex work as explicit phases with ownership, entry criteria, evidence, and recovery paths.

## Workflow

1. Confirm scope, dependencies, risk, acceptance criteria, and authorized side effects.
2. Establish a baseline and a recoverable checkpoint before risky mutations.
3. Assign non-overlapping ownership and define handoff artifacts for parallel work.
4. Execute phases in dependency order; do not mark a phase complete without its exit evidence.
5. On failure, stop dependent work, preserve diagnostics, and restore only the affected checkpoint when safe.
6. Integrate changes, run the complete acceptance suite, and report residual risks and skipped checks.

## Invariants

- Never claim rollback support unless a checkpoint exists and restoration is verified.
- Never hide failed, skipped, timed-out, or unavailable checks.
- Never broaden external authority through orchestration.
- Keep user changes and unrelated work intact.

Read `rules/production-gates.md` for phase, rollback, observability, and release requirements.
