---
title: Node.js Service Architecture Decision
kind: decision
impact: high
tags: [nodejs, architecture, runtime]
applies_to: [nodejs, serverless, containers]
last_reviewed: "2026-09-28"
sources:
  - title: Node.js API Documentation
    url: https://nodejs.org/docs/latest-v22.x/api/
  - title: Node.js Don't Block the Event Loop
    url: https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop
---

# Node.js Service Architecture Decision

## Decision

Use the smallest maintained framework that satisfies transport, plugin, lifecycle, and deployment requirements. Keep domain logic independent of HTTP objects. Validate at boundaries, propagate cancellation, bound concurrency, centralize error translation, and implement graceful shutdown. Use worker threads or an external worker for CPU-bound work.

## Use When

- Building HTTP, event-driven, worker, or serverless Node.js services.
- Choosing ESM/CommonJS, a framework, concurrency strategy, or lifecycle model.
- Correcting event-loop stalls, unhandled rejections, or shutdown loss.

## Avoid When

- Browser rendering is the primary concern.
- The workload is predominantly long-running CPU computation without worker isolation.
- A platform-owned runtime contract requires a different architecture.

## Trade-offs

- Minimal frameworks reduce abstraction but require explicit lifecycle and policy wiring.
- Batteries-included frameworks standardize large teams but add conventions and startup cost.
- In-process concurrency is efficient for I/O but amplifies overload without limits.
- Worker threads isolate CPU work but add serialization, lifecycle, and observability overhead.

## Verification

Measure event-loop delay, latency percentiles, memory, connection limits, and error rates under representative load. Test malformed input, downstream timeout, abort, retry limits, partial response, unhandled rejection, signal-driven shutdown, and forced termination. Confirm diagnostics redact credentials and rollback uses a compatible artifact and schema.
