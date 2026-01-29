# Knowledge Base

> Agent learning storage with FAANG-standard indexing and schema validation.

---

## 📂 Structure

```
knowledge/
├── index.json           # Searchable index (pattern, tag, severity)
├── lessons-learned.yaml # Extracted lessons from failures
├── mistakes.yaml        # Error patterns to avoid
├── improvements.yaml    # Improvement suggestions
├── autopilot-metrics.json # Performance metrics
├── autopilot-runs.json  # Execution history
├── evolution-signals.json # Learning signals
├── taxonomy.yaml        # Pattern categorization
├── retention.yaml       # What to remember
├── settings.yaml        # Configuration
├── schema/              # JSON Schema validation
│   ├── common.schema.json
│   ├── mistakes.schema.json
│   ├── improvements.schema.json
│   ├── evolution-signals.schema.json
│   └── settings.schema.json
├── scans/               # Security/code scan results
└── backups/             # Automatic backups
```

---

## 🎯 Purpose

| File | Purpose |
|------|---------|
| `index.json` | Fast lookup by pattern, tag, or severity |
| `lessons-learned` | Lessons from task failures |
| `mistakes` | Anti-patterns to detect and warn |
| `improvements` | Suggested code improvements |
| `taxonomy` | Pattern classification hierarchy |

---

## 📊 Index Structure

```json
{
  "version": 1,
  "patternIndex": { "pattern": ["ID-001"] },
  "tagIndex": { "tag": ["ID-001"] },
  "severityIndex": { "ERROR": ["ID-001"] },
  "idIndex": {
    "ID-001": {
      "pattern": "...",
      "message": "...",
      "severity": "ERROR|WARNING|INFO",
      "hitCount": 0,
      "confidence": 0.95
    }
  }
}
```

---

## 🔧 Usage

```typescript
// Load index
import index from '.agent/knowledge/index.json';

// Find by pattern
const ids = index.patternIndex['customSelect'];

// Get details
const detail = index.idIndex['MISTAKE-005'];
```

---

## 📋 Schema Validation

All files validated against JSON Schema in `schema/`:

```bash
# Validate a file
npx ajv validate -s schema/mistakes.schema.json -d mistakes.yaml
```

---

## 🔄 Backup

Automatic backups stored in `backups/` with timestamp naming.
