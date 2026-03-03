# Scripts Guide

> All Puppeteer CLI scripts with options.

---

## Navigation

```bash
# Basic navigation
node navigate.js --url https://example.com

# With timeout
node navigate.js --url https://slow-site.com --timeout 60000

# Wait strategy
node navigate.js --url https://example.com --wait-until networkidle2
# Options: load, domcontentloaded, networkidle0, networkidle2

# Close browser when done
node navigate.js --url about:blank --close true
```

---

## Screenshot

```bash
# Basic screenshot
node screenshot.js --url https://example.com --output ./shot.png

# Full page
node screenshot.js --url https://example.com --output ./full.png --full-page true

# Current page (no navigation)
node screenshot.js --output ./current.png

# Specific element
node screenshot.js --url https://example.com --selector ".main" --output ./element.png

# Control compression
node screenshot.js --url https://example.com --output ./shot.png --max-size 3
node screenshot.js --url https://example.com --output ./shot.png --no-compress
```

---

## Form Automation

```bash
# Fill input
node fill.js --selector "#email" --value "user@example.com"

# Click element
node click.js --selector "button[type=submit]"

# Wait for element
node click.js --selector ".modal-close" --wait true
```

---

## JavaScript Execution

```bash
# Simple expression
node evaluate.js --script "document.title"

# Complex extraction
node evaluate.js --script "
  Array.from(document.querySelectorAll('.item')).map(el => ({
    title: el.querySelector('h2')?.textContent,
    link: el.querySelector('a')?.href
  }))
"

# Async operation
node evaluate.js --script "await new Promise(r => setTimeout(r, 2000))"
```

---

## ARIA Snapshot

```bash
# Get ARIA tree (YAML format)
node aria-snapshot.js --url https://example.com

# Save to file
node aria-snapshot.js --url https://example.com --output ./snapshot.yaml
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
node select-ref.js --ref e4 --action click

# Fill input
node select-ref.js --ref e5 --action fill --value "search query"

# Get text content
node select-ref.js --ref e1 --action text

# Screenshot element
node select-ref.js --ref e1 --action screenshot --output ./logo.png
```

---

## Console & Network

```bash
# Console messages (10 seconds)
node console.js --url https://example.com --duration 10000

# Filter by type
node console.js --url https://example.com --types error,warn

# Network requests
node network.js --url https://example.com

# Find failed requests
node network.js --url https://example.com | jq '.requests[] | select(.response.status >= 400)'
```

---

## Performance

```bash
# Core Web Vitals
node performance.js --url https://example.com | jq '.vitals'

# Output: { FCP, LCP, CLS, TTFB }
```

---

⚡ PikaKit v3.9.74
