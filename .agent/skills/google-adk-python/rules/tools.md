---
title: Custom Tools
kind: code
impact: high
tags: [google-adk, tools, python]
applies_to: [google-adk-python]
last_reviewed: "2026-09-28"
sources:
  - title: ADK tools documentation
    url: https://google.github.io/adk-docs/tools/
---

# Custom Tools

Define tools as narrow typed functions and pass them using the mechanism supported by the pinned ADK release. Enforce security in code; descriptions guide model selection but do not authorize access.

## Incorrect

```python
def delete_customer(customer_id):
    return database.delete(customer_id)
```

This contract has no type, authorization, confirmation, timeout, idempotency, or stable result shape.

## Correct

```python
from dataclasses import asdict, dataclass

@dataclass(frozen=True)
class DeleteResult:
    customer_id: str
    deleted: bool

def delete_customer(customer_id: str, confirmation_id: str) -> dict[str, object]:
    """Delete one authorized customer after validating a one-use confirmation."""
    customer_id = customer_id.strip()
    if not customer_id:
        raise ValueError("customer_id is required")
    authorize_customer_delete(customer_id, confirmation_id)
    return asdict(DeleteResult(customer_id, database.delete_once(customer_id)))
```

Keep authorization and idempotency in trusted application code. Convert exceptions to the structured error mechanism documented for the pinned ADK release and redact diagnostics.

## Verification

Test valid, invalid, unauthorized, repeated, timeout, dependency-failure, and cancellation paths without live production data. Confirm generated tool schemas match Python annotations and that sensitive values never appear in traces.
