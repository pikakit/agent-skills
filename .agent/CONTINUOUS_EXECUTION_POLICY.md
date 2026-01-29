# Continuous Execution Policy

> **Principle:** User approval = Full plan execution, no mid-phase checkpoints

---

## 🎯 Core Rule

```
IF user approves multi-phase plan execution:
  THEN agent MUST auto-continue through ALL phases
  WITHOUT requesting confirmation after each phase
```

**Phase completion is NOT a stopping point.**

---

## 🚫 DO NOT Stop For

- ❌ Phase completion
- ❌ Sub-task completion
- ❌ Progress updates
- ❌ "Let me check if you want to continue"

These are **anti-patterns** for execution agents.

---

## ✅ ONLY Stop For

1. **Blocking Error**
   - Syntax error preventing continuation
   - Missing dependency that blocks progress
   - File system error

2. **Decision Fork Required**
   - Multiple valid approaches (user must choose)
   - Breaking change decision
   - Architecture choice needed

3. **Plan Completed**
   - ALL phases successfully done
   - Final deliverables ready

4. **Explicit User Pause**
   - User says "stop", "pause", "wait"
   - User cancels execution

---

## 📐 Implementation Logic

### ❌ Old Behavior (Wrong)

```javascript
function onPhaseComplete(phase) {
  notify_user(`Phase ${phase} completed. Continue to next phase?`);
  exitExecution();
}
```

**Problem:** Creates unnecessary checkpoints, breaks flow.

### ✅ New Behavior (Correct)

```javascript
function onPhaseComplete(phase) {
  // Log internally, don't notify
  log(`✅ Phase ${phase} completed`);

  // Check if we should stop
  if (hasBlockingError()) {
    notify_user(`🚨 Error in Phase ${phase}: ${error}`);
    exitExecution();
    return;
  }

  if (requiresUserDecision(phase)) {
    notify_user(`🤔 Decision required at Phase ${phase}`);
    exitExecution();
    return;
  }

  if (isLastPhase(phase)) {
    notify_user(`🎉 All ${totalPhases} phases completed!`);
    exitExecution();
    return;
  }

  // AUTO-CONTINUE (the key part)
  const nextPhase = getNextPhase(phase);
  log(`→ Starting Phase ${nextPhase}...`);
  executePhase(nextPhase);
}
```

---

## 🔧 Execution Policy (YAML)

```yaml
execution_policy:
  mode: continuous
  auto_continue: true

  stop_conditions:
    blocking_error: true
    decision_required: true
    plan_completed: true
    user_pause_request: true
    phase_completed: false # ← KEY: false means don't stop

  notification_policy:
    phase_start: log_only # Don't notify user
    phase_complete: log_only # Don't notify user
    error: notify_user # DO notify
    decision_fork: notify_user # DO notify
    final_complete: notify_user # DO notify

  progress_reporting:
    method: task_boundary_updates # Use TaskSummary field
    frequency: per_phase
    visibility: internal_only # User sees in UI, no interruption
```

---

## 📝 Agent Prompt Addition

**Add this to workflow execution prompts:**

```
CONTINUOUS EXECUTION MODE ACTIVE

The user has approved the full execution plan.

Rules:
1. Execute ALL phases automatically
2. DO NOT pause after phase completion
3. DO NOT request confirmation between phases
4. ONLY stop for: errors, decisions, completion, or explicit user pause

Phase boundaries are internal checkpoints, not user interaction points.
Continue execution seamlessly.
```

---

## 🎓 Examples

### ✅ Good: Auto-Continue

```
User: "Execute the 3-phase migration plan"
Agent: [Executes Phase 1 → Phase 2 → Phase 3 automatically]
Agent: "✅ All 3 phases complete. Migration successful."
```

**No interruptions.** User gets ONE final notification.

### ❌ Bad: Checkpoint Hell

```
User: "Execute the 3-phase migration plan"
Agent: "Phase 1 done. Continue to Phase 2?" ← WRONG
User: "Yes"
Agent: "Phase 2 done. Continue to Phase 3?" ← WRONG
User: "Yes" (annoyed)
Agent: "Phase 3 done."
```

**3 unnecessary interactions.** User approved ONCE, not 3 times.

---

## 🔍 Problem Verification (MANDATORY)

**After EVERY task completion, agent MUST:**

1. **Check `@[current_problems]`** - Read IDE problems/warnings
2. **Auto-fix if possible** - Fix warnings, errors, lint issues
3. **Report if blocking** - Notify user only if cannot auto-fix

### Verification Protocol

```
ON_TASK_COMPLETE:
  problems = check_current_problems()

  IF problems.isEmpty():
    complete_task()
  ELSE:
    IF problems.are_auto_fixable():
      auto_fix(problems)
      verify_fixed()
      complete_task()
    ELSE:
      notify_user_blocking_issues(problems)
```

### Auto-Fixable Issues

| Issue Type           | Auto-fix? | Action                         |
| -------------------- | --------- | ------------------------------ |
| **CSS warnings**     | ✅ Yes    | Fix syntax (e.g., Tailwind v4) |
| **Missing imports**  | ✅ Yes    | Add imports                    |
| **Unused variables** | ✅ Yes    | Remove or use                  |
| **Lint errors**      | ✅ Yes    | Apply linter fixes             |
| **Type errors**      | ⚠️ Maybe  | Fix if minor                   |
| **Logic errors**     | ❌ No     | Notify user                    |

### Example

**Bad (Old):**

```
Task complete → Notify user
User sees 5 CSS warnings ❌
User has to ask agent to fix ❌
```

**Good (New):**

```
Task complete → Check problems
Found 5 CSS warnings → Auto-fix
Verify fixed → Notify user ✅
User sees clean code ✅
```

**Rule:** Don't declare task complete until problems are resolved or deemed non-blocking.

---

## 🔗 Integration Points

### 1. Workflow Files

Add to **ALL** workflow `.md` files:

```markdown
## Execution Policy

This workflow runs in **continuous execution mode**.

Once started:

- All steps execute automatically
- No mid-workflow confirmations
- Stops only for errors or completion
```

### 2. GEMINI.md Rules

Add to `TIER 1: CODE RULES`:

```markdown
### 🔄 CONTINUOUS EXECUTION RULE

**Applies to:** Multi-phase workflows (/build, /optimize, /chronicle, etc.)

**When user approves plan execution:**

- ✅ Execute ALL phases automatically
- ❌ DO NOT pause between phases
- ❌ DO NOT ask "continue to next phase?"

**Phase completion = Internal checkpoint (log only)**

**ONLY notify_user for:**

- Blocking errors
- Decision forks
- Plan completion
- Explicit user pause request
```

### 3. Task Boundary Updates

Use `TaskSummary` to show progress WITHOUT interrupting:

```javascript
// Phase 1 complete
task_boundary({
  TaskName: "Migration Execution",
  TaskSummary: "Phase 1/3 complete (backup created). Starting Phase 2 (schema migration)...",
  TaskStatus: "Migrating schema to v2.0",
});

// Continue immediately, no notify_user
```

**User sees progress in UI, execution continues.**

---

## ⚡ Quick Reference

| Scenario                     | Action                 |
| ---------------------------- | ---------------------- |
| Phase completes successfully | ✅ Log + Auto-continue |
| Blocking error               | 🚨 Notify + Stop       |
| Need user decision           | 🤔 Notify + Stop       |
| All phases done              | 🎉 Notify + Stop       |
| User says "pause"            | ⏸️ Notify + Stop       |

**Default: Keep going.**

---

## 🎯 Success Criteria

**Before:** 5-phase plan = 4 unnecessary notifications  
**After:** 5-phase plan = 1 final notification

**Benefit:** User approves once, gets results once. No micromanagement.

---

## 📊 Measurable Success Metrics (FAANG Standard)

> **Principle:** Every claim must be verifiable with numbers.

### 10 Core Metrics

| #   | Metric                         | Target | Measurement                                        |
| --- | ------------------------------ | ------ | -------------------------------------------------- |
| 1   | **Phase Transition Time**      | <2s    | Time between phase completion and next phase start |
| 2   | **First-Time Success Rate**    | >95%   | Successful completions / Total attempts            |
| 3   | **Approval Prompts Post-Plan** | 0      | Count of user interactions after plan approval     |
| 4   | **Auto-Fix Coverage**          | >85%   | Auto-fixed issues / Total fixable issues           |
| 5   | **Problem Detection Rate**     | 100%   | Detected problems / Actual problems (post-review)  |
| 6   | **Error Recovery Time**        | <10s   | Time from error detection to recovery action       |
| 7   | **Rollback Success Rate**      | 100%   | Successful rollbacks / Attempted rollbacks         |
| 8   | **IDE Problems at Completion** | 0      | Count of warnings/errors when task marked done     |
| 9   | **Execution Efficiency**       | >80%   | Useful work time / Total execution time            |
| 10  | **User Satisfaction Score**    | >4.5/5 | Based on task outcome (implicit from continuation) |

### Metric Categories

**Speed Metrics (SLOs):**

```yaml
speed_slos:
  phase_transition: <2s # Critical - user experience
  command_start: <500ms # Time to begin command execution
  error_detection: <1s # Time to catch problems
  notification_delay: <1s # Time to notify user when needed
```

**Quality Metrics:**

```yaml
quality_targets:
  ide_problems: 0 # Zero tolerance for warnings/errors
  security_vulns: 0 # Must pass security scan
  lint_errors: 0 # Must pass linting
  type_errors: 0 # TypeScript strict mode
```

**Reliability Metrics:**

```yaml
reliability_targets:
  first_time_success: >95 # No retries needed
  auto_fix_rate: >85 # Self-healing capability
  rollback_success: 100% # Always recoverable
  circuit_breaker_accuracy: >90 # Correct triggers
```

### How to Measure

**Automated Collection:**

```javascript
// Track in task_boundary updates
const metrics = {
  phaseTransitionTime: endTime - startTime,
  approvalPrompts: promptCount,
  ideProblems: currentProblemsCount,
  executionTime: totalExecutionMs,
};

// Log for analysis
console.log(`[METRICS] ${JSON.stringify(metrics)}`);
```

**Manual Review (Weekly):**

- Review 5 random autopilot sessions
- Calculate success rate
- Identify improvement areas
- Update baselines if needed

### Reporting Format

After each autopilot execution, include metrics in report:

```markdown
## 📊 Execution Metrics

| Metric            | Target | Actual | Status  |
| ----------------- | ------ | ------ | ------- |
| Phase transitions | <2s    | 1.2s   | ✅ Pass |
| Approval prompts  | 0      | 0      | ✅ Pass |
| IDE problems      | 0      | 0      | ✅ Pass |
| Auto-fix rate     | >85%   | 100%   | ✅ Pass |
| Total time        | <5min  | 4m 32s | ✅ Pass |
```

---

## 🎯 Service Level Objectives (SLOs)

### Execution Speed SLOs

| Operation                 | SLO    | Action if Exceeded       |
| ------------------------- | ------ | ------------------------ |
| Phase transition          | <2s    | Log warning, investigate |
| Simple app (2-3 agents)   | <3min  | Review parallelization   |
| Standard app (3-4 agents) | <5min  | Normal expectation       |
| Complex app (5+ agents)   | <10min | May need optimization    |
| Single command            | <60s   | Timeout, retry, or fail  |

### Reliability SLOs

| Metric             | SLO  | Consequence               |
| ------------------ | ---- | ------------------------- |
| First-time success | >95% | If <90%, review process   |
| Auto-fix success   | >85% | If <80%, expand fix rules |
| Rollback success   | 100% | Any failure is P0 bug     |

### SLO Violation Response

```javascript
function onSLOViolation(metric, actual, target) {
  if (isCritical(metric)) {
    // P0: Immediate action
    pauseExecution();
    notifyUser(`🚨 SLO violation: ${metric} = ${actual} (target: ${target})`);
  } else {
    // P1: Log for review
    logWarning(`⚠️ SLO warning: ${metric} = ${actual} (target: ${target})`);
    continueExecution();
  }
}
```

---

## 🔧 Enforcement Mechanisms

### Pre-Flight Validation Checklist

Before starting any multi-phase execution:

```markdown
## Pre-Flight Checks (MANDATORY)

- [ ] Plan exists (PLAN.md or equivalent)
- [ ] User approval received
- [ ] Turbo annotation present (// turbo-all for autopilot)
- [ ] Target directory accessible
- [ ] Dependencies available (npm, python, etc.)
- [ ] No blocking IDE problems in target area
```

**Validation Code:**

```javascript
async function validatePreFlight(context) {
  const checks = [
    { name: "plan_exists", fn: () => fileExists(context.planPath) },
    { name: "user_approved", fn: () => context.approved === true },
    { name: "turbo_enabled", fn: () => context.turboAll === true },
    { name: "target_accessible", fn: () => isWritable(context.targetDir) },
    { name: "deps_available", fn: () => checkDependencies(context.deps) },
    { name: "no_blockers", fn: () => currentProblems().length === 0 },
  ];

  const failures = checks.filter((c) => !c.fn());

  if (failures.length > 0) {
    return {
      pass: false,
      failures: failures.map((f) => f.name),
      message: `Pre-flight failed: ${failures.map((f) => f.name).join(", ")}`,
    };
  }

  return { pass: true };
}
```

### Quality Gates

Must-pass checks before marking task complete:

| Gate              | Requirement          | Action if Fail          |
| ----------------- | -------------------- | ----------------------- |
| **IDE Problems**  | 0 warnings/errors    | Auto-fix or notify      |
| **Security Scan** | No vulnerabilities   | Block completion        |
| **Lint Check**    | All rules pass       | Auto-fix where possible |
| **Type Check**    | No TypeScript errors | Fix or document         |
| **Tests**         | All pass (if exist)  | Fix or document skipped |

### Circuit Breaker Pattern

Automatically pause if error rate exceeds threshold:

```javascript
const CIRCUIT_BREAKER = {
  threshold: 0.15, // 15% error rate
  windowSize: 10, // Last 10 operations
  cooldownMs: 30000, // 30s pause before retry
};

function checkCircuitBreaker(recentOps) {
  const errors = recentOps.filter((op) => op.status === "error");
  const errorRate = errors.length / recentOps.length;

  if (errorRate > CIRCUIT_BREAKER.threshold) {
    return {
      status: "OPEN",
      reason: `Error rate ${(errorRate * 100).toFixed(1)}% exceeds ${CIRCUIT_BREAKER.threshold * 100}%`,
      action: "pause_and_notify",
      resumeAfterMs: CIRCUIT_BREAKER.cooldownMs,
    };
  }

  return { status: "CLOSED" };
}
```

---

## 📈 Performance Benchmarks

### Real-World Baseline (from TodoList execution)

| Phase  | Operation          | Time       | Benchmark |
| ------ | ------------------ | ---------- | --------- |
| Setup  | Project creation   | 23s        | <60s      |
| Setup  | Dependency install | 11s        | <45s      |
| Build  | Component creation | 5-10s each | <15s      |
| Build  | Full app assembly  | ~3min      | <5min     |
| Verify | Problem check      | <2s        | <5s       |
| Verify | Auto-fix           | <5s        | <10s      |

### Benchmark by App Complexity

| Complexity     | Agents | Expected Time | File Count  |
| -------------- | ------ | ------------- | ----------- |
| **Simple**     | 2-3    | <3 min        | <10 files   |
| **Standard**   | 3-4    | 3-5 min       | 10-20 files |
| **Complex**    | 5+     | 5-10 min      | 20-50 files |
| **Enterprise** | 7+     | 10-20 min     | 50+ files   |

### Performance Optimization Guidelines

1. **Parallelize independent work** - Agents can work simultaneously
2. **Batch similar operations** - Group file writes
3. **Cache dependencies** - Don't reinstall if present
4. **Incremental updates** - Don't rewrite unchanged code

---

## 📝 Audit & Compliance

### Action Logging Requirements

Every significant action MUST be logged:

```javascript
const LOG_SCHEMA = {
  timestamp: 'ISO8601',
  traceId: 'UUID-v4',           // Trace entire autopilot session
  spanId: 'UUID-v4',            // Individual operation
  action: 'string',             // What was done
  target: 'string',             // File/resource affected
  duration_ms: 'number',        // How long it took
  status: 'success|error|skip', // Outcome
  details: 'object'             // Additional context
};

// Example log entry
{
  "timestamp": "2026-01-29T03:30:00.000Z",
  "traceId": "abc-123-def-456",
  "spanId": "ghi-789",
  "action": "create_file",
  "target": "components/TodoInput.tsx",
  "duration_ms": 234,
  "status": "success",
  "details": { "lines": 42, "bytes": 1234 }
}
```

### Compliance Checklist

Before deployment/release, verify:

- [ ] All actions logged with trace ID
- [ ] No secrets in logs
- [ ] Error messages are sanitized
- [ ] Performance metrics recorded
- [ ] User consent for data collection (if applicable)

### Retention Policy

| Log Type       | Retention | Purpose        |
| -------------- | --------- | -------------- |
| Execution logs | 30 days   | Debugging      |
| Metrics        | 90 days   | Analysis       |
| Error logs     | 180 days  | Trend analysis |
| Audit trail    | 1 year    | Compliance     |

---

**Version:** 2.0.0  
**Type:** Execution Policy  
**Applies to:** All multi-phase workflows
