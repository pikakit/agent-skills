# 📋 Plan: Remove Autopilot Button & Preserve CDP Integration

### Overview

| Aspect | Value |
|--------|-------|
| Goal | Xóa bỏ hoàn toàn nút và module Autopilot, bảo tồn nguyên vẹn 100% tính năng CDP |
| Target Package | `packages/pikakit-extension` |
| Files to modify | `autoAccept.ts`, `extension.ts`, `package.json`, `README.md` |

### Key Actions

```markdown
1. REMOVE Autopilot:
   - Delete autopilotStatusBar (removes 🚀 Autopilot from status bar)
   - Delete autopilotInterval (stops 500ms blind command loop)
   - Delete pikakit.toggleAutopilot command & keybinding (ctrl+shift+enter)
   - Delete pikakit.autopilotEnabled setting

2. PRESERVE CDP:
   - Keep initCDP(), toggleCDP(), showCDPSetup(), updateCDPUI()
   - Keep cdpStatusBar (🔌 CDP: ON stays on status bar)
   - Keep CDPHandler & auto-clicking "Allow file access?" permission dialogs

3. REBUILD & INSTALL:
   - npm run compile
   - node vsce package
   - code --install-extension pikakit.vsix --force
```

### Next Steps

- [ ] Phê duyệt kế hoạch (`implementation_plan.md`)
- [ ] Tiến hành thực thi
