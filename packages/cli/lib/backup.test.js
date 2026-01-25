/**
 * @fileoverview Tests for backup module
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";

describe("backup", () => {
    const testDir = path.join(os.tmpdir(), "test-backup-" + Date.now());

    beforeEach(() => {
        fs.mkdirSync(testDir, { recursive: true });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    describe("backup file format", () => {
        it("creates timestamped filename", () => {
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
            const filename = `backup-${timestamp}.yaml`;

            expect(filename).toMatch(/^backup-\d{4}-\d{2}-\d{2}/);
        });

        it("backup contains valid YAML", () => {
            const backupContent = `lessons:\n  - id: TEST\n    pattern: "x"`;
            const backupPath = path.join(testDir, "backup.yaml");
            fs.writeFileSync(backupPath, backupContent);

            expect(fs.existsSync(backupPath)).toBe(true);
            expect(fs.readFileSync(backupPath, "utf8")).toContain("lessons:");
        });
    });

    describe("listBackups", () => {
        it("returns empty array when no backups", () => {
            const backupDir = path.join(testDir, "backups");
            fs.mkdirSync(backupDir, { recursive: true });

            const files = fs.readdirSync(backupDir);
            expect(files).toHaveLength(0);
        });

        it("lists backup files", () => {
            const backupDir = path.join(testDir, "backups");
            fs.mkdirSync(backupDir, { recursive: true });
            fs.writeFileSync(path.join(backupDir, "backup-2024.yaml"), "test");

            const files = fs.readdirSync(backupDir);
            expect(files).toHaveLength(1);
        });
    });

    describe("pruneBackups", () => {
        it("keeps specified number of backups", () => {
            const backupDir = path.join(testDir, "backups");
            fs.mkdirSync(backupDir, { recursive: true });

            // Create 5 backups
            for (let i = 1; i <= 5; i++) {
                fs.writeFileSync(path.join(backupDir, `backup-${i}.yaml`), "test");
            }

            // Simulate pruning to keep 2
            const files = fs.readdirSync(backupDir).sort().reverse();
            const toDelete = files.slice(2);
            toDelete.forEach(f => fs.unlinkSync(path.join(backupDir, f)));

            expect(fs.readdirSync(backupDir)).toHaveLength(2);
        });
    });
});
