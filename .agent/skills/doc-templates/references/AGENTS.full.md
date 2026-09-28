# Doc Templates Full Agent Rules

> Deterministic compilation of 2 source rules for doc-templates v3.9.224. Do not edit directly.

## Rule Index

- [Documentation Templates and Quality Reference](#rule-doc) (standard, reference, source: `rules/doc.md`)
- [Documentation Architecture and Quality Gate](#rule-engineering-spec) (standard, process, source: `rules/engineering-spec.md`)

<a id="rule-doc"></a>

## Documentation Templates and Quality Reference

**Impact:** standard
**Kind:** reference
**Source:** `rules/doc.md`

# Documentation Templates and Quality Reference

## Scope

Applies to technical documentation across repositories, including README structures, API summaries, Architecture Decision Records (ADRs), changelogs, llms context manifests, and inline code commenting guidelines.

## Guidance

### 1. README Template (6 Required Sections)

Every repository README must contain these six sections in order:

```markdown
# Project Name

One-line description of project purpose.

## Quick Start

```bash
git clone https://github.com/org/project.git
cd project && npm install
cp .env.example .env
npm run dev
```

## Features

- **Feature A** — Core functionality
- **Feature B** — Secondary functionality

## Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `3000` | No |
| `DATABASE_URL` | Database connection string | — | Yes |

## Documentation

- [API Reference](./docs/api.md)
- [Architecture Decisions](./docs/adr/)

## License

MIT
```

### 2. API Documentation Template

```markdown
# Endpoint: [METHOD] /api/v1/resource

Brief description of action performed.

## Authentication

- **Type:** Bearer token / Session cookie
- **Role:** `admin` | `user`

## Request Parameters / Body

```json
{
  "name": "Widget",
  "quantity": 10
}
```

## Response

- **Status:** `200 OK`
```json
{
  "id": "wgt_123",
  "status": "created"
}
```

## Error Codes

| Code | Meaning | Recovery |
|------|---------|----------|
| `400` | Validation failed | Correct parameters |
| `401` | Unauthorized | Refresh credentials |
| `404` | Not found | Check resource ID |
```

### 3. Architecture Decision Record (ADR) Template

```markdown
# ADR-001: Title of Decision

- **Status:** Accepted | Superseded | Deprecated
- **Date:** 2026-09-28
- **Deciders:** Engineering Team

## Context

Problem statement and technical constraints driving the decision.

## Decision

The architecture or design pattern selected and why.

## Alternatives Considered

1. **Option A:** Pros, cons, and rejection reason.
2. **Option B:** Pros, cons, and rejection reason.

## Consequences

- **Positive:** Benefits gained.
- **Negative:** Trade-offs and operational overhead.
```

### 4. Changelog Template

Follow Keep a Changelog guidelines:

```markdown
# Changelog

All notable changes will be documented in this file.

## [1.2.0] - 2026-09-28

### Added
- Feature description (#123)

### Changed
- Dependency upgrade (#124)

### Fixed
- Defect resolution (#125)
```

Categories (fixed order): `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`.

### 5. llms.txt Template

Context summary for AI agents:

```markdown
# Project Name

> One-line architectural overview.

## Tech Stack
- Runtime: Node.js 22 / TypeScript 5.8
- Framework: Next.js 15 (App Router)
- Storage: PostgreSQL + Prisma

## Key Invariants
- Server Components by default
- All database access through dedicated data layer
```

### 6. Comment Guidelines

- **Comment WHY, not WHAT:** Document business rules, non-obvious algorithm choices, and upstream API workarounds.
- **Do not state the obvious:** Omit redundant comments that restate self-documenting code or type signatures.

## Verification

Validate that created documents contain all mandatory sections, internal Markdown links resolve to existing paths, code fences are balanced, and sensitive credentials are excluded.

<a id="rule-engineering-spec"></a>

## Documentation Architecture and Quality Gate

**Impact:** standard
**Kind:** process
**Source:** `rules/engineering-spec.md`

# Documentation Architecture and Quality Gate

## Preconditions

- Identify documentation audience, technical scope, API version, and repository layout.
- Confirm all external links, internal relative file paths, and referenced symbols exist.
- Identify required templates: README, Architecture Decision Records (ADRs), API specs, or changelog.

## Procedure

1. Verify document structure follows established templates (required sections, scannable headings).
2. Validate that code examples are executable, syntax-highlighted, and free from secret tokens.
3. Check relative Markdown links and media references against active filesystem targets.
4. Ensure terminology consistency, correct spelling, and adherence to style guide principles.
5. Generate table of contents and navigation aids for documents exceeding 100 lines.

## Rollback

Restore the previous documentation version if broken links, incorrect API signatures, or invalid instructions are introduced.

## Exit Gate

Pass when all required sections are populated, internal links resolve, examples pass syntax validation, and code fences are balanced.
