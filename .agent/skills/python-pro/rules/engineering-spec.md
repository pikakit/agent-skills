---
title: Python Service Architecture Decision
kind: decision
impact: high
tags: [python, architecture, runtime]
applies_to: [python, containers, serverless]
last_reviewed: "2026-09-28"
sources:
  - title: Python 3 Documentation
    url: https://docs.python.org/3/
  - title: Python asyncio Documentation
    url: https://docs.python.org/3/library/asyncio.html
---

# Python Service Architecture Decision

## Decision

Choose Django for an integrated data-backed product, FastAPI for a typed ASGI API, and a smaller library or standard-library entry point for bounded utilities. Separate transport, domain, persistence, and integrations. Type public contracts, validate external data, isolate blocking work, and make startup/shutdown explicit.

## Use When

- Starting or restructuring a Python web service, worker, or operational tool.
- Selecting a framework, async model, package layout, or validation boundary.
- Hardening typing, dependency management, tests, and lifecycle behavior.

## Avoid When

- A simple script does not need a web framework.
- CPU-bound parallelism is expected to scale through asyncio alone.
- The existing platform mandates a supported framework and migration cost outweighs benefit.

## Trade-offs

- Django supplies cohesive conventions but is heavier for narrow APIs.
- FastAPI aligns with typed API contracts but does not choose persistence or job architecture.
- Async improves I/O concurrency but fails when blocking libraries run on the event loop.
- Strict typing improves boundary clarity but requires maintained annotations and checker discipline.

## Verification

Run the configured formatter, linter, type checker, unit tests, integration tests, dependency audit, and migration checks. Test invalid input, cancellation, downstream timeout, startup failure, signal shutdown, and rollback. Measure latency, memory, worker saturation, and error rate using representative workload; redact credentials and personal data from diagnostics.
