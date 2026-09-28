# Mcp Builder Agent Rules

> Generated from 7 source rules for mcp-builder v3.9.224. Do not edit directly.

## Mandatory Rules

| Impact | Kind | Rule | Requirement |
|---|---|---|---|
| high | decision | [MCP Capability Design](references/AGENTS.full.md#rule-best-practices) | Expose the smallest protocol capability that lets a client complete one coherent task. Use tools for actions or computed retrieval, resources for application-controlled context, and prompts for user-i |
| high | decision | [MCP Server Boundary Selection](references/AGENTS.full.md#rule-design-principles) | Place a server boundary around one security and operational domain. Select stdio for local process-managed integrations and Streamable HTTP for supported remote deployments requiring independent lifec |
| high | process | [MCP Server Release Gate](references/AGENTS.full.md#rule-engineering-spec) | - Pin the MCP specification revision and official SDK version. |
| high | process | [MCP Evaluation Procedure](references/AGENTS.full.md#rule-evaluation) | - Freeze server, client, SDK, and protocol versions. |
| high | code | [Python MCP Tool Contract](references/AGENTS.full.md#rule-python-implementation) | Pin the official Python SDK and verify imports against its build-server guide. Keep business logic independent from protocol registration so it can be tested without a transport. |
| high | process | [MCP Server Bootstrap](references/AGENTS.full.md#rule-quickstart) | - Select an official SDK supported by the target client and runtime. |
| high | code | [TypeScript MCP Tool Contract](references/AGENTS.full.md#rule-typescript-implementation) | Pin the official TypeScript SDK and schema dependency. Keep protocol registration thin and test domain behavior independently. |

## Use

Apply every relevant rule. Open the linked full rule before implementation, review, or release decisions.
