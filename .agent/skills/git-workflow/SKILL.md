---
name: git-workflow
description: >-
  Git operations with conventional commits, auto-split logic, secret detection. Stage, commit,
  push, PR, merge with security scanning. Triggers on: git, commit, push, PR, merge,
  conventional commits.
metadata:
  author: pikakit
  version: "3.9.105"
---

# Git Workflow â€” Conventional Commits + Secret Detection

> Scan before commit. Conventional format. Split if mixed. Rebase on rejection.

---

## Prerequisites

**Required:** Git installed. `gh` CLI for PR creation.

---

## When to Use

| Command | Action | Side Effects |
|---------|--------|-------------|
| `cm` | Stage + commit | Git index + local commit |
| `cp` | Stage + commit + push | Git index + local + remote |
| `pr` | Create Pull Request | Remote PR via `gh` |
| `merge` | Merge branches | Branch history modified |
| `status` | Read-only status | None |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Git stage, commit, push | CI/CD pipelines (â†’ cicd-pipeline) |
| Secret detection (6 patterns) | Code review (â†’ code-review) |
| Conventional commit format (9 types) | GitOps deploy (â†’ gitops-workflow) |
| Commit splitting (threshold-based) | Git server administration |
| Push recovery (rebase once) | Advanced merge strategies |

**Automation skill:** Executes git commands. Modifies git index, local repo, and remote.

---

## Workflow

```bash
# 1. Stage
git add -A && git diff --cached --stat

# 2. Secret Scan (MANDATORY â€” blocks commit)
git diff --cached | grep -iE "(api[_-]?key|token|password|secret|private_key|credentials)"
# If found â†’ BLOCK, return violations

# 3. Commit (conventional format)
git commit -m "type(scope): description"

# 4. Push (cp only)
git push origin HEAD
# If rejected â†’ git pull --rebase â†’ retry once
```

---

## Conventional Commit Types (9)

| Type | When |
|------|------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `refactor` | Code restructuring |
| `test` | Tests |
| `chore` | Maintenance |
| `perf` | Performance |
| `ci` | CI/CD |
| `build` | Build system |

**Format:** `type(scope): description` â€” no deviations.

---

## Commit Splitting Rules

| Condition | Decision |
|-----------|----------|
| â‰¤ 3 files AND â‰¤ 50 lines AND same type/scope | **Single commit** |
| > 10 unrelated files | **Split** |
| Mixed types (feat + fix) | **Split** |
| Multiple scopes (auth + payments) | **Split** |
| Config/deps + code mixed | **Split** |

---

## Secret Detection (6 Patterns â€” Blocks Commit)

| Pattern | Example |
|---------|---------|
| `API_KEY` | `API_KEY=sk_live_xxx` |
| `token` | `token: "ghp_xxx"` |
| `password` | `password: xxx` |
| `secret` | `secret: xxx` |
| `private_key` | `PRIVATE_KEY=xxx` |
| `credentials` | `credentials: {...}` |

**Action:** BLOCK â†’ Return violations (file + line) â†’ User removes + .gitignore.

---

## Session Lifecycle

```
IDLE â†’ STAGING              [cm/cp invoked]
STAGING â†’ SCANNING          [files staged]
SCANNING â†’ BLOCKED          [secrets detected]  // terminal
SCANNING â†’ COMMITTING       [scan passed]
COMMITTING â†’ PUSHING        [cp command]
COMMITTING â†’ COMPLETED      [cm command]  // terminal
PUSHING â†’ REBASING          [push rejected]
PUSHING â†’ COMPLETED         [push accepted]  // terminal
REBASING â†’ PUSHING          [rebase succeeded]
REBASING â†’ CONFLICT         [merge conflicts]  // terminal
```

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_SECRETS_DETECTED` | Yes | Credentials in staged diff |
| `ERR_NOTHING_TO_COMMIT` | Yes | No staged changes |
| `ERR_PUSH_REJECTED` | Yes | Remote rejected after rebase |
| `ERR_MERGE_CONFLICT` | Yes | Merge conflict |
| `ERR_GIT_NOT_FOUND` | No | Git not installed |
| `ERR_INVALID_TYPE` | Yes | Commit type not in list |
| `ERR_FORCE_PUSH_DENIED` | No | Force push without approval |

---

## Anti-Patterns

| âŒ Don't | âœ… Do |
|---------|-------|
| Skip secret scan | Scan before every commit |
| Monolithic commits (>10 files) | Split by type/scope |
| Non-conventional messages | `type(scope): description` |
| Force push without approval | Request explicit approval |
| `git push --force` on shared branches | `git pull --rebase` first |

---

## ðŸ“‘ Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec | Architecture review |

---

## ðŸ”— Related

| Item | Type | Purpose |
|------|------|---------|
| `cicd-pipeline` | Skill | CI/CD deployment |
| `code-review` | Skill | PR review patterns |
| `gitops-workflow` | Skill | ArgoCD/Flux GitOps |
| `security-scanner` | Skill | Advanced secret scanning |

---

âš¡ PikaKit v3.9.105
