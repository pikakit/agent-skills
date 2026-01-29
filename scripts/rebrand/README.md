# Smart Rebrand CLI

> Production-grade brand renaming tool for Agent Skill Kit

Automatically rename your brand across the entire codebase with safety, speed, and precision.

---

## 🚀 Quick Start

```bash
# Navigate to project root
cd agent-skill-kit

# Run rebrand (interactive)
node scripts/rebrand/v4.mjs

# Follow prompts:
# 1. Enter new brand name
# 2. Choose Dry Run (safe preview) or Live Mode
# 3. Confirm and execute
```

---

## 📊 Versions

| Version  | Performance | Safety                | Intelligence                   |
| -------- | ----------- | --------------------- | ------------------------------ |
| **v4.0** | 5x faster   | Git backup + rollback | Auto-discover, word boundaries |
| v3.3.0   | Sequential  | None                  | Hardcoded paths                |

**Recommendation:** Use `v4.mjs` for new rebrands.

---

## ✨ Features

### v4.0 (Latest)

#### 🚄 Performance

- **5x faster** with parallel batch processing (50 files/batch)
- **Stream processing** for large files (>1MB)
- Real-time progress with percentage

#### 🛡️ Safety

- **Git-based backup** (creates backup branch before changes)
- **File-based fallback** (if no git)
- **100% rollback** capability
- **Temp files** with atomic rename

#### 🧠 Intelligence

- **Auto-discover** package.json files (any monorepo structure)
- **Word boundary** matching (no false positives)
- **8 naming variants** (kebab, snake, camel, pascal, etc.)
- **File-type aware** (JSON, YAML, Markdown)

#### 🎨 UX

- Beautiful Clack UI
- Grouped preview by directory
- Color-coded output
- Clear next steps

---

## 📖 Usage

### Basic Rebrand

```bash
node scripts/rebrand/v4.mjs
```

**Interactive Prompts:**

1. **New brand name:** Enter your new brand (e.g., "Super Agent Kit")
2. **Run mode:** Choose Dry Run or Live Mode
3. **Confirm:** Review and approve

### Dry Run (Recommended First)

```bash
node scripts/rebrand/v4.mjs
# → Select "🔍 Dry Run (preview only)"
# → Review preview
# → No files are modified
```

### Live Mode

```bash
# Commit current state first
git add -A && git commit -m "Pre-rebrand checkpoint"

# Run rebrand
node scripts/rebrand/v4.mjs
# → Select "⚡ Live Mode (apply changes)"
# → Confirm
# → Files are modified
```

---

## 🎯 What Gets Changed

### Files Scanned

✅ All code files: `.js`, `.mjs`, `.ts`, `.tsx`, `.jsx`  
✅ Config files: `.json`, `.yaml`, `.yml`  
✅ Documentation: `.md`  
✅ Agent files: `.agent/**/*.{md,yaml,yml}`

### Patterns Ignored

❌ `node_modules/`  
❌ `.git/`, `dist/`, `build/`  
❌ Lock files: `package-lock.json`, `yarn.lock`  
❌ Test files: `*.test.js`, `*.spec.js`  
❌ Knowledge data: `.agent/knowledge/**`

### Naming Variants Applied

| Original          | Variants                       |
| ----------------- | ------------------------------ |
| "Agent Skill Kit" | original, lowercase, UPPERCASE |
|                   | agent-skill-kit (kebab)        |
|                   | agent_skill_kit (snake)        |
|                   | agentSkillKit (camel)          |
|                   | AgentSkillKit (pascal)         |
|                   | AGENT_SKILL_KIT (constant)     |

---

## 🔍 Examples

### Example 1: Simple Rebrand

```bash
Current brand: "Agent Skill Kit"
New brand: "Super Agent Kit"

Files affected: 42
- packages/cli/lib/stats.js (3 matches)
- packages/cli/lib/learn.js (2 matches)
- scripts/rebrand/index.mjs (8 matches)
... and 39 more

Time: ~2 seconds
```

### Example 2: With Special Characters

```bash
Current: "Agent-Skill Kit"
New: "Super Agent"

Variants:
  original: Agent-Skill Kit → Super Agent
  kebab-case: agent-skill-kit → super-agent
  snake_case: agent_skill_kit → super_agent
```

### Example 3: Monorepo

```bash
Auto-discovered package.json:
  ✓ package.json
  ✓ packages/cli/package.json
  ✓ packages/utils/package.json

All will be updated automatically.
```

---

## 🛡️ Safety Features

### Before Rebrand

1. **Git Status Check**

   ```
   ⚠ Git working directory has uncommitted changes.
   Continue anyway? No / Yes
   ```

2. **Auto-detect Current Brand**

   ```
   🏷️ Current Brand
   Current: Agent Skill Kit
   Auto-detected from package.json
   ```

3. **Validation**
   - Min 3 characters
   - Different from current
   - No conflicts

### During Rebrand

1. **Backup Created**

   ```
   Creating backup...
   ✓ Backup created (git branch: rebrand-backup-1738148400000)
   ```

2. **Progress Tracking**

   ```
   Scanning... 450/1000 (45%)
   Processing... 38/42 (90%)
   ```

3. **Temp Files**
   - Write to `.rebrand-tmp` first
   - Atomic rename on success
   - Cleanup on failure

### After Rebrand

1. **Stats Report**

   ```
   📊 Stats
   Modified: 42
   Skipped: 8
   Errors: 0
   ```

2. **Next Steps**
   ```
   1. Review: git diff
   2. Test: npm test
   3. Commit: git add . && git commit -m "rebrand: Agent Skill Kit → Super Agent Kit"
   4. Rollback if needed: git checkout rebrand-backup-<timestamp>
   ```

---

## 🔧 Rollback

### If Rebrand Failed

```bash
# Git-based rollback
git checkout rebrand-backup-<timestamp>
git checkout -
git branch -D rebrand-backup-<timestamp>
```

### If You Changed Your Mind

```bash
# Before commit
git reset --hard HEAD

# After commit (within same session)
git reset --hard HEAD~1
```

---

## ⚠️ Troubleshooting

### Issue: "Git working directory has uncommitted changes"

**Solution:** Commit or stash your changes first

```bash
git add -A && git commit -m "WIP"
# OR
git stash
```

### Issue: "Brand name too short"

**Solution:** Use at least 3 characters

```bash
# ❌ "AB" → Error
# ✅ "ABC" → OK
```

### Issue: "No files found"

**Solution:** Check you're in the right directory

```bash
pwd  # Should be agent-skill-kit root
ls package.json  # Should exist
```

### Issue: Script hangs on large files

**Solution:** v4.0 uses streaming, should not hang. If it does:

```bash
# Check file size
ls -lh <file>

# If > 10MB, consider excluding
# Add to .gitignore or rebrand ignore list
```

---

## 📚 FAQ

**Q: Safe to run multiple times?**  
A: Yes, but commit between runs. Each run creates a new backup.

**Q: Can I rebrand from "Brand A" to "Brand B", then "Brand B" to "Brand C"?**  
A: Yes, just run twice. Commit after first rebrand.

**Q: What if I have custom package.json locations?**  
A: v4.0 auto-discovers all `**/package.json` files (excluding node_modules).

**Q: Does it handle partial matches?**  
A: No! v4.0 uses word boundaries. "Agent Skill Kit" matches, but "Agent Skills" doesn't.

**Q: Can I rebrand just one directory?**  
A: Not currently. Script scans entire project. Use git to revert unwanted changes.

**Q: Performance with 10,000+ files?**  
A: ~30-40 seconds with v4.0 (batch-50 parallel processing).

---

## 🎓 Best Practices

### 1. **Always Dry Run First**

```bash
node scripts/rebrand/v4.mjs
Select: Dry Run
Review: Check preview carefully
```

### 2. **Commit Before Live Mode**

```bash
git add -A
git commit -m "Pre-rebrand checkpoint"
```

### 3. **Test After Rebrand**

```bash
npm test
npm run build  # If applicable
```

### 4. **Review Changes**

```bash
git diff --stat  # Summary
git diff         # Detailed
```

### 5. **Incremental Commits**

```bash
# Don't rebrand + add features in same commit
git add scripts/rebrand/
git commit -m "rebrand: Agent Skill Kit → Super Agent Kit"

# Then do other changes
```

---

## 🔄 Migration from v3.3.0 to v4.0

### Option 1: Replace (Recommended)

```bash
# Backup v3.3.0
mv scripts/rebrand/index.mjs scripts/rebrand/v3.3.0-backup.mjs

# Use v4.0
mv scripts/rebrand/v4.mjs scripts/rebrand/index.mjs

# Update package.json (if needed)
"rebrand": "node scripts/rebrand/index.mjs"
```

### Option 2: Keep Both

```bash
# Add v4 command to package.json
"rebrand": "node scripts/rebrand/v4.mjs",
"rebrand:v3": "node scripts/rebrand/index.mjs"
```

---

## 📝 Files Modified by Script

### Root Files

- `package.json` (description, author)
- `README.md`, `CHANGELOG.md`, etc.

### Agent Files

- `.agent/agents/*.md`
- `.agent/skills/*/SKILL.md`
- `.agent/workflows/*.md`

### Code Files

- `packages/cli/**/*.js`
- `scripts/**/*.mjs`
- Any custom code

### Excluded (Never Modified)

- `node_modules/`
- `.git/`
- Lock files
- Test files
- Knowledge data (`.agent/knowledge/*`)

---

## 🎯 Script Comparison

| Feature             | v3.3.0          | v4.0            |
| ------------------- | --------------- | --------------- |
| Speed (1000 files)  | ~15s            | ~3s             |
| Large file handling | Crash           | Stream          |
| Backup              | None            | Git + File      |
| Package discovery   | 2 hardcoded     | Auto-discover   |
| Precision           | Partial matches | Word boundaries |
| Progress            | Basic           | Detailed %      |
| Preview             | 5 files         | Grouped by dir  |
| Rollback            | Manual          | 1 command       |

---

## 📞 Support

**Issues?** Check:

1. This README
2. Troubleshooting section
3. Run dry-run first
4. Check git status

**Still stuck?** Create an issue with:

- Error message
- Command used
- Expected vs actual behavior

---

## 📄 License

Part of Agent Skill Kit - See [LICENSE](../../LICENSE)

---

**Version:** 4.0.0  
**Last Updated:** 2026-01-29  
**Maintained by:** Agent Skill Kit Team
