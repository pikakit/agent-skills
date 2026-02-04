---
name: idea-storm
description: >-
  Socratic questioning protocol + user communication. MANDATORY for complex requests,
  new features, or unclear requirements. Includes progress reporting and error handling.
  Triggers on: brainstorm, understand requirements, clarify, unclear, complex request.
  Coordinates with: project-planner, creative-thinking, app-scaffold.
metadata:
  category: "planning"
  version: "1.0.0"
  triggers: "brainstorm, requirements, clarify, unclear, complex, think"
  coordinates_with: "project-planner, app-scaffold"
  success_metrics: "requirements clarified, 3+ questions answered"
---

# Brainstorming & Communication

> **Purpose:** Socratic questioning to clarify requirements before implementation.

---

## When to Use

| Situation | Action |
|-----------|--------|
| "Build/Create [thing]" without details | 🛑 ASK 3 questions |
| Complex feature or architecture | 🛑 Clarify before implementing |
| Update/change request | 🛑 Confirm scope |
| Vague requirements | 🛑 Ask purpose, users, constraints |

---

## 🛑 SOCRATIC GATE

### Mandatory 3 Questions Before Implementation

1. **STOP** - Do NOT start coding
2. **ASK** - Minimum 3 questions:
   - 🎯 Purpose: What problem are you solving?
   - 👥 Users: Who will use this?
   - 📦 Scope: Must-have vs nice-to-have?
3. **WAIT** - Get response before proceeding

---

## Question Format

```markdown
### [PRIORITY] **[DECISION POINT]**

**Question:** [Clear question]

**Why This Matters:**
- [Architectural consequence]

**Options:**
| Option | Pros | Cons |
|--------|------|------|
| A | [+] | [-] |

**If Not Specified:** [Default + rationale]
```

---

## Progress Reporting

| Icon | Meaning |
|------|---------|
| ✅ | Completed |
| 🔄 | Running |
| ⏳ | Waiting |
| ❌ | Error |
| ⚠️ | Warning |

---

## Error Handling Pattern

1. Acknowledge the error
2. Explain what happened (user-friendly)
3. Offer specific solutions with trade-offs
4. Ask user to choose

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| Jump to solutions | Ask first |
| Assume requirements | Clarify |
| Over-engineer v1 | Start simple |
| "I think" phrases | Ask instead |

---

## 📑 Content Map

| File | Description |
|------|-------------|
| `references/architecture-debate.md` | 8-phase debate process, YAGNI/KISS/DRY |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `/think` | Workflow | Ideation workflow |
| `project-planner` | Skill | Task planning |
| `app-scaffold` | Skill | Project setup |

---

⚡ PikaKit v3.2.0
