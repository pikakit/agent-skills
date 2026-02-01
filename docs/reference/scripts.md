# Python Scripts Reference

This document lists Python scripts used in **skill-level** validation tools.

> **Note:** Master scripts (checklist, verify_all, etc.) have been migrated to JavaScript. See `.agent/scripts-js/`.

## Required Python Version

- **Python 3.8+** recommended

## Skill-Level Scripts

These scripts remain in Python for specialized tooling:

| Script                 | Skill            | Purpose                |
| ---------------------- | ---------------- | ---------------------- |
| `security_scan.py`     | security-scanner | OWASP security audit   |
| `lint_runner.py`       | code-quality     | Run linting tools      |
| `schema_validator.py`  | data-modeler     | Validate DB schemas    |
| `ux_audit.py`          | design-system    | UX accessibility check |
| `seo_checker.py`       | seo-optimizer    | SEO validation         |
| `lighthouse_audit.py`  | perf-optimizer   | Web performance audit  |
| `playwright_runner.py` | e2e-automation   | E2E test runner        |
| `test_runner.py`       | test-architect   | Test suite runner      |

## Usage

```bash
# Via npm scripts
npm run scan:security
npm run lint

# Direct execution
python .agent/skills/SecurityScanner/scripts/security_scan.py .
```

## Installation

Most scripts use Python standard library. For specific dependencies:

```bash
pip install pyyaml requests
```

## Master Scripts (JavaScript)

For master validation scripts, use:

```bash
npm run checklist      # Quick validation
npm run verify <URL>   # Full verification
npm run preview:start  # Dev server
npm run session:status # Project info
```

See [migration.md](../guides/migration.md) for details.

