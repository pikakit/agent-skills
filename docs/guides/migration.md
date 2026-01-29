# Migration Guide

> Python → JavaScript migration for Agent Skill Kit

---

## ✅ Status: Fully Migrated (v3.2.0)

**All master scripts and Studio scripts migrated to JavaScript.** Zero Python dependency required.

---

## 📦 Current Scripts

| Script               | npm Command              |
| -------------------- | ------------------------ |
| `checklist.js`       | `npm run checklist`      |
| `verify_all.js`      | `npm run verify <URL>`   |
| `auto_preview.js`    | `npm run preview:start`  |
| `session_manager.js` | `npm run session:status` |
| `rebrand/index.mjs`  | `npm run rebrand`        |

**Location:** `.agent/scripts-js/*.js`

---

## 🎨 Studio Scripts

| Component               | JavaScript         | LOC |
| ----------------------- | ------------------ | --- |
| Core Search Engine      | `core.js`          | 320 |
| Design System Generator | `design_system.js` | 700 |
| CLI Entry Point         | `search.js`        | 180 |

### Usage

```bash
# Design system generation
node .agent/skills/studio/scripts-js/search.js "SaaS dashboard" --design-system -p "MyProject"

# npm scripts (recommended)
npm run studio:design "SaaS dashboard" -- -p "MyProject"
npm run studio:search "glassmorphism" -- --domain style
```

---

## 🚀 Benefits

- ✅ **Zero Python dependency** - Node.js only
- ✅ **Better Windows support** - No PATH issues
- ✅ **Unified stack** - 100% JavaScript
- ✅ **~10% faster** - Native async I/O

---

## 🐍 Python Skill Scripts (Kept)

**34 Python scripts** remain for specialized validation (security scanning, E2E testing, etc.).

See [python-strategy.md](../reference/python-strategy.md) for details.

---

## 🧪 Testing

```bash
npm run test:studio  # 143 tests
npm run test         # CLI integration
```
