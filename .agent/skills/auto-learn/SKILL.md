---
name: auto-learn
description: Tự động học từ mistakes trong conversation. Detect khi user chỉ ra lỗi, phân tích pattern, và add vào lessons-learned.yaml mà không cần lệnh thủ công.
triggers:
  - mistake detection
  - error learning
  - auto learn from conversation
---

# 🧠 Auto-Learn Skill

> **Tự động học từ mistakes - AI càng dùng càng thông minh**

## Khi nào kích hoạt

Skill này được kích hoạt khi detect **Mistake Indicators** trong conversation:

### Trigger Keywords (Vietnamese)
- "lỗi", "sai", "hỏng", "không đúng", "sửa lại"
- "lỗi nghiêm trọng", "mistake", "wrong"
- "đây là lỗi", "bạn làm sai", "không phải vậy"

### Trigger Patterns
- User chỉ ra output sai so với expected
- User yêu cầu revert/rollback
- User nói "fix", "sửa" sau khi AI làm gì đó

---

## Protocol: Auto-Learn from Mistakes

### Step 1: Detect Mistake

Khi phát hiện trigger, **NGAY LẬP TỨC** phân tích:

```
1. Tôi vừa làm gì? (Action)
2. Kết quả sai như thế nào? (Mistake)
3. User muốn gì thay vào đó? (Correction)
```

### Step 2: Extract Lesson

Format lesson entry:

```yaml
- id: LEARN-{next_number}
  pattern: {keyword hoặc regex mô tả mistake}
  message: "{Mô tả ngắn gọn: SAI gì + ĐÚNG là gì}"
  severity: ERROR | WARNING
  category: {file-safety | code-quality | architecture | communication}
  source: auto-conversation
  addedAt: {ISO timestamp}
```

### Step 3: Add to Knowledge Base

Append entry vào: `.agent/knowledge/lessons-learned.yaml`

### Step 4: Confirm (Inline)

Thông báo ngắn gọn:

```
📚 Đã học: [LEARN-XXX] - {message tóm tắt}
```

---

## Severity Guidelines

| Severity | Khi nào dùng |
|----------|--------------|
| **ERROR** | Data loss, file bị hỏng, output sai hoàn toàn |
| **WARNING** | Suboptimal nhưng chưa gây hại trực tiếp |

---

## Category Guidelines

| Category | Ví dụ |
|----------|-------|
| `file-safety` | Xóa file không đúng, overwrite data |
| `code-quality` | Code không follow convention |
| `architecture` | Design decision sai |
| `communication` | Hiểu sai yêu cầu user |
| `branding` | Naming, terminology không đúng |

---

## Example Lessons

### Mistake: Tạo file mới thay vì rename
```yaml
- id: LEARN-003
  pattern: rebranding
  message: "When rebranding: NEVER create new simplified file. COPY original full content, then edit branding only."
  severity: ERROR
  category: file-safety
```

### Mistake: Không so sánh trước khi thay thế
```yaml
- id: LEARN-004
  pattern: replace file
  message: "Before replacing any file: COMPARE line counts and content. Original 375 lines → New 163 lines = DATA LOSS."
  severity: ERROR
  category: file-safety
```

---

## Integration với ag-smart

Lessons được tự động pick up bởi:
- `ag-smart recall` - scan for violations
- `ag-smart stats` - hiển thị hit counts
- `ag-smart watch` - real-time monitoring

---

## DO NOT

- ❌ Add lesson cho mọi feedback nhỏ (chỉ khi thực sự là mistake)
- ❌ Duplicate lessons đã tồn tại
- ❌ Add lesson quá generic ("code better")

## DO

- ✅ Add lesson cụ thể, actionable
- ✅ Include pattern có thể grep được
- ✅ Severity phù hợp với impact
