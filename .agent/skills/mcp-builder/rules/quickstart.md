---
title: MCP Server Bootstrap
kind: process
impact: high
tags: [mcp, bootstrap]
applies_to: [mcp-builder]
last_reviewed: "2026-09-28"
sources:
  - title: MCP build server guide
    url: https://modelcontextprotocol.io/docs/develop/build-server
---

# MCP Server Bootstrap

## Preconditions

- Select an official SDK supported by the target client and runtime.
- Pin the SDK, runtime, and protocol revision.
- Define one read-only capability and an isolated fixture for the first vertical slice.

## Procedure

1. Initialize the project using the pinned runtime's package manager.
2. Follow the current official SDK guide for server and transport construction.
3. Implement business logic as a separately testable function.
4. Register one capability with a precise schema and bounded output.
5. Keep stdio stdout protocol-only or secure the documented remote transport.
6. Add lifecycle, schema, error, cancellation, and client integration tests.
7. Add authentication and write capabilities only after the read-only slice passes.

## Rollback

Remove the new capability registration and dependency changes or restore the previous lockfile and server artifact. Delete generated test state only inside the isolated fixture root.

## Exit Gate

Pass when a supported client initializes, discovers, calls, cancels, and closes the server; invalid input fails safely; diagnostics are redacted; and no undocumented command or API is required.
