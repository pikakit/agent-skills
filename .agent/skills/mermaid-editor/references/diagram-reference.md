---
name: mermaid-diagram-reference
description: Complete syntax and examples for all 9 Mermaid diagram types — flowchart, sequence, class, state, ER, gantt, pie, mindmap, timeline
---

# Mermaid Diagram Reference

> Complete syntax and examples for all 9 supported diagram types.

---

## 1. Flowchart

```mermaid
flowchart LR
    A[Start] --> B{Decision}
    B -->|Yes| C[Action]
    B -->|No| D[End]
```

**Node shapes:** `[rect]` `(round)` `{diamond}` `[[db]]` `[(cylinder)]` `((circle))`

**Arrows:** `-->` `-.->` `==>` `--text-->` `-->|label|`

---

## 2. Sequence Diagram

```mermaid
sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Hello
    B-->>A: Hi back
    A->>+B: Activate
    B-->>-A: Deactivate
```

**Arrows:** `->>` `-->>` `-x` `-)`

**Notes:** `Note right of A: Text` `Note over A,B: Text`

---

## 3. Class Diagram

```mermaid
classDiagram
    class Animal {
        +String name
        +eat()
    }
    class Dog {
        +bark()
    }
    Animal <|-- Dog
```

**Relations:** `<|--` `*--` `o--` `-->` `..>` `..|>`

**Visibility:** `+public` `-private` `#protected` `~package`

---

## 4. State Diagram

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Running : start
    Running --> Idle : stop
    Running --> [*] : crash
```

**Syntax:** `[*]` start/end, `-->` transition, `: label`

---

## 5. Entity Relationship (ER)

```mermaid
erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ ITEM : contains
    USER {
        int id PK
        string name
    }
```

**Cardinality:** `||` one, `o{` zero or more, `|{` one or more

---

## 6. Gantt Chart

```mermaid
gantt
    title Project Timeline
    dateFormat YYYY-MM-DD
    section Phase 1
    Task A :a1, 2024-01-01, 30d
    Task B :after a1, 20d
```

---

## 7. Pie Chart

```mermaid
pie title Market Share
    "Chrome" : 65
    "Firefox" : 15
    "Safari" : 12
    "Edge" : 8
```

---

## 8. Mindmap

```mermaid
mindmap
  root((Topic))
    Branch 1
      Leaf A
      Leaf B
    Branch 2
      Leaf C
```

---

## 9. Timeline

```mermaid
timeline
    title History
    2020 : Event A
    2021 : Event B
         : Event C
    2022 : Event D
```

---

## Best Practices

| Practice | Example |
|----------|---------|
| Quote special chars | `id["Label (info)"]` |
| Use subgraphs | Group related nodes |
| Add direction | `flowchart LR` (left-right) |
| Theme setting | `%%{init: {'theme':'dark'}}%%` |

---

## CLI Export (mmdc)

```bash
# Install
npm install -g @mermaid-js/mermaid-cli

# Export
mmdc -i diagram.mmd -o diagram.svg
mmdc -i diagram.mmd -o diagram.png -t dark -b transparent

# Batch export
mmdc -i "*.mmd" -o output/
```

---

## Themes

`default` | `dark` | `forest` | `neutral` | `base`

```mermaid
%%{init: {'theme':'forest'}}%%
flowchart LR
    A --> B
```

---

⚡ PikaKit v3.9.80

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [../SKILL.md](../SKILL.md) | Quick start, CLI options, state transitions |
| [../scripts/editor-server.js](../scripts/editor-server.js) | Live editor server |
| [engineering-spec.md](engineering-spec.md) | Full engineering spec |
| `system-design` | Architecture diagrams |
| `markdown-novel-viewer` | Mermaid in markdown preview |
