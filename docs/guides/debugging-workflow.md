---
title: Debugging & Fixing Workflow
description: Systematic approach to debugging and fixing issues using PikaKit's diagnostic agents
section: guides
category: workflows
order: 5
---

# Debugging & Fixing Workflow

A systematic approach to debugging, root cause analysis, and remediation using **PikaKit's** specialized agents (`/diagnose` and `/fix`).

## Overview

- **Goal**: Identify root causes and apply targeted fixes.
- **Agents Used**: `debugger`, `security-auditor`, `code-craft`, `test-engineer`.
- **Workflows**: `/diagnose`, `/fix`, `/validate`.

## When to Use This Workflow

- **Production Bugs**: Critical issues affecting users.
- **Test Failures**: CI/CD breakage.
- **Performance Issues**: Slow endpoints or memory leaks.
- **Security Vulnerabilities**: Potential exploits.

## Step-by-Step Guide

### 1. Initial Investigation (`/diagnose`)

Start by gathering evidence and forming hypotheses.

```bash
/diagnose "Login button not working in production"
```

**What happens**:
- **Debugger Agent** collects logs and stack traces.
- **Learner Agent** checks if this error pattern has been seen before.
- **Output**: A report with reproduction steps and initial hypotheses.

### 2. Deep Analysis

For complex issues, requesting a deep dive triggers advanced auditing.

```bash
/diagnose "analyze authentication flow for session issues"
```

**Advanced Checks**:
- **Security**: Vulnerability assessment (`security-scanner`).
- **Data**: Database consistency verification.
- **Logic**: Execution flow tracing.

### 3. Implementation (`/fix`)

Once the root cause is known (or if the error is obvious), use the Mechanic (`/fix`) to apply the solution.

```bash
/fix "session timeout causing login issues"
```

**Types of Fixes Applied**:
- **Code Logic**: Modifying conditional logic or algorithms.
- **Configuration**: Updating `.env` or config files.
- **Security Patch**: Sanitizing inputs or updating deps.

**Example Fix**:
```typescript
// ❌ Before
const session = await getSession();

// ✅ After (Fix applied by agent)
const session = await getSession();
if (!session || session.isExpired()) {
  throw new AuthError("Session invalid");
}
```

### 4. Verification (`/validate`)

Never assume a fix works. Verify it.

```bash
/validate
```

**Checks performed**:
- **Unit Tests**: Verifies the specific fix.
- **Regression**: Ensures no related features broke.
- **Security Check**: Confirms no new vulnerabilities were introduced.

### 5. Deployment

If validation passes, you are ready to ship.

```bash
/launch
```

## Real Example: Production Auth Issue

**Scenario:** Users getting logged out randomly.

1.  **Investigate:**
    ```bash
    /diagnose "users getting logged out randomly after 5 mins"
    ```
    *Finding: Session timeout config set to 5m instead of 24h.*

2.  **Fix:**
    ```bash
    /fix "update session timeout to 24h"
    ```
    *Action: Updated `auth.config.ts`.*

3.  **Verify:**
    ```bash
    /validate
    ```
    *Result: Config validated, tests passed.*

## Specialized Debugging

### CI/CD Failures
```bash
/fix "failing GitHub Actions for test suite"
```

### Type Errors
```bash
/fix "TypeScript errors in user service"
```

### Performance
```bash
/diagnose "slow API response times"
```

## Best Practices

1.  **Be Specific**: `/fix "login error"` is worse than `/fix "login 500 error on POST /api/auth"`.
2.  **Validate**: Always run `/validate` after `/fix`.
3.  **Prevent**: If `/diagnose` helps you find a bug, ask it to "add a test case to prevent recurrence".

---

**Key Takeaway**: Use `/diagnose` to find the *Why*, and `/fix` to handle the *How*.
