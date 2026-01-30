/**
 * @fileoverview Tests for helpers.js
 */
import { describe, it, expect } from "vitest";
import { formatBytes, formatDate, parseSkillSpec } from "./helpers.js";

describe("formatBytes", () => {
    it("formats bytes correctly", () => {
        expect(formatBytes(0)).toBe("0 B");
        expect(formatBytes(512)).toBe("512 B");
        expect(formatBytes(1024)).toBe("1.0 KB");
        expect(formatBytes(1536)).toBe("1.5 KB");
        expect(formatBytes(1048576)).toBe("1.0 MB");
        expect(formatBytes(1572864)).toBe("1.5 MB");
    });
});

describe("formatDate", () => {
    it("returns 'unknown' for undefined", () => {
        expect(formatDate()).toBe("unknown");
        expect(formatDate(undefined)).toBe("unknown");
    });

    it("formats ISO date strings", () => {
        const result = formatDate("2026-01-25T00:00:00.000Z");
        expect(result).toBeTruthy();
        expect(typeof result).toBe("string");
    });
});

describe("parseSkillSpec", () => {
    it("parses org/repo format", () => {
        const result = parseSkillSpec("agentskillkit/agent-skills");
        expect(result.org).toBe("agentskillkit");
        expect(result.repo).toBe("agent-skills");
        expect(result.skill).toBeUndefined();
        expect(result.ref).toBeUndefined();
    });

    it("parses org/repo#skill format", () => {
        const result = parseSkillSpec("agentskillkit/agent-skills#react-patterns");
        expect(result.org).toBe("agentskillkit");
        expect(result.repo).toBe("agent-skills");
        expect(result.skill).toBe("react-patterns");
    });

    it("parses org/repo#skill@ref format", () => {
        const result = parseSkillSpec("agentskillkit/agent-skills#react-patterns@v1.0.0");
        expect(result.org).toBe("agentskillkit");
        expect(result.repo).toBe("agent-skills");
        expect(result.skill).toBe("react-patterns");
        expect(result.ref).toBe("v1.0.0");
    });

    it("throws error for invalid spec", () => {
        expect(() => parseSkillSpec("")).toThrow("Skill spec is required");
        expect(() => parseSkillSpec("invalid")).toThrow("Invalid spec format");
        expect(() => parseSkillSpec(null)).toThrow("Skill spec is required");
    });
});
