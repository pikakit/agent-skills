---
title: Code Review & Security
description: Automated code quality and security inspection using PikaKit's Inspector Agent
section: guides
category: workflows
order: 6
---

# Code Review & Security

Ensure code quality and security before merging with **PikaKit's** automated inspection engine (`/inspect`).

## Overview

- **Goal**: Detect bugs, security vulnerabilities, and style violations automatically.
- **Agents Used**: `security-auditor`, `code-review`, `offensive-sec`, `test-engineer`.
- **Workflow**: `/inspect`.

## When to Use This Workflow

- **Pre-Commit**: Before committing local changes.
- **Pre-Merge**: Before merging a pull request.
- **Audit**: Periodic security checks.

## Step-by-Step Guide

### 1. Run Inspection (`/inspect`)

Before you commit your changes, run the inspector.

```bash
/inspect
```

**What happens**:
- **Security Check**: Scans for vulnerabilities (OWASP Top 10, Secrets).
- **Code Quality**: Checks linting rules, types, and complexity.
- **Best Practices**: Verifies alignment with project standards.

### 2. Review Report

The output will categorize findings:

```
🔍 Inspection Report

🔴 CRITICAL (Blocker)
- Hardcoded secret found in src/config.ts
- SQL Injection risk in src/db.ts

🟡 WARNING (Should Fix)
- Function complexity too high in auth.controller.ts
- Missing return type in api.ts

🟢 INFO (Nice to Have)
- JSDoc missing for exported function
```

### 3. Fix Issues

Use the Mechanic (`/fix`) to resolve identified issues quickly.

```bash
/fix "remove hardcoded secret in src/config.ts"
/fix "add missing return types"
```

### 4. Security Specific Audit

For a focused security review (e.g., before release), use the specific prompt:

```bash
/inspect "security audit"
```

**Deep Dive Checks**:
- Dependency vulnerabilities (`npm audit`)
- Logic flaws in authentication/authorization
- Data exposure risks

## Integration with Git

### Pre-Commit Hook
You can automate this by adding a hook:

```bash
# .husky/pre-commit
npx pikakit inspect --fail-on-critical
```

### CI/CD Pipeline
Run inspection in your CI pipeline to block bad code.

```yaml
# GitHub Actions example
- name: PikaKit Inspect
  run: npx pikakit inspect
```

## Best Practices

1.  **Zero Criticals**: Never commit code with 🔴 Critical issues.
2.  **Inspect Early**: Run `/inspect` as you code, not just at the end.
3.  **Security First**: If `/inspect` flags a security risk, prioritize it above all else.

---

**Key Takeaway**: `/inspect` acts as your automated senior engineer, catching issues *before* they reach code review.
