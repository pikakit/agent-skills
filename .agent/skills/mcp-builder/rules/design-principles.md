---
title: MCP Server Boundary Selection
kind: decision
impact: high
tags: [mcp, protocol-design]
applies_to: [mcp-builder]
last_reviewed: "2026-09-28"
sources:
  - title: Model Context Protocol specification
    url: https://modelcontextprotocol.io/specification/2025-06-18
---

# MCP Server Boundary Selection

## Decision

Place a server boundary around one security and operational domain. Select stdio for local process-managed integrations and Streamable HTTP for supported remote deployments requiring independent lifecycle and authentication.

## Use When

- Group capabilities that share ownership, credentials, data classification, and release lifecycle.
- Split servers when privilege, tenant, failure, or deployment boundaries differ.
- Negotiate only capabilities implemented and tested by the server.

## Avoid When

- Avoid a universal server with unrelated credentials and blast radius.
- Avoid exposing internal infrastructure details in names or errors.
- Avoid deprecated transport examples or SDK APIs copied without a pinned version.
- Avoid network exposure without authentication, origin validation, rate limits, and transport security.

## Trade-offs

Fewer servers simplify configuration but increase privilege and failure coupling. More servers improve isolation but add discovery, deployment, and observability overhead.

## Verification

Review the boundary against threat model, ownership, credential scope, failure isolation, transport requirements, and compatibility tests for the pinned specification revision.
