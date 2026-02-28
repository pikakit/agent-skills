---
name: data-modeler
description: >-
  Database design principles and decision-making. Schema design, indexing strategy, ORM selection.
  Triggers on: database, schema, Prisma, Drizzle, SQL, migration, indexing.
  Coordinates with: api-architect, security-scanner, nodejs-pro.
allowed-tools: Read, Write, Edit, Glob, Grep
metadata:
  version: "1.0.0"
  category: "architecture"
  triggers: "database, schema, Prisma, Drizzle, SQL, migration, indexing"
  success_metrics: "schema validated, indexes optimized, migrations safe"
  coordinates_with: "api-architect, security-scanner, nodejs-pro"
---

# Database Design

> **Learn to THINK, not copy SQL patterns.**

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Choosing database | Read database-selection.md |
| Choosing ORM | Read orm-selection.md |
| Schema design | Check schema-design.md |
| Performance tuning | Read indexing.md |

---

## 🎯 Selective Reading Rule

**Read ONLY files relevant to the request!** Check the content map, find what you need.

| File                    | Description                           | When to Read       |
| ----------------------- | ------------------------------------- | ------------------ |
| `database-selection.md` | PostgreSQL vs Neon vs Turso vs SQLite | Choosing database  |
| `orm-selection.md`      | Drizzle vs Prisma vs Kysely           | Choosing ORM       |
| `schema-design.md`      | Normalization, PKs, relationships     | Designing schema   |
| `indexing.md`           | Index types, composite indexes        | Performance tuning |
| `optimization.md`       | N+1, EXPLAIN ANALYZE                  | Query optimization |
| `migrations.md`         | Safe migrations, serverless DBs       | Schema changes     |

---

## ⚠️ Core Principle

- ASK user for database preferences when unclear
- Choose database/ORM based on CONTEXT
- Don't default to PostgreSQL for everything

---

## Decision Checklist

Before designing schema:

- [ ] Asked user about database preference?
- [ ] Chosen database for THIS context?
- [ ] Considered deployment environment?
- [ ] Planned index strategy?
- [ ] Defined relationship types?

---

## Anti-Patterns

❌ Default to PostgreSQL for simple apps (SQLite may suffice)
❌ Skip indexing
❌ Use SELECT \* in production
❌ Store JSON when structured data is better
❌ Ignore N+1 queries

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `api-architect` | Skill | API design |
| `nodejs-pro` | Skill | Backend |
| `python-pro` | Skill | Python backend |

---

⚡ PikaKit v3.9.66
