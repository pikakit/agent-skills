# SelfEvolution Scripts

Python scripts for project-scoped auto-learning system.

## Scripts Overview

| Script | Purpose | Usage |
|--------|---------|-------|
| `detect_triggers.py` | Detect mistake keywords | `python detect_triggers.py --message "Lỗi nghiêm trọng"` |
| `extract_lesson.py` | Extract lessons from context | `python extract_lesson.py --context '{...}'` |
| `auto_learn.py` | Main orchestrator | `python auto_learn.py detect --message "..." --ai` |
| `query_lessons.py` | **Query before coding** | `python query_lessons.py "menu navigation"` |
| `project_utils.py` | Project detection | `python project_utils.py` |

## Quick Start

### 1. Detect & Learn (AI Mode)
```bash
python auto_learn.py detect \
  --message "Bạn dùng customSelect làm menu bị lỗi" \
  --ai

# Output: Lesson LEARN-XXX created with 85% confidence
```

### 2. Query Before Coding
```bash
python query_lessons.py "writing menu with ESC handling"

# Output: 
# 📚 3 relevant lessons found:
#   [LEARN-005] 75% relevant - Never use customSelect
#   [LEARN-007] 45% relevant - Use p.isCancel()
#   [LEARN-006] 35% relevant - Avoid recursive menus
```

### 3. Test Project Detection
```bash
python project_utils.py

# Output:
# ✅ Project root: /path/to/project
#    Lessons dir:  .agent/skills/SelfEvolution/lessons
#    Lessons file: .agent/skills/SelfEvolution/lessons/project.yaml
```

## Architecture

### Project-Scoped Storage

```
project-a/
  └── .agent/skills/SelfEvolution/
      └── lessons/
          └── project.yaml  # Project A's lessons

project-b/
  └── .agent/skills/SelfEvolution/
      └── lessons/
          └── project.yaml  # Project B's lessons (isolated)
```

### Auto-Migration

First run in a project:
```
📦 Migrating lessons from global to project-scoped storage...
✅ Migrated 5 lessons to .agent/skills/SelfEvolution/lessons/project.yaml
```

Future runs use project-local lessons.

## Dependencies

```bash
pip install -r requirements.txt
```

- `PyYAML>=6.0` - YAML parsing
- `google-generativeai>=0.3.0` - AI extraction
- `python-dotenv>=1.0.0` - Environment variables

## Environment Setup (Optional - for AI mode)

```bash
# 1. Copy example
cp .env.example .env

# 2. Add Gemini API key
echo "GEMINI_API_KEY=your_key" >> .env

# 3. Get key from:
# https://aistudio.google.com/app/apikey
```

## CLI Integration

Use via `ag-smart learn`:
- **🔍 Query Lessons** - Find relevant lessons before coding
- **🤖 Auto-Learn** - Detect & extract from mistakes (AI-powered)
- **Add Pattern** - Manual lesson creation
- **List Patterns** - View all lessons
- **Remove Pattern** - Delete lessons

## Key Concepts

### Prevention > Detection

**Before v3.0** (Detection only):
```
1. Write code with bug
2. Test → Bug found
3. ag-smart recall → Violation detected
4. Fix bug
```

**After v3.0** (Prevention + Detection):
```
1. Query lessons before coding
2. Found: LEARN-005 (avoid customSelect)
3. Use correct approach from start
4. No bug created!
```

### Relevance Scoring

When querying, lessons are scored by relevance:

```python
score = 
  + 0.4 if scope matches (cli-navigation, api-design, etc.)
  + 0.2 per tag match (esc-key, menu, validation)
  + 0.15 if category matches
  + 0.05 per keyword overlap (max 0.25)
```

### Metrics

- `hitCount`: Times lesson was violated (bad)
- `appliedCount`: Times lesson was applied proactively (good)

**Goal**: `appliedCount` > `hitCount` = prevention beats detection!

## Examples

See [../SKILL.md](../SKILL.md) for detailed examples and workflows.
