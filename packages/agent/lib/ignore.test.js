/**
 * @fileoverview Tests for ignore module
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";

// Import directly without mocking - test actual behavior
import { loadIgnorePatterns, isIgnored } from "./ignore.js";

describe("ignore", () => {
    describe("isIgnored", () => {
        it("returns false when no patterns", () => {
            const result = isIgnored("some/path.js", []);
            expect(result).toBe(false);
        });

        it("matches exact pattern", () => {
            const result = isIgnored("node_modules/pkg/file.js", ["node_modules"]);
            expect(result).toBe(true);
        });

        it("matches glob pattern", () => {
            const result = isIgnored("debug.log", ["*.log"]);
            expect(result).toBe(true);
        });

        it("returns false for non-matching path", () => {
            const result = isIgnored("src/app.js", ["*.log", "node_modules"]);
            expect(result).toBe(false);
        });

        it("matches directory pattern", () => {
            const result = isIgnored("dist/bundle.js", ["dist/**"]);
            expect(result).toBe(true);
        });

        it("matches nested paths", () => {
            const result = isIgnored(".git/objects/pack", [".git/**"]);
            expect(result).toBe(true);
        });
    });

    describe("loadIgnorePatterns", () => {
        it("returns array of patterns", () => {
            const patterns = loadIgnorePatterns();
            expect(Array.isArray(patterns)).toBe(true);
        });

        it("includes default patterns", () => {
            const patterns = loadIgnorePatterns();
            // Should have at least some patterns (defaults or from file)
            expect(patterns.length).toBeGreaterThan(0);
        });
    });
});
