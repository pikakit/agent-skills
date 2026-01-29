---
description: Auto-generate C4, Mermaid, and ER diagrams from codebase. Keep architecture docs in sync with code.
---

# Architecture Diagram Generation

Create and update architecture diagrams from code.

## ðŸŽ¯ Purpose

This workflow uses the **system-design** skill to:

- Generate C4 diagrams (Context, Container)
- Create sequence diagrams
- Generate ER diagrams from Prisma schema
- Update diagrams when code changes

## ðŸ¤– Meta-Agents Integration

| Phase | Agent | Action |
| ----- | ----- | ------ |
| **Pre-Generate** | `learner` | Recall diagram conventions |
| **Post-Generate** | `learner` | Log diagram patterns for reuse |

---

## ðŸ”— Chain: documentation (system-design skill only)

**Skills Loaded (1):**

- `system-design` - C4, Mermaid, ER diagrams

## ðŸ“– Usage

```bash
/diagram <scope>
```

### Examples

```bash
# Generate all diagrams
/diagram generate

# Update existing diagrams
/diagram update

# Specific diagram type
/diagram c4-context
```

## ðŸ”„ Workflow Steps

1. **Analyze Codebase**
   - Scan project structure
   - Detect services and dependencies
   - Parse Prisma schema

2. **Generate Diagrams**
   - C4 Context diagram
   - C4 Container diagram
   - Sequence diagrams (key flows)
   - ER diagram from schema

3. **Save to docs/**
   - `docs/diagrams/context.mmd`
   - `docs/diagrams/container.mmd`
   - `docs/diagrams/er.mmd`

## âœ… Success Criteria

âœ“ **Diagrams Created** - C4, sequence, ER  
âœ“ **Auto-update** - Synced with code  
âœ“ **Mermaid Format** - Renderable in GitHub/docs

## ðŸ“Š Diagram Types

| Diagram      | Purpose             | Auto-detects      |
| ------------ | ------------------- | ----------------- |
| C4 Context   | System overview     | External services |
| C4 Container | Internal components | App structure     |
| Sequence     | User flows          | API calls         |
| ER           | Database schema     | Prisma models     |

## ðŸ” Related Workflows

- `/chronicle` - Generate all documentation
- `/build` - Create app first
- `/api` - Create API then diagram

## ðŸ’¡ Example Output

```bash
You: "/diagram update"

Agent: Loading system-design
       â†“

[1/1] ðŸ—ï¸ Updating Diagrams

   Scanning codebase...
   âœ… Detected schema changes (2 new tables)
   âœ… Updated ER diagram
   âœ… Updated C4 Container diagram
   âœ… All diagrams in sync with code

ðŸ“‚ Updated: docs/diagrams/
   - context.mmd
   - container.mmd
   - er.mmd
   - sequence-auth.mmd

âœ… Diagrams updated!
```

---

**Version:** 1.0.0  
**Chain:** documentation (system-design)  
**Added:** v3.6.0 (FAANG upgrade - Phase 3)

