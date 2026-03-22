---
name: execution-reporter
description: >-
  Display agent routing, skill loading, and execution context at task start. Provides
  transparency and audit trail for agent operations. Triggers on: every task start, agent
  routing, skill loading, task completion.
metadata:
  author: pikakit
  version: "3.9.107"
---

# Execution Reporter â€” Task Notifications

> Fixed templates. One notification per phase. PikaKit branding mandatory.

---

## Prerequisites

**Required:** None â€” Execution Reporter is a pure formatting function with no external dependencies.

---

## When to Use

| Event | Template | Condition |
|-------|----------|-----------|
| Task start (complex) | Full template | > 3 skills loaded |
| Task start (simple) | Compact template | â‰¤ 3 skills loaded |
| Script execution | Script template | Script invoked |
| Task complete | Complete template | Task finished |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Notification string formatting (4 templates) | Task execution (â†’ lifecycle-orchestrator) |
| Verbosity level filtering (3 levels) | Agent routing (â†’ smart-router) |
| PikaKit branding (v3.9.68) | Error detection (â†’ problem-checker) |
| Complexity threshold (> 3 skills â†’ full) | Notification delivery |

**Pure function skill:** Returns formatted strings. Zero side effects.

---

## Output Templates

### Full Template (> 3 skills)

```
ðŸ¤– PikaKit v3.9.107
ðŸ“‹ Task: {task_description}
â—† Agent: @{agent_name}
â—‡ Skills: {skill_1}, {skill_2}, ...
ðŸ“‚ Workflow: /{workflow_name}
```

### Compact Template (â‰¤ 3 skills)

```
ðŸ¤– PikaKit â€¢ @{agent} â†’ {skill_1}, {skill_2}
```

### Task Complete Template

```
âœ… Done â€¢ Agent: @{agent_name} â€¢ Skills: {count} â€¢ Files: {count} â€¢ {duration}s
âš¡ PikaKit v3.9.107
```

### Script Run Template

```
âš¡ {skill_name} â€¢ running {script_name}
```

---

## Verbosity Levels

| Level | Routing | Skills | Scripts | Complete |
|-------|---------|--------|---------|----------|
| `minimal` | âœ… | âŒ | âŒ | âœ… |
| `normal` | âœ… | âœ… | âŒ | âœ… |
| `verbose` | âœ… | âœ… | âœ… | âœ… |

**Default:** `normal`. Config: `.agent/config/notification-config.json`

---

## Rules

| # | Rule | Enforcement |
|---|------|------------|
| 1 | One notification per phase | No duplicate notifications for same event |
| 2 | > 3 skills â†’ full template | Complexity threshold is fixed |
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

| âŒ Don't | âœ… Do |
|---------|-------|
| Notify on every tool call | One notification per phase |
| Custom branding per agent | PikaKit branding only |
| Variable template format | Use fixed 4+template set |
| Verbose by default | Default to "normal" |
| Include sensitive data | Display task descriptions only |

---

## ðŸ“‘ Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec | Architecture review |

---

## ðŸ”— Related

| Item | Type | Purpose |
|------|------|---------|
| `lifecycle-orchestrator` | Skill | Task lifecycle management |
| `problem-checker` | Skill | Error detection |
| `smart-router` | Skill | Agent routing decisions |
| `/pulse` | Workflow | Status dashboard |

---

âš¡ PikaKit v3.9.107
