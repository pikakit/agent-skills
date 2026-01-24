# Python Scripts Requirements

This document lists the Python dependencies required for running the validation scripts in `.agent/skills/*/scripts/`.

## Required Python Version

- **Python 3.8+** recommended

## Installation

Most scripts use only Python standard library. However, some may require additional packages:

```bash
# Install common dependencies
pip install pyyaml requests
```

## Available Scripts

| Script | Location | Description |
|--------|----------|-------------|
| `security_scan.py` | vulnerability-scanner | OWASP security audit |
| `lint_runner.py` | lint-and-validate | Run linting tools |
| `schema_validator.py` | database-design | Validate DB schemas |
| `ux_audit.py` | frontend-design | UX accessibility check |
| `seo_checker.py` | seo-fundamentals | SEO validation |
| `lighthouse_audit.py` | performance-profiling | Web performance audit |
| `playwright_runner.py` | webapp-testing | E2E test runner |
| `mobile_audit.py` | mobile-design | Mobile UI validation |
| `i18n_checker.py` | i18n-localization | Translation check |
| `geo_checker.py` | geo-fundamentals | GenAI optimization |
| `api_validator.py` | api-patterns | API contract validation |
| `test_runner.py` | testing-patterns | Test suite runner |
| `type_coverage.py` | lint-and-validate | TypeScript coverage |
| `accessibility_checker.py` | frontend-design | A11y audit |

## Running Scripts

```bash
# Run from project root
python .agent/skills/vulnerability-scanner/scripts/security_scan.py .

# Or use npm scripts
npm run scan:security
npm run lint
npm run checklist
```

## Troubleshooting

If a script fails with import errors, ensure you have the required dependencies:

```bash
pip install -r requirements.txt  # If available in script directory
```
