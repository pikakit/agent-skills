---
title: Refactoring Code
description: Safely refactor code with PikaKit - from identifying technical debt to implementing improvements
section: guides
category: workflows
order: 7
---

# Refactoring Code

Learn how to safely refactor code with **PikaKit** - from identifying technical debt to implementing improvements with comprehensive testing and validation.

## Overview

- **Goal**: Improve code quality and maintainability without breaking functionality.
- **Time**: 15-45 minutes (vs 3-8 hours manually).
- **Agents Used**: `code-review`, `test-engineer`, `code-craft` (Chef).
- **Workflows**: `/inspect`, `/plan`, `/cook`, `/validate`.

## Prerequisites

- Existing codebase with areas needing improvement.
- Test suite in place (or willing to add tests via `/validate`).
- Version control for safe rollback.

## Refactoring Scenarios

| Scenario | Priority | Risk Level |
|----------|----------|------------|
| Duplicate code (DRY violations) | High | Low |
| Large functions (100+ lines) | Medium | Medium |
| Complex conditionals | Medium | Medium |
| Tight coupling | High | High |
| Performance bottlenecks | Medium | Medium |

## Step-by-Step Workflow

### Step 1: Identify Refactoring Needs

Use the Inspector (`/inspect`) to identify issues automatically.

```bash
/inspect
```

**Output**:
```
🔍 Inspection Report

⚠ Issues Found:
1. Duplicate Code (15 instances)
   - src/users/create.js and src/users/update.js
2. High Complexity
   - src/orders/process.js (Complexity: 25)
3. Magic Numbers
   - Hardcoded values in src/config.ts
```

### Step 2: Prioritize & Plan

For complex refactors, use `/plan` to outline the strategy.

```bash
/plan "refactor user validation logic to eliminate duplication"
```

**Why plan?**
- Ensures shared understanding of the architectural change.
- Identifies risk areas before touching code.

### Step 3: Add Tests (Safety Net)

Before refactoring, ensure good test coverage.

```bash
# Check current coverage
/validate coverage

# Add tests if coverage is low
/cook "add comprehensive tests for user validation before refactoring"
```

### Step 4: Implement Refactoring

Execute the refactoring using the Tactical Workflow (`/cook`).

```bash
/cook "refactor user validation logic to eliminate duplication as planned"
```

**refactoring process**:
1.  **Analyze**: Identifies duplicate blocks.
2.  **Extract**: Creates `src/validators/user.validator.js`.
3.  **Update**: Modifies controllers to use the new validator.
4.  **Verify**: Runs existing tests to ensure no breakage.

### Step 5: Verify Functionality

Thoroughly test refactored code using `/validate`.

```bash
/validate
```

**Success Criteria**:
- All tests pass (Green).
- No regressions.
- Coverage maintained or increased.

### Step 6: Review and Document

```bash
# Update documentation
/chronicle

# Final Code Review
/inspect
```

### Step 7: Commit

```bash
git commit -m "refactor: extract shared user validation logic"
```

## Complete Examples

### Example 1: Simplify Complex Function

**Before** (234 lines of mixed concerns):
```javascript
async function processOrder(orderId) {
  // ... 200 lines of validation, inventory, payment, email ...
}
```

**Command**:
```bash
/cook "refactor processOrder function to follow single responsibility principle"
```

**After** (Clean Architecture):
```javascript
async function processOrder(orderId) {
  const order = await validateOrder(orderId);
  await checkInventory(order);
  await processPayment(order);
  await sendConfirmationEmail(order);
  return order;
}
```

### Example 2: Remove Tight Coupling

**Command**:
```bash
/cook "refactor UserService to use dependency injection"
```

**Result**:
- Replaces direct `require()` calls with constructor injection.
- Makes the class easily testable with mocks.

## Refactoring Best Practices

1.  **Test First**: Never refactor without tests. If tests are missing, use `/validate [target]` to generate them first.
2.  **Small Steps**: Refactor one function/module at a time.
    *   ✅ `/cook "extract validation logic"`
    *   ❌ `/cook "refactor entire auth system"`
3.  **No Behavior Change**: Refactoring should improve structure, not change behavior.

## Troubleshooting

### Issue: Tests Fail After Refactoring
**Solution**:
1.  **Revert**: `git reset --hard HEAD`
2.  **Smaller Scope**: `/cook "extract just the email validation function"`

### Issue: Unclear What to Refactor
**Solution**:
1.  Run `/inspect` to find "Bad Smells".
2.  Ask `/plan` to "analyze technical debt priorities".

---

**Key Takeaway**: PikaKit enables safe refactoring by combining automated inspection (`/inspect`) with tactical implementation (`/cook`) and continuous verification (`/validate`).
