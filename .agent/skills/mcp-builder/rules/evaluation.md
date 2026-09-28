---
title: MCP Evaluation Procedure
kind: process
impact: high
tags: [mcp, evaluation]
applies_to: [mcp-builder]
last_reviewed: "2026-09-28"
sources:
  - title: Model Context Protocol specification
    url: https://modelcontextprotocol.io/specification/2025-06-18
---

# MCP Evaluation Procedure

## Preconditions

- Freeze server, client, SDK, and protocol versions.
- Define representative tasks, expected evidence, permitted effects, and pass criteria.
- Prepare isolated deterministic fixtures and reset logic.

## Procedure

1. Test lifecycle and discovery independently from model behavior.
2. Test every schema with valid, boundary, malformed, and unauthorized inputs.
3. Evaluate representative client tasks that require capability selection and result interpretation.
4. Include empty, pagination, timeout, cancellation, dependency-failure, and oversized-output cases.
5. Score task completion, correctness, safety, calls, latency, and output volume separately.
6. Repeat nondeterministic evaluations enough to expose variance and retain raw redacted traces.

## Rollback

Reset fixtures after each case and restore the last released server/configuration when a regression appears. Do not reuse mutated state across comparisons.

## Exit Gate

Pass only when protocol tests are deterministic, all safety cases fail closed, representative tasks meet documented thresholds, and results identify the exact server and client versions.
