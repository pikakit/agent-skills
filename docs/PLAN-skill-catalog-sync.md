## 📋 Plan: Đồng Bộ Hóa & Chuẩn Hóa Danh Mục 52 Skills (PikaKit)

### Overview

| Aspect | Value |
|--------|-------|
| Goal | Dọn dẹp skill ma, đồng bộ hóa 100% giữa filesystem, `registry.json` và `SKILL_INDEX.md`, mở rộng hướng dẫn cho `knowledge-compiler` |
| Scope | `agent-skill-kit/.agent/skills/` |
| Complexity | Low |
| Agents Assigned | `project-planner`, `knowledge-compiler`, `problem-checker` |

---

### Stack Decision

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Data Integrity | 1:1 Bi-directional Mapping | Đảm bảo mọi thư mục kỹ năng trong `.agent/skills/` đều có mặt trong `registry.json` và bảng `SKILL_INDEX.md` |
| Quality Control | `skill-audit.ts` + Node Verification Script | Tự động hóa kiểm tra tính nhất quán 3 chiều (Filesystem - Registry - Markdown) |

---

### Task Breakdown

- [ ] **Task 1: Dọn dẹp & Bổ sung SKILL_INDEX.md**
  - [ ] Cập nhật tổng số kỹ năng thành 52 (header + footer).
  - [ ] Thêm `skill-generator` vào bảng `## Meta & Orchestration`.
  - [ ] Xóa bỏ dòng tham chiếu dở dang `runtime-memory-manager` ở dòng 130.

- [ ] **Task 2: Dọn dẹp registry.json**
  - [ ] Gỡ bỏ entry `runtime-memory-manager` (giảm từ 53 xuống đúng 52 entries).

- [ ] **Task 3: Nâng cấp nội dung knowledge-compiler/AGENTS.md**
  - [ ] Mở rộng hướng dẫn chi tiết về 4-phase pipeline (Ingest, Compile, Index, Lint).
  - [ ] Bổ sung bảng 12 quy tắc Secret Prefilter gate.
  - [ ] Bổ sung tiêu chuẩn chuyển giao sang `skill-generator`.

- [ ] **Task 4: Xác thực đối chiếu tự động**
  - [ ] Chạy `scratch/check_skills.mjs` xác nhận 52/52 khớp 100%.
  - [ ] Chạy `skill-audit.ts` xác nhận 52/52 pass.
  - [ ] Chạy `npm run checklist` xác nhận hệ thống xanh.

---

### Next Steps

- [ ] Phê duyệt kế hoạch
- [ ] Tiến hành thực thi
