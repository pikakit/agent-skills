---
name: mermaid-editor
description: >-
  Live Mermaid diagram editor with syntax highlighting, preview, and export.
  9 diagram types: flowchart, sequence, class, state, ER, gantt, pie, mindmap, timeline.
  Triggers on: mermaid, diagram, flowchart, sequence diagram, mmd editor.
  Coordinates with: system-design, doc-templates, markdown-novel-viewer.
allowed-tools: Read, Write, Edit, Terminal
metadata:
  version: "2.0.0"
  category: "tools"
  triggers: "mermaid, diagram, flowchart, mmd, sequence, class diagram"
  success_metrics: "editor starts, 9 types render, file save/load works"
  coordinates_with: "system-design, doc-templates, markdown-novel-viewer"
---

# Mermaid Editor — Live Diagram Editor Server

> 9 diagram types. Live preview. Syntax highlighting. Port 3457.

---

## Prerequisites

**Required:** Node.js 18+.

---

## When to Use

| Situation | Action |
|-----------|--------|
| Edit Mermaid diagram | `--open` (empty editor) |
| Edit existing .mmd file | `--file diagram.mmd --open` |
| Preview diagram live | Real-time rendering in editor |
| Stop editor server | `--stop` |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| HTTP editor server (start/stop) | Architecture diagrams (→ system-design) |
| 9 diagram type rendering | Markdown preview (→ markdown-novel-viewer) |
| .mmd file save/load | Documentation (→ doc-templates) |
| Syntax highlighting + live preview | Mermaid.js library |

**Automation skill:** Spawns HTTP server, binds port, reads/writes files. Non-idempotent.

---

## Quick Start

```bash
# Open editor (empty)
node .agent/skills/mermaid-editor/scripts/editor-server.cjs --open

# Edit existing file
node .agent/skills/mermaid-editor/scripts/editor-server.cjs --file diagram.mmd --open

# Stop server
node .agent/skills/mermaid-editor/scripts/editor-server.cjs --stop
```

---

## CLI Options

| Option | Default | Description |
|--------|---------|-------------|
| `--file <path>` | — | Open .mmd file |
| `--port <n>` | 3457 | Server port |
| `--open` | false | Auto-open browser |
| `--stop` | — | Stop all servers |

---

## State Transitions

```
IDLE → STARTING              [start invoked]
STARTING → RUNNING           [port bound, listening]
STARTING → PORT_UNAVAILABLE  [port 3457 in use]  // terminal
RUNNING → STOPPED            [stop invoked]  // terminal
RUNNING → CRASHED            [unhandled error]  // terminal
```

---

## Diagram Types (9 — Fixed)

| # | Type | Keyword |
|---|------|---------|
| 1 | Flowchart | `flowchart LR` |
| 2 | Sequence | `sequenceDiagram` |
| 3 | Class | `classDiagram` |
| 4 | State | `stateDiagram-v2` |
| 5 | ER | `erDiagram` |
| 6 | Gantt | `gantt` |
| 7 | Pie | `pie` |
| 8 | Mindmap | `mindmap` |
| 9 | Timeline | `timeline` |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_PORT_UNAVAILABLE` | Yes | Port in use |
| `ERR_FILE_NOT_FOUND` | Yes | .mmd file not found |
| `ERR_WRITE_FAILED` | Yes | Cannot save file |
| `ERR_ALREADY_RUNNING` | Yes | Editor already on port |
| `ERR_NOT_RUNNING` | Yes | Stop called; not running |

**No auto port increment.** Use `--port` for alternative port.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Assume port 3457 is free | Check or use --port |
| Leave servers orphaned | Use --stop to clean up |
| Edit non-.mmd files | Use .mmd for Mermaid diagrams |
| Skip syntax validation | Preview catches errors live |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [diagram-reference.md](references/diagram-reference.md) | Full syntax + examples for all 9 types | Writing diagram syntax |
| [editor-server.cjs](scripts/editor-server.cjs) | Server implementation | Implementation |
| [engineering-spec.md](references/engineering-spec.md) | Full engineering spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `system-design` | Skill | Architecture diagrams |
| `markdown-novel-viewer` | Skill | Preview with Mermaid |
| `/diagram` | Workflow | Auto-generate diagrams |

---

⚡ PikaKit v3.9.69
