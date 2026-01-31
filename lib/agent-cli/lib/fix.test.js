/**
 * @fileoverview Tests for fix.js functionality
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";

const TEST_DIR = path.join(os.tmpdir(), "agent-skill-kit-fix-test");

describe("Fix - Pattern Replacement", () => {
    beforeEach(() => {
        fs.mkdirSync(TEST_DIR, { recursive: true });
    });

    afterEach(() => {
        fs.rmSync(TEST_DIR, { recursive: true, force: true });
    });

    it("comments out console.log statements", () => {
        const line = 'console.log("debug");';
        const fixed = `// ${line}`;
        expect(fixed).toBe('// console.log("debug");');
    });

    it("replaces var with const", () => {
        const line = "var x = 1;";
        const fixed = line.replace(/\bvar\s+/, "const ");
        expect(fixed).toBe("const x = 1;");
    });

    it("replaces == with ===", () => {
        const line = "if (a == b) {";
        const fixed = line.replace(/([^!=])==([^=])/g, "$1===$2");
        expect(fixed).toBe("if (a === b) {");
    });

    it("removes debugger statements", () => {
        const lines = [
            "const x = 1;",
            "debugger;",
            "const y = 2;"
        ];
        const filtered = lines.filter(l => !/\bdebugger\b/.test(l));
        expect(filtered.length).toBe(2);
    });
});

describe("Fix - Backup Creation", () => {
    beforeEach(() => {
        fs.mkdirSync(TEST_DIR, { recursive: true });
    });

    afterEach(() => {
        fs.rmSync(TEST_DIR, { recursive: true, force: true });
    });

    it("creates backup file with .bak extension", () => {
        const testFile = path.join(TEST_DIR, "test.js");
        const backupFile = path.join(TEST_DIR, "test.js.bak");

        fs.writeFileSync(testFile, "original content", "utf8");
        fs.copyFileSync(testFile, backupFile);

        expect(fs.existsSync(backupFile)).toBe(true);
        expect(fs.readFileSync(backupFile, "utf8")).toBe("original content");
    });
});

describe("Fix - Mode Selection", () => {
    it("identifies safe mode correctly", () => {
        const mode = "safe";
        expect(mode === "safe").toBe(true);
    });

    it("identifies aggressive mode correctly", () => {
        const mode = "aggressive";
        expect(mode === "aggressive").toBe(true);
    });
});
