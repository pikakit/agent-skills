---
name: debug-pro
description: >-
  Unified debugging skill combining systematic 4-phase methodology with advanced frameworks
  (defense-in-depth, root-cause tracing, verification).
  Triggers on: debug, bug, error, crash, exception, root cause, investigation, not working.
  Coordinates with: test-architect, code-review, recovery-agent.
metadata:
  version: "2.0.0"
  category: "core"
  triggers: "debug, bug, error, crash, exception, root cause, investigation, not working"
  success_metrics: "root cause identified, bug fixed, regression test added"
  coordinates_with: "test-architect, code-review, recovery-agent"
---

# Debug Pro — Systematic Debugging

> 4 phases. 5 Whys. No random changes. Never claim "fixed" without verification.

---

## Prerequisites

**Required:** None — Debug Pro is a methodology-based skill with no external dependencies.

---

## When to Use

| Situation | Action |
|-----------|--------|
| Bug reported | Follow 4-phase methodology from Phase 1 |
| Error/exception occurs | Root cause tracing with 5 Whys |
| Crash investigation | Defense-in-depth analysis |
| Fix validation needed | Verification checklist (Phase 4) |
| Architecture review | Read `references/engineering-spec.md` |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| 4-phase methodology (Reproduce→Isolate→Understand→Fix&Verify) | Debugger tool execution |
| 5 Whys root cause analysis | Automated bug detection (→ code-review) |
| Isolation techniques (git bisect/blame/log) | Test writing (→ test-architect) |
| Verification checklist (4 items) | Code quality review (→ code-craft) |
| Red flag detection (5 patterns) | Performance profiling (→ perf-optimizer) |
| 3 advanced frameworks | Git command execution |

**Pure decision skill:** Produces debugging strategies and checklists. Zero side effects.

---

## 4-Phase Methodology

### Phase 1: Reproduce 🔄

- [ ] Can reproduce consistently
- [ ] Have minimal reproduction case
- [ ] Understand expected behavior
- [ ] Documented environment details

### Phase 2: Isolate 🔍

| Technique | Command | When |
|-----------|---------|------|
| Binary search | `git bisect` | Narrow to commit |
| Recent changes | `git log --oneline -20` | Check recent commits |
| Blame | `git blame path/to/file` | Find who changed what |

### Phase 3: Understand 🧠 (5 Whys)

```
1. Why: [First observation]
2. Why: [Deeper reason]
3. Why: [Still deeper]
4. Why: [Getting closer]
5. Why: [ROOT CAUSE]
```

**Root cause MUST:** explain ALL symptoms. "It just happens" is NOT valid.

### Phase 4: Fix & Verify ✅

- [ ] Bug no longer reproduces
- [ ] Related functionality works
- [ ] No new issues introduced
- [ ] Regression test added

---

## Phase Transitions (Strict Order)

```
REPRODUCE → ISOLATE     [reproduction checklist complete]
ISOLATE → UNDERSTAND    [source narrowed to component]
UNDERSTAND → FIX_VERIFY [root cause explains all symptoms]
FIX_VERIFY → RESOLVED   [verification passed + regression test]  // terminal
FIX_VERIFY → REPRODUCE  [verification failed]
UNDERSTAND → ISOLATE    [hypothesis disproven]
ANY_PHASE → REPRODUCE   [red flag detected]
```

**No phase may be skipped.**

---

## 🚩 Red Flags (Return to Phase 1)

| Pattern | Why It's Wrong |
|---------|---------------|
| "Quick fix for now, investigate later" | Skipping root cause analysis |
| "Just try changing X and see" | Random change without evidence |
| "It's probably X, let me fix that" | Assumption without verification |
| "Should work now" / "Seems fixed" | No verification |
| "Tests pass, we're done" | Tests ≠ complete verification |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_MISSING_DESCRIPTION` | Yes | Bug description not provided |
| `ERR_MISSING_EXPECTED` | Yes | Expected behavior not provided |
| `ERR_PHASE_SKIP` | No | Attempted to skip a phase |
| `ERR_INVALID_PHASE` | No | Phase name not recognized |
| `RED_FLAG` | Yes | Red flag detected; return to Phase 1 |

**Zero internal retries.** Deterministic; same context = same methodology output.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Random changes hoping to fix | Follow 4-phase methodology |
| Assume root cause without evidence | Verify with 5 Whys |
| Claim fixed without testing | Run verification checklist |
| Stop at symptoms | Dig to root cause |
| Skip regression test | Add test for every fix |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [defense-in-depth/](defense-in-depth/) | Defense-in-depth analysis framework | Crash investigation |
| [root-cause-tracing/](root-cause-tracing/) | Root cause tracing framework | Complex bugs |
| [verification-before-completion/](verification-before-completion/) | Verification framework | Fix validation |
| [engineering-spec.md](references/engineering-spec.md) | Full engineering spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `test-architect` | Skill | Regression test writing |
| `code-review` | Skill | Code quality validation |
| `/diagnose` | Workflow | Debug workflow |

---

⚡ PikaKit v3.9.85
