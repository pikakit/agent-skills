---
name: agent-browser
description: >-
  AI-optimized browser automation with context-efficient snapshots.
  Uses @ref handles for 93% less context than traditional tools.
  Triggers on: browser automation, web testing, scraping, UI verification.
  Coordinates with: e2e-automation, chrome-devtools, test-architect.
metadata:
  version: "1.0.0"
  category: "testing"
  triggers: "browser automation, web testing, scraping, UI verification, headless"
  success_metrics: "test passes, screenshot captured, context under 500 chars"
  coordinates_with: "e2e-automation, chrome-devtools, test-architect"
---

# Agent Browser

> AI-optimized browser automation. Snapshots + @refs = 93% less context.

---

## Prerequisites

**Required:**
- Node.js 18+
- Playwright (`npm install playwright`)

**Optional:**
- Browserbase account (for cloud browsers)

---

## When to Use

| Use This For | Use chrome-devtools For |
|--------------|------------------------|
| Long autonomous sessions | Quick screenshots |
| Context-constrained workflows | Custom Puppeteer scripts |
| Video recording | WebSocket debugging |
| Cloud browsers (CI/CD) | Auth injection |
| Multi-tab handling | Existing integrations |

---

## 4-Step Workflow

```bash
# 1. Navigate
agent-browser open https://example.com

# 2. Snapshot (get @refs)
agent-browser snapshot -i
# Output: @e1=Login @e2=Email @e3=Password

# 3. Interact
agent-browser fill @e2 "user@example.com"
agent-browser fill @e3 "password123"
agent-browser click @e1

# 4. Re-snapshot (verify changes)
agent-browser snapshot -i
```

---

## Commands

| Command | Description |
|---------|-------------|
| `open <url>` | Navigate to URL |
| `snapshot -i` | Get interactive elements with @refs |
| `click @ref` | Click element |
| `fill @ref "text"` | Type into input |
| `screenshot [path]` | Capture screenshot |
| `record start/stop` | Video recording |

---

## @ref System

Instead of CSS selectors or XPath, use @refs:

```bash
# Snapshot output
@e1 = button[Login]
@e2 = input[type=email]
@e3 = input[type=password]
@e4 = a[Sign up]

# Use directly
agent-browser click @e1
agent-browser fill @e2 "email@example.com"
```

**Benefits:**
- ~280 chars vs 8K+ for full HTML
- Stable across page changes
- Human-readable labels

---

## Example Prompts

- "Test the login flow at example.com"
- "Fill out the contact form and verify success message"
- "Record video of checkout process"
- "Take screenshot of pricing comparison table"
- "Run this test on Browserbase for CI"

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| @ref not found | Run `snapshot -i` again |
| Element not clickable | Wait for page load, check visibility |
| Timeout | Increase timeout, check network |
| Video not saving | Ensure `record stop` called |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `e2e-automation` | Skill | Playwright testing |
| `chrome-devtools` | Skill | DevTools, screenshots |
| `test-architect` | Skill | Test patterns |

---

⚡ PikaKit v3.9.67
