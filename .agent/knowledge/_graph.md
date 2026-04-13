# Knowledge Graph

> Auto-maintained by `knowledge-compiler`. Do not edit manually.
> Visualizes relationships between concept articles.

---

## Concept Map

```mermaid
graph TD
    ROOT["Knowledge Base"] --> CON001["CON-001: Import Resolution Strategy"]
    CON001 --> PTN001["PTN-001: Import Resolution Pattern"]
    CON001 --> ADR001["ADR-001: Path Alias Decision"]
    style ROOT fill:#10b981,color:#fff
    style CON001 fill:#3b82f6,color:#fff
    style PTN001 fill:#8b5cf6,color:#fff
    style ADR001 fill:#f59e0b,color:#fff
```

---

## Relationship Legend

| Edge Type | Meaning |
|-----------|---------|
| `-->` | "depends on" or "is related to" |
| `-.->` | "weak reference" |
| `==>` | "evolved from" |

---

> ⚡ PikaKit Knowledge Compiler v1.0.0
