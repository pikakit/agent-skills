---
name: state-rollback
description: >-
  Save state before changes, restore on failure for safe code modifications. Provides
  rollback capability for risky operations. Triggers on: before risky operations,
  multi-file edits, rollback requests. Coordinates with: code-craft, problem-checker.
metadata:
  category: "core"
  version: "1.0.0"
  triggers: "before risky operations, multi-file edits, rollback requests, code breaks"
  coordinates_with: "code-craft, app-scaffold, problem-checker"
  success_metrics: "100% restore accuracy, state save <1s"
---

# state-rollback

> **Purpose:** Save file state before modifications and restore on failure

---

## Safety Philosophy

```
Safety > Recoverability > Correctness > Cleanliness > Convenience
```

**Core Principle:** New output can be worse than old one. Always preserve ability to rollback.

---

## When to Invoke

| Trigger | Action |
|---------|--------|
| Before modifying >3 files | Save state |
| Before risky refactoring | Save state |
| After modification fails | Restore state |
| User says "rollback", "undo" | Restore state |

---

## State Management Protocol

### Step 1: Save State (Before Modification)

```javascript
// Save current state of files to be modified
const saveState = async (files) => {
  const state = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    files: []
  };
  
  for (const file of files) {
    state.files.push({
      path: file,
      content: fs.readFileSync(file, 'utf8')
    });
  }
  
  saveToStateStore(state);
  return state.id;
};
```

### Step 2: Perform Modification

```javascript
// Wrap risky operation
const safeModify = async (files, modifyFn) => {
  const stateId = await saveState(files);
  
  try {
    await modifyFn();
    // Verify with problem-checker
    const hasErrors = await checkProblems();
    if (hasErrors) {
      throw new Error('Modification introduced errors');
    }
  } catch (error) {
    await restoreState(stateId);
    throw error;
  }
};
```

### Step 3: Restore State (On Failure)

```javascript
// Restore files to saved state
const restoreState = async (stateId) => {
  const state = loadState(stateId);
  
  for (const file of state.files) {
    fs.writeFileSync(file.path, file.content, 'utf8');
  }
  
  console.log(`✅ Restored ${state.files.length} files to state ${stateId}`);
};
```

---

## State Storage

Location: `.agent/state/`

```
.agent/state/
├── current.json          # Current state ID
├── states/
│   ├── state-001.json    # Saved state 1
│   ├── state-002.json    # Saved state 2
│   └── ...
└── history.json          # State history log
```

### State Format

```json
{
  "id": "state-001",
  "timestamp": "2026-01-29T10:00:00Z",
  "description": "Before refactoring TodoItem",
  "files": [
    {
      "path": "/path/to/file.tsx",
      "content": "file contents...",
      "hash": "sha256..."
    }
  ]
}
```

---

## Integration with GEMINI.md Safety Rules

### NO DELETE RULE Compliance

```
state-rollback enforces:
- Never delete without explicit user confirmation
- Always save state before any destructive operation
- Provide instant rollback capability
```

### WRITE-ONLY DEFAULT Compliance

```
For modifications:
1. Save current state
2. Write to new version (.v2, .new)
3. Ask user approval
4. If approved: rename new → original
5. If rejected: delete new version
```

---

## Scripts

| Script | Purpose |
|--------|---------|
| `state_manager.js` | Save, restore, list states |

---

## Usage Examples

### Before Risky Operation

```javascript
// Agent about to refactor 5 files
const stateId = await saveState([
  'components/TodoItem.tsx',
  'components/TodoList.tsx',
  'lib/store.ts',
  'lib/types.ts',
  'app/page.tsx'
]);

console.log(`💾 State saved: ${stateId}`);
// Proceed with refactoring...
```

### On Failure

```javascript
// TypeScript check fails after modification
if (hasTypeErrors) {
  await restoreState(stateId);
  console.log('⏪ Rolled back to previous state');
  // Notify user about the issue
}
```

### Manual Rollback

```
User: "Rollback the last change"

Agent:
1. Load latest state from history
2. Restore all files in state
3. Confirm: "⏪ Restored 5 files to state-003"
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| State save time | <1s for 10 files |
| Restore accuracy | 100% |
| State retention | 10 most recent |
| Storage overhead | <10MB |

---

## Commands

```bash
# Save current state
node state_manager.js save --files "file1.tsx,file2.tsx" --desc "Before refactor"

# List saved states  
node state_manager.js list

# Restore specific state
node state_manager.js restore --id state-001

# Restore latest state
node state_manager.js restore --latest

# Clean old states (keep last N)
node state_manager.js clean --keep 10
```
