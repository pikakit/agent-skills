<div align="center">

# ⚡ PikaKit

### Transform your AI Agent into a FAANG-level engineering team

[![npm version](https://img.shields.io/badge/npm-v3.9.105-7c3aed?style=for-the-badge&logo=npm&logoColor=white&labelColor=18181b)](https://www.npmjs.com/package/pikakit)
[![Skills](https://img.shields.io/badge/skills-51-06b6d4?style=for-the-badge&labelColor=18181b)](https://github.com/pikakit/agent-skills)
[![Workflows](https://img.shields.io/badge/workflows-18-10b981?style=for-the-badge&labelColor=18181b)](https://github.com/pikakit/agent-skills)
[![JavaScript](https://img.shields.io/badge/100%25-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black&labelColor=18181b)](https://github.com/pikakit/agent-skills)

**Composable Skills · Intelligent Workflows · Cross-Platform**

[Install](#-quick-install) · [Skills](#-skills-catalog-51) · [Workflows](#-workflows-18) · [Design Guide](docs/SKILL_DESIGN_GUIDE.md) · [Website](https://pikakit.com)

</div>

---

## 🚀 Quick Install

```bash
npx pikakit
```

> One command installs **51 skills** and **18 workflows** into your AI project. Works with Antigravity, Claude Code, Cursor, Windsurf, and 15+ AI tools.

### What You Get

| Component          | Count | Highlights                                                              |
|--------------------|:-----:|-------------------------------------------------------------------------|
| 🧩 **Skills**      | 51    | Architecture, Frontend, Backend, Security, DevOps, AI, Mobile, Testing  |
| ⚡ **Workflows**   | 18    | `/think` · `/build` · `/autopilot` · `/studio` · `/validate` and more  |
| 📜 **Rules**       | 3     | `GEMINI.md` · `autopilot.md` · `code-rules.md`                         |

### Skill Structure (Vercel-compatible)

Each skill follows the [SKILL_DESIGN_GUIDE](docs/SKILL_DESIGN_GUIDE.md):

```
skill-name/
├── SKILL.md           ← Index for AI discovery (frontmatter + rule catalog)
├── AGENTS.md          ← Compiled full doc for AI consumption (cross-platform)
└── rules/             ← Individual rule files with YAML frontmatter
    ├── _template.md   ← Template for creating new rules
    └── {prefix}-{name}.md
```

---

## 🎯 Why PikaKit

<table>
<tr>
<td width="33%" align="center">

### ⚙️ Auto-Accept
Approve plan **once** → agent runs to completion with **zero interruptions**

</td>
<td width="33%" align="center">

### 🧠 Self-Learning
AI **remembers mistakes** from `lessons-learned.yaml` and never repeats them

</td>
<td width="33%" align="center">

### 🔧 Custom Skills
Create **project-specific skills** that teach AI your conventions

</td>
</tr>
</table>

| Feature                        | PikaKit           | Generic AI    | Other Tools   |
|--------------------------------|:-----------------:|:-------------:|:-------------:|
| ⚡ Auto-Accept Workflow        | ✅                | ❌            | ❌            |
| 🌐 Cross-Platform (15+ tools) | ✅                | ❌            | ❌            |
| 🧠 Self-Learning Memory       | ✅                | ❌            | ❌            |
| 💛 100% JavaScript             | ✅                | Mixed         | Python        |
| 🛡️ Safety Protocol            | TIER -1           | ❌            | ❌            |
| 📉 Token Efficiency            | Modular loading   | Baseline      | Varies        |

---

## ⚡ Quick Start

### 1. Install

```bash
npx pikakit
```

Choose **Project** (`.agent/`) or **Global** (`~/.gemini/`) scope.

### 2. Run Workflows

```
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

| Skill                       | Description                                     |
|-----------------------------|-------------------------------------------------|
| `project-planner`           | Task planning with dependency graph              |
| `idea-storm`                | Socratic questioning & brainstorming             |
| `lifecycle-orchestrator`    | End-to-end task lifecycle management             |
| `system-design`             | Architecture decisions & ADR                     |
| `context-engineering`       | Token optimization & agent architecture          |

### 🎨 Frontend & Design

| Skill                       | Description                                     |
|-----------------------------|-------------------------------------------------|
| `react-pro`                 | Modern React patterns, hooks, state management   |
| `nextjs-pro`                | App Router, RSC, 60+ optimization rules          |
| `design-system`             | Color theory, typography, UX psychology           |
| `studio`                    | 50+ styles, 97 palettes, 57 font pairings        |
| `tailwind-kit`              | Tailwind CSS v4 patterns                         |

### ⚙️ Backend & API

| Skill                       | Description                                     |
|-----------------------------|-------------------------------------------------|
| `api-architect`             | REST, GraphQL, tRPC design                       |
| `nodejs-pro`                | Hono/Fastify/Express/NestJS patterns             |
| `python-pro`                | FastAPI, Django, Flask                           |
| `data-modeler`              | Schema design, Prisma/Drizzle                    |
| `auth-patterns`             | OAuth2, JWT, RBAC/ABAC, MFA, Passkeys            |

### 🔐 Security

| Skill                       | Description                                     |
|-----------------------------|-------------------------------------------------|
| `security-scanner`          | OWASP 2025, supply chain security                |
| `offensive-sec`             | Red team tactics, MITRE ATT&CK                  |
| `code-constitution`         | Constitutional governance (Supreme Law)          |

### 🧪 Testing & Quality

| Skill                       | Description                                     |
|-----------------------------|-------------------------------------------------|
| `test-architect`            | Unit, integration, E2E strategies                |
| `e2e-automation`            | Playwright, visual testing, deep audit           |
| `code-craft`                | Clean code, SRP, DRY, KISS                       |
| `code-review`               | Linting, static analysis, PR review              |
| `problem-checker`           | IDE problem detection & auto-fix                 |

### 🐛 Debugging

| Skill                       | Description                                     |
|-----------------------------|-------------------------------------------------|
| `debug-pro`                 | 4-phase methodology + defense-in-depth           |
| `chrome-devtools`           | Puppeteer CLI, screenshots, Core Web Vitals      |
| `knowledge-graph`           | AST parsing, find-usages, impact analysis        |

### 🤖 AI & Agents

| Skill                       | Description                                     |
|-----------------------------|-------------------------------------------------|
| `google-adk-python`         | Google Agent Development Kit                     |
| `auto-learned`              | Hierarchical auto-learned patterns               |
| `auto-learner`              | Pattern extraction from errors                   |
| `execution-reporter`        | Agent routing transparency                       |
| `smart-router`              | Intelligent skill routing                        |
| `mcp-builder`               | Build MCP servers for AI agents                  |
| `mcp-management`            | Discover & execute MCP tools                     |
| `ai-artist`                 | Prompt engineering for LLM & image AI            |

### ☁️ DevOps & Infrastructure

| Skill                       | Description                                     |
|-----------------------------|-------------------------------------------------|
| `cicd-pipeline`             | Safe deployments, rollback strategies            |
| `gitops`                    | ArgoCD/Flux GitOps workflows                     |
| `git-workflow`              | Conventional commits, secret detection           |
| `server-ops`                | Process management, scaling                      |
| `vercel-deploy`             | 1-click Vercel deployment                        |
| `observability`             | OpenTelemetry, unified logs/metrics/traces       |
| `perf-optimizer`            | Core Web Vitals, bundle analysis                 |

### 📱 Mobile & Specialized

| Skill                       | Description                                     |
|-----------------------------|-------------------------------------------------|
| `mobile-developer`          | React Native, Flutter, native                    |
| `mobile-design`             | Mobile-first UI/UX patterns                      |
| `game-development`          | Game logic & mechanics                           |
| `typescript-expert`         | Type-level programming, monorepo                 |
| `shell-script`              | Bash/Linux terminal patterns                     |

### 📝 Documentation & Content

| Skill                       | Description                                     |
|-----------------------------|-------------------------------------------------|
| `doc-templates`             | README, API docs, ADR templates                  |
| `copywriting`               | AIDA, PAS, conversion formulas                   |
| `seo-optimizer`             | SEO, E-E-A-T, Core Web Vitals                    |
| `media-processing`          | FFmpeg, ImageMagick, RMBG                        |
| `agent-browser`             | AI-optimized browser automation                  |

---

## 📜 Workflows (18)

| Command        | Purpose                                |
|----------------|----------------------------------------|
| `/think`       | Brainstorm 3+ approaches               |
| `/plan`        | Generate detailed `PLAN.md`            |
| `/build`       | Full-stack implementation              |
| `/autopilot`   | Multi-agent autonomous execution       |
| `/cook`        | Direct implementation from instructions |
| `/fix`         | Quick error remediation                |
| `/validate`    | Test suite with coverage               |
| `/diagnose`    | Root cause debugging                   |
| `/inspect`     | Defense-in-depth code review           |
| `/studio`      | UI design (50+ styles, 97 palettes)    |
| `/api`         | API development with OpenAPI docs      |
| `/mobile`      | Mobile app development                 |
| `/game`        | Game development                       |
| `/chronicle`   | Auto-documentation                     |
| `/launch`      | Zero-downtime deployment               |
| `/stage`       | Dev sandbox & Docker Compose           |
| `/monitor`     | Observability setup                    |
| `/optimize`    | Performance optimization               |

---

## 🛡️ Safety Protocol (TIER -1)

> **Safety > Recoverability > Correctness > Cleanliness > Convenience**

| Rule                            | Description                                          |
|---------------------------------|------------------------------------------------------|
| 🚫 **No Delete**                | Never delete files without explicit user confirmation |
| ✍️ **Safe Modify**              | Read/Create/Modify allowed; Delete/Overwrite forbidden |
| 🗂️ **Git Versioning**          | All risky changes get `git stash` or checkpoint commit |
| 🔁 **Rollback Guarantee**       | Previous version always recoverable via Git          |
| ⛔ **Human Checkpoint**         | Core logic, auth, config require explicit approval    |
| 🛠️ **Failure Recovery**        | 6-level auto-recovery before escalating to user       |

---

## 🧠 Self-Learning System

> AI learns from every mistake and **never repeats it**.

```
Error Detected → Root Cause Analysis → Lesson Extracted → lessons-learned.yaml
                                                                ↓
Future Prevention ← Pattern Matching ← Auto-Learned Patterns ←─┘
```

---

## 📦 Project Structure

```
your-project/
├── .agent/
│   ├── rules/                           # AI Behavior Rules
│   │   ├── GEMINI.md                    #   Supreme Law
│   │   ├── autopilot.md                 #   Autonomous execution
│   │   └── code-rules.md               #   Code & design standards
│   │
│   ├── skills/                          # 51 Skills
│   │   ├── react-pro/
│   │   │   ├── SKILL.md                 #   Index
│   │   │   ├── AGENTS.md               #   Full compiled doc
│   │   │   └── rules/                   #   Individual rules
│   │   ├── nodejs-pro/
│   │   └── ...
│   │
│   └── workflows/                       # 18 Workflows
│       ├── think.md
│       ├── build.md
│       ├── autopilot.md
│       └── ...
```

---

## 🔗 Links

| Resource                    | URL                                                                                      |
|-----------------------------|------------------------------------------------------------------------------------------|
| 🌐 **Website**              | [pikakit.com](https://pikakit.com)                                                       |
| 📧 **Support**              | [hello@pikakit.com](mailto:hello@pikakit.com)                                            |
| 📦 **npm**                  | [npmjs.com/package/pikakit](https://www.npmjs.com/package/pikakit)                       |
| 🐙 **GitHub (Skills)**      | [github.com/pikakit/agent-skills](https://github.com/pikakit/agent-skills)               |
| 🐙 **GitHub (CLI)**         | [github.com/pikakit/add-skill-kit](https://github.com/pikakit/add-skill-kit)             |
| 🐛 **Issues**               | [github.com/pikakit/agent-skills/issues](https://github.com/pikakit/agent-skills/issues) |

---

## 📄 License

Proprietary — See [LICENSE](LICENSE) for details.

© 2026 PikaKit. All Rights Reserved.

---

<div align="center">

**⚡ PikaKit v3.9.105**

*Composable Skills · Intelligent Workflows · Cross-Platform*

[pikakit.com](https://pikakit.com) · [hello@pikakit.com](mailto:hello@pikakit.com)

**[⭐ Star](https://github.com/pikakit/agent-skills) · [Install Now](#-quick-install) · Build Something Great**

</div>
