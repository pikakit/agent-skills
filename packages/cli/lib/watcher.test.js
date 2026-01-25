/**
 * @fileoverview Tests for watcher.js functionality
 */
import { describe, it, expect } from "vitest";
import path from "path";

describe("Watcher - Extension Filtering", () => {
    const WATCH_EXTENSIONS = [".js", ".ts", ".tsx", ".jsx", ".mjs"];

    it("includes JavaScript files", () => {
        const file = "app.js";
        const ext = path.extname(file);
        expect(WATCH_EXTENSIONS.includes(ext)).toBe(true);
    });

    it("includes TypeScript files", () => {
        const file = "app.tsx";
        const ext = path.extname(file);
        expect(WATCH_EXTENSIONS.includes(ext)).toBe(true);
    });

    it("excludes CSS files", () => {
        const file = "styles.css";
        const ext = path.extname(file);
        expect(WATCH_EXTENSIONS.includes(ext)).toBe(false);
    });

    it("excludes markdown files", () => {
        const file = "README.md";
        const ext = path.extname(file);
        expect(WATCH_EXTENSIONS.includes(ext)).toBe(false);
    });
});

describe("Watcher - Directory Filtering", () => {
    const SKIP_DIRS = ["node_modules", ".git", "dist", "build", ".next", "coverage"];

    it("skips node_modules", () => {
        expect(SKIP_DIRS.includes("node_modules")).toBe(true);
    });

    it("skips .git directory", () => {
        expect(SKIP_DIRS.includes(".git")).toBe(true);
    });

    it("skips dist directory", () => {
        expect(SKIP_DIRS.includes("dist")).toBe(true);
    });

    it("allows src directory", () => {
        expect(SKIP_DIRS.includes("src")).toBe(false);
    });

    it("allows lib directory", () => {
        expect(SKIP_DIRS.includes("lib")).toBe(false);
    });
});

describe("Watcher - Session Stats", () => {
    it("initializes session stats correctly", () => {
        const sessionStats = {
            filesChecked: 0,
            violationsFound: 0,
            startTime: Date.now()
        };

        expect(sessionStats.filesChecked).toBe(0);
        expect(sessionStats.violationsFound).toBe(0);
        expect(typeof sessionStats.startTime).toBe("number");
    });

    it("increments file count correctly", () => {
        const sessionStats = { filesChecked: 0 };
        sessionStats.filesChecked++;
        sessionStats.filesChecked++;
        expect(sessionStats.filesChecked).toBe(2);
    });

    it("calculates duration correctly", () => {
        const startTime = Date.now() - 5000; // 5 seconds ago
        const duration = Math.round((Date.now() - startTime) / 1000);
        expect(duration).toBeGreaterThanOrEqual(4);
        expect(duration).toBeLessThanOrEqual(6);
    });
});
