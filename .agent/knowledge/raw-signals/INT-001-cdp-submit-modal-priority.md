---
id: INT-001
type: gotcha
category: Integration
trigger: "User reported CDP auto-clicker clicking transcript history instead of modal Submit button"
date: 2026-09-10
---

# CDP Auto-Clicker Permission Modal Priority & Transcript Isolation

## Problem
In Antigravity IDE, when tool permission prompts appeared (e.g. `curl` status check or command permission), CDP auto-clicker did not click the blue `Submit ↵` button (`[data-testid="interaction-continue-button"]`). Instead, it clicked collapsible history rows above (e.g. `Run wrangler pages deploy finished ↲`, `Running 2 commands`).

## Root Causes
1. **Loose substring pattern matching:** `ALLOWED_CHAT_BUTTON_PATTERNS` contained `'run'`. Since it tested `text.includes('run')`, any transcript row containing "Run ..." or "... finished" matched as an action button.
2. **Top-to-bottom document scanning:** Old history entries at the top were evaluated and clicked first, returning before reaching the modal at the bottom.
3. **Modal lack of priority:** The permission prompt modal at the bottom of the chat panel wasn't given highest priority.

## Solution
1. **Priority 1 Interactive Modal:** Always check for `[data-testid="interaction-continue-button"]` (or Submit buttons inside prompt/dialog containers) first. If disabled, select Option 1 ("Yes, allow this time"), then click Submit.
2. **Hard-block transcript rows:** Reject elements with width > 350px (accordions in Antigravity have width ~1020px), text starting with `Ran `, `Running `, `Explored `, or containing `finished`, `commands`, `tabular-nums`.
3. **Strict action patterns:** `'run'` must strictly match `'run'` or `'run command'`, never loose `.includes('run')`.
4. **Bottom-up traversal:** Normal action button scans traverse from bottom (newest) to top (oldest).
