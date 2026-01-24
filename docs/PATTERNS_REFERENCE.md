# Patterns Learned from everything-claude-code

> Reference từ Anthropic hackathon winner repo

---

## 1. Package Manager Detection Pattern

```javascript
// Priority order for detection
const DETECTION_PRIORITY = [
    'CLAUDE_PACKAGE_MANAGER',           // 1. Env var
    '.claude/package-manager.json',      // 2. Project config
    'package.json.packageManager',       // 3. package.json field
    'lock files',                        // 4. Lock file detection
    '~/.claude/package-manager.json',    // 5. Global config
    'first available'                    // 6. Fallback
];
```

---

## 2. Memory Persistence Hooks

```json
// Session lifecycle hooks
{
    "PreToolUse": "scripts/hooks/session-start.js",
    "Stop": "scripts/hooks/session-end.js"
}
```

**Pattern:** Save/load context across sessions automatically.

---

## 3. Continuous Learning

```markdown
/learn - Extract patterns mid-session into skills
- Auto-extract reusable patterns
- Store in knowledge base
- Apply in future sessions
```

---

## 4. Verification Loop

```markdown
/checkpoint - Save verification state
/verify - Run verification loop

1. Checkpoint vs continuous evals
2. Grader types
3. Pass@k metrics
```

---

## 5. Strategic Compaction

When context is full:
1. Save current state
2. Suggest manual compaction
3. Preserve important context
4. Resume seamlessly

---

## 6. Dynamic Contexts

```
contexts/
├── dev.md      # Development mode
├── review.md   # Code review mode
├── research.md # Exploration mode
```

Inject different system prompts based on task type.

---

## Implementation Ideas for agent-skill-kit

- [ ] Add package manager detection to CLI
- [ ] Create memory persistence skill
- [ ] Add /checkpoint command
- [ ] Implement dynamic contexts

---

**Source:** https://github.com/affaan-m/everything-claude-code
