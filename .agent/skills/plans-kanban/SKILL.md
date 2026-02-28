---
name: plans-kanban
description: >-
  Visual dashboard server for plan directories with progress tracking,
  timeline visualization, and phase status indicators.
  Triggers on: kanban, dashboard, plan progress, timeline.
  Coordinates with: project-planner, lifecycle-orchestrator.
allowed-tools: Read, Write, Edit, Terminal
metadata:
  version: "1.0.0"
  category: "tools"
  triggers: "kanban, dashboard, plan progress, timeline, gantt"
  success_metrics: "server starts, dashboard renders, plans displayed"
  coordinates_with: "project-planner, lifecycle-orchestrator"
---

# Plans Kanban Dashboard

> Visual dashboard for plan directories with progress tracking and timeline.

---

## Prerequisites

**Installation:**
```bash
cd .agent/skills/plans-kanban
npm install gray-matter
```

**Or install globally:**
```bash
npm install -g gray-matter
```

---

## When to Use

| Situation | Action |
|-----------|--------|
| View plan progress | `/kanban plans/` |
| Track parallel features | Multi-plan dashboard view |
| Team standup | Share networkUrl |
| CI/CD integration | Use `/api/plans` endpoint |

---

## Quick Start

```bash
# View plans dashboard
node .agent/skills/plans-kanban/scripts/server.cjs \
  --dir ./plans \
  --open

# Remote access
node .agent/skills/plans-kanban/scripts/server.cjs \
  --dir ./plans \
  --host 0.0.0.0 \
  --open

# Background mode
node .agent/skills/plans-kanban/scripts/server.cjs \
  --dir ./plans \
  --background

# Stop servers
node .agent/skills/plans-kanban/scripts/server.cjs --stop
```

---

## CLI Options

| Option | Description | Default |
|--------|-------------|---------|
| `--dir <path>` | Plans directory | Required |
| `--port <number>` | Server port | 3500 |
| `--host <addr>` | Host (`0.0.0.0` for remote) | localhost |
| `--open` | Auto-open browser | false |
| `--background` | Run in background | false |
| `--stop` | Stop all servers | - |

---

## HTTP Routes

| Route | Description |
|-------|-------------|
| `/` or `/kanban` | Dashboard view |
| `/kanban?dir=<path>` | Dashboard for directory |
| `/api/plans` | JSON API |
| `/assets/*` | Static assets |

---

## Plan Structure

```
plans/
├── feature-auth/
│   ├── plan.md          # Required with frontmatter
│   ├── phase-01-design.md
│   └── phase-02-impl.md
└── feature-api/
    ├── plan.md
    └── phase-01-endpoints.md
```

**Required plan.md frontmatter:**

```yaml
---
title: Feature A Implementation
status: in-progress
priority: high
issue: https://github.com/org/repo/issues/123
branch: feature/feature-a
created: 2025-12-15
---
```

---

## Features

| Feature | Description |
|---------|-------------|
| **Progress bars** | Visual percentage completion |
| **Phase breakdown** | Completed, in-progress, pending |
| **Timeline** | Gantt-style visualization |
| **Activity heatmap** | Busy period highlighting |
| **Glassmorphism UI** | Dark mode, warm accents |

---

## Architecture

```
scripts/
├── server.cjs           # Main entry
└── lib/
    ├── port-finder.cjs  # Port allocation
    ├── process-mgr.cjs  # PID management
    ├── http-server.cjs  # HTTP routing
    ├── plan-parser.cjs  # Markdown parsing
    └── dashboard-renderer.cjs
```

---

## API Integration

```bash
# Get plans data
curl http://localhost:3500/api/plans | jq '.plans[]'

# Filter by status
curl http://localhost:3500/api/plans | jq '.plans[] | select(.status == "in-progress")'
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Port in use | Auto-increments (3500-3550) |
| No plans found | Check `plan.md` exists |
| Can't access remotely | Use `--host 0.0.0.0` |
| Server won't stop | Check `/tmp/plans-kanban-*.pid` |

---

## Best Practices

| Practice | Application |
|----------|-------------|
| Consistent naming | `phase-01-name.md` for sorting |
| Update frontmatter | Keep status, priority current |
| Include links | Issue/branch for navigation |
| Background mode | Free terminal |
| Network access | `--host 0.0.0.0` for teams |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `project-planner` | Skill | Create plan structure |
| `lifecycle-orchestrator` | Skill | Multi-phase execution |
| `/pulse` | Workflow | Project health |

---

⚡ PikaKit v3.9.68
