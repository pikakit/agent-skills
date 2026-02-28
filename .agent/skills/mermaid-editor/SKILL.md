---
name: mermaid-editor
description: >-
  Live Mermaid diagram editor with syntax highlighting, preview, and export.
  9 diagram types: flowchart, sequence, class, state, ER, gantt, pie, mindmap, timeline.
  Triggers on: mermaid, diagram, flowchart, sequence diagram, mmd editor.
  Coordinates with: system-design, doc-templates, markdown-novel-viewer.
allowed-tools: Read, Write, Edit, Terminal
metadata:
  version: "1.0.0"
  category: "tools"
  triggers: "mermaid, diagram, flowchart, mmd, sequence, class diagram"
  success_metrics: "editor starts, diagrams render, export works"
  coordinates_with: "system-design, doc-templates, markdown-novel-viewer"
---

# Mermaid Editor

> Live diagram editor with preview, export, and syntax reference.

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

| Option | Description | Default |
|--------|-------------|---------|
| `--file <path>` | Open .mmd file | - |
| `--port <n>` | Server port | 3457 |
| `--open` | Auto-open browser | false |
| `--stop` | Stop all servers | - |

---

## Diagram Types

9 diagram types supported — see reference for full syntax and examples:

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

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| `references/diagram-reference.md` | Full syntax + examples for all 9 types, best practices, CLI export, themes | When writing specific diagram syntax |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `system-design` | Skill | Architecture diagrams |
| `markdown-novel-viewer` | Skill | Preview with Mermaid |
| `/diagram` | Workflow | Auto-generate diagrams |

---

⚡ PikaKit v3.9.66

