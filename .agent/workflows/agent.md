---
description: Launch interactive Agent Smart CLI. Learn patterns, recall violations, view stats, audit, and watch files.
---

# /agent - Interactive CLI Interface

$ARGUMENTS

---

## Purpose

Launch the **Agent Skill Kit Smart CLI** - an interactive terminal interface for managing learned patterns and memory.

---

## 🤖 Meta-Agents Integration

| Phase | Agent | Action |
| ----- | ----- | ------ |
| **Pattern Learning** | `learner` | Store and recall anti-patterns |
| **Audit** | `assessor` | Evaluate code compliance |

---

## 🔴 MANDATORY: Launch Protocol

### Step 1: Run Interactive CLI
// turbo
```bash
agent
```

---

## Features

| Menu Option | Description | Icon |
|-------------|-------------|------|
| **Learn** | Teach a new anti-pattern | ◆ |
| **Recall** | Scan code for violations | ◇ |
| **Stats** | View statistics & hit counts | ▣ |
| **Audit** | Run compliance check | ▲ |
| **Watch** | Real-time file monitoring | ○ |
| **Exit** | Close the CLI | × |

---

## Examples

```
/agent              # Open main menu
/agent learn        # Jump to Learn flow
/agent recall       # Jump to Recall flow
/agent stats        # View statistics
```

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **↑/↓** | Navigate menu |
| **Enter** | Select option |
| **ESC** | Cancel / Go back |
| **Ctrl+C** | Exit immediately |

---

## 🔗 Related Commands

| Command | Purpose |
|---------|---------|
| `/think` | Brainstorm before learning patterns |
| `/validate` | Run full test suite |
| `/diagnose` | Debug pattern detection issues |
