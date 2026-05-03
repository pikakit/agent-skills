# Workflow Patterns

> Part of `knowledge-compiler` - Contains agent workflow patterns

---

## 📋 Learned Patterns

### [FLOW-001] Workflow Protocol Bypass
**Error:** Agent modified files directly when invoked with `/think`.
**Context:** User called `@[/think]` to ask about a specific technical bug.
**Root Cause:** Agent saw an easy fix for a previous regression and immediately fixed it, violating the "NO CODE, NO PLANS" mandate of the `/think` workflow.
**Solution:** Always respect the Socratic Gate. `/think` is for generating options and decision matrices. If a bug is obvious, still follow the workflow by generating 3 options to fix it (e.g., Option A: Fix CSS, Option B: Use external library) and let the user decide.

---

## Quick Fixes

| Error | Fix |
|-------|-----|
| `/plan` outputs code | Stop and remind agent that `/plan` only writes PLAN.md |
| `/think` writes code | Revert and generate decision matrix instead |

---

## Statistics

- **Patterns:** 1
- **Category:** workflow
- **Last Updated:** 2026-05-04

---

⚡ PikaKit v3.9.166
