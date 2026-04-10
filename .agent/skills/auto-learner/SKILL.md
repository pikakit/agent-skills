---
name: auto-learner
description: >-
  Autonomous learning: extracts patterns from IDE errors, user corrections, and agent failures.
  Use when user indicates a mistake ("wrong", "fix this", "loi", "sai") to capture lessons.
  NOT for applying existing patterns (use auto-learned) or debugging (use debug-pro).
category: autonomous-learning
triggers: ["auto-learn", "mistake", "error fix", "pattern extraction"]
coordinates_with: ["auto-learned", "problem-checker", "skill-generator"]
success_metrics: ["Actionable Lesson Rate", "Lesson Extraction Speed", "False Positive Rate"]
metadata:
  author: pikakit
  version: "3.9.125"
---

# Auto-Learner

Autonomous learning engine that extracts **actionable** patterns from errors, corrections, and failures.

---

## ⛔ Quality Gate — MANDATORY Before Recording

> 🔴 Every pattern MUST pass this gate. Garbage in = garbage out.

### Pattern Rejection Rules:

| Reject If | Reason | Example |
|-----------|--------|---------|
| Error is a **local variable** out of scope | Not an import issue — it's a refactoring artifact | `Cannot find name 'chartRef'` where chartRef is a useRef |
| Solution is just "Add import for X" with no path | Zero actionable value — WHERE to import from? | ❌ "Fix: Add import for 'isDark'" |
| Error occurred during active refactoring | Temporary state, will resolve itself | Extracting components mid-edit |
| Pattern has < 3 occurrences across sessions | Noise, not a pattern | One-off typo |
| Error is project-specific, not generalizable | Won't help other projects | `Cannot find module './mySpecificFile'` |

### Pattern Acceptance Rules:

| Accept If | Required Fields | Example |
|-----------|----------------|---------|
| Error recurs across files/sessions | error_signature + solution + import_path | `React` not found → `import React from 'react'` |
| Solution includes **exact fix** | Before/after code | `&&` fails in PowerShell → use `;` instead |
| Pattern is framework-generalizable | context.framework + context.file_type | Missing `'use client'` in Next.js app-router |

### Required Fields for Every Pattern:

```yaml
- error_signature: "exact IDE error text"
  solution: "exact code to fix it"        # NOT "add import for X"
  import_from: "module-path"              # Required for import patterns
  before: "broken code snippet"           # What the error looked like
  after: "fixed code snippet"             # What the fix looked like
  confidence: high|medium|low
  generalizable: true|false               # Can other projects use this?
```

---

## Trigger Words

| Language | Keywords |
|----------|----------|
| EN | "mistake", "wrong", "fix this", "broken" |
| VI | "lỗi", "sai", "hỏng", "sửa lại" |

---

## Protocol

```
1. DETECT  → Error or user correction detected
2. FILTER  → Apply Quality Gate (reject noise)
3. ANALYZE → Extract root cause (5 Whys)
4. ENRICH  → Capture EXACT fix (before/after, import path)
5. STORE   → Write to auto-learned/patterns/ with full solution
6. CONFIRM → Output: 📚 Learned: [LEARN-XXX]
```

---

## Lesson Schema

```yaml
- id: LEARN-XXX
  pattern: "error signature"
  severity: CRITICAL|HIGH|MEDIUM|LOW
  message: "fix instruction with EXACT code"
  import_from: "module-path"           # For import errors
  before: "code that caused the error"
  after: "code that fixes it"
  date: "YYYY-MM-DD"
  trigger: "what caused this"
  fix_applied: boolean
  generalizable: boolean
```

## Category IDs

| Category | Pattern |
|----------|---------|
| Safety | `SAFE-XXX` |
| Code | `CODE-XXX` |
| Workflow | `FLOW-XXX` |
| Integration | `INT-XXX` |

---

## Anti-Patterns (NEVER DO)

| ❌ Don't | ✅ Do |
|---------|-------|
| Record "Add import for 'X'" without path | Record `import { X } from 'exact/path'` |
| Record local variable scope errors as imports | Recognize useRef/useState vars are NOT imports |
| Generate 294-line skills repeating the same fix | Generate concise, actionable patterns |
| Accept every IDE error as a pattern | Filter through Quality Gate first |
| Create skills named "import-imports" | Use descriptive names like "react-import-patterns" |

---

## Integration

| Dependency | Direction | Purpose |
|-----------|-----------|---------|
| `auto-learned` | Writes to | Pattern storage |
| `problem-checker` | Receives from | IDE error signals |
| `skill-generator` | Feeds into | High-quality patterns → new skills |

---

⚡ PikaKit v3.9.125
