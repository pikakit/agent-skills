---
name: app-scaffold
description: >-
  Main application building orchestrator. Creates full-stack applications from natural language.
  Determines project type, selects tech stack, coordinates agents for implementation.
  Triggers on: build app, create project, new application, scaffold, full-stack.
  Coordinates with: project-planner, code-craft, test-architect, design-system.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Agent
metadata:
  version: "1.0.0"
  category: "architecture"
  triggers: "build app, create project, new application, scaffold, full-stack"
  success_metrics: "project builds, npm run dev works, all files created"
  coordinates_with: "project-planner, code-craft, test-architect, design-system"
---

# App Builder - Application Building Orchestrator

> Analyzes user's requests, determines tech stack, plans structure, and coordinates agents.

---

## When to Use

| Situation | Approach |
|-----------|----------|
| New project | Detect type, choose template |
| Full-stack app | Use nextjs-fullstack |
| Mobile app | Use react-native-app |
| CLI tool | Use cli-tool template |

---

## 🎯 Selective Reading Rule

**Read ONLY files relevant to the request!** Check the content map, find what you need.

| File                    | Description                            | When to Read                        |
| ----------------------- | -------------------------------------- | ----------------------------------- |
| `project-detection.md`  | Keyword matrix, project type detection | Starting new project                |
| `tech-stack.md`         | 2025 default stack, alternatives       | Choosing technologies               |
| `agent-coordination.md` | Agent pipeline, execution order        | Coordinating multi-agent work       |
| `scaffolding.md`        | Directory structure, core files        | Creating project structure          |
| `feature-building.md`   | Feature analysis, error handling       | Adding features to existing project |
| `templates/SKILL.md`    | **Project templates**                  | Scaffolding new project             |

---

## 📦 Templates (13)

Quick-start scaffolding for new projects. **Read the matching template only!**

| Template                                                       | Tech Stack          | When to Use           |
| -------------------------------------------------------------- | ------------------- | --------------------- |
| [nextjs-fullstack](templates/nextjs-fullstack/TEMPLATE.md)     | Next.js + Prisma    | Full-stack web app    |
| [nextjs-saas](templates/nextjs-saas/TEMPLATE.md)               | Next.js + Stripe    | SaaS product          |
| [nextjs-static](templates/nextjs-static/TEMPLATE.md)           | Next.js + Framer    | Landing page          |
| [nuxt-app](templates/nuxt-app/TEMPLATE.md)                     | Nuxt 3 + Pinia      | Vue full-stack app    |
| [express-api](templates/express-api/TEMPLATE.md)               | Express + JWT       | REST API              |
| [python-fastapi](templates/python-fastapi/TEMPLATE.md)         | FastAPI             | Python API            |
| [react-native-app](templates/react-native-app/TEMPLATE.md)     | Expo + Zustand      | Mobile app            |
| [flutter-app](templates/flutter-app/TEMPLATE.md)               | Flutter + Riverpod  | Cross-platform mobile |
| [electron-desktop](templates/electron-desktop/TEMPLATE.md)     | Electron + React    | Desktop app           |
| [chrome-extension](templates/chrome-extension/TEMPLATE.md)     | Chrome MV3          | Browser extension     |
| [cli-tool](templates/cli-tool/TEMPLATE.md)                     | Node.js + Commander | CLI app               |
| [monorepo-turborepo](templates/monorepo-turborepo/TEMPLATE.md) | Turborepo + pnpm    | Monorepo              |

---

## 🔗 Related Agents

| Agent                 | Role                             |
| --------------------- | -------------------------------- |
| `project-planner`     | Task breakdown, dependency graph |
| `frontend-specialist` | UI components, pages             |
| `backend-specialist`  | API, business logic              |
| `database-architect`  | Schema, migrations               |
| `devops-engineer`     | Deployment, preview              |

---

## Usage Example

```
User: "Make an Instagram clone with photo sharing and likes"

App Builder Process:
1. Project type: Social Media App
2. Tech stack: Next.js + Prisma + Cloudinary + Clerk
3. Create plan:
   ├─ Database schema (users, posts, likes, follows)
   ├─ API routes (12 endpoints)
   ├─ Pages (feed, profile, upload)
   └─ Components (PostCard, Feed, LikeButton)
4. Coordinate agents
5. Report progress
6. Start preview
```

---

 PikaKit v3.9.68
