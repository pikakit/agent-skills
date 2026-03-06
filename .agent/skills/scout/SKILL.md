---
name: scout
description: >-
  Fast codebase scouting using parallel exploration for file discovery.
  Divide and conquer approach for context gathering.
  Triggers on: find files, locate, codebase structure, explore, search.
  Coordinates with: knowledge-graph, code-review.
metadata:
  version: "2.0.0"
  category: "development"
  triggers: "find files, locate, codebase structure, explore, search"
  success_metrics: "files found, structure understood, <3 min"
  coordinates_with: "knowledge-graph, code-review"
---

# Scout — Fast Codebase Exploration

> Divide and conquer. 4 agents max. 200K tokens each. 3-minute timeout. No overlap.

---

## When to Use

| Situation | Action |
|-----------|--------|
| Starting new feature | Scout relevant files |
| Debugging session | Find related files |
| Understanding structure | Map project layout |
| Before refactoring | Identify impact scope |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Search strategy (task analysis) | Semantic code analysis (→ knowledge-graph) |
| Directory segmentation (no overlap) | Code quality review (→ code-review) |
| Context budgeting (200K/agent) | File modification |
| Report template | Agent orchestration |

**Expert decision skill:** Produces scouting strategies. Does not execute searches.

---

## 4-Step Scouting Workflow (Fixed)

```
1. ANALYZE   → Parse prompt, identify targets, estimate scale
2. DIVIDE    → Split codebase into non-overlapping segments
3. EXPLORE   → Each agent explores assigned area (<200K tokens, 3-min timeout)
4. COLLECT   → Aggregate findings into structured report
```

---

## Constraints (Fixed)

| Parameter | Default | Maximum |
|-----------|---------|---------|
| Agents | 4 | 8 |
| Context per agent | 200,000 tokens | 200,000 tokens |
| Timeout per agent | 180 seconds | 300 seconds |
| Total scouting | 300 seconds | 600 seconds |

---

## Segmentation Rules (Deterministic)

| Rule | Enforcement |
|------|-------------|
| No overlap | Each directory assigned to exactly 1 agent |
| Round-robin | Directories distributed evenly |
| Token awareness | Estimated file count per segment ≤ context budget |

---

## Search Patterns (3 Tools)

```bash
# Pattern search
grep -r "authenticate" src/
rg "pattern" --type ts

# File discovery
find . -name "*.test.ts"

# Content search with type filter
rg "TODO|FIXME" --type ts
```

---

## Report Format (Fixed)

```markdown
# Scout Report

## Relevant Files
- `path/to/file.ts` - Brief description

## Structure
- `src/auth/` - Authentication logic

## Unresolved Questions
- Any gaps in findings
```

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_INVALID_ROOT` | Yes | Root directory not valid |
| `ERR_TOO_MANY_AGENTS` | Yes | max_agents exceeds 8 |

**Zero internal retries.** Same task + structure = same segmentation.

---

## Tips

| Goal | Approach |
|------|----------|
| Wide search | Start with glob patterns |
| Narrow down | Filter by extension first |
| Understand flow | Follow imports |
| Find entry points | Check index/main files |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [engineering-spec.md](references/engineering-spec.md) | Full spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `knowledge-graph` | Skill | Semantic search |
| `code-review` | Skill | Quality check |

---

⚡ PikaKit v3.9.84
