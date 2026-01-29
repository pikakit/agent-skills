---
description: Feature flag management for A/B testing and gradual rollouts. Control features without code deploys.
---

# /flags - Feature Flag Manager

$ARGUMENTS

---

## Purpose

Manage feature flags for A/B testing, gradual rollouts, and kill switches. **Toggle features without redeploying.**

---

## ðŸ¤– Meta-Agents Integration

| Phase | Agent | Action |
| ----- | ----- | ------ |
| **Rollout Planning** | `assessor` | Evaluate risk of feature rollout |
| **State Backup** | `recovery` | Save flag state before changes |
| **A/B Learning** | `learner` | Learn from rollout success/failure patterns |
| **On Issues** | `recovery` | Quick rollback via kill switch |

```
Flow:
assessor.evaluate(rollout_risk) â†’ safe %?
       â†“
recovery.save(flag_state) â†’ enable flag
       â†“
monitor â†’ issues? â†’ recovery.restore() â†’ learner.log()
       â†“
success â†’ learner.log(pattern)
```

---

## Commands

| Command                              | Action                        |
| ------------------------------------ | ----------------------------- |
| `/flags`                             | Interactive flag manager      |
| `/flags list`                        | List all flags                |
| `/flags enable <name>`               | Enable a flag                 |
| `/flags disable <name>`              | Disable a flag                |
| `/flags rollout <name> <percentage>` | Set rollout percentage        |
| `/flags create <name>`               | Create new flag               |
| `/flags status <name>`               | Show flag details             |
| `/flags init`                        | Initialize .featureflags.json |

---

## Quick Start

### 1. Initialize

// turbo

```bash
node .agent/skills/cicd-pipeline/scripts/flag-manager.js init
```

### 2. List Flags

// turbo

```bash
node .agent/skills/cicd-pipeline/scripts/flag-manager.js list
```

### 3. Enable/Disable

```bash
node .agent/skills/cicd-pipeline/scripts/flag-manager.js enable new-checkout
node .agent/skills/cicd-pipeline/scripts/flag-manager.js disable maintenance-mode
```

### 4. Gradual Rollout

```bash
node .agent/skills/cicd-pipeline/scripts/flag-manager.js set new-feature --percentage 25
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

### Node.js/Express

```javascript
import { isEnabled } from "./flags";

app.get("/api/checkout", (req, res) => {
  if (isEnabled("new-checkout", { userId: req.user.id })) {
    return newCheckout(req, res);
  }
  return oldCheckout(req, res);
});
```

---

## Configuration

File: `.featureflags.json`

```json
{
  "flags": {
    "new-checkout": {
      "enabled": true,
      "percentage": 50,
      "groups": ["beta-users"]
    }
  }
}
```

---

## Best Practices

1. **Name clearly** - `new-checkout-flow` not `flag1`
2. **Add descriptions** - Future you will thank you
3. **Clean up** - Remove flags after 100% rollout
4. **Test both states** - Ensure code works with flag on/off

---

## ðŸ”— Related

| Workflow    | Purpose           |
| ----------- | ----------------- |
| `/launch`   | Deploy with flags |
| `/validate` | Test flag states  |
| `/diagnose` | Debug flag issues |

