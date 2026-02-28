---
name: code-review
description: >-
  Code review and quality control covering linting, static analysis, security, and best practices.
  Use when reviewing PRs, validating code quality, or running automated checks.
  Triggers on: review, PR, lint, format, validate, types, audit, security check.
  Coordinates with: code-craft, security-scanner, test-architect.
allowed-tools: Read, Glob, Grep, Bash
metadata:
  category: "core"
  version: "1.0.0"
  triggers: "review, PR, lint, format, validate, types, audit, security check"
  success_metrics: "lint passes, tsc passes, all blocking issues resolved"
  coordinates_with: "code-craft, security-scanner, test-architect"
---

# Code Review & Quality

> **Purpose:** Comprehensive code validation - from automated linting to human review.

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Reviewing PRs | Follow review checklist |
| Running lint | Use lint_runner.js |
| Type coverage | Use type_coverage.js |
| Security check | Use security-scanner |

---

## Quick Reference

| Task | Command |
|------|---------|
| **Lint (Node)** | `npm run lint` or `npx eslint "path" --fix` |
| **Types (TS)** | `npx tsc --noEmit` |
| **Lint (Python)** | `ruff check "path" --fix` |
| **Security (Node)** | `npm audit --audit-level=high` |
| **Security (Python)** | `bandit -r "path" -ll` |

---

## Part 1: Automated Quality Checks

### The Quality Loop (MANDATORY)

1. **Write/Edit Code**
2. **Run Audit:** `npm run lint && npx tsc --noEmit`
3. **Analyze Report**
4. **Fix & Repeat** - No code committed until checks pass

### Error Handling

- **Lint fails:** Fix style/syntax issues immediately
- **tsc fails:** Correct type mismatches before proceeding
- **No config:** Check for `.eslintrc`, `tsconfig.json`, suggest creating one

---

## Part 2: Review Checklist

### Correctness
- [ ] Code does what it's supposed to do
- [ ] Edge cases handled
- [ ] Error handling in place

### Security
- [ ] Input validated and sanitized
- [ ] No SQL/XSS/CSRF vulnerabilities
- [ ] No hardcoded secrets
- [ ] AI outputs sanitized (if applicable)

### Performance
- [ ] No N+1 queries
- [ ] No unnecessary loops
- [ ] Appropriate caching

### Code Quality
- [ ] Clear naming
- [ ] DRY - no duplicate code
- [ ] SOLID principles followed

### Testing
- [ ] Unit tests for new code
- [ ] Edge cases tested

---

## Anti-Patterns to Flag

```typescript
// ❌ Magic numbers → ✅ Named constants
if (status === 3) {} → if (status === Status.ACTIVE) {}

// ❌ Deep nesting → ✅ Early returns
if (a) { if (b) { if (c) {} } }
→ if (!a) return; if (!b) return; if (!c) return;

// ❌ any type → ✅ Proper types
const data: any = ... → const data: UserData = ...
```

---

## Review Comments Guide

```
🔴 BLOCKING: SQL injection vulnerability
🟡 SUGGESTION: Consider useMemo for performance
🟢 NIT: Prefer const over let
❓ QUESTION: What if user is null here?
```

---

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/lint_runner.js` | Unified lint check |
| `scripts/type_coverage.js` | Type coverage analysis |

---

**Strict Rule:** No code should be committed without passing automated checks.

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `code-craft` | Skill | Code standards |
| `security-scanner` | Skill | Security |
| `test-architect` | Skill | Testing |

---

⚡ PikaKit v3.9.68
