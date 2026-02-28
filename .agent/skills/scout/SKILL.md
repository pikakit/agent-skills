---
name: scout
description: >-
  Fast codebase scouting using parallel exploration for file discovery.
  Divide and conquer approach for context gathering.
  Triggers on: find files, locate, codebase structure, explore, search.
  Coordinates with: knowledge-graph, code-review.
metadata:
  version: "1.0.0"
  category: "development"
  triggers: "find files, locate, codebase structure, explore, search"
  success_metrics: "files found, structure understood, <3 min"
  coordinates_with: "knowledge-graph, code-review"
---

# Scout

> Fast codebase exploration. Divide and conquer. Find files in minutes.

---

## When to Use

| Situation | Action |
|-----------|--------|
| Starting new feature | Scout relevant files |
| Debugging session | Find related files |
| Understanding structure | Map project layout |
| Before refactoring | Identify impact scope |

---

## Workflow

### 1. Analyze Task

```markdown
- Parse prompt for search targets
- Identify directories, patterns, file types
- Estimate scale (files, LOC)
```

### 2. Divide and Conquer

```markdown
- Split codebase into segments
- Assign directories per agent
- No overlap, max coverage
```

### 3. Parallel Exploration

```markdown
- Each agent explores assigned area
- <200K token context per agent
- 3-minute timeout per agent
```

### 4. Collect Results

```markdown
- Aggregate findings
- List unresolved questions
- Produce concise report
```

---

## Report Format

```markdown
# Scout Report

## Relevant Files
- `path/to/file.ts` - Brief description
- `path/to/other.ts` - Brief description

## Structure
- `src/auth/` - Authentication logic
- `src/api/` - API endpoints

## Unresolved Questions
- Any gaps in findings
```

---

## Search Patterns

```bash
# Find by pattern
grep -r "authenticate" src/

# Find by extension
find . -name "*.test.ts"

# Find by content
rg "TODO|FIXME" --type ts
```

---

## Tips

| Goal | Approach |
|------|----------|
| Wide search | Start with glob patterns |
| Narrow down | Filter by extension first |
| Understand flow | Follow imports |
| Find entry points | Check index files |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `knowledge-graph` | Skill | Semantic search |
| `code-review` | Skill | Quality check |

---

⚡ PikaKit v3.9.68
