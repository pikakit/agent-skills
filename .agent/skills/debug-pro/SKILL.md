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
  triggers: "debug, bug, error, crash, exception, root cause"
  coordinates_with: "test-architect, code-review, recovery-agent"
  success_metrics: "root cause identified, bug fixed, regression test added"
---

# Debugging Mastery

> **Purpose:** Systematic debugging with 4-phase methodology

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Bug reported | Follow 4-phase methodology |
| Error occurs | Root cause tracing |
| Crash investigation | Defense-in-depth analysis |
| Fix validation | Verify before claim |

---

## Quick Reference

| Phase | Goal |
|-------|------|
| **1. Reproduce** | Reliably reproduce before fixing |
| **2. Isolate** | Narrow down the source |
| **3. Understand** | Find ROOT CAUSE (5 Whys) |
| **4. Fix & Verify** | Fix at source, add test |

---

## Phase 1: Reproduce 🔄

```markdown
- [ ] Can reproduce consistently
- [ ] Have minimal reproduction case
- [ ] Understand expected behavior
- [ ] Documented environment details
```

---

## Phase 2: Isolate 🔍

| Technique | Command |
|-----------|---------|
| Binary search | `git bisect` |
| Recent changes | `git log --oneline -20` |
| Who changed | `git blame path/to/file` |

---

## Phase 3: Understand 🧠 (5 Whys)

```
1. Why: [First observation]
2. Why: [Deeper reason]
3. Why: [Still deeper]
4. Why: [Getting closer]
5. Why: [ROOT CAUSE]
```

**Root Cause must:**
- ✅ Explain ALL symptoms
- ✅ Changing it fixes the issue
- ❌ "It just happens" is NOT valid

---

## Phase 4: Fix & Verify ✅

```markdown
- [ ] Bug no longer reproduces
- [ ] Related functionality works
- [ ] No new issues introduced
- [ ] Regression test added
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Random changes | Follow 4-phase |
| Assume root cause | Verify with evidence |
| Claim fixed without test | Run verification |
| Stop at symptoms | Apply 5 Whys |

---

## 🚩 Red Flags

**STOP and follow 4-phase if thinking:**

- "Quick fix for now, investigate later"
- "Just try changing X and see"
- "It's probably X, let me fix that"
- "Should work now" / "Seems fixed"
- "Tests pass, we're done"

**All mean:** Return to Phase 1.

## References

- [references/advanced-frameworks.md](references/advanced-frameworks.md)
- [references/debugging-tools.md](references/debugging-tools.md)

---

> **Remember:** NEVER claim "fixed" without verification.

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `test-architect` | Skill | Regression tests |
| `code-review` | Skill | Quality check |
| `/diagnose` | Workflow | Debug workflow |

---

⚡ PikaKit v3.9.67
