---
title: Documentation Workflow
description: Keep documentation in sync with code changes using PikaKit's automated engine
section: guides
category: workflows
order: 4
---

# Documentation Workflow

Keep documentation synchronized with code changes using **PikaKit's** automated documentation engine (`/chronicle`).

## Overview

The documentation workflow ensures your project documentation stays current, accurate, and useful as your codebase evolves. PikaKit uses the `documentation-writer` agent and `chronicle` workflow to analyze code and generate docs automatically.

## When to Use This Workflow

- **Initialize**: Starting a new project
- **Update**: After completing features (`/cook`)
- **Release**: Before deployments (`/launch`)
- **Maintenance**: Regular documentation audits

## Step-by-Step Guide

### 1. Initialize Documentation (`/chronicle`)

If you have no docs, start here.

```bash
/chronicle
```

**What happens**:
- **Assessor Agent** checks project scope.
- **Docs Writer Agent** creates structure (`docs/`, `README.md`).
- **Learner Agent** checks for existing patterns.

**Output Created**:
- `README.md` (if missing) with project structure
- `docs/API.md` for backend projects
- `CHANGELOG.md` scaffold

### 2. Update After Changes (`/chronicle`)

After implementing a feature with `/cook`, run this to sync docs.

```bash
/chronicle
```

**What happens**:
- Scans modified files.
- Updates `README.md` feature lists.
- Updates `docs/API.md` with new endpoints.
- Regenerates `CHANGELOG.md` based on commits.

### 3. Targeted Updates

Update specific parts of your documentation.

**API Docs Only:**
```bash
/chronicle api
```

**Specific File:**
```bash
/chronicle src/services/auth.ts
```

**Inline Comments:**
```bash
/chronicle inline
```
*Adds JSDoc/TSDoc comments to your code automatically.*

### 4. Review (`/inspect`)

Before committing documentation changes, it's good practice to review them.

```bash
/inspect
```
*Validates that documentation matches the implementation.*

## Real Example

Let's document a new authentication feature:

### Step 1: Implement Feature
```bash
/cook "Implement OAuth authentication"
```

### Step 2: Update Docs
```bash
/chronicle
```

**Updates Made**:
- **README.md**: Added "OAuth Support" to Features.
- **docs/API.md**: Added `/auth/callback` endpoint definition.
- **src/auth.ts**: Added inline JSDoc for new functions.

### Step 3: Verify
```bash
/validate
```
*Ensures code implies verify; docs are part of the deliverable.*

## Documentation Types

### API Documentation
```bash
/chronicle api
```
- OpenAPI 3.0 specs (if configured)
- Type definitions
- Endpoint descriptions

### README & Guides
```bash
/chronicle readme
```
- Installation steps
- Quick start guide
- Project structure

### Changelog Management
```bash
/chronicle changelog
```
- Categorizes recent commits (feat, fix, chores)
- Updates `CHANGELOG.md` clearly

## Best Practices

1.  **Run often**: Run `/chronicle` after every significant `/cook` session.
2.  **Review diffs**: Always check what `chronicle` modified before committing (`git diff`).
3.  **Comments matter**: PikaKit reads your code comments to generate docs. improving code comments improves generated docs.
4.  **Use Types**: TypeScript interfaces are the best source of truth for API docs.

## Integration with Development Workflow

### Post-Feature Hook
```bash
/cook "Add new feature"
/chronicle
/validate
git commit -m "feat: add feature and docs"
```

### Pre-Release Hook
```bash
/chronicle changelog
git commit -m "chore: update changelog for release"
/launch
```

## Related Workflows

- [Feature Development](/docs/guides/feature-development) - Building features that need documentation
- [Code Review](/docs/workflows/inspect) - Reviewing code and docs
- [Release Management](/docs/workflows/launch) - Deploying documented code
