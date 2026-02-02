---
name: execution-reporter
description: >-
  Display agent routing, skill loading, and execution context at task start.
  Provides transparency and audit trail for agent operations.
metadata:
  category: "core"
  version: "1.0.0"
  triggers:
    - every task start
    - agent routing
    - skill loading
    - task completion
  coordinates_with:
    - smart-router
    - lifecycle-orchestrator
    - auto-learner
---

# Execution Reporter

Display agent routing, skill loading, and execution context. Provides transparency for users to understand which agents and skills are handling their requests.

---

## When to Use

This skill is **automatically invoked** by the agent system at:

1. **Task Start** - Display which agent and skills are engaged
2. **Skill Invocation** - When a skill executes a script
3. **Task Completion** - Summary of resources used

---

## Output Formats

### 1. Task Start Notification (MANDATORY)

Display immediately when starting any non-trivial task:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🤖 AGENT ROUTING                                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  Task: {task_description}                                                   │
│                                                                             │
│  ◆ Primary: @{agent_name}                                                   │
│  ◇ Skills loaded:                                                           │
│    • {skill_1} ({skill_description})                                        │
│    • {skill_2} ({skill_description})                                        │
│                                                                             │
│  📋 Workflow: {workflow_name}                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2. Compact Format (For Simple Tasks)

For quick tasks, use one-liner:

```
🤖 **Engaging** `◆ @{agent_name}` → Skills: {skill_1}, {skill_2}
```

### 3. Skill Invocation Notification

When skill executes a script or significant action:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🎨 SKILL INVOKED: {skill_name}                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  Action: {what_skill_is_doing}                                              │
│  Script: {script_name}                                                      │
│  Command: {full_command}                                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4. Task Complete Notification

At end of task:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ✅ TASK COMPLETE                                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  Agent: @{agent_name}                                                       │
│  Skills used: {skill_list}                                                  │
│  Duration: {time}                                                           │
│  Deliverables: {count} files                                                │
│                                                                             │
│  📦 Files created/modified:                                                 │
│    • {file_1}                                                               │
│    • {file_2}                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Verbosity Levels

Controlled by `.agent/config/notification-config.json`:

| Level | Agent Routing | Skills | Scripts | Completion |
|-------|---------------|--------|---------|------------|
| `minimal` | ✅ | ❌ | ❌ | ✅ |
| `normal` | ✅ | ✅ | ❌ | ✅ |
| `verbose` | ✅ | ✅ | ✅ | ✅ |

**Default:** `normal`

---

## Config File Reference

Location: `.agent/config/notification-config.json`

```json
{
  "notifications": {
    "enabled": true,
    "verbosity": "normal"
  }
}
```

**Enable/Disable:**
- `enabled: true` → Show notifications
- `enabled: false` → Silent mode (no notifications)

---

## Integration with Other Skills

| Skill | Integration |
|-------|-------------|
| `smart-router` | Receives agent selection to display |
| `lifecycle-orchestrator` | Hooks into task lifecycle |
| `auto-learner` | Logs notification triggers for learning |

---

## Examples

### Example 1: Design Task

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🤖 AGENT ROUTING                                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  Task: Design fintech dashboard                                             │
│                                                                             │
│  ◆ Primary: @frontend-specialist                                            │
│  ◇ Skills loaded:                                                           │
│    • studio (design system generation)                                      │
│    • code-craft (clean code standards)                                      │
│                                                                             │
│  📋 Workflow: /studio                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Example 2: Build Task

```
🤖 **Engaging** `◆ @frontend-specialist` → Skills: react-architect, nextjs-pro
📋 Workflow: /build
```

### Example 3: Multi-Agent Task

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🤖 AGENT ROUTING                                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  Task: Build full-stack app with authentication                             │
│                                                                             │
│  ◆ Lead: @orchestrator                                                      │
│  ◇ Specialists:                                                             │
│    • @frontend-specialist (UI/UX)                                           │
│    • @backend-specialist (API)                                              │
│    • @security-auditor (Auth)                                               │
│                                                                             │
│  📋 Workflow: /autopilot                                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Rules

1. **ALWAYS display** Task Start notification for complex tasks (>3 tool calls expected)
2. **Use compact format** for simple tasks (1-2 tool calls)
3. **Log to audit file** if logging enabled in config
4. **Respect verbosity** settings from config file
5. **Never spam** - one notification per phase, not per tool call
