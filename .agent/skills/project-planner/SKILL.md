---
name: project-planner
description: This skill should be used when the user asks to plan a multi-step feature, decompose a refactor, sequence dependent work, or define implementation acceptance criteria.
metadata:
  id: project-planner
  schema_version: "2.0.0"
  type: knowledge
  category: meta
  risk_tier: standard
  version: "3.9.224"
  author: pikakit
  triggers: ["plan a multi-step feature", "decompose a refactor", "sequence dependent work", "define implementation acceptance criteria"]
  negative_triggers: ["apply a trivial edit", "answer a factual question", "report task progress"]
  coordinates_with: [idea-storm, smart-router, test-architect]
  capabilities: ["task decomposition", "dependency mapping", "risk planning", "acceptance design"]
  platforms: [cross-platform]
  last_reviewed: "2026-09-28"
  review_interval_days: 365
---

# Project Planner

Produce an executable plan grounded in the repository rather than a generic checklist.

## Workflow

1. Inspect the current system, constraints, ownership boundaries, and available validation.
2. Resolve only ambiguities that materially alter the implementation.
3. Decompose work into independently verifiable outcomes and identify dependencies.
4. Assign file or subsystem ownership, expected behavior, rollback needs, and evidence for each outcome.
5. Sequence foundational contracts before consumers and risky migrations before irreversible cleanup.
6. Define a final acceptance gate covering behavior, types, tests, security, documentation, and artifact synchronization as applicable.

## Plan Quality

Each task names an outcome, scope, dependencies, risks, and verification. Avoid arbitrary task counts, invented file names, fixed time estimates without data, and implementation detail unsupported by inspection.

Read `rules/production-gates.md` for planning preconditions, rollback, and exit criteria.
