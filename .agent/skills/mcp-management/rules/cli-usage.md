---
title: MCP Client Invocation
kind: process
impact: high
tags: [mcp, client, invocation]
applies_to: [mcp-management]
last_reviewed: "2026-09-28"
sources:
  - title: MCP clients documentation
    url: https://modelcontextprotocol.io/clients
---

# MCP Client Invocation

This repository does not ship a standalone MCP management CLI. Use the configured client's documented discovery and invocation interface; do not invent `cli.ts`, `npx`, or model-specific fallback commands.

## Preconditions

- Identify the active client, configuration source, server, and supported transport.
- Confirm the requested outcome, trust boundary, and allowed side effects.
- Keep credentials out of commands, logs, and copied configuration.

## Procedure

1. Initialize the configured server and record negotiated protocol capabilities.
2. List only the tools, resources, or prompts needed for the request.
3. Select a capability from its name, schema, annotations, and trusted configuration.
4. Validate arguments against the advertised schema.
5. Obtain approval for consequential side effects.
6. Invoke with a bounded timeout and cancellation path.
7. Verify the response and any external effect independently.

## Rollback

Cancel the request and close the transport. Apply a compensating operation only when the server documents it and the user authorized it. Otherwise report uncertain remote state.

## Exit Gate

Pass only when the configured client completes negotiation, validation, invocation, and verification. Missing clients, configuration errors, protocol errors, timeout, and uncertain side effects fail closed.
