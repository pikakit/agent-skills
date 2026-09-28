# Mcp Management Agent Rules

> Generated from 3 source rules for mcp-management v3.9.224. Do not edit directly.

## Mandatory Rules

| Impact | Kind | Rule | Requirement |
|---|---|---|---|
| high | process | [MCP Client Invocation](references/AGENTS.full.md#rule-cli-usage) | This repository does not ship a standalone MCP management CLI. Use the configured client's documented discovery and invocation interface; do not invent `cli.ts`, `npx`, or model-specific fallback comm |
| high | process | [MCP Invocation Gate](references/AGENTS.full.md#rule-engineering-spec) | - Resolve a configured server without printing environment variables or credentials. |
| high | reference | [MCP Protocol Reference](references/AGENTS.full.md#rule-protocol) | Cover client-server lifecycle, version and capability negotiation, tools, resources, prompts, logging, cancellation, and the stdio or Streamable HTTP transports defined by the pinned specification rev |

## Use

Apply every relevant rule. Open the linked full rule before implementation, review, or release decisions.
