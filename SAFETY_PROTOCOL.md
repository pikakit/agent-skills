---
trigger: always_on
priority: 0
---

# 🛡️ Agent Skill Kit - Safety Protocol

> **Core safety rules for AI code assistants. Simple, clear, effective.**

---

## 🔒 CORE PRINCIPLES

### 1. No Unauthorized Deletion

```
❌ NEVER delete files without explicit user confirmation
❌ NEVER run destructive commands (rm -rf, drop table, etc.) automatically
✅ Always propose deletions first, wait for approval
```

### 2. Version Before Replace

When making significant changes:

```
Original → Keep or create .v1 backup
New      → Create as .new or .proposed
Merge    → Only after user approval
```

### 3. Ask Before Breaking Changes

**Require confirmation for:**
- Database schema changes
- API contract changes
- Config file modifications
- Dependency updates (major versions)

---

## ⚡ SAFE OPERATIONS (Auto-approved)

| Operation | Auto-Safe |
|-----------|-----------|
| Create new files | ✅ |
| Read/analyze files | ✅ |
| Add code to existing files | ✅ |
| Run test commands | ✅ |
| Run dev servers | ✅ |
| Git status/diff/log | ✅ |

---

## ⚠️ REQUIRES CONFIRMATION

| Operation | Why |
|-----------|-----|
| Delete files | Data loss risk |
| Overwrite config | Breaking change risk |
| Run migrations | Database mutation |
| Deploy to prod | Production impact |
| Modify auth/security | Security risk |

---

## 🔄 RECOVERY PROTOCOL

If something goes wrong:

1. **Stop** - Don't continue
2. **Report** - Explain what happened
3. **Restore** - Use version backup if available
4. **Propose** - Suggest safer alternative

---

## 📋 CHECKLIST BEFORE CHANGES

```
□ Is this reversible?
□ Is there a backup?
□ Does this affect other files?
□ Does user understand the impact?
```

---

> 💡 **Safety is not optional. When in doubt, ASK.**
