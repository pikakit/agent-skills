---
"title": "ARIA Snapshot Format"
"kind": "reference"
"impact": "standard"
"tags":
  - "aria"
  - "snapshot"
"applies_to":
  - "web"
"last_reviewed": "2026-09-28"
"sources":
  - "url": "https://developer.chrome.com/docs/devtools/"
    "title": "Official documentation"
---

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
