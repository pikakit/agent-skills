---
name: google-adk-python
description: >-
  Build, evaluate, and deploy AI agents with Google's Agent Development Kit.
  Tool integration, multi-agent orchestration, workflow automation.
  Triggers on: Google ADK, agent development, multi-agent, agent orchestration.
  Coordinates with: python-pro, api-architect.
metadata:
  version: "1.0.0"
  category: "ai"
  triggers: "Google ADK, agent development, multi-agent, agent orchestration"
  success_metrics: "agent runs, tools execute, deployment successful"
  coordinates_with: "python-pro, api-architect"
---

# Google ADK Python

> Build production-ready AI agents with tool integration and multi-agent orchestration.

---

## Prerequisites

```bash
pip install google-adk
# Set: GEMINI_API_KEY or GOOGLE_CLOUD_PROJECT + GOOGLE_CLOUD_LOCATION
```

---

## When to Use

| Situation | Reference |
|-----------|-----------| 
| Single agent with tools | This file |
| Multi-agent coordination | `references/multi-agent.md` |
| Custom tool creation | `references/tools.md` |
| Deployment patterns | `references/deployment.md` |

---

## Quick Start

```python
from google.adk.agents import LlmAgent

agent = LlmAgent(
    name="assistant",
    model="gemini-3-flash",
    instruction="You are a helpful assistant."
)
response = agent.run("Hello!")
```

---

## Agent Types

| Type | Purpose | Use Case |
|------|---------|----------|
| `LlmAgent` | LLM-powered | Unpredictable inputs |
| `SequentialAgent` | Execute in order | Pipeline processing |
| `ParallelAgent` | Run concurrently | Fan-out tasks |
| `LoopAgent` | Repeat execution | Iterative processing |

---

## Single Agent with Tools

```python
from google.adk.agents import LlmAgent
from google.adk.tools import google_search

agent = LlmAgent(
    name="search_assistant",
    model="gemini-3-flash",
    instruction="Search the web for information.",
    tools=[google_search]
)
```

---

## Multi-Agent Pattern

```python
researcher = LlmAgent(name="Researcher", tools=[google_search])
writer = LlmAgent(name="Writer")

coordinator = LlmAgent(
    name="Coordinator",
    instruction="Delegate to Researcher, then Writer.",
    sub_agents=[researcher, writer]
)
```

---

## Custom Tools

```python
from google.adk.tools import Tool

def calculate_roi(revenue: float, cost: float) -> float:
    """Calculate return on investment."""
    return ((revenue - cost) / cost) * 100

roi_tool = Tool.from_function(calculate_roi)
```

---

## Model Selection

| Model | Use Case |
|-------|----------|
| `gemini-3-flash` | Fast, cost-effective |
| `gemini-3-pro-low` | Balanced reasoning |
| `gemini-3-pro-high` | Complex reasoning |

---

## Best Practices

| Practice | Application |
|----------|-------------|
| **Code-first** | Define in Python for version control |
| **Modular** | Specialized agents, compose larger |
| **Start simple** | Single agent → multi-agent |
| **Test agents** | Validate outputs, measure performance |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `ModuleNotFoundError` | `pip install google-adk` |
| API key not found | Set `GEMINI_API_KEY` env var |
| Tool not called | Verify function signature |

---

## 📑 Content Map

| File | When to Read |
|------|--------------|
| `references/multi-agent.md` | Multi-agent systems |
| `references/tools.md` | Tool integration |
| `references/deployment.md` | Production deploy |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `python-pro` | Skill | Python patterns |
| `api-architect` | Skill | API design |

---

⚡ PikaKit v3.9.67
