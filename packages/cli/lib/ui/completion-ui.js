/**
 * Completion UI - Shell completion setup
 */
import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "fs";
import path from "path";
import os from "os";
import {
    getCompletionScript,
    detectShell,
    generatePowerShellCompletion,
    generateBashCompletion,
    generateZshCompletion
} from "../completion.js";

/**
 * Interactive completion setup
 */
export async function runCompletionUI() {
    const detectedShell = detectShell();

    p.intro(`Shell Completion Setup`);
    p.note(`Detected shell: ${pc.cyan(detectedShell)}`, "🔍 Detection");

    const action = await p.select({
        message: "What would you like to do?",
        options: [
            { value: "install", label: "Install completion", hint: "Add to shell profile" },
            { value: "show", label: "Show script", hint: "Print completion script" },
            { value: "back", label: "Back", hint: "Return to menu" }
        ]
    });

    if (p.isCancel(action) || action === "back") {
        return;
    }

    const shell = await p.select({
        message: "Select shell:",
        options: [
            { value: "powershell", label: "PowerShell", hint: "Windows default" },
            { value: "bash", label: "Bash", hint: "Linux/macOS" },
            { value: "zsh", label: "Zsh", hint: "macOS default" }
        ],
        initialValue: detectedShell
    });

    if (p.isCancel(shell)) return;

    const { script } = getCompletionScript(shell);

    if (action === "show") {
        console.log("\n" + pc.dim("─".repeat(50)));
        console.log(script);
        console.log(pc.dim("─".repeat(50)) + "\n");

        p.note(
            `Copy the script above and add to your shell profile:\n` +
            `• PowerShell: $PROFILE\n` +
            `• Bash: ~/.bashrc\n` +
            `• Zsh: ~/.zshrc`,
            "📋 Instructions"
        );
        return;
    }

    if (action === "install") {
        const confirm = await p.confirm({
            message: `Install completion for ${shell}?`
        });

        if (!confirm) return;

        try {
            let profilePath;

            switch (shell) {
                case "powershell": {
                    // Get PowerShell profile path
                    const psProfile = process.env.USERPROFILE
                        ? path.join(process.env.USERPROFILE, "Documents", "PowerShell", "Microsoft.PowerShell_profile.ps1")
                        : path.join(os.homedir(), "Documents", "PowerShell", "Microsoft.PowerShell_profile.ps1");

                    profilePath = psProfile;
                    break;
                }
                case "bash":
                    profilePath = path.join(os.homedir(), ".bashrc");
                    break;
                case "zsh":
                    profilePath = path.join(os.homedir(), ".zshrc");
                    break;
            }

            // Ensure directory exists
            fs.mkdirSync(path.dirname(profilePath), { recursive: true });

            // Check if already installed
            const existing = fs.existsSync(profilePath)
                ? fs.readFileSync(profilePath, "utf8")
                : "";

            if (existing.includes("Agent Skill Kit")) {
                p.note("Completion already installed!", pc.yellow("⚠️ Skipped"));
                return;
            }

            // Append to profile
            fs.appendFileSync(profilePath, "\n" + script);

            p.note(
                `Completion installed to:\n${pc.cyan(profilePath)}\n\n` +
                `Restart your terminal or run:\n` +
                (shell === "powershell" ? `. $PROFILE` : `source ${profilePath}`),
                pc.green("✅ Installed")
            );

        } catch (e) {
            p.note(
                `Could not install automatically.\nError: ${e.message}\n\n` +
                `Please manually add the script to your shell profile.`,
                pc.red("❌ Error")
            );
        }
    }
}

export default runCompletionUI;
