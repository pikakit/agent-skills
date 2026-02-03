---
name: doc-templates
description: >-
  Documentation templates and structure guidelines. README, API docs, code comments, and AI-friendly documentation.
  Triggers on: template, README, documentation, API docs, changelog, ADR.
  Coordinates with: project-planner, code-craft.
metadata:
  category: "specialized"
  version: "1.0.0"
  triggers: "template, README, documentation, API docs, changelog, ADR"
  coordinates_with: "project-planner, code-craft"
  success_metrics: "template applied, documentation complete"
---

# Documentation Templates

> **Purpose:** Templates and structure guidelines for documentation.

---

## When to Use

| Situation | Template |
|-----------|----------|
| New project README | README Template |
| API endpoint docs | API Doc Template |
| Architecture decisions | ADR Template |
| Release notes | Changelog Template |
| AI agent context | llms.txt Template |

---

## 📂 Skill Structure

```
doc-templates/
├── SKILL.md
└── references/
    └── doc.md     # Detailed templates & examples
```

---

## README Template

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
|-----------|------------------|
| Why (business logic) | What (obvious) |
| Complex algorithms | Every line |
| API contracts | Implementation details |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `/chronicle` | Workflow | Auto-documentation |
| `project-planner` | Skill | Project structure |

---

## References

See [references/doc.md](references/doc.md) for full templates.

---

⚡ PikaKit v3.2.0
