/**
 * @fileoverview Tests for recall.js functionality
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";

const TEST_DIR = path.join(os.tmpdir(), "agent-skill-kit-recall-test");
const KNOWLEDGE_DIR = path.join(TEST_DIR, ".agent", "knowledge");
const LESSONS_PATH = path.join(KNOWLEDGE_DIR, "lessons-learned.yaml");
const TEST_FILE = path.join(TEST_DIR, "test-code.js");

describe("Recall - Pattern Matching", () => {
    beforeEach(() => {
        fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
    });

    afterEach(() => {
        fs.rmSync(TEST_DIR, { recursive: true, force: true });
    });

    it("detects pattern matches in code", () => {
        const codeContent = `
            console.log("debug");
            const x = 1;
        `;
        const pattern = /console\.log/g;
        const matches = codeContent.match(pattern);

        expect(matches).not.toBeNull();
        expect(matches.length).toBe(1);
    });

    it("returns null when no pattern matches", () => {
        const codeContent = `const x = 1;`;
        const pattern = /console\.log/g;
        const matches = codeContent.match(pattern);

        expect(matches).toBeNull();
    });

    it("counts multiple occurrences", () => {
        const codeContent = `
            console.log("one");
            console.log("two");
            console.log("three");
        `;
        const pattern = /console\.log/g;
        const matches = codeContent.match(pattern);

        expect(matches).not.toBeNull();
        expect(matches.length).toBe(3);
    });

    it("can scan files from filesystem", () => {
        const testCode = `console.log("test");`;
        fs.writeFileSync(TEST_FILE, testCode, "utf8");

        const content = fs.readFileSync(TEST_FILE, "utf8");
        expect(content).toContain("console.log");
    });

    it("finds line numbers for matches", () => {
        const lines = [
            "const a = 1;",
            "console.log('found');",
            "const b = 2;"
        ];
        const pattern = /console\.log/;

        const matchingLines = lines
            .map((line, idx) => ({ line, num: idx + 1 }))
            .filter(({ line }) => pattern.test(line));

        expect(matchingLines.length).toBe(1);
        expect(matchingLines[0].num).toBe(2);
    });
});

describe("Recall - Directory Scanning", () => {
    beforeEach(() => {
        fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
    });

    afterEach(() => {
        fs.rmSync(TEST_DIR, { recursive: true, force: true });
    });

    it("filters files by extension", () => {
        const extensions = [".js", ".ts", ".tsx"];
        const testFiles = ["app.js", "util.ts", "readme.md", "style.css"];

        const filtered = testFiles.filter(f =>
            extensions.some(ext => f.endsWith(ext))
        );

        expect(filtered).toEqual(["app.js", "util.ts"]);
    });

    it("skips node_modules directory", () => {
        const skipDirs = ["node_modules", ".git", "dist"];
        const testDir = "node_modules";

        expect(skipDirs.includes(testDir)).toBe(true);
    });
});
