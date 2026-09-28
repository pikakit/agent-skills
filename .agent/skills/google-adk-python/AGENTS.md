# Google Adk Python Agent Rules

> Generated from 4 source rules for google-adk-python v3.9.224. Do not edit directly.

## Mandatory Rules

| Impact | Kind | Rule | Requirement |
|---|---|---|---|
| high | process | [Deployment Patterns](references/AGENTS.full.md#rule-deployment) | - Pin the ADK, Python, and model configuration tested in staging. |
| high | process | [Google ADK Release Gate](references/AGENTS.full.md#rule-engineering-spec) | - Pin a supported Python and ADK version and verify every imported API against that version. |
| high | decision | [Multi-Agent Orchestration](references/AGENTS.full.md#rule-multi-agent) | Start with one agent and deterministic tools. Add workflow or specialist agents only when a measured requirement needs explicit sequencing, safe parallelism, bounded iteration, or responsibility isola |
| high | code | [Custom Tools](references/AGENTS.full.md#rule-tools) | Define tools as narrow typed functions and pass them using the mechanism supported by the pinned ADK release. Enforce security in code; descriptions guide model selection but do not authorize access. |

## Use

Apply every relevant rule. Open the linked full rule before implementation, review, or release decisions.
