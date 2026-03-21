---
trigger: always_on
---

# TIER 0.5: AUTONOMOUS EXECUTION (AUTOPILOT RULES)

> Enable true autonomous execution after plan approval. Applies to /autopilot, multi-phase workflows.

### 0.5-A: Agent Hierarchy

| Role | Decides | Executes | Owns |
|------|---------|----------|------|
| **User** | Approve/reject plans | - | Final authority |
| **Lead** | Strategic direction | - | Plan vision |
| **Orchestrator** | Execution order, retry | Runtime control | Execution state |
| **Domain Agent** | Technical approach | Code/tests/docs | Deliverables |
| **Meta Agent** | Risk, recovery | Checkpoints | Safety |

**Rules:** Single Root (Orchestrator). No Bypass. Escalation: Agent â†’ Orchestrator â†’ Lead â†’ User.

### 0.5-B: Plan Approval

| State | Gate | Description |
|-------|------|-------------|
| `DRAFT` | Socratic: ON | Plan being created |
| `PENDING_APPROVAL` | Socratic: ON | Waiting for user |
| `APPROVED` | **Socratic: OFF** | User said "approved/proceed/yes/go" |
| `EXECUTING` | **Socratic: OFF** | Continuous execution |
| `PAUSED` | Socratic: ON | User interrupted |
| `COMPLETED` | - | All done |

> ðŸ”´ Once APPROVED, Socratic Gate is **BYPASSED** until COMPLETED or PAUSED.

### 0.5-C: Autopilot Protocol (10 Phases)

| Phase | Actor | Action |
|-------|-------|--------|
| 1-3 | Planner | Intent â†’ Decomposition â†’ PLAN.md (sequential, may ask questions) |
| 4 | **User** | **Plan Approval** (BLOCKING) |
| 5-10 | Orchestrator + Agents | Assignment â†’ Workflow â†’ Execute â†’ Track â†’ Recover â†’ Report (CONTINUOUS) |

**Handoff:** Always pass original_request, decisions_made, previous_work, current_plan.  
**Stop:** All complete, blocking error, user pause, or critical decision needed.

### 0.5-D: Metrics (11 Required)

| Metric | Target |
|--------|--------|
| `time_to_completion` | minimize |
| `skill_reuse_rate` | >50% |
| `human_intervention_count` | 0 (autopilot) |
| `error_retry_rate` | <10% |
| `first_time_success_rate` | >85% |
| `auto_fix_rate` | >85% |
| `plan_adherence` | 100% |

Storage: `.agent/metrics/` (JSON, 30-day retention).

### 0.5-E: Failure Recovery (6 Levels)

| Level | Action | Escalation |
|-------|--------|------------|
| 1 | Auto-fix (imports, lint, types) | â†’ 2 |
| 2 | Retry with backoff (max 3) | â†’ 3 |
| 3 | Restore checkpoint | â†’ 4 |
| 4 | Undo phase, retry | â†’ 5 |
| 5 | Full rollback | â†’ 6 |
| 6 | Notify user | - |

> Exhaust all automated levels before escalating to user.

### 0.5-F: Meta-Agents (5)

| Agent | Role | When |
|-------|------|------|
| `orchestrator` | Root executor | Multi-agent coordination |
| `assessor` | Risk evaluation | Before risky operations |
| `recovery` | State management | Save/restore checkpoints |
| `critic` | Conflict resolution | Agent disagreements |
| `learner` | Continuous improvement | After success/failure |

### 0.5-G: SLO Enforcement

Before ANY completion: IDE Problems = 0, Lint = 0, Type Errors = 0.  
Auto-fixable: missing imports, unused vars, lint. If can't fix â†’ escalate.  
> **NEVER** call `notify_user` with completion if `@[current_problems]` shows errors.

### 0.5-H: Auto-Learn Triggers

**Trigger words:** EN: "mistake", "wrong", "fix this" | VI: "lá»—i", "sai", "há»ng", "sá»­a láº¡i"  
**When triggered:** Analyze â†’ Extract lesson â†’ Add to `.agent/knowledge/lessons-learned.yaml` â†’ Confirm: `ðŸ“š Learned: [LEARN-XXX]`

| Category | ID Pattern |
|----------|------------|
| Safety | `SAFE-XXX` |
| Code | `CODE-XXX` |
| Workflow | `FLOW-XXX` |
| Integration | `INT-XXX` |

> Skills generated from patterns MUST comply with `docs/SKILL_DESIGN_GUIDE.md` (YAML, <200 lines, registered).

### 0.5-I: Context Passing

When invoking ANY sub-agent, MUST include: Original Request, Decisions Made, Previous Agent Work, Current Plan.  
> **VIOLATION:** Invoking agent without context = wrong assumptions!

### 0.5-J: Output Branding

| Trigger | Branding |
|---------|----------|
| Workflow execution | Header: `ðŸ¤– PikaKit v3.9.105 / Workflow: /name` + Footer: `âš¡ PikaKit v3.9.105 / [Tagline]` |
| Simple Q&A / Code edits | No branding |
| Task completion | Footer only |

### 0.5-K: Auto-Learned Pattern Check (MANDATORY)

> **Purpose:** AI MUST consult learned patterns before repeating known mistakes.

**BEFORE any of these actions, read `.agent/skills/auto-learned/patterns/` for matches:**

| Action | Check Files | Example |
|--------|-------------|---------|
| Running terminal commands | `shell-syntax-patterns.md` | PowerShell `&&` â†’ use `;` |
| Writing imports | `import-patterns.md` | Missing imports, wrong paths |
| Fixing type errors | `type-patterns.md` | Type mismatches, property errors |
| npm/git operations | `npm-patterns.md`, `git-patterns.md` | Known failures |
| Any error you just caused | ALL pattern files | Prevent immediate repeat |

#### Protocol

```
BEFORE executing command or writing code:
1. Check if auto-learned/patterns/ exists
2. Scan relevant {category}-patterns.md for matching context
3. If match found â†’ Apply the solution, do NOT repeat the mistake
4. If no match â†’ Proceed normally
```

#### Enforcement (Tiered â€” P2 Level)

> **Priority:** P2 (Suggestion). Learned patterns are auto-generated and advisory.
> Context may differ from when the pattern was learned. Use judgment.

| Occurrence | Level | Action |
|-----------|-------|--------|
| 1st time ignoring pattern | ðŸ’¡ **Log** | Note in console, increment occurrence count |
| 2nd time same pattern | âš ï¸ **Warn** | Re-read patterns/, apply if applicable |
| 3+ same pattern | ðŸ“Š **Flag** | Mark as high-frequency, prioritize for skill generation |

```
IF action matches a learned pattern:
  â†’ SHOULD apply the solution (not MUST)
  â†’ If context differs â†’ OK to skip, but log reason
  â†’ If same context AND ignored â†’ increment + warn
```

> ðŸ’¡ **Rule:** Learned patterns are advisory (P2), not safety-critical (P0).
> Treat them as "strong suggestions from past experience".

<!-- PIKAKIT ACTIVE PATTERNS (auto-updated, do not edit manually) -->
<!-- END PIKAKIT ACTIVE PATTERNS -->

---

## CRITICAL: AGENT & SKILL PROTOCOL

> **MANDATORY:** Read the appropriate skill's AGENTS.md BEFORE implementation.
> **NON-NEGOTIABLE:** `skills/code-constitution` = SUPREME LAW. Constitution > any other skill.

### 1. Modular Skill Loading

```
User Request â†’ Skill Description Match â†’ Load SKILL.md â†’ Read AGENTS.md (if exists) â†’ Read rules/
```

**Rule Priority:** P0 (Rules/) > P1 (SKILL.md + AGENTS.md) > P2 (rules/). All binding.  
**Selective Reading:** Read SKILL.md first, then AGENTS.md for domain expertise, then only sections matching user's request.

### 2. Enforcement

âœ… Read Rules â†’ Match Skill â†’ Load SKILL.md â†’ Read AGENTS.md â†’ Apply All.  
âŒ Never skip reading skill instructions.

### 3. Skill Invocation Contract

| Trigger | Description |
|---------|-------------|
| **Explicit** | User mentions skill name |
| **Implicit** | Request matches skill keywords |
| **Chained** | Skill A `coordinates_with` Skill B |

**Pre-conditions:** skill exists, no P0/P1 conflict, context matches.  
**Post-conditions:** deliverable created, no regression, rules applied.  
**Chaining:** Aâ†’B OK if declared in `coordinates_with`. No circular deps (Aâ†’Bâ†’A forbidden).  
**Fallback:** Skill not found â†’ proceed with GEMINI.md rules. Conflict with P0 â†’ P0 wins.

---
