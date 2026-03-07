---
name: project-planner
summary: >-
  Structured task planning with clear breakdowns, dependencies, and verification criteria.
  Use when implementing features, refactoring, or any multi-step work requiring planning.
  Triggers on: plan, breakdown, tasks, implementation strategy, project scope.
  Coordinates with: app-scaffold, code-craft, test-architect.
metadata:
  category: "planning"
  version: "2.0.0"
  triggers: "plan, breakdown, tasks, strategy, scope, implementation"
  success_metrics: "plan approved, all tasks verifiable, max 10 tasks"
  coordinates_with: "app-scaffold, code-craft, test-architect"
---

# Project Planner — Structured Task Breakdown

> Max 10 tasks. 2-5 min each. Action + Verify format. Dependencies explicit.

---

## When to Use

| Situation | Action |
|-----------|--------|
| New project from scratch | Create full plan |
| Adding a feature | Plan affected files |
| Complex bug fix | Plan investigation steps |
| Refactoring multiple files | Plan change order |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Task breakdown (max 10) | Requirements gathering (→ idea-storm) |
| Verification criteria | Project scaffolding (→ app-scaffold) |
| Dependency ordering | Code implementation |
| Plan template | Test execution (→ test-architect) |

**Expert decision skill:** Produces plan documents. Does not write code.

---

## Task Breakdown Principles (Fixed)

| Principle | Constraint |
|-----------|-----------|
| **Small, Focused** | 2-5 minutes per task |
| **Verifiable** | Every task: action + how to verify |
| **Ordered** | Dependencies via `depends_on` |
| **Specific** | No vague descriptions |
| **Bounded** | Max 10 tasks; split into sub-plans if more |

---

## Plan Template (Fixed)

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

## Specificity Rules (Non-Negotiable)

| ❌ Vague | ✅ Specific |
|----------|-----------|
| "Set up project" | "Run `npx create-next-app`" |
| "Add authentication" | "Install next-auth, create auth route" |
| "Style the UI" | "Add Tailwind classes to `Header.tsx`" |
| "Verify it works" | "Run dev, click button, see toast" |
| "Test the API" | "curl localhost:3000/api returns 200" |

---

## Project Type Scripts (Fixed)

| Project Type | Relevant Scripts |
|--------------|-----------------|
| Frontend/React | `ux_audit.js`, `accessibility_checker.js` |
| Backend/API | `api_validator.js`, `security_scan.js` |
| Mobile | `mobile_audit.js` |
| Database | `schema_validator.js` |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_VAGUE_GOAL` | Yes | Goal lacks specificity |
| `ERR_SCOPE_TOO_LARGE` | Yes | Requires > 10 tasks |
| `ERR_UNKNOWN_TYPE` | Yes | Project type not one of 4 |

**Zero internal retries.** Deterministic; same goal + scope = same plan.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Create plans with > 10 tasks | Split into sub-plans |
| Use vague task descriptions | Be specific: command, file, action |
| Use vague verification | Specify: URL, status code, visible result |
| Skip dependency ordering | Use `depends_on` task numbers |
| Estimate without bounds | Use 2-5 minute fixed range |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [engineering-spec.md](references/engineering-spec.md) | Full engineering spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `/plan` | Workflow | Architecture planning |
| `idea-storm` | Skill | Requirements gathering |
| `app-scaffold` | Skill | Project setup |

---

⚡ PikaKit v3.9.96
