---
name: vercel-deploy
description: This skill should be used when the user asks to "deploy to Vercel", "create a Vercel preview", "promote a Vercel deployment", or "debug a Vercel build". Do not use it for other platforms or general CI/CD architecture.
metadata:
  id: vercel-deploy
  schema_version: "2.0.0"
  type: knowledge
  category: delivery
  risk_tier: high
  version: "4.0.0"
  author: pikakit
  triggers: ["deploy to Vercel", "create a Vercel preview", "promote a Vercel deployment", "debug a Vercel build"]
  negative_triggers: ["deploy to another platform", "design a general CI pipeline", "configure GitOps"]
  coordinates_with: [cicd-pipeline, nextjs-pro, test-architect]
  capabilities: [vercel-readiness, preview-workflow, production-promotion, rollback-planning]
  platforms: [vercel]
  last_reviewed: "2026-09-28"
  review_interval_days: 180
---

# Vercel Deployment

Prepare and verify Vercel deployments without claiming an executable integration that is not present.

## Workflow

1. Confirm project root, framework, build command, output, runtime, regions, and environment variables.
2. Run the same locked install, build, test, and security gates used in CI.
3. Verify secrets are configured in the target environment and absent from source and build output.
4. Create a preview through the project's configured Vercel integration.
5. Exercise critical routes, functions, redirects, headers, caching, and observability on the preview.
6. Promote the exact verified deployment with explicit production authorization.
7. Monitor health and business signals; roll back through Vercel's supported deployment controls when gates fail.

## Failure Contract

Do not report success from a URL alone. Require a successful deployment state and readiness checks. Report missing credentials, integration, build output, or verification as blocked rather than silently substituting another deployment path.

Read [engineering-spec.md](rules/engineering-spec.md) for preconditions, rollback, and the exit gate.
