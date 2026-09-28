# Chrome Devtools Full Agent Rules

> Deterministic compilation of 3 source rules for chrome-devtools v4.0.0. Do not edit directly.

## Rule Index

- [ARIA Snapshot Format](#rule-aria-snapshot) (standard, reference, source: `rules/aria-snapshot.md`)
- [Production verification gates](#rule-production-gates) (high, process, source: `rules/production-gates.md`)
- [All Puppeteer CLI scripts with options.](#rule-scripts-guide) (standard, process, source: `rules/scripts-guide.md`)

<a id="rule-aria-snapshot"></a>

## ARIA Snapshot Format

**Impact:** standard
**Kind:** reference
**Source:** `rules/aria-snapshot.md`

# ARIA Snapshot Format

## Scope

This reference applies only to the platforms declared in metadata and the versions confirmed in the target repository.

## Guidance

# ARIA Snapshot Format

> YAML accessibility tree with refs for interaction.

---

## Format

```yaml
- banner:
  - link "Hacker News" [ref=e1]
    /url: https://news.ycombinator.com
  - navigation:
    - link "new" [ref=e2]
    - link "past" [ref=e3]
- main:
  - list:
    - listitem:
      - link "Show HN: My project" [ref=e8]
      - text: "128 points by user 3 hours ago"
- contentinfo:
  - link "Guidelines" [ref=e20]
```

---

## Notation

| Notation | Meaning |
|----------|---------|
| `[ref=eN]` | Stable ID for interaction |
| `[checked]` | Checkbox/radio selected |
| `[disabled]` | Element inactive |
| `[expanded]` | Accordion/dropdown open |
| `/url:` | Link destination |
| `/placeholder:` | Input placeholder |
| `[level=N]` | Heading level |

---

## Roles

| Role | Element |
|------|---------|
| `banner` | Header |
| `navigation` | Nav menu |
| `main` | Main content |
| `contentinfo` | Footer |
| `link` | Anchor |
| `button` | Button |
| `textbox` | Input |
| `checkbox` | Checkbox |
| `listitem` | List item |
| `heading` | H1-H6 |

---

## Interact by Ref

```bash
# Click
node select-ref.ts --ref e1 --action click

# Fill
node select-ref.ts --ref e5 --action fill --value "text"

# Get text
node select-ref.ts --ref e8 --action text

# Screenshot
node select-ref.ts --ref e1 --action screenshot --output ./element.png
```

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [scripts-guide.md](scripts-guide.md) | All script options and examples |
| [engineering-spec.md](production-gates.md) | Full contracts and architecture |
| [SKILL.md](../SKILL.md) | Quick reference and error taxonomy |

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-production-gates"></a>

## Production verification gates

**Impact:** high
**Kind:** process
**Source:** `rules/production-gates.md`

# Production verification gates

## Preconditions

- Confirm the target platform and dependency versions from the repository.
- Capture a reproducible baseline and define observable acceptance criteria.
- Identify a recoverable rollback point before changing code or configuration.

## Procedure

1. Apply the smallest change that satisfies the documented requirement.
2. Exercise the affected success and failure paths with the narrowest reliable check.
3. Run the repository typecheck, tests, and policy checks that cover the changed surface.
4. Inspect diagnostics for redacted, actionable evidence; a missing or failed checker is not success.

## Rollback

Restore the recorded baseline when a required check errors, the result is inconclusive, or a new regression appears. Re-run the baseline check after restoration.

## Exit Gate

Finish only when required checks execute and pass, acceptance behavior is reproduced, rollback remains available, and residual risks are reported explicitly.

<a id="rule-scripts-guide"></a>

## All Puppeteer CLI scripts with options.

**Impact:** standard
**Kind:** process
**Source:** `rules/scripts-guide.md`

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
