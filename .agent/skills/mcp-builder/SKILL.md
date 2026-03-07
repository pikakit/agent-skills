---
name: mcp-builder
summary: >-
  Complete guide for building MCP servers for AI agents. Includes design principles,
  4-phase build process, and evaluation framework.
  Triggers on: build MCP, create MCP server, MCP development, MCP, Model Context Protocol, agent tools.
  Coordinates with: api-architect, typescript-expert, mcp-management.
metadata:
  version: "2.0.0"
  category: "framework"
  triggers: "build MCP, create MCP server, MCP development, MCP, Model Context Protocol, agent tools"
  success_metrics: "4 phases complete, review passes, 10 evaluations pass"
  coordinates_with: "api-architect, typescript-expert, mcp-management"
---

# MCP Builder — Build MCP Servers for AI Agents

> 4 phases. Workflow over endpoints. 10-question evaluation. Context-aware output.

---

## Prerequisites

**Required:** Python 3.10+ or Node.js 18+. MCP spec: `https://modelcontextprotocol.io/llms-full.txt`

---

## When to Use

| Situation | Action |
|-----------|--------|
| Build a new MCP server | Follow 4-phase process |
| Choose framework | Python FastMCP vs TypeScript MCP SDK |
| Review MCP server quality | Use review checklist (4 items) |
| Test MCP server | Create 10 evaluation questions |
| Learn MCP design | Read `references/design-principles.md` |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| 4-phase build process | MCP tool discovery (→ mcp-management) |
| Framework selection (2 options) | API design (→ api-architect) |
| Review checklist (4 items) | TypeScript patterns (→ typescript-expert) |
| Evaluation framework (10 questions) | Server hosting/deployment |

**Expert decision skill:** Produces build guidance. Does not create files or run code.

---

## 4-Phase Build Process (Fixed Order)

| Phase | Focus | Deliverable |
|-------|-------|-------------|
| 1. **Research** | Study MCP spec + target API | API surface documented |
| 2. **Implement** | Build with selected framework | Server code complete |
| 3. **Review** | Quality checklist pass | All 4 items pass |
| 4. **Evaluate** | 10 complex test questions | All 10 pass |

---

## Framework Selection (Deterministic)

| Condition | Framework |
|-----------|-----------|
| Team is python-heavy OR needs_async | **Python FastMCP** |
| Team is typescript-heavy OR needs strict typing | **TypeScript MCP SDK** |
| Balanced / no preference | **Python FastMCP** (default) |

---

## Review Checklist (4 Mandatory Items)

- [ ] No duplicate code (DRY)
- [ ] Error handling for all external calls
- [ ] Full type coverage
- [ ] All tools have detailed docstrings

```bash
# Python verification
python -m py_compile server.py

# TypeScript verification
tsc --noEmit
```

---

## Evaluation Framework

Create 10 test questions that are:

| Criterion | Requirement |
|-----------|-------------|
| Independent | No dependencies between questions |
| Read-only | Never modify data |
| Complex | Require multi-tool workflows |
| Realistic | Match real user scenarios |
| Verifiable | Deterministic expected output |
| Stable | Consistent results across runs |

---

## Design Principles

| Principle | Application |
|-----------|-------------|
| Workflow over endpoints | Design tools for agent tasks, not API mirrors |
| Context-aware output | Support `concise` vs `detailed` modes |
| Actionable errors | Error messages include recovery steps |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_INVALID_PHASE` | Yes | Phase number not 1-4 |
| `ERR_MISSING_EXPERIENCE` | Yes | Team experience not provided |
| `ERR_REFERENCE_NOT_FOUND` | No | Reference file missing |

**Zero internal retries.** Deterministic; same context = same guidance.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Mirror API endpoints as tools | Design workflow-oriented tools |
| Skip evaluation phase | Create 10 test questions |
| Omit docstrings on tools | Detailed docstrings for agent discovery |
| Embed API keys in tool code | Use environment variables |
| Skip research phase | Read MCP spec + target API first |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [design-principles.md](references/design-principles.md) | Core MCP concepts | Phase 1 (Research) |
| [quickstart.md](references/quickstart.md) | Getting started | Phase 2 (Implement) |
| [python-implementation.md](references/python-implementation.md) | Python patterns | Python selected |
| [typescript-implementation.md](references/typescript-implementation.md) | TypeScript patterns | TypeScript selected |
| [best-practices.md](references/best-practices.md) | Design decisions | Phase 3 (Review) |
| [evaluation.md](references/evaluation.md) | Testing framework | Phase 4 (Evaluate) |
| [engineering-spec.md](references/engineering-spec.md) | Full engineering spec | Architecture review |

**Selective reading:** Read ONLY files relevant to the current phase.

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `mcp-management` | Skill | MCP tool discovery |
| `api-architect` | Skill | API design |
| `typescript-expert` | Skill | TS patterns |

---

⚡ PikaKit v3.9.98
