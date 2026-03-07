---
name: data-modeler
summary: >-
  Database design principles and decision-making. Schema design, indexing strategy, ORM selection.
  Triggers on: database, schema, Prisma, Drizzle, SQL, migration, indexing.
  Coordinates with: api-architect, security-scanner, nodejs-pro.
metadata:
  version: "2.0.0"
  category: "architecture"
  triggers: "database, schema, Prisma, Drizzle, SQL, migration, indexing"
  success_metrics: "context-appropriate DB selected, indexes planned, migrations safe"
  coordinates_with: "api-architect, security-scanner, nodejs-pro"
---

# Data Modeler — Database Design

> Context-specific decisions. Ask before assuming. Never default to PostgreSQL blindly.

---

## Prerequisites

**Required:** None — Data Modeler is a knowledge-based skill with no external dependencies.

---

## When to Use

| Situation | Action |
|-----------|--------|
| Choosing database | Invoke database-select; read `database-selection.md` |
| Choosing ORM | Invoke orm-select; read `orm-selection.md` |
| Designing schema | Invoke schema-design; read `schema-design.md` |
| Planning indexes | Invoke index-strategy; read `indexing.md` |
| Changing schema | Invoke migration-plan; read `migrations.md` |
| Query performance | Invoke query-analysis; read `optimization.md` |
| Architecture review | Read `references/engineering-spec.md` |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Database selection (PostgreSQL/Neon/Turso/SQLite) | Database provisioning (→ server-ops) |
| ORM selection (Drizzle/Prisma/Kysely) | API endpoint design (→ api-architect) |
| Schema design (normalization, PKs, relationships) | Security scanning (→ security-scanner) |
| Index strategy (B-tree/hash/GIN/GiST) | Database monitoring (→ observability) |
| Migration safety (additive/destructive/multi-phase) | SQL execution |

**Pure decision skill:** Produces database architecture decisions. Zero side effects.

---

## Core Principle

- **ASK** user for database/ORM preference when unclear
- Choose based on **CONTEXT** (deployment, scale, data model, budget)
- Don't default to PostgreSQL for everything
- If user states preference, skip decision tree

---

## Database Selection (Quick Reference)

| Context | Recommendation |
|---------|---------------|
| Prototype / embedded / simple | SQLite |
| Serverless / edge deployment | Turso |
| Serverless PostgreSQL | Neon |
| Production / complex queries | PostgreSQL |

---

## ORM Selection (Quick Reference)

| Context | Recommendation | N+1 Prevention |
|---------|---------------|----------------|
| Type-safe, lightweight | Drizzle | Manual join control |
| Rapid prototyping, relations | Prisma | `include` depth limits |
| Raw SQL with type safety | Kysely | Query-level control |

---

## Index Type Mapping

| Query Pattern | Index Type |
|--------------|-----------|
| Equality lookups | Hash |
| Range queries, sorting | B-tree |
| Full-text search | GIN |
| Spatial queries | GiST |

---

## Decision Checklist

| # | Check | Question |
|---|-------|----------|
| 1 | User preference? | Asked user about database/ORM choice? |
| 2 | Context match? | Chosen for THIS project's scale/deployment? |
| 3 | Deploy environment? | Considered serverless/edge/VPS constraints? |
| 4 | Index strategy? | Planned indexes for known query patterns? |
| 5 | Relationships? | Defined all relationship types with join strategy? |
| 6 | Migration safety? | Classified as additive/destructive/multi-phase? |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_MISSING_CONTEXT` | Yes | Required context field missing |
| `ERR_INVALID_SCALE` | No | Scale not in supported list |
| `ERR_INVALID_DEPLOYMENT` | No | Deployment not in supported list |
| `ERR_CONTEXT_CONFLICT` | Yes | Contradictory context fields |
| `ERR_REFERENCE_NOT_FOUND` | No | Reference file missing |

**Zero internal retries.** Deterministic; same context = same recommendation.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Default to PostgreSQL for simple apps | Choose SQLite when it suffices |
| Skip index planning | Plan indexes for every known query pattern |
| Use `SELECT *` in production | Select only needed columns |
| Store JSON when structured data fits | Use normalized relational schema |
| Ignore N+1 queries | Include N+1 prevention in ORM strategy |
| Run destructive migration without rollback | Plan rollback for every schema change |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [database-selection.md](database-selection.md) | PostgreSQL vs Neon vs Turso vs SQLite | Choosing database |
| [orm-selection.md](orm-selection.md) | Drizzle vs Prisma vs Kysely | Choosing ORM |
| [schema-design.md](schema-design.md) | Normalization, PKs, relationships | Designing schema |
| [indexing.md](indexing.md) | Index types, composite indexes | Performance tuning |
| [optimization.md](optimization.md) | N+1, EXPLAIN ANALYZE | Query analysis |
| [migrations.md](migrations.md) | Safe migrations, serverless DBs | Schema changes |
| [engineering-spec.md](references/engineering-spec.md) | Full engineering spec | Architecture review |

## Script

| Script | Purpose | Command |
|--------|---------|---------| 
| [scripts/schema_validator.js](scripts/schema_validator.js) | Schema validation | `node scripts/schema_validator.js <project_path>` |

**Selective reading rule:** Read ONLY files relevant to the request.

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `api-architect` | Skill | API design patterns |
| `nodejs-pro` | Skill | Node.js backend |
| `python-pro` | Skill | Python backend |
| `security-scanner` | Skill | Security vulnerability detection |

---

⚡ PikaKit v3.9.99
