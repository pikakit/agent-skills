---
title: MCP Server Release Gate
kind: process
impact: high
tags: [mcp, protocol, release]
applies_to: [mcp-builder]
last_reviewed: "2026-09-28"
sources:
  - title: Model Context Protocol specification
    url: https://modelcontextprotocol.io/specification/2025-06-18
---

# MCP Server Release Gate

## Preconditions

- Pin the MCP specification revision and official SDK version.
- Identify clients, transport, trust boundary, credentials, and expected side effects.
- Define capability ownership and compatibility requirements.

## Procedure

1. Model workflows as the smallest necessary tools, resources, or prompts.
2. Use precise input/output schemas, descriptions, and explicit read-only or destructive semantics.
3. Validate all input server-side and enforce authorization at the protected resource.
4. Bound runtime, output, pagination, retries, and concurrency; support cancellation where the SDK permits it.
5. Return protocol-conformant, actionable, redacted errors.
6. Test initialization, negotiation, discovery, invocation, malformed input, denial, timeout, and disconnect behavior.
7. Evaluate representative client tasks without coupling assertions to one model's prose.

## Rollback

Keep the previous compatible server artifact and configuration. Withdraw the new capability or restore the prior version if clients cannot negotiate or safety and reliability checks regress.

## Exit Gate

Pass when protocol fixtures and task evaluations succeed, schemas match runtime behavior, side effects require appropriate consent, logs contain no secrets, and rollback is verified.
