# Perf Optimizer Agent Rules

> Generated from 8 source rules for perf-optimizer v4.0.0. Do not edit directly.

## Mandatory Rules

| Impact | Kind | Rule | Requirement |
|---|---|---|---|
| high | reference | [Backend Patterns: Anti-Patterns](references/AGENTS.full.md#rule-backend-patterns-anti-patterns) | This reference applies only to the platforms declared in metadata and the versions confirmed in the target repository. |
| high | reference | [Backend Patterns: Connection Pooling](references/AGENTS.full.md#rule-backend-patterns-connection-pooling) | Apply this guidance only to the declared platforms and repository-confirmed versions. |
| high | process | [Backend Patterns: Database Query Optimization](references/AGENTS.full.md#rule-backend-patterns-database-query-optimization) | Record the current behavior, target environment, acceptance criteria, and a recoverable baseline before starting. |
| high | reference | [Backend Patterns: N+1 Query Detection & Fix](references/AGENTS.full.md#rule-backend-patterns-n-1-query-detection-fix) | Apply this guidance only to the declared platforms and repository-confirmed versions. |
| high | reference | [Backend Patterns: Pagination Patterns](references/AGENTS.full.md#rule-backend-patterns-pagination-patterns) | Apply this guidance only to the declared platforms and repository-confirmed versions. |
| high | reference | [Backend Patterns: Redis Caching Patterns](references/AGENTS.full.md#rule-backend-patterns-redis-caching-patterns) | Apply this guidance only to the declared platforms and repository-confirmed versions. |
| high | reference | [Backend Patterns: Related](references/AGENTS.full.md#rule-backend-patterns-related) | This reference applies only to the platforms declared in metadata and the versions confirmed in the target repository. |
| high | process | [Production verification gates](references/AGENTS.full.md#rule-production-gates) | - Confirm the target platform and dependency versions from the repository. |

## Use

Apply every relevant rule. Open the linked full rule before implementation, review, or release decisions.
