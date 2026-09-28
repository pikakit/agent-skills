---
name: python-pro
description: This skill should be used when the user asks to "build a Python service", "choose FastAPI or Django", "type a Python project", "design asyncio code", or "test a Python backend". Do not use it for Node.js or general agent orchestration.
metadata:
  id: python-pro
  schema_version: "2.0.0"
  type: knowledge
  category: backend
  risk_tier: high
  version: "4.0.0"
  author: pikakit
  triggers: ["build a Python service", "choose FastAPI or Django", "type a Python project", "design asyncio code", "test a Python backend"]
  negative_triggers: ["build a Node.js service", "orchestrate AI agents", "design a database schema"]
  coordinates_with: [api-architect, test-architect, data-modeler, problem-checker]
  capabilities: [framework-selection, typed-python, async-design, service-architecture, testing]
  platforms: [python, containers, serverless]
  last_reviewed: "2026-09-28"
  review_interval_days: 180
---

# Python Backend Engineering

Build typed, observable Python systems with explicit ownership of blocking work and lifecycle state.

## Workflow

1. Confirm the supported Python version, packaging tool, deployment target, and concurrency model.
2. Choose a framework from product requirements rather than popularity.
3. Isolate transport, domain, persistence, and integration boundaries.
4. Validate external data at entry points and type public interfaces.
5. Keep blocking work outside the event loop; add deadlines and cancellation to I/O.
6. Define structured errors, logging, metrics, startup, shutdown, and rollback behavior.
7. Test behavior at unit, integration, and contract boundaries.

## Routing

| Concern | Read |
|---|---|
| Framework decision | [framework-selection.md](rules/framework-selection.md) |
| Package boundaries | [project-structure.md](rules/project-structure.md) |
| Async and cancellation | [async-patterns.md](rules/async-patterns.md) |
| FastAPI | [fastapi-patterns.md](rules/fastapi-patterns.md) |
| Django | [django-patterns.md](rules/django-patterns.md) |
| Type contracts | [type-hints.md](rules/type-hints.md) |
| Tests | [testing-patterns.md](rules/testing-patterns.md) |
| Cross-cutting gate | [engineering-spec.md](rules/engineering-spec.md) |

## Release Gate

Require locked dependencies, type checking, deterministic tests, migration review, timeouts for external I/O, graceful shutdown, and redacted diagnostics. Fail when a required check cannot run.
