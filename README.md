# Agent Skill Kit

> **Transform your AI Agent into a multi-domain expert with one command**

[![npm](https://img.shields.io/badge/version-2.4.0-7c3aed?style=flat&colorA=18181b)](https://www.npmjs.com/package/agentskillskit-cli)
[![skills](https://img.shields.io/badge/skills-49+-7c3aed?style=flat&colorA=18181b)](https://github.com/agentskillkit/agent-skills)
[![agents](https://img.shields.io/badge/agents-20-7c3aed?style=flat&colorA=18181b)](https://github.com/agentskillkit/agent-skills)
[![license](https://img.shields.io/badge/license-MIT-7c3aed?style=flat&colorA=18181b)](LICENSE)

---

## ⚡ Quick Install (1 Command)

```bash
npx -y add-skill-kit agentskillkit/agent-skills
```

**Choose your scope:**
- **Current Project** → Local `.agent/` folder + `npm run agent`
- **Global System** → System-wide `~/.gemini/` + `agent` command anywhere

**Then:** Run `agent` to open Smart CLI dashboard, or use `/build`, `/think`, `/validate` workflows.

---

## 🎯 What You Get

### 🛡️ Safety-First AI

Built-in **TIER -1 Safety Protocol**:
- ✅ No accidental file deletion
- ✅ Versioned outputs (`.v2`, `.new`, `.proposed`)
- ✅ Rollback guarantee
- ✅ Human checkpoints for critical changes

### 🧠 49 Domain Skills

From **Frontend** to **Security** to **AI Development**:
```
aesthetic, api-patterns, app-builder, architecture, auto-learn,
bash-linux, behavioral-modes, brainstorming, clean-code,
code-review-checklist, code-reviewer, context-engineering,
database-design, debugging, deployment-procedures, document-skills,
documentation-templates, frontend, frontend-design, game-development,
geo-fundamentals, git-conventions, governance, i18n-localization,
intelligent-routing, lint-and-validate, mcp-builder, mermaidjs-v11,
mobile-design, nextjs-best-practices, nodejs-best-practices,
parallel-agents, performance-profiling, plan-writing,
powershell-windows, problem-solving, python-patterns, react-patterns,
red-team-tactics, seo-fundamentals, sequential-thinking,
server-management, skill-creator, systematic-debugging,
tailwind-patterns, tdd-workflow, testing-patterns,
vulnerability-scanner, webapp-testing
```

### 🤖 20 Specialist Agents

Auto-selected based on your request:
- `orchestrator` - Multi-agent coordination
- `frontend-specialist` - React, Next.js, UI/UX
- `backend-specialist` - APIs, databases, servers
- `mobile-developer` - iOS, Android, React Native
- `security-auditor` - Vulnerability scanning
- `test-engineer` - Testing automation
- `debugger` - Systematic debugging
- And 13 more...

### 📜 14 Slash Commands (Workflows)

```bash
/think       # Brainstorm 3+ alternatives before coding
/architect   # Generate detailed plan.md
/build       # Full-stack implementation
/validate    # Test automation
/diagnose    # Root cause debugging
/launch      # Zero-downtime deployment
/studio      # UI design with 95+ palettes
...
```

---

## 🚀 Quick Start

### 1. Install Skills

```bash
npx -y add-skill-kit agentskillkit/agent-skills
```

Installer will:
1. Clone skills from GitHub
2. Ask scope (Project / Global)
3. Auto-add `npm run agent` script (local only)
4. Setup `.agent/` directory

### 2. Run Smart CLI

**Local install:**
```bash
npm run agent
```

**Global install:**
```bash
agent
```

Interactive menu with:
- Core Features (Routing, Learn, Recall, Lessons)
- Analysis & Monitor (Stats, Audit, Watch)
- Data Management (Backup, Export, Proposals)
- Configuration (Settings, Completion, Init)

### 3. Use Workflows

```bash
# Plan a feature
/think authentication system
/architect

# Build it
/build

# Test it
/validate
```

---

## 🎨 Features

### Two-Level Menu Navigation

```
┌ Agent Skill Kit v2.4.0
│
◆ What would you like to do?
│ ● Core Features
│ ○ Analysis & Monitor
│ ○ Data Management
│ ○ Configuration
│ ○ Exit
└
```

Clean, organized, no more endless scrolling.

### Interactive Command Execution

Help menu lets you **execute commands directly**:

```bash
kit  # Open help

# After viewing commands:
Execute a command?
  ● list → Run kit list
  ○ doctor → Run kit doctor
  ○ uninstall → Interactive removal
  ○ ← Back
```

### Redesigned Uninstall

**`kit uninstall` (no params):**
```
What would you like to do?
  ● Select specific skill
  ○ Remove all skills (with confirmations)
  ○ Cancel
```

**`kit uninstall all` (destructive):**
```
AUTOMATIC COMPLETE REMOVAL
✓ Removed: 49 skills  
✓ Removed: .agent folder
✓ Removed: node_modules/
✓ Removed: package.json
✓ Complete cleanup done
```

No questions asked - instant nuclear cleanup for global installs.

### Auto npm Script Injection

For **local installs**, `package.json` gets:
```json
{
  "scripts": {
    "agent": "agent"
  }
}
```

No more `npx` needed - just `npm run agent`!

### Self-Learning System

AI learns from mistakes:

```bash
# Teach a pattern
agent → Learn → Add lesson

# AI automatically detects violations
agent → Recall → Scan codebase

# View knowledge base
agent → Lessons → Manage
```

Lessons stored in `.agent/knowledge/lessons-learned.yaml`.

---

## 📚 Skills Catalog (49)

### 🤖 AI & Agent Development
- `intelligent-routing` - Auto-select specialist agents
- `context-engineering` - Optimize context window
- `sequential-thinking` - Step-by-step reasoning
- `problem-solving` - 6 creative techniques
- `auto-learn` - Self-learning from mistakes

### 🎨 Frontend & Design
- `frontend-design` - Color, typography, UX psychology
- `react-patterns` - Modern hooks, composition
- `nextjs-best-practices` - App Router, SSR/SSG
- `tailwind-patterns` - Tailwind CSS v4
- `aesthetic` - Anti-AI-slop design

### 🔒 Backend & Security
- `api-patterns` - REST, GraphQL, authentication
- `database-design` - Schema, migrations, Prisma
- `nodejs-best-practices` - Express, performance
- `vulnerability-scanner` - Security audits
- `red-team-tactics` - Penetration testing

### 📱 Mobile Development
- `mobile-design` - Mobile-first patterns
- `game-development` - Game architecture, optimization

### 🧪 Testing & Quality
- `testing-patterns` - Unit, integration, E2E
- `tdd-workflow` - Test-driven development
- `webapp-testing` - Playwright automation
- `systematic-debugging` - 4-phase methodology
- `lint-and-validate` - ESLint, TypeScript, linting

### 📊 DevOps & Infrastructure
- `deployment-procedures` - CI/CD, Docker, K8s
- `server-management` - Linux, Nginx, monitoring
- `performance-profiling` - Lighthouse, profiling

### 📝 Planning & Documentation
- `plan-writing` - Structured task planning
- `brainstorming` - Socratic questioning
- `document-skills` - Work with Word, PDF, Excel
- `documentation-templates` - README, API docs

### 🎯 Specialized
- `mcp-builder` - Model Context Protocol servers
- `mermaidjs-v11` - Diagram generation
- `seo-fundamentals` - SEO, E-E-A-T, Core Web Vitals
- `i18n-localization` - Internationalization
- `geo-fundamentals` - Geospatial data

[See full catalog →](https://github.com/agentskillkit/agent-skills/tree/main/.agent/skills)

---

## 🗂️ Project Structure

**Local Install:**
```
your-project/
├── .agent/
│   ├── GEMINI.md           # AI behavior config
│   ├── ARCHITECTURE.md     # System overview
│   ├── skills/             # 49 domain skills
│   ├── agents/             # 20 specialists
│   ├── workflows/          # 14 slash commands
│   ├── knowledge/          # Self-learning memory
│   │   └── lessons-learned.yaml
│   └── scripts/            # Validation scripts
├── node_modules/
│   └── agentskillskit-cli/
└── package.json
    └── "agent": "agent"    # Auto-added script
```

**Global Install:**
```
~/.gemini/
└── antigravity/
    ├── skills/             # 49 domain skills
    ├── agents/             # 20 specialists
    ├── workflows/          # 14 slash commands
    └── knowledge/          # Self-learning memory
```

---

## 🛠️ CLI Commands

### Installer (`kit`)

```bash
kit agentskillkit/agent-skills  # Install all skills
kit list                         # List installed skills
kit uninstall                    # Interactive removal
kit uninstall all                # Nuclear cleanup
kit doctor                       # Health check
```

### Smart CLI (`agent` or `npm run agent`)

Interactive dashboard with:
- **Core Features**: Routing, Learn, Recall, Lessons
- **Analysis & Monitor**: Stats, Audit, Watch
- **Data Management**: Backup, Export, Proposals
- **Configuration**: Settings, Completion, Init

---

## 💡 Examples

### Before Agent Skill Kit
```
You: "Add authentication"
AI: [Basic code, no security, no tests]
```

### After Agent Skill Kit
```
You: "Add authentication"
AI: 🤖 Engaging @security-auditor → @backend-specialist
    - JWT with refresh tokens
    - bcrypt password hashing
    - Rate limiting
    - Input validation
    - Unit + integration tests
    - Security audit ✅
```

---

## 🎬 Workflows in Action

### `/think` - Ideation
```bash
/think payment system
```
AI provides 3+ alternatives with trade-offs analysis.

### `/architect` - Planning
```bash
/architect
```
Creates `implementation_plan.md` with:
- File-by-file changes
- Dependencies
- Verification plan

### `/build` - Implementation
```bash
/build
```
Multi-agent coordination to implement the plan.

### `/validate` - Testing
```bash
/validate
```
Auto-generate and run test suite.

---

## 🔧 Advanced Usage

### Manual Skill Installation
```bash
kit agentskillkit/agent-skills#react-patterns  # Single skill
```

### Update Skills
```bash
kit update react-patterns
```

### Backup & Restore
```bash
# Backup all skills
kit backup

# Restore from backup
kit restore
```

### Export Skills
```bash
# Export to tarball
kit export skills.tar.gz

# Import from tarball
kit import skills.tar.gz
```

---

## 📈 Comparison

| Feature | Agent Skill Kit | Generic AI | Other Solutions |
|---------|-----------------|------------|-----------------|
| **Skills** | 49+ domain skills | 0 | 5-10 |
| **Agents** | 20 specialists | 1 generic | 1-3 |
| **Workflows** | 14 slash commands | Manual | DIY |
| **Safety** | TIER -1 Protocol | ❌ | ❌ |
| **Self-learning** | ✅ Auto-learn | ❌ | ❌ |
| **Context optimization** | ✅ Smart loading | ❌ | Partial |
| **Token efficiency** | 80% reduction | Baseline | 30% |

---

## 🌟 Key Principles

1. **Safety > Functionality** - Never break user's code
2. **Skills over Prompts** - Reusable, modular knowledge
3. **Auto-routing** - AI chooses the right specialist
4. **Self-learning** - Improves from mistakes
5. **Governance** - Constitutional rules system

---

## 🔗 Links

- [GitHub - agent-skills](https://github.com/agentskillkit/agent-skills)
- [GitHub - add-skill-kit](https://github.com/agentskillkit/add-skill-kit)
- [npm - agentskillskit-cli](https://www.npmjs.com/package/agentskillskit-cli)
- [npm - add-skill-kit](https://www.npmjs.com/package/add-skill-kit)
- [Issues & Feature Requests](https://github.com/agentskillkit/agent-skills/issues)

---

## 📄 License

MIT - Free for all projects.

---

**⭐ Star the repo • Install now • Build something great**
