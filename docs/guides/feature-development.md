---
title: Adding a New Feature
description: Learn the complete workflow for adding new features with PikaKit
section: guides
category: workflows
order: 3
---

# Adding a New Feature

Learn the complete workflow for adding new features to your project with **PikaKit** - from initial planning through implementation, testing, and documentation.

## Overview

- **Goal**: Add a complete feature with planning, implementation, tests, and docs
- **Time**: 15-30 minutes (vs 2-4 hours manually)
- **Agents Used**: `project-planner`, `explorer-agent`, `code-craft`, `test-engineer`, `documentation-writer`
- **Workflows**: `/plan`, `/cook`, `/validate`, `/chronicle`

## Prerequisites

- Existing project with PikaKit configured
- Clear feature requirements
- Development environment set up

## Step-by-Step Workflow

### Step 1: Research and Plan

Use the `/plan` workflow (powered by `project-planner`) to create a detailed implementation strategy.

```bash
/plan "add password reset flow with email verification"
```

**What happens**:
1. **Research**: Analysis of best practices and security patterns.
2. **Context**: `explorer-agent` scans existing auth code.
3. **Plan**: Creates a detailed `implementation_plan.md`.

**Review the plan** at `implementation_plan.md`. It will cover:
- Database schema changes
- API endpoints
- Security considerations (Rate limiting, Token expiry)
- Testing strategy

### Step 2: Scout Existing Code (Optional)

If you need to understand the codebase before approving the plan, use `/inspect` or simply rely on the exploration done during Planning.

```bash
/inspect "Show me existing authentication code"
```

### Step 3: Implement the Feature (`/cook`)

Once the plan is ready, switch to the Tactical Layer for execution.

**Tip:** Use `/clear` (if available in your environment) or simply start a fresh specific task to maximize context window.

```bash
/cook "Implement password reset with email verification as planned"
```

**What the Chef (`code-craft`) does**:
1. **Scaffolds** controllers and routes.
2. **Implements** core logic (Token generation, Email sending).
3. **Applies** security measures (BCrypt hashing, Expiry check).

**Files usually created:**
- `src/controllers/auth.controller.ts`
- `src/services/email.service.ts`
- `tests/auth/password-reset.test.ts`

### Step 4: Verify (`/validate`)

Automatically run the test suite to ensure the new feature works and breaks nothing.

```bash
/validate
```

**Output**:
```
✓ Unit Tests (Token generation, Validation) passed
✓ Integration Tests (API Endpoints) passed
✓ Security Scan passed

✅ All checks green.
```

If tests fail, use the Mechanic:
```bash
/fix "Fix failing password reset tests"
```

### Step 5: Code Review & Quality (`/inspect`)

Before committing, run a quality and security inspection.

```bash
/inspect
```

**Checks performed:**
- Security vulnerabilities (OWASP)
- Code style and patterns
- Performance bottlenecks

### Step 6: Update Documentation (`/chronicle`)

Keep your docs in sync automatically.

```bash
/chronicle
```

**Updates**:
- API Documentation (Swagger/OpenAPI)
- README.md feature list
- Architecture diagrams

### Step 7: Commit & Push

```bash
git add .
git commit -m "feat: implement password reset with email verification"
git push origin feature/password-reset
```

## Real-World Example: E-Commerce Search

**Scenario:** Adding product search with filters.

1.  **Plan:**
    ```bash
    /plan "add product search with filters (price, category) and pagination"
    ```
2.  **Implement:**
    ```bash
    /cook "Implement product search endpoints and query logic"
    ```
3.  **Frontend (optional):**
    ```bash
    /cook "Create SearchBar component and results page"
    ```
4.  **Validate:**
    ```bash
    /validate
    ```

**Time Comparison:**
- **Manual:** ~6 hours (Research, Boilerplate, Testing, Docs)
- **PikaKit:** ~25 minutes

## Troubleshooting

### Feature too complex?
Break it down:
```bash
/plan "User Management Phase 1: CRUD"
/cook "Implement CRUD"
# ... then ...
/plan "User Management Phase 2: Roles"
/cook "Implement Roles"
```

### Tests failing?
```bash
/fix "Resolve validation errors in search test"
```

### Context full?
Remember to restart your session or use `/clear` between the Planning and Implementation phases for best results.

---

**Key Takeaway**: Use PikaKit's `Strategic` (`/plan`) + `Tactical` (`/cook`) combination to ship features 10x faster.
