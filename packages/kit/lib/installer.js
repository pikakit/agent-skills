import fs from "fs";
import path from "path";
import { homedir } from "os";
import { GLOBAL_DIR } from "./config.js";
import { merkleHash } from "./helpers.js";
import { AGENTS } from "./agents.js";

const home = homedir();

/**
 * Install a skill to the destination using the specified method.
 * @param {string} src - Source directory (temp)
 * @param {string} dest - Destination directory (project)
 * @param {string} method - 'symlink' or 'copy'
 * @param {Object} metadata - Metadata for .skill-source.json
 */
export async function installSkill(src, dest, method, metadata) {
    if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true });

    if (method === "symlink") {
        // For symlink: Move to global persistent storage first
        // Storage path: ~/.gemini/antigravity/skills/storage/<org>/<repo>/<skill>
        // Metadata must contain org, repo, skill
        const { repo: repoStr, skill } = metadata;
        const [org, repo] = repoStr.split("/");

        const storageBase = path.join(GLOBAL_DIR, "storage", org, repo, skill);

        // Ensure fresh copy in storage
        if (fs.existsSync(storageBase)) fs.rmSync(storageBase, { recursive: true, force: true });
        fs.mkdirSync(path.dirname(storageBase), { recursive: true });

        // Copy from tmp to storage
        await fs.promises.cp(src, storageBase, { recursive: true });

        // Create junction
        fs.symlinkSync(storageBase, dest, "junction");
    } else {
        // Copy directly
        await fs.promises.cp(src, dest, { recursive: true });
    }

    // Write metadata
    const hash = merkleHash(dest);
    const metaFile = path.join(dest, ".skill-source.json");

    fs.writeFileSync(metaFile, JSON.stringify({
        ...metadata,
        checksum: hash,
        installedAt: new Date().toISOString(),
        method: method
    }, null, 2));
}

/**
 * Install a skill to multiple agents
 * @param {string} src - Source directory containing the skill
 * @param {string} skillName - Name of the skill
 * @param {Array<{name: string, displayName: string, skillsDir: string, globalSkillsDir: string}>} agents - Agents to install to
 * @param {Object} options - Installation options
 * @param {string} options.method - 'symlink' or 'copy'
 * @param {string} options.scope - 'project' or 'global'
 * @param {Object} options.metadata - Metadata for tracking
 * @returns {Promise<{success: Array, failed: Array}>}
 */
export async function installSkillForAgents(src, skillName, agents, options = {}) {
    const { method = "symlink", scope = "project", metadata = {} } = options;
    const results = { success: [], failed: [] };

    // For symlink mode: first copy to canonical location
    let canonicalPath = null;

    if (method === "symlink") {
        // Canonical: .agents/skills/<skill-name> or ~/.agents/skills/<skill-name>
        const baseDir = scope === "global" ? home : process.cwd();
        canonicalPath = path.join(baseDir, ".agents", "skills", skillName);

        // Ensure fresh copy in canonical
        if (fs.existsSync(canonicalPath)) {
            fs.rmSync(canonicalPath, { recursive: true, force: true });
        }
        fs.mkdirSync(path.dirname(canonicalPath), { recursive: true });

        try {
            await fs.promises.cp(src, canonicalPath, { recursive: true });

            // Write metadata to canonical location
            const hash = merkleHash(canonicalPath);
            const metaFile = path.join(canonicalPath, ".skill-source.json");
            fs.writeFileSync(metaFile, JSON.stringify({
                ...metadata,
                skillName,
                checksum: hash,
                installedAt: new Date().toISOString(),
                method: method,
                scope: scope,
                agents: agents.map(a => a.name)
            }, null, 2));
        } catch (err) {
            // If canonical copy fails, abort
            return {
                success: [],
                failed: agents.map(a => ({ agent: a.displayName, error: `Canonical copy failed: ${err.message}` }))
            };
        }
    }

    // Install to each agent
    for (const agent of agents) {
        const agentConfig = AGENTS[agent.name];
        if (!agentConfig) {
            results.failed.push({ agent: agent.displayName, error: "Unknown agent" });
            continue;
        }

        // Determine destination path
        const baseDir = scope === "global" ? agentConfig.globalSkillsDir : path.join(process.cwd(), agentConfig.skillsDir);
        const destPath = path.join(baseDir, skillName);

        try {
            // Ensure parent directory exists
            fs.mkdirSync(path.dirname(destPath), { recursive: true });

            // Remove existing if any
            if (fs.existsSync(destPath)) {
                fs.rmSync(destPath, { recursive: true, force: true });
            }

            if (method === "symlink" && canonicalPath) {
                // Create symlink to canonical location
                try {
                    fs.symlinkSync(canonicalPath, destPath, "junction");
                    results.success.push({ agent: agent.displayName, path: destPath, mode: "symlink" });
                } catch (symlinkErr) {
                    // Fallback to copy if symlink fails (Windows permissions)
                    await fs.promises.cp(canonicalPath, destPath, { recursive: true });
                    results.success.push({ agent: agent.displayName, path: destPath, mode: "copy (symlink failed)" });
                }
            } else {
                // Direct copy
                await fs.promises.cp(src, destPath, { recursive: true });

                // Write metadata
                const hash = merkleHash(destPath);
                const metaFile = path.join(destPath, ".skill-source.json");
                fs.writeFileSync(metaFile, JSON.stringify({
                    ...metadata,
                    skillName,
                    checksum: hash,
                    installedAt: new Date().toISOString(),
                    method: "copy",
                    scope: scope
                }, null, 2));

                results.success.push({ agent: agent.displayName, path: destPath, mode: "copy" });
            }
        } catch (err) {
            results.failed.push({ agent: agent.displayName, error: err.message });
        }
    }

    return results;
}

