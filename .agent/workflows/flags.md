---
description: Feature flag management for A/B testing and gradual rollouts. Control features without code deploys.
---

# /flags - Feature Flag Manager

$ARGUMENTS

---

## Purpose

Manage feature flags for A/B testing, gradual rollouts, kill switches, and user targeting — toggling features without redeploying code. **Differs from `/launch` (full deployment pipeline) by managing runtime feature visibility at the application layer without requiring a new deploy.** Uses `backend-specialist` with `cicd-pipeline` for flag infrastructure and `server-ops` for environment management.

---

## 🤖 Meta-Agents Integration

| Phase | Agent | Action |
|-------|-------|--------|
| **Pre-Rollout** | `assessor` | Evaluate risk of feature rollout |
| **State Change** | `recovery` | Save flag state before modifications |
| **Post-Change** | `learner` | Learn from rollout success/failure |

```
Flow:
assessor.evaluate(rollout_risk) → recovery.save(flag_state)
       ↓
create/modify flags → verify
       ↓ issue
recovery.restore(flag_state)
       ↓ success
learner.log(rollout_outcome)
```

---

## Sub-Commands

| Command | Action |
|---------|--------|
| `/flags` | Interactive flag manager |
| `/flags list` | List all flags with status |
| `/flags create <name>` | Create new flag |
| `/flags enable <name>` | Enable globally |
| `/flags disable <name>` | Disable (kill switch) |
| `/flags rollout <name> <pct>` | Set rollout percentage |
| `/flags target <name> <rules>` | Set targeting rules |
| `/flags metrics <name>` | Show flag metrics |
| `/flags cleanup` | Detect and remove stale flags |
| `/flags init` | Initialize `.featureflags.json` |

---

## 🔴 MANDATORY: Feature Flag Protocol

### Phase 1: Flag Configuration

| Field | Value |
|-------|-------|
| **INPUT** | $ARGUMENTS (sub-command + flag name + optional rules) |
| **OUTPUT** | Feature flag created/modified in `.featureflags.json` |
| **AGENTS** | `backend-specialist` |
| **SKILLS** | `cicd-pipeline` |

1. `recovery` saves current flag state
2. Parse sub-command and determine action
3. For `create`: generate flag with schema:

```json
{
  "flags": {
    "flag-name": {
      "enabled": true,
      "percentage": 50,
      "targeting": {
        "segments": ["beta-users"],
        "countries": ["US"],
        "platforms": ["ios", "android"]
      },
      "metrics": {
        "track": ["conversion_rate", "error_rate"],
        "baseline": "control"
      },
      "lifecycle": {
        "created": "YYYY-MM-DD",
        "owner": "team-name",
        "stale_after_days": 30
      }
    }
  }
}
```

4. For `rollout`: `assessor` evaluates rollout risk

### Phase 2: Targeting & Rules

| Field | Value |
|-------|-------|
| **INPUT** | Flag configuration from Phase 1 |
| **OUTPUT** | Targeting rules applied to flag |
| **AGENTS** | `backend-specialist` |
| **SKILLS** | `cicd-pipeline` |

**Evaluation order:** Kill switch → User ID → Segment → Country → Platform → Percentage

| Rule Type | Example | Use When |
|-----------|---------|----------|
| **Percentage** | 25% of all users | Gradual rollout |
| **User segment** | beta-users, premium | Group targeting |
| **Country** | US, UK, VN | Geo-targeting |
| **Platform** | ios, android, web | Platform-specific |
| **User ID** | Specific user IDs | Individual targeting |
| **Custom** | `plan === 'pro'` | Business logic |

### Phase 3: Verification & Metrics

| Field | Value |
|-------|-------|
| **INPUT** | Applied flag configuration from Phase 2 |
| **OUTPUT** | Verification result: flag active, metrics tracking, no errors |
| **AGENTS** | `backend-specialist` |
| **SKILLS** | `cicd-pipeline`, `server-ops` |

1. Verify flag is correctly configured across environments:

| Environment | Flag Source | Override |
|------------|-----------|----------|
| **Development** | `.featureflags.json` | All flags ON |
| **Staging** | Remote config | Match production % |
| **Production** | Remote config | Conservative rollout |

2. Verify metrics tracking is active
3. `learner` logs rollout pattern

**Flag lifecycle states:**
```
Created → Testing → Rollout (10→25→50→100%) → Permanent → Cleanup
```

---

## ⛔ MANDATORY: Problem Verification Before Completion

> **CRITICAL:** This check MUST be performed before any `notify_user` or task completion.

### Check @[current_problems]

```
1. Read @[current_problems] from IDE
2. If errors/warnings > 0:
   a. Auto-fix: imports, types, lint errors
   b. Re-check @[current_problems]
   c. If still > 0 → STOP → Notify user
3. If count = 0 → Proceed to completion
```

### Auto-Fixable

| Type | Fix |
|------|-----|
| Missing import | Add import statement |
| Invalid JSON | Fix flag configuration syntax |
| Lint errors | Run eslint --fix |

> **Rule:** Never mark complete with errors in `@[current_problems]`.

---

## Output Format

```markdown
## 🚩 Feature Flags Updated

### Flag Changes

| Flag | Action | Status | Rollout |
|------|--------|--------|---------|
| `new-checkout` | Created | ✅ | 50% |
| `dark-mode` | Updated | ✅ | 10% → 25% |
| `legacy-api` | Disabled | 🔴 | Kill switch |

### Metrics

| Metric | Control | Variant | Δ |
|--------|---------|---------|---|
| Conversion | 3.2% | 4.1% | ↑28% |
| Error rate | 0.5% | 0.3% | ↓40% |
| Confidence | | | 95% ✅ |

### Stale Flags

| Flag | Age | Status | Action |
|------|-----|--------|--------|
| old-onboarding | 45 days | 100% | → Remove |
| beta-search | 30 days | 0% | → Remove |

### Next Steps

- [ ] Monitor metrics for statistical significance
- [ ] Run `/validate` to test both flag states
- [ ] Clean up stale flags with `/flags cleanup`
```

---

## Examples

```
/flags init
/flags create new-checkout --pct 10 --owner team-payments
/flags rollout new-checkout 50
/flags target new-checkout --segment beta-users --country US
/flags metrics new-checkout
/flags cleanup
```

---

## Key Principles

- **Name clearly** — `new-checkout-flow` not `flag1`, every flag has a team owner
- **Set expiry** — `stale_after_days: 30`, clean up after 100% rollout
- **Track metrics** — always measure impact with control vs variant
- **Test both states** — code must work with flag on AND off
- **Gradual rollout** — 10% → 25% → 50% → 100%, never jump to 100%

---

## 🔗 Workflow Chain

**Skills Loaded (2):**

- `cicd-pipeline` - Feature flag infrastructure and deployment
- `server-ops` - Multi-environment flag management

```mermaid
graph LR
    A["/build"] --> B["/flags"]
    B --> C["/launch"]
    style B fill:#10b981
```

| After /flags | Run | Purpose |
|-------------|-----|---------|
| Ready to deploy | `/launch` | Deploy with feature flags |
| Need to verify | `/validate` | Test flag on/off states |
| Flag issues | `/diagnose` | Debug flag behavior |

**Handoff to /launch:**

```markdown
🚩 Feature flags configured. [X] flags active, [Y]% rollout.
Run `/launch` to deploy or `/validate` to test both flag states.
```
