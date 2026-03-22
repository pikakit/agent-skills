---
name: idea-storm
description: >-
  Socratic questioning protocol + user communication. MANDATORY for complex requests, new
  features, or unclear requirements. Includes progress reporting and error handling. Triggers
  on: brainstorm, understand requirements, clarify, unclear, complex request.
metadata:
  author: pikakit
  version: "3.9.105"
---

# Idea Storm â€” Socratic Requirement Clarification

> STOP â†’ ASK â‰¥ 3 questions â†’ WAIT for answers â†’ then implement. Never skip the gate.

---

## Prerequisites

**Required:** None â€” protocol skill with no external dependencies.

---

## When to Use

| Situation | Action |
|-----------|--------|
| "Build/Create [thing]" without details | ðŸ›‘ ASK â‰¥ 3 questions |
| Complex feature or architecture | ðŸ›‘ Clarify before implementing |
| Update/change request | ðŸ›‘ Confirm scope |
| Vague requirements | ðŸ›‘ Ask purpose, users, constraints |
| Simple, clear request | Skip gate; proceed directly |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| 3-question gate (STOP â†’ ASK â†’ WAIT) | Task planning (â†’ project-planner) |
| Structured question format | Architecture decisions (â†’ system-design) |
| Progress reporting (5 icons) | Project scaffolding (â†’ app-scaffold) |
| Error communication (4-step) | Implementation code |

**Expert skill:** Produces structured questions. Does not answer them or implement code.

---

## ðŸ›‘ SOCRATIC GATE (Mandatory)

### Protocol: STOP â†’ ASK â†’ WAIT

1. **STOP** â€” Do NOT start coding
2. **ASK** â€” Minimum 3 questions, covering 3 dimensions:

| Priority | Dimension | Example Question |
|----------|-----------|-----------------|
| P0 | ðŸŽ¯ Purpose | What problem are you solving? |
| P0 | ðŸ‘¥ Users | Who will use this? |
| P1 | ðŸ“¦ Scope | Must-have vs nice-to-have? |

3. **WAIT** â€” Get responses before proceeding

**Limits:** Minimum 3 questions, maximum 5 per round.

---

## Question Format (Fixed Template)

```markdown
### [PRIORITY] **[DECISION POINT]**

**Question:** [Clear question]

**Why This Matters:**
- [Architectural consequence]

**Options:**
| Option | Pros | Cons |
|--------|------|------|
| A | [+] | [-] |
| B | [+] | [-] |

**If Not Specified:** [Default + rationale]
```

**Rules:** Every question has â‰¥ 2 options with pros/cons AND a default.

---

## Progress Icons (Fixed)

| Icon | Status |
|------|--------|
| âœ… | Completed |
| ðŸ”„ | Running |
| â³ | Waiting |
| âŒ | Error |
| âš ï¸ | Warning |

---

## Error Communication (4-Step)

1. **Acknowledge** the error
2. **Explain** what happened (user-friendly)
3. **Offer** specific solutions with trade-offs
4. **Ask** user to choose

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_MISSING_REQUEST` | Yes | User request text not provided |
| `ERR_INVALID_COMPLEXITY` | Yes | Not simple/complex/vague |
| `ERR_REFERENCE_NOT_FOUND` | No | Reference file missing |

**Zero internal retries.** Deterministic; same request = same questions.

---

## Anti-Patterns

| âŒ Don't | âœ… Do |
|---------|-------|
| Jump to solutions | Ask â‰¥ 3 questions first |
| Assume requirements | Clarify with structured questions |
| Over-engineer v1 | Start with scope (must-have vs nice-to-have) |
| Use "I think" phrases | Ask questions with options instead |
| Skip gate for "urgent" requests | Gate is mandatory; no bypass |

---

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Architecture | LOW | `architecture-` |
| 2 | Dynamic | LOW | `dynamic-` |
| 3 | Engineering Spec | LOW | `engineering-` |

## Quick Reference

### 1. Architecture (LOW)

- `architecture-debate` - Architecture Debate Process

### 2. Dynamic (LOW)

- `dynamic-questioning` - Dynamic Question Generation

### 3. Engineering Spec (LOW)

- `engineering-spec` - Idea Storm — Engineering Specification

## How to Use

Read individual rule files for detailed explanations and code examples:

```
rules/architecture-debate.md
rules/dynamic-questioning.md
```

Each rule file contains:
- Brief explanation of why it matters
- Incorrect code example with explanation
- Correct code example with explanation
- Additional context and references


## ðŸ“‘ Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [architecture-debate.md](rules/architecture-debate.md) | 8-phase debate, YAGNI/KISS/DRY | Architecture decisions |
| [dynamic-questioning.md](rules/dynamic-questioning.md) | Dynamic question generation | Advanced questioning |
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec | Architecture review |

---

## ðŸ”— Related

| Item | Type | Purpose |
|------|------|---------|
| `/think` | Workflow | Ideation workflow |
| `project-planner` | Skill | Task planning |
| `app-scaffold` | Skill | Project setup |

---

âš¡ PikaKit v3.9.105
