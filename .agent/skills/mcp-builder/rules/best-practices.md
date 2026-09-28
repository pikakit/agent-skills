---
title: MCP Capability Design
kind: decision
impact: high
tags: [mcp, tool-design]
applies_to: [mcp-builder]
last_reviewed: "2026-09-28"
sources:
  - title: Model Context Protocol specification
    url: https://modelcontextprotocol.io/specification/2025-06-18
---

# MCP Capability Design

## Decision

Expose the smallest protocol capability that lets a client complete one coherent task. Use tools for actions or computed retrieval, resources for application-controlled context, and prompts for user-invoked templates.

## Use When

- Use a tool when arguments, authorization, side effects, and errors need a callable contract.
- Use a resource when clients should read addressable application data.
- Use a prompt when a user intentionally selects a reusable interaction template.
- Add pagination or bounded summaries when results can grow without limit.

## Avoid When

- Avoid wrapping every upstream endpoint one-for-one.
- Avoid ambiguous tools that switch behavior from free-form instructions.
- Avoid returning entire databases, logs, or binary payloads as text.
- Avoid relying on descriptions for authorization or confirmation.

## Trade-offs

Coarse tools reduce orchestration calls but widen permissions and output. Fine-grained tools improve control but increase discovery and sequencing. Prefer task coherence with explicit input, output, and side-effect boundaries.

## Verification

Have an unfamiliar client select and call the capability from its schema alone. Test malformed input, denial, timeout, cancellation, pagination, empty results, and output-size limits.
