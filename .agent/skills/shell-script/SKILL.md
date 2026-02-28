---
name: shell-script
description: >-
  Bash/Linux terminal patterns. Critical commands, piping, error handling, scripting.
  Use when working on macOS or Linux systems.
  Triggers on: shell, bash, script, automation, CLI.
  Coordinates with: cicd-pipeline, server-ops.
metadata:
  version: "1.0.0"
  category: "framework"
  triggers: "shell, bash, script, automation, CLI, Linux, macOS"
  success_metrics: "script runs, no errors"
  coordinates_with: "cicd-pipeline, server-ops"
---

# Bash Linux Patterns

> Essential patterns for Bash on Linux/macOS.

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Automation scripts | Use script template |
| File operations | Check file commands |
| Process management | See process section |
| Text processing | Use grep/sed/awk |

---

## 1. Operator Syntax

| Operator | Meaning                   | Example                     |
| -------- | ------------------------- | --------------------------- |
| `;`      | Run sequentially          | `cmd1; cmd2`                |
| `&&`     | Run if previous succeeded | `npm install && npm run dev`|
| `\|\|`   | Run if previous failed    | `npm test \|\| echo "fail"` |
| `\|`     | Pipe output               | `ls \| grep ".js"`          |

---

## 2. File Operations

| Task            | Command                              |
| --------------- | ------------------------------------ |
| List all        | `ls -la`                             |
| Find files      | `find . -name "*.js" -type f`        |
| Search in files | `grep -r "pattern" --include="*.js"` |
| File size       | `du -sh *`                           |
| First/Last N    | `head -n 20` / `tail -n 20`          |

---

## 3. Process Management

| Task           | Command                       |
| -------------- | ----------------------------- |
| List processes | `ps aux`                      |
| Find by name   | `ps aux \| grep node`         |
| Kill by PID    | `kill -9 <PID>`               |
| Find port user | `lsof -i :3000`               |
| Kill port      | `kill -9 $(lsof -t -i :3000)` |

---

## 4. Text Processing

| Tool   | Purpose    | Example                         |
| ------ | ---------- | ------------------------------- |
| `grep` | Search     | `grep -rn "TODO" src/`          |
| `sed`  | Replace    | `sed -i 's/old/new/g' file.txt` |
| `awk`  | Columns    | `awk '{print $1}' file.txt`     |
| `cut`  | Cut fields | `cut -d',' -f1 data.csv`        |

---

## 5. Environment Variables

| Task          | Command                         |
| ------------- | ------------------------------- |
| View all      | `env` or `printenv`             |
| Set temporary | `export VAR="value"`            |
| Add to PATH   | `export PATH="$PATH:/new/path"` |

---

## 6. Network

| Task         | Command                            |
| ------------ | ---------------------------------- |
| Download     | `curl -O https://example.com/file` |
| API request  | `curl -X GET URL`                  |
| POST JSON    | `curl -X POST -H "Content-Type: application/json" -d '{}' URL` |
| Check port   | `nc -zv localhost 3000`            |

---

## 7. Script Template

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

## 8. Common Patterns

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

| Task       | PowerShell           | Bash             |
| ---------- | -------------------- | ---------------- |
| List files | `Get-ChildItem`      | `ls -la`         |
| Env var    | `$env:VAR`           | `$VAR`           |
| Pipeline   | Object-based         | Text-based       |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `cicd-pipeline` | Skill | CI/CD scripts |
| `server-ops` | Skill | Server management |

---

⚡ PikaKit v3.9.68
