# Plan: Rebrand to Agent Skills Kit (Private License)

> **Goal:** Rename entire project to "Agent Skills Kit", update domain to `agentskillskit.com`, and enforce a strict proprietary license.

## 📋 Overview

The project is undergoing a major rebranding and licensing shift. All public branding (Antigravity Kit, My Agent Skills) will be replaced with **Agent Skills Kit**. The open-source MIT license will be replaced with a **Proprietary Commercial License** to position the product as a premium "Big Tech" solution.

## 🏗️ Project Type

**TYPE: CLI / BACKEND Tooling**
- Primary Agent: `backend-specialist` (handling CLI logic and file updates)
- Secondary: `product-owner` (branding enforcement)

## ✅ Success Criteria

1.  **Project Name**: All references to "Antigravity Kit" / "My Agent Skills" replaced with "**Agent Skills Kit**".
2.  **Website**: All URLs point to `agentskillskit.com`.
3.  **License**: `LICENSE.md` contains strict proprietary terms (No redistribution, commercial use only).
4.  **Verification**: CLI output displays new branding.

## 🛠️ Tech Stack

-   **Runtime**: Node.js (CLI), Python (Scripts)
-   **Package Manager**: npm/pnpm
-   **License Model**: Proprietary (Closed Source)

## 📂 File Structure (Impacted Files)

```plaintext
agentskillskit/
├── LICENSE              <-- [REPLACE] With Proprietary License
├── package.json         <-- [UPDATE] Name, description, URL, license
├── README.md            <-- [UPDATE] Branding, badges, links
├── .agent/
│   ├── ARCHITECTURE.md  <-- [UPDATE] Project name
│   └── GEMINI.md        <-- [UPDATE] Project name
└── packages/cli/        <-- [UPDATE] Internal strings
```

## 📝 Task Breakdown

### Phase 1: Foundation (License & Meta)

- [ ] **Create Proprietary License** `task_id: license_update`
    -   **Agent**: `product-owner`
    -   **Input**: "Big Tech" Private License text
    -   **Output**: updated `LICENSE` file
    -   **Verify**: Read file content matches proprietary terms.

- [ ] **Update Package Metadata** `task_id: pkg_json_update`
    -   **Agent**: `backend-specialist`
    -   **File**: `package.json`, `packages/cli/package.json`
    -   **Action**: Change name to `agent-skills-kit`, license to `UNLICENSED` (or private), homepage to `agentskillskit.com`.
    -   **Verify**: `npm install` warns about private license (expected).

### Phase 2: Branding Find & Replace

- [ ] **Update Documentation Branding** `task_id: docs_rebrand`
    -   **Agent**: `documentation-writer`
    -   **Files**: `README.md`, `ARCHITECTURE.md`, `GEMINI.md`
    -   **Action**: Replace "Antigravity Kit", "My Agent Skills" -> "Agent Skills Kit".
    -   **Verify**: `grep` returns 0 matches for old names.

- [ ] **Update Code Strings** `task_id: code_rebrand`
    -   **Agent**: `backend-specialist`
    -   **Files**: `packages/cli/bin/*.js`, `packages/cli/lib/*.js`
    -   **Action**: Update CLI welcome messages and error/help text.
    -   **Verify**: Run `ag-smart --help` shows "Agent Skills Kit".

### Phase 3: Domain Update

- [ ] **Update URLs** `task_id: url_update`
    -   **Agent**: `backend-specialist`
    -   **Action**: Replace `antigravity-kit.com` / `agentskillskit.com` (if any) -> `https://agentskillskit.com`.
    -   **Verify**: Check links in `README.md` work (or point to new domain).

## 🧪 Phase X: Verification

### 1. Branding Check
```bash
# Must return NO results
grep -r "Antigravity" .
grep -r "My Agent Skills" .
```

### 2. License Check
```bash
# Must show Proprietary terms
cat LICENSE
# Must NOT show MIT
```

### 3. CLI Check
```bash
# Run the CLI
node packages/cli/bin/ag-smart.js --version
# Expect: "Agent Skills Kit v..."
```

## ✅ PHASE X COMPLETE
- [ ] License is Private
- [ ] Name is Agent Skills Kit
- [ ] Domain is agentskillskit.com
