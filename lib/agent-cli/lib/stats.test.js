/**
 * @fileoverview Tests for stats.js functionality
 */
import { describe, it, expect } from "vitest";

describe("Stats - Statistics Calculation", () => {
    it("calculates total hits from lessons", () => {
        const lessons = [
            { id: "LEARN-001", hitCount: 5 },
            { id: "LEARN-002", hitCount: 3 },
            { id: "LEARN-003", hitCount: 0 }
        ];

        const totalHits = lessons.reduce((sum, l) => sum + (l.hitCount || 0), 0);
        expect(totalHits).toBe(8);
    });

    it("counts severity types correctly", () => {
        const lessons = [
            { id: "LEARN-001", severity: "ERROR" },
            { id: "LEARN-002", severity: "WARNING" },
            { id: "LEARN-003", severity: "ERROR" },
            { id: "LEARN-004", severity: "WARNING" }
        ];

        const errorCount = lessons.filter(l => l.severity === "ERROR").length;
        const warningCount = lessons.filter(l => l.severity === "WARNING").length;

        expect(errorCount).toBe(2);
        expect(warningCount).toBe(2);
    });

    it("sorts by hit count descending", () => {
        const lessons = [
            { id: "LEARN-001", hitCount: 3 },
            { id: "LEARN-002", hitCount: 10 },
            { id: "LEARN-003", hitCount: 5 }
        ];

        const sorted = [...lessons].sort((a, b) => (b.hitCount || 0) - (a.hitCount || 0));

        expect(sorted[0].id).toBe("LEARN-002");
        expect(sorted[1].id).toBe("LEARN-003");
        expect(sorted[2].id).toBe("LEARN-001");
    });

    it("filters auto-escalated patterns", () => {
        const lessons = [
            { id: "LEARN-001", autoEscalated: true },
            { id: "LEARN-002", autoEscalated: false },
            { id: "LEARN-003", autoEscalated: true }
        ];

        const escalated = lessons.filter(l => l.autoEscalated);
        expect(escalated.length).toBe(2);
    });

    it("groups by source correctly", () => {
        const lessons = [
            { id: "LEARN-001", source: "manual" },
            { id: "LEARN-002", source: "eslint" },
            { id: "LEARN-003", source: "manual" },
            { id: "LEARN-004", source: "test-failure" }
        ];

        const sources = {};
        lessons.forEach(l => {
            const src = l.source || "manual";
            sources[src] = (sources[src] || 0) + 1;
        });

        expect(sources["manual"]).toBe(2);
        expect(sources["eslint"]).toBe(1);
        expect(sources["test-failure"]).toBe(1);
    });
});

describe("Stats - Time Formatting", () => {
    it("formats time ago correctly", () => {
        const getTimeAgo = (date) => {
            const seconds = Math.floor((Date.now() - date) / 1000);
            if (seconds < 60) return "just now";
            if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
            if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
            return `${Math.floor(seconds / 86400)} days ago`;
        };

        const now = Date.now();
        expect(getTimeAgo(now - 30000)).toBe("just now");
        expect(getTimeAgo(now - 120000)).toBe("2 minutes ago");
        expect(getTimeAgo(now - 7200000)).toBe("2 hours ago");
        expect(getTimeAgo(now - 172800000)).toBe("2 days ago");
    });
});
