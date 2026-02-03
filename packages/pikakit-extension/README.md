# PikaKit Skill Engine - VS Code Extension

> 🤖 Real-time auto-learning from IDE diagnostics → Generate skills automatically

## Features

- **Real-time Diagnostics** - Listen to TypeScript, ESLint errors in real-time
- **Pattern Detection** - Auto-detect patterns from repeated errors
- **Auto-Save Lessons** - Save to `.agent/lessons.json`
- **Skill Generation** - Generate SKILL.md when threshold is reached (≥3 times)
- **Status Bar** - Display learning status

## Installation

### Local Development

```bash
cd packages/pikakit-extension
npm install
npm run compile
```

Then:
1. Press F5 in VS Code
2. Select "Extension Development Host"
3. Extension will run in a new VS Code window

### Install from VSIX

```bash
npm run vscode:prepublish
vsce package
code --install-extension pikakit-skill-engine-1.0.0.vsix
```

## Commands

Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS) to open Command Palette, then type "PikaKit" to see available commands:

| Command | Description |
|---------|-------------|
| `PikaKit: Start Learning` | Start listening to diagnostics |
| `PikaKit: Stop Learning` | Stop learning |
| `PikaKit: Generate Skill` | Manually generate from patterns |
| `PikaKit: View Lessons` | View all learned lessons |
| `PikaKit: Clear Lessons` | Clear all lessons |

## Configuration

```json
{
    "pikakit.autoStart": true,
    "pikakit.threshold": 3,
    "pikakit.lessonsPath": ".agent/lessons.json"
}
```

## How It Works

```
1. TypeScript/ESLint error detected
2. Extension analyzes the error
3. Pattern saved to lessons.json
4. When pattern repeats ≥3 times
5. Auto-offer to generate skill
6. New skill created in .agent/skills/
```

## Supported Error Types

- TypeScript: Cannot find name, Property does not exist, Type mismatch
- ESLint: Unused variables, Missing semicolons
- React: Invalid hook calls, Missing dependencies
- General: Import errors, Module not found

---

⚡ PikaKit v3.2.0
