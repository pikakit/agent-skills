---
name: chrome-devtools
description: >-
  Puppeteer CLI scripts for browser automation, screenshots, debugging.
  Session persistence, JSON output, Core Web Vitals.
  Triggers on: screenshot, browser, puppeteer, devtools, performance.
  Coordinates with: agent-browser, e2e-automation, perf-optimizer.
metadata:
  version: "2.0.0"
  category: "testing"
  triggers: "screenshot, browser, puppeteer, devtools, performance, console, network"
  success_metrics: "JSON output on all scripts, screenshots ≤ 5MB, session persists across scripts"
  coordinates_with: "agent-browser, e2e-automation, perf-optimizer"
---

# Chrome DevTools — Puppeteer CLI

> Direct Puppeteer CLI scripts. Session persistence. JSON output. Auto-compressed screenshots.

---

## Prerequisites

**Required:**
- Node.js 18+
- Puppeteer: `npm install puppeteer sharp yargs`

**Linux/WSL:** Chrome dependencies via `./install-deps.sh`

---

## When to Use

| Use This For | Use `agent-browser` For |
|--------------|------------------------|
| Quick screenshots | Long autonomous AI sessions |
| Custom Puppeteer scripts | Context-constrained agent workflows |
| WebSocket debugging | Cloud browsers (CI/CD) |
| Core Web Vitals measurement | Multi-tab @ref interactions |
| Auth injection, form filling | AI-optimized element referencing |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| 10 Puppeteer CLI scripts | E2E test suites (→ e2e-automation) |
| Session persistence (.browser-session.json) | AI @ref handle system (→ agent-browser) |
| Screenshot capture + auto-compress | Performance recommendations (→ perf-optimizer) |
| Core Web Vitals measurement | Cross-browser testing |
| Console/network monitoring | Browser installation |

**Side effects:** Launches browser processes, writes files (screenshots, session), executes JavaScript in page context, navigates pages with network requests.

---

## Available Scripts

| Script | Purpose | Side Effects | Idempotent |
|--------|---------|-------------|-----------|
| `navigate.js` | Navigate to URL | Browser launch, page navigation | No |
| `screenshot.js` | Capture screenshot | File write (auto-compress > 5MB) | No |
| `click.js` | Click element | Page state mutation | No |
| `fill.js` | Fill form field | Form state mutation | No |
| `evaluate.js` | Execute JavaScript | Depends on script content | Depends |
| `aria-snapshot.js` | Get ARIA tree (YAML) | None (read-only) | Yes |
| `select-ref.js` | Interact by ref | Page state mutation | No |
| `console.js` | Monitor console | None (passive) | Yes |
| `network.js` | Track HTTP requests | None (passive) | Yes |
| `performance.js` | Core Web Vitals | Navigation + measurement | No |

---

## Session Persistence

```bash
# 1. Launch session (browser starts)
node navigate.js --url https://example.com/login

# 2. Interact (browser reuses session)
node fill.js --selector "#email" --value "user@example.com"
node click.js --selector "button[type=submit]"

# 3. Capture
node screenshot.js --output ./result.png

# 4. Close (browser terminates)
node navigate.js --close true
```

**State:** `.browser-session.json` in working directory. One session per directory. Delete file to reset.

---

## Common Options

| Option | Default | Description |
|--------|---------|-------------|
| `--headless false` | true | Show browser window |
| `--close true` | false | Terminate browser process |
| `--timeout 30000` | 30000 | Timeout in ms |
| `--wait-until networkidle2` | load | Wait strategy |
| `--full-page true` | false | Full page screenshot |
| `--max-size 5` | 5 | Max screenshot MB before auto-compress |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_ELEMENT_NOT_FOUND` | Yes | CSS selector matched no elements |
| `ERR_NAVIGATION_TIMEOUT` | Yes | Page did not load within timeout |
| `ERR_BROWSER_DISCONNECTED` | Yes | Browser process unreachable |
| `ERR_BROWSER_CRASHED` | Yes | Browser terminated unexpectedly |
| `ERR_PUPPETEER_MISSING` | No | Puppeteer npm package not installed |
| `ERR_SCRIPT_FAILED` | Yes | JavaScript execution threw error |
| `ERR_WRITE_FAILED` | Yes | Screenshot/file write failed |
| `ERR_INVALID_SELECTOR` | No | CSS selector syntactically invalid |
| `ERR_SESSION_CORRUPTED` | Yes | Session file is invalid JSON |

**Zero internal retries.** Scripts execute once and return JSON. Callers own retry logic.

---

## Troubleshooting

| Problem | Cause | Resolution |
|---------|-------|------------|
| `Cannot find puppeteer` | Not installed | `npm install puppeteer sharp yargs` |
| `libnss3.so` missing | Linux deps | Run `./install-deps.sh` |
| Element not found | Wrong selector | Use `aria-snapshot.js` to find correct selector |
| Screenshot > 5MB | High DPI / full page | Auto-compressed; use `--max-size 3` for smaller |
| Session stale | Browser died | Delete `.browser-session.json`, re-launch |
| Script hangs | Page never loads | Increase `--timeout` or check URL |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [scripts-guide.md](references/scripts-guide.md) | Complete script reference with all options | Detailed script usage |
| [aria-snapshot.md](references/aria-snapshot.md) | ARIA tree format and usage | Element discovery |
| [scripts/](scripts/) | Puppeteer CLI scripts | Script execution |
| [engineering-spec.md](references/engineering-spec.md) | Full engineering spec: contracts, security, scalability | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `agent-browser` | Skill | AI-optimized browser automation with @ref handles |
| `e2e-automation` | Skill | Playwright E2E testing |
| `perf-optimizer` | Skill | Performance analysis and recommendations |

---

⚡ PikaKit v3.9.105
