# Agent Skill Kit

> **Transform your AI Agent into a multi-domain expert with one command**

[![npm](https://img.shields.io/badge/version-3.2.0-7c3aed?style=flat&colorA=18181b)](https://www.npmjs.com/package/agentskillskit-cli)
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

> **🎉 v3.2.0 Update:** All master scripts migrated to JavaScript!
>
> - ✅ **Zero Python dependency** for core features
> - ✅ **143 tests passing** across Studio & CLI
> - ✅ **TypeScript definitions** for better IDE support
> - ✅ **~10% faster** execution
>
> See [CHANGELOG.md](CHANGELOG.md) for details.

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
┌ Agent Skill Kit v3.2.0
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

- `SmartRouter` - Auto-select specialist agents
- `ContextOptimizer` - Optimize context window
- `ReasoningEngine` - Step-by-step reasoning
- `CreativeThinking` - 6 creative techniques
- `SelfEvolution` - Self-learning from mistakes

### 🎨 Frontend & Design

- `DesignSystem` - Color, typography, UX psychology
- `ReactArchitect` - Modern hooks, composition
- `NextJSPro` - App Router, SSR/SSG
- `TailwindKit` - Tailwind CSS v4
- `VisualExcellence` - Anti-AI-slop design

### 🔒 Backend & Security

- `APIArchitect` - REST, GraphQL, authentication
- `DataModeler` - Schema, migrations, Prisma
- `NodeJSPro` - Express, performance
- `SecurityScanner` - Security audits
- `OffensiveSec` - Penetration testing

### 📱 Mobile Development

- `MobileFirst` - Mobile-first patterns
- `GameEngine` - Game architecture, optimization

### 🧪 Testing & Quality

- `TestArchitect` - Unit, integration, E2E
- `TestDrivenDev` - Test-driven development
- `E2EAutomation` - Playwright automation
- `DebugPro` - 4-phase methodology
- `CodeQuality` - ESLint, TypeScript, linting

### 📊 DevOps & Infrastructure

- `CICDPipeline` - CI/CD, Docker, K8s
- `ServerOps` - Linux, Nginx, monitoring
- `PerfOptimizer` - Lighthouse, profiling

### 📝 Planning & Documentation

- `ProjectPlanner` - Structured task planning
- `IdeaStorm` - Socratic questioning
- `DocProcessor` - Work with Word, PDF, Excel
- `DocTemplates` - README, API docs

### 🎯 Specialized

- `MCPServer` - Model Context Protocol servers
- `DiagramKit` - Diagram generation
- `SEOOptimizer` - SEO, E-E-A-T, Core Web Vitals
- `GlobalizationKit` - Internationalization
- `GeoSpatial` - Geospatial data

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

## � Master Validation Scripts

Four JavaScript scripts for project validation and development workflow:

| Script               | Purpose                        | Command                  |
| -------------------- | ------------------------------ | ------------------------ |
| `checklist.js`       | Priority-based core validation | `npm run checklist:js .` |
| `verify_all.js`      | Comprehensive pre-deploy suite | `npm run verify <URL>`   |
| `auto_preview.js`    | Dev server management          | `npm run preview:start`  |
| `session_manager.js` | Project status & analytics     | `npm run session:status` |

### Quick Validation

```bash
# Core checks (Security, Lint, Tests, UX, SEO)
npm run checklist:js .

# Full verification with performance + E2E
npm run verify http://localhost:3000

# Project status
npm run session:info
```

### Development Server

```bash
# Start development server
npm run preview:start

# Check status
npm run preview:status

# Stop server
npm run preview:stop
```

**Note:** Python versions (`*.py`) still available in `.agent/scripts/` for compatibility.

---

## �🛠️ CLI Commands

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

| Feature                  | Agent Skill Kit   | Generic AI | Other Solutions |
| ------------------------ | ----------------- | ---------- | --------------- |
| **Skills**               | 49+ domain skills | 0          | 5-10            |
| **Agents**               | 20 specialists    | 1 generic  | 1-3             |
| **Workflows**            | 14 slash commands | Manual     | DIY             |
| **Safety**               | TIER -1 Protocol  | ❌         | ❌              |
| **Self-learning**        | ✅ Auto-learn     | ❌         | ❌              |
| **Context optimization** | ✅ Smart loading  | ❌         | Partial         |
| **Token efficiency**     | 80% reduction     | Baseline   | 30%             |

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
