# Skill Integration Plan

## 1. Goal
Integrate remaining valuable skills from CoinPika legacy folders into the new `agentskillskit` architecture.

## 2. Skills to Migrate

### A. `git-conventions` (from `coinpika-commit-formatter`)
- **Structure**:
  - `SKILL.md` -> Standardize
  - `scripts/commit_msg.py` -> Move to `scripts/` (python) or rewrite in Node (optional, but Python is fine if user has it).
  - **Purpose**: Enforce Conventional Commits.

### B. `code-reviewer` (from `coinpika-pr-reviewer`)
- **Structure**:
  - `SKILL.md` -> Standardize
  - `scripts/review.js` -> Move to `scripts/`.
  - **Purpose**: Automated PR quality checks.

## 3. Execution Steps
1. Create `.agent/skills/git-conventions` and `.agent/skills/code-reviewer`.
2. Copy source files.
3. Refactor `SKILL.md` to remove "CoinPika" branding and match new standard.
4. Ensure scripts are executable via `npx my-agent-skills` or directly.

## 4. Verification
- Verify `git-conventions` by simulating a bad commit message.
- Verify `code-reviewer` by running it on the current codebase.
