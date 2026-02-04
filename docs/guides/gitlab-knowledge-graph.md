---
title: GitLab Knowledge Graph Integration
description: Understand codebases deeply with GitLab Knowledge Graph MCP
section: guides
category: integrations
order: 12
---

# GitLab Knowledge Graph Integration

GitLab Knowledge Graph (GKG) is a powerful code analysis tool that creates a queryable map of your repositories. It enables deep codebase exploration, impact analysis, and AI-driven code understanding through the Model Context Protocol (MCP).

## What is GitLab Knowledge Graph?

GKG transforms your code into structured knowledge by:

1.  **Scanning Code Structure**: Identifies files, classes, functions, and modules.
2.  **Extracting Relationships**: Discovers function calls, inheritance, and dependencies.
3.  **Building Graph Database**: Stores everything in Kuzu (high-performance graph database).
4.  **Enabling AI Integration**: Provides MCP tools for AI agents to understand codebase deeply.

**Key Benefits**:
- RAG (Retrieval-Augmented Generation) for code context.
- Architecture visualization and dependency analysis.
- Impact analysis before refactoring.
- Intelligent code navigation.

## Installation

### Install GitLab Knowledge Graph CLI

```bash
# One-line installation (Linux/macOS)
curl -fsSL https://gitlab.com/gitlab-org/rust/knowledge-graph/-/raw/main/install.sh | bash

# Add to PATH
export PATH="$HOME/.local/bin:$PATH"

# Verify
gkg --version
```

### Start the Server

```bash
# Start the knowledge graph server (runs on http://localhost:27495)
gkg server start

# In another terminal, index your project
gkg index /path/to/project
```

## How to Use GKG with PikaKit

### 1. Index Your Project

Before using GKG, create the knowledge graph:

```bash
gkg index /path/to/your/project
```

**Example output**:
```
✅ Workspace indexing completed in 12.34 seconds
Projects indexed: 3 | Files: 1,247 | Entities: 5,832 | Relationships: 12,156
```

### 2. Use GKG MCP Tools

Once indexed, use GKG MCP tools in your PikaKit sessions.

#### List All Projects
```bash
gkg_list_projects
```

#### Search for Code Definitions
```bash
gkg_search_codebase_definitions \
  --project_absolute_path /path/to/project \
  --search_terms "MyFunction" "MyClass"
```

#### Get All References to a Symbol
```bash
gkg_get_references \
  --absolute_file_path /path/to/project/src/utils.ts \
  --definition_name calculateTotal
```

#### Jump to Definition
```bash
gkg_get_definition \
  --absolute_file_path /path/to/file.ts \
  --line "const result = calculateTotal(items);" \
  --symbol_name calculateTotal
```

#### Generate Repository Map
```bash
gkg_repo_map \
  --project_absolute_path /path/to/project \
  --relative_paths ["src/components", "src/utils"] \
  --depth 2
```

## Common Workflows with PikaKit

### Refactoring with Impact Analysis

```bash
# 1. Find all references to function before changing
gkg_get_references \
  --absolute_file_path /path/to/project/src/api.ts \
  --definition_name fetchUserData

# 2. Review all call sites
# 3. Use /cook to make the change safely
/cook "refactor fetchUserData with knowledge of all callers"
```

### Onboarding: Understanding New Codebase

```bash
# 1. Get structure overview
gkg_repo_map --project_absolute_path /path/to/project --relative_paths ["src"] --depth 2

# 2. Search for key components
gkg_search_codebase_definitions \
  --project_absolute_path /path/to/project \
  --search_terms "App" "Router" "Controller" "Service"
```

### Feature Implementation

```bash
# 1. Find similar features/patterns
gkg_search_codebase_definitions \
  --project_absolute_path /path/to/project \
  --search_terms "Form" "Validation" "Submit"

# 2. Read implementation patterns with gkg_read_definitions
# 3. Use /cook to implement with context
/cook "implement new RegistrationForm following existing patterns"
```

## MCP Tools Reference

| Tool | Purpose | Use Case |
|------|---------|----------|
| `list_projects` | Get indexed projects | Know project paths |
| `search_codebase_definitions` | Find definitions by name | Find functions, classes |
| `get_references` | Find all uses of symbol | Impact analysis |
| `read_definitions` | Read full definition code | Understand implementation |
| `get_definition` | Jump to definition | Quick exploration |
| `repo_map` | Get structure overview | Understand architecture |
| `index_project` | Rebuild index | Update after changes |

## Integration with PikaKit Workflows

### Using GKG in `/cook` Commands

```bash
# When implementing from plan, GKG provides context
/cook "Add user authentication system"

# PikaKit uses GKG to:
# 1. Search for existing auth patterns
# 2. Understand current architecture
# 3. Find integration points
```

### Using GKG in `/plan` Commands

```bash
# Before major refactoring
/plan "Refactor authentication module"

# PikaKit uses GKG to:
# 1. Map all auth-related code
# 2. Find all usages
# 3. Identify dependencies
```

## Best Practices

1.  **Always Index Before Exploring**: Stale index = inaccurate results.
2.  **Use Right Tool for Task**:
    - Find where called: `get_references`.
    - Understand code: `read_definitions`.
    - Explore structure: `repo_map`.
3.  **Combine Tools for Depth**: Search → Read → Analyze.

## Troubleshooting

### Knowledge Graph Not Finding Definitions
- Ensure project is indexed: `gkg index /path/to/project`.
- Check exact naming (case-sensitive).
- Verify language is supported (Rust, TypeScript, Python, Ruby, Java, Kotlin).

### Server Not Running
```bash
gkg server start
```

## Resources

- [GitLab Knowledge Graph Docs](https://gitlab-org.gitlab.io/rust/knowledge-graph/)
- [MCP Tools Reference](https://gitlab-org.gitlab.io/rust/knowledge-graph/mcp/tools/)
- [Supported Languages](https://gitlab-org.gitlab.io/rust/knowledge-graph/languages/overview/)

---

**Key Takeaway**: GitLab Knowledge Graph enables PikaKit agents to truly understand your codebase, making code analysis, refactoring, and implementation more intelligent and context-aware.
