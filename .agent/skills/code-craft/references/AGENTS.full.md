# Code Craft Full Agent Rules

> Deterministic compilation of 2 source rules for code-craft v4.0.0. Do not edit directly.

## Rule Index

- [Production verification gates](#rule-production-gates) (high, process, source: `rules/production-gates.md`)
- [Verification Scripts Reference](#rule-verification-scripts) (standard, process, source: `rules/verification-scripts.md`)

<a id="rule-production-gates"></a>

## Production verification gates

**Impact:** high
**Kind:** process
**Source:** `rules/production-gates.md`

# Production verification gates

## Preconditions

- Confirm the target platform and dependency versions from the repository.
- Capture a reproducible baseline and define observable acceptance criteria.
- Identify a recoverable rollback point before changing code or configuration.

## Procedure

1. Apply the smallest change that satisfies the documented requirement.
2. Exercise the affected success and failure paths with the narrowest reliable check.
3. Run the repository typecheck, tests, and policy checks that cover the changed surface.
4. Inspect diagnostics for redacted, actionable evidence; a missing or failed checker is not success.

## Rollback

Restore the recorded baseline when a required check errors, the result is inconclusive, or a new regression appears. Re-run the baseline check after restoration.

## Exit Gate

Finish only when required checks execute and pass, acceptance behavior is reproduced, rollback remains available, and residual risks are reported explicitly.

<a id="rule-verification-scripts"></a>

## Verification Scripts Reference

**Impact:** standard
**Kind:** process
**Source:** `rules/verification-scripts.md`

# Verification Scripts Reference

## Preconditions

Record the current behavior, target environment, acceptance criteria, and a recoverable baseline before starting.

## Procedure

# Verification Scripts Reference

> Script mapping by agent role.

---

## Built-in Validation

| Check | Command |
|-------|---------|
| Master development checklist | `npm run checklist` |
| Full verification | `npm run verify -- . --url <url>` |
| TypeScript | `npm run typecheck` |
| Test suite | `npm test` |
| Workflow audit | `npx tsx .agent/scripts/audit_workflows.ts` |
| Skill audit | `npx tsx .agent/scripts/skill-audit.ts` |
| Knowledge/source secret scan | `npx tsx .agent/skills/knowledge-compiler/scripts/secret-scanner.ts .` |
| Studio data integrity | `npm run validate:data` |
| Problem check | `npx tsx .agent/skills/problem-checker/scripts/check_problems.ts .` |

Domain checks for UX, accessibility, API schemas, mobile, SEO, Lighthouse, and
Playwright are optional plugins. The checklist reports them as `not_configured`
until an implementation is installed; their absence is never reported as a
successful execution.

---

## Script Output Handling

### Protocol: READ → SUMMARIZE → ASK

1. **Run** script, capture ALL output
2. **Parse** — identify errors, warnings, passes
3. **Summarize** to user:

```markdown
## Script Results: [script_name.js]

### ❌ Errors Found (X items)
- [File:Line] Error description

### ⚠️ Warnings (Y items)
- [File:Line] Warning description

### ✅ Passed (Z items)
- Check passed

**Should I fix the X errors?**
```

4. **Wait** for user confirmation
5. **Re-run** after fixing to confirm

---

## Rules

| ❌ VIOLATION | ✅ CORRECT |
|-------------|-----------|
| Running script, ignoring output | Read + summarize output |
| Auto-fixing without asking | Ask before fixing |
| Wrong agent running wrong script | Each agent runs own scripts |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [engineering-spec.md](production-gates.md) | Full contracts and architecture |
| [SKILL.md](../SKILL.md) | Core principles and function rules |

## Rollback

Restore the recorded baseline if a required command errors, evidence becomes inconclusive, or the change introduces a regression.

## Exit Gate

Complete only with fresh, reproducible evidence for the intended behavior and all relevant project checks passing.
