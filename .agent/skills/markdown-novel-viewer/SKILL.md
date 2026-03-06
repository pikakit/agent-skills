---
name: markdown-novel-viewer
description: >-
  Background HTTP server rendering markdown files with book-like reading experience.
  Mermaid diagrams, plan navigation, directory browser.
  Triggers on: preview, markdown viewer, view plans, documentation.
  Coordinates with: plans-kanban, doc-templates.
metadata:
  version: "2.0.0"
  category: "tools"
  triggers: "preview, markdown viewer, view plans, documentation, mermaid"
  success_metrics: "server starts <2s, markdown renders <200ms, port allocated"
  coordinates_with: "plans-kanban, doc-templates"
---

# Markdown Novel Viewer — Background Preview Server

> Single command. Novel theme. Mermaid auto-render. Port 3456-3500.

---

## Prerequisites

```bash
cd .agent/skills/markdown-novel-viewer
npm install marked gray-matter
```

---

## When to Use

| Situation | Action |
|-----------|--------|
| Preview markdown file | `--file ./README.md` |
| Browse documentation dir | `--dir ./docs` |
| View plan phases | Auto-detected sidebar nav |
| Render Mermaid diagrams | Auto-renders in code blocks |
| Stop all servers | `--stop` |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| HTTP server lifecycle (start/stop) | Plan dashboards (→ plans-kanban) |
| Port allocation (3456-3500) | Doc generation (→ doc-templates) |
| Markdown rendering (novel theme) | Markdown authoring |
| Mermaid diagram rendering (5 types) | Diagram authoring |
| Directory browsing | File system permissions |

**Automation skill:** Spawns HTTP server process, binds ports, reads files. Non-idempotent.

---

## Quick Start

```bash
# View a file
node .agent/skills/markdown-novel-viewer/scripts/server.js \
  --file ./README.md --open

# Browse a directory
node .agent/skills/markdown-novel-viewer/scripts/server.js \
  --dir ./docs --open

# Remote access
node .agent/skills/markdown-novel-viewer/scripts/server.js \
  --file ./plan.md --host 0.0.0.0 --open

# Stop all servers
node .agent/skills/markdown-novel-viewer/scripts/server.js --stop
```

---

## CLI Options

| Option | Default | Description |
|--------|---------|-------------|
| `--file <path>` | — | Markdown file to render |
| `--dir <path>` | — | Directory to browse |
| `--port <n>` | 3456 | Server port (range: 3456-3500) |
| `--host <addr>` | localhost | Bind address |
| `--open` | false | Auto-open browser |
| `--background` | false | Run in background |
| `--stop` | — | Stop all servers |

---

## State Transitions

```
IDLE → STARTING              [start invoked]
STARTING → RUNNING           [port bound, listening]
STARTING → PORT_EXHAUSTED    [all 3456-3500 in use]  // terminal
RUNNING → STOPPED            [stop invoked]  // terminal
RUNNING → CRASHED            [unhandled error]  // terminal
```

---

## HTTP Routes

| Route | Description |
|-------|-------------|
| `/view?file=<path>` | Markdown viewer |
| `/browse?dir=<path>` | Directory browser |

---

## Theme & Typography

| Mode | Background | Accent |
|------|------------|--------|
| Light | #faf8f3 (warm cream) | Saddle brown |
| Dark | #1a1a1a (near black) | Warm gold |

**Fonts:** Libre Baskerville (headings), Inter (body), JetBrains Mono (code). **Max width:** 720px.

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `T` | Toggle theme |
| `S` | Toggle sidebar |
| `←→` | Scroll page |
| `Esc` | Close sidebar |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_PORT_EXHAUSTED` | Yes | All ports 3456-3500 in use |
| `ERR_FILE_NOT_FOUND` | Yes | Markdown file not found |
| `ERR_DIR_NOT_FOUND` | Yes | Directory not found |
| `ERR_DEPS_MISSING` | Yes | marked or gray-matter missing |
| `ERR_ALREADY_RUNNING` | Yes | Port already bound |
| `ERR_NOT_RUNNING` | Yes | Stop called; no server running |

**Port conflict:** auto-increments within 3456-3500 (max 45 attempts).

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Bind 0.0.0.0 by default | Use localhost; explicit --host for remote |
| Leave servers orphaned | Use --stop to clean up |
| Use absolute paths outside project | Use relative paths |
| Ignore Mermaid errors | Validate at mermaid.live |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [server.js](scripts/server.js) | Main server entry point | Implementation |
| [engineering-spec.md](references/engineering-spec.md) | Full engineering spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `plans-kanban` | Skill | Dashboard view |
| `doc-templates` | Skill | Documentation structure |

---

⚡ PikaKit v3.9.87
