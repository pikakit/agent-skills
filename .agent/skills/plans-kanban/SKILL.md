---
name: plans-kanban
description: >-
  Visual dashboard server for plan directories with progress tracking,
  timeline visualization, and phase status indicators.
  Triggers on: kanban, dashboard, plan progress, timeline.
  Coordinates with: project-planner, lifecycle-orchestrator.
metadata:
  version: "2.0.0"
  category: "tools"
  triggers: "kanban, dashboard, plan progress, timeline, gantt"
  success_metrics: "server starts, dashboard renders, API responds"
  coordinates_with: "project-planner, lifecycle-orchestrator"
---

# Plans Kanban — Visual Dashboard Server

> Background HTTP server. Port 3500-3550. JSON API. Glassmorphism UI. Read-only.

---

## Prerequisites

```bash
cd .agent/skills/plans-kanban && npm install gray-matter
```

---

## When to Use

| Situation | Action |
|-----------|--------|
| View plan progress | Start server with `--dir plans/` |
| Track parallel features | Multi-plan dashboard |
| Team standup | Share via `--host 0.0.0.0` |
| CI/CD integration | Use `/api/plans` endpoint |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| HTTP server lifecycle (start/stop) | Plan creation (→ project-planner) |
| Plan directory parsing (read-only) | Multi-phase execution (→ lifecycle-orchestrator) |
| Dashboard rendering + JSON API | Infrastructure hosting |

**Automation (scripted):** Spawns process, binds port, writes PID file. Read-only plan access.

---

## Quick Start

```bash
# Start dashboard
node .agent/skills/plans-kanban/scripts/server.cjs --dir ./plans --open

# Remote access (team sharing)
node .agent/skills/plans-kanban/scripts/server.cjs --dir ./plans --host 0.0.0.0 --open

# Background mode
node .agent/skills/plans-kanban/scripts/server.cjs --dir ./plans --background

# Stop all servers
node .agent/skills/plans-kanban/scripts/server.cjs --stop
```

---

## CLI Options (Fixed)

| Option | Description | Default |
|--------|-------------|---------|
| `--dir <path>` | Plans directory | Required |
| `--port <number>` | Server port | 3500 |
| `--host <addr>` | Bind address | localhost |
| `--open` | Auto-open browser | false |
| `--background` | Run in background | false |
| `--stop` | Stop all servers | — |

---

## HTTP Routes (Fixed)

| Route | Description |
|-------|-------------|
| `/` or `/kanban` | Dashboard view |
| `/kanban?dir=<path>` | Dashboard for directory |
| `/api/plans` | JSON API |
| `/assets/*` | Static assets |

---

## State Transitions

```
IDLE → STARTING              [start action]
STARTING → RUNNING           [port bound]
STARTING → PORT_SEARCH       [port unavailable]
PORT_SEARCH → RUNNING        [port found in 3500-3550]
PORT_SEARCH → FAILED         [all ports occupied]  // terminal
RUNNING → STOPPED            [stop action]  // terminal
RUNNING → CRASHED            [unhandled error]  // terminal
```

---

## Plan Structure (Required)

```
plans/
├── feature-auth/
│   ├── plan.md              # Required (frontmatter below)
│   ├── phase-01-design.md
│   └── phase-02-impl.md
```

**plan.md frontmatter (6 fields):**
```yaml
---
title: Feature A Implementation
status: in-progress           # not-started | in-progress | completed
priority: high                # high | medium | low
issue: https://github.com/org/repo/issues/123
branch: feature/feature-a
created: 2025-12-15
---
```

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_DEPENDENCY_MISSING` | Yes | gray-matter not installed |
| `ERR_NO_AVAILABLE_PORT` | Yes | All ports 3500-3550 occupied |
| `ERR_DIR_NOT_FOUND` | Yes | Plans directory not found |
| `ERR_PLAN_PARSE` | Yes | plan.md frontmatter malformed |
| `ERR_SERVER_CRASH` | No | Unhandled server error |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Port in use | Auto-increments 3500-3550 |
| No plans found | Check plan.md exists in subdirectory |
| Can't access remotely | Use `--host 0.0.0.0` |
| Server won't stop | Check `/tmp/plans-kanban-*.pid` |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [scripts/server.cjs](scripts/server.cjs) | Main server entry | Implementation |
| [engineering-spec.md](references/engineering-spec.md) | Full spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `project-planner` | Skill | Create plan structure |
| `lifecycle-orchestrator` | Skill | Multi-phase execution |
| `/pulse` | Workflow | Project health |

---

⚡ PikaKit v3.9.72
