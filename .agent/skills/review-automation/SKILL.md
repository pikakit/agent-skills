---
name: review-automation
description: >-
  Automated Code Review and PR validation. Runs automated checks on code changes.
  Triggers on: automate review, PR check, validate PR, automated audit.
  Coordinates with: code-review, code-constitution, git-workflow.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
metadata:
  version: "3.0.0"
  category: "devops"
  success_metrics: "all checks pass, no blocking issues"
  coordinates_with: "code-review, code-constitution, git-workflow"
---

# Code Reviewer

> **Philosophy:** Code validation should be automated, objective, and empathetic.

## 📚 Knowledge Base

This skill uses the **My Agent Skills Doctrine Pack** to validate changes.

| Component        | Responsibility                        |
| ---------------- | ------------------------------------- |
| **Constitution** | Supreme non-negotiable laws           |
| **Doctrines**    | Architecture, Data, UI specific rules |

## 🔧 Scripts (Execution)

| Script                | Purpose               |
| --------------------- | --------------------- |
| `scripts/review.js`   | Automated PR Reviewer |
| `scripts/validate.js` | Single file validator |

## ⚠️ Critical Checks

- **Constitution Check**: Does this violate any Supreme Law?
- **Architecture Check**: Does this violate layer boundaries?
- **Security Check**: Are there secrets or injection risks?
