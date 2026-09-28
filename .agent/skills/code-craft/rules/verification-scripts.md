---
"title": "Verification Scripts Reference"
"kind": "process"
"impact": "standard"
"tags":
  - "verification"
  - "scripts"
"applies_to":
  - "cross-platform"
"last_reviewed": "2026-09-28"
"sources":
  - "url": "https://google.github.io/eng-practices/review/developer/"
    "title": "Official documentation"
---

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
