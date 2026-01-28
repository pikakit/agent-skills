---
description: Framework để Agent tự chạy từ đầu đến cuối với auto-accept. User chỉ cần approve PLAN.md một lần.
---

# Auto-Accept Agent Workflow

> **Mục tiêu:** User request → Agent chạy tự động → Kết quả hoàn chỉnh

---

## 🎯 Core Concept

```
User Request → PLAN.md (1 lần approve) → Agent chạy tự động → Done
```

**Thay vì:** User phải approve từng command, từng file edit.

---

## 📋 Quy Trình 3 Phase

### Phase 1: Planning (1 Checkpoint)

```markdown
1. User: "Build feature X"
2. Agent: Tạo PLAN.md với đầy đủ chi tiết
3. ⛔ **CHECKPOINT DUY NHẤT**: User approve PLAN.md
4. User: "Approved" hoặc "Proceed"
```

**PLAN.md phải có:**

- [ ] Mục tiêu rõ ràng
- [ ] Danh sách files sẽ tạo/sửa
- [ ] Commands sẽ chạy
- [ ] Verification steps

### Phase 2: Execution (Auto-Accept)

```markdown
// turbo-all ← Magic annotation

5. Agent tạo files (không hỏi)
6. Agent chạy commands (auto-accept nếu safe)
7. Agent fix lỗi nếu có
```

**Auto-Accept Conditions:**

| Command Type          | Auto-Accept?      |
| --------------------- | ----------------- |
| `npm run *`           | ✅ Yes            |
| `npm test`            | ✅ Yes            |
| `git status/diff/log` | ✅ Yes            |
| `node .agent/*`       | ✅ Yes            |
| `git push`            | ❌ No (deny list) |
| `rm -rf`              | ❌ Never          |

### Phase 3: Verification (Auto)

```markdown
8. Agent chạy tests
9. Agent chạy lint/security scan
10. Agent report kết quả
```

---

## 🔑 Magic Annotations

### Trong Workflow Files

```markdown
// turbo ← Auto-accept STEP tiếp theo
// turbo-all ← Auto-accept TẤT CẢ steps trong workflow
```

### Trong Code Blocks

````markdown
// @auto @safe ← Đánh dấu command an toàn

```bash
npm run test
```
````

````

---

## ⚙️ Config: execution-policy.json

```json
{
  "autoAccept": {
    "enabled": true,
    "defaultMode": "prompt",
    "requiredAnnotations": ["auto", "safe"],

    "allowPatterns": [
      { "pattern": "^npm run [a-z0-9:-]+$", "type": "regex" },
      { "pattern": "node .agent/", "type": "prefix" },
      { "pattern": "git status", "type": "exact" }
    ],

    "denyPatterns": [
      { "pattern": "rm -rf", "type": "contains", "severity": "critical" },
      { "pattern": "git push", "type": "prefix", "severity": "high" }
    ]
  },

  "phaseGate": {
    "requirePlanApproval": true
  }
}
````

---

## 📝 Template: User Request Format

**Để trigger auto-accept mode:**

```markdown
/autopilot Build [feature description]

Yêu cầu:

1. [Chi tiết yêu cầu]
2. [Constraints/preferences]

AUTO-APPROVE: After PLAN.md approval, proceed without asking.
```

**Hoặc đơn giản:**

```markdown
/build [feature] --auto
```

---

## 🔄 Flow Diagram

```
┌─────────────────┐
│  User Request   │
└────────┬────────┘
         ▼
┌─────────────────┐
│   PLAN.md       │
│   Generation    │
└────────┬────────┘
         ▼
┌─────────────────┐
│ ⛔ USER APPROVE │  ← Checkpoint duy nhất
└────────┬────────┘
         ▼
┌─────────────────────────────────────┐
│         AUTO-EXECUTION              │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│  │File │ │Cmd  │ │Test │ │Fix  │   │
│  │Edit │→│Run  │→│Run  │→│Errs │   │
│  └─────┘ └─────┘ └─────┘ └─────┘   │
│         (All // turbo-all)          │
└────────┬────────────────────────────┘
         ▼
┌─────────────────┐
│    REPORT       │
│    to User      │
└─────────────────┘
```

---

## ✅ Checklist để Enable Auto-Accept

1. [ ] Workflow file có `// turbo-all` annotation
2. [ ] Commands nằm trong `allowPatterns` của policy
3. [ ] User đã approve PLAN.md
4. [ ] Không có commands trong `denyPatterns`

---

## 🚀 Ví Dụ Thực Tế

**User:**

```
/autopilot Build authentication system with JWT

AUTO-APPROVE: After PLAN.md, proceed automatically.
```

**Agent Response:**

```
📋 PLAN.md created. Includes:
- auth.service.ts (JWT logic)
- auth.controller.ts (endpoints)
- auth.middleware.ts (guards)
- 12 test cases

⛔ Approve to proceed?
```

**User:**

```
Proceed
```

**Agent (Auto from here):**

```
✅ Created auth.service.ts
✅ Created auth.controller.ts
✅ Created auth.middleware.ts
✅ npm run test → 12/12 passed
✅ npm run lint → No errors
✅ Security scan → Clean

🎉 Authentication system complete!
```

---

## 📁 Files Liên Quan

| File                                    | Purpose              |
| --------------------------------------- | -------------------- |
| `.agent/config/execution-policy.json`   | Allow/deny rules     |
| `.agent/workflows/*.md`                 | Workflow definitions |
| `.agent/scripts-js/execution-policy.js` | Policy engine        |
| `.agent/scripts-js/workflow-engine.js`  | Workflow executor    |

---

## 🛡️ Safety Guarantees

1. **Plan Approval Required**: Không chạy mà không có PLAN.md approved
2. **Deny List Protected**: Dangerous commands luôn bị block
3. **Execution History**: Mọi command được log
4. **Rollback Ready**: Git commits trước mỗi phase

---

_Version 1.0 | Agent Skill Kit_
