---
name: debugging
description: Advanced debugging frameworks including defense-in-depth validation, root-cause tracing, and verification protocols. Use when debugging complex issues, validating at multiple layers, or ensuring completion claims.
when_to_use: when debugging, need systematic root cause analysis, or before claiming task completion
version: 1.0.0
---

# Debugging Skills

Advanced debugging frameworks for systematic problem investigation and resolution.

## Available Sub-Skills

### Defense in Depth
**Location:** `defense-in-depth/SKILL.md`

Validate at every layer data passes through. Make bugs structurally impossible with entry validation, business logic checks, environment guards, and debug logging.

### Root Cause Tracing
**Location:** `root-cause-tracing/SKILL.md`

Trace bugs backward through the call stack to find original triggers. Fix at the source, not the symptom. Includes polluter detection scripts.

### Verification Before Completion
**Location:** `verification-before-completion/SKILL.md`

Run verification commands and confirm output before claiming success. Evidence before claims, always. Prevents false completion claims.

## When to Use

| Situation | Use This |
|-----------|----------|
| **Data validation needed** | defense-in-depth |
| **Bug keeps reappearing** | root-cause-tracing |
| **Before claiming done** | verification-before-completion |
| **Complex multi-layer issue** | All three in sequence |

## Core Philosophy

> "Never jump to solutions. Investigate first, fix at source."

These frameworks ensure systematic debugging rather than trial-and-error patching.
