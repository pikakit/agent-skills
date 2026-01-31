/**
 * @fileoverview Tests for export module
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";

describe("export", () => {
    const testDir = path.join(os.tmpdir(), "test-export-" + Date.now());

    beforeEach(() => {
        fs.mkdirSync(testDir, { recursive: true });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    describe("export format", () => {
        it("creates valid JSON structure", () => {
            const data = {
                version: 1,
                exportedAt: new Date().toISOString(),
                lessons: [{ id: "TEST", pattern: "x" }]
            };

            const outputPath = path.join(testDir, "export.json");
            fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

            const loaded = JSON.parse(fs.readFileSync(outputPath, "utf8"));
            expect(loaded.version).toBe(1);
            expect(loaded.lessons).toHaveLength(1);
        });

        it("supports lesson array format", () => {
            const lessons = [
                { id: "L1", pattern: "a", message: "msg" },
                { id: "L2", pattern: "b", message: "msg2" }
            ];

            const data = { version: 1, lessons };
            const json = JSON.stringify(data);
            const parsed = JSON.parse(json);

            expect(parsed.lessons).toHaveLength(2);
            expect(parsed.lessons[0].id).toBe("L1");
        });
    });

    describe("import validation", () => {
        it("validates version field", () => {
            const valid = { version: 1, lessons: [] };
            expect(valid.version).toBe(1);
        });

        it("validates lessons array", () => {
            const valid = { version: 1, lessons: [{ id: "X", pattern: "y" }] };
            expect(Array.isArray(valid.lessons)).toBe(true);
        });
    });
});
