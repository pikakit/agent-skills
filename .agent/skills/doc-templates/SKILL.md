---
name: doc-templates
description: >-
  Documentation templates and structure guidelines. README, API docs, code comments, and AI-friendly documentation.
  Triggers on: template, README, documentation, API docs, changelog, ADR.
  Coordinates with: project-planner, code-craft.
metadata:
  version: "2.0.0"
  category: "specialized"
  triggers: "template, README, documentation, API docs, changelog, ADR"
  success_metrics: "template applied, all required sections present"
  coordinates_with: "project-planner, code-craft"
---

# Doc Templates — Documentation Structure

> Fixed templates per document type. All sections required. Fill content, not structure.

---

## Prerequisites

**Required:** None — Doc Templates is a knowledge-based skill with no external dependencies.

---

## When to Use

| Document Type | Template | Required Sections |
|--------------|----------|-------------------|
| New project README | README template | 6 sections |
| API endpoint docs | API doc template | Method, path, params, response |
| Architecture decisions | ADR template | Status, Context, Decision, Consequences |
| Release notes | Changelog template | Version, date, changes |
| AI agent context | llms.txt template | Project summary, structure |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Template structure (5 document types) | Content writing |
| Section order and requirements | Auto-documentation (→ /chronicle) |
| Comment guidelines (why vs what) | Project structure (→ project-planner) |
| AI-friendly doc format (llms.txt) | Code quality (→ code-craft) |

**Pure decision skill:** Produces document templates and guidelines. Zero side effects.

---

## README Template (6 Required Sections)

```markdown
# Project Name

Brief one-line description.

## Quick Start

[Minimum steps to run]

## Features

- Feature 1
- Feature 2

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |

## Documentation

- [API Reference](./docs/api.md)

## License

MIT
```

---

## API Endpoint Template

```markdown
## GET /users/:id

Get a user by ID.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | User ID |

**Response:** 200: User object, 404: Not found
```

---

## ADR Template

```markdown
# ADR-001: [Title]

## Status
Accepted / Deprecated / Superseded

## Context
Why are we making this decision?

## Decision
What did we decide?

## Consequences
What are the trade-offs?
```

---

## Comment Guidelines

| ✅ Comment | ❌ Don't Comment |
|-----------|-----------------|
| Why (business logic) | What (obvious code) |
| Complex algorithms | Every line |
| API contracts | Implementation details |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_REFERENCE_NOT_FOUND` | No | Reference file missing |

**Zero internal retries.** Deterministic; same type = same template.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Skip Quick Start in README | Always include Quick Start |
| Undocumented API parameters | Document all params with types |
| ADR without Consequences | Always include trade-offs |
| Comment what code does | Comment why code exists |
| No changelog | Maintain structured changelog |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [doc.md](references/doc.md) | Full templates and examples | Detailed template reference |
| [engineering-spec.md](references/engineering-spec.md) | Full engineering spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `/chronicle` | Workflow | Auto-documentation generation |
| `project-planner` | Skill | Project structure planning |
| `code-craft` | Skill | Code quality and comments |

---

⚡ PikaKit v3.9.82
