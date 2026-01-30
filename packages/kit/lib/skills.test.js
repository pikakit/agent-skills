/**
 * @fileoverview Tests for skills.js
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";
import { parseSkillMdFrontmatter, detectSkillStructure } from "./skills.js";

describe("parseSkillMdFrontmatter", () => {
    let tempDir;
    let skillMdPath;

    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "skill-test-"));
        skillMdPath = path.join(tempDir, "SKILL.md");
    });

    afterEach(() => {
        fs.rmSync(tempDir, { recursive: true, force: true });
    });

    it("parses valid frontmatter", () => {
        const content = `---
name: test-skill
description: A test skill for testing
version: 1.0.0
author: Test Author
tags: react, testing, patterns
---

# Test Skill

Some content here.
`;
        fs.writeFileSync(skillMdPath, content);

        const result = parseSkillMdFrontmatter(skillMdPath);

        expect(result.name).toBe("test-skill");
        expect(result.description).toBe("A test skill for testing");
        expect(result.version).toBe("1.0.0");
        expect(result.author).toBe("Test Author");
        expect(result.tags).toEqual(["react", "testing", "patterns"]);
    });

    it("returns empty object for no frontmatter", () => {
        fs.writeFileSync(skillMdPath, "# Just a heading\n\nNo frontmatter here.");

        const result = parseSkillMdFrontmatter(skillMdPath);

        expect(result).toEqual({});
    });

    it("returns empty object for non-existent file", () => {
        const result = parseSkillMdFrontmatter("/non/existent/path/SKILL.md");
        expect(result).toEqual({});
    });
});

describe("detectSkillStructure", () => {
    let tempDir;

    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "skill-structure-"));
    });

    afterEach(() => {
        fs.rmSync(tempDir, { recursive: true, force: true });
    });

    it("detects standard directories", () => {
        fs.mkdirSync(path.join(tempDir, "resources"));
        fs.mkdirSync(path.join(tempDir, "examples"));
        fs.mkdirSync(path.join(tempDir, "scripts"));
        fs.writeFileSync(path.join(tempDir, "SKILL.md"), "# Skill");

        const result = detectSkillStructure(tempDir);

        expect(result.hasResources).toBe(true);
        expect(result.hasExamples).toBe(true);
        expect(result.hasScripts).toBe(true);
        expect(result.directories).toContain("resources");
        expect(result.directories).toContain("examples");
        expect(result.directories).toContain("scripts");
        expect(result.files).toContain("SKILL.md");
    });

    it("detects governance directories", () => {
        fs.mkdirSync(path.join(tempDir, "constitution"));
        fs.mkdirSync(path.join(tempDir, "doctrines"));
        fs.mkdirSync(path.join(tempDir, "enforcement"));
        fs.mkdirSync(path.join(tempDir, "proposals"));

        const result = detectSkillStructure(tempDir);

        expect(result.hasConstitution).toBe(true);
        expect(result.hasDoctrines).toBe(true);
        expect(result.hasEnforcement).toBe(true);
        expect(result.hasProposals).toBe(true);
    });

    it("returns empty structure for non-existent dir", () => {
        const result = detectSkillStructure("/non/existent/path");

        expect(result.directories).toEqual([]);
        expect(result.files).toEqual([]);
    });
});
