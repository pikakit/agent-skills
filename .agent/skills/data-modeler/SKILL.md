---
name: data-modeler
description: This skill should be used when the user asks to "design a database schema", "choose a database", "plan a migration", "add an index", or "fix an N+1 query". Do not use it for API transport design or application UI.
metadata:
  id: data-modeler
  schema_version: "2.0.0"
  type: knowledge
  category: data
  risk_tier: high
  version: "4.0.0"
  author: pikakit
  triggers: ["design a database schema", "choose a database", "plan a migration", "add an index", "fix an N+1 query"]
  negative_triggers: ["design API transport", "build application UI", "administer a database server"]
  coordinates_with: [api-architect, nodejs-pro, python-pro, security-scanner]
  capabilities: [data-modeling, database-selection, indexing, migration-planning, query-analysis]
  platforms: [postgresql, sqlite, managed-databases]
  last_reviewed: "2026-09-28"
  review_interval_days: 180
---

# Data Modeling

Design data around invariants, access patterns, lifecycle, and recovery rather than a preferred database or ORM.

## Workflow

1. Record entities, invariants, ownership, retention, sensitivity, consistency, and expected scale.
2. Capture read/write paths and transaction boundaries before selecting storage.
3. Model constraints in the database where the database can enforce them.
4. Choose keys and indexes from query predicates, ordering, joins, and measured plans.
5. Design migrations as expand, backfill, verify, switch, and contract phases.
6. Define backup, restore, rollback, observability, and data-quality gates.
7. Verify with representative volume, concurrency, and failure cases.

## Routing

| Concern | Read |
|---|---|
| Storage engine | [database-selection.md](rules/database-selection.md) |
| Schema and relationships | [schema-design.md](rules/schema-design.md) |
| ORM or query builder | [orm-selection.md](rules/orm-selection.md) |
| Index design | [indexing.md](rules/indexing.md) |
| Query plans and N+1 | [optimization.md](rules/optimization.md) |
| Online schema change | [migrations.md](rules/migrations.md) |
| Cross-cutting gate | [engineering-spec.md](rules/engineering-spec.md) |

## Release Gate

Require reviewed constraints, migration rehearsal, backup/restore evidence, bounded lock impact, application compatibility across rollout versions, data reconciliation, and a tested rollback or forward-fix. Never apply destructive changes without explicit approval.
