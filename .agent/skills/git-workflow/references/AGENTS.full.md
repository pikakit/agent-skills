# Git Workflow Full Agent Rules

> Deterministic compilation of 1 source rules for git-workflow v4.0.0. Do not edit directly.

## Rule Index

- [Reviewable Git Change Process](#rule-engineering-spec) (high, process, source: `rules/engineering-spec.md`)

<a id="rule-engineering-spec"></a>

## Reviewable Git Change Process

**Impact:** high
**Kind:** process
**Source:** `rules/engineering-spec.md`

# Reviewable Git Change Process

## Preconditions

Inspect repository instructions, current branch, worktree status, staged diff, remotes, hooks, and branch protections. Identify which modifications belong to the task and which belong to another user or process. Require explicit authorization for push, merge, reset, rebase, force-push, or deletion.

## Procedure

1. Partition the intended change into cohesive commits without discarding unrelated work.
2. Review staged content, filenames, generated artifacts, and binary changes.
3. Run secret detection and task-relevant validation; keep raw secret values out of logs.
4. Commit with an imperative, scoped message that describes the result.
5. Review the resulting commit and compare it with its intended base.
6. Synchronize using repository policy; resolve conflicts from understood source state.
7. Prepare the pull request with behavior, risk, test evidence, and rollback notes.

## Rollback

Before rewriting history, resolve exact refs and create a recoverable backup ref when practical. Recover local commits through reflog or a backup ref; revert published commits unless coordinated rewriting is approved. Use force-with-lease when an authorized rewrite is unavoidable.

## Exit Gate

Exit only when included paths are intentional, validation passed, no secret is detected, the diff is reviewable, and remote side effects match authorization. Treat hook, scanner, or validation failure as blocking. Report any unpushed commit or unresolved conflict explicitly.
