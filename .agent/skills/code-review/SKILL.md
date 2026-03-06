---
name: code-review
description: >-
  Code review and quality control covering linting, static analysis, security, and best practices.
  5-category review, 4-level comment taxonomy, mandatory quality loop.
  Triggers on: review, PR, lint, format, validate, types, audit, security check.
  Coordinates with: code-craft, security-scanner, test-architect.
metadata:
  version: "2.0.0"
  category: "core"
  triggers: "review, PR, lint, format, validate, types, audit, security check"
  success_metrics: "lint passes, tsc passes, zero blocking issues, merge_ready = true"
  coordinates_with: "code-craft, security-scanner, test-architect"
---

# Code Review & Quality

> 5-category review. 4-level comment taxonomy. Quality loop until zero blocking issues.

---

## Prerequisites

**Required (per language):**
- **TypeScript/JS:** Node.js 18+, ESLint, TypeScript
- **Python:** ruff, bandit

---

## When to Use

| Situation | Action |
|-----------|--------|
| Reviewing PRs | Run review-checklist (5 categories) |
| Running lint/type checks | Use quality-check commands |
| Classifying review findings | Use 4-level comment taxonomy |
| Before committing code | Run quality loop until pass |
| Architecture review | Read `references/engineering-spec.md` |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Quality loop (edit→check→fix→repeat) | Coding standards (→ code-craft) |
| 5-category review checklist (14 items) | Deep security scanning (→ security-scanner) |
| 4-level comment taxonomy (🔴/🟡/🟢/❓) | Test writing (→ test-architect) |
| Lint/type quick commands per language | PR management (→ git-workflow) |
| Lint runner + type coverage scripts | Performance profiling (→ perf-optimizer) |

**Hybrid skill:** Expert review decisions (stateless) + automation scripts (filesystem read).

---

## Quality Loop (Mandatory)

```
1. Write/edit code
2. Run: npm run lint && npx tsc --noEmit  (or ruff check for Python)
3. Analyze report
4. Fix all errors
5. Repeat until ALL checks pass
```

**Strict rule:** No code committed until quality loop passes.

---

## Quick Reference — Commands

| Language | Lint | Types | Security |
|----------|------|-------|----------|
| TypeScript | `npm run lint` or `npx eslint "path" --fix` | `npx tsc --noEmit` | `npm audit --audit-level=high` |
| Python | `ruff check "path" --fix` | mypy / pyright | `bandit -r "path" -ll` |

---

## Review Checklist (5 Categories)

| Category | Key Checks |
|----------|-----------|
| **Correctness** | Does what it should; edge cases handled; error handling in place |
| **Security** | Input validated; no SQL/XSS/CSRF; no hardcoded secrets; AI outputs sanitized |
| **Performance** | No N+1 queries; no unnecessary loops; caching where appropriate |
| **Quality** | Clear naming; DRY; SOLID principles |
| **Testing** | Unit tests for new code; edge cases tested |

---

## Comment Taxonomy (4 Levels)

| Level | Prefix | Meaning | Blocks Merge |
|-------|--------|---------|-------------|
| 🔴 | `BLOCKING` | Must fix before merge | Yes |
| 🟡 | `SUGGESTION` | Recommended improvement | No |
| 🟢 | `NIT` | Minor style preference | No |
| ❓ | `QUESTION` | Needs clarification | Depends |

**Merge gate:** `merge_ready = (blocking_count === 0)`. Deterministic; no override.

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_MISSING_LANGUAGE` | Yes | Language not specified |
| `ERR_MISSING_INPUT` | Yes | Code/files not provided |
| `ERR_SCRIPT_FAILED` | Yes | Lint/type script execution error |
| `WARN_UNKNOWN_LANGUAGE` | Yes | Language not recognized; generic applied |
| `WARN_NO_CONFIG` | Yes | No lint/type config found |

**Zero internal retries.** Quality loop is caller-driven (edit→check→fix→repeat).

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Commit with lint errors | Run quality loop until pass |
| Review only code style | Check all 5 categories |
| Leave ambiguous comments | Use 4-level taxonomy (🔴/🟡/🟢/❓) |
| Skip security review | Check inputs, secrets, injection |
| Override blocking issues | Resolve all 🔴 before merge |
| Walk away after approval | Re-check if code changed after review |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [scripts/lint_runner.js](scripts/lint_runner.js) | Unified lint check script | Running automated lint |
| [engineering-spec.md](references/engineering-spec.md) | Full engineering spec: contracts, security, scalability | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `code-craft` | Skill | Coding standards and naming rules |
| `security-scanner` | Skill | Deep security vulnerability detection |
| `test-architect` | Skill | Test writing and coverage |
| `code-constitution` | Skill | Constitutional governance |

---

⚡ PikaKit v3.9.86
