---
name: execution-reporter
description: >-
  Display agent routing, skill loading, and execution context at task start.
  Provides transparency and audit trail for agent operations.
  Triggers on: every task start, agent routing, skill loading, task completion.
  Coordinates with: smart-router, lifecycle-orchestrator, auto-learner.
metadata:
  category: "core"
  version: "2.0.0"
  triggers: "task start, agent routing, skill loading, task completion"
  coordinates_with: "smart-router, lifecycle-orchestrator, auto-learner"
  success_metrics: "100% task visibility, clear audit trail"
---

# Execution Reporter

> **Purpose:** Transparent agent operations with PikaKit branding

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Task start | Show execution context |
| Multi-agent work | Track skill loading |
| Task completion | Include footer |
| Complex tasks | Full template |

---

## Quick Reference

| Event | Template |
|-------|----------|
| Task Start | `🤖 PikaKit • @agent → skill1, skill2` |
| Script Run | `⚡ skill-name • running script.py` |
| Task Complete | `✅ Done • 3 files • 2.5s` |

---

## Output Templates

### 1. Task Start (MANDATORY)

```
┌─────────────────────────────────────────────────────────────────┐
│  🤖 PikaKit v3.9.68                                              │
├─────────────────────────────────────────────────────────────────┤
│  📋 Task: {task_description}                                    │
│                                                                 │
│  ◆ Agent: @{agent_name}                                         │
│  ◇ Skills: {skill_1}, {skill_2}                                 │
│  📂 Workflow: /{workflow_name}                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Compact (Simple Tasks)

```
🤖 PikaKit • @{agent} → {skill_1}, {skill_2}
```

### 3. Task Complete

```
┌─────────────────────────────────────────────────────────────────┐
│  ✅ Task Complete                                               │
├─────────────────────────────────────────────────────────────────┤
│  Agent: @{agent_name}                                           │
│  Skills: {skill_list}                                           │
│  Duration: {time}s                                              │
│  Files: {count} created/modified                                │
├─────────────────────────────────────────────────────────────────┤
│  ⚡ PikaKit v3.9.68                                              │
│  Precision-Orchestrated Agents and Workflows.                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Verbosity Levels

| Level | Routing | Skills | Scripts | Complete |
|-------|---------|--------|---------|----------|
| `minimal` | ✅ | ❌ | ❌ | ✅ |
| `normal` | ✅ | ✅ | ❌ | ✅ |
| `verbose` | ✅ | ✅ | ✅ | ✅ |

**Default:** `normal`

---

## Config

Location: `.agent/config/notification-config.json`

```json
{
  "notifications": {
    "enabled": true,
    "verbosity": "normal"
  }
}
```

---

## Examples

### Design Task
```
🤖 PikaKit v3.9.68
📋 Task: Design fintech dashboard
◆ Agent: @frontend-specialist
◇ Skills: studio, code-craft
📂 Workflow: /studio
```

### Multi-Agent Task
```
🤖 PikaKit v3.9.68
📋 Task: Build full-stack app
◆ Lead: @orchestrator
◇ Specialists: @frontend, @backend, @security
📂 Workflow: /autopilot
```

---

## Rules

1. **Complex tasks** (>3 tools) → Full template
2. **Simple tasks** (1-2 tools) → Compact format
3. **One notification per phase** - never spam
4. **Always include PikaKit branding** in headers/footers

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `lifecycle-orchestrator` | Skill | Task lifecycle |
| `problem-checker` | Skill | Error check |
| `/pulse` | Workflow | Status dashboard |

---

⚡ PikaKit v3.9.68
Precision-Orchestrated Agents and Workflows.
