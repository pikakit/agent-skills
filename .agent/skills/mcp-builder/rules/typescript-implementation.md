---
title: TypeScript MCP Tool Contract
kind: code
impact: high
tags: [mcp, typescript, implementation]
applies_to: [mcp-builder]
last_reviewed: "2026-09-28"
sources:
  - title: MCP build server guide
    url: https://modelcontextprotocol.io/docs/develop/build-server
---

# TypeScript MCP Tool Contract

Pin the official TypeScript SDK and schema dependency. Keep protocol registration thin and test domain behavior independently.

## Incorrect

```typescript
async function run(command: string) {
  return exec(command);
}
```

This exposes a shell, loses argument boundaries, has no authorization or timeout, and returns unbounded process output.

## Correct

```typescript
const ALLOWED_REPORTS = new Set(["daily", "weekly"] as const);

async function readReport(name: string, signal: AbortSignal): Promise<string> {
  if (!ALLOWED_REPORTS.has(name as "daily" | "weekly")) {
    throw new Error("unsupported report");
  }
  const result = await reportStore.read(name, { signal });
  if (result.length > 100_000) throw new Error("report exceeds output limit");
  return result;
}
```

Register this function through the pinned SDK with a strict input schema. Avoid double casts in production code; the narrow cast above is local to the runtime membership check and can be replaced by a schema parser.

## Verification

Compile with strict TypeScript, validate schema inference, and test invalid names, denial, timeout, cancellation, dependency failure, and output boundaries. Exercise initialization and invocation with protocol fixtures.
