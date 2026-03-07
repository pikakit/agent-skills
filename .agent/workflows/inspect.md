---
description: Defense-in-depth code review — four-layer validation across build, tests, security, and logic to eliminate false completion claims with evidence-based verification.
chain: security-audit
---

# /inspect - Defense-in-Depth Review

$ARGUMENTS

---

## Purpose

Systematic code review with multi-layer validation — preventing false completion claims through evidence-based verification across build, tests, security, and logic layers. **Differs from `/validate` (runs tests) and `/diagnose` (finds bugs) by performing comprehensive quality audit across all dimensions before deployment.** Uses `security-auditor` with `security-scanner` for vulnerability scanning and `code-review` for quality validation.

---

## Sub-Commands

| Command | Purpose |
|---------|---------|
| `/inspect` | Review current changes |
| `/inspect [file-path]` | Review specific file |
| `/inspect --pr` | PR-style review |
| `/inspect --security` | Security-focused review |

---

## 🤖 Meta-Agents Integration

| Phase | Agent | Action |
| ----- | ----- | ------ |
| **Pre-Review** | `assessor` | Evaluate review scope and risk areas |
| **Post-Review** | `learner` | Log review patterns for future reference |

```
Flow:
assessor.evaluate(scope) → 4-layer validation
       ↓
build → tests → security → logic
       ↓
report → learner.log(patterns)
```

---

## 🔴 MANDATORY: 4-Layer Validation Protocol

### Phase 1: Build Verification

| Field | Value |
|-------|-------|
| **INPUT** | $ARGUMENTS (target files/scope or current changes) |
| **OUTPUT** | Build result: compilation status, lint errors, warnings |
| **AGENTS** | none |
| **SKILLS** | `code-review` |

// turbo
```bash
npm run build
```

| Check | Required |
|-------|----------|
| TypeScript compiles | ✅ |
| No lint errors | ✅ |
| No warnings | ⚠️ |

### Phase 2: Test Verification

| Field | Value |
|-------|-------|
| **INPUT** | Build result from Phase 1 |
| **OUTPUT** | Test result: pass/fail count, coverage, skipped tests |
| **AGENTS** | none |
| **SKILLS** | `code-review` |

// turbo
```bash
npm test
```

| Check | Required |
|-------|----------|
| All tests pass | ✅ |
| No skipped tests | ⚠️ |
| Coverage maintained | ⚠️ |

### Phase 3: Security Scan

| Field | Value |
|-------|-------|
| **INPUT** | Source files in scope |
| **OUTPUT** | Security report: vulnerabilities found, severity levels |
| **AGENTS** | `security-auditor` |
| **SKILLS** | `security-scanner`, `code-review` |

| Check | Required |
|-------|----------|
| No hardcoded secrets | ✅ |
| Input validation present | ✅ |
| SQL injection safe | ✅ |
| XSS prevention | ✅ |

### Phase 4: Logic Review

| Field | Value |
|-------|-------|
| **INPUT** | All results from Phases 1-3 + source code |
| **OUTPUT** | Logic review: issues found with severity, required actions |
| **AGENTS** | `security-auditor` |
| **SKILLS** | `code-review` |

| Category | Questions |
|----------|----------|
| **Correctness** | Does it solve the stated problem? |
| **Edge Cases** | Null, empty, max values handled? |
| **Error Handling** | All failure modes covered? |
| **Performance** | N+1 queries? Memory leaks? |
| **Maintainability** | Clear naming? Single responsibility? |

---

## ⛔ MANDATORY: Problem Verification Before Completion

> **CRITICAL:** This check MUST be performed before any `notify_user` or task completion.

### Check @[current_problems]

```
1. Read @[current_problems] from IDE
2. If errors/warnings > 0:
   a. Auto-fix: imports, types, lint errors
   b. Re-check @[current_problems]
   c. If still > 0 → STOP → Notify user
3. If count = 0 → Proceed to completion
```

### Auto-Fixable

| Type | Fix |
|------|-----|
| Missing import | Add import statement |
| Unused variable | Remove or prefix `_` |
| Lint errors | Run eslint --fix |

> **Rule:** Never mark complete with errors in `@[current_problems]`.

### Evidence-Based Completion

**NEVER claim completion without proof:**

```
✅ CORRECT: "Build passed: `npm run build` completed in 3.2s"
✅ CORRECT: "Tests: 42/42 passed (npm test output attached)"
❌ WRONG:  "I believe the code should work"
❌ WRONG:  "This should fix the issue"
```

---

## Output Format

```markdown
## 🔍 Inspect: [Target]

### Layer Results

| Layer | Status | Details |
|-------|--------|---------|
| Build | ✅ Pass | 0 errors, 2 warnings |
| Tests | ✅ Pass | 42/42 passed, 78% coverage |
| Security | ⚠️ Warning | 1 issue found |
| Logic | ⚠️ Issues | 3 issues found |

### Issues Found

| File | Issue | Severity |
|------|-------|----------|
| `user.ts:45` | Missing null check | High |
| `api.ts:23` | No rate limiting | Medium |
| `auth.ts:89` | Unused variable | Low |

### Verdict

⚠️ **NEEDS FIXES** before completion

### Required Actions

1. Add null check in user.ts:45
2. Add CSRF token to POST endpoints
3. Consider rate limiting

### Next Steps

- [ ] Fix identified issues with `/fix`
- [ ] Re-run `/inspect` after fixes
- [ ] Run `/validate` for full test suite
```

---

## Examples

```
/inspect
/inspect src/services/auth.ts
/inspect --pr
/inspect --security
/inspect src/routes/ --security
```

---

## Key Principles

- **Evidence over belief** — prove it works with command output, not assumptions
- **Every layer matters** — don't skip build, tests, security, or logic checks
- **Security first** — always scan for vulnerabilities before marking complete
- **Fix before claiming** — no "should work" — verify with evidence
- **Document issues** — clear action items with file, line, and severity

---

## 🔗 Workflow Chain

**Skills Loaded (2):**

- `security-scanner` - OWASP 2025 vulnerability analysis
- `code-review` - Multi-layer code quality validation

```mermaid
graph LR
    A["/inspect"] --> B["/fix"]
    B --> C["/validate"]
    C --> D["/launch"]
    style A fill:#10b981
```

| After /inspect | Run | Purpose |
|---------------|-----|---------|
| Issues found | `/fix` | Fix identified issues |
| All clear | `/validate` | Run full test suite |
| Security issue | `/diagnose` | Deep investigation |

**Handoff to /fix:**

```markdown
🔍 Review complete. [X] issues found across 4 layers.
Verdict: [PASS/NEEDS FIXES]. Run `/fix` to resolve or `/validate` if all clear.
```
