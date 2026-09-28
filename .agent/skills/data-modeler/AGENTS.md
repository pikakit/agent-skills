# Data Modeler Agent Rules

> Generated from 7 source rules for data-modeler v4.0.0. Do not edit directly.

## Mandatory Rules

| Impact | Kind | Rule | Requirement |
|---|---|---|---|
| high | reference | [Database Selection](references/AGENTS.full.md#rule-database-selection) | Choose database based on context, not default. Never assume PostgreSQL. |
| high | decision | [Production Data Model Decision](references/AGENTS.full.md#rule-engineering-spec) | Select storage from consistency, access, latency, availability, residency, and operational requirements. Encode invariants with database constraints, choose indexes from measured query plans, and evol |
| high | reference | [Database Indexing](references/AGENTS.full.md#rule-indexing) | When and how to create indexes effectively. Index for known queries, not speculatively. |
| critical | reference | [Compatible Database Migrations](references/AGENTS.full.md#rule-migrations) | Safe migration strategy for zero-downtime schema changes. |
| high | reference | [Query Optimization](references/AGENTS.full.md#rule-optimization) | N+1 problem, EXPLAIN ANALYZE, optimization priorities with real examples. |
| high | reference | [ORM and Query Builder Selection](references/AGENTS.full.md#rule-orm-selection) | Choose ORM based on deployment, DX needs, and N+1 prevention strategy. |
| high | reference | [Relational Schema Design](references/AGENTS.full.md#rule-schema-design) | Normalization, primary keys, timestamps, relationships with ORM examples. |

## Use

Apply every relevant rule. Open the linked full rule before implementation, review, or release decisions.
