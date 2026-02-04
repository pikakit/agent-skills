---
name: code-craft
description: >-
  Pragmatic coding standards - concise, direct, no over-engineering.
  Use when writing production code, reviewing code quality, or establishing coding standards.
  Triggers on: code style, clean code, best practices, naming conventions, SRP, DRY, KISS.
  Coordinates with: code-review, test-architect.
metadata:
  version: "3.0.0"
  priority: "CRITICAL"
  category: "core"
  triggers: "code style, clean code, best practices, naming conventions, SRP, DRY, KISS"
  success_metrics: "lint errors = 0, code review approved"
  coordinates_with: "code-review, test-architect"
---

# Clean Code - Pragmatic AI Coding Standards

> **CRITICAL SKILL** - Be **concise, direct, and solution-focused**.

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Writing code | Follow core principles |
| Naming | Use naming rules |
| Functions | Follow function rules |
| Completing task | Run self-check |

---

## Core Principles

| Principle     | Rule                                                       |
| ------------- | ---------------------------------------------------------- |
| **SRP**       | Single Responsibility - each function/class does ONE thing |
| **DRY**       | Don't Repeat Yourself - extract duplicates, reuse          |
| **KISS**      | Keep It Simple - simplest solution that works              |
| **YAGNI**     | You Aren't Gonna Need It - don't build unused features     |
| **Boy Scout** | Leave code cleaner than you found it                       |

---

## Naming Rules

| Element       | Convention                                            |
| ------------- | ----------------------------------------------------- |
| **Variables** | Reveal intent: `userCount` not `n`                    |
| **Functions** | Verb + noun: `getUserById()` not `user()`             |
| **Booleans**  | Question form: `isActive`, `hasPermission`, `canEdit` |
| **Constants** | SCREAMING_SNAKE: `MAX_RETRY_COUNT`                    |

---

## Function Rules

| Rule                | Description                           |
| ------------------- | ------------------------------------- |
| **Small**           | Max 20 lines, ideally 5-10            |
| **One Thing**       | Does one thing, does it well          |
| **One Level**       | One level of abstraction per function |
| **Few Args**        | Max 3 arguments, prefer 0-2           |
| **No Side Effects** | Don't mutate inputs unexpectedly      |

---

## Code Structure

| Pattern           | Apply                             |
| ----------------- | --------------------------------- |
| **Guard Clauses** | Early returns for edge cases      |
| **Flat > Nested** | Avoid deep nesting (max 2 levels) |
| **Composition**   | Small functions composed together |
| **Colocation**    | Keep related code close           |

---

## Anti-Patterns

| ❌ Don't                 | ✅ Do                   |
| ------------------------ | ----------------------- |
| Comment every line       | Delete obvious comments |
| Helper for one-liner     | Inline the code         |
| Deep nesting             | Guard clauses           |
| Magic numbers            | Named constants         |
| God functions            | Split by responsibility |

---

## Before Editing ANY File

| Question                        | Why                      |
| ------------------------------- | ------------------------ |
| **What imports this file?**     | They might break         |
| **What does this file import?** | Interface changes        |
| **What tests cover this?**      | Tests might fail         |

> 🔴 **Rule:** Edit the file + all dependent files in the SAME task.

---

## Self-Check Before Completing

| Check                     | Question                          |
| ------------------------- | --------------------------------- |
| ✅ **Goal met?**          | Did I do exactly what user asked? |
| ✅ **Files edited?**      | Did I modify all necessary files? |
| ✅ **Code works?**        | Did I test/verify the change?     |
| ✅ **No errors?**         | Lint and TypeScript pass?         |

> 🔴 **Rule:** If ANY check fails, fix it before completing.

---

## 📑 Content Map

| File | When to Read |
|------|--------------|
| `references/verification-scripts.md` | Running validation scripts |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `code-review` | Skill | Code quality |
| `test-architect` | Skill | Testing |
| `code-constitution` | Skill | Governance |

---

⚡ PikaKit v3.2.0
