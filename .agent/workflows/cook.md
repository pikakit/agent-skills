---
description: Execute specific implementation tasks directly from instructions or plans. The "Just Code It" workflow.
chain: build-web-app
---

# /cook - The Implementer

$ARGUMENTS

---

## Purpose

Rapidly implement specific features, components, or logic based on clear instructions. **Skips architectural debate to focus on pure coding speed.**

> **Differences:**
> - `/build`: Creates entire projects (Strategic)
> - `/boost`: Adds complex features to projects (Strategic)
> - `/cook`: Implements specific tasks/files (Tactical)

---

## Workflow Modes

| Mode | Research | Testing | Review Gates | Use When |
|------|----------|---------|--------------|----------|
| **interactive** (default) | ✓ | ✓ | User approval | Standard features |
| **--auto** | ✓ | ✓ | Auto if score≥9.5 | Trusted autonomous |
| **--fast** | ✗ | ✓ | User approval | Quick prototypes |
| **--no-test** | ✓ | ✗ | User approval | Experimental code |

```bash
/cook "add user auth"              # interactive (default)
/cook "implement notifications" --fast
/cook path/to/plan.md --auto
```

## 🤖 Meta-Agents Integration

| Phase | Agent | Action |
| ----- | ----- | ------ |
| **Verify** | `learner` | Log execution pattern |

```
Flow:
Instruction → Code Gen → Verify → Done
```

---

## 🔴 MANDATORY: Cooking Protocol

### Phase 1: Misan Place (Preparation)

1. Understand the exact instruction
2. Read related files (if any)
3. Identify dependencies

// turbo
```bash
# Verify environment is ready
npm run problem:check
```

### Phase 2: Implementation (The Cooking)

Invoke `code-craft` to write the code.

**Guidelines:**
- Follow existing patterns strictly
- No whitespace changes in unrelated areas
- One file at a time unless necessary

### Phase 3: Taste Test (Verification)

// turbo
```bash
# Quick validation
npm run lint
```

> If errors found → Auto-fix immediately.

---

## Output Format

```markdown
## 🍳 Cooked: [Component/File Name]

### Changes Applied
- [x] Created/Modified `path/to/file`
- [x] Implemented [functionality]

### Verification
- [x] Syntax check passed
- [x] No lint errors

### Next Steps
- [ ] Manual review
- [ ] Run full test suite (`/validate`)
```

---

## Examples

```bash
/cook "Create a Button component with variants"
/cook "Implement the login logic in auth.ts"
/cook "Refactor UserCard to use Tailwind v4"
```

---

## 🔗 Workflow Chain

```mermaid
graph LR
    A["/plan"] --> B["/cook"]
    B --> C["/validate"]
    style B fill:#f59e0b
```

| After /cook | Run | Purpose |
|Data | `/validate` | Run tests to ensure correctness |
| Error | `/fix` | Fix any resulting issues |

**Handoff:**
```markdown
Implementation complete. Run `/validate` to verify behavior.
```
