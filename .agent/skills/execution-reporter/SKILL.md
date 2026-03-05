---
name: execution-reporter
description: >-
  Display agent routing, skill loading, and execution context at task start.
  Provides transparency and audit trail for agent operations.
  Triggers on: every task start, agent routing, skill loading, task completion.
  Coordinates with: smart-router, lifecycle-orchestrator, auto-learner.
metadata:
  version: "2.0.0"
  category: "core"
  triggers: "task start, agent routing, skill loading, task completion"
  success_metrics: "100% task visibility, one notification per phase, consistent branding"
  coordinates_with: "smart-router, lifecycle-orchestrator, auto-learner"
---

# Execution Reporter — Task Notifications

> Fixed templates. One notification per phase. PikaKit branding mandatory.

---

## Prerequisites

**Required:** None — Execution Reporter is a pure formatting function with no external dependencies.

---

## When to Use

| Event | Template | Condition |
|-------|----------|-----------|
| Task start (complex) | Full template | > 3 skills loaded |
| Task start (simple) | Compact template | ≤ 3 skills loaded |
| Script execution | Script template | Script invoked |
| Task complete | Complete template | Task finished |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Notification string formatting (4 templates) | Task execution (→ lifecycle-orchestrator) |
| Verbosity level filtering (3 levels) | Agent routing (→ smart-router) |
| PikaKit branding (v3.9.68) | Error detection (→ problem-checker) |
| Complexity threshold (> 3 skills → full) | Notification delivery |

**Pure function skill:** Returns formatted strings. Zero side effects.

---

## Output Templates

### Full Template (> 3 skills)

```
🤖 PikaKit v3.9.79
📋 Task: {task_description}
◆ Agent: @{agent_name}
◇ Skills: {skill_1}, {skill_2}, ...
📂 Workflow: /{workflow_name}
```

### Compact Template (≤ 3 skills)

```
🤖 PikaKit • @{agent} → {skill_1}, {skill_2}
```

### Task Complete Template

```
✅ Done • Agent: @{agent_name} • Skills: {count} • Files: {count} • {duration}s
⚡ PikaKit v3.9.79
```

### Script Run Template

```
⚡ {skill_name} • running {script_name}
```

---

## Verbosity Levels

| Level | Routing | Skills | Scripts | Complete |
|-------|---------|--------|---------|----------|
| `minimal` | ✅ | ❌ | ❌ | ✅ |
| `normal` | ✅ | ✅ | ❌ | ✅ |
| `verbose` | ✅ | ✅ | ✅ | ✅ |

**Default:** `normal`. Config: `.agent/config/notification-config.json`

---

## Rules

| # | Rule | Enforcement |
|---|------|------------|
| 1 | One notification per phase | No duplicate notifications for same event |
| 2 | > 3 skills → full template | Complexity threshold is fixed |
| 3 | PikaKit branding mandatory | Header and/or footer on every notification |
| 4 | Templates fit 65-char width | No terminal wrapping |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_MISSING_AGENT` | Yes | Agent name not provided |
| `ERR_MISSING_DESCRIPTION` | Yes | Task description not provided |
| `ERR_INVALID_VERBOSITY` | Yes | Verbosity level not recognized |

**Zero internal retries.** Deterministic; same context = same notification.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Notify on every tool call | One notification per phase |
| Custom branding per agent | PikaKit branding only |
| Variable template format | Use fixed 4+template set |
| Verbose by default | Default to "normal" |
| Include sensitive data | Display task descriptions only |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [engineering-spec.md](references/engineering-spec.md) | Full engineering spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `lifecycle-orchestrator` | Skill | Task lifecycle management |
| `problem-checker` | Skill | Error detection |
| `smart-router` | Skill | Agent routing decisions |
| `/pulse` | Workflow | Status dashboard |

---

⚡ PikaKit v3.9.79
