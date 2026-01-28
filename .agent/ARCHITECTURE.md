# Agent Skills Kit Architecture

> Comprehensive AI Agent Capability Expansion Toolkit

---

## 📋 Overview

Antigravity Kit is a modular system consisting of:

- **20 Specialist Agents** - Role-based AI personas
- **48 Skills** - Domain-specific knowledge modules
- **14 Workflows** - Slash command procedures

---

## 🏗️ Directory Structure

```plaintext
.agent/
├── ARCHITECTURE.md          # This file
├── agents/                  # 20 Specialist Agents
├── skills/                  # 48 Skills
├── studio/                  # Studio design system tools
├── workflows/               # 14 Slash Commands
├── rules/                   # Global Rules
└── scripts/                 # Master Validation Scripts
```

---

## 🔄 Hybrid Runtime Architecture

### 2-Tier Design

Agent Skills Kit uses a **hybrid architecture** combining JavaScript and Python:

```
┌──────────────────────────────────┐
│ TIER 1: Master Scripts (JS)      │
│ - Orchestration & workflow       │
│ - User-facing CLI commands       │
│ - Project management             │
└──────────────┬───────────────────┘
               │ child_process.spawn()
               ↓
┌──────────────────────────────────┐
│ TIER 2: Skill Scripts (Python)   │
│ - Specialized validation (34)    │
│ - Security scanning              │
│ - Performance auditing           │
│ - E2E testing automation         │
└──────────────────────────────────┘
```

### Runtime Requirements

- **Node.js 18+** - Required for all operations
- **Python 3.8+** - Required for skill validation scripts

See [PYTHON_STRATEGY.md](../PYTHON_STRATEGY.md) for architecture rationale.

---

## 🎨 Studio (Design System Generator)

**Location:** `.agent/studio/`

Studio provides AI-powered design system generation using BM25 search across curated design databases.

### Purpose

Generate high-quality UI/UX code by searching 24 CSV databases containing:

- 50+ design styles (Minimalism, Glassmorphism, Brutalism...)
- 95+ color palettes (SaaS, E-commerce, Fintech...)
- 60+ font pairings (Google Fonts combinations)
- 12 framework-specific guidelines (React, Vue, SwiftUI...)

### Components

| Component       | Purpose               | Files                                |
| --------------- | --------------------- | ------------------------------------ |
| **data/**       | Design knowledge base | 24 CSV files (241 KB)                |
| **scripts-js/** | BM25 search engine    | core.js, design_system.js, search.js |

### Usage

```bash
# Search design guidelines
npm run studio:search "minimalist dashboard"

# Generate design system
npm run studio:design

# Stack-specific search
node .agent/studio/scripts-js/search.js "layout" --stack nextjs
```

### Data Domains (11)

- **style** - Design styles (styles.csv)
- **color** - Color palettes (colors.csv)
- **typography** - Font pairings (typography.csv)
- **ux** - UX guidelines (ux-guidelines.csv)
- **icons** - Icon libraries (icons.csv)
- **chart** - Data visualization (charts.csv)
- **landing** - Landing patterns (landing.csv)
- **product** - Product-specific (products.csv)
- **prompt** - AI prompts (prompts.csv)
- **react** - React performance (react-performance.csv)
- **web** - Web interface (web-interface.csv)

### Supported Stacks (12)

Next.js, React, Vue, Nuxt, Svelte, SwiftUI, React Native, Flutter, HTML/Tailwind, shadcn/ui, Jetpack Compose, Nuxt UI

See [STUDIO_MIGRATION.md](../STUDIO_MIGRATION.md) for migration details.

---

## 🤖 Agents (20)

Specialist AI personas for different domains.

| Agent                    | Focus                      | Skills Used                                          |
| ------------------------ | -------------------------- | ---------------------------------------------------- |
| `orchestrator`           | Multi-agent coordination   | parallel-agents, behavioral-modes                    |
| `project-planner`        | Discovery, task planning   | brainstorming, plan-writing, architecture            |
| `frontend-specialist`    | Web UI/UX                  | frontend-design, react-patterns, tailwind-patterns   |
| `backend-specialist`     | API, business logic        | api-patterns, nodejs-best-practices, database-design |
| `database-architect`     | Schema, SQL                | database-design, prisma-expert                       |
| `mobile-developer`       | iOS, Android, RN           | mobile-design                                        |
| `game-developer`         | Game logic, mechanics      | game-development                                     |
| `devops-engineer`        | CI/CD, Docker              | deployment-procedures, docker-expert                 |
| `security-auditor`       | Security compliance        | vulnerability-scanner, red-team-tactics              |
| `penetration-tester`     | Offensive security         | red-team-tactics                                     |
| `test-engineer`          | Testing strategies         | testing-patterns, tdd-workflow, webapp-testing       |
| `debugger`               | Root cause analysis        | systematic-debugging                                 |
| `performance-optimizer`  | Speed, Web Vitals          | performance-profiling                                |
| `seo-specialist`         | Ranking, visibility        | seo-fundamentals, geo-fundamentals                   |
| `documentation-writer`   | Manuals, docs              | documentation-templates                              |
| `product-manager`        | Requirements, user stories | plan-writing, brainstorming                          |
| `product-owner`          | Strategy, backlog, MVP     | plan-writing, brainstorming                          |
| `qa-automation-engineer` | E2E testing, CI pipelines  | webapp-testing, testing-patterns                     |
| `code-archaeologist`     | Legacy code, refactoring   | clean-code, code-review-checklist                    |
| `explorer-agent`         | Codebase analysis          | -                                                    |

---

## 🧩 Skills (36)

Modular knowledge domains that agents can load on-demand. based on task context.

### Frontend & UI

| Skill            | Description                      |
| ---------------- | -------------------------------- |
| `ReactArchitect` | React hooks, state, performance  |
| `NextJSPro`      | App Router, Server Components    |
| `TailwindKit`    | Tailwind CSS v4 utilities        |
| `DesignSystem`   | UI/UX patterns, design systems   |
| `studio`         | 50 styles, 21 palettes, 50 fonts |

### Backend & API

| Skill           | Description                    |
| --------------- | ------------------------------ |
| `APIArchitect`  | REST, GraphQL, tRPC            |
| `nestjs-expert` | NestJS modules, DI, decorators |
| `NodeJSPro`     | Node.js async, modules         |
| `PythonPro`     | Python standards, FastAPI      |

### Database

| Skill           | Description                 |
| --------------- | --------------------------- |
| `DataModeler`   | Schema design, optimization |
| `prisma-expert` | Prisma ORM, migrations      |

### TypeScript/JavaScript

| Skill               | Description                         |
| ------------------- | ----------------------------------- |
| `typescript-expert` | Type-level programming, performance |

### Cloud & Infrastructure

| Skill           | Description               |
| --------------- | ------------------------- |
| `docker-expert` | Containerization, Compose |
| `CICDPipeline`  | CI/CD, deploy workflows   |
| `ServerOps`     | Infrastructure management |

### Testing & Quality

| Skill           | Description              |
| --------------- | ------------------------ |
| `TestArchitect` | Jest, Vitest, strategies |
| `E2EAutomation` | E2E, Playwright          |
| `TestDrivenDev` | Test-driven development  |
| `CodeReview`    | Code review standards    |
| `CodeQuality`   | Linting, validation      |

### Security

| Skill             | Description              |
| ----------------- | ------------------------ |
| `SecurityScanner` | Security auditing, OWASP |
| `OffensiveSec`    | Offensive security       |

### Architecture & Planning

| Skill            | Description                |
| ---------------- | -------------------------- |
| `AppScaffold`    | Full-stack app scaffolding |
| `SystemDesign`   | System design patterns     |
| `ProjectPlanner` | Task planning, breakdown   |
| `IdeaStorm`      | Socratic questioning       |

### Mobile

| Skill         | Description           |
| ------------- | --------------------- |
| `MobileFirst` | Mobile UI/UX patterns |

### Game Development

| Skill        | Description           |
| ------------ | --------------------- |
| `GameEngine` | Game logic, mechanics |

### SEO & Growth

| Skill          | Description                   |
| -------------- | ----------------------------- |
| `SEOOptimizer` | SEO, E-E-A-T, Core Web Vitals |
| `GeoSpatial`   | GenAI optimization            |

### Shell/CLI

| Skill         | Description               |
| ------------- | ------------------------- |
| `ShellScript` | Linux commands, scripting |
| `PowerShell`  | Windows PowerShell        |

### Other

| Skill              | Description               |
| ------------------ | ------------------------- |
| `CodeCraft`        | Coding standards (Global) |
| `AgentModes`       | Agent personas            |
| `MultiAgent`       | Multi-agent patterns      |
| `MCPServer`        | Model Context Protocol    |
| `DocTemplates`     | Doc formats               |
| `GlobalizationKit` | Internationalization      |
| `PerfOptimizer`    | Web Vitals, optimization  |
| `DebugPro`         | Troubleshooting           |

---

## 🔄 Workflows (14)

Slash command procedures. Invoke with `/command`.

| Command      | Description                 |
| ------------ | --------------------------- |
| `/think`     | Structured brainstorming    |
| `/build`     | Create new features/apps    |
| `/diagnose`  | Debug issues systematically |
| `/launch`    | Deploy to production        |
| `/chronicle` | Generate documentation      |
| `/boost`     | Improve existing code       |
| `/autopilot` | Multi-agent coordination    |
| `/architect` | Task breakdown & planning   |
| `/stage`     | Preview/staging server      |
| `/inspect`   | Code review verification    |
| `/forge`     | Create/package skills       |
| `/pulse`     | Check project status        |
| `/validate`  | Run tests                   |
| `/studio`    | Design with 50+ styles      |

---

## 🎯 Skill Loading Protocol

```plaintext
User Request → Skill Description Match → Load SKILL.md
                                            ↓
                                    Read references/
                                            ↓
                                    Read scripts/
```

### Skill Structure

```plaintext
skill-name/
├── SKILL.md           # (Required) Metadata & instructions
├── scripts/           # (Optional) Python/Bash scripts
├── references/        # (Optional) Templates, docs
└── assets/            # (Optional) Images, logos
```

### Enhanced Skills (with scripts/references)

| Skill               | Files | Coverage                            |
| ------------------- | ----- | ----------------------------------- |
| `typescript-expert` | 5     | Utility types, tsconfig, cheatsheet |
| `studio`            | 27    | 50 styles, 21 palettes, 50 fonts    |
| `AppScaffold`       | 20    | Full-stack scaffolding              |

---

## 📜 Scripts (Runtime - JavaScript)

**Location:** `.agent/scripts-js/`

Master validation scripts orchestrating skill-level validators (Python).

### Architecture (2-Tier Hybrid)

```mermaid
graph LR
    User[User] --> Master[Master Scripts<br/>JavaScript]
    Master --> Skills[Skill Scripts<br/>Python]
    Master --> Output[Validation Report]
    Skills --> Output
```

**Why Hybrid:**

- Master scripts: JavaScript (cross-platform, npm integration)
- Skill scripts: Python (34 scripts for specialized validation)
- See [PYTHON_STRATEGY.md](../PYTHON_STRATEGY.md)

### Master Scripts (4)

| Script               | Purpose                                 | When to Use              |
| -------------------- | --------------------------------------- | ------------------------ |
| `checklist.js`       | Priority-based validation (Core checks) | Development, pre-commit  |
| `verify_all.js`      | Comprehensive verification (All checks) | Pre-deployment, releases |
| `auto_preview.js`    | Dev server management                   | Local development        |
| `session_manager.js` | Multi-session coordination              | Complex workflows        |

### Usage

```bash
# Quick validation
npm run checklist
# OR: node .agent/scripts-js/checklist.js .

# Full verification before deploy
npm run verify http://localhost:3000
# OR: node .agent/scripts-js/verify_all.js . --url http://localhost:3000
```

### What They Check

**checklist.js** (Core checks):

- Security (vulnerabilities, secrets)
- Code Quality (lint, types)
- Schema Validation
- Test Suite
- UX Audit
- SEO Check

**verify_all.js** (Full suite):

- Everything in checklist.js PLUS:
- Lighthouse (Core Web Vitals)
- Playwright E2E
- Bundle Analysis
- Mobile Audit
- i18n Check

### Migration History

**v3.2.0 (January 2026):**

- ✅ Python → JavaScript master scripts
- ✅ 4 new JS scripts (checklist, verify_all, auto_preview, session_manager)
- ✅ Legacy Python archived to `scripts-legacy/`
- ✅ Python skill scripts retained (34 specialized validators)

See [MIGRATION.md](../MIGRATION.md) for details.

---

## 📊 Statistics

| Metric              | Value                         |
| ------------------- | ----------------------------- |
| **Total Agents**    | 20                            |
| **Total Skills**    | 48                            |
| **Total Workflows** | 14                            |
| **Total Scripts**   | 4 (master) + 18 (skill-level) |
| **Coverage**        | ~95% web/mobile development   |

---

## 🔗 Quick Reference

| Need     | Agent                 | Skills                                |
| -------- | --------------------- | ------------------------------------- |
| Web App  | `frontend-specialist` | react-patterns, nextjs-best-practices |
| API      | `backend-specialist`  | api-patterns, nodejs-best-practices   |
| Mobile   | `mobile-developer`    | mobile-design                         |
| Database | `database-architect`  | database-design, prisma-expert        |
| Security | `security-auditor`    | vulnerability-scanner                 |
| Testing  | `test-engineer`       | testing-patterns, webapp-testing      |
| Debug    | `debugger`            | systematic-debugging                  |
| Plan     | `project-planner`     | brainstorming, plan-writing           |

---

## 📅 Architecture Evolution

### v3.2.0 (January 2026)

**Major Changes:**

- **Python → JavaScript Migration:** Master scripts rewritten in JS
- **Hybrid Architecture:** 2-tier system (JS master + Python skills)
- **Studio Rename:** `.agent/.shared/studio` → `.agent/studio`

**Rationale:**

- Cross-platform compatibility (Windows, macOS, Linux)
- npm ecosystem integration
- Faster execution (Node.js async I/O)
- Maintain Python for specialized validators

**Files Affected:**

- Added: 4 JavaScript master scripts (~1,000 LOC)
- Added: 14 JavaScript Studio scripts (~1,400 LOC)
- Archived: 4 Python master scripts to `scripts-legacy/`
- Retained: 34 Python skill scripts

**Documentation:**

- [MIGRATION.md](../MIGRATION.md) - Migration guide
- [PYTHON_STRATEGY.md](../PYTHON_STRATEGY.md) - Hybrid rationale
- [STUDIO_MIGRATION.md](../STUDIO_MIGRATION.md) - Studio migration
- [CHANGELOG.md](../CHANGELOG.md) - Release notes

### v3.1.0 (December 2025)

**Changes:**

- Added SelfEvolution v4.0 (auto-learning system)
- Enhanced agent routing (SmartRouter skill)
- 49 skills total
