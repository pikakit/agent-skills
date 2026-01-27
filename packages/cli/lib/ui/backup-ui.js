/**
 * Backup UI - Interactive backup and restore
 */
import * as p from "@clack/prompts";
import pc from "picocolors";
import { createBackup, listBackups, restoreBackup, pruneBackups } from "../backup.js";

/**
 * Interactive backup/restore menu
 */
export async function runBackupUI() {
    p.intro("Backup & Restore (Press ESC to return)");

    while (true) {

        const action = await p.select({
            message: "What would you like to do?",
            options: [
                { value: "create", label: "Create Backup", hint: "Save current lessons & settings" },
                { value: "restore", label: "Restore Backup", hint: "Recover from previous backup" },
                { value: "list", label: "List Backups", hint: "View available backups" },
                { value: "prune", label: "Prune Old", hint: "Keep only last 5 backups" },
                { value: "back", label: "← Back", hint: "Return to main menu" }
            ]
        });

        if (p.isCancel(action) || action === "back") {
            return;
        }

        switch (action) {
            case "create": {
                const result = createBackup();
                if (result) {
                    p.note(
                        `Backup created:\n${pc.dim(result.path)}`,
                        pc.green("Success")
                    );
                    return; // Return to main menu
                } else {
                    p.note("Failed to create backup", pc.red("Error"));
                }
                break;
            }

            case "restore": {
                const backups = listBackups();
                if (backups.length === 0) {
                    p.note("No backups found", "Info");
                    break;
                }

                const selected = await p.select({
                    message: "Select backup to restore:",
                    options: backups.map(b => ({
                        value: b.path,
                        label: b.name,
                        hint: b.date.toLocaleString()
                    }))
                });

                if (p.isCancel(selected)) break;

                const confirm = await p.confirm({
                    message: "Restore this backup? Current data will be overwritten."
                });

                if (confirm) {
                    const success = restoreBackup(selected);
                    if (success) {
                        p.note("Backup restored successfully", pc.green("Success"));
                    } else {
                        p.note("Failed to restore backup", pc.red("Error"));
                    }
                }
                break;
            }

            case "list": {
                const backups = listBackups();
                if (backups.length === 0) {
                    p.note("No backups found", "Info");
                } else {
                    const list = backups.map(b =>
                        `• ${b.name}\n  ${pc.dim(b.date.toLocaleString())}`
                    ).join("\n\n");
                    p.note(list, `${backups.length} Backup(s)`);
                }
                break;
            }

            case "prune": {
                const confirm = await p.confirm({
                    message: "Delete old backups, keep only last 5?"
                });

                if (confirm) {
                    pruneBackups(5);
                    p.note("Old backups pruned", pc.green("Done"));
                }
                break;
            }
        }
    }
}

export default runBackupUI;
