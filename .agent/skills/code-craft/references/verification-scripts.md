# Verification Scripts Reference

> Script mapping by agent role.

---

## Agent → Script Mapping

| Agent                     | Script          | Command                                                                        |
| ------------------------- | --------------- | ------------------------------------------------------------------------------ |
| **frontend-specialist**   | UX Audit        | `python .agent/skills/frontend-design/scripts/ux_audit.py .`                   |
| **frontend-specialist**   | A11y Check      | `python .agent/skills/frontend-design/scripts/accessibility_checker.py .`      |
| **backend-specialist**    | API Validator   | `python .agent/skills/api-patterns/scripts/api_validator.py .`                 |
| **mobile-developer**      | Mobile Audit    | `python .agent/skills/mobile-design/scripts/mobile_audit.py .`                 |
| **database-architect**    | Schema Validate | `python .agent/skills/database-design/scripts/schema_validator.py .`           |
| **security-auditor**      | Security Scan   | `python .agent/skills/vulnerability-scanner/scripts/security_scan.py .`        |
| **seo-specialist**        | SEO Check       | `python .agent/skills/seo-fundamentals/scripts/seo_checker.py .`               |
| **seo-specialist**        | GEO Check       | `python .agent/skills/geo-fundamentals/scripts/geo_checker.py .`               |
| **performance-optimizer** | Lighthouse      | `python .agent/skills/performance-profiling/scripts/lighthouse_audit.py <url>` |
| **test-engineer**         | Test Runner     | `python .agent/skills/testing-patterns/scripts/test_runner.py .`               |
| **test-engineer**         | Playwright      | `python .agent/skills/webapp-testing/scripts/playwright_runner.py <url>`       |
| **Any agent**             | Lint Check      | `python .agent/skills/lint-and-validate/scripts/lint_runner.py .`              |
| **Any agent**             | Type Coverage   | `python .agent/skills/lint-and-validate/scripts/type_coverage.py .`            |
| **Any agent**             | i18n Check      | `python .agent/skills/i18n-localization/scripts/i18n_checker.py .`             |

---

## Script Output Handling

### Protocol: READ → SUMMARIZE → ASK

1. **Run** script, capture ALL output
2. **Parse** - identify errors, warnings, passes
3. **Summarize** to user:

```markdown
## Script Results: [script_name.py]

### ❌ Errors Found (X items)
- [File:Line] Error description

### ⚠️ Warnings (Y items)
- [File:Line] Warning description

### ✅ Passed (Z items)
- Check passed

**Should I fix the X errors?**
```

4. **Wait** for user confirmation
5. **Re-run** after fixing to confirm

---

## Rules

| ❌ VIOLATION | ✅ CORRECT |
|-------------|-----------|
| Running script, ignoring output | Read + summarize output |
| Auto-fixing without asking | Ask before fixing |
| Wrong agent running wrong script | Each agent runs own scripts |

---

⚡ PikaKit v3.9.67
