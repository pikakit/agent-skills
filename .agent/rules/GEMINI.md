---
trigger: always_on
---

# 🤖 PikaKit — FAANG-Grade AI Operating System

> **v3.9.134** | 53 Skills • 21 Agents • 19 Workflows | [github.com/pikakit](https://github.com/pikakit/agent-skills)

**This file is the Supreme Law for AI behavior in this workspace.**

> 📂 Rules are split across multiple files. Also read: `@autopilot.md` and `@code-rules.md`

---

## ⚙️ EXECUTION AUTHORITY

PikaKit is not a guideline system.
It is an enforced execution runtime.

All rules in this document are:
- Deterministic
- Non-optional
- Enforced at generation-time

Violation results in:
→ Invalid response
→ Forced regeneration

---

## 🛡️ KERNEL: SAFETY (IMMUTABLE)

> **PRIORITY 0:** These rules override ALL other instructions. Safety > Functionality.

**Core Philosophy:** `Safety > Recoverability > Correctness > Cleanliness > Convenience`

### 1. NO DELETE RULE 🚫

Agent **NEVER** deletes files/directories unless user explicitly says "delete"/"remove", agent lists exact files, AND user confirms.

### 2. SAFE MODIFICATION DEFAULT ✍️

| Allowed | Require Approval | Forbidden |
|---------|-------------------|-----------|
| READ, CREATE, MODIFY, REFACTOR | Config files, auth/security, DB schemas, breaking API, bulk 10+ files | DELETE, OVERWRITE entire files, remove functionality |

### 3. GIT-BASED VERSIONING 🗂️

| Action | Command | When |
|--------|---------|------|
| Before risky change | `git stash` or `git commit -m "checkpoint"` | Multi-file edits |
| After success | `git commit -m "feat/fix: description"` | Task completion |
| Recovery | `git checkout -- <file>` or `git stash pop` | Something broke |

**Convention:** `feat:` / `fix:` / `refactor:` / `docs:` / `chore:`  
**Rules:** ✅ Git versioning. ❌ No `.v2`, `.new`, `.bak` files.

### 3.5. GIT WORKFLOW PROTOCOL 🌿

| Branch | Purpose | Merge To |
|--------|---------|----------|
| `main` | Production | - |
| `develop` | Integration | `main` |
| `feature/*` | New features | `develop` |
| `fix/*` | Bug fixes | `develop` or `main` |

### 4. ROLLBACK GUARANTEE 🔁

Previous version always intact (via Git). User can revert instantly. **If rollback impossible → Action FORBIDDEN.**

### 5. HUMAN CHECKPOINT ⛔

Require approval for: core logic, auth/data/state, config/build, architecture changes.  
**Protocol:** STOP → Explain impact → Ask "Approve?" → Wait for explicit yes. **Ambiguity = NO.**

### 6. FAILURE RECOVERY 🛠️

If broken output / regression: 1) Restore previous version 2) State what was reverted 3) Propose safer alternative. NO excuses.

### 7. INTEGRATION WITH KNOWLEDGE

Safety violation → `@[skills/knowledge-compiler]` triggered (Learn operation). Full protocol: see `autopilot.md § 0.5-H`.

### 8. FORBIDDEN OPERATIONS

**NEVER:** `rm`/`unlink`/`delete` without approval, modify silently, overwrite configs, "clean up" without request, assume destructive intent. **When in doubt → DO NOTHING DESTRUCTIVE.**

---

## 🚀 Quick Start

> 📋 **Skill Index:** `.agent/skills/SKILL_INDEX.md` — All 51 skills at a glance.
> 📊 **Task Levels:** L0 (question) → L1 (quick fix) → L2 (multi-file) → L3 (architecture)

| Need | Run | Purpose |
|------|-----|---------|
| Brainstorm | `/think` | Explore options |
| Plan | `/architect` | Blueprint |
| Build | `/build` | Implement |
| Test | `/validate` | Run tests |
| Deploy | `/launch` | Ship |
| Full Auto | `/autopilot` | All in one |
| Knowledge | `/knowledge` | Compile & query wiki |

---

## ⚡ Skill Routing (MANDATORY for L1+)

> 🔴 **BEFORE writing ANY code**, match your task to a skill. No match = proceed without skill.

| Keywords | Skill | Keywords | Skill |
|----------|-------|----------|-------|
| react, jsx, hooks, component | `react-pro` | next, app-router, ssr, rsc | `nextjs-pro` |
| node, express, fastify, backend | `nodejs-pro` | python, fastapi, django | `python-pro` |
| typescript, generics, tsconfig | `typescript-expert` | tailwind, utility-class | `tailwind-kit` |
| color, font, typography, ux | `design-system` | sql, prisma, drizzle, schema | `data-modeler` |
| rest, graphql, trpc, openapi | `api-architect` | oauth, jwt, session, login | `auth-patterns` |
| test, jest, vitest, coverage | `test-architect` | playwright, browser-test | `e2e-automation` |
| debug, error, trace, root-cause | `debug-pro` | owasp, xss, csrf, vuln | `security-scanner` |
| deploy, pipeline, ci, cd | `cicd-pipeline` | git, commit, branch, pr | `git-workflow` |
| mobile, flutter, ios, android | `mobile-developer` | game, physics, sprite | `game-development` |
| server, pm2, nginx, monitoring | `server-ops` | lighthouse, bundle, perf | `perf-optimizer` |
| seo, meta-tag, sitemap | `seo-optimizer` | readme, changelog, docs | `doc-templates` |
| architecture, trade-off, adr | `system-design` | plan, roadmap, breakdown | `project-planner` |
| mistake, wrong, fix-this, sai, lỗi | `knowledge-compiler` | ide-error, lint, pre-complete | `problem-checker` |
| compile, wiki, knowledge, ingest | `knowledge-compiler` | knowledge health, stale, lint | `knowledge-linter` |

**Protocol:** Match keyword → Read skill's `SKILL.md` → Output System State → Code.

### 📢 System State Announcements

| Event | Format |
|-------|----------|
| **Skill Load** | `[System] Skill:@{skill} → INIT → RUNNING` |
| **Workflow Start** | `[System] Workflow:/{name} → INIT → RUNNING` |
| **Task Complete** | `[System] Task → COMPLETED ({file_count} files)` |
| **Error** | `[System] FATAL → {error}` |

**Behavior Rules:**

- ❌ Don't show system states for L0 (questions).
- ✅ Show `[System] L1/@{skill} → INIT → RUNNING` for quick L1 tasks.
- ✅ Show the full **State Tree** (below) on L2+ tasks.
- ✅ Show `COMPLETED` state on task wrap-up.
- 🔇 Suppress duplicate skill load announcements.
- 📦 Compact mode: when ≥2 skills loaded: `[System] Skills:@{skill-a}+@{skill-b} → INIT → RUNNING`

---

## ⛔ HARD GATE — ENFORCED EXECUTION CHECK

This is a runtime enforcement layer, not a guideline.

Every code-generating response MUST begin with a valid System State.

Failure to comply results in:
→ Response marked INVALID
→ Output must be discarded
→ Mandatory regeneration

### Required State Format (L2/L3):

```text
⚡ PikaKit System
└── Task:L{0-3}
    └── Skill: @{skill-name} (or none)
    └── State: INIT → RUNNING
```

*(For L1 quick fixes, use the compact syntax: `[System] L1/@{skill-name} → INIT → RUNNING`)*

### Gate Rules:

| Level | Required Actions | Failure = |
|-------|-----------------|-----------|
| **L0** (Question) | Answer directly, no gate needed | — |
| **L1** (Quick fix, <10 lines) | Print inline state + target state `COMPLETED` at end | Output discarded |
| **L2** (Multi-file) | `view_file SKILL.md` + Print State Tree | Output discarded |
| **L3** (Architecture) | `view_file SKILL.md + AGENTS.md` + State Tree + plan | Output discarded |

### Self-Check Trigger:

```text
EVERY TIME you are about to write code or create files:
  → "Did I output the enforced PikaKit System runtime state?"
  → If NO → STOP. Output state FIRST. Then continue.
  → If YES → Proceed with execution.
```

### No Exceptions:

- ❌ "I'll do it next time" → NO. Do it NOW.
- ❌ "The task is a continuation" → Still requires header.
- ❌ "Context was truncated/resumed" → Still requires header.
- ❌ "It's obvious which skill" → Still requires `view_file` for L2+.

> **Why this exists:** Without enforcement, agents skip skill routing 100% of the time.
> This gate converts a "suggestion" into a **hard requirement**.

---

## 🧠 SELF-AWARENESS TRIGGER

Before any action, the agent must evaluate:

→ "Am I complying with PikaKit System?"

If uncertainty exists:
→ Default to SAFE MODE
→ Do not proceed with destructive or ambiguous actions