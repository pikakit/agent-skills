---
name: mcp-management
description: >-
  Discover, analyze, and execute tools from configured MCP servers.
  Progressive disclosure: load only the tools you need, when you need them.
  Triggers on: MCP tools, server discovery, tool execution, multi-server.
  Coordinates with: mcp-builder, mcp-server.
metadata:
  version: "1.0.0"
  category: "framework"
  triggers: "MCP tools, server discovery, tool execution, multi-server, orchestration"
  success_metrics: "tools discovered, execution successful, structured response"
  coordinates_with: "mcp-builder, mcp-server"
---

# MCP Management

> Discover, orchestrate, and execute MCP tools without polluting context.

---

## Prerequisites

**Required:**
- MCP servers configured in `.mcp.json`
- Node.js 18+

**Optional:**
- Gemini CLI (for primary execution method)

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Discover available tools | Run `list-tools` |
| Execute specific tool | Use Gemini CLI or direct CLI |
| Multi-server orchestration | Route by server name |
| Keep context clean | Use progressive disclosure |

---

## Configuration

```json
// .mcp.json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path"]
    }
  }
}
```

---

## Three Execution Methods

### 1. Gemini CLI (Primary)

```bash
# ✅ CORRECT - use stdin piping
echo "Take screenshot of example.com. Return JSON only." | gemini -y

# ❌ WRONG - -p flag skips MCP init
gemini -p "Take screenshot..."  # DON'T USE
```

### 2. Direct CLI (Secondary)

```bash
cd scripts/

# List tools (saves to assets/tools.json)
npx tsx cli.ts list-tools

# Execute tool
npx tsx cli.ts call-tool memory create_entities '{"entities":[...]}'
```

### 3. Subagent (Fallback)

Delegate to mcp-manager for context efficiency.

---

## Quick Reference

### Discovery Commands

```bash
npx tsx cli.ts list-tools      # All tools → assets/tools.json
npx tsx cli.ts list-prompts    # Available prompts
npx tsx cli.ts list-resources  # Available resources
```

### Tool Execution

```bash
# Format: call-tool <server> <tool> '<json-args>'
npx tsx cli.ts call-tool filesystem read_file '{"path":"/file.txt"}'
npx tsx cli.ts call-tool memory create_entities '{"entities":[...]}'
```

---

## Response Format

Enforce structured JSON responses:

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

## 📑 Content Map

| File | Description |
|------|-------------|
| `references/protocol.md` | JSON-RPC protocol details |
| `references/cli-usage.md` | CLI commands and examples |
| `scripts/cli.ts` | CLI implementation |
| `scripts/mcp-client.ts` | MCP client manager |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Gemini CLI not found | Install globally or use direct CLI |
| Server connection fails | Check .mcp.json config |
| Tool not found | Run list-tools to refresh catalog |
| Unstructured response | Add "Return JSON only" to prompt |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `mcp-builder` | Skill | Build MCP servers |
| `mcp-server` | Skill | MCP design principles |

---

⚡ PikaKit v3.2.0
