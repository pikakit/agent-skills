---
name: requirement-extractor
description: >-
  Extract structured requirements from natural language. Converts user requests
  into categorized requirements. Triggers on: after idea-storm, before project-planner.
  Coordinates with: idea-storm, project-planner.
metadata:
  category: "core"
  version: "1.0.0"
  triggers: "after idea-storm, before project-planner, complex feature request"
  coordinates_with: "idea-storm, project-planner"
  success_metrics: "all must-haves identified, no conflicting requirements"
---

# requirement-extractor

> **Purpose:** Convert natural language requests into structured requirements

---

## Extraction Process

```
Natural Language → Parse → Categorize → Structure → Output
```

---

## Output Format

```yaml
project:
  name: "Weather App"
  type: web
  
functional_requirements:
  - id: FR-001
    description: "Search for weather by city name"
    priority: must-have
    
  - id: FR-002
    description: "Display temperature in Celsius and Fahrenheit"
    priority: must-have
    
non_functional_requirements:
  - id: NFR-001
    description: "Load time under 2 seconds"
    category: performance
    
  - id: NFR-002
    description: "Mobile responsive design"
    category: accessibility
    
constraints:
  - "Use Next.js 15"
  - "No external API (use mock data)"
  
assumptions:
  - "User has modern browser"
  - "Internet connection required"
```

---

## Categorization

| Category | Examples |
|----------|----------|
| **Must-have** | Core features, user explicitly requested |
| **Should-have** | Important but not critical |
| **Could-have** | Nice to have |
| **Won't-have** | Out of scope |

---

## Validation

Before passing to project-planner:

- [ ] All must-haves identified
- [ ] No conflicting requirements
- [ ] Scope is achievable
- [ ] Dependencies identified

---

## Integration

```
User Request
    ↓
idea-storm (clarify)
    ↓
requirement-extractor (structure)
    ↓
project-planner (plan)
```
