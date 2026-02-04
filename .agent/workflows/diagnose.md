---
description: Root cause detective. Hypothesis-driven debugging with evidence-based verification.
chain: debug-complex
---

# /diagnose - Root Cause Detective

$ARGUMENTS

---

## Purpose

Systematic debugging using scientific method. **Form hypotheses, gather evidence, eliminate possibilities until root cause is found.**

---

## 🤖 Meta-Agents Integration

| Phase | Agent | Action |
| ----- | ----- | ------ |
| **Pre-Debug** | `recovery` | Save state before debugging changes |
| **Hypothesis** | `learner` | Check past bug patterns for similar issues |
| **Investigation** | `assessor` | Evaluate fix risk before applying |
| **Post-Fix** | `learner` | Log root cause for future reference |
| **On Failure** | `recovery` | Restore if debugging makes things worse |

```
Flow:
recovery.save() → learner.check(past_bugs)
       ↓
hypotheses → test → found? → assessor.evaluate(fix)
       ↓
apply fix → learner.log(root_cause, fix)
```

---

## 🔴 MANDATORY: 5-Phase Investigation

### Phase 1: Symptom Collection

```
GATHER:
□ Exact error message (copy/paste)
□ When did it start?
□ What changed recently?
□ Reproduction steps
□ Expected vs actual behavior
□ Environment (dev/staging/prod)
```

### Phase 2: Hypothesis Formation

Generate 3+ ranked hypotheses:

| #   | Hypothesis           | Likelihood | Test Method     |
| --- | -------------------- | ---------- | --------------- |
| 1   | [Most likely cause]  | 70%        | [How to verify] |
| 2   | [Second possibility] | 20%        | [How to verify] |
| 3   | [Edge case]          | 10%        | [How to verify] |

### Phase 3: Evidence Gathering

// turbo

```bash
# Run code analysis
node .agent/scripts-js/checklist.js .
# OR: npm run checklist:js .

# Check for security issues (Python skill script - still valid)
python .agent/skills/security-scanner/scripts/security_scan.py .
```

### Phase 4: Systematic Elimination

For each hypothesis:

1. Define the TEST
2. Predict the OUTCOME if hypothesis is true
3. Run the test
4. Record ACTUAL result
5. ✅ Confirmed or ❌ Eliminated

### Phase 5: Fix + Prevention

```markdown
## Root Cause Confirmed

[Clear explanation]

## Fix Applied

[Code changes with before/after]

## Prevention Measures

- [ ] Add test case for this scenario
- [ ] Add input validation
- [ ] Update documentation
- [ ] Add monitoring/alert
```

---

## Output Format

````markdown
## 🔍 Diagnosis: [Issue Title]

### Symptom

> [User's description of the problem]

### Environment

| Aspect       | Value                  |
| ------------ | ---------------------- |
| File         | `src/services/auth.ts` |
| Line         | 42                     |
| Environment  | Development            |
| Last Working | 2 commits ago          |

---

### Hypotheses

| #   | Hypothesis                    | Likelihood | Status        |
| --- | ----------------------------- | ---------- | ------------- |
| 1   | Null reference in user object | 70%        | ✅ CONFIRMED  |
| 2   | API timeout                   | 20%        | ❌ Eliminated |
| 3   | Cache stale data              | 10%        | ⏳ Not tested |

---

### Investigation Log

**Testing H1: Null reference**

- Test: Add console.log before line 42
- Prediction: user.id will be undefined
- Result: ✅ user was null when not logged in
- Verdict: **ROOT CAUSE FOUND**

---

### Root Cause

🎯 **user object is null when accessing protected route without auth**

The `getUser()` function returns null for unauthenticated requests, but the code assumes it always returns a user object.

---

### Fix

```typescript
// ❌ Before
const userId = user.id;

// ✅ After
if (!user) {
  throw new AuthError("User not authenticated");
}
const userId = user.id;
```
````

---

### Prevention

- [x] Added null check before accessing user properties
- [ ] Add auth middleware to protect route
- [ ] Add test for unauthenticated access
- [ ] Add TypeScript strict null checks

---

### Verification

Run tests to confirm fix:
// turbo

```bash
npm test -- --grep "auth"
```

```

---

## Examples

```

/diagnose login returns 401 even with correct credentials
/diagnose form data not saving to database
/diagnose page crashes on mobile Safari
/diagnose API response is 10x slower since yesterday
/diagnose deployment fails on Vercel

````

---

## 🔍 Advanced Diagnostics

### Security Assessment
```bash
/diagnose "potential XSS vulnerability in comment system"
```
- **Audit:** Input sanitization, Content Security Policy (CSP)
- **Check:** OWASP Top 10 vulnerabilities

### Performance Profiling
```bash
/diagnose "slow API response times in user endpoints"
```
- **Audit:** Database query performance (N+1 problems)
- **Check:** Memory usage and extensive logging

### System Health
```bash
/diagnose "comprehensive system health check"
```
- **Audit:** Full stack analysis (Frontend -> API -> DB)
- **Check:** Resource utilization and error rates

---

## Key Principles

1. **Never guess** - hypothesize and test
2. **Most likely first** - test highest probability hypothesis first
3. **Log everything** - document investigation for future reference
4. **Fix + Prevent** - don't just patch, prevent recurrence
5. **Verify fix** - always confirm the fix works

---

## Common Root Causes Checklist

| Category | Things to Check |
|----------|-----------------|
| **Data** | Null values, wrong types, stale cache |
| **Auth** | Expired tokens, missing headers, CORS |
| **Network** | Timeouts, DNS, SSL certificates |
| **Code** | Recent changes, missing await, wrong imports |
| **Environment** | Env vars, versions, dependencies |

---

## 🔗 Workflow Chain

```mermaid
graph LR
    A["/diagnose"] --> B["/validate"]
    B --> C["/launch"]
    style A fill:#ef4444
````

| After /diagnose | Run         | Purpose       |
| --------------- | ----------- | ------------- |
| Bug fixed       | `/validate` | Verify fix    |
| Need tests      | `/validate` | Add test case |
| Ready           | `/launch`   | Deploy fix    |

**Handoff to /validate:**

```markdown
Bug fixed. Run /validate to verify the fix works.
```
