---
title: Production Data Model Decision
kind: decision
impact: high
tags: [database, schema, lifecycle]
applies_to: [postgresql, sqlite, managed-databases]
last_reviewed: "2026-09-28"
sources:
  - title: PostgreSQL Documentation
    url: https://www.postgresql.org/docs/current/
  - title: SQLite Documentation
    url: https://www.sqlite.org/docs.html
---

# Production Data Model Decision

## Decision

Select storage from consistency, access, latency, availability, residency, and operational requirements. Encode invariants with database constraints, choose indexes from measured query plans, and evolve schemas through compatibility-preserving phases. Keep backup, restore, retention, and deletion behavior part of the model.

## Use When

- Selecting a database, schema, key, relationship, index, partition, or ORM.
- Planning a backfill, online migration, retention rule, or high-volume query path.
- Correcting integrity drift, lock contention, N+1 access, or poor query plans.

## Avoid When

- No access patterns or consistency requirements are known.
- The task is only transport/API shape with no persistence decision.
- A production migration would proceed without owner approval, backup, and rehearsal.

## Trade-offs

- Normalization strengthens integrity but can increase joins on read-heavy paths.
- Denormalization reduces read work but introduces synchronization and repair obligations.
- Additional indexes accelerate selected reads while increasing writes, storage, and vacuum work.
- ORM convenience improves delivery speed but can obscure query shape and database-specific controls.

## Verification

Test constraints, transaction races, representative query plans, lock duration, replication lag, and data reconciliation. Rehearse expand/backfill/switch/contract migrations with old and new application versions. Verify backup restore, deletion/retention behavior, monitoring, and either rollback or an approved forward-fix path.
