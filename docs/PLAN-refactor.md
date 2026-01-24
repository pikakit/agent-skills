# Refactoring Plan: My Agent Skills (Standardization & Maintainability)

## 1. Goal
Biến `myagentskills` từ một tập hợp "lai tạp" (Antigravity + Vercel + CoinPika) thành một hệ thống **Nhất quán (Consistent)**, **Module hóa (Modular)** và **Dễ mở rộng (Extensible)**.

## 2. Current State (The Problem)
- **Inconsistent Structure**:
  - `governance`: Dùng `constitution/`, `doctrines/`.
  - `frontend` (new): Dùng `rules/*.md` (Styles Vercel).
  - `frontend-design` (old): Dùng single `SKILL.md`.
  - `api-patterns`: Dùng python scripts.
- **Scattered Logic**: Script nằm rải rác (`.agent/scripts`, skill scripts).
- **Hard to Upgrade**: Nếu muốn thêm rule mới cho `frontend-design`, phải sửa file markdown lớn thay vì thêm 1 file nhỏ.

## 3. The New Standard Structure (Proposal)
Mỗi skill PHẢI tuân thủ cấu trúc chuẩn sau:

```
skill-name/
├── SKILL.md            # Entry point (Router & Metadata)
├── rules/              # [OPTIONAL] Atomic knowledge (Markdown)
│   ├── rule-001.md
│   └── rule-002.md
├── scripts/            # [OPTIONAL] Executable logic (Node/Python)
│   ├── audit.js
│   └── fix.js
└── tests/              # [OPTIONAL] Validation for the skill itself
```

## 4. Execution Phases

### Phase 1: Core System Refactor (CLI & Shared)
- **Action**: Move `ag-smart.js` and `.agent/scripts` into a proper `packages/cli` structure (giống Vercel repo gốc) hoặc folder `core/`.
- **Benfit**: Tách biệt "Engine" (CLI) khỏi "Data" (Skills).

### Phase 2: Unification (Skill Standardization)
- **Action**: Convert các skill cũ (dạng Single File MD) sang dạng **Atomic Rules**.
  - Ví dụ: Xé nhỏ `frontend-design/SKILL.md` thành `frontend-design/rules/colors.md`, `frontend-design/rules/typography.md`.
- **Action**: Xóa bỏ các file rác hoặc legacy artifacts (ví dụ template code thừa).

### Phase 3: Metadata & Indexing
- **Action**: Tạo `registry.json` hoặc cơ chế auto-discovery để CLI biết có bao nhiêu skill và rule đang tồn tại mà không cần hardcode.

## 5. Next Step
Chúng ta sẽ bắt đầu với **Phase 1: Core System Refactor**.
1. Tạo thư mục `core/cli`.
2. Di chuyển `ag-smart.js` và `scripts/*.js` vào đó.
3. Cập nhật `package.json` để trỏ đúng bin.
