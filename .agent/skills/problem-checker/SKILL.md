---
name: problem-checker
description: >-
  Automated IDE problem detection and auto-fix before task completion. Checks
  @[current_problems] and auto-fixes common issues. Triggers on: before notify_user,
  after code modification, IDE errors. Coordinates with: code-quality, auto-learner.
metadata:
  category: "core"
  version: "1.0.0"
  triggers: "before notify_user, before task completion, after code modification, IDE errors"
  coordinates_with: "code-quality, auto-learner"
  success_metrics: "0 IDE errors at completion, auto-fix >80%"
---

# problem-checker

> **Purpose:** Check `@[current_problems]` and auto-fix common issues before any task completion

---

## 🚨 Critical Rule

**NEVER mark a task complete or call `notify_user` with completion if `@[current_problems]` shows errors.**

---

## When to Invoke

| Trigger | Action |
|---------|--------|
| Before any `notify_user` | Run full check |
| After modifying `.ts`, `.tsx`, `.js`, `.jsx` files | Run TypeScript check |
| After modifying `.css` files | Run CSS validation |
| User says "check for errors" | Run full check |

---

## Check Protocol

### Step 1: Read IDE Problems

```javascript
// Conceptual - agent reads from IDE context
const problems = await getIDEProblems();
// Returns: [{ file, line, message, severity, id }]
```

### Step 2: Categorize Problems

| Severity | Action | Example |
|----------|--------|---------|
| `error` | **MUST FIX** before complete | Cannot find module, Type error |
| `warning` | Should fix if auto-fixable | Unused variable, Missing import |
| `info` | Ignore, proceed | Style suggestions |

### Step 3: Auto-Fix Decision Tree

```
Problem detected?
├── YES → Is it auto-fixable?
│         ├── YES → Apply fix → Re-check → Continue
│         └── NO  → STOP → Escalate to user
└── NO  → Proceed to completion
```

---

## Auto-Fixable Issues

| Issue Type | Pattern | Fix Method |
|------------|---------|------------|
| **Missing import** | `Cannot find name 'X'` | Add `import { X } from 'module'` |
| **JSX namespace** | `Cannot find namespace 'JSX'` | Import `ReactNode` from 'react' |
| **Unused variable** | `'x' is declared but never used` | Remove or prefix with `_` |
| **Missing semicolon** | `';' expected` | Add semicolon |
| **Wrong quote style** | Quote style mismatch | Run prettier/eslint --fix |
| **@import order** | `@import must precede` | Move @import to top |
| **Type assertion** | Simple type mismatch | Add `as Type` assertion |

---

## Non-Fixable Issues (Escalate)

| Issue Type | Example | Action |
|------------|---------|--------|
| **Logic error** | Wrong business logic | Notify user, explain issue |
| **Breaking change** | API contract broken | Block completion, explain impact |
| **Missing dependency** | Package not installed | Ask user to run `npm install` |
| **Ambiguous fix** | Multiple possible solutions | Ask user for preference |

---

## Implementation Checklist

Before completion, verify:

```markdown
- [ ] Read `@[current_problems]`
- [ ] Count: errors=0, warnings=0 (or acceptable)
- [ ] If errors > 0: auto-fix what's possible
- [ ] Re-check after auto-fix
- [ ] If still errors: STOP and notify user
- [ ] Document any fixes made
```

---

## Integration with Workflows

### In `/build` and `/autopilot`:

```markdown
## ⛔ MANDATORY: Problem Verification Before Completion

Before ANY `notify_user`:
1. Invoke `problem-checker`
2. Wait for clean result
3. Only then proceed
```

### In any code modification:

```javascript
// After editing file
await runCommand('npx tsc --noEmit');
const hasErrors = checkOutput();
if (hasErrors) {
  await autoFix(errors);
  await runCommand('npx tsc --noEmit'); // Re-check
}
```

---

## Scripts

| Script | Purpose |
|--------|---------|
| `check_problems.js` | Run TypeScript check, parse output |
| `auto_fix.js` | Apply common fixes |

---

## Success Metrics

| Metric | Target |
|--------|--------|
| IDE errors at completion | **0** |
| Auto-fix success rate | >80% |
| Time to fix | <30s per error |
| Escalation rate | <20% of issues |

---

## Example Usage

### Before Task Completion

```
Agent: About to notify user...
→ Invoke problem-checker
→ Found: 2 errors in WeatherCard.tsx
  - Line 11: Cannot find namespace 'JSX'
  - Line 15: Cannot find namespace 'JSX'
→ Auto-fix: Import ReactNode from 'react'
→ Re-check: 0 errors
→ Proceed to notify_user
```

### Escalation Example

```
Agent: About to notify user...
→ Invoke problem-checker
→ Found: 1 error in api.ts
  - Line 42: Property 'userId' does not exist on type 'Request'
→ Cannot auto-fix (logic/design decision needed)
→ STOP: Notify user about issue, ask for guidance
```

---

## Lessons Learned Integration

When a problem is fixed, optionally add to lessons:

```yaml
- id: LEARN-XXX
  pattern: "The error pattern"
  severity: HIGH
  message: "How to prevent/fix"
  date: "YYYY-MM-DD"
```

This connects to `auto-learner` skill for continuous improvement.
