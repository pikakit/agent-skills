---
name: project-planner
description: >-
  Structured task planning with clear breakdowns, dependencies, and verification criteria.
  Use when implementing features, refactoring, or any multi-step work requiring planning.
  Triggers on: plan, breakdown, tasks, implementation strategy, project scope.
  Coordinates with: app-scaffold, code-craft, test-architect.
metadata:
  category: "planning"
  version: "1.0.0"
  triggers: "plan, breakdown, tasks, strategy, scope, implementation"
  coordinates_with: "app-scaffold, code-craft, test-architect"
  success_metrics: "plan approved, all tasks verifiable, max 10 tasks"
---

# Project Planner

> **Purpose:** Break work into clear, verifiable tasks.

---

## When to Use

| Situation | Action |
|-----------|--------|
| New project from scratch | Create full plan |
| Adding a feature | Plan affected files |
| Complex bug fix | Plan investigation |
| Refactoring multiple files | Plan changes |

---

## Task Breakdown Principles

| Principle | Implementation |
|-----------|----------------|
| **Small, Focused** | 2-5 minutes per task |
| **Verifiable** | Clear "done" criteria |
| **Ordered** | Dependencies identified |
| **Specific** | No vague descriptions |
| **Max 10 tasks** | Split if more needed |

---

## Plan Structure

```markdown
# [Task Name]

## Goal
One sentence: What are we building/fixing?

## Tasks
- [ ] Task 1: [Specific action] → Verify: [How to check]
- [ ] Task 2: [Specific action] → Verify: [How to check]
- [ ] Task 3: [Specific action] → Verify: [How to check]

## Done When
- [ ] [Main success criteria]
```

---

## Be Specific

| ❌ Wrong | ✅ Right |
|----------|----------|
| "Set up project" | "Run `npx create-next-app`" |
| "Add authentication" | "Install next-auth, create auth route" |
| "Style the UI" | "Add Tailwind classes to `Header.tsx`" |

---

## Verification Examples

| ❌ Wrong | ✅ Right |
|----------|----------|
| "Verify it works" | "Run dev, click button, see toast" |
| "Test the API" | "curl localhost:3000/api returns 200" |
| "Check styles" | "Open browser, toggle dark mode" |

---

## Scripts by Project Type

| Project Type | Relevant Scripts |
|--------------|------------------|
| Frontend/React | `ux_audit.js`, `accessibility_checker.js` |
| Backend/API | `api_validator.js`, `security_scan.js` |
| Mobile | `mobile_audit.js` |
| Database | `schema_validator.js` |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `/plan` | Workflow | Architecture planning |
| `idea-storm` | Skill | Requirements gathering |
| `app-scaffold` | Skill | Project setup |

---

⚡ PikaKit v3.2.0
