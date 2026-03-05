---
description: Autonomous agent execution framework. User approves PLAN.md once, agent runs end-to-end automatically.
---

# /auto-accept-process - Autonomous Execution Framework

$ARGUMENTS

---

## Purpose

Enable fully autonomous agent execution after a single plan approval — the user reviews and approves PLAN.md once, then the agent executes all phases automatically without further prompts. **Differs from `/autopilot` by focusing on the execution policy framework itself (allow/deny patterns, `// turbo` annotations), while `/autopilot` coordinates 3+ specialist agents.** Uses all 5 meta-agents: `assessor` for risk evaluation, `recovery` for state preservation, `orchestrator` for parallel execution, `critic` for conflict resolution, and `learner` for pattern extraction.

---

## 🤖 Meta-Agents Integration

| Phase | Agent | Action |
| ----- | ----- | ------ |
| **Pre-Execution** | `assessor` | Evaluate auto-execution risk level for the plan |
| **Pre-Execution** | `recovery` | Save state before auto-run (git checkpoint) |
| **During Execution** | `orchestrator` | Control parallel execution, retry failed phases |
| **On Conflict** | `critic` | Resolve agent disagreements on approach |
| **On Failure** | `recovery` | Auto-rollback to saved state |
| **Post-Execution** | `learner` | Learn execution patterns for reuse |

```
Flow:
PLAN.md approved → assessor.evaluate(risk)
       ↓
recovery.save(state) → orchestrator.execute(phases)
       ↓
each phase → auto-accept if command ∈ allowPatterns
       ↓
conflict? → critic.resolve()
       ↓
failure? → recovery.restore() → learner.log(failure)
       ↓
success → learner.log(patterns)
```

---

## 🔴 MANDATORY: Autonomous Execution Protocol

### Phase 1: Plan Generation

| Field | Value |
|-------|-------|
| **INPUT** | $ARGUMENTS (user request — feature description, requirements) |
| **OUTPUT** | `PLAN.md` with objectives, files, commands, verification steps |
| **AGENTS** | `project-planner` |
| **SKILLS** | `project-planner`, `idea-storm` |

1. Analyze user request and generate `PLAN.md` containing:

```
PLAN.md must include:
□ Clear objectives
□ List of files to create/modify
□ Commands to run (with safety classification)
□ Verification steps
□ Rollback strategy
```

2. Present plan to user for review

### Phase 2: Plan Approval Gate

| Field | Value |
|-------|-------|
| **INPUT** | Generated `PLAN.md` from Phase 1 |
| **OUTPUT** | Approved plan — user says "Approved" / "Proceed" / "Yes" / "Go" |
| **AGENTS** | none (user-facing) |
| **SKILLS** | none |

> ⛔ **SINGLE CHECKPOINT** — this is the ONLY point where user approval is required. After approval, all subsequent phases execute automatically.

**Approval states:**

| User Response | State | Action |
|---------------|-------|--------|
| "Approved" / "Proceed" / "Yes" / "Go" | `APPROVED` | Continue to Phase 3 |
| "Change X" / feedback | `PENDING_APPROVAL` | Revise plan, re-present |
| "Cancel" / "Stop" | `CANCELLED` | Abort workflow |

### Phase 3: Pre-Execution Safety Check

| Field | Value |
|-------|-------|
| **INPUT** | Approved `PLAN.md` |
| **OUTPUT** | Risk assessment + state checkpoint created |
| **AGENTS** | `assessor`, `recovery` |
| **SKILLS** | `lifecycle-orchestrator` |

1. `assessor` evaluates risk level of the plan:

| Risk Level | Criteria | Action |
|------------|----------|--------|
| **Low** | Read-only ops, npm scripts, lint | Auto-proceed |
| **Medium** | File creation, config changes | Auto-proceed with checkpoint |
| **High** | Database changes, auth modifications | Escalate to user |
| **Critical** | Destructive ops, production deploy | Block — require explicit approval |

2. `recovery` creates state checkpoint:

```
recovery.saveState({
  files: [list of files from PLAN.md],
  checkpoint: "pre-auto-execution"
})
```

### Phase 4: Auto-Execution

| Field | Value |
|-------|-------|
| **INPUT** | Approved plan + checkpoint from Phase 3 |
| **OUTPUT** | All artifacts created/modified per plan |
| **AGENTS** | Domain agents per plan (e.g., `backend-specialist`, `frontend-specialist`, `test-engineer`) |
| **SKILLS** | Per plan requirements |

> `// turbo-all` — all commands in this phase auto-execute per execution policy.

**Auto-Accept Policy:**

| Command Pattern | Auto-Accept | Reason |
|-----------------|-------------|--------|
| `npm run *` | ✅ Yes | Build/test scripts |
| `npm test` | ✅ Yes | Test execution |
| `npx tsc --noEmit` | ✅ Yes | Type checking |
| `npx prisma generate` | ✅ Yes | Code generation |
| `git status/diff/log` | ✅ Yes | Read-only git ops |
| `node .agent/*` | ✅ Yes | Agent scripts |
| `eslint --fix` | ✅ Yes | Auto-fix lint |
| `git push` | ❌ No | Remote mutation |
| `rm -rf` | ❌ Never | Destructive |
| `DROP TABLE` | ❌ Never | Destructive |
| Unknown commands | ❌ No | Require approval |

**Execution loop:**

```
FOR each step in PLAN.md:
  1. Classify command against allow/deny patterns
  2. IF allowed → execute automatically
  3. IF denied → STOP → notify user
  4. IF error → retry ≤ 3 → IF still failing → recovery.restore()
  5. Log execution result
```

### Phase 5: Verification & Reporting

| Field | Value |
|-------|-------|
| **INPUT** | All artifacts from Phase 4 |
| **OUTPUT** | Verification report: tests, lint, type check results |
| **AGENTS** | `test-engineer` |
| **SKILLS** | `test-architect`, `problem-checker` |

// turbo
```bash
npm test
```

// turbo
```bash
npm run lint && npx tsc --noEmit
```

1. Run all tests — report pass/fail count
2. Run lint and type checking — auto-fix where possible
3. Check `@[current_problems]` — auto-fix if possible
4. Generate execution report

**On failure at any verification step:**

```
IF tests fail:
  → Auto-fix obvious issues (imports, types)
  → Re-run tests (max 3 retries)
  → IF still failing → recovery.restore(checkpoint)
  → Notify user with failure details
```

---

## 🔑 Execution Annotations

### Workflow-Level

```markdown
// turbo      ← Auto-accept NEXT step only
// turbo-all  ← Auto-accept ALL remaining steps
```

### Command-Level

```markdown
// @auto @safe  ← Mark individual command as safe to auto-execute
```

> These annotations are consumed by the workflow engine. Commands without annotations require standard user approval unless `// turbo-all` is active.

---

## 🛡️ Safety Guarantees

| Guarantee | Mechanism |
|-----------|-----------|
| **Plan Approval Required** | Won't execute without approved PLAN.md |
| **Deny List Protected** | Dangerous commands (`rm -rf`, `git push`, `DROP`) always blocked |
| **State Checkpoint** | Git commit + file snapshot before execution |
| **Auto-Rollback** | `recovery` agent restores checkpoint on failure |
| **Execution Logging** | All commands logged via `execution-reporter` |
| **Risk Assessment** | `assessor` evaluates plan before auto-run |

---

## ⛔ MANDATORY: Problem Verification Before Completion

> **CRITICAL:** This check MUST be performed before any `notify_user` or task completion.

### Check @[current_problems]

```
1. Read @[current_problems] from IDE
2. If errors/warnings > 0:
   a. Auto-fix: imports, types, lint errors
   b. Re-check @[current_problems]
   c. If still > 0 → STOP → Notify user with details
3. If count = 0 → Proceed to completion report
```

### Auto-Fixable

| Type | Fix |
|------|-----|
| Missing import | Add import statement |
| Unused variable | Remove or prefix `_` |
| Type mismatch | Fix type annotation |
| Lint errors | Run eslint --fix |

> **Rule:** Never mark complete with errors in `@[current_problems]`.

---

## Output Format

```markdown
## 🤖 Auto-Accept Execution Complete

### Execution Summary

| Aspect | Value |
|--------|-------|
| Plan | ✅ PLAN.md approved |
| Phases Executed | [X] / [Y] |
| Commands Auto-Accepted | [N] |
| Commands Denied | [M] |

### Phase Results

| Phase | Status | Duration |
|-------|--------|----------|
| Planning | ✅ Generated | — |
| Approval | ✅ Approved | — |
| Safety Check | ✅ Low risk | — |
| Execution | ✅ All steps completed | Xs |
| Verification | ✅ Tests + lint passed | Xs |

### Artifacts Created

| File | Action |
|------|--------|
| `src/path/file.ts` | ✅ Created |
| `src/path/test.ts` | ✅ Created |
| `prisma/schema.prisma` | ✅ Modified |

### Verification

| Check | Result |
|-------|--------|
| Tests | ✅ X/Y passing |
| Lint | ✅ No errors |
| Types | ✅ No errors |

### Next Steps

- [ ] Review generated code
- [ ] Test user flows manually
- [ ] Deploy when ready: `/launch`
```

---

## Examples

```
/auto-accept-process build authentication system with JWT
/auto-accept-process refactor user module to use repository pattern
/auto-accept-process create REST API with Prisma and comprehensive tests
/auto-accept-process add real-time notifications with WebSocket
/auto-accept-process migrate database schema and update all queries
```

---

## Key Principles

- **Single checkpoint** — user approves once (PLAN.md), agent executes everything else automatically
- **Deny-list protected** — destructive commands are always blocked regardless of annotations
- **Fail-safe execution** — state checkpoint before execution, auto-rollback on failure
- **Transparent logging** — every auto-accepted command is logged for audit trail
- **Progressive risk** — low-risk commands auto-accept, high-risk escalate to user

---

## 🔗 Workflow Chain

**Skills Loaded (4):**

- `lifecycle-orchestrator` - End-to-end task lifecycle with checkpoint/restore safety
- `execution-reporter` - Execution context display and audit trail
- `project-planner` - Task breakdown and plan generation
- `problem-checker` - IDE error detection and auto-fix before completion

```mermaid
graph LR
    A["/plan"] --> B["/auto-accept-process"]
    B --> C["/launch"]
    style B fill:#10b981
```

| After /auto-accept-process | Run | Purpose |
|---------------------------|-----|---------|
| Need full multi-agent orchestration | `/autopilot` | 3+ specialist agents in parallel |
| Ready to deploy | `/launch` | Production deployment |
| Issues found during execution | `/diagnose` | Root cause investigation |
| Need to validate further | `/validate` | Run comprehensive test suite |

**Handoff to /launch:**

```markdown
✅ Auto-execution complete! [X] phases finished automatically, [Y] tests passing.
All artifacts created per PLAN.md. Run `/launch` when ready to deploy.
```
