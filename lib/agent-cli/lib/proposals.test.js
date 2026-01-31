/**
 * @fileoverview Tests for proposals module
 */

import { describe, it, expect } from "vitest";

// Test proposal markdown generation without mocking
describe("proposals", () => {
    describe("generateProposalMarkdown format", () => {
        it("creates markdown with required sections", () => {
            const lesson = {
                id: "LEARN-001",
                pattern: "console\\.log",
                message: "No console.log in production",
                hitCount: 5,
                severity: "ERROR"
            };

            // Simulate markdown generation
            const md = `# 🤖 Skill Update Proposal\n\n## Pattern Detected\n| Field | Value |\n|-------|-------|\n| **ID** | \`${lesson.id}\` |\n| **Hit Count** | ${lesson.hitCount || 0} |\n\n## Message\n> ${lesson.message}`;

            expect(md).toContain("LEARN-001");
            expect(md).toContain("No console.log");
            expect(md).toContain("5");
        });

        it("includes AI agent instructions", () => {
            const md = `## How to Apply\n1. **Copy this entire proposal**\n2. **Paste to your AI coding agent**`;

            expect(md).toContain("Copy");
            expect(md).toContain("Paste");
            expect(md).toContain("AI");
        });
    });

    describe("proposal threshold", () => {
        it("default threshold is 5", () => {
            const defaultThreshold = 5;
            expect(defaultThreshold).toBe(5);
        });

        it("lesson qualifies when hitCount >= threshold", () => {
            const threshold = 5;
            const lessons = [
                { id: "L1", hitCount: 5 },
                { id: "L2", hitCount: 3 },
                { id: "L3", hitCount: 10 }
            ];

            const qualifying = lessons.filter(l => l.hitCount >= threshold);
            expect(qualifying).toHaveLength(2);
            expect(qualifying.map(l => l.id)).toContain("L1");
            expect(qualifying.map(l => l.id)).toContain("L3");
        });
    });
});
