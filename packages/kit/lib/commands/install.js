/**
 * @fileoverview Install command - Interactive skill installation
 */

import fs from "fs";
import path from "path";
import os from "os";
import { exec } from "child_process";
import util from "util";
const execAsync = util.promisify(exec);
import boxen from "boxen";
import { parseSkillSpec, merkleHash } from "../helpers.js";
import { parseSkillMdFrontmatter } from "../skills.js";
import { step, activeStep, stepLine, S, c, fatal, spinner, multiselect, select, confirm, isCancel, cancel } from "../ui.js";
import { WORKSPACE, GLOBAL_DIR, OFFLINE, GLOBAL } from "../config.js";
import { installSkill } from "../installer.js";

/**
 * Install skills from repository
 * @param {string} spec - Skill spec (org/repo or org/repo#skill)
 */
export async function run(spec) {
    if (!spec) {
        fatal("Missing skill spec. Usage: add-skill <org/repo>");
        return;
    }

    const { org, repo, skill: singleSkill, ref } = parseSkillSpec(spec);

    if (!org || !repo) {
        fatal("Invalid spec. Format: org/repo or org/repo#skill");
        return;
    }

    // Check offline mode
    if (OFFLINE) {
        stepLine();
        step(c.yellow("Offline mode enabled"), S.diamond, "yellow");
        step(c.dim("Cannot install from remote repository in offline mode"), S.branch, "gray");
        step(c.dim("Use --locked to install from lockfile instead"), S.branch, "gray");
        return;
    }

    const url = `https://github.com/${org}/${repo}.git`;

    stepLine();
    step("Source: " + c.cyan(url));

    const s = spinner();
    s.start("Cloning repository");

    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "add-skill-"));

    // Retry logic with exponential backoff
    const MAX_RETRIES = 3;
    let lastError = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            await execAsync(`git clone --depth=1 ${url} "${tmp}"`, { timeout: 60000 });
            if (ref) await execAsync(`git -C "${tmp}" checkout ${ref}`, { timeout: 30000 });
            lastError = null;
            break;
        } catch (err) {
            lastError = err;

            if (attempt < MAX_RETRIES) {
                const delay = Math.pow(2, attempt) * 1000; // 2s, 4s
                s.message(`Retry ${attempt}/${MAX_RETRIES} in ${delay / 1000}s...`);
                await new Promise(r => setTimeout(r, delay));

                // Clean up failed attempt
                try { fs.rmSync(tmp, { recursive: true, force: true }); } catch { }
                fs.mkdirSync(tmp, { recursive: true });
            }
        }
    }

    if (lastError) {
        s.fail("Failed to clone repository");
        stepLine();

        // Provide helpful error messages
        const errMsg = lastError.message || "";
        if (errMsg.includes("not found") || errMsg.includes("404")) {
            step(c.red(`Repository not found: ${org}/${repo}`), S.cross, "red");
            step(c.dim("Check if the repository exists and is public"), S.branch, "gray");
        } else if (errMsg.includes("timeout")) {
            step(c.red("Connection timeout"), S.cross, "red");
            step(c.dim("Check your internet connection and try again"), S.branch, "gray");
        } else if (errMsg.includes("Could not resolve")) {
            step(c.red("Network error: Unable to reach GitHub"), S.cross, "red");
            step(c.dim("Check your internet connection"), S.branch, "gray");
        } else {
            step(c.red("Clone failed: " + errMsg.split("\n")[0]), S.cross, "red");
        }

        fs.rmSync(tmp, { recursive: true, force: true });
        return;
    }

    s.stop("Repository cloned");

    // Find skills in repo - check multiple possible locations
    const skillsInRepo = [];

    // Possible skill locations (in order of priority)
    const possibleSkillDirs = [
        path.join(tmp, ".agent", "skills"),  // Standard location
        path.join(tmp, "skills"),             // Alternative location
        tmp                                    // Root level (legacy)
    ];

    let skillsDir = null;
    for (const dir of possibleSkillDirs) {
        if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
            // Check if this directory contains skill folders
            const entries = fs.readdirSync(dir);
            for (const e of entries) {
                const sp = path.join(dir, e);
                if (fs.statSync(sp).isDirectory() && fs.existsSync(path.join(sp, "SKILL.md"))) {
                    skillsDir = dir;
                    break;
                }
            }
            if (skillsDir) break;
        }
    }

    if (skillsDir) {
        for (const e of fs.readdirSync(skillsDir)) {
            const sp = path.join(skillsDir, e);
            if (fs.statSync(sp).isDirectory()) {
                // Check if this directory has SKILL.md (top-level skill only)
                if (fs.existsSync(path.join(sp, "SKILL.md"))) {
                    const m = parseSkillMdFrontmatter(path.join(sp, "SKILL.md"));
                    skillsInRepo.push({
                        title: e,  // Only show folder name
                        value: e,
                        description: m.description || "",
                        selected: singleSkill ? e === singleSkill : true,
                        _path: sp
                    });
                }
                // NOTE: Sub-folders are NOT counted as separate skills
                // They are part of the parent skill (e.g. game-development/2d-games)
            }
        }
    }

    if (skillsInRepo.length === 0) {
        step(c.yellow("No valid skills found"), S.diamond, "yellow");
        step(c.dim("Expected skills in .agent/skills/ or skills/ directory"), S.branch, "gray");
        fs.rmSync(tmp, { recursive: true, force: true });
        return;
    }

    stepLine();
    step(`Found ${skillsInRepo.length} skill${skillsInRepo.length > 1 ? "s" : ""}`);

    let selectedSkills = [];

    // If single skill specified via #skill_name, auto-select it
    if (singleSkill) {
        const found = skillsInRepo.find(s => s.value === singleSkill);
        if (!found) {
            stepLine();
            step(c.red(`Skill '${singleSkill}' not found in repository`), S.cross, "red");
            fs.rmSync(tmp, { recursive: true, force: true });
            return;
        }
        selectedSkills = [singleSkill];
        stepLine();
        step(`Auto-selected: ${c.cyan(singleSkill)}`);
    } else {
        // FAANG-Grade Categories (8 balanced categories)
        // NOTE: Order matters! Specialized categories FIRST, Core is fallback
        const CATEGORY_KEYWORDS = {
            // Specialized domains
            "🎨 Frontend & UI": [
                "frontend", "nextjs", "tailwind", "css", "ui", "ux", "visual",
                "studio", "web-core", "design-system", "react-architect", "react"
            ],
            "🎮 Game Development": [
                "game", "development", "engine", "unity", "unreal", "godot", "phaser"
            ],
            "📱 Mobile": [
                "mobile", "first", "developer", "react-native", "flutter",
                "ios", "android", "swift", "kotlin"
            ],
            "🔒 Security & DevOps": [
                "security", "vulnerability", "offensive", "scanner", "red-team", "governance",
                "cicd", "pipeline", "gitops", "docker", "deploy", "server-ops"
            ],
            // Technical domains
            "🧪 Testing & Quality": [
                "test", "testing", "tdd", "e2e", "debug", "quality", "review",
                "lint", "validate", "automation", "problem", "checker"
            ],
            "🤖 AI & Agents": [
                "agent", "pattern", "auto-learn", "execution", "self-evolution",
                "lifecycle", "skill-forge", "intelligent", "routing"
            ],
            "📚 Docs & Planning": [
                "doc", "template", "plan", "project", "idea", "brainstorm",
                "geo", "seo", "i18n", "writing"
            ],
            // Fallback (core backend/infra)
            "⚙️  Backend & Core": [
                "backend", "api", "nodejs", "python", "server", "database",
                "prisma", "mcp", "data", "architect", "scaffold", "system",
                "typescript", "shell", "bash", "powershell", "git", "code-craft",
                "code-constitution", "observability", "perf", "state", "rollback"
            ]
        };

        function categorizeSkill(skillName) {
            const lower = skillName.toLowerCase();
            for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
                if (keywords.some(kw => lower.includes(kw))) {
                    return category;
                }
            }
            return "⚙️  Backend & Core"; // Default fallback (no "Other" category)
        }

        // REQUIRED SKILLS - Always installed, not shown in selection
        const REQUIRED_SKILLS = ["skill-generator"];

        // Filter out required skills from selection list
        const selectableSkills = skillsInRepo.filter(s => !REQUIRED_SKILLS.includes(s.value));

        // Group skills by category
        const grouped = {};
        for (const skill of selectableSkills) {
            const cat = categorizeSkill(skill.value);
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(skill);
        }

        // Custom sort: alphabetical but "Other" always last
        const sortedCategories = Object.keys(grouped).sort((a, b) => {
            if (a.includes("Other")) return 1;
            if (b.includes("Other")) return -1;
            return a.localeCompare(b);
        });


        stepLine();
        activeStep("Select skill categories to install");

        // Show only categories, not individual skills
        const selectedCategories = await multiselect({
            message: `${c.cyan("space")} select · ${c.cyan("enter")} confirm`,
            options: sortedCategories.map(cat => ({
                label: `${cat} (${grouped[cat].length} skills)`,
                value: cat,
                hint: grouped[cat].slice(0, 3).map(s => s.value).join(", ") + (grouped[cat].length > 3 ? "..." : "")
            })),
            initialValues: sortedCategories, // Pre-select all
            required: true
        });

        if (isCancel(selectedCategories)) {
            cancel("Cancelled.");
            fs.rmSync(tmp, { recursive: true, force: true });
            return;
        }

        // Get all skills from selected categories
        selectedSkills = selectedCategories.flatMap(cat => grouped[cat].map(s => s.value));

        // Add required system skills
        const requiredInRepo = skillsInRepo.filter(s => REQUIRED_SKILLS.includes(s.value)).map(s => s.value);
        selectedSkills = [...new Set([...selectedSkills, ...requiredInRepo])];
    }

    // Check for required skills and show info
    const CORE_REQUIRED = ["skill-generator"];
    const installedRequired = selectedSkills.filter(s => CORE_REQUIRED.includes(s));

    stepLine();
    step("Select skills to install");
    console.log(`${c.gray(S.branch)}  ${c.dim(selectedSkills.filter(s => !CORE_REQUIRED.includes(s)).join(", "))}`);
    if (installedRequired.length > 0) {
        console.log(`${c.gray(S.branch)}  ${c.cyan("+ System required:")} ${c.green(installedRequired.join(", "))}`);
    }

    // --- Detect installed agents ---
    stepLine();
    const { detectInstalledAgents } = await import("../agents.js");
    const detectedAgents = detectInstalledAgents();

    if (detectedAgents.length === 0) {
        step(c.yellow("No agents detected"), S.diamond, "yellow");
        step(c.dim("Please install at least one AI agent (Antigravity, Claude Code, etc.)"), S.branch, "gray");
        fs.rmSync(tmp, { recursive: true, force: true });
        return;
    }

    step(`Detected ${detectedAgents.length} agents`);

    // --- Select agents (Vercel-style) ---
    const { selectAgentsPrompt, selectScopePrompt, selectMethodPrompt } = await import("../ui.js");

    stepLine();
    activeStep("Install to");
    const selectedAgents = await selectAgentsPrompt(detectedAgents);

    if (!selectedAgents || selectedAgents.length === 0) {
        fs.rmSync(tmp, { recursive: true, force: true });
        return;
    }

    stepLine();
    step("Install to");
    console.log(`${c.gray(S.branch)}  ${c.dim(selectedAgents.map(a => a.displayName).join(", "))}`);

    // --- Select installation scope ---
    let isGlobal = GLOBAL;

    if (!GLOBAL) {
        stepLine();
        activeStep("Installation scope");
        const scope = await selectScopePrompt();

        if (!scope) {
            fs.rmSync(tmp, { recursive: true, force: true });
            return;
        }

        isGlobal = scope === "global";
    }

    stepLine();
    step("Installation scope");
    console.log(`${c.gray(S.branch)}  ${c.dim(isGlobal ? "Global" : "Project")}`);

    // --- Select installation method ---
    stepLine();
    activeStep("Installation method");
    const installMethod = await selectMethodPrompt();

    if (!installMethod) {
        fs.rmSync(tmp, { recursive: true, force: true });
        return;
    }


    // Installation Summary Box
    stepLine();
    step("Installation method");
    console.log(`${c.gray(S.branch)}  ${c.dim(installMethod === "symlink" ? "Symlink" : "Copy")}`);

    stepLine();
    step("Installation Summary");
    stepLine();

    const agentsString = selectedAgents.map(a => a.displayName).join(", ");

    let summaryContent = "";
    const methodVerb = installMethod === "symlink" ? "symlink" : "copy";

    for (const sn of selectedSkills) {
        summaryContent += `${c.cyan(sn)}\n`;
        summaryContent += `  ${c.dim(methodVerb)} ${c.gray("→")} ${c.dim(agentsString)}\n\n`;
    }

    // Remove trailing newlines
    summaryContent = summaryContent.trim();

    console.log(boxen(summaryContent, {
        padding: 1,
        borderColor: "gray",
        borderStyle: "round",
        dimBorder: true,
        title: "Installation Summary",
        titleAlignment: "left"
    }).split("\n").map(l => `${c.gray(S.branch)}  ${l}`).join("\n"));

    stepLine();

    // Confirmation
    activeStep("Proceed with installation?");
    const shouldProceed = await confirm({ message: " ", initialValue: true });

    if (isCancel(shouldProceed) || !shouldProceed) {
        cancel("Cancelled.");
        fs.rmSync(tmp, { recursive: true, force: true });
        return;
    }

    // Install skills to multiple agents
    stepLine();
    const { installSkillForAgents } = await import("../installer.js");

    // Create a map for skill paths
    const skillPathMap = Object.fromEntries(skillsInRepo.map(s => [s.value, s._path]));

    const installResults = { success: [], failed: [] };

    for (const sn of selectedSkills) {
        const src = skillPathMap[sn] || path.join(skillsDir || tmp, sn);

        const is = spinner();
        is.start(`Installing ${sn} to ${selectedAgents.length} agents`);

        const result = await installSkillForAgents(src, sn, selectedAgents, {
            method: installMethod,
            scope: isGlobal ? "global" : "project",
            metadata: {
                repo: `${org}/${repo}`,
                ref: ref || null
            }
        });

        installResults.success.push(...result.success);
        installResults.failed.push(...result.failed);

        if (result.failed.length === 0) {
            is.stop(`Installed ${sn} (${result.success.length} agents)`);
        } else {
            is.stop(`${sn}: ${result.success.length} success, ${result.failed.length} failed`);
        }
    }


    // Derive base .agent directory from skillsDir
    // If skillsDir is .../skills, then baseAgentDir is parent (.agent)
    const baseAgentDir = skillsDir ? path.dirname(skillsDir) : path.join(tmp, ".agent");

    // Install workflows if they exist
    const workflowsDir = path.join(baseAgentDir, "workflows");
    const targetWorkflowsDir = path.join(WORKSPACE, "..", "workflows");
    let workflowsInstalled = 0;


    if (fs.existsSync(workflowsDir)) {
        stepLine();
        const ws = spinner();
        ws.start("Installing workflows");

        fs.mkdirSync(targetWorkflowsDir, { recursive: true });
        const workflows = fs.readdirSync(workflowsDir).filter(f => f.endsWith(".md"));

        for (const wf of workflows) {
            const src = path.join(workflowsDir, wf);
            const dest = path.join(targetWorkflowsDir, wf);

            if (!fs.existsSync(dest)) {
                fs.copyFileSync(src, dest);
                workflowsInstalled++;
            }
        }

        ws.stop(`Installed ${workflowsInstalled} workflows`);
    }

    // Install GEMINI.md if it exists
    const geminiSrc = path.join(baseAgentDir, "GEMINI.md");
    const geminiDest = path.join(WORKSPACE, "..", "GEMINI.md");
    let geminiInstalled = false;

    if (fs.existsSync(geminiSrc) && !fs.existsSync(geminiDest)) {
        stepLine();
        fs.copyFileSync(geminiSrc, geminiDest);
        step("Installed GEMINI.md (Agent Rules)");
        geminiInstalled = true;
    }

    // Install agents if they exist
    const agentsDir = path.join(baseAgentDir, "agents");
    const targetAgentsDir = path.join(WORKSPACE, "..", "agents");
    let agentsInstalled = 0;

    if (fs.existsSync(agentsDir)) {
        stepLine();
        const as = spinner();
        as.start("Installing agents");

        fs.mkdirSync(targetAgentsDir, { recursive: true });
        const agents = fs.readdirSync(agentsDir).filter(f => f.endsWith(".md"));

        for (const agent of agents) {
            const src = path.join(agentsDir, agent);
            const dest = path.join(targetAgentsDir, agent);

            if (!fs.existsSync(dest)) {
                fs.copyFileSync(src, dest);
                agentsInstalled++;
            }
        }

        as.stop(`Installed ${agentsInstalled} agents`);
    }

    // Install ARCHITECTURE.md if it exists
    const archSrc = path.join(baseAgentDir, "ARCHITECTURE.md");
    const archDest = path.join(WORKSPACE, "..", "ARCHITECTURE.md");
    let archInstalled = false;

    if (fs.existsSync(archSrc) && !fs.existsSync(archDest)) {
        fs.copyFileSync(archSrc, archDest);
        step("Installed ARCHITECTURE.md");
        archInstalled = true;
    }

    // Install knowledge if it exists (required for Agent CLI)
    const knowledgeDir = path.join(baseAgentDir, "knowledge");
    const targetKnowledgeDir = path.join(WORKSPACE, "..", "knowledge");
    let knowledgeInstalled = false;

    if (fs.existsSync(knowledgeDir) && !fs.existsSync(targetKnowledgeDir)) {
        fs.cpSync(knowledgeDir, targetKnowledgeDir, { recursive: true });
        step("Installed knowledge/");
        knowledgeInstalled = true;
    } else if (!fs.existsSync(targetKnowledgeDir)) {
        // Create empty knowledge folder for Agent CLI
        fs.mkdirSync(targetKnowledgeDir, { recursive: true });
        // Create minimal structure for Agent CLI
        fs.writeFileSync(path.join(targetKnowledgeDir, "lessons-learned.yaml"), "# Lessons learned by AI Agent\nlessons: []\n");
        step("Created knowledge/ (Agent CLI ready)");
        knowledgeInstalled = true;
    }

    // Install config/ if it exists (required for skill configuration)
    const configDir = path.join(baseAgentDir, "config");
    const targetConfigDir = path.join(WORKSPACE, "..", "config");
    let configInstalled = false;

    if (fs.existsSync(configDir) && !fs.existsSync(targetConfigDir)) {
        fs.cpSync(configDir, targetConfigDir, { recursive: true });
        step("Installed config/");
        configInstalled = true;
    }

    // Install scripts-js/ if it exists (required for skill operations)
    const scriptsJsDir = path.join(baseAgentDir, "scripts-js");
    const targetScriptsJsDir = path.join(WORKSPACE, "..", "scripts-js");
    let scriptsJsInstalled = false;

    if (fs.existsSync(scriptsJsDir) && !fs.existsSync(targetScriptsJsDir)) {
        fs.cpSync(scriptsJsDir, targetScriptsJsDir, { recursive: true });
        step("Installed scripts-js/");
        scriptsJsInstalled = true;
    }

    // Install metrics/ if it exists (for agent performance tracking)
    const metricsDir = path.join(baseAgentDir, "metrics");
    const targetMetricsDir = path.join(WORKSPACE, "..", "metrics");
    let metricsInstalled = false;

    if (fs.existsSync(metricsDir) && !fs.existsSync(targetMetricsDir)) {
        fs.cpSync(metricsDir, targetMetricsDir, { recursive: true });
        step("Installed metrics/");
        metricsInstalled = true;
    }

    // Install additional policy documents
    const policyDocs = [
        "CONTINUOUS_EXECUTION_POLICY.md",
        "WORKFLOW_CHAINS.md"
    ];
    let policyDocsInstalled = 0;

    for (const doc of policyDocs) {
        const docSrc = path.join(baseAgentDir, doc);
        const docDest = path.join(WORKSPACE, "..", doc);
        if (fs.existsSync(docSrc) && !fs.existsSync(docDest)) {
            fs.copyFileSync(docSrc, docDest);
            policyDocsInstalled++;
        }
    }
    if (policyDocsInstalled > 0) {
        step(`Installed ${policyDocsInstalled} policy docs`);
    }

    // Install rules if they exist
    const rulesDir = path.join(baseAgentDir, "rules");
    const targetRulesDir = path.join(WORKSPACE, "..", "rules");
    let rulesInstalled = 0;

    if (fs.existsSync(rulesDir)) {
        fs.mkdirSync(targetRulesDir, { recursive: true });
        const rules = fs.readdirSync(rulesDir).filter(f => f.endsWith(".md"));

        for (const rule of rules) {
            const src = path.join(rulesDir, rule);
            const dest = path.join(targetRulesDir, rule);

            if (!fs.existsSync(dest)) {
                fs.copyFileSync(src, dest);
                rulesInstalled++;
            }
        }

        if (rulesInstalled > 0) {
            step(`Installed ${rulesInstalled} rules`);
        }
    }

    // Install .shared if it exists (contains shared resources like ui-ux-pro-max data)
    const sharedDir = path.join(tmp, ".agent", ".shared");
    const targetSharedDir = path.join(WORKSPACE, "..", ".shared");
    let sharedInstalled = false;

    if (fs.existsSync(sharedDir) && !fs.existsSync(targetSharedDir)) {
        stepLine();
        const ss = spinner();
        ss.start("Installing shared resources");

        fs.cpSync(sharedDir, targetSharedDir, { recursive: true });
        sharedInstalled = true;

        ss.stop("Installed .shared/ (ui-ux-pro-max data)");
    }

    // Install VS Code Extension (PikaKit Skill Generator) if available
    const vsixDir = path.join(tmp, "packages", "pikakit-vscode");
    let extensionInstalled = false;

    if (fs.existsSync(vsixDir)) {
        stepLine();
        const es = spinner();
        es.start("Installing VS Code Extension");

        try {
            // Check if VSIX already built
            let vsixPath = null;
            const files = fs.readdirSync(vsixDir);
            const vsixFile = files.find(f => f.endsWith(".vsix"));

            if (vsixFile) {
                vsixPath = path.join(vsixDir, vsixFile);
            } else {
                // Build VSIX if needed
                es.message("Building extension...");
                await execAsync("npm install", { cwd: vsixDir, timeout: 60000 });
                await execAsync("npm run compile", { cwd: vsixDir, timeout: 30000 });
                await execAsync("npx vsce package --allow-missing-repository -o pikakit.vsix", { cwd: vsixDir, timeout: 30000 });
                vsixPath = path.join(vsixDir, "pikakit.vsix");
            }

            if (vsixPath && fs.existsSync(vsixPath)) {
                let installedTo = [];

                // Install to VS Code
                try {
                    await execAsync(`code --install-extension "${vsixPath}"`, { timeout: 30000 });
                    installedTo.push("VS Code");
                } catch {
                    // VS Code not available, continue
                }

                // Also install to Antigravity extensions folder
                const antigravityExt = path.join(os.homedir(), ".antigravity", "extensions");
                if (fs.existsSync(path.join(os.homedir(), ".antigravity"))) {
                    try {
                        fs.mkdirSync(antigravityExt, { recursive: true });
                        const extDest = path.join(antigravityExt, "pikakit.pikakit-skill-generator-1.0.0");

                        // Copy extension source files (not VSIX, but actual extension)
                        const outDir = path.join(vsixDir, "out");
                        if (fs.existsSync(outDir)) {
                            fs.mkdirSync(extDest, { recursive: true });
                            // Copy required files
                            fs.cpSync(path.join(vsixDir, "package.json"), path.join(extDest, "package.json"));
                            fs.cpSync(outDir, path.join(extDest, "out"), { recursive: true });
                            if (fs.existsSync(path.join(vsixDir, "README.md"))) {
                                fs.cpSync(path.join(vsixDir, "README.md"), path.join(extDest, "README.md"));
                            }
                            installedTo.push("Antigravity");
                        }
                    } catch {
                        // Antigravity install failed, continue
                    }
                }

                if (installedTo.length > 0) {
                    extensionInstalled = true;
                    es.stop(`Installed PikaKit VS Code Extension (${installedTo.join(", ")})`);
                } else {
                    es.stop(c.yellow("VS Code extension not installed (no IDE detected)"));
                }
            }
        } catch (err) {
            es.stop(c.yellow("VS Code extension skipped"));
            step(c.dim("Install manually: code --install-extension pikakit.vsix"));
        }
    }

    // Installation complete step
    stepLine();
    step("Installation complete");

    // Final Success Box
    stepLine();
    console.log(`${c.gray(S.branch)}`); // Extra spacing line

    let successContent = "";

    // Skills summary
    for (const sn of selectedSkills) {
        const mockPath = `.agent/skills/${sn}`;
        successContent += `${c.cyan("✓")} ${c.dim(mockPath)}\n`;
    }

    // Workflows summary
    if (workflowsInstalled > 0) {
        successContent += `${c.cyan("✓")} ${c.dim(`.agent/workflows/ (${workflowsInstalled} files)`)}\n`;
    }

    // Agents summary
    if (agentsInstalled > 0) {
        successContent += `${c.cyan("✓")} ${c.dim(`.agent/agents/ (${agentsInstalled} files)`)}\n`;
    }

    // GEMINI.md summary
    if (geminiInstalled) {
        successContent += `${c.cyan("✓")} ${c.dim(".agent/GEMINI.md (Agent Rules)")}\n`;
    }

    // ARCHITECTURE.md summary
    if (archInstalled) {
        successContent += `${c.cyan("✓")} ${c.dim(".agent/ARCHITECTURE.md")}\n`;
    }

    // Knowledge summary
    if (knowledgeInstalled) {
        successContent += `${c.cyan("✓")} ${c.dim(".agent/knowledge/")}\n`;
    }

    // Rules summary
    if (rulesInstalled > 0) {
        successContent += `${c.cyan("✓")} ${c.dim(`.agent/rules/ (${rulesInstalled} files)`)}\n`;
    }

    // Shared resources summary
    if (sharedInstalled) {
        successContent += `${c.cyan("✓")} ${c.dim(".agent/.shared/ (ui-ux-pro-max data)")}\n`;
    }

    // VS Code Extension summary
    if (extensionInstalled) {
        successContent += `${c.cyan("✓")} ${c.dim("PikaKit VS Code Extension")}\n`;
    }

    // Build title
    const parts = [`${selectedSkills.length} skills`];
    if (workflowsInstalled > 0) parts.push(`${workflowsInstalled} workflows`);
    if (agentsInstalled > 0) parts.push(`${agentsInstalled} agents`);
    if (geminiInstalled) parts.push("GEMINI.md");

    console.log(boxen(successContent.trim(), {
        padding: 1,
        borderColor: "cyan",
        borderStyle: "round",
        title: c.cyan(`Installed ${parts.join(", ")}`),
        titleAlignment: "left"
    }).split("\n").map(l => `${c.gray(S.branch)}  ${l}`).join("\n"));

    fs.rmSync(tmp, { recursive: true, force: true });

    // Install CLI package
    stepLine();
    const cliSpinner = spinner();
    const cliPackage = "pikakit";

    if (isGlobal) {
        cliSpinner.start(`Installing kit CLI globally (${cliPackage})`);
        try {
            await execAsync(`npm install -g ${cliPackage}`, { timeout: 120000 });
            cliSpinner.stop("CLI installed globally");
            step(c.dim("Command: kit"));
        } catch (e) {
            cliSpinner.stop(c.yellow("Global CLI installation failed"));
            step(c.dim(`Try running manually: npm i -g ${cliPackage}`));
        }
    } else {
        cliSpinner.start(`Installing kit CLI locally (${cliPackage})`);
        try {
            await execAsync(`npm install -D ${cliPackage}`, { timeout: 120000 });
            cliSpinner.stop("CLI installed locally");

            // Add npm scripts to package.json
            try {
                const pkgPath = path.join(process.cwd(), "package.json");
                if (fs.existsSync(pkgPath)) {
                    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
                    pkg.scripts = pkg.scripts || {};

                    if (!pkg.scripts.kit) {
                        pkg.scripts.kit = "kit";
                    }

                    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
                    step(c.green("✓ Added npm script: 'kit'"));
                }
            } catch (scriptErr) {
                step(c.yellow("⚠ Could not add npm scripts automatically"));
            }

            // Create wrapper scripts for direct command access (Windows + Unix)
            try {
                const projectRoot = process.cwd();

                // Always create kit wrappers
                const kitCmd = `@echo off\nnode "%~dp0node_modules\\pikakit\\bin\\kit.js" %*`;
                const kitSh = `#!/bin/sh\nnode "$(dirname "$0")/node_modules/pikakit/bin/kit.js" "$@"`;
                fs.writeFileSync(path.join(projectRoot, "kit.cmd"), kitCmd);
                fs.writeFileSync(path.join(projectRoot, "kit"), kitSh, { mode: 0o755 });

                step(c.green(" Created wrapper script: kit"));
                step(c.dim("Run directly: ./kit (Unix) | kit (Windows)"));
            } catch (wrapperErr) {
                step(c.dim("Run: npx kit"));
            }
        } catch (e) {
            cliSpinner.stop(c.yellow("Local CLI installation skipped"));
            step(c.dim(`Run manually: npm i -D ${cliPackage}`));
        }
    }

    // Run npm install to ensure all skill dependencies are available
    stepLine();
    const depsSpinner = spinner();
    depsSpinner.start("Installing skill dependencies (csv-parse, etc.)");
    try {
        await execAsync("npm install", { timeout: 120000 });
        depsSpinner.stop("Skill dependencies installed");
    } catch (e) {
        depsSpinner.stop(c.yellow("Dependencies installation skipped"));
        step(c.dim("Run manually: npm install"));
    }

    // Python dependencies no longer needed - all scripts migrated to JS

    stepLine();
    console.log(` ${c.cyan("Done!")}`);
    console.log();
}
