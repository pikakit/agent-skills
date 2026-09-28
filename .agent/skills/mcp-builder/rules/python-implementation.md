---
title: Python MCP Tool Contract
kind: code
impact: high
tags: [mcp, python, implementation]
applies_to: [mcp-builder]
last_reviewed: "2026-09-28"
sources:
  - title: MCP build server guide
    url: https://modelcontextprotocol.io/docs/develop/build-server
---

# Python MCP Tool Contract

Pin the official Python SDK and verify imports against its build-server guide. Keep business logic independent from protocol registration so it can be tested without a transport.

## Incorrect

```python
@mcp.tool()
def read_any_file(path: str) -> str:
    return open(path).read()
```

This accepts arbitrary paths, performs unbounded blocking I/O, leaks raw errors, and has no output limit.

## Correct

```python
from pathlib import Path

ROOT = Path("workspace").resolve()

def read_project_text(relative_path: str) -> str:
    """Read a bounded UTF-8 text file inside the configured workspace."""
    target = (ROOT / relative_path).resolve()
    if target == ROOT or ROOT not in target.parents:
        raise ValueError("path must resolve inside the workspace")
    data = target.read_text(encoding="utf-8")
    if len(data) > 100_000:
        raise ValueError("file exceeds the response limit")
    return data
```

Register the tested function with the pinned SDK and convert failures to structured, redacted tool results at the protocol boundary.

## Verification

Test traversal, symlinks, missing and unreadable files, invalid UTF-8, size boundaries, cancellation, and concurrent calls. Run the SDK protocol fixtures over the selected transport.
