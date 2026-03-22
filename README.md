<div align="center">

# ⚡ PikaKit

### Your AI writes code. PikaKit makes it *senior-level*.

[![npm version](https://img.shields.io/badge/npm-v3.9.110-7c3aed?style=for-the-badge&logo=npm&logoColor=white&labelColor=18181b)](https://www.npmjs.com/package/pikakit)
[![Skills](https://img.shields.io/badge/51_skills-06b6d4?style=for-the-badge&labelColor=18181b)](https://github.com/pikakit/agent-skills)
[![Workflows](https://img.shields.io/badge/18_workflows-10b981?style=for-the-badge&labelColor=18181b)](https://github.com/pikakit/agent-skills)
[![Cross-Platform](https://img.shields.io/badge/15+_AI_tools-f59e0b?style=for-the-badge&labelColor=18181b)](https://github.com/pikakit/agent-skills)

*One command. 51 battle-tested skills. Every AI coding tool.*

[Install](#-install) · [Skills](#-skills-catalog) · [Workflows](#-workflows) · [How It Works](#-how-it-works) · [Website](https://pikakit.com)

</div>

---

## The Problem

AI coding assistants are powerful — but without guidance, they produce:

- 🎲 **Inconsistent patterns** — different approaches every session
- 🐛 **The same bugs twice** — no memory between conversations
- 🤷 **Junior-level decisions** — missing edge cases, security holes, performance traps
- ⏸️ **Constant interruptions** — "Should I continue?" after every file

## The Solution

PikaKit injects **51 engineering skills** directly into your AI's context. Your AI doesn't just write code — it follows the same patterns, reviews, and safety checks that senior engineers use at top tech companies.

```bash
npx pikakit
```

That's it. Your AI just got promoted.

---

## ✨ What Makes PikaKit Different

<table>
<tr>
<td width="33%" align="center">

### 🚀 Zero Interruptions
Approve the plan **once** → your AI executes every phase autonomously. No more "Should I proceed?" every 30 seconds.

</td>
<td width="33%" align="center">

### 🧠 Learns From Mistakes
Made a mistake? PikaKit **remembers** and prevents the same error forever. Your AI gets smarter the more you use it.

</td>
<td width="33%" align="center">

### 🌐 Works Everywhere
Antigravity, Claude Code, Cursor, Windsurf, Cline, Amp, Roo Code — **15+ AI tools** supported out of the box.

</td>
</tr>
</table>

| | PikaKit | Vanilla AI | Other Tools |
|---|:---:|:---:|:---:|
| Autonomous execution (zero interruptions) | ✅ | ❌ | ❌ |
| Self-learning from mistakes | ✅ | ❌ | ❌ |
| 51 domain skills (security, performance, patterns) | ✅ | ❌ | 3–5 |
| Cross-platform (15+ AI tools) | ✅ | 1 tool | 1–2 tools |
| Safety protocol with rollback guarantee | ✅ | ❌ | ❌ |
| 100% JavaScript (no Python, no dependencies hell) | ✅ | — | ❌ |

---

## 📦 Install

```bash
npx pikakit
```

Choose your scope:
- **Project** → `.agent/` in your repo (team-shared)
- **Global** → `~/.gemini/` (personal, all projects)

### What Gets Installed

```
your-project/
├── .agent/
│   ├── rules/                     # 🛡️ AI Behavior Rules
│   │   ├── GEMINI.md              #   The Supreme Law
│   │   ├── autopilot.md           #   Autonomous execution protocol
│   │   └── code-rules.md          #   Code & design standards
│   │
│   ├── skills/                    # 🧩 51 Engineering Skills
│   │   ├── react-pro/
│   │   │   ├── SKILL.md           #   Quick reference index
│   │   │   ├── AGENTS.md          #   Full knowledge for AI
│   │   │   └── rules/             #   Individual patterns & rules
│   │   ├── security-scanner/
│   │   ├── debug-pro/
│   │   └── ...
│   │
│   └── workflows/                 # ⚡ 18 Slash Commands
│       ├── build.md               #   /build → Full-stack factory
│       ├── autopilot.md           #   /autopilot → Autonomous mode
│       ├── studio.md              #   /studio → Design system generator
│       └── ...
```

---

## 🧩 Skills Catalog

### 🏗️ Architecture & Planning

| Skill | What It Does |
|---|---|
| `project-planner` | Breaks down tasks into dependency-ordered subtasks |
| `idea-storm` | Asks the right questions before writing a single line |
| `system-design` | Architecture decisions with trade-off analysis |
| `lifecycle-orchestrator` | Manages multi-phase execution with checkpoints |
| `context-engineering` | Keeps AI focused — prevents context window overflow |

### 🎨 Frontend & Design

| Skill | What It Does |
|---|---|
| `react-pro` | Modern React patterns — hooks, Suspense, TanStack Query |
| `nextjs-pro` | 60+ App Router rules — RSC, caching, streaming |
| `design-system` | Color theory, typography, spacing that *actually looks good* |
| `studio` | Generates design systems: 50+ styles, 97 palettes, 57 fonts |
| `tailwind-kit` | Tailwind v4 — container queries, CSS-first config |

### ⚙️ Backend & Data

| Skill | What It Does |
|---|---|
| `api-architect` | REST vs GraphQL vs tRPC — makes the right call |
| `nodejs-pro` | Hono/Fastify/Express/NestJS patterns & security |
| `python-pro` | FastAPI, Django, Flask with type hints & async |
| `data-modeler` | Schema design, indexing strategy, Prisma/Drizzle |
| `auth-patterns` | OAuth2, JWT, RBAC, MFA, Passkeys — production-ready |

### 🔐 Security

| Skill | What It Does |
|---|---|
| `security-scanner` | OWASP 2025 + supply chain attack prevention |
| `offensive-sec` | Red team tactics — finds vulns before hackers do |
| `code-constitution` | Constitutional governance — the Supreme Law of code quality |

### 🧪 Testing & Quality

| Skill | What It Does |
|---|---|
| `test-architect` | Unit → Integration → E2E strategy with AAA pattern |
| `e2e-automation` | Playwright tests with visual regression & deep audit |
| `code-craft` | Clean code enforcer: 20 lines/fn, 3 args max, no nesting hell |
| `code-review` | 4-layer review: build, tests, security, logic |
| `problem-checker` | Auto-fixes lint, imports, types before marking "done" |

### 🐛 Debugging

| Skill | What It Does |
|---|---|
| `debug-pro` | 4-phase methodology — never randomly guess again |
| `chrome-devtools` | Puppeteer CLI for screenshots, Core Web Vitals |
| `knowledge-graph` | AST-level code understanding: find-usages, impact analysis |

### 🤖 AI & Automation

| Skill | What It Does |
|---|---|
| `google-adk-python` | Build AI agents with Google's Agent Development Kit |
| `mcp-builder` | Create MCP servers for custom AI tool integrations |
| `mcp-management` | Discover & orchestrate tools across MCP servers |
| `auto-learner` | Extracts patterns from errors → prevents future mistakes |
| `smart-router` | Routes requests to the right skill automatically |
| `ai-artist` | Prompt engineering for image & text generation AI |

### ☁️ DevOps & Infrastructure

| Skill | What It Does |
|---|---|
| `cicd-pipeline` | Safe deployments with 5-phase rollback strategy |
| `gitops` | ArgoCD/Flux declarative Kubernetes deployments |
| `git-workflow` | Conventional commits + secret detection |
| `server-ops` | Process management, monitoring, scaling |
| `vercel-deploy` | Deploy with one command — returns live URL |
| `observability` | OpenTelemetry: logs + metrics + traces unified |
| `perf-optimizer` | Core Web Vitals, N+1 queries, bundle bloat |

### 📱 Mobile & Specialized

| Skill | What It Does |
|---|---|
| `mobile-developer` | React Native, Flutter, native iOS/Android |
| `mobile-design` | Touch psychology, platform conventions, offline-first |
| `game-development` | Game loops, physics, asset pipelines |
| `typescript-expert` | Type gymnastics, monorepo, tsconfig mastery |
| `shell-script` | Bash scripting patterns for automation |

### 📝 Documentation & Content

| Skill | What It Does |
|---|---|
| `doc-templates` | README, API docs, ADR, Mermaid diagrams |
| `copywriting` | AIDA, PAS — conversion copy that actually converts |
| `seo-optimizer` | E-E-A-T, Core Web Vitals, structured data |
| `media-processing` | FFmpeg, ImageMagick — video/audio/image pipelines |
| `agent-browser` | AI-native browser automation (93% less context) |

---

## ⚡ Workflows

Type these in your AI chat. They just work.

| Command | What Happens |
|---|---|
| `/think` | Generates 3+ alternative approaches before coding |
| `/plan` | Creates a detailed `PLAN.md` with tasks & dependencies |
| `/build` | Multi-skill implementation — design to deployment |
| `/autopilot` | Full autonomous execution: plan → build → test → ship |
| `/cook` | Skip planning — just implement from instructions |
| `/fix` | Diagnose and patch specific errors with minimal diff |
| `/validate` | Generate & run test suite with coverage report |
| `/diagnose` | Hypothesis-driven debugging with ranked probability |
| `/inspect` | 4-layer code review: build → tests → security → logic |
| `/studio` | Generate a complete design system from a single prompt |
| `/api` | Design, implement, and document REST/GraphQL APIs |
| `/mobile` | Build cross-platform mobile apps with native feel |
| `/game` | Game development with engine routing & asset pipeline |
| `/chronicle` | Auto-generate docs from source code analysis |
| `/launch` | Zero-downtime deployment with health checks |
| `/stage` | Spin up local dev sandbox with Docker Compose |
| `/monitor` | Set up observability: metrics, traces, alerts |
| `/optimize` | Profile bottlenecks and fix performance issues |

---

## 🛡️ Safety Built In

Your AI won't accidentally destroy your project. PikaKit enforces:

| Protection | How |
|---|---|
| **No accidental deletes** | Files are never deleted without your explicit "yes" |
| **Git checkpoints** | Risky changes get auto-committed before modification |
| **Instant rollback** | One command to undo any change |
| **Human gates** | Auth, database, and architecture changes require approval |
| **6-level recovery** | Auto-fix → retry → restore → undo → rollback → ask human |

---

## 🧠 It Learns

Every mistake makes PikaKit smarter:

```
You: "This is wrong — you should use rename, not create a new file"
 AI: 📚 Learned: [LEARN-003] Use rename instead of creating simplified copies

Next time → AI automatically applies the lesson
```

Lessons are saved in `lessons-learned.yaml` and checked before every action. Your AI gets better the more you use it.

---

## 🔗 Links

| | |
|---|---|
| 🌐 **Website** | [pikakit.com](https://pikakit.com) |
| 📦 **npm** | [npmjs.com/package/pikakit](https://www.npmjs.com/package/pikakit) |
| 🐙 **Skills Repo** | [github.com/pikakit/agent-skills](https://github.com/pikakit/agent-skills) |
| 🐙 **CLI Repo** | [github.com/pikakit/add-skill-kit](https://github.com/pikakit/add-skill-kit) |
| 📧 **Support** | [hello@pikakit.com](mailto:hello@pikakit.com) |

---

<div align="center">

**⚡ PikaKit v3.9.110**

*Your AI writes code. PikaKit makes it senior-level.*

```bash
npx pikakit
```

[⭐ Star](https://github.com/pikakit/agent-skills) · [Install Now](#-install) · [pikakit.com](https://pikakit.com)

</div>
