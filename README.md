# Agent Skills Kit

> The Premium Agent Skills Kit for Enterprise

## Quick Install

```bash
npx add-skill-kit agentskillkit/agent-skills
```

Or install globally:

```bash
npm install -g add-skill-kit
add-skill-kit agentskillkit/agent-skills
```

This installs the `.agent` folder containing all templates into your project.

## What's Included

| Component     | Count | Description                                                        |
| ------------- | ----- | ------------------------------------------------------------------ |
| **Agents**    | 20    | Specialist AI personas (frontend, backend, security, PM, QA, etc.) |
| **Skills**    | 36    | Domain-specific knowledge modules                                  |
| **Workflows** | 11    | Slash command procedures                                           |

## Features

### 🧠 Adaptive Intelligence (Self-Learning)
Agent Skills Kit learns from your codebase and mistakes.

```bash
npx ag-smart learn --add --pattern "console\.log" --message "No console logs in production"
```

### ⚖️ Smart Audit
Enforce rules, memory, and constitution before you commit.

```bash
npx ag-smart audit
```

## CLI Tool

| Command           | Description                               |
| ----------------- | ----------------------------------------- |
| `ag-smart learn`  | Teach the agent a new lesson              |
| `ag-smart audit`  | Run compliance check                      |
| `ag-smart recall` | Check memory for a file                   |

## Documentation

- **[Online Docs](https://github.com/agentskillkit/agent-skills)**

## License

**Proprietary Commercial License**
Copyright (c) 2026 Agent Skill Kit Authors. All Rights Reserved.
