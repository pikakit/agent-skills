---
name: api-architect
description: This skill should be used when the user asks to choose an API style, define an API contract, evolve an API, or review API security boundaries.
metadata:
  id: api-architect
  schema_version: "2.0.0"
  type: knowledge
  category: architecture
  risk_tier: high
  version: "3.9.224"
  author: pikakit
  triggers: ["choose an API style", "design an API contract", "plan API versioning", "review an API boundary"]
  negative_triggers: ["implement an existing endpoint", "write database migrations directly", "penetration-test a live API"]
  coordinates_with: [data-modeler, auth-patterns, security-scanner, nodejs-pro]
  capabilities: ["API style selection", "contract design", "compatibility planning", "API security review"]
  platforms: [cross-platform]
  last_reviewed: "2026-09-28"
  review_interval_days: 180
---

# API Architect

Design contracts from consumers, trust boundaries, consistency needs, and change constraints. Prefer standards-based, machine-readable contracts and explicit compatibility policy.

## Workflow

1. Identify consumers, ownership, data sensitivity, latency, availability, and lifecycle constraints.
2. Choose REST, GraphQL, RPC, or another style from requirements rather than fashion.
3. Define resource or operation semantics, validation, errors, pagination, idempotency, and authorization.
4. Publish a machine-readable contract and compatibility policy.
5. Threat-model object, property, function, and resource authorization.
6. Verify with contract, negative, load, and security tests.

## Detailed Guidance

Read only the relevant file under `rules/`; use `engineering-spec.md` for the release gate. Route implementation to the language skill and active security testing to `security-scanner`.
