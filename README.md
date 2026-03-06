<div align="center">

# ⚡ PikaKit

### Transform your AI Agent into a FAANG-level engineering team

[![npm version](https://img.shields.io/badge/npm-v3.9.95-7c3aed?style=for-the-badge&logo=npm&logoColor=white&labelColor=18181b)](https://www.npmjs.com/package/pikakit)
[![Skills](https://img.shields.io/badge/skills-51-06b6d4?style=for-the-badge&labelColor=18181b)](https://github.com/pikakit/agent-skills)
[![Agents](https://img.shields.io/badge/agents-21-f59e0b?style=for-the-badge&labelColor=18181b)](https://github.com/pikakit/agent-skills)
[![Workflows](https://img.shields.io/badge/workflows-18-10b981?style=for-the-badge&labelColor=18181b)](https://github.com/pikakit/agent-skills)
[![JavaScript](https://img.shields.io/badge/100%25-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black&labelColor=18181b)](https://github.com/pikakit/agent-skills)

**Composable Skills · Coordinated Agents · Intelligent Execution**

[Install](#-quick-install) · [Skills](#-skills-catalog-51) · [Workflows](#-workflows-18) · [Agents](#-multi-agent-coordination-21) · [Docs](#-links)

</div>

---

## 🚀 Quick Install

```bash
npx pikakit
```

> One command installs **51 skills**, **18 workflows**, **21 agents**, and a complete AI operating system into your project.

### What You Get

| Component | Count | Highlights |
|-----------|:-----:|------------|
| **Skills** | 51 | Architecture, Frontend, Backend, Security, DevOps, AI, Mobile, Testing |
| **Workflows** | 18 | `/think` · `/build` · `/autopilot` · `/studio` · `/validate` · and more |
| **Agents** | 21 | 16 domain specialists + 5 meta-agents for coordination |
| **Rules** | `GEMINI.md` | AI behavior configuration — the Supreme Law |
| **Scripts** | 6 | Checklist, verify, preview, session management |
| **CLI** | `kit` | Skill management · `agent` (optional interactive dashboard) |

---

## 🎯 Why PikaKit

<table>
<tr>
<td width="33%" align="center">

### 🤖 Auto-Accept
Approve plan **once** → agent runs to completion with **zero interruptions**

</td>
<td width="33%" align="center">

### 🧠 Self-Learning
AI **remembers mistakes** from `lessons-learned.yaml` and never repeats them

</td>
<td width="33%" align="center">

### 🛠️ Custom Skills
Create **project-specific skills** that teach AI your conventions

</td>
</tr>
</table>

| | PikaKit | Generic AI | Other Tools |
|---|:---:|:---:|:---:|
| **Auto-Accept Workflow** | ✅ | ❌ | ❌ |
| **Multi-Agent Coordination** | 21 specialists | 1 generic | 1–3 |
| **Self-Learning Memory** | ✅ | ❌ | ❌ |
| **100% JavaScript** | ✅ | Mixed | Python |
| **Safety Protocol** | TIER -1 | ❌ | ❌ |
| **Token Efficiency** | ~80% reduction | Baseline | ~30% |

---

## ⚡ Quick Start

### 1. Install

```bash
npx pikakit
```

Choose **Project** (`.agent/`) or **Global** (`~/.gemini/`) scope. Optionally install AutoLearn CLI.

### 2. Manage Skills

```bash
kit list                    # List all skills
kit info <skill-name>       # Show skill details
kit validate                # Validate skill structure
kit doctor                  # System health check
```

### 3. Run Workflows

```bash
/think auth system          # Brainstorm 3+ approaches
/plan                       # Generate detailed plan
/build                      # Multi-agent implementation
/autopilot                  # Full autonomous execution
/validate                   # Run test suite
/studio                     # UI design with 50+ styles
```

---

## 🧩 Skills Catalog (51)

### 🏗️ Architecture & Planning

| Skill | Description |
|-------|-------------|
| `project-planner` | Task planning with dependency graph |
| `idea-storm` | Socratic questioning & brainstorming |
| `lifecycle-orchestrator` | End-to-end task lifecycle management |
| `system-design` | Architecture decisions & ADR |
| `context-engineering` | Token optimization & agent architecture |

### 🎨 Frontend & Design

| Skill | Description |
|-------|-------------|
| `react-pro` | Modern React patterns, hooks, state management |
| `nextjs-pro` | App Router, RSC, 60+ optimization rules |
| `design-system` | Color theory, typography, UX psychology |
| `studio` | 50+ styles, 97 palettes, 57 font pairings |
| `tailwind-kit` | Tailwind CSS v4 patterns |

### ⚙️ Backend & API

| Skill | Description |
|-------|-------------|
| `api-architect` | REST, GraphQL, tRPC design |
| `nodejs-pro` | Hono/Fastify/Express/NestJS patterns |
| `python-pro` | FastAPI, Django, Flask |
| `data-modeler` | Schema design, Prisma/Drizzle |
| `auth-patterns` | OAuth2, JWT, RBAC/ABAC, MFA, Passkeys |

### 🔐 Security

| Skill | Description |
|-------|-------------|
| `security-scanner` | OWASP 2025, supply chain security |
| `offensive-sec` | Red team tactics, MITRE ATT&CK |
| `code-constitution` | Constitutional governance (Supreme Law) |

### 🧪 Testing & Quality

| Skill | Description |
|-------|-------------|
| `test-architect` | Unit, integration, E2E strategies |
| `e2e-automation` | Playwright, visual testing, deep audit |
| `code-craft` | Clean code, SRP, DRY, KISS |
| `code-review` | Linting, static analysis, PR review |
| `problem-checker` | IDE problem detection & auto-fix |

### 🐛 Debugging

| Skill | Description |
|-------|-------------|
| `debug-pro` | 4-phase methodology + defense-in-depth |
| `chrome-devtools` | Puppeteer CLI, screenshots, Core Web Vitals |
| `knowledge-graph` | AST parsing, find-usages, impact analysis |

### 🤖 AI & Agents

| Skill | Description |
|-------|-------------|
| `google-adk-python` | Google Agent Development Kit |
| `auto-learned` | Hierarchical auto-learned patterns |
| `auto-learner` | Pattern extraction from errors |
| `execution-reporter` | Agent routing transparency |
| `smart-router` | Intelligent agent routing |
| `mcp-builder` | Build MCP servers for AI agents |
| `mcp-management` | Discover & execute MCP tools |
| `ai-artist` | Prompt engineering for LLM & image AI |

### ☁️ DevOps & Infrastructure

| Skill | Description |
|-------|-------------|
| `cicd-pipeline` | Safe deployments, rollback strategies |
| `gitops` | ArgoCD/Flux GitOps workflows |
| `git-workflow` | Conventional commits, secret detection |
| `server-ops` | Process management, scaling |
| `vercel-deploy` | 1-click Vercel deployment |
| `observability` | OpenTelemetry, unified logs/metrics/traces |
| `perf-optimizer` | Core Web Vitals, bundle analysis |

### 📱 Mobile & Specialized

| Skill | Description |
|-------|-------------|
| `mobile-developer` | React Native, Flutter, native |
| `mobile-design` | Mobile-first UI/UX patterns |
| `game-development` | Game logic & mechanics |
| `typescript-expert` | Type-level programming, monorepo |
| `shell-script` | Bash/Linux terminal patterns |

### 📝 Documentation & Content

| Skill | Description |
|-------|-------------|
| `doc-templates` | README, API docs, ADR templates |
| `copywriting` | AIDA, PAS, conversion formulas |
| `seo-optimizer` | SEO, E-E-A-T, Core Web Vitals |
| `media-processing` | FFmpeg, ImageMagick, RMBG |
| `agent-browser` | AI-optimized browser automation |
| `knowledge-graph` | AST parsing, find-usages, impact analysis |

---

## 📜 Workflows (18)

| Command | Purpose | Agents |
|---------|---------|:------:|
| `/think` | Brainstorm 3+ approaches | planner |
| `/plan` | Generate detailed `PLAN.md` | planner, explorer |
| `/build` | Full-stack implementation | 3–7 |
| `/autopilot` | Multi-agent autonomous execution | 3+ |
| `/cook` | Direct implementation from instructions | code-craft |
| `/fix` | Quick error remediation | debug-pro |
| `/validate` | Test suite with coverage | qa |
| `/diagnose` | Root cause debugging | debug |
| `/inspect` | Defense-in-depth code review | security |
| `/studio` | UI design (50+ styles, 97 palettes) | frontend |
| `/api` | API development with OpenAPI docs | backend |
| `/mobile` | Mobile app development | mobile |
| `/game` | Game development | gamedev |
| `/chronicle` | Auto-documentation | docs |
| `/launch` | Zero-downtime deployment | devops |
| `/stage` | Dev sandbox & Docker Compose | devops |
| `/monitor` | Observability setup | — |
| `/optimize` | Performance optimization | perf |

---

## 🤝 Multi-Agent Coordination (21)

> **16 domain specialists + 5 meta-agents** working together like a FAANG engineering team.

### Meta-Agents (Runtime Control)

| Agent | Role |
|-------|------|
| `orchestrator` | Strategic coordination & execution order |
| `assessor` | Risk evaluation before risky operations |
| `recovery` | State management & checkpoint/restore |
| `critic` | Conflict resolution between agents |
| `learner` | Continuous improvement from outcomes |

### Domain Agents (16)

| Domain | Agent | Key Skills |
|--------|-------|------------|
| Frontend | `frontend` | react-pro, tailwind-kit, studio |
| Backend | `backend` | api-architect, nodejs-pro |
| Database | `database` | data-modeler |
| Security | `security` / `pentest` | security-scanner, offensive-sec |
| Testing | `testing` / `qa` | test-architect, e2e-automation |
| DevOps | `devops` | cicd-pipeline, server-ops |
| Mobile | `mobile` | mobile-developer, mobile-design |
| Debug | `debug` | debug-pro |
| Performance | `perf` | perf-optimizer |
| Planning | `planner` / `lead` | project-planner, idea-storm |
| Documentation | `docs` | doc-templates |
| SEO | `seo` | seo-optimizer |
| Game Dev | `gamedev` | game-development |
| Exploration | `explorer` | knowledge-graph |
| Legacy | `legacy` | migration patterns |
| Product | `product-lead` | requirements, UX |

---

## 🛡️ Safety Protocol (TIER -1)

> **Safety > Recoverability > Correctness > Cleanliness > Convenience**

| Rule | Description |
|------|-------------|
| 🚫 **No Delete** | Never delete files without explicit user confirmation |
| ✍️ **Safe Modify** | Read/Create/Modify allowed; Delete/Overwrite forbidden |
| 🗂️ **Git Versioning** | All risky changes get `git stash` or checkpoint commit |
| 🔁 **Rollback Guarantee** | Previous version always recoverable via Git |
| ⛔ **Human Checkpoint** | Core logic, auth, config, architecture require explicit approval |
| 🛠️ **Failure Recovery** | 6-level auto-recovery before escalating to user |

---

## 🧠 Self-Learning System

> AI learns from every mistake and **never repeats it**.

```
Error Detected → Root Cause Analysis → Lesson Extracted → lessons-learned.yaml
                                                                ↓
Future Prevention ← Pattern Matching ← Auto-Learned Patterns ←─┘
```

**Teach the AI from your feedback:**

```
User: "This is a bug — you created a new file instead of renaming"
  AI: 📚 Learned: [LEARN-003] - Use rename, don't create new simplified files
```

**View learned lessons:**

```bash
agent                       # Launch interactive dashboard
agent learn                 # Teach new patterns
agent recall                # Scan for violations
agent stats                 # View statistics
```

---

## 📦 Project Structure

```
your-project/
├── .agent/
│   ├── GEMINI.md                         # AI Rules (Supreme Law)
│   │
│   ├── skills/                           # 51 Skills
│   │   ├── react-pro/
│   │   ├── debug-pro/
│   │   ├── studio/
│   │   └── ...
│   │
│   ├── workflows/                        # 18 Workflows
│   │   ├── think.md
│   │   ├── build.md
│   │   ├── autopilot.md
│   │   └── ...
│   │
│   ├── agents/                           # 21 Specialist Agents
│   │   ├── frontend.md
│   │   ├── backend.md
│   │   ├── security.md
│   │   └── ...
│   │
│   └── config/                           # Configuration
│
├── kit.cmd / kit                         # CLI wrapper
└── agent.cmd / agent                     # AutoLearn wrapper (optional)
```

---

## 🗂️ CLI Reference

### `kit` (Always Installed)

```bash
kit list                    # List all installed skills
kit info <skill-name>       # Show skill details
kit validate                # Validate skill structure
kit doctor                  # Check system health
kit cache status            # View cache usage
```

### `agent` (Optional — AutoLearn Dashboard)

```bash
agent                       # Launch interactive dashboard
agent learn                 # Teach new patterns
agent recall                # Scan for violations
agent stats                 # View statistics
agent watch                 # Real-time monitoring
```

> **Note:** Not installing AutoLearn does **not** affect workflows, skills, or agents.

---

## 🔗 Links

| | |
|---|---|
| 📦 **npm** | [npmjs.com/package/pikakit](https://www.npmjs.com/package/pikakit) |
| 🐙 **GitHub (Skills)** | [github.com/pikakit/agent-skills](https://github.com/pikakit/agent-skills) |
| 🐙 **GitHub (CLI)** | [github.com/pikakit/pikakit](https://github.com/pikakit/pikakit) |
| 🐛 **Issues** | [github.com/pikakit/agent-skills/issues](https://github.com/pikakit/agent-skills/issues) |

---

## 📄 License

UNLICENSED — See [LICENSE](LICENSE) for details.

---

<div align="center">

**⚡ PikaKit v3.9.95**

*Composable Skills · Coordinated Agents · Intelligent Execution*

**[⭐ Star](https://github.com/pikakit/agent-skills) · [Install Now](#-quick-install) · Build Something Great**

</div>
