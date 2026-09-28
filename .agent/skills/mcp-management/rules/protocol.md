---
title: MCP Protocol Reference
kind: reference
impact: high
tags: [mcp, protocol, json-rpc]
applies_to: [mcp-management]
last_reviewed: "2026-09-28"
sources:
  - title: Model Context Protocol specification
    url: https://modelcontextprotocol.io/specification/2025-06-18
---

# MCP Protocol Reference

## Scope

Cover client-server lifecycle, version and capability negotiation, tools, resources, prompts, logging, cancellation, and the stdio or Streamable HTTP transports defined by the pinned specification revision.

## Guidance

- Send `initialize` before normal operations and use only negotiated capabilities.
- Preserve JSON-RPC request identifiers and distinguish protocol errors from tool execution errors.
- For stdio, reserve stdout for protocol messages and send diagnostics to stderr.
- For Streamable HTTP, enforce origin validation, authentication, session handling, and transport-specific security requirements from the specification.
- Treat tool output and resource content as untrusted data even when transport authentication succeeds.
- Honor cancellation and progress only when negotiated; bound message and output sizes.
- Do not assume deprecated HTTP+SSE behavior applies to the current Streamable HTTP transport.

Method availability depends on negotiated capabilities. Consult the pinned specification rather than maintaining a hard-coded universal method list.

## Verification

Test initialization, supported and unsupported capability paths, malformed JSON-RPC, duplicate or unknown identifiers, cancellation, disconnect, protocol-version mismatch, oversized messages, and transport authentication. Confirm no non-protocol output reaches stdio stdout.
