#!/usr/bin/env node
/**
 * Install Agent Skill CLI
 * @description Package manager for AI Agent Skills
 */
import { c, brandedIntro } from "./lib/ui.js";
import { command, params, VERSION } from "./lib/config.js";

// --- Command Registry ---
const COMMANDS = {
    // Installation
    install: { module: "./lib/commands/install.js", hasParam: true, aliases: ["add", "i"] },
    uninstall: { module: "./lib/commands/uninstall.js", hasParam: true, aliases: ["remove", "rm"] },
    update: { module: "./lib/commands/update.js", hasParam: true },

    // Workspace
    init: { module: "./lib/commands/init.js", aliases: ["list", "ls"] },
    lock: { module: "./lib/commands/lock.js" },
    cache: { module: "./lib/commands/cache.js", hasParam: true },

    // Validation
    verify: { module: "./lib/commands/verify.js" },
    doctor: { module: "./lib/commands/doctor.js" },
    validate: { module: "./lib/commands/validate.js", hasParam: true, aliases: ["check"] },
    analyze: { module: "./lib/commands/analyze.js", hasParam: true },

    // Info
    info: { module: "./lib/commands/info.js", hasParam: true, aliases: ["show"] },
    help: { module: "./lib/commands/help.js", aliases: ["--help", "-h"] }
};

/**
 * Find command config by name or alias
 * @param {string} cmd - Command name or alias
 * @returns {{ name: string, config: object } | null}
 */
function findCommand(cmd) {
    // Direct match
    if (COMMANDS[cmd]) {
        return { name: cmd, config: COMMANDS[cmd] };
    }

    // Alias match
    for (const [name, config] of Object.entries(COMMANDS)) {
        if (config.aliases?.includes(cmd)) {
            return { name, config };
        }
    }

    return null;
}

// --- MAIN ---
async function main() {
    brandedIntro(VERSION);

    try {
        // Handle version flag
        if (command === "--version" || command === "-V") {
            console.log(VERSION);
            return;
        }

        // Find command
        const found = findCommand(command);

        if (found) {
            const cmdModule = await import(found.config.module);
            await cmdModule.run(found.config.hasParam ? params[0] : undefined);
        } else if (command.includes("/")) {
            // Direct install via org/repo syntax
            const cmdModule = await import("./lib/commands/install.js");
            await cmdModule.run(command);
        } else {
            console.log(`Unknown command: ${command}`);
            const cmdModule = await import("./lib/commands/help.js");
            await cmdModule.run();
        }
    } catch (err) {
        console.error(c.red("\nError: " + err.message));
        if (process.env.DEBUG) console.error(err.stack);
        process.exit(1);
    }
}

main().catch(err => {
    console.error(c.red("\nFatal Error: " + err.message));
    process.exit(1);
});
