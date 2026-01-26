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
├── workflows/               # 14 Slash Commands
├── rules/                   # Global Rules
└── scripts/                 # Master Validation Scripts
```

---

## 🤖 Agents (20)

Specialist AI personas for different domains.

| Agent | Focus | Skills Used |
| ----- | ----- | ----------- |
| `orchestrator` | Multi-agent coordination | parallel-agents, behavioral-modes |
| `project-planner` | Discovery, task planning | brainstorming, plan-writing, architecture |
| `frontend-specialist` | Web UI/UX | frontend-design, react-patterns, tailwind-patterns |
| `backend-specialist` | API, business logic | api-patterns, nodejs-best-practices, database-design |
| `database-architect` | Schema, SQL | database-design, prisma-expert |
| `mobile-developer` | iOS, Android, RN | mobile-design |
| `game-developer` | Game logic, mechanics | game-development |
| `devops-engineer` | CI/CD, Docker | deployment-procedures, docker-expert |
| `security-auditor` | Security compliance | vulnerability-scanner, red-team-tactics |
| `penetration-tester` | Offensive security | red-team-tactics |
| `test-engineer` | Testing strategies | testing-patterns, tdd-workflow, webapp-testing |
| `debugger` | Root cause analysis | systematic-debugging |
| `performance-optimizer` | Speed, Web Vitals | performance-profiling |
| `seo-specialist` | Ranking, visibility | seo-fundamentals, geo-fundamentals |
| `documentation-writer` | Manuals, docs | documentation-templates |
| `product-manager` | Requirements, user stories | plan-writing, brainstorming |
| `product-owner` | Strategy, backlog, MVP | plan-writing, brainstorming |
| `qa-automation-engineer` | E2E testing, CI pipelines | webapp-testing, testing-patterns |
| `code-archaeologist` | Legacy code, refactoring | clean-code, code-review-checklist |
| `explorer-agent` | Codebase analysis | - |

---

## 🧩 Skills (36)

Modular knowledge domains that agents can load on-demand. based on task context.

### Frontend & UI

| Skill | Description |
| ----- | ----------- |
| `ReactArchitect` | React hooks, state, performance |
| `NextJSPro` | App Router, Server Components |
| `TailwindKit` | Tailwind CSS v4 utilities |
| `DesignSystem` | UI/UX patterns, design systems |
| `studio` | 50 styles, 21 palettes, 50 fonts |

### Backend & API

| Skill | Description |
| ----- | ----------- |
| `APIArchitect` | REST, GraphQL, tRPC |
| `nestjs-expert` | NestJS modules, DI, decorators |
| `NodeJSPro` | Node.js async, modules |
| `PythonPro` | Python standards, FastAPI |

### Database

| Skill | Description |
| ----- | ----------- |
| `DataModeler` | Schema design, optimization |
| `prisma-expert` | Prisma ORM, migrations |

### TypeScript/JavaScript

| Skill | Description |
| ----- | ----------- |
| `typescript-expert` | Type-level programming, performance |

### Cloud & Infrastructure

| Skill | Description |
| ----- | ----------- |
| `docker-expert` | Containerization, Compose |
| `CICDPipeline` | CI/CD, deploy workflows |
| `ServerOps` | Infrastructure management |

### Testing & Quality

| Skill | Description |
| ----- | ----------- |
| `TestArchitect` | Jest, Vitest, strategies |
| `E2EAutomation` | E2E, Playwright |
| `TestDrivenDev` | Test-driven development |
| `CodeReview` | Code review standards |
| `CodeQuality` | Linting, validation |

### Security

| Skill | Description |
| ----- | ----------- |
| `SecurityScanner` | Security auditing, OWASP |
| `OffensiveSec` | Offensive security |

### Architecture & Planning

| Skill | Description |
| ----- | ----------- |
| `AppScaffold` | Full-stack app scaffolding |
| `SystemDesign` | System design patterns |
| `ProjectPlanner` | Task planning, breakdown |
| `IdeaStorm` | Socratic questioning |

### Mobile

| Skill | Description |
| ----- | ----------- |
| `MobileFirst` | Mobile UI/UX patterns |

### Game Development

| Skill | Description |
| ----- | ----------- |
| `GameEngine` | Game logic, mechanics |

### SEO & Growth

| Skill | Description |
| ----- | ----------- |
| `SEOOptimizer` | SEO, E-E-A-T, Core Web Vitals |
| `GeoSpatial` | GenAI optimization |

### Shell/CLI

| Skill | Description |
| ----- | ----------- |
| `ShellScript` | Linux commands, scripting |
| `PowerShell` | Windows PowerShell |

### Other

| Skill | Description |
| ----- | ----------- |
| `CodeCraft` | Coding standards (Global) |
| `AgentModes` | Agent personas |
| `MultiAgent` | Multi-agent patterns |
| `MCPServer` | Model Context Protocol |
| `DocTemplates` | Doc formats |
| `GlobalizationKit` | Internationalization |
| `PerfOptimizer` | Web Vitals, optimization |
| `DebugPro` | Troubleshooting |

---

## 🔄 Workflows (14)

Slash command procedures. Invoke with `/command`.

| Command | Description |
| ------- | ----------- |
| `/think` | Structured brainstorming |
| `/build` | Create new features/apps |
| `/diagnose` | Debug issues systematically |
| `/launch` | Deploy to production |
| `/chronicle` | Generate documentation |
| `/boost` | Improve existing code |
| `/autopilot` | Multi-agent coordination |
| `/architect` | Task breakdown & planning |
| `/stage` | Preview/staging server |
| `/inspect` | Code review verification |
| `/forge` | Create/package skills |
| `/pulse` | Check project status |
| `/validate` | Run tests |
| `/studio` | Design with 50+ styles |

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

| Skill | Files | Coverage |
| ----- | ----- | -------- |
| `typescript-expert` | 5 | Utility types, tsconfig, cheatsheet |
| `studio` | 27 | 50 styles, 21 palettes, 50 fonts |
| `AppScaffold` | 20 | Full-stack scaffolding |

---

## 📜 Scripts (2)

Master validation scripts that orchestrate skill-level scripts.

### Master Scripts

| Script | Purpose | When to Use |
| ------ | ------- | ----------- |
| `checklist.py` | Priority-based validation (Core checks) | Development, pre-commit |
| `verify_all.py` | Comprehensive verification (All checks) | Pre-deployment, releases |

### Usage

```bash
# Quick validation during development
python .agent/scripts/checklist.py .

# Full verification before deployment
python .agent/scripts/verify_all.py . --url http://localhost:3000
```

### What They Check

**checklist.py** (Core checks):

- Security (vulnerabilities, secrets)
- Code Quality (lint, types)
- Schema Validation
- Test Suite
- UX Audit
- SEO Check

**verify_all.py** (Full suite):

- Everything in checklist.py PLUS:
- Lighthouse (Core Web Vitals)
- Playwright E2E
- Bundle Analysis
- Mobile Audit
- i18n Check

For details, see [scripts/README.md](scripts/README.md)

---

## 📊 Statistics

| Metric | Value |
| ------ | ----- |
| **Total Agents** | 20 |
| **Total Skills** | 48 |
| **Total Workflows** | 14 |
| **Total Scripts** | 4 (master) + 18 (skill-level) |
| **Coverage** | ~95% web/mobile development |

---

## 🔗 Quick Reference

| Need | Agent | Skills |
| ---- | ----- | ------ |
| Web App | `frontend-specialist` | react-patterns, nextjs-best-practices |
| API | `backend-specialist` | api-patterns, nodejs-best-practices |
| Mobile | `mobile-developer` | mobile-design |
| Database | `database-architect` | database-design, prisma-expert |
| Security | `security-auditor` | vulnerability-scanner |
| Testing | `test-engineer` | testing-patterns, webapp-testing |
| Debug | `debugger` | systematic-debugging |
| Plan | `project-planner` | brainstorming, plan-writing |
