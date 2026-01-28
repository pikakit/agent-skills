# Agent Skill Standard

> **Official specification from [agentskills.io](https://agentskills.io)**

---

## 📁 Directory Structure

```
skill-name/
├── SKILL.md          # Required - instructions + metadata
├── scripts/          # Optional - executable code
├── references/       # Optional - documentation
└── assets/           # Optional - templates, resources
```

---

## 📋 SKILL.md Format

### Required Frontmatter

```yaml
---
name: skill-name
description: What this skill does and when to use it.
---
```

### Optional Fields

```yaml
---
name: pdf-processing
description: Extract text and tables from PDF files, fill forms, merge documents.
license: Apache-2.0
compatibility: Requires Python 3.9+ and pdfplumber
metadata:
  author: example-org
  version: "1.0"
allowed-tools: Bash(git:*) Bash(jq:*) Read
---
```

---

## ✅ Validation Rules

### `name` Field (Required)

| Rule       | Constraint                                     |
| ---------- | ---------------------------------------------- |
| Length     | 1-64 characters                                |
| Case       | **Lowercase only**                             |
| Characters | Letters, numbers, hyphens (`a-z`, `0-9`, `-`)  |
| Hyphens    | Cannot start/end with `-`, no consecutive `--` |
| Match      | Must match parent directory name               |

✅ Valid:

```yaml
name: pdf-processing
name: data-analysis
name: code-review
```

❌ Invalid:

```yaml
name: PDF-Processing  # uppercase
name: -pdf            # starts with hyphen
name: pdf--processing # consecutive hyphens
```

### `description` Field (Required)

| Rule     | Constraint                     |
| -------- | ------------------------------ |
| Length   | 1-1024 characters              |
| Content  | Non-empty, descriptive         |
| Keywords | Include task-relevant keywords |

✅ Good:

```yaml
description: Extracts text and tables from PDF files, fills PDF forms, and merges multiple PDFs. Use when working with PDF documents or when the user mentions PDFs, forms, or document extraction.
```

❌ Poor:

```yaml
description: Helps with PDFs.
```

### Optional Fields

| Field           | Max Length | Purpose                           |
| --------------- | ---------- | --------------------------------- |
| `license`       | -          | License name or file reference    |
| `compatibility` | 500 chars  | Environment requirements          |
| `metadata`      | -          | Key-value pairs for custom data   |
| `allowed-tools` | -          | Pre-approved tools (experimental) |

---

## 📄 Body Content

After frontmatter, write Markdown instructions. Recommended sections:

1. **When to use this skill**
2. **Step-by-step instructions**
3. **Examples of inputs and outputs**
4. **Common edge cases**

### Size Limit

| Guideline     | Limit           |
| ------------- | --------------- |
| Main SKILL.md | **< 500 lines** |
| Instructions  | < 5000 tokens   |

> Move detailed content to `references/` folder.

---

## 📂 Optional Directories

### scripts/

Executable code agents can run:

- Self-contained or document dependencies
- Include error messages
- Handle edge cases

Supported: Python, Bash, JavaScript

### references/

Additional documentation loaded on demand:

- `REFERENCE.md` - Detailed technical docs
- `FORMS.md` - Templates or structured data
- Domain-specific files (`finance.md`, `legal.md`)

### assets/

Static resources:

- Templates (document, config)
- Images (diagrams, examples)
- Data files (schemas, lookup tables)

---

## 🔄 Progressive Disclosure

```
┌─────────────────────────────────────────────┐
│ 1. METADATA (~100 tokens)                   │
│    name + description loaded at startup     │
├─────────────────────────────────────────────┤
│ 2. INSTRUCTIONS (< 5000 tokens)             │
│    Full SKILL.md loaded when activated      │
├─────────────────────────────────────────────┤
│ 3. RESOURCES (as needed)                    │
│    scripts/, references/, assets/           │
└─────────────────────────────────────────────┘
```

---

## 🔗 File References

Use relative paths from skill root:

```markdown
See [the reference guide](references/REFERENCE.md) for details.

Run the extraction script:
scripts/extract.py
```

Keep references one level deep.

---

## 🧪 Validation

Validate with skills-ref:

```bash
# Install
pip install skills-ref

# Validate
skills-ref validate ./my-skill
```

Or use Agent Skill Kit CLI:

```bash
npm run skill:validate <skill-name>
```

---

## 📊 Compliance Checklist

| Check | Requirement                      |
| ----- | -------------------------------- |
| ☐     | SKILL.md exists                  |
| ☐     | `name` is kebab-case, 1-64 chars |
| ☐     | `name` matches directory name    |
| ☐     | `description` is 1-1024 chars    |
| ☐     | No uppercase in name             |
| ☐     | No consecutive hyphens           |
| ☐     | SKILL.md < 500 lines             |
| ☐     | Only allowed frontmatter fields  |

---

## 📚 Reference

- [Official Specification](https://agentskills.io/specification)
- [Example Skills](https://github.com/anthropics/skills)
- [Reference Library](https://github.com/agentskills/agentskills/tree/main/skills-ref)
