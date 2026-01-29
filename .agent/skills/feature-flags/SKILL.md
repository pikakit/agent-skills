---
name: feature-flags
description: >-
  LaunchDarkly-style feature flag management for A/B testing and gradual rollouts.
  Control features without code deploys. Support kill switches and percentage rollouts.
  Triggers on: feature flag, A/B test, rollout, toggle, kill switch, experiment.
  Coordinates with: cicd-pipeline, perf-optimizer.
metadata:
  category: "devops"
  success_metrics: "flags configured, rollout controlled"
  coordinates_with: "cicd-pipeline, perf-optimizer"
---

# Feature Flags Skill

> **Purpose:** Enable/disable features, run A/B tests, and do gradual rollouts without redeploying.

---

## 🎯 Use Cases

| Use Case               | Example                                  |
| ---------------------- | ---------------------------------------- |
| **A/B Testing**        | Test new checkout flow with 50% of users |
| **Gradual Rollout**    | Enable feature for beta users first      |
| **Kill Switch**        | Instantly disable broken feature         |
| **Environment Toggle** | Different behavior in dev vs prod        |

---

## 📁 Project Structure

```
your-project/
├── .featureflags.json    # Flag configuration
└── src/
    └── flags/
        └── index.ts      # Flag utilities (generated)
```

---

## ⚙️ Configuration Schema

### .featureflags.json

```json
{
  "$schema": "./.agent/skills/feature-flags/schemas/flags.schema.json",
  "flags": {
    "new-checkout-flow": {
      "enabled": true,
      "percentage": 50,
      "description": "New streamlined checkout experience",
      "environments": ["staging", "production"],
      "groups": ["beta-users", "premium"]
    },
    "dark-mode": {
      "enabled": true,
      "percentage": 100,
      "default": false
    },
    "maintenance-mode": {
      "enabled": false,
      "description": "Show maintenance page to all users"
    }
  },
  "defaults": {
    "enabled": false,
    "percentage": 100
  }
}
```

---

## 🔧 Usage

### React Hook

```tsx
import { useFeatureFlag, useABTest } from "@/flags";

function CheckoutPage() {
  const isNewCheckout = useFeatureFlag("new-checkout-flow");

  if (isNewCheckout) {
    return <NewCheckout />;
  }
  return <LegacyCheckout />;
}

// A/B Test with variants
function PricingPage() {
  const variant = useABTest("pricing-experiment", ["control", "variant-a", "variant-b"]);

  switch (variant) {
    case "variant-a":
      return <PricingA />;
    case "variant-b":
      return <PricingB />;
    default:
      return <PricingControl />;
  }
}
```

### Vue Composable

```vue
<script setup>
import { useFeatureFlag } from "@/flags";

const showNewFeature = useFeatureFlag("new-feature");
</script>

<template>
  <NewFeature v-if="showNewFeature" />
  <LegacyFeature v-else />
</template>
```

### Node.js/Backend

```javascript
import { isEnabled, getVariant } from "./flags";

app.get("/api/checkout", (req, res) => {
  if (isEnabled("new-checkout-flow", req.user)) {
    return newCheckoutHandler(req, res);
  }
  return legacyCheckoutHandler(req, res);
});
```

---

## 📊 Flag Manager CLI

```bash
# List all flags
npm run flags:list

# Enable a flag
npm run flags:enable new-checkout-flow

# Disable a flag
npm run flags:disable maintenance-mode

# Set percentage
npm run flags:set new-checkout-flow --percentage 25

# Add user to group
npm run flags:add-group user@example.com beta-users

# Check flag status
npm run flags:status new-checkout-flow
```

---

## 🎲 Targeting Rules

### By Environment

```json
{
  "new-feature": {
    "enabled": true,
    "environments": ["development", "staging"]
  }
}
```

### By User Group

```json
{
  "premium-feature": {
    "enabled": true,
    "groups": ["premium", "enterprise"]
  }
}
```

### By Percentage

```json
{
  "experimental-feature": {
    "enabled": true,
    "percentage": 10
  }
}
```

### By User ID (Consistent Hashing)

Ensures same user always gets same variant:

```javascript
// User ID "abc123" always gets "variant-a"
const variant = getVariant("experiment", userId);
```

---

## 🔗 Workflow Integration

### /flags Workflow

```markdown
/flags # Interactive flag manager
/flags list # List all flags
/flags enable <name> # Enable flag
/flags disable <name> # Disable flag
/flags rollout <name> 25 # Set 25% rollout
```

---

## 📁 Files Reference

| File                        | Purpose            |
| --------------------------- | ------------------ |
| `SKILL.md`                  | This documentation |
| `scripts/flag-manager.js`   | CLI tool           |
| `schemas/flags.schema.json` | Config validation  |
| `templates/react-flag.tsx`  | React hook         |
| `templates/vue-flag.ts`     | Vue composable     |
| `templates/node-flag.js`    | Node.js utility    |

---

## ✅ Best Practices

1. **Naming:** Use kebab-case (`new-checkout-flow`)
2. **Description:** Always add description for clarity
3. **Cleanup:** Remove flags after 100% rollout
4. **Defaults:** Set sensible defaults for safety
5. **Testing:** Test both flag states in tests

---

## ⚠️ Common Pitfalls

| Pitfall            | Solution                                  |
| ------------------ | ----------------------------------------- |
| Flag pollution     | Regularly cleanup released flags          |
| Inconsistent state | Use consistent hashing for user targeting |
| Missing fallbacks  | Always provide default value              |
| Testing gaps       | Test both enabled and disabled states     |
