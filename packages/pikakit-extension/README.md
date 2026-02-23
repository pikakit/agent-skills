# PikaKit Engine - VS Code Extension

> 🤖 Real-time auto-learning from IDE diagnostics → Generate skills automatically

## Features

- **Real-time Diagnostics** - Listen to TypeScript, ESLint errors in real-time
- **Pattern Detection** - Auto-detect patterns from repeated errors
- **Auto-Save Lessons** - Save to `.agent/lessons.json`
- **Skill Generation** - Generate SKILL.md when threshold is reached (≥3 times)
- **Auto-Accept** - Automatically accept Antigravity agent steps (edits, saves, terminal)
- **Auto-Run** - Automatically run proposed terminal commands
- **Status Bar** - Display learning status + Auto-Accept/Auto-Run toggles

## Keyboard Shortcuts

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+Shift+Enter` | Toggle Auto-Accept | Auto-accept code edits, file saves, terminal commands |
| `Alt+Enter` | Toggle Auto-Run | Auto-run proposed terminal commands |

> On macOS: `Cmd+Shift+Enter` and `Alt+Enter`

## Installation

### Via PikaKit CLI (recommended)

```bash
npx pikakit
```

The extension is installed automatically during skill installation.

### Install from VSIX

```bash
cd packages/pikakit-extension
npm install && npm run compile
npx @vscode/vsce package --allow-missing-repository
code --install-extension pikakit-engine-1.1.0.vsix
```

### Local Development

```bash
cd packages/pikakit-extension
npm install && npm run compile
```

Press F5 → "Extension Development Host" → Extension runs in new window.

## Commands

Press `Ctrl+Shift+P` → type "PikaKit":

| Command | Description |
|---------|-------------|
| `PikaKit: Start Learning` | Start listening to diagnostics |
| `PikaKit: Stop Learning` | Stop learning |
| `PikaKit: Generate Skill` | Manually generate from patterns |
| `PikaKit: View Lessons` | View all learned lessons |
| `PikaKit: Clear Lessons` | Clear all lessons |
| `PikaKit: Toggle Auto-Accept` | Toggle auto-accept (Ctrl+Shift+Enter) |
| `PikaKit: Toggle Auto-Run` | Toggle auto-run (Alt+Enter) |

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `pikakit.autoStart` | `true` | Auto-start learning on VS Code startup |
| `pikakit.threshold` | `3` | Error count before generating a skill |
| `pikakit.lessonsPath` | `.agent/lessons.json` | Path to lessons storage |
| `pikakit.autoAcceptEnabled` | `false` | Enable Auto-Accept on startup |
| `pikakit.autoRunEnabled` | `false` | Enable Auto-Run on startup |

## How It Works

```
1. TypeScript/ESLint error detected
2. Extension analyzes the error
3. Pattern saved to lessons.json
4. When pattern repeats ≥3 times
5. Auto-offer to generate skill
6. New skill created in .agent/skills/
```

## Status Bar

| Icon | State | Action |
|------|-------|--------|
| `$(check) Auto-Accept` | ON | Click or Ctrl+Shift+Enter to toggle |
| `$(circle-slash) Auto-Accept` | OFF | Click or Ctrl+Shift+Enter to toggle |
| `$(play) Auto-Run` | ON | Click or Alt+Enter to toggle |
| `$(debug-pause) Auto-Run` | OFF | Click or Alt+Enter to toggle |

## Supported Error Types

- TypeScript: Cannot find name, Property does not exist, Type mismatch
- ESLint: Unused variables, Missing semicolons
- React: Invalid hook calls, Missing dependencies
- General: Import errors, Module not found

---

⚡ PikaKit Engine v1.1.0
