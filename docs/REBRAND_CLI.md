# Rebrand CLI

Beautiful interactive rebrand tool powered by @clack/prompts.

## Features

✨ **Beautiful UI** - Interactive prompts with clack  
🔍 **Deep Scanning** - Multiple naming conventions  
⚡ **Fast** - Async file processing  
🛡️ **Safe** - Dry-run mode by default

## Usage

### Interactive Mode (Recommended)

```bash
node rebrand.mjs
```

Follow the prompts:
1. Enter old brand name
2. Enter new brand name  
3. Choose dry-run or live mode
4. Confirm changes

### Example Output

```
┌   Smart Rebrand v2
│
◆  Old brand name:
│  Antigravity Kit
│
◆  New brand name:
│  Agent Skill Kit
│
◆  Run mode:
│  ● Dry Run (preview only)
│  ○ Live Mode (apply changes)
│
◇  Scanning files...
│  Found 5 files with references
│
▲  Files to modify
│  .agent/ARCHITECTURE.md (3 matches)
│  upgrade_scripts_v3.1.py (2 matches)
│  ... and 3 more
│
└  Dry run complete. No files were modified.
```

## Name Variations

Automatically handles:
- `Original Case` → Exact match
- `lowercase` → all lowercase
- `UPPERCASE` → ALL UPPERCASE  
- `kebab-case` → hyphen-separated
- `snake_case` → underscore-separated
- `camelCase` → first word lowercase
- `PascalCase` → all words capitalized
- `CONSTANT_CASE` → SCREAMING_SNAKE_CASE

## Safety

- **Dry run default** - Preview before applying
- **Confirmation required** - For live mode
- **Error handling** - Graceful failures
- **Git recommended** - Always commit before rebrand

## Comparison with Python Version

| Feature | Python (`rebrand.py`) | JavaScript (`rebrand.mjs`) |
|---------|----------------------|---------------------------|
| **UI** | Plain text | Beautiful clack prompts |
| **Speed** | Sequential | Async/parallel |
| **Dependencies** | None | @clack/prompts, glob |
| **AST Parsing** | ✅ (Python only) | ❌ |
| **Interactivity** | CLI args | Interactive prompts |
| **Best for** | CI/CD, automation | Manual rebrand tasks |

## Installation

Standalone (already done):
```bash
npm install @clack/prompts picocolors glob
```

Or integrate into existing project package.json.
