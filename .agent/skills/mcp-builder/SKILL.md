---
name: mcp-builder
description: >-
  Complete guide for building MCP servers for AI agents. Includes design principles,
  4-phase build process, and evaluation framework.
  Triggers on: build MCP, create MCP server, MCP development, MCP, Model Context Protocol, agent tools.
  Coordinates with: api-architect, typescript-expert, mcp-management.
metadata:
  version: "2.0.0"
  category: "framework"
  triggers: "build MCP, create MCP server, MCP development, MCP, Model Context Protocol, agent tools"
  coordinates_with: "api-architect, typescript-expert, mcp-management"
  success_metrics: "MCP server functional, 10 evaluation questions pass"
---

# MCP Builder

> 4-phase process for building MCP servers for AI agents.

---

## When to Use

- Need to BUILD a new MCP server (not just design)
- Need end-to-end guidance
- Need to create evaluations to test server

> Design principles + build process in one skill. See `references/design-principles.md` for core MCP concepts.

---

## 4-Phase Process

| Phase | Focus |
|-------|-------|
| 1. **RESEARCH** | Study API docs, MCP protocol |
| 2. **IMPLEMENT** | Python/TypeScript, schemas |
| 3. **REVIEW** | Quality checklist, testing |
| 4. **EVALUATE** | 10 complex test questions |

---

## Phase 1: Research

- Read MCP spec: `https://modelcontextprotocol.io/llms-full.txt`
- Study target API: auth, rate limits, endpoints, errors

---

## Phase 2: Implementation

| Framework | When to Use |
|-----------|-------------|
| Python FastMCP | Fast, simple, async |
| TypeScript MCP SDK | Type-safe, Node ecosystem |

**Key Principles:**
- Build for workflows, not endpoints
- Optimize for context (`concise` vs `detailed`)
- Actionable error messages

---

## Phase 3: Review

- [ ] No duplicate code (DRY)
- [ ] Error handling for all external calls
- [ ] Full type coverage
- [ ] All tools have detailed docstrings

```bash
# Test syntax (don't run directly - MCP servers are long-running)
python -m py_compile server.py
timeout 5s python server.py
```

---

## Phase 4: Evaluations

Create 10 test questions that are:
- Independent, read-only, complex
- Realistic, verifiable, stable

---

## 📑 Content Map

| File | When to Read |
|------|--------------|
| `references/design-principles.md` | MCP concepts, tool design, resource patterns |
| `references/quickstart.md` | Getting started |
| `references/python-implementation.md` | Python development |
| `references/typescript-implementation.md` | TypeScript development |
| `references/best-practices.md` | Design decisions |
| `references/evaluation.md` | Testing server |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails | Check tsconfig, run `tsc --noEmit` |
| Tool not appearing | Verify exported and registered |
| Python import error | Run `pip install -e .` |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `mcp-management` | Skill | Use/discover MCP tools |
| `api-architect` | Skill | API design |
| `typescript-expert` | Skill | TS patterns |

---

⚡ PikaKit v3.2.0
