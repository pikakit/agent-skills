# 📋 Plan: Silence PikaKit Extension Notifications & Deprecate Auto-Learned Skill

### Overview

| Aspect | Value |
|--------|-------|
| Goal | Triệt tiêu hoàn toàn thông báo popup phiền phức của extension và gỡ bỏ skill auto-learned, gom telemetry về Knowledge Wiki |
| Timeline | 1 ngày |
| Complexity | Low-Medium |
| Target Package | `packages/pikakit-extension` |

### Architecture & Strategy

```mermaid
graph TD
    A[IDE Diagnostics / Terminal Error] --> B[Extension Listeners]
    B -- Silent Logging --> C[SignalBridge]
    C --> D[.agent/knowledge/raw-signals/SIG-XXX.md]
    
    subgraph "REMOVED (Deprecated)"
        E[vscode.window.showInformationMessage]
        F[auto-learned Skill Generation]
        G[GEMINI.md Injection]
    end
    
    B -.x E
    B -.x F
    F -.x G
    
    D --> H["AI Knowledge Compiler (/knowledge)"]
    H --> I[.agent/knowledge/patterns/]
    H --> J[.agent/knowledge/concepts/]
```

### Task Breakdown

- [ ] Epic 1: Gỡ bỏ toàn bộ Popup Toast phiền phức
  - [ ] Task 1.1: Tắt `showInformationMessage` trong `diagnosticListener.ts` (`scheduleBatchNotification`, `scheduleBatchPrompt`).
  - [ ] Task 1.2: Tắt `showInformationMessage` trong `terminalListener.ts` (`scheduleBatchNotification`).
- [ ] Epic 2: Loại bỏ cơ chế Skill `auto-learned` & chèn `GEMINI.md`
  - [ ] Task 2.1: Gỡ các lời gọi `appendToAutoLearned()` trong `diagnosticListener.ts` và `terminalListener.ts`.
  - [ ] Task 2.2: Vô hiệu hóa logic ghi skill `auto-learned` và inject block `<!-- PIKAKIT ACTIVE PATTERNS -->` trong `skillGenerator.ts`.
  - [ ] Task 2.3: Tắt cơ chế tự động prompt sinh skill (`tryGenerateSkill`).
- [ ] Epic 3: Hoàn thiện Silent Telemetry qua SignalBridge
  - [ ] Task 3.1: Kết nối `SignalBridge` cho `terminalListener.ts` để lỗi terminal đã học cũng được ghi vào `raw-signals/`.
  - [ ] Task 3.2: Giữ `statusBar.updateCount()` để hiển thị số lượng âm thầm trên Status Bar (không che khuất màn hình).
- [ ] Epic 4: Build & Packaging
  - [ ] Task 4.1: Chạy `npm run compile` trong `packages/pikakit-extension` kiểm tra TypeScript clean.
  - [ ] Task 4.2: Đóng gói lại file `.vsix` mới (`pikakit.vsix`).

### Next Steps

- [ ] Phê duyệt kế hoạch (`implementation_plan.md`)
- [ ] Chạy `/build` để tiến hành thực thi
