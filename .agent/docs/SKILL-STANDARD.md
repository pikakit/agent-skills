# Agent Skill Standard

> **Official specification from [agentskills.io](https://agentskills.io)**
>
> Source: [github.com/agentskills/agentskills](https://github.com/agentskills/agentskills)

---

## 📁 Directory Structure

```
skill-name/
├── SKILL.md          # Required - instructions + metadata
├── scripts/          # Optional - executable code
├── references/       # Optional - documentation
└── assets/           # Optional - templates, resources
```

> **Note:** Both `SKILL.md` (uppercase, preferred) and `skill.md` (lowercase) are accepted.

---

## 📋 SKILL.md Format

### File Must Start with Frontmatter

```yaml
---
name: skill-name
description: What this skill does and when to use it.
---
# Skill Title
Instructions go here...
```

> ⚠️ **Critical:** File MUST start with `---` (YAML frontmatter). No content before it.

### Required Fields

| Field         | Required | Max Length | Constraints                              |
| ------------- | -------- | ---------- | ---------------------------------------- |
| `name`        | ✅ Yes   | 64 chars   | kebab-case, lowercase, matches directory |
| `description` | ✅ Yes   | 1024 chars | Non-empty, descriptive                   |

### Optional Fields

| Field           | Max Length | Purpose                                      |
| --------------- | ---------- | -------------------------------------------- |
| `license`       | -          | License name or file reference               |
| `compatibility` | 500 chars  | Environment requirements                     |
| `metadata`      | -          | Key-value pairs (**values must be strings**) |
| `allowed-tools` | -          | Space-delimited tool patterns (experimental) |

### ⚠️ Only 6 Allowed Fields

```yaml
# ONLY these fields are valid:
name, description, license, compatibility, metadata, allowed-tools
```

Any other fields will cause validation errors.

### Full Example

```yaml
---
name: pdf-processing
description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF documents or forms.
license: Apache-2.0
compatibility: Requires Python 3.9+ and pdfplumber
metadata:
  author: "example-org"
  version: "1.0"
allowed-tools: Bash(git:*) Bash(jq:*) Read
---
# PDF Processing

## When to use this skill
...
```

---

## ✅ Validation Rules

### `name` Field (Required)

| Rule        | Constraint                | Example                                       |
| ----------- | ------------------------- | --------------------------------------------- |
| Length      | 1-64 characters           | ✅ `pdf-processing`                           |
| Case        | **Lowercase only**        | ❌ `PDF-Processing`                           |
| Characters  | `a-z`, `0-9`, `-` only    | ❌ `pdf_processing`                           |
| Start/End   | Cannot start/end with `-` | ❌ `-pdf`, `pdf-`                             |
| Consecutive | No `--`                   | ❌ `pdf--processing`                          |
| Match       | Must match directory name | ✅ `pdf-processing/` → `name: pdf-processing` |

### `description` Field (Required)

| Rule     | Constraint                                  |
| -------- | ------------------------------------------- |
| Length   | 1-1024 characters                           |
| Content  | Non-empty, descriptive                      |
| Purpose  | Describe WHAT it does AND WHEN to use it    |
| Keywords | Include task-relevant keywords for matching |

✅ **Good:**

```yaml
description: Extracts text and tables from PDF files, fills PDF forms, and merges multiple PDFs. Use when working with PDF documents or when the user mentions PDFs, forms, or document extraction.
```

❌ **Poor:**

```yaml
description: Helps with PDFs.
```

### `metadata` Field (Optional)

| Rule   | Constraint                           |
| ------ | ------------------------------------ |
| Type   | Dictionary (key-value pairs)         |
| Keys   | Must be strings                      |
| Values | **Must be strings** (quote numbers!) |

```yaml
# ✅ Correct - values are strings
metadata:
  author: "example-org"
  version: "1.0"

# ❌ Wrong - number without quotes
metadata:
  version: 1.0
```

---

## 📏 Size Limits

| Element                     | Limit           | Tokens           |
| --------------------------- | --------------- | ---------------- |
| Metadata (name+description) | -               | ~50-100 tokens   |
| Main SKILL.md               | **< 500 lines** | < 5000 tokens    |
| Reference files             | As needed       | Loaded on demand |

---

## 📂 Optional Directories

### scripts/

Executable code agents can run:

- Self-contained or document dependencies
- Include helpful error messages
- Handle edge cases gracefully
- Supported: Python, Bash, JavaScript

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
┌─────────────────────────────────────────────────────────┐
│ 1. DISCOVERY (~50-100 tokens per skill)                 │
│    Only name + description loaded at startup            │
├─────────────────────────────────────────────────────────┤
│ 2. ACTIVATION (< 5000 tokens)                           │
│    Full SKILL.md loaded when task matches description   │
├─────────────────────────────────────────────────────────┤
│ 3. EXECUTION (as needed)                                │
│    scripts/, references/, assets/ loaded on demand      │
└─────────────────────────────────────────────────────────┘
```

---

## 🔗 File References

Use relative paths from skill root:

```markdown
See [the reference guide](references/REFERENCE.md) for details.

Run the extraction script:
scripts/extract.py
```

Keep references **one level deep**. Avoid deeply nested chains.

---

## 🛡️ Security Guidelines

When executing scripts:

| Guideline        | Description                               |
| ---------------- | ----------------------------------------- |
| **Sandboxing**   | Run scripts in isolated environments      |
| **Allowlisting** | Only execute scripts from trusted skills  |
| **Confirmation** | Ask users before dangerous operations     |
| **Logging**      | Record all script executions for auditing |

---

## 📡 XML Format for Agent Prompts

When injecting skills into agent system prompts, use XML format:

```xml
<available_skills>
<skill>
<name>pdf-processing</name>
<description>Extract text and tables from PDF files, fill forms, merge documents.</description>
<location>/path/to/skills/pdf-processing/SKILL.md</location>
</skill>
<skill>
<name>data-analysis</name>
<description>Analyzes datasets, generates charts, and creates summary reports.</description>
<location>/path/to/skills/data-analysis/SKILL.md</location>
</skill>
</available_skills>
```

---

## 🧪 Validation

### Using skills-ref (Official Python Library)

```bash
# Install
pip install skills-ref

# Validate a skill
skills-ref validate ./my-skill

# Generate XML for prompts
skills-ref to-prompt ./skill1 ./skill2
```

### CLI Commands

```bash
# List errors only
skills-ref validate ./my-skill

# Returns exit code 0 if valid, 1 if errors
```

---

## 📊 Compliance Checklist

| #   | Check | Requirement                                  |
| --- | ----- | -------------------------------------------- |
| 1   | ☐     | `SKILL.md` or `skill.md` exists in directory |
| 2   | ☐     | File starts with `---` (YAML frontmatter)    |
| 3   | ☐     | `name` field present and non-empty           |
| 4   | ☐     | `name` is kebab-case, 1-64 chars, lowercase  |
| 5   | ☐     | `name` matches directory name exactly        |
| 6   | ☐     | No consecutive hyphens (`--`) in name        |
| 7   | ☐     | `description` field present, 1-1024 chars    |
| 8   | ☐     | Only allowed frontmatter fields used         |
| 9   | ☐     | `metadata` values are strings (quoted)       |
| 10  | ☐     | SKILL.md < 500 lines                         |

---

## 📚 Reference

| Resource               | URL                                                                                                                        |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Official Specification | [agentskills.io/specification](https://agentskills.io/specification)                                                       |
| Example Skills         | [github.com/anthropics/skills](https://github.com/anthropics/skills)                                                       |
| Reference Library      | [github.com/agentskills/agentskills/skills-ref](https://github.com/agentskills/agentskills/tree/main/skills-ref)           |
| Best Practices         | [platform.claude.com/.../best-practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) |
