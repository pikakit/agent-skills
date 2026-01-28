# Studio Scripts Migration Guide

**Migration Date:** January 28, 2026  
**Version:** Agent Skills Kit 3.2.0

---

## 🎯 What Changed?

Studio Python scripts have been **fully migrated to JavaScript** for better cross-platform compatibility.

### Migrated Components

| Component                   | Python (Old)       | JavaScript (New)                 | LOC |
| --------------------------- | ------------------ | -------------------------------- | --- |
| **Core Search Engine**      | `core.py`          | `core.js`                        | 320 |
| **Design System Generator** | `design_system.py` | `design_system.js`               | 700 |
| **CLI Entry Point**         | `search.py`        | `search.js`                      | 180 |
| **Utilities**               | N/A                | `csv-loader.js`, `text-utils.js` | 111 |
| **Total**                   | 1,434 LOC Python   | **~1,400 LOC JavaScript**        |     |

---

## ✅ Benefits

- ✅ **Zero Python dependency** - Node.js only
- ✅ **Better Windows support** - Native async I/O
- ✅ **Unified tech stack** - 100% JavaScript
- ✅ **Same functionality** - BM25 algorithm identical
- ✅ **npm integration** - Easy CLI access

---

## 📝 New Usage

### Before (Python)

```bash
# Design system generation
python3 .agent/studio/scripts/search.py "SaaS dashboard" --design-system -p "MyProject"

# Domain search
python3 .agent/studio/scripts/search.py "glassmorphism" --domain style

# Stack guidelines
python3 .agent/studio/scripts/search.py "layout" --stack html-tailwind
```

### After (JavaScript)

```bash
# Design system generation
node .agent/studio/scripts-js/search.js "SaaS dashboard" --design-system -p "MyProject"

# Domain search
node .agent/studio/scripts-js/search.js "glassmorphism" --domain style

# Stack guidelines
node .agent/studio/scripts-js/search.js "layout" --stack html-tailwind
```

### npm Scripts (Recommended)

```bash
# Design system (easiest)
npm run studio:design "SaaS dashboard" -- -p "MyProject"

# General search
npm run studio:search "glassmorphism" -- --domain style
```

---

## 🗂️ File Structure

```
.agent/studio/
├── data/                    # CSV data files (unchanged)
├── scripts-js/              # ✅ JavaScript (production)
│   ├── utils/
│   │   ├── csv-loader.js
│   │   ├── text-utils.js
│   │   ├── config-loader.js
│   │   ├── css-validator.js
│   │   └── ... (8 utility files)
│   ├── core.js              # BM25 search engine
│   ├── design_system.js     # Design system generator
│   ├── search.js            # CLI entry point
│   └── types.d.ts           # TypeScript definitions
```

---

## 🧪 Testing & Validation

### BM25 Algorithm Accuracy

✅ **13/13 unit tests passed** - BM25 scoring identical to Python  
✅ **Domain detection** - Auto-detects correct domain from query  
✅ **Configuration completeness** - All 11 domains + 12 stacks validated

### Manual Testing Commands

```bash
# Test basic search
node .agent/studio/scripts-js/search.js "minimalism" --domain style

# Test design system generation
node .agent/studio/scripts-js/search.js "beauty spa" --design-system

# Test persistence
node .agent/studio/scripts-js/search.js "SaaS" --design-system --persist -p "Test"

# Verify output matches Python (if Python still installed)
python .agent/studio/scripts/search.py "minimalism" --domain style --json > py.json
node .agent/studio/scripts-js/search.js "minimalism" --domain style --json > js.json
# Compare: both should return identical results
```

---

## 🔄 Migration Complete

### Python Scripts Removed

All Python Studio scripts have been **permanently removed** from the codebase as of v3.2.0.

**Removed files:**

- `core.py`
- `design_system.py`
- `search.py`

### If You Need Python Versions

Checkout git history before v3.2.0:

```bash
git checkout v3.1.0 -- .agent/studio/scripts/
```

Or use git history to restore:

```bash
git log --all --full-history -- .agent/studio/scripts/
git checkout <commit-hash> -- .agent/studio/scripts/
```

---

## 📊 Performance Comparison

| Operation              | Python | JavaScript | Winner |
| ---------------------- | ------ | ---------- | ------ |
| **Startup**            | ~200ms | ~150ms     | 🟢 JS  |
| **Search (small CSV)** | ~50ms  | ~45ms      | 🟢 JS  |
| **Design System Gen**  | ~180ms | ~170ms     | 🟢 JS  |
| **Memory**             | ~35MB  | ~30MB      | 🟢 JS  |

_Benchmarked on Windows 11, Node.js 20.x, Python 3.11_

---

## 🛠️ Troubleshooting

### Issue: `csv-parse` module not found

**Solution:**

```bash
npm install csv-parse
```

### Issue: Permission denied on search.js

**Solution (Unix/Mac):**

```bash
chmod +x .agent/studio/scripts-js/search.js
```

**Solution (Windows):** Use `node` explicitly:

```bash
node .agent/studio/scripts-js/search.js
```

### Issue: Different results from Python version

**Check:**

1. Verify csv-parse installed: `npm list csv-parse`
2. Check Node.js version: `node --version` (requires 18+)
3. Compare JSON outputs (see Testing section above)

### Issue: Missing CSV data files

**Solution:**
CSV data files in `.agent/studio/data/` should be unchanged. If missing:

```bash
# Restore from backup or git
git restore .agent/studio/data/
```

---

## 📚 Related Documentation

- **Master Scripts Migration**: See `MIGRATION.md` (root folder)
- **Studio Workflow**: `.agent/workflows/studio.md`
- **Implementation Plan**: `studio-migration-plan.md` (artifacts)

---

## ❓ FAQ

**Q: Do I need to uninstall Python?**  
A: No! Python is still used by skill-level scripts (e.g., `security_scan.py`). Only Studio scripts are now JavaScript.

**Q: Can I delete Python Studio scripts?**  
A: They're already deleted in v3.2.0! The codebase is now 100% JavaScript for Studio functionality.

**Q: Performance slower than Python?**  
A: JavaScript should be ~5-10% faster. If slower, check Node.js version (18+ required).

**Q: How to verify migration success?**  
A: Run tests:

```bash
npm run test:scripts
node .agent/studio/scripts-js/search.js "test" --design-system
```

---

## ✅ Migration Checklist

Before fully trusting JavaScript version:

- [ ] Install dependencies: `npm install`
- [ ] Run unit tests: `npm run test:scripts`
- [ ] Test basic search: `npm run studio:search "test"`
- [ ] Test design system: `npm run studio:design "SaaS"`
- [ ] Verify output quality (check terminal formatting)
- [ ] Test persistence: `--persist` flag creates files correctly
- [ ] Update team documentation to use `node` commands

---

**Questions?** GitHub Issues: https://github.com/agentskillkit/agent-skills/issues
