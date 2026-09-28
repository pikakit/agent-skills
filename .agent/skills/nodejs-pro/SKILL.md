---
name: nodejs-pro
description: This skill should be used when the user asks to "build a Node.js service", "choose a Node framework", "fix event-loop blocking", "design async code", or "harden a Node API". Do not use it for browser UI or database schema design.
metadata:
  id: nodejs-pro
  schema_version: "2.0.0"
  type: knowledge
  category: backend
  risk_tier: high
  version: "4.0.0"
  author: pikakit
  triggers: ["build a Node.js service", "choose a Node framework", "fix event-loop blocking", "design async code", "harden a Node API"]
  negative_triggers: ["build a browser component", "design a database schema", "write a Python service"]
  coordinates_with: [api-architect, data-modeler, auth-patterns, problem-checker, typescript-expert]
  capabilities: [service-architecture, async-design, framework-selection, runtime-hardening, testing]
  platforms: [nodejs, serverless, containers]
  last_reviewed: "2026-09-28"
  review_interval_days: 180
---

# Node.js Backend Engineering

Design observable, bounded, cancellation-aware services around the Node.js event loop.

## Workflow

1. Confirm the supported Node version, module format, deployment target, traffic profile, and latency budget.
2. Define request, domain, persistence, and external-service boundaries before choosing a framework.
3. Validate and normalize every untrusted boundary.
4. Propagate deadlines and cancellation through downstream calls.
5. Bound concurrency, payload size, retries, queues, and shutdown time.
6. Emit structured errors, metrics, traces, and correlation identifiers without sensitive data.
7. Test success, validation, authorization, dependency failure, timeout, cancellation, and shutdown paths.

## Routing

| Concern | Read |
|---|---|
| Runtime and ESM/CommonJS | [runtime-modules.md](rules/runtime-modules.md) |
| Framework choice | [framework-selection.md](rules/framework-selection.md) |
| Layer boundaries | [architecture-patterns.md](rules/architecture-patterns.md) |
| Concurrency and cancellation | [async-patterns.md](rules/async-patterns.md) |
| Error taxonomy | [error-handling.md](rules/error-handling.md) |
| Input and security | [validation-security.md](rules/validation-security.md) |
| Verification | [testing-strategy.md](rules/testing-strategy.md) |
| Cross-cutting gate | [engineering-spec.md](rules/engineering-spec.md) |

## Release Gate

Require strict type checking, deterministic tests, dependency review, no unhandled rejection, no blocking I/O on request paths, graceful shutdown, and an exercised rollback. Treat unavailable required validation as a failure.
