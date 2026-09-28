# Security Scanner Agent Rules

> Generated from 3 source rules for security-scanner v4.0.0. Do not edit directly.

## Mandatory Rules

| Impact | Kind | Rule | Requirement |
|---|---|---|---|
| critical | reference | [Authentication Security Review](references/AGENTS.full.md#rule-auth-patterns) | Review implemented password storage, authentication, sessions, tokens, MFA, authorization, recovery, and abuse controls. Route architecture design to `auth-patterns`; keep this rule focused on verific |
| critical | reference | [Application Security Review Checklist](references/AGENTS.full.md#rule-checklists) | Copy relevant checklists into PLAN.md or a security report. Use the bundled knowledge/source secret scanner for automated secret detection. |
| critical | process | [Fail-Closed Security Review Process](references/AGENTS.full.md#rule-engineering-spec) | Define the target revision, assets, trust boundaries, data classification, deployment context, applicable verification level, and authorized tools. Record tool versions and confirm secrets can be reda |

## Use

Apply every relevant rule. Open the linked full rule before implementation, review, or release decisions.
