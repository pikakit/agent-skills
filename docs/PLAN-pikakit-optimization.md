## 📋 Plan: PikaKit Dual-Repo Optimization & Standardization

### Overview

| Aspect | Value |
|--------|-------|
| Goal | Khắc phục 100% lỗi gãy lệnh, dọn dẹp ~400MB rác, chuẩn hóa CI/CD và đạt 100% FAANG compliance cho cả 2 repo |
| Scope | `add-agent-skill-kit` (CLI/Extension) & `agent-skill-kit` (AI OS/Skills) |
| Complexity | Medium |
| Agents Assigned | `nodejs-pro`, `test-architect`, `project-planner`, `problem-checker` |

---

### Stack Decision

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Linter | ESLint v9 Flat Config (`eslint.config.js`) | Chuẩn mới nhất từ ESLint, thay thế `.eslintrc.*` đã bị deprecate |
| Test Runner | Vitest | Framework test siêu nhanh, native ESM/TS, cấu hình nhẹ nhàng cho CLI |
| Prompting | `@clack/prompts` | Đồng bộ toàn bộ UI prompts về 1 engine hiện đại, gỡ bỏ `prompts` cũ |
| Dynamic Paths | `import.meta.dirname` / `process.cwd()` | Loại bỏ hoàn toàn mã cứng `C:/Users/sofma/...` để chạy được đa nền tảng |

---

### Task Breakdown

- [ ] **Epic 1: Tối ưu & Khôi phục CI/CD cho `add-agent-skill-kit`**
  - [ ] Task 1.1: Tạo `eslint.config.js` chuẩn flat-config cho ESLint 9.
  - [ ] Task 1.2: Tạo bộ test mẫu `src/__tests__/helpers.test.ts` cho Vitest.
  - [ ] Task 1.3: Dọn dẹp dependencies thừa (`@google/generative-ai`, `dotenv`, `ora`, `picocolors`, `css-tree`, `csv-parse`, `pikakit` self-dep).
  - [ ] Task 1.4: Refactor [uninstall.ts](file:///c:/Users/sofma/Desktop/add-agent-skill-kit/src/lib/commands/uninstall.ts) sang `@clack/prompts` và gỡ bỏ gói `prompts`.
  - [ ] Task 1.5: Dọn sạch `packages/pikakit-extension/node_modules` và chặn qua `.gitignore`.
  - [ ] Task 1.6: Cập nhật đường dẫn Antigravity sang `~/.gemini/config/skills`.

- [ ] **Epic 2: Chuẩn hóa Script & Đạt Chuẩn FAANG Compliance cho `agent-skill-kit`**
  - [ ] Task 2.1: Chuyển đổi mã cứng đường dẫn tuyệt đối trong [audit_workflows.ts](file:///c:/Users/sofma/Desktop/agent-skill-kit/.agent/scripts/audit_workflows.ts) và [sync_workflows.ts](file:///c:/Users/sofma/Desktop/agent-skill-kit/.agent/scripts/sync_workflows.ts).
  - [ ] Task 2.2: Tạo file script [fix_skills.ts](file:///c:/Users/sofma/Desktop/agent-skill-kit/.agent/scripts/fix_skills.ts) để sửa lỗi crash `npm run fix:skills`.
  - [ ] Task 2.3: Chuẩn hóa 16 file workflow trong `.agent/workflows/` bổ sung block Auto-Learned Pattern check để đạt 19/19 FAANG compliant.
  - [ ] Task 2.4: Bổ sung `triggers`, `coordinates_with` cho `skill-generator` và bổ sung file cấu trúc cho `knowledge-compiler`.
  - [ ] Task 2.5: Đưa `css-tree` và `csv-parse` vào [agent-skill-kit/package.json](file:///c:/Users/sofma/Desktop/agent-skill-kit/package.json).

- [ ] **Epic 3: Xác thực toàn diện (Verification & Health Check)**
  - [ ] Task 3.1: Chạy `npm run lint`, `npm test`, `npm run build` trên `add-agent-skill-kit`.
  - [ ] Task 3.2: Chạy `npm run audit:workflows`, `npx tsx .agent/scripts/skill-audit.ts` trên `agent-skill-kit`.
  - [ ] Task 3.3: Kiểm tra lệnh CLI `kit list` và `kit verify`.

---

### Agent Execution Plan

| Phase | Agent | Task | Trọng tâm |
|-------|-------|------|-----------|
| Phase 1 | `nodejs-pro` | Cấu hình ESLint 9, dọn dẹp package.json, refactor prompts | Khắc phục build & lint |
| Phase 2 | `test-architect` | Viết unit tests cho CLI helpers | Đưa test suite lên 100% pass |
| Phase 3 | `project-planner` | Sửa đường dẫn cứng, cập nhật 16 workflows, viết fix_skills.ts | Đạt 100% FAANG compliance |
| Phase 4 | `problem-checker` | Chạy toàn bộ test suites và kiểm tra IDE diagnostics | Đảm bảo 0 warnings/errors |

---

### Next Steps

- [ ] Review implementation plan artifact
- [ ] Phê duyệt kế hoạch
- [ ] Chạy `/build` để tiến hành thực thi toàn diện
