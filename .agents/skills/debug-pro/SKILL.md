---
name: debug-pro
description: >-
  Unified debugging skill combining systematic methodology (4-phase) with advanced frameworks 
  (defense-in-depth, root-cause tracing, verification). The single source of truth for all 
  debugging approaches. Replaces debug-pro and debug-toolkit.
  Triggers on: debug, bug, error, crash, exception, root cause, investigation, not working.
  Coordinates with: test-architect, code-review, recovery-agent.
allowed-tools: Read, Glob, Grep, Bash
metadata:
  version: "1.0.0"
  category: "core"
  success_metrics: "root cause identified, bug fixed, regression test added"
  coordinates_with: "test-architect, code-review, recovery-agent"
  replaces: ["debug-pro", "debug-toolkit"]
---

# Debugging Mastery

> **Single Source of Truth** for all debugging approaches.
> Combines systematic 4-phase methodology with advanced defense frameworks.

## Quick Navigation

- [4-Phase Process](#4-phase-debugging-process)
- [Advanced Frameworks](#advanced-frameworks)
- [Debug Checklist](#debugging-checklist)
- [Tools & Commands](#debugging-tools)

---

## 4-Phase Debugging Process

### Phase 1: Reproduce 🔄

**Goal:** Reliably reproduce the issue before fixing.

```markdown
## Reproduction Steps

1. [Exact step to reproduce]
2. [Next step]
3. [Expected vs actual result]

## Reproduction Rate

- [ ] Always (100%) → High priority
- [ ] Often (50-90%) → Medium priority  
- [ ] Sometimes (10-50%) → Need more investigation
- [ ] Rare (<10%) → May need logging/monitoring
```

**Reproduce Checklist:**
- [ ] Can reproduce consistently
- [ ] Have minimal reproduction case
- [ ] Understand expected behavior
- [ ] Documented environment details

---

### Phase 2: Isolate 🔍

**Goal:** Narrow down the source.

```markdown
## Isolation Questions

1. When did this start happening?
2. What changed recently? (git log --oneline -20)
3. Does it happen in all environments?
4. Can we reproduce with minimal code?
5. What's the smallest change that triggers it?
```

**Isolation Techniques:**
- Binary search through commits (`git bisect`)
- Comment out code sections
- Isolate environment variables
- Test in isolation (unit test context)

---

### Phase 3: Understand 🧠

**Goal:** Find the ROOT CAUSE, not just symptoms.

```markdown
## The 5 Whys Analysis

1. Why: [First observation]
   → Answer: ...
2. Why: [Deeper reason]
   → Answer: ...
3. Why: [Still deeper]
   → Answer: ...
4. Why: [Getting closer]
   → Answer: ...
5. Why: [ROOT CAUSE]
   → Answer: ...
```

**Root Cause Indicators:**
- ✅ Explains ALL symptoms
- ✅ Changing it fixes the issue
- ✅ Makes logical sense
- ❌ "It just happens" is NOT a root cause

---

### Phase 4: Fix & Verify ✅

**Goal:** Fix at source and verify completely.

```markdown
## Fix Verification Checklist

- [ ] Bug no longer reproduces
- [ ] Related functionality still works
- [ ] No new issues introduced
- [ ] Regression test added
- [ ] Similar code patterns checked
- [ ] Documentation updated if needed
```

**Verification Commands:**
```bash
# Run existing tests
npm test

# Run specific test
npm test -- --grep "bug-description"

# Check for regressions
npm run test:e2e
```

---

## Advanced Frameworks

### Defense in Depth 🛡️

Validate at every layer data passes through.

```typescript
// Entry Validation (API layer)
function handleRequest(input: unknown) {
  const validated = validateSchema(input); // Fail fast
  return processValidated(validated);
}

// Business Logic Checks
function processOrder(order: Order) {
  assert(order.total > 0, 'Order total must be positive');
  assert(order.items.length > 0, 'Order must have items');
  // Continue processing...
}

// Environment Guards
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL not configured');
}
```

**Layers to Validate:**
1. API/Input boundary
2. Business logic assertions
3. Database constraints
4. Environment configuration
5. External service responses

---

### Root Cause Tracing 🎯

Trace bugs backward through the call stack.

```markdown
## Trace Template

Error Location: [Where it crashes]
         ↑
Called By: [Function calling it]
         ↑
Data From: [Where data originates]
         ↑
User Action: [What triggered this]

## Example

Error: "Cannot read property 'name' of undefined"
         ↑
Called By: renderUser(user) - user is undefined
         ↑  
Data From: users.find(u => u.id === id) - returns undefined
         ↑
Root Cause: ID from URL doesn't match any user
```

**Polluter Detection:**
- Check what modified the data before the error
- Look for race conditions
- Track state mutations
- Use `console.trace()` for call stack

---

### Verification Before Completion 🎖️

**NEVER claim "fixed" without verification.**

```markdown
## Verification Protocol

1. [ ] Run specific test that was failing
2. [ ] Run full test suite (npm test)
3. [ ] Manual verification of the fix
4. [ ] Check for side effects
5. [ ] Code review if changes are significant

## Evidence Required

- [ ] Test output showing pass
- [ ] Screenshot/log of fixed behavior
- [ ] No new warnings/errors introduced
```

---

## Debugging Checklist

### Quick Start Checklist

```markdown
## Before Starting
- [ ] Can reproduce consistently
- [ ] Have minimal reproduction case
- [ ] Understand expected behavior

## During Investigation  
- [ ] Check recent changes (git log)
- [ ] Check logs for errors
- [ ] Add logging if needed
- [ ] Use debugger/breakpoints

## After Fix
- [ ] Root cause documented
- [ ] Fix verified (not just "seems to work")
- [ ] Regression test added
- [ ] Similar code patterns checked
```

---

## Debugging Tools

### Git Commands

```bash
# Recent changes
git log --oneline -20
git diff HEAD~5

# Find when bug was introduced
git bisect start
git bisect bad HEAD
git bisect good v1.0.0
# ... continue until found

# Who changed this line
git blame path/to/file.ts
```

### Search Commands

```bash
# Find pattern in code
grep -r "errorPattern" --include="*.ts"

# Find usage of function
grep -rn "functionName(" --include="*.{ts,tsx}"

# Find recent modifications
find . -name "*.ts" -mtime -7
```

### Log Commands

```bash
# PM2 logs
pm2 logs app-name --err --lines 100

# Docker logs
docker logs container-name --tail 100

# Node.js debug mode
DEBUG=* node app.js
```

### Debugging in Code

```typescript
// Strategic console.log
console.log('[DEBUG:functionName]', { input, state, output });

// Stack trace
console.trace('How did we get here?');

// Conditional breakpoint (IDE)
// Break if: user.id === undefined

// Time measurement
console.time('operation');
// ... code ...
console.timeEnd('operation');
```

---

## Anti-Patterns ❌

| Anti-Pattern | Why It's Bad | What to Do Instead |
|--------------|--------------|---------------------|
| **Random changes** | "Maybe if I change this..." | Follow 4-phase process |
| **Ignoring evidence** | "That can't be the cause" | Trust the data |
| **Assuming** | "It must be X" without proof | Verify with evidence |
| **Not reproducing first** | Fixing blindly | Always reproduce first |
| **Stopping at symptoms** | Not finding root cause | Apply 5 Whys |
| **Claiming fixed without test** | Bug will return | Run verification protocol |

---

## When to Use

| Situation | Approach |
|-----------|----------|
| **New bug report** | Start with Phase 1: Reproduce |
| **Bug keeps reappearing** | Root Cause Tracing |
| **Data validation issue** | Defense in Depth |
| **Before claiming done** | Verification Protocol |
| **Complex multi-layer issue** | All phases + frameworks |

---

## Integration

- **With test-architect**: Generate regression tests after fix
- **With recovery-agent**: Save state before risky debug operations
- **With code-review**: Review significant fixes

---

**Merged from:** `debug-pro` + `debug-toolkit`  
**Version:** 1.0.0
