# 📋 Plan: Update PikaKit Extension Description & Architecture Docs

### Overview

| Aspect | Value |
|--------|-------|
| Goal | Cập nhật mô tả package.json và README.md phản ánh kiến trúc Zero-Distraction & Knowledge Bridge |
| Target Package | `packages/pikakit-extension` |
| Files to modify | `package.json`, `README.md` |

### Architecture Updates

```markdown
Old Messaging:
- "Auto-compiles IDE diagnostics into persistent AI skills"
- "generates .agent/skills/ templates natively"

New Messaging:
- "Zero-distraction execution engine for AI agents"
- "Silently pipes IDE diagnostics into local Knowledge Wiki (.agent/knowledge)"
- "Decoupled skill synthesis via AI Knowledge Compiler"
```

### Task Breakdown

- [ ] Task 1: Cập nhật `packages/pikakit-extension/package.json` field `description`
- [ ] Task 2: Cập nhật `packages/pikakit-extension/README.md` (tagline, intro, section 3)
- [ ] Task 3: Build & package `pikakit.vsix`
- [ ] Task 4: Cài đặt bản VSIX mới vào IDE (`code --install-extension`)

### Next Steps

- [ ] Phê duyệt kế hoạch (`implementation_plan.md`)
- [ ] Tiến hành áp dụng thay đổi
