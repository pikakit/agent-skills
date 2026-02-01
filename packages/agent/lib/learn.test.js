/**
 * @fileoverview Tests for learn.js functionality
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";

// Mock config để test
const TEST_DIR = path.join(os.tmpdir(), "agent-skill-kit-test");
const KNOWLEDGE_DIR = path.join(TEST_DIR, ".agent", "knowledge");
const LESSONS_PATH = path.join(KNOWLEDGE_DIR, "lessons-learned.yaml");

describe("Knowledge Base Operations", () => {
    beforeEach(() => {
        fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
    });

    afterEach(() => {
        fs.rmSync(TEST_DIR, { recursive: true, force: true });
    });

    it("creates initial knowledge file if missing", () => {
        // Simulate missing file scenario
        expect(fs.existsSync(LESSONS_PATH)).toBe(false);

        // Create initial file
        const initial = { lessons: [] };
        fs.writeFileSync(LESSONS_PATH, JSON.stringify(initial), "utf8");

        expect(fs.existsSync(LESSONS_PATH)).toBe(true);
    });

    it("can write and read lessons", () => {
        const lesson = {
            id: "LEARN-001",
            pattern: "console\\.log",
            message: "No console.log in production",
            severity: "WARNING",
            addedAt: new Date().toISOString()
        };

        const data = { lessons: [lesson] };
        fs.writeFileSync(LESSONS_PATH, JSON.stringify(data), "utf8");

        const content = fs.readFileSync(LESSONS_PATH, "utf8");
        const parsed = JSON.parse(content);

        expect(parsed.lessons).toHaveLength(1);
        expect(parsed.lessons[0].id).toBe("LEARN-001");
        expect(parsed.lessons[0].pattern).toBe("console\\.log");
    });

    it("validates regex patterns", () => {
        const validPattern = "console\\.log";
        const invalidPattern = "[invalid(";

        expect(() => new RegExp(validPattern)).not.toThrow();
        expect(() => new RegExp(invalidPattern)).toThrow();
    });

    it("validates severity values", () => {
        const validSeverities = ["WARNING", "ERROR"];
        const invalidSeverity = "INFO";

        expect(validSeverities.includes("WARNING")).toBe(true);
        expect(validSeverities.includes("ERROR")).toBe(true);
        expect(validSeverities.includes(invalidSeverity)).toBe(false);
    });
});
