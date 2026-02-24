---
description: Feature flag management for A/B testing and gradual rollouts. Control features without code deploys.
---

# /flags - Feature Flag Manager

$ARGUMENTS

---

## Purpose

Manage feature flags for A/B testing, gradual rollouts, kill switches, and user targeting. **Toggle features without redeploying. Track metrics per flag. Auto-cleanup stale flags.**

---

## 🤖 Meta-Agents Integration

| Phase | Agent | Action |
|-------|-------|--------|
| **Rollout** | `assessor` | Evaluate risk of feature rollout |
| **Backup** | `recovery` | Save flag state before changes |
| **Learning** | `learner` | Learn from rollout success/failure |
| **Issues** | `recovery` | Quick rollback via kill switch |

---

## Commands

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

## Phase 1: Flag Creation & Configuration

### Quick Start

// turbo
```bash
node .agent/skills/cicd-pipeline/scripts/flag-manager.js init
```

### Flag schema

```json
{
  "flags": {
    "new-checkout": {
      "enabled": true,
      "percentage": 50,
      "targeting": {
        "segments": ["beta-users", "premium"],
        "countries": ["US", "UK"],
        "platforms": ["ios", "android"]
      },
      "metrics": {
        "track": ["conversion_rate", "error_rate"],
        "baseline": "old-checkout"
      },
      "lifecycle": {
        "created": "2026-02-01",
        "owner": "team-payments",
        "stale_after_days": 30
      }
    }
  }
}
```

---

## Phase 2: Targeting Rules

| Rule Type | Example | Use When |
|-----------|---------|----------|
| **Percentage** | 25% of all users | Gradual rollout |
| **User segment** | beta-users, premium | Group targeting |
| **Country** | US, UK, VN | Geo-targeting |
| **Platform** | ios, android, web | Platform-specific |
| **User ID** | Specific user IDs | Individual targeting |
| **Custom** | `plan === 'pro'` | Business logic |

**Evaluation order:** Kill switch → User ID → Segment → Country → Platform → Percentage

---

## Phase 3: A/B Testing & Metrics

**Track conversions per flag variant:**

```bash
/flags metrics new-checkout

┌─────────────┬───────────┬───────────┐
│ Metric      │ Control   │ Variant   │
├─────────────┼───────────┼───────────┤
│ Conversion  │ 3.2%      │ 4.1% ↑28% │
│ Error rate  │ 0.5%      │ 0.3% ↓40% │
│ Avg latency │ 450ms     │ 380ms ↓16% │
│ Users       │ 5,000     │ 5,000     │
│ Confidence  │           │ 95% ✅     │
└─────────────┴───────────┴───────────┘

Recommendation: ✅ Roll out to 100% (statistically significant)
```

**Metrics integration:**

| Tool | Purpose |
|------|---------|
| PostHog | Feature flag analytics (built-in) |
| LaunchDarkly | Enterprise flag management |
| Firebase Remote Config | Mobile flags |
| Custom + Redis | Lightweight, self-hosted |

---

## Phase 4: Multi-Environment

| Environment | Flag Source | Override |
|------------|-----------|----------|
| **Development** | `.featureflags.json` | All flags ON |
| **Staging** | Remote config | Match production % |
| **Production** | Remote config | Conservative rollout |

```bash
/flags list --env production

new-checkout:  ✅ 50% (production)
dark-mode:     ⏳ 10% (production)
legacy-api:    🔴 kill-switch OFF
```

---

## Phase 5: Flag Lifecycle & Cleanup

**Stale flag detection:**

```bash
/flags cleanup

⚠️ Stale Flags Detected:

| Flag | Age | Status | Action |
|------|-----|--------|--------|
| old-onboarding | 45 days | 100% | → Remove code + flag |
| beta-search | 30 days | 0% | → Remove flag |
| payment-v2 | 15 days | 50% | ✅ Active |

Auto-cleanup: Remove 2 stale flags? (y/n)
```

**Lifecycle states:**
```
Created → Testing → Rollout (10→25→50→100%) → Permanent → Cleanup
```

---

## Integration

### React
```tsx
import { useFeatureFlag } from "@/flags";

function App() {
  const showNew = useFeatureFlag("new-feature");
  return showNew ? <NewVersion /> : <OldVersion />;
}
```

### Node.js
```javascript
import { isEnabled } from "./flags";

if (isEnabled("new-checkout", { userId: req.user.id, country: "US" })) {
  return newCheckout(req, res);
}
```

---

## Best Practices

1. **Name clearly** — `new-checkout-flow` not `flag1`
2. **Set owner** — every flag has a team owner
3. **Set expiry** — `stale_after_days: 30`
4. **Track metrics** — always measure impact
5. **Clean up** — remove after 100% rollout
6. **Test both states** — code works with flag on/off

---

## 🔗 Workflow Chain

**Skills (2):** `cicd-pipeline` · `server-ops`

| After /flags | Run | Purpose |
|--------------|-----|---------|
| Deploy | `/launch` | Deploy with flags |
| Test | `/validate` | Test flag states |
| Issues | `/diagnose` | Debug flag issues |

---

**Version:** 2.0.0 · **Updated:** v3.9.64
