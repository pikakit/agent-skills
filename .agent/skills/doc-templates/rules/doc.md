---
title: Documentation Templates and Quality Reference
kind: reference
impact: standard
tags: [documentation, readme, adr, changelog]
applies_to: [doc-templates]
last_reviewed: "2026-09-28"
sources:
  - title: Google Developer Documentation Style Guide
    url: https://developers.google.com/style
  - title: W3C Documentation Guidelines
    url: https://www.w3.org/wiki/Documentation
---

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
