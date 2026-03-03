---
name: shell-script
description: >-
  Bash/Linux terminal patterns. Critical commands, piping, error handling, scripting.
  Use when working on macOS or Linux systems.
  Triggers on: shell, bash, script, automation, CLI.
  Coordinates with: cicd-pipeline, server-ops.
metadata:
  version: "2.0.0"
  category: "framework"
  triggers: "shell, bash, script, automation, CLI, Linux, macOS"
  success_metrics: "script runs, no errors"
  coordinates_with: "cicd-pipeline, server-ops"
---

# Shell Script — Bash/Linux Patterns

> `set -euo pipefail` always. Quote variables. Trap cleanup. Think Unix.

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Automation scripts | Use script template |
| File operations | Check file commands |
| Process management | See process section |
| Text processing | Use grep/sed/awk/cut |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Operator syntax (4 operators) | CI/CD scripts (→ cicd-pipeline) |
| File/process/text commands | Server management (→ server-ops) |
| Script template + patterns | Command execution |
| Bash vs PowerShell mapping | PowerShell expertise |

**Expert decision skill:** Produces command recommendations. Does not execute commands.

---

## Operator Syntax (4 — Fixed)

| Operator | Meaning | Example |
|----------|---------|---------|
| `;` | Run sequentially | `cmd1; cmd2` |
| `&&` | Run if previous succeeded | `npm install && npm run dev` |
| `\|\|` | Run if previous failed | `npm test \|\| echo "fail"` |
| `\|` | Pipe output | `ls \| grep ".js"` |

---

## File Operations (5 Commands)

| Task | Command |
|------|---------|
| List all | `ls -la` |
| Find files | `find . -name "*.js" -type f` |
| Search in files | `grep -r "pattern" --include="*.js"` |
| File size | `du -sh *` |
| First/Last N | `head -n 20` / `tail -n 20` |

---

## Process Management (5 Commands)

| Task | Command |
|------|---------|
| List processes | `ps aux` |
| Find by name | `ps aux \| grep node` |
| Kill by PID | `kill -9 <PID>` |
| Find port user | `lsof -i :3000` |
| Kill port | `kill -9 $(lsof -t -i :3000)` |

---

## Text Processing (4 Tools — Deterministic)

| Tool | Purpose | Example |
|------|---------|---------|
| `grep` | Search | `grep -rn "pattern" src/` |
| `sed` | Replace | `sed -i 's/old/new/g' file.txt` |
| `awk` | Columns | `awk '{print $1}' file.txt` |
| `cut` | Cut fields | `cut -d',' -f1 data.csv` |

---

## Script Template (Fixed)

```bash
#!/bin/bash
set -euo pipefail  # Exit on error, undefined var, pipe fail

log_info() { echo "[INFO] $1"; }
log_error() { echo "[ERROR] $1" >&2; }

main() {
    log_info "Starting..."
    # Your logic here
    log_info "Done!"
}

main "$@"
```

---

## Common Patterns (4)

```bash
# Check command exists
command -v node &> /dev/null && echo "Node installed"

# Default value
NAME=${1:-"default"}

# Loop files
for file in *.js; do echo "$file"; done

# Cleanup trap
trap 'rm -f /tmp/tempfile' EXIT
```

---

## Bash vs PowerShell

| Task | Bash | PowerShell |
|------|------|-----------|
| List files | `ls -la` | `Get-ChildItem` |
| Env var | `$VAR` | `$env:VAR` |
| Pipeline | Text-based | Object-based |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNKNOWN_TASK` | Yes | Task not recognized |
| `ERR_UNSUPPORTED_PLATFORM` | Yes | Platform not linux or macos |

**Zero internal retries.** Same task = same command.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Skip error handling | Always `set -euo pipefail` |
| Unquoted variables | Quote: `"$VAR"` |
| No cleanup | Use `trap 'cleanup' EXIT` |
| Embed credentials | Use environment variables |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [engineering-spec.md](references/engineering-spec.md) | Full spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `cicd-pipeline` | Skill | CI/CD scripts |
| `server-ops` | Skill | Server management |

---

⚡ PikaKit v3.9.74
