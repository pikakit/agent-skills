# Vercel Deploy Full Agent Rules

> Deterministic compilation of 1 source rules for vercel-deploy v4.0.0. Do not edit directly.

## Rule Index

- [Verified Vercel Release Process](#rule-engineering-spec) (high, process, source: `rules/engineering-spec.md`)

<a id="rule-engineering-spec"></a>

## Verified Vercel Release Process

**Impact:** high
**Kind:** process
**Source:** `rules/engineering-spec.md`

# Verified Vercel Release Process

## Preconditions

Confirm the project owner, project root, framework, locked install command, build command, output, runtime, regions, environment-variable ownership, deployment integration, target environment, and production approver. Require passing repository checks and a known-good deployment for rollback.

## Procedure

1. Build and test locally or in CI with the target runtime and locked dependencies.
2. Verify sensitive values are configured in Vercel and absent from source and build output.
3. Create a preview using the project's configured Vercel CLI, Git, or API integration.
4. Wait for Vercel to report a successful deployment; do not infer readiness from URL creation.
5. Test critical routes, functions, redirects, headers, cache behavior, and telemetry.
6. Promote the exact verified deployment after explicit production authorization.
7. Monitor errors, latency, function health, and business checks through the release window.

## Rollback

Use Vercel's supported rollback or instant rollback to restore a known-good production deployment. Keep data and API changes backward compatible with the rollback target. After rollback, verify domains, routes, functions, caches, and environment configuration; preserve redacted deployment evidence.

## Exit Gate

Pass only when build and deployment states are successful, readiness checks pass on the assigned domain, the promoted deployment identity matches the previewed artifact, observability is available, and rollback is ready. Report missing integration, credentials, or verification as blocked.
