---
name: context-engineering
description: >-
  Monitor context usage, optimize token consumption, design efficient agent architectures.
  Four-bucket strategy: Write, Select, Compress, Isolate.
  Triggers on: context usage, token limit, agent architecture, memory system.
  Coordinates with: lifecycle-orchestrator, multi-agent.
metadata:
  version: "1.0.0"
  category: "architecture"
  triggers: "context usage, token limit, agent architecture, memory, compression"
  success_metrics: "token usage <70%, quality maintained, cost reduced"
  coordinates_with: "lifecycle-orchestrator, multi-agent, system-design"
---

# Context Engineering

> Smallest high-signal token set = Maximum reasoning quality.

---

## Prerequisites

**Knowledge:**
- Understanding of LLM context windows
- Agent architecture patterns
- Token counting basics

---

## When to Use

| Situation | Action |
|-----------|--------|
| Context >70% full | Trigger optimization |
| Agent failing on large files | Apply compression |
| Multi-agent coordination | Use isolation patterns |
| Cross-session memory | Implement persistence |

---

## Core Principles

| Principle | Description |
|-----------|-------------|
| **Quality > Quantity** | High-signal tokens beat exhaustive content |
| **Attention is Finite** | U-curve: beginning/end favored |
| **Progressive Disclosure** | Load just-in-time |
| **Isolation Prevents Degradation** | Partition across sub-agents |
| **Measure Before Optimizing** | Know your baseline |

---

## Four-Bucket Strategy

| Bucket | Strategy | Example |
|--------|----------|---------|
| **Write** | Save externally | Scratchpads, files |
| **Select** | Pull only relevant | Retrieval, filtering |
| **Compress** | Reduce tokens | Summarization |
| **Isolate** | Split work | Sub-agents |

---

## Key Metrics

| Metric | Target | Note |
|--------|--------|------|
| Token utilization | <70% warning | Optimize at 80% |
| Compaction | 50-70% reduction | <5% quality loss |
| Cache hit rate | >70% | Stable workloads |
| Multi-agent overhead | ~15x baseline | Plan accordingly |

---

## Degradation Patterns

| Pattern | Symptom | Fix |
|---------|---------|-----|
| **Lost-in-Middle** | Middle content ignored | Move to beginning/end |
| **Context Poisoning** | Bad examples corrupt output | Filter training data |
| **Attention Dilution** | Too much noise | Compress, select |
| **Token Exhaustion** | Truncation mid-task | Checkpoint, isolate |

---

## Compression Strategies

```markdown
## Hierarchical Summarization
1. Split content into chunks
2. Summarize each chunk
3. Combine summaries
4. Repeat if needed

## Selective Loading
1. Index all content
2. Query for relevance
3. Load only matches
4. Expand as needed

## Progressive Disclosure
1. Start with overview
2. Deep-dive on request
3. Remove after use
```

---

## Multi-Agent Patterns

| Pattern | Use Case |
|---------|----------|
| **Orchestrator** | Central coordinator delegates tasks |
| **Pipeline** | Sequential processing stages |
| **Parallel** | Independent workers merge results |
| **Hierarchical** | Nested agents for complex tasks |

---

## 📑 Content Map

| File | Description |
|------|-------------|
| `references/optimization.md` | Compression techniques |
| `references/multi-agent.md` | Architecture patterns |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Agent forgetting earlier context | Add summary checkpoints |
| Response quality degrading | Reduce context, increase signal |
| Token limit exceeded | Split into sub-agents |
| Cost too high | Cache, compress, batch |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `lifecycle-orchestrator` | Skill | Task lifecycle |
| `system-design` | Skill | Architecture patterns |

---

⚡ PikaKit v3.9.67
