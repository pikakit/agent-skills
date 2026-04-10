<div align="center">

# 🤖 PikaKit

### Your AI writes code. PikaKit makes it *senior-level*.

[![npm](https://img.shields.io/badge/npm-v3.9.127-7c3aed?style=for-the-badge&logo=npm&logoColor=white&labelColor=18181b)](https://www.npmjs.com/package/pikakit)
[![Skills](https://img.shields.io/badge/51_skills-06b6d4?style=for-the-badge&labelColor=18181b)](https://github.com/pikakit/agent-skills)
[![Workflows](https://img.shields.io/badge/19_workflows-10b981?style=for-the-badge&labelColor=18181b)](https://github.com/pikakit/agent-skills)
[![TypeScript](https://img.shields.io/badge/strict_typescript-3178c6?style=for-the-badge&logo=typescript&logoColor=white&labelColor=18181b)](https://github.com/pikakit/agent-skills)

```bash
npx pikakit
```

[Website](https://pikakit.com) · [npm](https://www.npmjs.com/package/pikakit) · [Changelog](CHANGELOG.md)

</div>

---

## What is PikaKit?

PikaKit injects **51 engineering skills** into any AI coding assistant. One command installs battle-tested patterns for architecture, security, testing, performance, and more — so your AI delivers senior-level output from day one.

Works with **Antigravity, Claude Code, Cursor, Windsurf, Cline, Amp, Roo Code**, and 10+ other AI tools.

---

## Quick Start

```bash
npx pikakit
```

Choose **Project** (`.agent/` in your repo) or **Global** (`~/.gemini/`). Done.

---

## Skills

51 skills across 9 domains:

| Domain | Skills | Highlights |
|--------|--------|------------|
| **Architecture** | 5 | `project-planner` · `system-design` · `idea-storm` |
| **Frontend** | 5 | `react-pro` · `nextjs-pro` · `studio` · `tailwind-kit` |
| **Backend** | 5 | `api-architect` · `nodejs-pro` · `python-pro` · `data-modeler` |
| **Security** | 3 | `security-scanner` · `offensive-sec` · `code-constitution` |
| **Testing** | 5 | `test-architect` · `e2e-automation` · `code-review` |
| **Debugging** | 3 | `debug-pro` · `chrome-devtools` · `knowledge-graph` |
| **AI & Automation** | 8 | `google-adk-python` · `mcp-builder` · `auto-learner` · `knowledge-compiler` |
| **DevOps** | 7 | `cicd-pipeline` · `vercel-deploy` · `observability` · `gitops` |
| **Mobile & More** | 12 | `mobile-developer` · `game-development` · `typescript-expert` · `doc-templates` |

---

## Workflows

Type these in your AI chat:

| Command | Purpose |
|---------|---------|
| `/autopilot` | Plan → build → test → ship — fully autonomous |
| `/build` | Multi-skill implementation from description |
| `/think` | 3+ alternatives before writing code |
| `/plan` | Detailed task breakdown with dependencies |
| `/cook` | Skip planning, just implement |
| `/fix` | Patch errors with minimal diff |
| `/validate` | Generate & run test suite |
| `/diagnose` | Hypothesis-driven debugging |
| `/inspect` | 4-layer code review |
| `/studio` | Generate complete design systems |
| `/api` | Design & document REST/GraphQL APIs |
| `/mobile` | Cross-platform mobile apps |
| `/game` | Game development pipeline |
| `/launch` | Zero-downtime deployment |
| `/chronicle` | Auto-generate docs from code |
| `/stage` | Local dev sandbox with Docker |
| `/monitor` | Observability: metrics + traces + alerts |
| `/optimize` | Profile & fix performance bottlenecks |
| `/knowledge` | Compile fixes into a living knowledge wiki |

---

## Safety

| Protection | How |
|------------|-----|
| No accidental deletes | Explicit confirmation required |
| Git checkpoints | Auto-commit before risky changes |
| Instant rollback | One command to undo anything |
| Human gates | Auth, database, architecture need approval |
| 6-level recovery | Auto-fix → retry → restore → undo → rollback → human |

---

## Self-Learning → Knowledge Compiler

PikaKit doesn't just remember mistakes — it **compiles knowledge**:

```
   Error fix / User correction
          ↓
   📥 Raw signal recorded
          ↓
   📚 /knowledge compile
          ↓
   Cross-linked wiki article
          ↓
   Agent reads before coding → never repeats
```

**3-tier knowledge lifecycle:**

| Tier | Storage | Purpose |
|------|---------|---------|--------|
| **RAW** | `.agent/knowledge/raw/` | Error logs, corrections, decisions |
| **COMPILED** | `.agent/knowledge/concepts/` | Cross-linked wiki articles with backlinks |
| **SKILLS** | `.agent/skills/` | Mature knowledge → executable skill |

Run `/knowledge lint` for wiki health checks (staleness, orphans, gaps, dead links).

---

## Development

```bash
npm run typecheck          # tsc --noEmit (strict mode)
npm run verify             # Full verification suite
npm run version:sync       # Bump & sync version across all files
npm run checklist          # Development checklist
npm run audit:workflows    # FAANG compliance audit
```

**Requirements:** Node.js ≥18 · TypeScript strict · All scripts via `tsx`

---

## Links

| | |
|---|---|
| 🌐 Website | [pikakit.com](https://pikakit.com) |
| 📦 npm | [npmjs.com/package/pikakit](https://www.npmjs.com/package/pikakit) |
| 📋 Skills | [github.com/pikakit/agent-skills](https://github.com/pikakit/agent-skills) |
| 🔧 CLI | [github.com/pikakit/add-skill-kit](https://github.com/pikakit/add-skill-kit) |

---

<div align="center">

**PikaKit v3.9.127** · 51 skills · 19 Workflows · Strict TypeScript

```bash
npx pikakit
```

[⭐ Star](https://github.com/pikakit/agent-skills) · [Install Now](https://www.npmjs.com/package/pikakit) · [pikakit.com](https://pikakit.com)

</div>
