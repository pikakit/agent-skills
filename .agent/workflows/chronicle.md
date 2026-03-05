---
description: Auto-documentation engine. README, API specs, ADR, Storybook, runbooks, and inline comments with zero effort.
---

# /chronicle - Documentation Engine

$ARGUMENTS

---

## Purpose

Generate comprehensive project documentation automatically by analyzing source code, extracting types, and producing structured docs. **Differs from `/diagram` (visual architecture diagrams) by focusing on written documentation — README, API specs, ADR, component docs, ops runbooks, and inline comments.** Uses `documentation-writer` for all doc generation, with `doc-templates` for structure and `markdown-novel-viewer` for preview.

---

## 🤖 Meta-Agents Integration

| Phase | Agent | Action |
|-------|-------|--------|
| **Pre-Analysis** | `assessor` | Evaluate documentation scope and coverage gaps |
| **Post-Generation** | `learner` | Learn doc patterns and templates for reuse |

```
Flow:
assessor.evaluate(doc_scope) → identify coverage gaps
       ↓
analyze codebase → generate docs per sub-command
       ↓
learner.log(templates, patterns)
```

---

## Sub-Commands

| Command | Purpose | Output |
|---------|---------|--------|
| `/chronicle` | Full documentation suite | All doc types below |
| `/chronicle readme` | Generate/update README.md | `README.md` |
| `/chronicle api` | API documentation (OpenAPI) | `docs/api.yaml` |
| `/chronicle inline` | Add inline code comments (JSDoc/TSDoc) | Source file annotations |
| `/chronicle adr` | Architecture Decision Record | `docs/adr/NNN-title.md` |
| `/chronicle storybook` | Component documentation | Story files |
| `/chronicle runbook` | Ops runbook | `docs/runbooks/*.md` |
| `/chronicle changelog` | Generate CHANGELOG.md | `CHANGELOG.md` |
| `/chronicle [file-path]` | Document specific file | File annotations |

---

## 🔴 MANDATORY: Documentation Generation Protocol

### Phase 1: Codebase Analysis

| Field | Value |
|-------|-------|
| **INPUT** | $ARGUMENTS (sub-command + optional scope) |
| **OUTPUT** | Documentation scope: files to document, gaps identified, doc type |
| **AGENTS** | `documentation-writer` |
| **SKILLS** | `doc-templates` |

1. Scan project structure and identify:
   - Source files and their exports
   - API routes and endpoint definitions
   - Component files and their props
   - Existing documentation (for update vs create)
2. `assessor` evaluates coverage gaps
3. Determine documentation scope based on sub-command

### Phase 2: Documentation Generation

| Field | Value |
|-------|-------|
| **INPUT** | Scope analysis from Phase 1 |
| **OUTPUT** | Generated documentation files |
| **AGENTS** | `documentation-writer` |
| **SKILLS** | `doc-templates` |

Generate docs based on sub-command:

**README.md** — Extract from code:
```markdown
# Project Name
> One-line description
## Features
## Quick Start (Prerequisites, Installation, Environment)
## Architecture
## API Reference
## Contributing
## License
```

**API Documentation** — Source-to-spec:

| Source | Tool | Output |
|--------|------|--------|
| Express/Fastify | swagger-autogen | OpenAPI 3.1 |
| tRPC | trpc-openapi | OpenAPI 3.1 |
| GraphQL | Introspection | Schema docs |
| FastAPI | Built-in | Auto-generated |

**ADR** — Decision records:
```markdown
# ADR-NNN: [Decision Title]
## Status: Accepted | Date: YYYY-MM-DD
## Context (why the decision was needed)
## Decision (what was chosen)
## Consequences (trade-offs: ✅ pros, ⚠️ cons)
## Alternatives Considered (comparison table)
```

**Inline Comments** — JSDoc/TSDoc annotations for exported functions, classes, and types.

**Runbooks** — Operational procedures:
```markdown
# Runbook: [Scenario]
## Severity: P1/P2/P3
## Impact: [User-facing effect]
## Diagnosis (step-by-step investigation)
## Resolution (fix steps with commands)
## Prevention (monitoring + alerts)
```

### Phase 3: Verification & Coverage

| Field | Value |
|-------|-------|
| **INPUT** | Generated docs from Phase 2 |
| **OUTPUT** | Coverage report: documented vs total, gaps remaining |
| **AGENTS** | `documentation-writer` |
| **SKILLS** | `doc-templates`, `markdown-novel-viewer` |

1. Verify all generated docs are valid markdown
2. Check documentation coverage:
   - Functions documented vs total
   - API endpoints documented vs total
   - Components with stories vs total
3. Log templates and patterns via `learner`

---

## ⛔ MANDATORY: Problem Verification Before Completion

> **CRITICAL:** This check MUST be performed before any `notify_user` or task completion.

### Check @[current_problems]

```
1. Read @[current_problems] from IDE
2. If errors/warnings > 0:
   a. Auto-fix: imports, types, lint errors
   b. Re-check @[current_problems]
   c. If still > 0 → STOP → Notify user
3. If count = 0 → Proceed to completion
```

### Auto-Fixable

| Type | Fix |
|------|-----|
| Missing import | Add import statement |
| Invalid JSDoc | Fix annotation syntax |
| Lint errors | Run eslint --fix |

> **Rule:** Never mark complete with errors in `@[current_problems]`.

---

## Output Format

```markdown
## 📚 Chronicle Complete

### Generated Files

| File | Type | Lines | Status |
|------|------|-------|--------|
| README.md | Markdown | 89 | ✅ Created |
| docs/api.yaml | OpenAPI | 234 | ✅ Created |
| docs/adr/001-database.md | ADR | 45 | ✅ Created |
| CHANGELOG.md | Changelog | 52 | ✅ Created |

### Coverage

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Functions documented | 45/52 | 100% | ⏳ 87% |
| API endpoints | 12/12 | 100% | ✅ 100% |
| ADRs | 3 | Ongoing | ✅ |
| Runbooks | 5 | Key scenarios | ✅ |

### Next Steps

- [ ] Review generated documentation for accuracy
- [ ] Fill remaining coverage gaps
- [ ] Run `/diagram` for architecture visuals
```

---

## Examples

```
/chronicle
/chronicle readme
/chronicle api
/chronicle adr "Use Redis for session caching"
/chronicle inline src/services/
/chronicle runbook
/chronicle storybook
```

---

## Key Principles

- **Code as source of truth** — extract docs from code, don't write manually
- **ADRs are mandatory** — every architectural decision needs documented context (why, not just what)
- **Examples matter** — always include usage examples in API docs and README
- **Types are documentation** — TypeScript annotations serve as living docs
- **Keep docs current** — regenerate on code changes to prevent drift

---

## 🔗 Workflow Chain

**Skills Loaded (2):**

- `doc-templates` - Documentation templates and structure guidelines
- `markdown-novel-viewer` - Markdown preview and rendering

```mermaid
graph LR
    A["/build"] --> B["/chronicle"]
    B --> C["/diagram"]
    style B fill:#10b981
```

| After /chronicle | Run | Purpose |
|-----------------|-----|---------|
| Need architecture diagrams | `/diagram` | Generate C4, Mermaid, ER diagrams |
| Need doc quality review | `/inspect` | Verify documentation quality |
| Ready to deploy | `/launch` | Deploy with documentation |

**Handoff to /diagram:**

```markdown
📚 Documentation generated! [X] files created, [Y]% function coverage.
Run `/diagram` to add architecture visuals (C4, Mermaid, ER).
```
