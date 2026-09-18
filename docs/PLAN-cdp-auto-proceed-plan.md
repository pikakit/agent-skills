# PLAN: CDP 2-Stage Auto-Open & Auto-Proceed Implementation Plan

## Overview

| Aspect | Value |
|--------|-------|
| Goal | Tự động mở tab Implementation Plan từ khung chat (nếu chưa mở) và tự động nhấn nút "Proceed" khi CDP: ON |
| Repository | `add-agent-skill-kit` (`packages/pikakit-extension`) |
| Target Files | `packages/pikakit-extension/package.json`, `packages/pikakit-extension/src/cdpHandler.ts` |
| Risk Level | Medium (Cần kiểm soát chặt chẽ phạm vi DOM để không click nhầm vào Editor hoặc thẻ cũ trong lịch sử) |
| Architecture Pattern | 2-Stage State Machine (Open-Then-Proceed Pipeline) + Grace Period (1500ms) + Zero Focus Theft |

---

## 1. Problem Framing & Root Cause Analysis

### Vấn đề thực tế
1. Khi AI hoàn tất lập kế hoạch (`/plan`), thẻ `Implementation Plan` xuất hiện trong khung chat của Antigravity IDE (`.artifact-card`).
2. Nếu người dùng đang mở một file code khác (hoặc tab Implementation Plan chưa được mở ở Editor bên cạnh), nút màu xanh **`Proceed`** chưa hề tồn tại trong DOM.
3. Cơ chế CDP cũ chỉ tìm kiếm trong Chat Panel, hoàn toàn không hỗ trợ quy trình tuần tự:
   - **Bước 1:** Nhấn vào thẻ `Implementation Plan` trong chat để kích hoạt mở tab sang khung Editor.
   - **Bước 2:** Đợi tab hiển thị và tự động bấm nút `Proceed` ở góc trên bên phải của tab vừa mở.

---

## 2. Technical Architecture: 2-Stage State Machine

```text
Chu kỳ Polling (350ms):
┌─────────────────────────────────────────────────────────────┐
│ Giai đoạn 1: Nút "Proceed" ở tab Editor đã hiển thị chưa?    │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
           CÓ                                    CHƯA
            │                                     │
   Kiểm tra Grace Period (1.5s):                  ▼
   • Nếu mới thấy: ghi nhận mốc thời gian  ┌─────────────────────────────────────────────────────────┐
   • Nếu >= 1500ms:                       │ Giai đoạn 2: Quét tin nhắn Chat tìm thẻ Plan:           │
     safeClick(proceedBtn)                │   • Tìm thẻ .artifact-card ("Implementation Plan")      │
     stats.planApprovals++                │   • Guard: Đã có "Proceeded with Implementation Plan"?  │
     Ghi log CDP                          └────────────────────────────┬────────────────────────────┘
                                                                       │
                                                    ┌──────────────────┴──────────────────┐
                                                   CÓ THẺ MỚI                            KHÔNG
                                                    │                                     │
                                           safeClick(artifactCard)                    Bỏ qua,
                                           (Mở tab Plan bên cạnh)                 tiếp tục vòng lặp
```

### Chi tiết các Guard an toàn
1. **History Guard (Chống click lặp thẻ cũ):**
   Kiểm tra vùng cha của thẻ `.artifact-card`. Nếu đã chứa chuỗi text `proceeded with implementation plan` (hoặc `proceeded with`), thẻ này đã được duyệt trong quá khứ $\rightarrow$ bỏ qua.
2. **Debounce Guard (Chống spam click):**
   Mỗi thẻ chat chỉ được click mở tối đa 1 lần trong 5 giây (`cardDebounce = 5000ms`).
3. **Editor Buffer Isolation:**
   Tuyệt đối loại trừ các vùng soạn thảo code trong Monaco Editor (`.monaco-editor .view-lines`, `textarea`, `input`). Nút `Proceed` chỉ được nhận diện trong vùng tiêu đề / thanh công cụ của Artifact View.
4. **Zero Focus Theft:**
   Giữ nguyên cơ chế `userGesture: false` và khôi phục `activeElement.focus({ preventScroll: true })` ngay sau khi click, không giật con trỏ chuột của người dùng.

---

## 3. Cấu hình Extension Settings (`package.json`)

```json
{
  "pikakit.autoProceedPlan": {
    "type": "boolean",
    "default": true,
    "description": "Tự động mở và phê duyệt Implementation Plan khi CDP đang BẬT"
  },
  "pikakit.planProceedDelay": {
    "type": "number",
    "default": 1500,
    "description": "Thời gian chờ (ms) trước khi tự động bấm Proceed để người dùng quan sát"
  }
}
```

---

## 4. Task Breakdown

### Phase 1: Cấu hình Settings trong `package.json`
- [ ] Thêm `pikakit.autoProceedPlan` (default: `true`)
- [ ] Thêm `pikakit.planProceedDelay` (default: `1500`)

### Phase 2: Nâng cấp `src/cdpHandler.ts`
- [ ] Đọc cấu hình từ VS Code workspace và truyền động vào script inject qua CDP.
- [ ] Lắng nghe `vscode.workspace.onDidChangeConfiguration` để cập nhật runtime mà không cần restart IDE.
- [ ] Hiện thực hàm `handleArtifactPlanProceed()`:
  - **Stage 1 (Proceed Button):** Quét button `Proceed` ở Editor view $\rightarrow$ kiểm tra Grace Period $\rightarrow$ click.
  - **Stage 2 (Chat Card Opener):** Nếu không thấy nút `Proceed` $\rightarrow$ quét tin nhắn chat mới nhất $\rightarrow$ tìm `.artifact-card` có tiêu đề `Implementation Plan` $\rightarrow$ kiểm tra không có text `proceeded with` $\rightarrow$ click mở tab.
- [ ] Tích hợp `handleArtifactPlanProceed()` vào hàm `poll()`.

### Phase 3: Build & Verification
- [ ] Compile TypeScript trong `packages/pikakit-extension`.
- [ ] Đóng gói gói mở rộng `pikakit.vsix`.
- [ ] Chạy kiểm thử tự động Vitest trong `add-agent-skill-kit`.
- [ ] Build toàn bộ CLI `pikakit`.
- [ ] Dọn dẹp các script scratch tạm thời.
