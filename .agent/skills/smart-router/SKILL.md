---
name: smart-router
description: >-
  Intelligent agent routing based on request analysis. Maps user intent to specialist agents
  using domain detection and keyword matching. Triggers on: agent routing, request
  classification, multi-agent selection.
metadata:
  author: pikakit
  version: "3.9.108"
---

# Smart Router

Intelligent agent routing protocol embedded in `GEMINI.md → TIER 0: INTELLIGENT AGENT ROUTING`.

## Scope

| In Scope | Out of Scope |
|----------|-------------|
| Request classification (6 types) | Agent implementation |
| Domain detection from keywords | Skill execution |
| Agent selection (26 agents) | Runtime orchestration (→ lifecycle-orchestrator) |
| Routing notification format | Checkpoint/recovery |

## Protocol

```
1. ANALYZE (Silent) → Detect domains from request keywords
2. SELECT → Choose specialist agent(s) from routing table
3. INFORM → Display: 🤖 **Engaging** ◆ @{agent}
4. APPLY → Load agent persona, rules, and skills
```

## Routing Table

| Request Type | Trigger Keywords | Agent |
|-------------|-----------------|-------|
| QUESTION | "what is", "explain" | - (direct response) |
| SURVEY | "analyze", "overview" | `explorer` |
| SIMPLE CODE | "fix", "add" (single file) | Domain agent |
| COMPLEX CODE | "build", "create" | `planner` → domain agents |
| DESIGN/UI | "design", "UI" | `frontend` / `mobile` |
| SLASH CMD | /build, /autopilot | Command-specific |

## Rules

- Silent analysis (no "I am analyzing...")
- Professional tone
- Respect `@agent` overrides from user
- Multi-domain → engage primary + secondary agents

## Integration

| Dependency | Type | Purpose |
|-----------|------|---------|
| `GEMINI.md` | Config | Master routing rules |
| `lifecycle-orchestrator` | Skill | Multi-agent coordination |
| `execution-reporter` | Skill | Routing transparency |

> **Note:** This skill codifies the routing logic defined in GEMINI.md § INTELLIGENT AGENT ROUTING.
> It does NOT contain executable scripts — routing is performed inline by the AI agent.
