---
name: app-scaffold
description: >-
  Main application building orchestrator. Creates full-stack applications from natural language.
  Determines project type, selects tech stack, coordinates agents for implementation.
  6-phase pipeline: Detect → Select → Scaffold → Install → Coordinate → Validate.
  Triggers on: build app, create project, new application, scaffold, full-stack.
  Coordinates with: project-planner, code-craft, test-architect, design-system.
metadata:
  version: "2.0.0"
  category: "architecture"
  triggers: "build app, create project, new application, scaffold, full-stack"
  success_metrics: "project builds with exit code 0, npm run dev works, zero partial scaffolds"
  coordinates_with: "project-planner, code-craft, test-architect, design-system"
---

# App Scaffold — Application Building Orchestrator

> Detect project type → select tech stack → scaffold → coordinate agents → validate build. One pipeline.

---

## Prerequisites

**Required (per template):**
- Node.js 18+ (web/desktop/CLI templates)
- Python 3.11+ (FastAPI template)
- Flutter SDK (Flutter template)
- Expo CLI (React Native template)

---

## When to Use

| Situation | Approach |
|-----------|----------|
| New full-stack web app | Auto-detect or use `nextjs-fullstack` template |
| New SaaS product | Use `nextjs-saas` template |
| New mobile app | Use `react-native-app` or `flutter-app` template |
| New CLI tool | Use `cli-tool` template |
| New API-only backend | Use `express-api` or `python-fastapi` template |
| New monorepo | Use `monorepo-turborepo` template |
| New blog / docs site | Use `astro-static` template |
| Add features to existing project | Read `feature-building.md` instead |

**Selective Reading Rule:** Read ONLY the reference file or template matching the current request.

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Project type detection from description | Feature implementation beyond boilerplate |
| Tech stack selection via decision tree | Database provisioning (→ data-modeler) |
| Template-based file scaffolding | UI design decisions (→ design-system) |
| Multi-agent coordination | Deployment (→ cicd-pipeline) |
| Build validation (exit code check) | Runtime testing (→ test-architect) |

**Side effects:** Creates directories/files in `project_path`. Runs package install commands. Agents write files within `project_path`. Rollback deletes `project_path` on failure.

---

## Execution Model — 6-Phase Pipeline

| Phase | Action | Side Effects | On Failure |
|-------|--------|-------------|------------|
| **Detect** | Parse description, match project type | None | Return error |
| **Select** | Choose template from decision tree | None | Return error |
| **Scaffold** | Create directories, write template files | File creation | Rollback: delete path |
| **Install** | Run package manager | Network, disk | Rollback: delete path |
| **Coordinate** | Invoke domain agents in order | Agent file writes | Rollback: delete path |
| **Validate** | Run build command, check exit code 0 | Build artifacts | Preserve files for debug |

Pipeline is sequential. Each phase completes before the next begins. Rollback = delete entire `project_path`.

---

## Templates (13)

Read the matching template ONLY:

| Template | Tech Stack | When to Use |
|----------|-----------|-------------|
| [nextjs-fullstack](templates/nextjs-fullstack/TEMPLATE.md) | Next.js + Prisma | Full-stack web app |
| [nextjs-saas](templates/nextjs-saas/TEMPLATE.md) | Next.js + Stripe | SaaS product |
| [nextjs-static](templates/nextjs-static/TEMPLATE.md) | Next.js + Framer | Landing page |
| [nuxt-app](templates/nuxt-app/TEMPLATE.md) | Nuxt 3 + Pinia | Vue full-stack app |
| [express-api](templates/express-api/TEMPLATE.md) | Express + JWT | REST API |
| [python-fastapi](templates/python-fastapi/TEMPLATE.md) | FastAPI | Python API |
| [react-native-app](templates/react-native-app/TEMPLATE.md) | Expo + Zustand | Mobile app |
| [flutter-app](templates/flutter-app/TEMPLATE.md) | Flutter + Riverpod | Cross-platform mobile |
| [electron-desktop](templates/electron-desktop/TEMPLATE.md) | Electron + React | Desktop app |
| [chrome-extension](templates/chrome-extension/TEMPLATE.md) | Chrome MV3 | Browser extension |
| [cli-tool](templates/cli-tool/TEMPLATE.md) | Node.js + Commander | CLI app |
| [monorepo-turborepo](templates/monorepo-turborepo/TEMPLATE.md) | Turborepo + pnpm | Monorepo |
| [astro-static](templates/astro-static/TEMPLATE.md) | Astro + MDX | Blog / Docs site |

---

## Error Taxonomy

| Code | Phase | Recoverable | Trigger |
|------|-------|-------------|---------|
| `ERR_UNKNOWN_TYPE` | Detect | No | Project type unrecognizable from description |
| `ERR_NO_TEMPLATE` | Select | No | No template matches type + constraints |
| `ERR_PATH_EXISTS` | Scaffold | No | `project_path` already exists and is non-empty |
| `ERR_INVALID_PATH` | Scaffold | No | Path malformed or outside allowed directories |
| `ERR_WRITE_FAILED` | Scaffold | Yes | File/directory creation failed |
| `ERR_INSTALL_FAILED` | Install | Yes | Package manager exited non-zero after 1 retry |
| `ERR_AGENT_FAILED` | Coordinate | Yes | Sub-agent returned error |
| `ERR_BUILD_FAILED` | Validate | Yes | Build command exited non-zero |
| `ERR_DISK_FULL` | Any | No | Insufficient disk space |
| `ERR_PERMISSION_DENIED` | Scaffold | No | No write permission to path |
| `ERR_CONSTRAINT_CONFLICT` | Select | Yes | Constraints conflict with detected type |

**Retry:** 1 retry for package install (with cache clear). Zero retries for all other phases.

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [project-detection.md](project-detection.md) | Keyword matrix for project type detection | Starting a new project |
| [tech-stack.md](tech-stack.md) | Default stack selection, alternatives | Choosing technologies |
| [agent-coordination.md](agent-coordination.md) | Agent pipeline, execution order | Multi-agent orchestration |
| [scaffolding.md](scaffolding.md) | Directory structure, core files | Creating project structure |
| [feature-building.md](feature-building.md) | Feature analysis, error handling | Adding to existing project |
| [templates/](templates/) | 13 project templates | Scaffolding specific project type |
| [engineering-spec.md](references/engineering-spec.md) | Full engineering spec: contracts, security, scalability | Architecture review |

---

## Coordinated Agents

| Agent | Role | Phase |
|-------|------|-------|
| `project-planner` | Task breakdown, dependency graph | Pre-scaffold planning |
| `frontend-specialist` | UI components, pages | Coordinate phase |
| `backend-specialist` | API, business logic | Coordinate phase |
| `database-architect` | Schema, migrations | Coordinate phase |
| `devops-engineer` | Deployment config | Post-validate (optional) |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `project-planner` | Skill | Task breakdown before scaffolding |
| `code-craft` | Skill | Code quality standards |
| `test-architect` | Skill | Test strategy for scaffolded projects |
| `design-system` | Skill | UI design patterns |
| `/build` | Workflow | Full build orchestration workflow |

---

⚡ PikaKit v3.9.85
