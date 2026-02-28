---
name: knowledge-graph
description: >-
  Semantic code analysis with AST parsing. Go-to-definition, find-usages,
  impact analysis, architecture visualization.
  Triggers on: find usages, code graph, semantic search, impact analysis.
  Coordinates with: code-review, system-design.
metadata:
  version: "1.0.0"
  category: "architecture"
  triggers: "find usages, code graph, semantic search, impact analysis, definition"
  success_metrics: "precise references found, impact identified"
  coordinates_with: "code-review, system-design"
---

# Knowledge Graph

> Semantic code analysis. AST > grep. Precise > approximate.

---

## When to Use

| Need | Approach |
|------|----------|
| Find all usages | Semantic search |
| Go-to-definition | Symbol lookup |
| Refactoring impact | Cross-file analysis |
| Architecture diagram | Graph visualization |

**Use grep/ripgrep instead for:** Quick text search, pattern matching

---

## Capabilities

| Feature | Description |
|---------|-------------|
| **Symbol Lookup** | Find definition of function/class |
| **Find Usages** | All call sites across codebase |
| **Impact Analysis** | What breaks if I change X? |
| **Cross-file Refs** | Track imports and dependencies |

---

## Language Support

| Language | Status |
|----------|--------|
| TypeScript | ✅ Full |
| JavaScript | ✅ Full |
| Python | ✅ Full |
| Ruby | ✅ Full |
| Java/Kotlin | 🚧 Partial |

---

## Common Queries

### Find All Usages

```markdown
Query: "Where is `authenticate` function used?"
Result: 
- src/auth/login.ts:45
- src/middleware/auth.ts:12
- src/api/users.ts:78
```

### Go-to-Definition

```markdown
Query: "Definition of User class"
Result: src/models/user.ts:15
```

### Impact Analysis

```markdown
Query: "What breaks if I change validateEmail signature?"
Result:
- Direct calls: 5 files
- Indirect: 2 files via re-exports
- Tests: 3 test files
```

---

## Integration Options

| Tool | Use Case |
|------|----------|
| LSP | IDE integration |
| Tree-sitter | AST parsing |
| Repomix | Context dumps |
| MCP | AI agent integration |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `code-review` | Skill | Quality analysis |
| `system-design` | Skill | Architecture patterns |

---

⚡ PikaKit v3.9.67
