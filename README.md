# Agent Skills Kit

> **AI Agent templates with Skills, Agents, and Workflows**

[![npm](https://img.shields.io/badge/version-1.0.0-7c3aed?style=flat&colorA=18181b)](https://github.com/agentskillkit/agent-skills)
[![license](https://img.shields.io/badge/license-Proprietary-7c3aed?style=flat&colorA=18181b)](https://github.com/agentskillkit/agent-skills/blob/main/LICENSE)

---

## Quick Install

```bash
npx -y add-skill-kit agentskillkit/agent-skills
```

Or install globally:

```bash
npm install -g add-skill-kit
add-skill-kit agentskillkit/agent-skills
```

This installs the `.agent` folder containing all templates into your project.

---

## What's Included

| Component | Count | Description |
|-----------|-------|-------------|
| **Agents** | 20 | Specialist AI personas (frontend, backend, security, PM, QA, etc.) |
| **Skills** | 40+ | Domain-specific knowledge modules |
| **Workflows** | 11 | Slash command procedures |

---

## Usage

### Using Agents

**No need to mention agents explicitly!** The system automatically detects and applies the right specialist(s):

```
You: "Add JWT authentication"
AI: 🤖 Applying @security-auditor + @backend-specialist...

You: "Fix the dark mode button"
AI: 🤖 Using @frontend-specialist...

You: "Login returns 500 error"
AI: 🤖 Using @debugger for systematic analysis...
```

**How it works:**
1. Analyzes your request silently
2. Detects domain(s) automatically (frontend, backend, security, etc.)
3. Selects the best specialist(s)
4. Informs you which expertise is being applied
5. You get specialist-level responses without needing to know the system architecture

**Benefits:**
- ✅ Zero learning curve - just describe what you need
- ✅ Always get expert responses
- ✅ Transparent - shows which agent is being used
- ✅ Can still override by mentioning agent explicitly

---

### Using Workflows

Invoke workflows with slash commands:

| Command | Description |
|---------|-------------|
| `/brainstorm` | Explore options before implementation |
| `/create` | Create new features or apps |
| `/debug` | Systematic debugging |
| `/deploy` | Deploy application |
| `/enhance` | Improve existing code |
| `/orchestrate` | Multi-agent coordination |
| `/plan` | Create task breakdown |
| `/preview` | Preview changes locally |
| `/status` | Check project status |
| `/test` | Generate and run tests |
| `/ui-ux-pro-max` | Design with 50 styles |

**Example:**
```
/brainstorm authentication system
/create landing page with hero section
/debug why login fails
```

---

### Using Skills

Skills are loaded automatically based on task context. The AI reads skill descriptions and applies relevant knowledge.

**Available Skills:**

| Skill | Description |
|-------|-------------|
| `react-patterns` | Modern React hooks & composition |
| `api-patterns` | REST, GraphQL, tRPC design |
| `testing-patterns` | Unit, integration, E2E strategies |
| `clean-code` | Pragmatic coding standards |
| `systematic-debugging` | 4-phase debug methodology |
| `vulnerability-scanner` | OWASP security audit |
| `nextjs-best-practices` | App Router, Server Components |
| `database-design` | Schema, indexing, ORM selection |
| `tailwind-patterns` | Tailwind CSS v4 patterns |
| `mobile-design` | iOS/Android design thinking |
| ...and 30+ more | |

---

## Self-Learning Engine

Your agent learns from mistakes and remembers them forever.

```bash
# Teach it something new
npx ag-smart learn --pattern "console\.log" --message "No console.log in production"

# It will never make that mistake again
```

**How it works:**
1. You identify a pattern to avoid
2. Agent stores it in `knowledge/lessons-learned.yaml`
3. Every future audit checks against learned lessons

---

## CLI Tool

| Command | Description |
|---------|-------------|
| `ag-smart learn` | Teach the agent a new lesson |
| `ag-smart audit` | Run compliance check |
| `ag-smart recall` | Check memory for a file |

---

## Project Structure

```
your-project/
└── .agent/
    ├── skills/           # 40+ domain skills
    │   ├── react-patterns/
    │   ├── api-patterns/
    │   ├── testing-patterns/
    │   └── ...
    ├── workflows/        # Slash commands
    │   ├── brainstorm.md
    │   ├── debug.md
    │   ├── deploy.md
    │   └── ...
    ├── agents/           # Specialist personas
    │   ├── frontend-specialist.md
    │   ├── backend-specialist.md
    │   ├── security-auditor.md
    │   └── ...
    ├── knowledge/        # Self-learning memory
    └── GEMINI.md         # Agent configuration
```

---

## Requirements

- Node.js 18+
- AI agent that supports `.agent/skills/` (Antigravity, Claude Code coming soon)

---

## Documentation

- [GitHub Repository](https://github.com/agentskillkit/agent-skills)
- [Issues & Feature Requests](https://github.com/agentskillkit/agent-skills/issues)

---

## License

**Proprietary Commercial License**  
© 2026 Agent Skill Kit. All Rights Reserved.
