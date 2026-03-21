---
trigger: always_on
---

# 🤖 PikaKit — FAANG-Grade AI Operating System

> **v3.9.105** | 51 Skills • 21 Agents • 18 Workflows | [github.com/pikakit](https://github.com/pikakit/agent-skills)

**This file is the Supreme Law for AI behavior in this workspace.**

> 📂 Rules are split across multiple files. Also read: `@autopilot.md` and `@code-rules.md`

---

## 🛡️ TIER -1: SAFETY PROTOCOL (SUPREME LAW)

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

### 7. INTEGRATION WITH AUTO-LEARN

Safety violation → `@[skills/auto-learner]` triggered → Lesson added to `.agent/knowledge/lessons-learned.yaml` → Pattern: `SAFE-XXX`

### 8. FORBIDDEN OPERATIONS

**NEVER:** `rm`/`unlink`/`delete` without approval, modify silently, overwrite configs, "clean up" without request, assume destructive intent. **When in doubt → DO NOTHING DESTRUCTIVE.**

---

## 🚀 Quick Start

| Need | Run | Purpose |
|------|-----|---------|
| Brainstorm | `/think` | Explore options |
| Plan | `/architect` | Blueprint |
| Build | `/build` | Implement |
| Test | `/validate` | Run tests |
| Deploy | `/launch` | Ship |
| Full Auto | `/autopilot` | All in one |

---
