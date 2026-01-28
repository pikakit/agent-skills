---
name: review-automation
version: 3.0.0
description: Automated Code Review and PR validation.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Code Reviewer

> **Philosophy:** Code validation should be automated, objective, and empathetic.

## 📚 Knowledge Base

This skill uses the **My Agent Skills Doctrine Pack** to validate changes.

| Component | Responsibility |
|-----------|----------------|
| **Constitution** | Supreme non-negotiable laws |
| **Doctrines** | Architecture, Data, UI specific rules |

## 🔧 Scripts (Execution)

| Script | Purpose |
|--------|---------|
| `scripts/review.js` | Automated PR Reviewer |
| `scripts/validate.js` | Single file validator |

## ⚠️ Critical Checks

- **Constitution Check**: Does this violate any Supreme Law?
- **Architecture Check**: Does this violate layer boundaries?
- **Security Check**: Are there secrets or injection risks?
