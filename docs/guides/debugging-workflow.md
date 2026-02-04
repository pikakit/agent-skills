---
title: Debugging & Fixing Workflow
description: Systematic approach to debugging and fixing issues using PikaKit's diagnostic agents
section: guides
category: workflows
order: 5
---

# Debugging & Fixing Workflow

Learn how to systematically investigate, fix, and verify bug fixes using **PikaKit's** debugging workflow - from log analysis to production deployment.

## Overview

- **Goal**: Debug and fix issues systematically with root cause analysis.
- **Time**: 5-20 minutes (vs 1-4 hours manually).
- **Agents Used**: `debug-pro`, `test-engineer`, `security-auditor`.
- **Workflows**: `/diagnose`, `/fix`, `/validate`.

## When to Use This Workflow

- **Production Bugs**: Critical issues affecting users.
- **Test Failures**: CI/CD breakage.
- **Performance Issues**: Slow endpoints or memory leaks.
- **Security Vulnerabilities**: Potential exploits.

## Choosing the Right Approach

PikaKit adapts to different debugging scenarios based on your input command:

| Scenario | Command Pattern | Complexity | Time |
|----------|-----------------|------------|------|
| **Quick Fix** | `/fix --quick "..."` | Low | 2-5 min |
| **Complex Bug** | `/fix "..."` | High | 10-20 min |
| **Log Analysis** | `/fix "analyze log file..."` | Medium | 5-15 min |
| **UI/Visual** | `/fix "button misaligned..."` | Low-Medium | 3-10 min |
| **CI Failure** | `/fix "GitHub action failed..."` | Medium | 5-15 min |

## Step-by-Step Workflow

### Step 1: Reproduce the Bug

Before fixing, confirm you can reproduce the issue.

```bash
# Example: Bug report "Users can't login"
curl -X POST http://localhost:3000/api/auth/login ...
# Expected: 200 OK
# Actual: 401 Unauthorized
```

### Step 2: Choose Debugging Strategy

#### Option A: Quick Fix (`/fix --quick`)

For simple, isolated bugs where the cause is obvious.

```bash
/fix --quick "users getting 401 on login with valid credentials"
```

**What happens**: Agent skips deep analysis, locates the file, identifies the logical error (e.g., wrong comparison operator), and applies the patch immediately.

#### Option B: Complex Fix (`/fix`)

For bugs requiring investigation across multiple files.

```bash
/fix "memory leak in WebSocket connections causing server crashes"
```

**What happens**:
1.  **Investigation**: Analyzes event listeners and connection cleanup.
2.  **Planning**: Creates a fix plan.
3.  **Implementation**: Adds cleanup handlers and connection pooling.
4.  **Verification**: Runs stress tests.

#### Option C: Production Log Analysis (`/diagnose`)

For bugs discovered in logs without clear reproduction.

```bash
/diagnose "analyze production logs to identify auth failures"
```

*Followed by:*
```bash
/fix "implement token expiry validation based on diagnosis"
```

#### Option D: UI Bug Fix (`/fix`)

For visual or layout issues.

```bash
/fix "checkout button misaligned on mobile devices"
```

**What happens**: Agent identifies the component (`Button.css`), adds media queries, and verifies responsive layout.

#### Option E: CI/CD Fix (`/fix`)

For build or deployment failures.

```bash
/fix "failing GitHub Actions for test suite"
```

**What happens**: Agent parses CI logs, identifies missing dependencies or config errors, and updates `package.json` or YAML configs.

### Step 3: Verify the Fix (`/validate`)

Always verify fixes thoroughly.

```bash
/validate
```

**What happens**:
- Runs the specific test case for the bug.
- Runs the full regression suite.
- Checks for security regressions.

### Step 4: Document the Fix (`/chronicle`)

Update documentation to reflect the change.

```bash
/chronicle
```

## Real Example: E-Commerce Cart Bug

**Bug Report**: "Shopping cart duplicating items on page refresh"

1.  **Investigate & Fix**:
    ```bash
    /fix "shopping cart duplicating items on page refresh"
    ```
    *Root Cause: Cart stored in both localStorage and DB, merging incorrectly on load.*

2.  **Implementation**:
    - **src/store/cart.js**: Added deduplication logic.
    - **tests/cart/sync.test.js**: Added duplicate detection tests.

3.  **Verification**:
    ```bash
    /validate
    ```
    *Result: 15 new tests passed, 0 regressions.*

## Troubleshooting

### Issue: Can't Reproduce Bug
**Solution**: Use logs as the source of truth.
```bash
/diagnose "analyze production error logs"
```

### Issue: Fix Breaks Other Features
**Solution**: Revert and analyze dependencies.
```bash
/fix "revert last change and fix login without breaking logout"
```

### Issue: Root Cause Unclear
**Solution**: Use `/diagnose` before `/fix`.
```bash
/diagnose "detailed description of symptoms"
```

## Best Practices

1.  **Reproduce First**: Never fix what you can't reproduce.
2.  **Specific Prompts**: The more specific your description, the faster the fix.
3.  **Quick vs Deep**: Use `--quick` for typos/lints; use standard `/fix` for logic.
4.  **Always Validate**: Run `/validate` before committing.

---

**Key Takeaway**: PikaKit's debugging workflow turns hours of manual investigation into minutes of automated resolution.
