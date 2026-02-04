---
name: google-adk-python
description: >-
  Build, evaluate, and deploy AI agents with Google's Agent Development Kit.
  Tool integration, multi-agent orchestration, workflow automation.
  Triggers on: Google ADK, agent development, multi-agent, agent orchestration.
  Coordinates with: python-pro, api-architect.
allowed-tools: Read, Write, Edit, Glob, Grep, Terminal
metadata:
  version: "1.0.0"
  category: "ai"
  triggers: "Google ADK, agent development, multi-agent, agent orchestration, workflow automation"
  success_metrics: "agent runs, tools execute, deployment successful"
  coordinates_with: "python-pro, api-architect"
---

# Google ADK Python

> Build production-ready AI agents with tool integration and multi-agent orchestration.

---

## Prerequisites

**Installation:**
```bash
pip install google-adk
```

**API Access (choose one):**
- Google AI Studio: Get key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
- Vertex AI: Google Cloud project with Vertex AI enabled

**Environment Variables:**
```bash
# Option 1: Google AI Studio
GEMINI_API_KEY=your_api_key

# Option 2: Vertex AI
GOOGLE_CLOUD_PROJECT=your_project
GOOGLE_CLOUD_LOCATION=us-central1
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
| `LlmAgent` | LLM-powered, dynamic | Unpredictable inputs |
| `SequentialAgent` | Execute in order | Pipeline processing |
| `ParallelAgent` | Run concurrently | Fan-out tasks |
| `LoopAgent` | Repeat execution | Iterative processing |

---

## Single Agent Pattern

```python
from google.adk.agents import LlmAgent
from google.adk.tools import google_search

agent = LlmAgent(
    name="search_assistant",
    model="gemini-3-flash",
    instruction="Search the web for information.",
    tools=[google_search]
)

response = agent.run("What are the latest AI trends?")
```

---

## Multi-Agent Pattern

```python
# Specialized agents
researcher = LlmAgent(
    name="Researcher",
    model="gemini-3-flash",
    instruction="Research topics using web search.",
    tools=[google_search]
)

writer = LlmAgent(
    name="Writer",
    model="gemini-3-flash",
    instruction="Write content based on research."
)

# Coordinator delegates
coordinator = LlmAgent(
    name="Coordinator",
    model="gemini-3-flash",
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

agent = LlmAgent(
    name="analyst",
    tools=[roi_tool]
)
```

---

## Model Selection

| Model | Use Case |
|-------|----------|
| `gemini-3-flash` | Fast, cost-effective |
| `gemini-3-pro-low` | Balanced reasoning |
| `gemini-3-pro-high` | Complex, high-quality reasoning |

---

## Best Practices

| Practice | Application |
|----------|-------------|
| **Code-first** | Define in Python for version control |
| **Modular** | Specialized agents, compose larger |
| **Start simple** | Single agent → multi-agent |
| **Test agents** | Validate outputs, measure performance |
| **Safety** | Tool confirmation for sensitive ops |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Vague instructions | Explicit, clear instructions |
| Skip testing | Write tests for agents |
| Ignore errors | Handle failures gracefully |
| Overcomplicate | Start simple, add complexity |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| `references/multi-agent.md` | Coordination patterns | Multi-agent systems |
| `references/tools.md` | Custom tool creation | Tool integration |
| `references/deployment.md` | Cloud Run, Vertex AI | Production deploy |

---

## Resources

- GitHub: https://github.com/google/adk-python
- Docs: https://google.github.io/adk-docs/
- llms.txt: https://raw.githubusercontent.com/google/adk-python/refs/heads/main/llms.txt

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `ModuleNotFoundError: google.adk` | Run `pip install google-adk` |
| API key not found | Set `GEMINI_API_KEY` env var |
| Agent timeout | Check network, increase timeout in agent config |
| Tool not called | Verify tool function signature matches schema |
| Multi-agent handoff fails | Ensure sub_agents list is correctly configured |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `python-pro` | Skill | Python patterns |
| `api-architect` | Skill | API design |
| `ai-artist` | Skill | Prompt engineering |

---

⚡ PikaKit v3.2.0
