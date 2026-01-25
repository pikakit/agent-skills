---
name: auto-learn
description: Automatically learn from mistakes in conversation. Detects when user points out errors, analyzes patterns, and adds lessons to lessons-learned.yaml. Use when user says "lỗi", "sai", "mistake", "wrong", "fix this", or indicates AI made an error.
---

# Auto-Learn Skill

This skill enables the agent to learn from mistakes during conversation and persist that knowledge for future sessions.

## Goal

To automatically detect when the agent makes a mistake, extract the lesson learned, and add it to the knowledge base so the same mistake is never repeated.

## Instructions

1. **Detect Mistake Indicators**:
   - Vietnamese: "lỗi", "sai", "hỏng", "không đúng", "sửa lại", "lỗi nghiêm trọng"
   - English: "mistake", "wrong", "fix this", "that's incorrect", "you broke"
   - User explicitly points out wrong output vs expected
   - User requests revert/rollback

2. **Analyze the Mistake**:
   ```
   What did I do wrong? (Action)
   What was the incorrect result? (Mistake)
   What should I have done instead? (Correction)
   ```

3. **Extract Lesson Entry**:
   ```yaml
   - id: LEARN-{next_number}
     pattern: {keyword or regex describing the mistake}
     message: "{Concise description: WRONG action + CORRECT action}"
     severity: ERROR | WARNING
     category: file-safety | code-quality | architecture | communication
     source: auto-conversation
     addedAt: {ISO timestamp}
   ```

4. **Add to Knowledge Base**:
   Append the entry to `.agent/knowledge/lessons-learned.yaml`

5. **Confirm to User**:
   Say: `📚 Đã học: [LEARN-XXX] - {summary}`

## Severity Guidelines

| Severity | When to Use |
|----------|-------------|
| **ERROR** | Data loss, file corruption, completely wrong output |
| **WARNING** | Suboptimal but no direct harm |

## Category Guidelines

| Category | Examples |
|----------|----------|
| `file-safety` | Deleted wrong file, overwrote data |
| `code-quality` | Code doesn't follow convention |
| `architecture` | Wrong design decision |
| `communication` | Misunderstood user request |
| `branding` | Wrong naming, terminology |

## Example

**User**: "Đây là lỗi nghiêm trọng, bạn tạo file mới thay vì rename"

**Agent Response**:
```yaml
# Extracted lesson:
- id: LEARN-003
  pattern: rebranding
  message: "When rebranding: NEVER create new simplified file. COPY original full content, then edit branding only."
  severity: ERROR
  category: file-safety
```
📚 Đã học: [LEARN-003] - When rebranding: copy original first, don't create new simplified file

## Constraints

- **Do NOT** add lesson for every small feedback (only real mistakes)
- **Do NOT** duplicate existing lessons
- **Do NOT** add generic lessons like "code better"
- **MUST** include grep-able pattern
- **MUST** match severity to actual impact

## Integration

Lessons are automatically used by:
- `ag-smart recall` - scan for violations
- `ag-smart stats` - display hit counts
- `ag-smart watch` - real-time monitoring
