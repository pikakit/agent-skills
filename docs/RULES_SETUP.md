# 📋 Hướng Dẫn Cập Nhật Rules

## Bước 1: Mở Gemini Settings

1. Click vào icon ⚙️ (Settings) góc phải
2. Chọn **Rules** tab

## Bước 2: Xóa Rules Cũ (Trùng lặp)

Xóa các file sau trong **Project Rules**:
- ❌ `GEMINI.md` (file thứ 1)
- ❌ `GEMINI.md` (file thứ 2 - trùng lặp)

## Bước 3: Thêm Rules Mới

Click **+ Workspace** và thêm:

| File | Mục đích |
|------|----------|
| `AGENT_SKILL_KIT.md` | Config chính cho Agent Skill Kit |
| `SAFETY_PROTOCOL.md` | Safety rules đơn giản |

## Bước 4: Cập Nhật Global Rule (Optional)

Nếu muốn thay thế `GEMINI_SAFE_MODE_FINAL.md`:
- Copy nội dung từ `SAFETY_PROTOCOL.md`
- Paste vào Global Rules

---

## 📁 Các File Đã Tạo

```
agent-skill-kit/
├── AGENT_SKILL_KIT.md    ← Config chính (163 dòng)
├── SAFETY_PROTOCOL.md    ← Safety rules (85 dòng)
└── docs/
    └── RULES_SETUP.md    ← File này
```

## ✅ So Sánh Cũ vs Mới

| Aspect | Cũ | Mới |
|--------|-----|-----|
| Files | 3 files (2 trùng) | 2 files |
| Lines | ~600+ dòng | ~248 dòng |
| Naming | GEMINI (brand khác) | Agent Skill Kit |
| Clarity | Phức tạp | Đơn giản, rõ ràng |
