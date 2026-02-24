---
description: Auto-documentation engine. README, API specs, ADR, Storybook, runbooks, and inline comments with zero effort.
---

# /chronicle - Documentation Engine

$ARGUMENTS

---

## Purpose

Generate comprehensive documentation automatically. README, API specs, ADR (Architecture Decision Records), component docs, ops runbooks, and inline comments.

---

## 🤖 Meta-Agents Integration

| Phase | Agent | Action |
|-------|-------|--------|
| **Scope** | `assessor` | Evaluate documentation scope |
| **Patterns** | `learner` | Learn from existing doc patterns |
| **Post** | `learner` | Log templates for reuse |

---

## Sub-commands

```
/chronicle              - Full documentation suite
/chronicle readme       - Generate/update README.md
/chronicle api          - Generate API documentation (OpenAPI)
/chronicle inline       - Add inline code comments (JSDoc/TSDoc)
/chronicle adr          - Create Architecture Decision Record
/chronicle storybook    - Generate component documentation
/chronicle runbook      - Generate ops runbook
/chronicle changelog    - Generate CHANGELOG.md
/chronicle [file-path]  - Document specific file
```

---

## Phase 1: README.md

```markdown
# Project Name
> One-line description

## Features
## Quick Start
### Prerequisites
### Installation
### Environment Setup
## Architecture
## API Reference
## Contributing
## License
```

---

## Phase 2: API Documentation

| Source | Tool | Output |
|-------|------|--------|
| Express/Fastify | swagger-autogen / @nestjs/swagger | OpenAPI 3.1 |
| tRPC | trpc-openapi | OpenAPI 3.1 |
| GraphQL | GraphQL introspection | Schema docs |
| FastAPI | Built-in | `/docs` auto-generated |

**Auto-generation:**
```bash
/chronicle api
# Scans routes → Generates OpenAPI spec → Creates docs/api.yaml
# Includes: endpoints, types, examples (cURL + JS), error codes
```

---

## Phase 3: Architecture Decision Records (ADR)

**FAANG standard** — Document WHY decisions were made, not just WHAT.

```markdown
# ADR-001: Use PostgreSQL over MongoDB

## Status: Accepted
## Date: 2026-02-24

## Context
We need a database for the user management system.
Requirements: ACID transactions, complex queries, strong consistency.

## Decision
Use PostgreSQL with Prisma ORM.

## Consequences
- ✅ Strong consistency, ACID transactions
- ✅ Rich query capabilities (JOIN, window functions)
- ⚠️ Schema migrations required for changes
- ⚠️ Vertical scaling limits (vs. horizontal with MongoDB)

## Alternatives Considered
| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| PostgreSQL | ACID, SQL, mature | Schema migrations | ✅ Chosen |
| MongoDB | Flexible schema | No JOINs, eventual consistency | ❌ |
| Supabase | Postgres + auth | Vendor lock-in | ❌ |
```

**Usage:** `/chronicle adr "Use Redis for session storage"`

---

## Phase 4: Component Documentation (Storybook)

```bash
/chronicle storybook
# Scans components → Generates stories + docs
```

**Generated output per component:**

| Section | Content |
|---------|---------|
| **Props table** | Auto-extracted from TypeScript |
| **Usage examples** | Default, with variants, interactive |
| **Accessibility** | ARIA labels, keyboard nav notes |
| **Design tokens** | Colors, spacing, typography used |

---

## Phase 5: Ops Runbooks

```bash
/chronicle runbook
# Generates operational runbook for common scenarios
```

**Runbook template:**

```markdown
# Runbook: Database Connection Pool Exhausted

## Severity: P1
## Impact: API requests failing with 503

## Diagnosis
1. Check connection pool: `SELECT count(*) FROM pg_stat_activity;`
2. Check for long-running queries
3. Check application connection settings

## Resolution
1. Kill idle connections: `SELECT pg_terminate_backend(pid) ...`
2. Restart API pods: `kubectl rollout restart deployment/api`
3. If persistent: increase pool size in DATABASE_URL

## Prevention
- Set `connection_limit` in Prisma
- Add connection timeout (30s)
- Monitor with `/alert` workflow
```

---

## Phase 6: Inline Comments (JSDoc/TSDoc)

```typescript
/**
 * Creates a new user account with email verification.
 *
 * @param data - User registration data
 * @param data.email - Valid email address
 * @param data.password - Min 8 chars, 1 uppercase, 1 number
 * @returns Newly created user with verification token
 * @throws {ValidationError} If email is invalid
 * @throws {ConflictError} If email already exists
 */
export async function createUser(data: CreateUserInput): Promise<User> {}
```

---

## Output Format

```markdown
## 📚 Chronicle Complete

### Generated Files
| File | Type | Lines |
|------|------|-------|
| README.md | Markdown | 89 |
| docs/api.yaml | OpenAPI | 234 |
| docs/adr/001-database.md | ADR | 45 |
| CHANGELOG.md | Changelog | 52 |

### Coverage
| Metric | Current | Target |
|--------|---------|--------|
| Functions documented | 45/52 | 100% |
| API endpoints | 12/12 | ✅ |
| ADRs | 3 | ongoing |
| Runbooks | 5 | key scenarios |
```

---

## Key Principles

1. **Code as source** — extract docs from code
2. **ADRs are mandatory** — decisions need context
3. **Examples matter** — always include usage
4. **Types are docs** — TypeScript annotations
5. **Keep updated** — regenerate on changes

---

## 🔗 Workflow Chain

**Skills (2):** `doc-templates` · `markdown-novel-viewer`

| After /chronicle | Run | Purpose |
|------------------|-----|---------|
| Need diagrams | `/diagram` | Architecture diagrams |
| Need review | `/inspect` | Verify doc quality |

---

**Version:** 2.0.0 · **Updated:** v3.9.64
