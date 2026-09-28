# Mcp Builder Full Agent Rules

> Deterministic compilation of 7 source rules for mcp-builder v3.9.224. Do not edit directly.

## Rule Index

- [MCP Capability Design](#rule-best-practices) (high, decision, source: `rules/best-practices.md`)
- [MCP Server Boundary Selection](#rule-design-principles) (high, decision, source: `rules/design-principles.md`)
- [MCP Server Release Gate](#rule-engineering-spec) (high, process, source: `rules/engineering-spec.md`)
- [MCP Evaluation Procedure](#rule-evaluation) (high, process, source: `rules/evaluation.md`)
- [Python MCP Tool Contract](#rule-python-implementation) (high, code, source: `rules/python-implementation.md`)
- [MCP Server Bootstrap](#rule-quickstart) (high, process, source: `rules/quickstart.md`)
- [TypeScript MCP Tool Contract](#rule-typescript-implementation) (high, code, source: `rules/typescript-implementation.md`)

<a id="rule-best-practices"></a>

## MCP Capability Design

**Impact:** high
**Kind:** decision
**Source:** `rules/best-practices.md`

# MCP Capability Design

## Decision

Expose the smallest protocol capability that lets a client complete one coherent task. Use tools for actions or computed retrieval, resources for application-controlled context, and prompts for user-invoked templates.

## Use When

- Use a tool when arguments, authorization, side effects, and errors need a callable contract.
- Use a resource when clients should read addressable application data.
- Use a prompt when a user intentionally selects a reusable interaction template.
- Add pagination or bounded summaries when results can grow without limit.

## Avoid When

- Avoid wrapping every upstream endpoint one-for-one.
- Avoid ambiguous tools that switch behavior from free-form instructions.
- Avoid returning entire databases, logs, or binary payloads as text.
- Avoid relying on descriptions for authorization or confirmation.

## Trade-offs

Coarse tools reduce orchestration calls but widen permissions and output. Fine-grained tools improve control but increase discovery and sequencing. Prefer task coherence with explicit input, output, and side-effect boundaries.

## Verification

Have an unfamiliar client select and call the capability from its schema alone. Test malformed input, denial, timeout, cancellation, pagination, empty results, and output-size limits.

<a id="rule-design-principles"></a>

## MCP Server Boundary Selection

**Impact:** high
**Kind:** decision
**Source:** `rules/design-principles.md`

# MCP Server Boundary Selection

## Decision

Place a server boundary around one security and operational domain. Select stdio for local process-managed integrations and Streamable HTTP for supported remote deployments requiring independent lifecycle and authentication.

## Use When

- Group capabilities that share ownership, credentials, data classification, and release lifecycle.
- Split servers when privilege, tenant, failure, or deployment boundaries differ.
- Negotiate only capabilities implemented and tested by the server.

## Avoid When

- Avoid a universal server with unrelated credentials and blast radius.
- Avoid exposing internal infrastructure details in names or errors.
- Avoid deprecated transport examples or SDK APIs copied without a pinned version.
- Avoid network exposure without authentication, origin validation, rate limits, and transport security.

## Trade-offs

Fewer servers simplify configuration but increase privilege and failure coupling. More servers improve isolation but add discovery, deployment, and observability overhead.

## Verification

Review the boundary against threat model, ownership, credential scope, failure isolation, transport requirements, and compatibility tests for the pinned specification revision.

<a id="rule-engineering-spec"></a>

## MCP Server Release Gate

**Impact:** high
**Kind:** process
**Source:** `rules/engineering-spec.md`

# MCP Server Release Gate

## Preconditions

- Pin the MCP specification revision and official SDK version.
- Identify clients, transport, trust boundary, credentials, and expected side effects.
- Define capability ownership and compatibility requirements.

## Procedure

1. Model workflows as the smallest necessary tools, resources, or prompts.
2. Use precise input/output schemas, descriptions, and explicit read-only or destructive semantics.
3. Validate all input server-side and enforce authorization at the protected resource.
4. Bound runtime, output, pagination, retries, and concurrency; support cancellation where the SDK permits it.
5. Return protocol-conformant, actionable, redacted errors.
6. Test initialization, negotiation, discovery, invocation, malformed input, denial, timeout, and disconnect behavior.
7. Evaluate representative client tasks without coupling assertions to one model's prose.

## Rollback

Keep the previous compatible server artifact and configuration. Withdraw the new capability or restore the prior version if clients cannot negotiate or safety and reliability checks regress.

## Exit Gate

Pass when protocol fixtures and task evaluations succeed, schemas match runtime behavior, side effects require appropriate consent, logs contain no secrets, and rollback is verified.

<a id="rule-evaluation"></a>

## MCP Evaluation Procedure

**Impact:** high
**Kind:** process
**Source:** `rules/evaluation.md`

# MCP Evaluation Procedure

## Preconditions

- Freeze server, client, SDK, and protocol versions.
- Define representative tasks, expected evidence, permitted effects, and pass criteria.
- Prepare isolated deterministic fixtures and reset logic.

## Procedure

1. Test lifecycle and discovery independently from model behavior.
2. Test every schema with valid, boundary, malformed, and unauthorized inputs.
3. Evaluate representative client tasks that require capability selection and result interpretation.
4. Include empty, pagination, timeout, cancellation, dependency-failure, and oversized-output cases.
5. Score task completion, correctness, safety, calls, latency, and output volume separately.
6. Repeat nondeterministic evaluations enough to expose variance and retain raw redacted traces.

## Rollback

Reset fixtures after each case and restore the last released server/configuration when a regression appears. Do not reuse mutated state across comparisons.

## Exit Gate

Pass only when protocol tests are deterministic, all safety cases fail closed, representative tasks meet documented thresholds, and results identify the exact server and client versions.

<a id="rule-python-implementation"></a>

## Python MCP Tool Contract

**Impact:** high
**Kind:** code
**Source:** `rules/python-implementation.md`

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

<a id="rule-quickstart"></a>

## MCP Server Bootstrap

**Impact:** high
**Kind:** process
**Source:** `rules/quickstart.md`

# MCP Server Bootstrap

## Preconditions

- Select an official SDK supported by the target client and runtime.
- Pin the SDK, runtime, and protocol revision.
- Define one read-only capability and an isolated fixture for the first vertical slice.

## Procedure

1. Initialize the project using the pinned runtime's package manager.
2. Follow the current official SDK guide for server and transport construction.
3. Implement business logic as a separately testable function.
4. Register one capability with a precise schema and bounded output.
5. Keep stdio stdout protocol-only or secure the documented remote transport.
6. Add lifecycle, schema, error, cancellation, and client integration tests.
7. Add authentication and write capabilities only after the read-only slice passes.

## Rollback

Remove the new capability registration and dependency changes or restore the previous lockfile and server artifact. Delete generated test state only inside the isolated fixture root.

## Exit Gate

Pass when a supported client initializes, discovers, calls, cancels, and closes the server; invalid input fails safely; diagnostics are redacted; and no undocumented command or API is required.

<a id="rule-typescript-implementation"></a>

## TypeScript MCP Tool Contract

**Impact:** high
**Kind:** code
**Source:** `rules/typescript-implementation.md`

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
