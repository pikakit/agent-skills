---
name: mcp-builder
description: >-
  Guide for building MCP servers for AI agents following a 4-phase process.
  Triggers on: build MCP, create MCP server, MCP development, agent tools.
  Coordinates with: mcp-server, api-architect, typescript-expert.
metadata:
  version: "1.0.0"
  category: "framework"
  triggers: "build MCP, create MCP server, MCP development"
  coordinates_with: "mcp-server, api-architect, typescript-expert"
  success_metrics: "MCP server functional, 10 evaluation questions pass"
---

# MCP Builder

> 4-phase process for building MCP servers for AI agents.

---

## When to Use This Skill

- Need to BUILD a new MCP server (not just design)
- Need end-to-end guidance
- Need to create evaluations to test server

> **Note:** Use `mcp-server` for design principles, use this skill for the build process.

---

## 4-Phase Process

```
┌─────────────────────────────────────────────────────────┐
│  Phase 1: RESEARCH    │  Study API docs, MCP protocol  │
│  Phase 2: IMPLEMENT   │  Python/TypeScript, schemas    │
│  Phase 3: REVIEW      │  Quality checklist, testing    │
│  Phase 4: EVALUATE    │  10 complex test questions     │
└─────────────────────────────────────────────────────────┘
```

---

## Phase 1: Deep Research

### 1.1 Study MCP Protocol

```bash
# Read full MCP specification
# URL: https://modelcontextprotocol.io/llms-full.txt
```

### 1.2 Study Target API

Read API documentation thoroughly including:
- Authentication & Authorization
- Rate limiting & Pagination
- Available endpoints
- Error responses
- Data models

### 1.3 Create Implementation Plan

| Section | Content |
|---------|---------|
| Tool Selection | Prioritize endpoints by value |
| Shared Utilities | Request patterns, error handling |
| Input/Output Design | Validation, response formats |
| Error Strategy | Actionable error messages |

---

## Phase 2: Implementation

### 2.1 Choose Framework

| Language | Framework | When to Use |
|----------|-----------|-------------|
| Python | FastMCP | Fast, simple, async |
| TypeScript | MCP SDK | Type-safe, Node ecosystem |

### 2.2 Agent-Centric Design

```
❌ WRONG: Wrap each API endpoint individually
✅ RIGHT: Build tools for complete WORKFLOWS
```

| Principle | Description |
|-----------|-------------|
| Build for Workflows | `schedule_event` instead of `check` + `create` |
| Optimize for Context | Provide "concise" vs "detailed" |
| Actionable Errors | "Try filter='active_only'" instead of "Invalid" |
| Natural Subdivisions | Tool names reflect how humans think |

### 2.3 Tool Schema Pattern

```python
@mcp.tool(
    readOnlyHint=True,      # Read-only?
    destructiveHint=False,   # Deletes data?
    idempotentHint=True,     # Same result on retry?
    openWorldHint=True,      # External interaction?
)
async def search_items(
    query: str,
    format: str = "concise"  # or "detailed"
) -> str:
    """
    Search for items matching the query.
    
    Args:
        query: Keywords (supports AND/OR)
        format: 'concise' or 'detailed'
    
    Examples:
        - query="status:active type:project"
    
    Errors:
        - If limit exceeded: Suggest reducing limit
    """
```

---

## Phase 3: Review & Refine

### 3.1 Quality Checklist

- [ ] No duplicate code (DRY)
- [ ] Common logic extracted to functions
- [ ] Similar operations return same format
- [ ] All external calls have error handling
- [ ] Full type coverage
- [ ] All tools have detailed docstrings

### 3.2 Testing Notes

```bash
# ⚠️ MCP servers are long-running processes
# DO NOT run directly - will hang indefinitely

# ✅ Verify syntax
python -m py_compile server.py

# ✅ Use timeout
timeout 5s python server.py

# ✅ Use evaluation harness
```

---

## Phase 4: Create Evaluations

### 4.1 Create 10 Test Questions

Each question must be:
- **Independent** - No dependency on other questions
- **Read-only** - Only use non-destructive operations
- **Complex** - Requires multiple tool calls
- **Realistic** - Based on real use cases
- **Verifiable** - One clear answer
- **Stable** - Answer doesn't change over time

### 4.2 Evaluation Format

```xml
<evaluation>
  <qa_pair>
    <question>
      Find discussions about AI models with animal code names.
      Which model requires safety designation ASL-X?
      What is X for the spotted wild cat model?
    </question>
    <answer>3</answer>
  </qa_pair>
</evaluation>
```

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| `references/quickstart.md` | Python/TypeScript setup | Getting started |
| `references/python-implementation.md` | Python FastMCP details | Python development |
| `references/typescript-implementation.md` | TypeScript MCP SDK | TypeScript development |
| `references/best-practices.md` | Tool design, errors, pagination | Design decisions |
| `references/evaluation.md` | 10-question test framework | Testing server |

---

> **Rule:** Good MCP server = AI agents can perform real tasks. Design for workflows, not endpoints.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails on TypeScript | Check tsconfig.json, run `tsc --noEmit` |
| Tool not appearing | Verify exported and registered in server |
| Python import error | Run `pip install -e .` for local package |
| Client can't connect | Check stdio vs HTTP transport configuration |
| Test failures | Ensure mock client matches expected schema |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `mcp-server` | Skill | MCP principles |
| `api-architect` | Skill | API design |
| `typescript-expert` | Skill | TS patterns |

---

⚡ PikaKit v3.2.0
