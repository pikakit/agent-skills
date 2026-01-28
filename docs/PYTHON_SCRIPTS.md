# Python Scripts Reference

This document lists Python scripts used in **skill-level** validation tools.

> **Note:** Master scripts (checklist, verify_all, etc.) have been migrated to JavaScript. See `.agent/scripts-js/`.

## Required Python Version

- **Python 3.8+** recommended

## Skill-Level Scripts

These scripts remain in Python for specialized tooling:

| Script                 | Skill                 | Purpose                |
| ---------------------- | --------------------- | ---------------------- |
| `security_scan.py`     | vulnerability-scanner | OWASP security audit   |
| `lint_runner.py`       | lint-and-validate     | Run linting tools      |
| `schema_validator.py`  | database-design       | Validate DB schemas    |
| `ux_audit.py`          | frontend-design       | UX accessibility check |
| `seo_checker.py`       | seo-fundamentals      | SEO validation         |
| `lighthouse_audit.py`  | performance-profiling | Web performance audit  |
| `playwright_runner.py` | webapp-testing        | E2E test runner        |
| `test_runner.py`       | testing-patterns      | Test suite runner      |

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

See [MIGRATION.md](../MIGRATION.md) for details.
