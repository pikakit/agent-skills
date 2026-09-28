---
name: mcp-builder
description: This skill should be used when the user asks to design, implement, review, or evaluate a Model Context Protocol server and its tools.
metadata:
  id: mcp-builder
  schema_version: "2.0.0"
  type: knowledge
  category: agentic
  risk_tier: high
  version: "3.9.224"
  author: pikakit
  triggers: ["build an MCP server", "design MCP tools", "review an MCP server", "evaluate MCP tool usability"]
  negative_triggers: ["call an existing MCP tool", "manage configured MCP servers", "design a non-MCP HTTP API"]
  coordinates_with: [mcp-management, api-architect, typescript-expert, python-pro]
  capabilities: ["MCP capability design", "tool contract review", "server implementation guidance", "evaluation design"]
  platforms: [linux, macos, windows]
  last_reviewed: "2026-09-28"
  review_interval_days: 180
---

# MCP Builder

Build MCP servers from the current protocol specification and official SDK documentation. Expose small, permission-aware capabilities with schemas that let clients make safe decisions.

## Workflow

1. Identify client workflows, trust boundaries, and required protocol capabilities.
2. Choose a supported transport and SDK version.
3. Define tools, resources, or prompts with precise schemas and bounded output.
4. Implement cancellation, timeout, error, authorization, and redaction behavior.
5. Test protocol behavior and representative client tasks.
6. Review observability, rollback, and compatibility before release.

## Detailed Guidance

Read only the rule needed for the task: `design-principles.md`, `quickstart.md`, `python-implementation.md`, `typescript-implementation.md`, `best-practices.md`, `evaluation.md`, or `engineering-spec.md`.

Route discovery and invocation of existing servers to `mcp-management`.
