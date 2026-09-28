# Google Adk Python Full Agent Rules

> Deterministic compilation of 4 source rules for google-adk-python v3.9.224. Do not edit directly.

## Rule Index

- [Deployment Patterns](#rule-deployment) (high, process, source: `rules/deployment.md`)
- [Google ADK Release Gate](#rule-engineering-spec) (high, process, source: `rules/engineering-spec.md`)
- [Multi-Agent Orchestration](#rule-multi-agent) (high, decision, source: `rules/multi-agent.md`)
- [Custom Tools](#rule-tools) (high, code, source: `rules/tools.md`)

<a id="rule-deployment"></a>

## Deployment Patterns

**Impact:** high
**Kind:** process
**Source:** `rules/deployment.md`

# Deployment Patterns

## Preconditions

- Pin the ADK, Python, and model configuration tested in staging.
- Choose a currently documented ADK deployment target from security, latency, data residency, scaling, and operational requirements.
- Store credentials in the platform secret manager and define service identity with least privilege.
- Establish health, readiness, telemetry, evaluation, and cost baselines.

## Procedure

1. Build an immutable artifact with locked dependencies and provenance.
2. Validate configuration without making a model call in the liveness check.
3. Use readiness to verify required local dependencies; keep expensive downstream probes out of high-frequency checks.
4. Bound request size, session lifetime, tool timeouts, concurrency, and retries.
5. Redact prompts, tool arguments, credentials, and personal data from telemetry.
6. Deploy to a non-production environment and run offline evaluation plus controlled integration tests.
7. Shift production traffic gradually while comparing quality, errors, latency, saturation, and cost.

Do not copy deployment snippets across ADK versions without verifying them against the pinned official documentation.

## Rollback

Retain the previous artifact and compatible session/state schema. Route traffic back or disable the new tool/model configuration when any release budget regresses.

## Exit Gate

Pass only when the official target supports the pinned version, identity and secrets are externalized, readiness is meaningful, evaluation passes, telemetry is redacted, and rollback is exercised.

<a id="rule-engineering-spec"></a>

## Google ADK Release Gate

**Impact:** high
**Kind:** process
**Source:** `rules/engineering-spec.md`

# Google ADK Release Gate

## Preconditions

- Pin a supported Python and ADK version and verify every imported API against that version.
- Define the agent objective, termination condition, tool permissions, and data boundary.
- Configure credentials through the target platform's secret facility.

## Procedure

1. Choose the simplest agent or workflow primitive that expresses the control flow.
2. Give each tool a typed schema, narrow responsibility, timeout, and explicit error contract.
3. Enforce authorization in the tool implementation, not in natural-language instructions alone.
4. Bound loops, retries, concurrency, output size, and external calls.
5. Emit redacted traces for model calls, tool calls, delegation, latency, and failures.
6. Test normal, invalid, denied, timeout, partial-failure, and termination paths with controlled fixtures.
7. Deploy gradually and compare failure, latency, quality, and cost signals to the baseline.

## Rollback

Retain the previous deployable artifact and compatible state. Disable new tools or route traffic back when error, safety, cost, or latency budgets regress.

## Exit Gate

Pass only when official examples match the pinned API, tests cover permission and termination failures, secrets are externalized, telemetry is redacted, and rollback is exercised.

<a id="rule-multi-agent"></a>

## Multi-Agent Orchestration

**Impact:** high
**Kind:** decision
**Source:** `rules/multi-agent.md`

# Multi-Agent Orchestration

## Decision

Start with one agent and deterministic tools. Add workflow or specialist agents only when a measured requirement needs explicit sequencing, safe parallelism, bounded iteration, or responsibility isolation.

## Use When

- Use a sequential workflow when each stage consumes a validated predecessor result.
- Use parallel composition when branches are independent, resource limits are explicit, and merge behavior is deterministic.
- Use a loop only with a programmatic termination condition and hard iteration limit.
- Use specialist delegation when permissions or context ownership differ materially.

## Avoid When

- Avoid multiple agents to simulate roles that share the same context, permissions, and tools.
- Avoid natural-language-only routing for sensitive authorization decisions.
- Avoid parallel writes to shared state without conflict handling.
- Avoid loops whose only exit is a subjective model judgment.

## Trade-offs

Composition can improve isolation and latency, but increases model calls, cost, nondeterminism, state transfer, tracing complexity, and partial-failure handling. Prefer deterministic workflow primitives when routing is known in advance.

## Verification

Test routing, state transfer, branch failure, timeout, cancellation, merge conflicts, termination, and permission denial. Trace every delegation with redacted inputs and stable correlation identifiers.

<a id="rule-tools"></a>

## Custom Tools

**Impact:** high
**Kind:** code
**Source:** `rules/tools.md`

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
