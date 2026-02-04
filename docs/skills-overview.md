---
title: Skills Overview
description: PikaKit's 45+ specialized skills for development, design, and tooling
section: skills
---

# Skills Overview

45+ specialized skills that extend AI agent capabilities—loaded dynamically when triggered.

## Quick Reference

### Core & Process

| Skill | Purpose |
|-------|---------|
| [project-planner](/skills/project-planner) | Transform requirements into executable plans |
| [code-craft](/skills/code-craft) | Clean code patterns, SRP, DRY, KISS |
| [code-review](/skills/code-review) | Multi-layer validation with security checks |
| [debug-pro](/skills/debug-pro) | Root cause analysis with 4-phase methodology |
| [idea-storm](/skills/idea-storm) | Socratic questioning for complex requirements |
| [app-scaffold](/skills/app-scaffold) | Full-stack application scaffolding |
| [problem-checker](/skills/problem-checker) | IDE error detection and auto-fix |
| [lifecycle-orchestrator](/skills/lifecycle-orchestrator) | End-to-end task coordination |

### Architecture & Design

| Skill | Purpose |
|-------|---------|
| [api-architect](/skills/api-architect) | REST/GraphQL/tRPC API design patterns |
| [data-modeler](/skills/data-modeler) | Database schema, Prisma, migrations |
| [system-design](/skills/system-design) | Scalability, microservices, ADR |
| [design-system](/skills/design-system) | UI/UX psychology, color, typography |
| [frontend-design](/skills/frontend-design) | Anti-AI-slop, distinctive interfaces |
| [react-architect](/skills/react-architect) | React hooks, composition, state management |
| [tailwind-kit](/skills/tailwind-kit) | Tailwind CSS v4 patterns |

### Frameworks

| Skill | Purpose |
|-------|---------|
| [nextjs-pro](/skills/nextjs-pro) | Next.js App Router, RSC, SSR/SSG |
| [nodejs-pro](/skills/nodejs-pro) | Node.js, Express, Hono, NestJS |
| [python-pro](/skills/python-pro) | FastAPI, Django, Flask patterns |
| [typescript-expert](/skills/typescript-expert) | Type gymnastics, monorepo, tsconfig |
| [frontend-development](/skills/frontend-development) | React, TanStack Query, MUI v7, Suspense |
| [shell-script](/skills/shell-script) | Bash automation, CLI patterns |

### Testing

| Skill | Purpose |
|-------|---------|
| [test-architect](/skills/test-architect) | Unit, integration, AAA pattern |
| [test-driven-dev](/skills/test-driven-dev) | TDD red-green-refactor cycle |
| [e2e-automation](/skills/e2e-automation) | Playwright, visual testing |
| [agent-browser](/skills/agent-browser) | AI-optimized automation, @refs |

### DevOps & Security

| Skill | Purpose |
|-------|---------|
| [cicd-pipeline](/skills/cicd-pipeline) | CI/CD, deployment workflows |
| [server-ops](/skills/server-ops) | Server management, PM2, Docker |
| [security-scanner](/skills/security-scanner) | OWASP, vulnerability analysis |
| [offensive-sec](/skills/offensive-sec) | Red team, pentest tactics |
| [perf-optimizer](/skills/perf-optimizer) | Core Web Vitals, bundle analysis |
| [observability](/skills/observability) | OpenTelemetry, logging, tracing |

### Integrations

| Skill | Purpose |
|-------|---------|
| [payment-patterns](/skills/payment-patterns) | SePay (VN), Polar (Global SaaS) |
| [mcp-server](/skills/mcp-server) | Model Context Protocol servers |
| [mcp-builder](/skills/mcp-builder) | Build MCP servers (Python/TS) |
| [mcp-management](/skills/mcp-management) | Discover, execute MCP tools |
| [vercel-deploy](/skills/vercel-deploy) | Vercel deployment automation |

### Specialized

| Skill | Purpose |
|-------|---------|
| [studio](/skills/studio) | 50+ styles, 97 color palettes |
| [media-processing](/skills/media-processing) | FFmpeg, ImageMagick, RMBG |
| [seo-optimizer](/skills/seo-optimizer) | SEO, meta tags, OpenGraph |
| [geo-spatial](/skills/geo-spatial) | AI search optimization (GEO) |
| [doc-templates](/skills/doc-templates) | README, API docs, changelog |
| [plans-kanban](/skills/plans-kanban) | Visual plan dashboard with timeline |
| [markdown-novel-viewer](/skills/markdown-novel-viewer) | Book-like markdown viewer |

### AI & Multimodal

| Skill | Purpose |
|-------|---------|
| [ai-artist](/skills/ai-artist) | Prompt engineering for LLMs and image AI |
| [google-adk-python](/skills/google-adk-python) | Multi-agent orchestration with Google ADK |

### Mobile & Games

| Skill | Purpose |
|-------|---------|
| [mobile-first](/skills/mobile-first) | Mobile orchestrator (RN, Flutter) |
| [mobile-developer](/skills/mobile-developer) | Cross-platform app development |
| [mobile-design](/skills/mobile-design) | Touch, platform conventions |
| [game-development](/skills/game-development) | Game dev orchestrator |

### Evolution

| Skill | Purpose |
|-------|---------|
| [auto-learner](/skills/auto-learner) | Learn from mistakes, extract patterns |
| [skill-generator](/skills/skill-generator) | Create skills from patterns |
| [auto-learned](/skills/auto-learned) | Hierarchical learned patterns |

---

## How to Use

**Basic invocation:**
```
"Use [skill-name] to [task]"
```

**Examples:**
```
"Use api-architect to design a REST API for user management"
"Use payment-patterns to integrate VietQR checkout"
"Use debug-pro to investigate this test failure"
"Use studio to create a SaaS landing page design"
```

**Skill not activating?** Be explicit:
```
"Use the [skill-name] skill to..."
```

---

## Under the Hood

### How Skills Activate

Skills activate through **trigger matching** on your prompt:

1. Agent matches request to skill triggers (keywords)
2. Relevant skill instructions load into context
3. Agent follows skill-specific patterns and references

**Activation triggers:**
- Mentioning the skill name explicitly
- Describing a task that matches skill description
- Using keywords from skill's domain

### Skill Structure

Every skill contains:

```
.agent/skills/[skill-name]/
├── SKILL.md          # Core instructions (<200 lines)
├── references/       # Detailed documentation (optional)
├── rules/            # Decision trees, patterns (optional)
└── scripts/          # Automation scripts (optional)
```

**Progressive disclosure**: SKILL.md provides essentials, references/ has depth.

### Skills vs Workflows vs Agents

| Aspect | Skills | Workflows | Agents |
|--------|--------|-----------|--------|
| **Purpose** | Specialized knowledge | Coordinated processes | Task execution |
| **Invocation** | "Use [skill]..." | `/command` | Auto-routed |
| **Scope** | Single capability | Multi-step pipeline | Domain specialist |
| **Example** | api-architect, studio | /build, /validate | planner, tester |

### Creating Custom Skills

```
"Use skill-generator to create a skill for [your-domain]"
```

skill-generator will:
1. Analyze patterns from your feedback
2. Design skill structure
3. Create SKILL.md with proper frontmatter
4. Add references if needed
5. Register in skills registry

---

## Troubleshooting

**Skill not working?**
- Check skill name spelling (use registry.json for reference)
- Provide more context about your task
- Try explicit invocation: "Use the X skill to..."

**Need a skill that doesn't exist?**
- Use skill-generator to build from patterns
- Check auto-learned for existing patterns

---

## Key Takeaway

45+ skills provide instant expertise—just mention the skill and describe your task. Skills load dynamically based on context.

---

⚡ PikaKit v3.2.0
