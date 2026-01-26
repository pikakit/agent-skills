# Rebrand Script

## Universal Smart Rebrand Tool

Automatically rebrand entire codebase with intelligent pattern matching.

### Features

- **Smart Variations**: Handles all naming conventions (kebab-case, snake_case, PascalCase, etc.)
- **Context-Aware**: Skips URLs, git hashes, and other special contexts
- **Dry Run Mode**: Preview changes before applying
- **Detailed Reports**: JSON export with full change log
- **Safety First**: Confirmation prompt for live runs

### Usage

```bash
# Preview changes (recommended first)
python rebrand.py "Old Name" "New Name" --dry-run

# Apply changes
python rebrand.py "Old Name" "New Name"

# With detailed report
python rebrand.py "Old Name" "New Name" --export-report
```

### Examples

```bash
# Rebrand company name
python rebrand.py "Acme Corp" "NewCo Inc" --dry-run

# Rebrand project name
python rebrand.py "Legacy Project" "Modern App"

# Custom root directory
python rebrand.py "OldName" "NewName" --root ./packages/core
```

### Name Variations Handled

The script automatically generates and replaces all these variations:

| Variation | Example Old | Example New |
|-----------|-------------|-------------|
| Original | `Antigravity Kit` | `Agent Skill Kit` |
| lowercase | `antigravity kit` | `agent skill kit` |
| UPPERCASE | `ANTIGRAVITY KIT` | `AGENT SKILL KIT` |
| kebab-case | `antigravity-kit` | `agent-skill-kit` |
| snake_case | `antigravity_kit` | `agent_skill_kit` |
| PascalCase | `AntigravityKit` | `AgentSkillKit` |
| camelCase | `antigravityKit` | `agentSkillKit` |
| SCREAMING_SNAKE | `ANTIGRAVITY_KIT` | `AGENT_SKILL_KIT` |

### What It Scans

- Python files (`.py`)
- Markdown files (`.md`)
- JSON files (`.json`)
- JavaScript/TypeScript (`.js`, `.ts`, `.tsx`, `.jsx`)

### What It Skips

- `node_modules/`, `.git/`, `dist/`, `build/`
- Lock files (`package-lock.json`, etc.)
- Git commit SHAs
- URLs (unless explicitly a domain name)

### Safety Features

1. **Dry Run**: Always test first with `--dry-run`
2. **Confirmation**: Prompts before making changes
3. **Context Awareness**: Won't replace inside URLs or hashes
4. **Error Handling**: Graceful failures with detailed error log
5. **Report Export**: Full audit trail in JSON

### Output Example

```
🚀 Starting Smart Rebrand
   Old Name: Antigravity Kit
   New Name: Agent Skill Kit
   Mode: DRY RUN

📝 Name Variations:
   original     : Antigravity Kit → Agent Skill Kit
   kebab-case   : antigravity-kit → agent-skill-kit
   ...

🔍 Scanning 502 files...

📊 REBRAND SUMMARY
==================================
📝 Modified Files: 4
----------------------------------

.agent/scripts/checklist.py (3 replacements)
  • original: Antigravity Kit → Agent Skill Kit (3x)

Total Replacements: 7
Files Modified: 4
Errors: 0
```

### Best Practices

1. **Always dry-run first**: `--dry-run`
2. **Review changes**: `git diff` after running
3. **Test thoroughly**: Run tests after rebrand
4. **Commit separately**: Don't mix with other changes
5. **Export reports**: Keep audit trail with `--export-report`

### Integration with Git

```bash
# Standard workflow
python rebrand.py "Old" "New" --dry-run  # Preview
python rebrand.py "Old" "New"            # Apply
git diff                                  # Review
git add .
git commit -m "rebrand: Old → New"
git push
```
