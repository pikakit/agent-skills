# PikaKit Skill Index

> **Quick reference for skill routing.** Scan this BEFORE any code task.
> Total: 53 skills across 9 domains.

---

## ⚡ Quick Match (Ctrl+F)

```
react jsx hooks component  →  react-pro       next ssr rsc app-router  →  nextjs-pro
node express fastify hono   →  nodejs-pro      python fastapi django    →  python-pro
typescript generics ts      →  typescript-expert  tailwind utility-class →  tailwind-kit
color font typography ux    →  design-system   sql prisma drizzle schema →  data-modeler
rest graphql trpc openapi   →  api-architect   oauth jwt auth session   →  auth-patterns
test jest vitest coverage   →  test-architect  playwright e2e browser   →  e2e-automation
debug error trace bug       →  debug-pro       owasp xss csrf security  →  security-scanner
deploy ci cd pipeline       →  cicd-pipeline   git commit branch pr     →  git-workflow
mobile flutter ios android  →  mobile-developer  game physics sprite    →  game-development
server pm2 nginx systemd    →  server-ops      lighthouse bundle perf   →  perf-optimizer
seo meta-tag sitemap        →  seo-optimizer   readme changelog docs    →  doc-templates
architecture trade-off adr  →  system-design   plan roadmap breakdown   →  project-planner
mcp tool-server             →  mcp-builder     prompt dall-e midjourney →  ai-artist
mistake wrong fix-this      →  auto-learner    ide-error lint complete  →  problem-checker
compile wiki knowledge ingest →  knowledge-compiler  knowledge health stale  →  knowledge-linter
```

---


## Frontend

| Skill | Use When | NOT For |
|-------|----------|---------|
| `react-pro` | React components, hooks, state management, .tsx/.jsx files | Next.js routing → `nextjs-pro` |
| `nextjs-pro` | Next.js App Router, SSR, RSC, server actions | Plain React SPA → `react-pro` |
| `tailwind-kit` | Tailwind CSS v4 styling, utility classes | Vanilla CSS, design decisions → `design-system` |
| `design-system` | Color theory, typography, UX psychology, visual design | Code implementation → use domain skill |
| `studio` | Design intelligence, color palettes, font pairings, anti-AI-slop | Code implementation |

## Backend

| Skill | Use When | NOT For |
|-------|----------|---------|
| `nodejs-pro` | Node.js, Express, Fastify, Hono, backend server | Frontend → `react-pro` |
| `python-pro` | Python, FastAPI, Django, Flask, type hints | Node.js → `nodejs-pro` |
| `api-architect` | REST/GraphQL/tRPC design, versioning, pagination | Code implementation |
| `data-modeler` | DB schema, Prisma, Drizzle, SQL, migrations, indexing | API routing → `api-architect` |
| `auth-patterns` | OAuth2, JWT, RBAC, MFA, Passkeys, session management | General security → `security-scanner` |

## Mobile

| Skill | Use When | NOT For |
|-------|----------|---------|
| `mobile-developer` | React Native, Flutter, iOS/Android, cross-platform | Web frontend → `react-pro` |
| `mobile-design` | Mobile UI/UX, touch targets, platform conventions | Web design → `design-system` |

## DevOps & Deployment

| Skill | Use When | NOT For |
|-------|----------|---------|
| `cicd-pipeline` | Deployment workflows, CI/CD, rollback strategies | Git operations → `git-workflow` |
| `git-workflow` | Git commits, branches, PRs, conventional commits | Deployment → `cicd-pipeline` |
| `gitops` | ArgoCD, Flux, Kubernetes declarative deployments | Simple deploys → `vercel-deploy` |
| `server-ops` | Process management, monitoring, scaling decisions | Code debugging → `debug-pro` |
| `vercel-deploy` | Deploy to Vercel, preview URLs, production releases | Other platforms → `cicd-pipeline` |
| `shell-script` | Bash/Linux commands, piping, error handling, scripting | Windows PowerShell |

## Testing & Quality

| Skill | Use When | NOT For |
|-------|----------|---------|
| `test-architect` | Unit/integration/E2E testing patterns, coverage | Running tests → `e2e-automation` |
| `e2e-automation` | Playwright, browser testing, visual regression | Test design → `test-architect` |
| `agent-browser` | AI-optimized browser automation, @ref element handles | Manual testing |
| `chrome-devtools` | Puppeteer, screenshots, Core Web Vitals measurement | E2E tests → `e2e-automation` |
| `code-review` | PR review, code audit, 5-category review | Quick fixes → `debug-pro` |

## Security

| Skill | Use When | NOT For |
|-------|----------|---------|
| `security-scanner` | OWASP 2025, vulnerability analysis, supply chain security | Auth flows → `auth-patterns` |
| `offensive-sec` | Red team, pentest, MITRE ATT&CK, detection evasion | Defensive security → `security-scanner` |
| `code-constitution` | Governance, doctrine checks, breaking change review | General code review → `code-review` |

## Core (Always Applicable)

| Skill | Use When | NOT For |
|-------|----------|---------|
| `code-craft` | Clean code standards, naming, SRP, DRY, KISS | Architecture decisions → `system-design` |
| `debug-pro` | Bug fix, error tracing, root cause analysis | New feature design |
| `problem-checker` | IDE errors, lint auto-fix, before task completion | Root cause analysis → `debug-pro` |
| `auto-learner` | User says "mistake"/"wrong"/"fix this", pattern extraction | Regular debugging → `debug-pro` |
| `auto-learned` | Check known patterns before repeating mistakes | Writing patterns → `auto-learner` |
| `knowledge-compiler` | Compile signals into knowledge wiki, ingest lessons | Pattern matching → `auto-learned` |
| `knowledge-linter` | Wiki health checks, find stale/inconsistent knowledge | Compiling → `knowledge-compiler` |
| `typescript-expert` | TypeScript types, generics, monorepo, build performance | React-specific → `react-pro` |

## Meta & Orchestration

| Skill | Use When | NOT For |
|-------|----------|---------|
| `smart-router` | Request classification, agent selection, multi-domain | Task execution |
| `lifecycle-orchestrator` | Multi-phase task coordination, checkpoint/restore | Simple tasks |
| `execution-reporter` | Task start/end notifications, audit trail | Task execution |
| `context-engineering` | Token optimization, context budget, agent architecture | Code writing |
| `idea-storm` | Complex requirements, Socratic questioning, clarification | Clear requirements |
| `project-planner` | Task breakdown, dependencies, implementation strategy | Quick fixes |

## Specialized

| Skill | Use When | NOT For |
|-------|----------|---------|
| `game-development` | Game loop, physics, AI, 2D/3D games | Web apps → `react-pro` |
| `media-processing` | FFmpeg, ImageMagick, video/audio/image processing | UI images → `design-system` |
| `copywriting` | Headlines, landing pages, AIDA/PAS formulas | Technical docs → `doc-templates` |
| `seo-optimizer` | SEO, E-E-A-T, Core Web Vitals, Google algorithms | Performance → `perf-optimizer` |
| `perf-optimizer` | Bundle size, Lighthouse, runtime profiling | SEO → `seo-optimizer` |
| `observability` | OpenTelemetry, logs, metrics, traces | Server management → `server-ops` |
| `doc-templates` | README, API docs, changelog, Mermaid diagrams | Copywriting → `copywriting` |
| `knowledge-graph` | Semantic search, find usages, impact analysis, AST | Simple grep search |
| `system-design` | Architecture decisions, trade-offs, ADR documentation | Code implementation |
| `mcp-builder` | Build MCP servers for AI agents | Using MCP tools → `mcp-management` |
| `mcp-management` | Discover and execute MCP server tools | Building MCP → `mcp-builder` |
| `google-adk-python` | Google Agent Development Kit, multi-agent orchestration | General Python → `python-pro` |
| `ai-artist` | Prompt engineering for image generation (DALL-E, MJ, SD) | UI design → `design-system` |

---

> ⚡ PikaKit v3.9.125 · 53 Skills · 9 Domains
