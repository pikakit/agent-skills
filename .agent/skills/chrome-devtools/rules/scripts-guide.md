---
"title": "All Puppeteer CLI scripts with options."
"kind": "process"
"impact": "standard"
"tags":
  - "scripts"
  - "guide"
"applies_to":
  - "web"
"last_reviewed": "2026-09-28"
"sources":
  - "url": "https://developer.chrome.com/docs/devtools/"
    "title": "Official documentation"
---

# All Puppeteer CLI scripts with options.

## Preconditions

Record the current behavior, target environment, acceptance criteria, and a recoverable baseline before starting.

## Procedure

# Scripts Guide

> All Puppeteer CLI scripts with options.

---

## Navigation

```bash
# Basic navigation
node navigate.ts --url https://example.com

# With timeout
node navigate.ts --url https://slow-site.com --timeout 60000

# Wait strategy
node navigate.ts --url https://example.com --wait-until networkidle2
# Options: load, domcontentloaded, networkidle0, networkidle2

# Close browser when done
node navigate.ts --url about:blank --close true
```

---

## Screenshot

```bash
# Basic screenshot
node screenshot.ts --url https://example.com --output ./shot.png

# Full page
node screenshot.ts --url https://example.com --output ./full.png --full-page true

# Current page (no navigation)
node screenshot.ts --output ./current.png

# Specific element
node screenshot.ts --url https://example.com --selector ".main" --output ./element.png

# Control compression
node screenshot.ts --url https://example.com --output ./shot.png --max-size 3
node screenshot.ts --url https://example.com --output ./shot.png --no-compress
```

---

## Form Automation

```bash
# Fill input
node fill.ts --selector "#email" --value "user@example.com"

# Click element
node click.ts --selector "button[type=submit]"

# Wait for element
node click.ts --selector ".modal-close" --wait true
```

---

## JavaScript Execution

```bash
# Simple expression
node evaluate.ts --script "document.title"

# Complex extraction
node evaluate.ts --script "
  Array.from(document.querySelectorAll('.item')).map(el => ({
    title: el.querySelector('h2')?.textContent,
    link: el.querySelector('a')?.href
  }))
"

# Async operation
node evaluate.ts --script "await new Promise(r => setTimeout(r, 2000))"
```

---

## ARIA Snapshot

```bash
# Get ARIA tree (YAML format)
node aria-snapshot.ts --url https://example.com

# Save to file
node aria-snapshot.ts --url https://example.com --output ./snapshot.yaml
```

**Output format:**

```yaml
- banner:
  - link "Home" [ref=e1]
  - navigation:
    - link "About" [ref=e2]
    - link "Contact" [ref=e3]
- main:
  - heading "Welcome" [level=1]
  - button "Sign Up" [ref=e4]
```

---

## Interact by Ref

```bash
# Click element
node select-ref.ts --ref e4 --action click

# Fill input
node select-ref.ts --ref e5 --action fill --value "search query"

# Get text content
node select-ref.ts --ref e1 --action text

# Screenshot element
node select-ref.ts --ref e1 --action screenshot --output ./logo.png
```

---

## Console & Network

```bash
# Console messages (10 seconds)
node console.ts --url https://example.com --duration 10000

# Filter by type
node console.ts --url https://example.com --types error,warn

# Network requests
node network.ts --url https://example.com

# Find failed requests
node network.ts --url https://example.com | jq '.requests[] | select(.response.status >= 400)'
```

---

## Performance

```bash
# Core Web Vitals
node performance.ts --url https://example.com | jq '.vitals'

# Output: { FCP, LCP, CLS, TTFB }
```

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [aria-snapshot.md](aria-snapshot.md) | ARIA tree format for element discovery |
| [engineering-spec.md](production-gates.md) | Full contracts and architecture |
| [SKILL.md](../SKILL.md) | Quick reference and error taxonomy |

## Rollback

Restore the recorded baseline if a required command errors, evidence becomes inconclusive, or the change introduces a regression.

## Exit Gate

Complete only with fresh, reproducible evidence for the intended behavior and all relevant project checks passing.
