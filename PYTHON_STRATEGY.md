# Python Scripts Strategy v3.2.0

**Last Updated:** 2026-01-28  
**Status:** ESTABLISHED  
**Decision:** KEEP Python for Tier-2 Skill Scripts

---

## 🎯 Executive Summary

Agent Skills Kit uses a **hybrid 2-tier architecture**:

- **Tier 1 (JavaScript):** Master orchestration scripts
- **Tier 2 (Python):** Specialized validation tools

**Decision:** Python scripts remain in place for skill-level validation due to specialized dependencies, stability, and clean architectural separation.

---

## 📊 Current State

### Scripts Inventory

| Category           | Count | Languages  |
| ------------------ | ----- | ---------- |
| **Master Scripts** | 4     | JavaScript |
| **Skill Scripts**  | 34    | Python     |
| **Total**          | 38    | Hybrid     |

### Python Scripts Distribution

| Skill                | Scripts | Primary Purpose         |
| -------------------- | ------- | ----------------------- |
| **SelfEvolution**    | 15      | Auto-learning system    |
| **SecurityScanner**  | 1       | OWASP security audit    |
| **DesignSystem**     | 2       | UX/A11y validation      |
| **PerfOptimizer**    | 1       | Lighthouse performance  |
| **E2EAutomation**    | 1       | Playwright E2E testing  |
| **APIArchitect**     | 1       | API contract validation |
| **DataModeler**      | 1       | DB schema validation    |
| **CodeQuality**      | 2       | Linting & type coverage |
| **SEOOptimizer**     | 1       | SEO validation          |
| **TestArchitect**    | 1       | Test suite runner       |
| **MobileFirst**      | 1       | Mobile UI audit         |
| **GeoSpatial**       | 1       | GenAI optimization      |
| **GlobalizationKit** | 1       | i18n validation         |
| **ContextOptimizer** | 2       | Context analysis        |
| **SkillForge**       | 3       | Skill creation tools    |

---

## 🏗️ Architecture

### 2-Tier Hybrid Design

```
┌────────────────────────────────────────┐
│ USER INTERFACE                         │
│  npm run verify <URL>                  │
│  npm run checklist                     │
└──────────────┬─────────────────────────┘
               │
               ↓
┌────────────────────────────────────────┐
│ TIER 1: Master Scripts (JavaScript)    │
│                                         │
│  ✅ checklist.js                        │
│     - Priority-based validation        │
│     - Orchestrates skill scripts       │
│                                         │
│  ✅ verify_all.js                       │
│     - Comprehensive pre-deploy checks  │
│     - Spawns child processes          │
│                                         │
│  ✅ auto_preview.js                     │
│     - Dev server management            │
│                                         │
│  ✅ session_manager.js                  │
│     - Project state tracking           │
└──────────────┬─────────────────────────┘
               │ child_process.spawn()
               ↓
┌────────────────────────────────────────┐
│ TIER 2: Skill Scripts (Python)         │
│                                         │
│  Security:                              │
│    python security_scan.py <path>      │
│                                         │
│  Performance:                           │
│    python lighthouse_audit.py <URL>    │
│                                         │
│  Testing:                               │
│    python playwright_runner.py <URL>   │
│                                         │
│  + 31 more specialized scripts         │
└────────────────────────────────────────┘
```

### User Interaction Flow

```bash
# User runs npm command (JavaScript)
$ npm run verify http://localhost:3000

# verify_all.js orchestrates Python scripts
→ node .agent/scripts-js/verify_all.js

  # Spawns Python child processes
  ├─> python .agent/skills/SecurityScanner/scripts/security_scan.py .
  ├─> python .agent/skills/DesignSystem/scripts/ux_audit.py .
  ├─> python .agent/skills/PerfOptimizer/scripts/lighthouse_audit.py http://localhost:3000
  └─> python .agent/skills/E2EAutomation/scripts/playwright_runner.py http://localhost:3000

  # Aggregates results
  └─> Returns unified report
```

---

## 💡 Rationale for Python

### Why NOT Migrate to JavaScript?

| Factor                       | Analysis                                                             | Weight     |
| ---------------------------- | -------------------------------------------------------------------- | ---------- |
| **Specialized Dependencies** | Tools like `bandit`, `safety`, `pa11y` have no direct JS equivalents | 🔴 BLOCKER |
| **Stability**                | Scripts are battle-tested, functional, and maintained                | 🟢 HIGH    |
| **Effort vs ROI**            | Migration = 4-6 weeks; user value = zero (hidden behind npm)         | 🔴 LOW ROI |
| **Team Expertise**           | Python ecosystem mature for security/testing tools                   | 🟢 HIGH    |
| **Zero User Impact**         | Users interact via npm, never see Python                             | 🟢 HIGH    |
| **Clean Architecture**       | 2-tier separation of concerns                                        | 🟢 HIGH    |

### Python Ecosystem Advantages

| Domain              | Python Strengths               | JS Alternatives?                      |
| ------------------- | ------------------------------ | ------------------------------------- |
| **Security**        | `bandit`, `safety`, `semgrep`  | ⚠️ Limited (`eslint-plugin-security`) |
| **Testing**         | `playwright` Python API mature | ✅ JS API available                   |
| **Performance**     | `lighthouse` CLI wrapper       | ✅ JS API available                   |
| **Static Analysis** | `mypy`, `pylint` deep analysis | ⚠️ Different paradigm                 |
| **Data Processing** | `pandas`, `numpy` for reports  | ⚠️ `danfojs` less mature              |

---

## 📋 When to Use Python vs JavaScript

### Use Python ✅

- Security scanning (`bandit`, `safety`)
- Deep static analysis
- Machine learning / data processing
- Specialized tooling not available in JS
- Prototyping / research scripts

### Use JavaScript ✅

- Master orchestration scripts
- User-facing CLI tools
- Web-based tooling
- npm ecosystem integration
- Simple file manipulation

---

## 🔄 Migration Decision Tree

```
Need new validation script?
│
├─ Requires specialized Python libs? → Python
│   (bandit, safety, semgrep)
│
├─ Simple file/text processing? → JavaScript
│   (grep, sed equivalent)
│
├─ Web API interaction? → JavaScript
│   (fetch, axios)
│
└─ Data analysis/ML? → Python
    (pandas, scikit-learn)
```

---

## 🛠️ Dependencies Management

### Python Requirements

**Minimum Version:** Python 3.8+

**Core Dependencies:**

```txt
# Security
bandit>=1.7.5
safety>=2.3.0

# Testing
playwright>=1.40.0
pytest>=7.4.0

# Performance
lighthouse (via npm, Python wrapper)

# Code Quality
pylint>=3.0.0
mypy>=1.7.0

# Data Processing
pyyaml>=6.0
```

### Installation

```bash
# Install Python dependencies
pip install -r .agent/skills/requirements.txt

# Or via npm script
npm run install:python-deps
```

---

## 🔮 Future Migration Path

### When to Consider Migration

Consider migrating to JavaScript if:

1. **Pure JS Requirement**
   - Browser-only environment needed
   - Serverless edge compute (no Python support)

2. **Dependency Blocker**
   - Python dependency becomes critical issue
   - Security vulnerability in Python runtime

3. **JS Ecosystem Maturity**
   - Mature JS equivalents available
   - Better performance/features in JS version

4. **Team Expertise**
   - Team lacks Python skills
   - Maintenance burden too high

### Migration Priority

```
Priority 1 (Easiest):
├─ lighthouse_audit.py    → Use @lhci/cli directly
├─ playwright_runner.py   → Use @playwright/test
└─ seo_checker.py         → Simple checks, easy to port

Priority 2 (Moderate):
├─ ux_audit.py            → Port validation logic
├─ api_validator.py       → Use ajv, openapi-validator
└─ schema_validator.py    → Use prisma tools

Priority 3 (Complex):
├─ security_scan.py       → Requires bandit/safety equivalent
├─ type_coverage.py       → Deep integration with mypy
└─ SelfEvolution scripts  → Complex ML/analysis logic
```

### Migration Checklist

- [ ] Identify JS equivalent libraries
- [ ] Prototype critical functionality
- [ ] Benchmark performance
- [ ] Migrate tests first
- [ ] Run both versions in parallel
- [ ] Verify output parity
- [ ] Update documentation
- [ ] Deprecate Python version

---

## ✅ Maintenance Guidelines

### Adding New Python Script

1. **Location:** `.agent/skills/[SkillName]/scripts/[script_name].py`
2. **Register:** Update `.agent/skills/registry.json`
3. **Document:** Add to skill's `SKILL.md`
4. **Test:** Add to CI/CD pipeline
5. **Requirements:** Update `requirements.txt` if needed

### Script Standards

```python
#!/usr/bin/env python3
"""
Brief description of script purpose.

Usage:
    python script_name.py <args>
"""

import argparse
import sys

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('project_path', help='Project directory')
    parser.add_argument('--output', choices=['json', 'summary'], default='summary')

    args = parser.parse_args()

    # Implementation

    sys.exit(0)  # or 1 for errors

if __name__ == '__main__':
    main()
```

### Testing

```bash
# Unit tests (pytest)
pytest .agent/skills/[SkillName]/tests/

# Integration tests (via npm)
npm run test:skills

# Manual smoke test
python .agent/skills/[SkillName]/scripts/[script].py . --help
```

---

## 📈 Metrics & Monitoring

### Success Criteria

- ✅ All Python scripts execute without errors
- ✅ Zero user complaints about Python dependency
- ✅ CI/CD pipeline runs smoothly
- ✅ Documentation clear and complete

### Health Checks

```bash
# Verify all scripts are executable
npm run verify:python-scripts

# Check Python version compatibility
python --version  # Should be 3.8+

# Test critical scripts
npm run test:security
npm run test:performance
```

---

## 📚 Related Documentation

- [MIGRATION.md](MIGRATION.md) - Python to JavaScript migration history
- [ARCHITECTURE.md](.agent/ARCHITECTURE.md) - System architecture overview
- [PYTHON_SCRIPTS.md](docs/PYTHON_SCRIPTS.md) - Python scripts reference
- [CHANGELOG.md](CHANGELOG.md) - Version history

---

## ❓ FAQ

### Q: Why not pure JavaScript?

**A:** Specialized security and testing tools in Python ecosystem have no equivalent in JavaScript. Migration would require 4-6 weeks with zero user value.

### Q: Do users need Python installed?

**A:** Yes, for full validation suite. However, most development workflows work without Python (linting, building, etc.).

### Q: What if Python dependency is a blocker?

**A:** We have a migration path documented. Priority scripts can be migrated individually based on need.

### Q: Are Python scripts tested in CI?

**A:** Yes, GitHub Actions supports Python. All scripts run in CI/CD pipeline.

### Q: Can I add JavaScript skill scripts?

**A:** Absolutely! See `ReviewAutomation`, `CodeConstitution`, `GitWorkflow` for examples.

---

**Decision Status:** ✅ APPROVED  
**Next Review:** Q2 2026  
**Owner:** Architecture Team
