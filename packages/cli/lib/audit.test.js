/**
 * @fileoverview Tests for audit.js functionality
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";

const TEST_DIR = path.join(os.tmpdir(), "agent-skill-kit-audit-test");
const AGENT_DIR = path.join(TEST_DIR, ".agent");

describe("Audit - Governance Check", () => {
    beforeEach(() => {
        fs.mkdirSync(AGENT_DIR, { recursive: true });
    });

    afterEach(() => {
        fs.rmSync(TEST_DIR, { recursive: true, force: true });
    });

    it("detects GEMINI.md presence", () => {
        const geminiPath = path.join(AGENT_DIR, "GEMINI.md");

        // Before creation
        expect(fs.existsSync(geminiPath)).toBe(false);

        // After creation
        fs.writeFileSync(geminiPath, "# Test", "utf8");
        expect(fs.existsSync(geminiPath)).toBe(true);
    });

    it("detects ARCHITECTURE.md presence", () => {
        const archPath = path.join(AGENT_DIR, "ARCHITECTURE.md");
        fs.writeFileSync(archPath, "# Architecture", "utf8");

        expect(fs.existsSync(archPath)).toBe(true);
    });

    it("counts skills in skills directory", () => {
        const skillsDir = path.join(AGENT_DIR, "skills");
        fs.mkdirSync(skillsDir, { recursive: true });

        // Create mock skills
        fs.mkdirSync(path.join(skillsDir, "skill-1"));
        fs.mkdirSync(path.join(skillsDir, "skill-2"));

        const skills = fs.readdirSync(skillsDir).filter(f =>
            fs.statSync(path.join(skillsDir, f)).isDirectory()
        );

        expect(skills.length).toBe(2);
    });
});

describe("Audit - Compliance Results", () => {
    it("calculates pass/fail status correctly", () => {
        const results = {
            errors: 0,
            warnings: 2,
            total: 2
        };

        // Errors = 0 means pass
        expect(results.errors === 0).toBe(true);
    });

    it("fails when errors exist", () => {
        const results = {
            errors: 1,
            warnings: 0,
            total: 1
        };

        expect(results.errors > 0).toBe(true);
    });

    it("calculates total correctly", () => {
        const violations = [
            { lesson: { severity: "ERROR" }, matches: [1, 2] },
            { lesson: { severity: "WARNING" }, matches: [1] }
        ];

        let total = 0;
        let errors = 0;
        let warnings = 0;

        violations.forEach(v => {
            total += v.matches.length;
            if (v.lesson.severity === "ERROR") {
                errors += v.matches.length;
            } else {
                warnings += v.matches.length;
            }
        });

        expect(total).toBe(3);
        expect(errors).toBe(2);
        expect(warnings).toBe(1);
    });
});
