---
name: input-validator
description: >-
  Validate and normalize user input before routing to skills. Ensures requests
  are clear, complete, and achievable. Triggers on: every incoming request, before
  smart-router. Coordinates with: smart-router, idea-storm.
metadata:
  category: "core"
  version: "1.0.0"
  triggers: "every incoming request, before smart-router"
  coordinates_with: "smart-router, idea-storm"
  success_metrics: "confidence >= 80%, no ambiguous requests"
---

# input-validator

> **Purpose:** Validate user requests are clear and complete before processing

---

## Validation Checks

| Check | Purpose |
|-------|---------|
| **Completeness** | Does request have enough information? |
| **Clarity** | Is intent unambiguous? |
| **Scope** | Is request achievable in one session? |
| **Context** | Is relevant context provided? |

---

## Protocol

```
User Request → input-validator
                    ↓
              Check completeness
                    ↓
              Check clarity
                    ↓
              Confidence score?
                ↓         ↓
              ≥80%       <80%
                ↓         ↓
           Route to    Ask clarifying
           smart-router  questions
```

---

## Validation Rules

### Rule 1: Completeness

```yaml
required_for_build:
  - What to build? (app type, features)
  - Tech preferences? (or use defaults)
  
required_for_debug:
  - What's the error? (message, stack)
  - What was expected?
  - What actually happened?
  
required_for_design:
  - What style? (or generate options)
  - Target audience?
```

### Rule 2: Clarity

```yaml
ambiguous_keywords:
  - "make it better" → Ask: better how?
  - "fix this" → Ask: what's wrong?
  - "something like..." → Ask: can you be specific?
```

### Rule 3: Scope

```yaml
too_large:
  - "Build a complete e-commerce platform" → Break into phases
  - "Refactor entire codebase" → Identify priority areas
```

---

## Output

```json
{
  "isValid": true,
  "confidence": 0.85,
  "normalizedRequest": "Build a weather app with search and forecast",
  "extractedIntent": "build",
  "extractedDomain": "web",
  "missingInfo": [],
  "suggestedQuestions": []
}
```

---

## Integration

Always runs BEFORE smart-router:

```
User → input-validator → smart-router → skill
```
