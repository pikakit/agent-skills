---
name: skill-generator
description: >-
  Autonomous skill generation from patterns, lessons, and feedback.
  Converts high-confidence patterns into validated, production-ready skills.
  Triggers on: generate skill, create skill, pattern to skill, learn.
  Coordinates with: problem-checker, code-constitution.
metadata:
  category: "core"
  version: "1.0.0"
  triggers: "generate skill, create skill, pattern to skill, auto-generate"
  coordinates_with: "problem-checker, code-constitution"
  success_metrics: "≥80% generated skills pass validation"
---

# skill-generator

> **Purpose:** Generate production-ready skills from patterns with validation

---

## 📂 Structure

```
skill-generator/
├── SKILL.md              # This file
├── scripts/
│   ├── generate.js       # Main CLI
│   └── dashboard-server.js
├── lib/
│   ├── pattern-analyzer.js
│   ├── skill-validator.js
│   ├── skill-template.js
│   └── dashboard/
└── tests/
    └── golden-test.js
```

---

## 🔧 Quick Reference

### Generate Candidate

```bash
agent skill-gen generate --from-pattern "pattern-name"
agent skill-gen generate --from-lesson LEARN-001
```

### Validate & Promote

```bash
agent skill-gen validate <skill-id>
agent skill-gen promote <skill-id>
agent skill-gen rollback <skill-id>
```

### List Skills

```bash
agent skill-gen list                    # All
agent skill-gen list --status candidate # Pending
agent skill-gen list --status approved  # In registry
```

---

## 🎯 Skill Contract

Generated skills must satisfy:

| Property | Requirement |
|----------|-------------|
| **Deterministic** | Input/Output defined, testable |
| **Reusable** | Context-independent |
| **Measurable** | Has success metrics |
| **Registrable** | Version + owner in registry |

---

## 🔄 Generation Flow

```mermaid
graph TD
    A[Pattern/Lesson] --> B[Analyzer]
    B --> C{Context Valid?}
    C -->|No| D[Reject]
    C -->|Yes| E[Candidate Skill]
    E --> F[Validator]
    F -->|Fail| G[Report Issues]
    F -->|Pass| H[Promote]
    H --> I[Registry]
```

---

## 🛡️ Validator Checks

| Check | Description |
|-------|-------------|
| Interface | Input/Output defined |
| Naming | kebab-case, valid ID |
| Idempotency | Reproducible output |
| Side-effects | No destructive ops |
| SKILL_DESIGN_GUIDE | Frontmatter, <200 lines |

---

## 📊 Anti-Pattern Rules

Skills rejected if:

- Pattern only in failure path
- < 3 occurrences
- Only from hotfix/user correction

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `problem-checker` | Skill | Error detection |
| `code-constitution` | Skill | Code standards |
| `/autopilot` | Workflow | Auto execution |

---

⚡ PikaKit v3.2.0
