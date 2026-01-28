# Changelog

All notable changes to the Agent Skill Kit will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.2.0] - 2026-01-28

### 🚀 Major Migration: Python → JavaScript

- **BREAKING**: All master scripts migrated from Python to JavaScript
  - `checklist.js`, `verify_all.js`, `auto_preview.js`, `session_manager.js`
  - Zero Python dependency for core validation scripts
  - ~10% performance improvement
  - Better cross-platform support (especially Windows)

### ✨ Studio Improvements

- **P1: UTC Timestamps & CSS Validation**
  - Added UTC timestamp handling for consistent time tracking
  - Integrated `css-tree` for robust CSS validation
  - 24 unit tests + 12 validator tests

- **P2: Integration Tests**
  - Added comprehensive integration tests with real search data
  - 15 new integration tests for end-to-end workflows

- **P3: Search Results Caching**
  - Implemented LRU cache with TTL for search optimization
  - Significant performance boost for repeated searches
  - 17 cache-specific tests

- **P4: TypeScript Type Definitions**
  - Added comprehensive `.d.ts` type definitions
  - Configured `jsconfig.json` for IDE support
  - Incremental type safety without full TS migration

- **P5: Custom Page Patterns**
  - Added configurable page pattern detection
  - Support for custom page type configurations
  - 18 configuration tests

### 📦 Package & Build

- Updated CLI package to use local source (`file:packages/cli`)
- Removed all Python files from active codebase (7 legacy files)
- Archive: Legacy Python scripts moved to `scripts-legacy/`
- **Architecture Decision:** Python skill scripts (34 scripts) remain for specialized validation
  - 2-tier hybrid: JavaScript master scripts + Python skill tools
  - See [PYTHON_STRATEGY.md](PYTHON_STRATEGY.md) for rationale
- **Refactoring:** Renamed `.agent/.shared/studio` to `.agent/studio` for consistency
  - Updated 16 files (tests, configs, documentation)
  - All 143 studio tests passing

### 📝 Documentation

- Updated all documentation to reference JavaScript scripts
- Added `MIGRATION.md` with Python → JS transition guide
- Modernized `PYTHON_SCRIPTS.md` to focus on skill-level tools only
- Removed obsolete `REBRAND.md` and `REBRAND_CLI.md`

### 🧪 Testing

- **143/143 tests passing** across all modules
- Added Studio-specific test suite (10 test files)
- Integration tests with real-world data

### 🔧 Configuration

- Upgraded `.gitignore` to 2025 standards (CRITICAL: fixed dangerous 'tests' ignore)
- Upgraded `.editorconfig` to modern JS/TS standards (2-space indent)
- Upgraded `.agentignore` with comprehensive 2025 patterns

---

## [2.1.0] - Unreleased

### Added

- **Intelligent Agent Routing**: Automatic agent selection system
  - New `intelligent-routing` skill
  - Transparent agent selection with user notification
  - Maintains compatibility with explicit mentions
  - Comprehensive documentation

### Changed

- Enhanced GEMINI.md with intelligent routing workflow
- Updated agent orchestration for seamless automatic routing

---

## [1.0.0] - Initial Release

### Features

- 20 specialized AI agents
- 49 domain-specific skills
- 14 workflow slash commands
- CLI tool (`agentskillskit-cli`)
- Comprehensive documentation

---

[3.2.0]: https://github.com/agentskillkit/agent-skills/compare/v2.1.0...v3.2.0
[2.1.0]: https://github.com/agentskillkit/agent-skills/compare/v1.0.0...v2.1.0
[1.0.0]: https://github.com/agentskillkit/agent-skills/releases/tag/v1.0.0
