---
name: chrome-devtools
description: >-
  Puppeteer CLI scripts for browser automation, screenshots, debugging.
  Session persistence, JSON output, Core Web Vitals.
  Triggers on: screenshot, browser, puppeteer, devtools, performance.
  Coordinates with: agent-browser, e2e-automation, perf-optimizer.
metadata:
  version: "1.0.0"
  category: "testing"
  triggers: "screenshot, browser, puppeteer, devtools, performance, console, network"
  success_metrics: "screenshot captured, JSON output, session persists"
  coordinates_with: "agent-browser, e2e-automation, perf-optimizer"
---

# Chrome DevTools

> Puppeteer CLI scripts. Session persistence. JSON output.

---

## Prerequisites

**Required:**
- Node.js 18+
- Puppeteer (`npm install puppeteer sharp yargs`)

**Linux/WSL:**
- Chrome dependencies (`./install-deps.sh`)

---

## When to Use

| Use This For | Use agent-browser For |
|--------------|----------------------|
| Quick screenshots | Long autonomous sessions |
| Custom Puppeteer scripts | Context-constrained AI workflows |
| WebSocket debugging | Cloud browsers (CI/CD) |
| Auth injection | Multi-tab with @refs |

---

## Available Scripts

| Script | Purpose |
|--------|---------|
| `navigate.js` | Navigate to URLs |
| `screenshot.js` | Capture screenshots (auto-compress >5MB) |
| `click.js` | Click elements |
| `fill.js` | Fill form fields |
| `evaluate.js` | Execute JavaScript |
| `aria-snapshot.js` | Get ARIA tree (YAML) |
| `select-ref.js` | Interact by ref |
| `console.js` | Monitor console |
| `network.js` | Track HTTP requests |
| `performance.js` | Core Web Vitals |

---

## Session Persistence

```bash
# 1. First script - launches browser
node navigate.js --url https://example.com/login

# 2. Subsequent scripts - reuse browser
node fill.js --selector "#email" --value "user@example.com"
node click.js --selector "button[type=submit]"

# 3. Close when done
node navigate.js --url about:blank --close true
```

---

## Quick Examples

### Screenshot

```bash
# Basic
node screenshot.js --url https://example.com --output ./shot.png

# Full page
node screenshot.js --url https://example.com --output ./full.png --full-page true

# Current page (no navigation)
node screenshot.js --output ./current.png
```

### Form Automation

```bash
node fill.js --selector "#email" --value "test@example.com"
node fill.js --selector "#password" --value "secret"
node click.js --selector "button[type=submit]"
```

### JavaScript Execution

```bash
node evaluate.js --script "document.title"

node evaluate.js --script "
  Array.from(document.querySelectorAll('.item')).map(el => ({
    title: el.textContent
  }))
"
```

### Performance

```bash
node performance.js --url https://example.com | jq '.vitals'
# { FCP: 1200, LCP: 2400, CLS: 0.05, TTFB: 300 }
```

---

## Common Options

| Option | Description |
|--------|-------------|
| `--headless false` | Show browser window |
| `--close true` | Close browser completely |
| `--timeout 30000` | Timeout in ms |
| `--wait-until networkidle2` | Wait strategy |

---

## 📑 Content Map

| File | Description |
|------|-------------|
| `references/scripts-guide.md` | All scripts with options |
| `references/aria-snapshot.md` | ARIA tree format |
| `scripts/` | Puppeteer CLI scripts |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `Cannot find puppeteer` | Run `npm install` in scripts dir |
| `libnss3.so` missing | Run `./install-deps.sh` (Linux) |
| Element not found | Use `aria-snapshot.js` first |
| Screenshot >5MB | Auto-compressed, use `--max-size 3` |
| Session stale | Delete `.browser-session.json` |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `agent-browser` | Skill | AI-optimized automation |
| `e2e-automation` | Skill | Playwright testing |
| `perf-optimizer` | Skill | Performance optimization |

---

⚡ PikaKit v3.9.67
