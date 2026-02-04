---
name: git-workflow
description: >-
  Git operations with conventional commits, auto-split logic, secret detection.
  Stage, commit, push, PR, merge with security scanning.
  Triggers on: git, commit, push, PR, merge, conventional commits.
  Coordinates with: cicd-pipeline, code-review.
metadata:
  version: "1.0.0"
  category: "devops"
  triggers: "git, commit, push, PR, merge, branch, conventional commits"
  success_metrics: "clean history, no secrets, conventional format"
  coordinates_with: "cicd-pipeline, code-review, security-scanner"
---

# Git Workflow

> Conventional commits. Secret detection. Clean history.

---

## Commands

| Command | Action |
|---------|--------|
| `cm` | Stage + commit |
| `cp` | Stage + commit + push |
| `pr` | Create Pull Request |
| `merge` | Merge branches |

---

## Workflow

```bash
# 1. Stage + Analyze
git add -A && git diff --cached --stat

# 2. Security Check
git diff --cached | grep -iE "(api[_-]?key|token|password|secret)"
# If found → STOP, warn, suggest .gitignore

# 3. Commit
git commit -m "type(scope): description"

# 4. Push (optional)
git push origin HEAD
```

---

## Conventional Commits

```
type(scope): description

[optional body]
[optional footer]
```

### Types

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

---

## Commit Splitting

**Split if:**
- Different types mixed (feat + fix)
- Multiple scopes (auth + payments)
- Config/deps + code mixed
- FILES > 10 unrelated

**Single commit if:**
- Same type/scope
- FILES ≤ 3
- LINES ≤ 50

---

## Security Check

**Block commit if detected:**

```bash
# Patterns
API_KEY=xxx
token: "xxx"
password: xxx
secret: xxx
```

**Action:** STOP → Warn → Suggest `.gitignore`

---

## Output Format

```markdown
✓ staged: N files (+X/-Y lines)
✓ security: passed
✓ commit: HASH type(scope): description
✓ pushed: yes/no
```

---

## Error Handling

| Error | Action |
|-------|--------|
| Secrets detected | Block, show files |
| No changes | Exit cleanly |
| Push rejected | `git pull --rebase` |
| Merge conflicts | Manual resolution |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `cicd-pipeline` | Skill | CI/CD deployment |
| `code-review` | Skill | PR review |
| `gitops-workflow` | Skill | ArgoCD/Flux GitOps |

---

⚡ PikaKit v3.2.0
