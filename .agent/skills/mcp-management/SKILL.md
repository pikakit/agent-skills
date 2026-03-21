---
name: mcp-management
description: >-
  Discover, analyze, and execute tools from configured MCP servers.
  Progressive disclosure: load only the tools you need, when you need them.
  Triggers on: MCP tools, server discovery, tool execution, multi-server.
  Coordinates with: mcp-builder, mcp-server.
metadata:
  version: "2.0.0"
  category: "framework"
  triggers: "MCP tools, server discovery, tool execution, multi-server, orchestration"
  success_metrics: "tools discovered, structured JSON response, method fallback works"
  coordinates_with: "mcp-builder, mcp-server"
---

# MCP Management â€” Tool Discovery, Routing & Execution

> Progressive disclosure. 3 execution methods. Structured JSON. Never `-p` flag.

---

## Prerequisites

**Required:** MCP servers in `.mcp.json`, Node.js 18+.
**Optional:** Gemini CLI (primary execution method).

---

## When to Use

| Situation | Action |
|-----------|--------|
| Discover available tools | `npx tsx cli.ts list-tools` |
| Execute specific tool | Use 3-method priority |
| Multi-server orchestration | Route by server name |
| Keep context clean | Progressive disclosure |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Tool discovery (list-tools/prompts/resources) | MCP server development (â†’ mcp-builder) |
| 3 execution methods + fallback | Server hosting |
| Multi-server routing from .mcp.json | Tool implementation |
| Structured JSON response format | Server-side authorization |

**Automation skill:** Spawns processes, makes JSON-RPC calls, writes catalog. Non-idempotent.

---

## Execution Methods (Priority Order)

| Priority | Method | Command |
|----------|--------|---------|
| 1 (Primary) | Gemini CLI | `echo "instruction" \| gemini -y` |
| 2 (Secondary) | Direct CLI | `npx tsx cli.ts call-tool <server> <tool> '<json>'` |
| 3 (Fallback) | Subagent | Delegate to mcp-manager |

**âš ï¸ Gemini CLI:** Always stdin pipe. Never `-p` flag (skips MCP init).

---

## State Transitions

```
IDLE â†’ DISCOVERING           [discover invoked]
DISCOVERING â†’ CATALOG_SAVED  [tools.json written]  // terminal
IDLE â†’ EXECUTING             [execute invoked]
EXECUTING â†’ RESULT_RECEIVED  [server responded]  // terminal
EXECUTING â†’ METHOD_FALLBACK  [method unavailable]
METHOD_FALLBACK â†’ RESULT_RECEIVED  [fallback succeeded]  // terminal
METHOD_FALLBACK â†’ ALL_METHODS_FAILED  [all 3 failed]  // terminal
EXECUTING â†’ SERVER_FAILED   [server error/timeout]  // terminal
```

---

## Configuration

```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

---

## Discovery Commands

```bash
npx tsx cli.ts list-tools      # All tools â†’ assets/tools.json
npx tsx cli.ts list-prompts    # Available prompts
npx tsx cli.ts list-resources  # Available resources
```

---

## Response Format (Enforced)

```json
{
  "server": "server-name",
  "tool": "tool-name",
  "success": true,
  "result": "<data>",
  "error": null
}
```

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_CONFIG_MISSING` | Yes | .mcp.json not found |
| `ERR_SERVER_NOT_FOUND` | Yes | Server name not in config |
| `ERR_TOOL_NOT_FOUND` | Yes | Tool not on server |
| `ERR_ALL_METHODS_FAILED` | No | All 3 methods failed |
| `ERR_SERVER_TIMEOUT` | Yes | Server did not respond |
| `ERR_RESPONSE_PARSE` | Yes | Cannot parse response |
| `ERR_GEMINI_CLI_MISSING` | Yes | Auto-fallback to Direct CLI |

**Method fallback:** max 3 attempts (one per method, ordered priority).

---

## Anti-Patterns

| âŒ Don't | âœ… Do |
|---------|-------|
| Use `gemini -p "..."` | Use `echo "..." \| gemini -y` |
| Load all tools upfront | Progressive disclosure |
| Assume tool catalog is fresh | Re-run list-tools to refresh |
| Ignore structured format | Enforce JSON response |
| Assume server is running | Check before execute |

---

## ðŸ“‘ Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [protocol.md](rules/protocol.md) | JSON-RPC protocol details | Protocol questions |
| [cli-usage.md](rules/cli-usage.md) | CLI commands and examples | CLI usage |
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec | Architecture review |

---

## ðŸ”— Related

| Item | Type | Purpose |
|------|------|---------|
| `mcp-builder` | Skill | Build MCP servers |

---

âš¡ PikaKit v3.9.105
