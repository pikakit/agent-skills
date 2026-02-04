---
description: Defense-in-depth code review. Multi-layer validation to prevent false completion claims.
chain: security-audit
---

# /inspect - Defense-in-Depth Review

$ARGUMENTS

---

## Purpose

Systematic code review with multi-layer validation. **Prevents false completion claims with evidence-based verification.**

---

## 🤖 Meta-Agents Integration

| Phase | Agent | Action |
| ----- | ----- | ------ |
| **Security** | `security-auditor` | **PRIORITY 0:** Check for hardcoded secrets & known vulns |
| **Quality** | `code-review` | Check linting, types, and complexity |
| **Adherence** | `assessor` | Verify against project coding standards |

```
Flow:
security.scan() → criticals? → BLOCK
       ↓
code.review() → quality check
       ↓
report.generate()
```
critic.arbitrate(security vs speed)
       ↓
complete → learner.log(patterns)
```

---

## Sub-commands

```
/inspect              - Review current changes
/inspect [file-path]  - Review specific file
/inspect --pr         - PR-style review
/inspect --security   - Security-focused review
```

---

## 🔴 MANDATORY: 4-Layer Validation

### Layer 1: Compile/Build Check

// turbo

```bash
npm run build
```

| Check               | Required |
| ------------------- | -------- |
| TypeScript compiles | ✅       |
| No lint errors      | ✅       |
| No warnings         | ⚠️       |

### Layer 2: Test Verification

// turbo

```bash
npm test
```

| Check               | Required |
| ------------------- | -------- |
| All tests pass      | ✅       |
| No skipped tests    | ⚠️       |
| Coverage maintained | ⚠️       |

### Layer 3: Security Check

// turbo

```bash
node .agent/skills/security-scanner/scripts/security_scan.js .
```

| Check                | Required |
| -------------------- | -------- |
| No hardcoded secrets | ✅       |
| Input validation     | ✅       |
| SQL injection safe   | ✅       |
| XSS prevention       | ✅       |

### Layer 4: Logic Review

| Category            | Questions                            |
| ------------------- | ------------------------------------ |
| **Correctness**     | Does it solve the stated problem?    |
| **Edge Cases**      | Null, empty, max values handled?     |
| **Error Handling**  | All failure modes covered?           |
| **Performance**     | N+1 queries? Memory leaks?           |
| **Maintainability** | Clear naming? Single responsibility? |

---

## Output Format

````markdown
## 🔍 Inspect: [Target]

### Layer 1: Build

✅ TypeScript: 0 errors
✅ Lint: 0 errors
⚠️ Warnings: 2 unused imports

### Layer 2: Tests

✅ Tests: 42 passed, 0 failed
✅ Coverage: 78% (target: 80%)

### Layer 3: Security

✅ No hardcoded secrets
✅ Input validation present
⚠️ Missing CSRF token on POST /api/user

### Layer 4: Logic Review

| File         | Issue              | Severity |
| ------------ | ------------------ | -------- |
| `user.ts:45` | Missing null check | High     |
| `api.ts:23`  | No rate limiting   | Medium   |
| `auth.ts:89` | Unused variable    | Low      |

### Summary

| Layer    | Status       |
| -------- | ------------ |
| Build    | ✅ Pass      |
| Tests    | ✅ Pass      |
| Security | ⚠️ 1 warning |
| Logic    | ⚠️ 3 issues  |

### Verdict

⚠️ **NEEDS FIXES** before completion

### Required Actions

1. Add null check in user.ts:45
2. Add CSRF token to POST endpoints
3. Consider rate limiting

### Evidence Required

Before marking complete, run:

```bash
npm run build && npm test
```
````

````

---

## Evidence-Based Completion

**NEVER claim completion without proof:**

```markdown
✅ CORRECT:
"Build passed: `npm run build` completed in 3.2s"
"Tests: 42/42 passed (npm test output attached)"

❌ WRONG:
"I believe the code should work"
"This should fix the issue"
````

---

## Examples

```
/inspect
/inspect src/services/auth.ts
/inspect --pr
/inspect --security
```

---

## Key Principles

1. **Evidence over belief** - prove it works
2. **Every layer matters** - don't skip checks
3. **Security first** - scan before completion
4. **Fix before claiming** - no "should work"
5. **Document issues** - clear action items

---

## 🔗 Workflow Chain

```mermaid
graph LR
    A["/inspect"] --> B["/build"]
    B --> C["/validate"]
    style A fill:#06b6d4
```

| After /inspect | Run         | Purpose            |
| -------------- | ----------- | ------------------ |
| Issues found   | `/build`    | Fix issues         |
| All clear      | `/validate` | Run tests          |
| Security issue | `/diagnose` | Deep investigation |

**Handoff to /build:**

```markdown
Review complete. 3 issues found. Run /build to fix.
```
