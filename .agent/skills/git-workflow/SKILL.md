---
name: git-workflow
description: >-
  Enforce Conventional Commits and traceability between code and requirements.
  Triggers on: git, commit, branch, merge, PR, conventional commits.
  Coordinates with: code-review, review-automation, cicd-pipeline.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
metadata:
  version: "3.0.0"
  category: "devops"
  success_metrics: "commits follow convention, history traceable"
  coordinates_with: "code-review, review-automation, cicd-pipeline"
---

# Git Conventions

> **Philosophy:** A commit message is a love letter to the future maintainer.

## 📚 Atomic Rules (Knowledge)

| Rule                                             | Description                          |
| ------------------------------------------------ | ------------------------------------ |
| [rules/commit-format.md](rules/commit-format.md) | Conventional Commits structure       |
| [rules/traceability.md](rules/traceability.md)   | Linking commits to requirements/docs |

## 🔧 Scripts (Execution)

| Script                  | Purpose                       |
| ----------------------- | ----------------------------- |
| `scripts/commit_msg.py` | Commit message hook validator |

## ⚠️ Critical Anti-Patterns

- **"WIP" Commits**: Do not push commits named just "WIP" or "fix".
- **No Scope**: Always provide a scope (e.g., `feat(auth):`).
