---
name: mcp-server
description: >-
  MCP (Model Context Protocol) server building principles. Tool design, resource patterns, best practices.
  Triggers on: MCP, Model Context Protocol, server, integration.
  Coordinates with: api-architect, mcp-builder.
metadata:
  version: "1.0.0"
  category: "framework"
  triggers: "MCP, Model Context Protocol, server, integration, AI tools"
  success_metrics: "MCP server running, tools connected"
  coordinates_with: "api-architect, mcp-builder"
---

# MCP Server Principles

> Principles for building MCP servers.

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Building AI agent tools | Create MCP server |
| Need tool design patterns | Check tool patterns |
| Full build process | Use `mcp-builder` skill |

---

## 1. MCP Overview

Model Context Protocol - standard for connecting AI systems with external tools and data.

| Concept       | Purpose                      |
| ------------- | ---------------------------- |
| **Tools**     | Functions AI can call        |
| **Resources** | Data AI can read             |
| **Prompts**   | Pre-defined prompt templates |

---

## 2. Server Architecture

```
my-mcp-server/
├── src/index.ts    # Main entry
├── package.json
└── tsconfig.json
```

| Transport     | Use                      |
| ------------- | ------------------------ |
| **Stdio**     | Local, CLI-based         |
| **SSE**       | Web-based, streaming     |
| **WebSocket** | Real-time, bidirectional |

---

## 3. Tool Design

| Principle         | Description                                |
| ----------------- | ------------------------------------------ |
| Clear name        | Action-oriented (get_weather, create_user) |
| Single purpose    | One thing well                             |
| Validated input   | Schema with types and descriptions         |
| Structured output | Predictable response format                |

---

## 4. Resource Patterns

| Type     | Use                       | URI Example         |
| -------- | ------------------------- | ------------------- |
| Static   | Fixed data (config, docs) | `docs://readme`     |
| Dynamic  | Generated on request      | `users://{userId}`  |
| Template | URI with parameters       | `files://project/*` |

---

## 5. Error Handling

| Situation      | Response                   |
| -------------- | -------------------------- |
| Invalid params | Validation error message   |
| Not found      | Clear "not found"          |
| Server error   | Generic error, log details |

---

## 6. Security & Config

- Validate all tool inputs, sanitize user data
- Use environment variables for API keys
- Don't log secrets, validate permissions

---

## 7. Best Practices Checklist

- [ ] Clear, action-oriented tool names
- [ ] Complete input schemas with descriptions
- [ ] Structured JSON output
- [ ] Error handling for all cases
- [ ] Environment-based configuration

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Connection refused | Check server is running |
| Tool not found | Verify tool name matches |
| Schema validation error | Check input/output schema |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `mcp-builder` | Skill | Full build guide |
| `api-architect` | Skill | API design |
| `typescript-expert` | Skill | TS implementation |

---

⚡ PikaKit v3.2.0
