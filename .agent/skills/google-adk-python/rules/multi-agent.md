---
title: Multi-Agent Orchestration
kind: decision
impact: high
tags: [google-adk, multi-agent]
applies_to: [google-adk-python]
last_reviewed: "2026-09-28"
sources:
  - title: ADK multi-agent systems
    url: https://google.github.io/adk-docs/agents/multi-agents/
---

# Multi-Agent Orchestration

## Decision

Start with one agent and deterministic tools. Add workflow or specialist agents only when a measured requirement needs explicit sequencing, safe parallelism, bounded iteration, or responsibility isolation.

## Use When

- Use a sequential workflow when each stage consumes a validated predecessor result.
- Use parallel composition when branches are independent, resource limits are explicit, and merge behavior is deterministic.
- Use a loop only with a programmatic termination condition and hard iteration limit.
- Use specialist delegation when permissions or context ownership differ materially.

## Avoid When

- Avoid multiple agents to simulate roles that share the same context, permissions, and tools.
- Avoid natural-language-only routing for sensitive authorization decisions.
- Avoid parallel writes to shared state without conflict handling.
- Avoid loops whose only exit is a subjective model judgment.

## Trade-offs

Composition can improve isolation and latency, but increases model calls, cost, nondeterminism, state transfer, tracing complexity, and partial-failure handling. Prefer deterministic workflow primitives when routing is known in advance.

## Verification

Test routing, state transfer, branch failure, timeout, cancellation, merge conflicts, termination, and permission denial. Trace every delegation with redacted inputs and stable correlation identifiers.
