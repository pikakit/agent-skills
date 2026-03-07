---
name: verification-scripts
description: Agent-to-script mapping for running validation scripts — output protocol, rules
---

# Verification Scripts Reference

> Script mapping by agent role.

---

## Agent → Script Mapping

| Agent                     | Script          | Command                                                                     |
| ------------------------- | --------------- | --------------------------------------------------------------------------- |
| **frontend-specialist**   | UX Audit        | `node .agent/skills/design-system/scripts/ux_audit.js .`                    |
| **frontend-specialist**   | A11y Check      | `node .agent/skills/design-system/scripts/accessibility_checker.js .`       |
| **backend-specialist**    | API Validator   | `node .agent/skills/api-architect/scripts/api_validator.js .`               |
| **mobile-developer**      | Mobile Audit    | `node .agent/skills/mobile-design/scripts/mobile_audit.js .`               |
| **database-architect**    | Schema Validate | `node .agent/skills/data-modeler/scripts/schema_validator.js .`            |
| **security-auditor**      | Security Scan   | `node .agent/skills/security-scanner/scripts/security_scan.js .`           |
| **seo-specialist**        | SEO Check       | `node .agent/skills/seo-optimizer/scripts/seo_checker.js .`                |
| **seo-specialist**        | GEO Check       | `node .agent/skills/geo-spatial/scripts/geo_checker.js .`                  |
| **performance-optimizer** | Lighthouse      | `node .agent/skills/perf-optimizer/scripts/lighthouse_audit.js <url>`      |
| **test-engineer**         | Test Runner     | `node .agent/skills/test-architect/scripts/test_runner.js .`               |
| **test-engineer**         | Playwright      | `node .agent/skills/e2e-automation/scripts/playwright_runner.js <url>`     |
| **Any agent**             | Lint Check      | `node .agent/skills/code-review/scripts/lint_runner.js .`                  |
| **Any agent**             | Problem Check   | `node .agent/skills/problem-checker/scripts/check_problems.js .`           |

---

## Script Output Handling

### Protocol: READ → SUMMARIZE → ASK

1. **Run** script, capture ALL output
2. **Parse** — identify errors, warnings, passes
3. **Summarize** to user:

```markdown
## Script Results: [script_name.js]

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

⚡ PikaKit v3.9.98

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [engineering-spec.md](engineering-spec.md) | Full contracts and architecture |
| [SKILL.md](../SKILL.md) | Core principles and function rules |
