/**
 * Vitest configuration for packages/kit
 * @version 1.2.0
 */
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["lib/**/*.test.js"],
        exclude: ["node_modules/**"],
        globals: true,
        testTimeout: 10000,
        hookTimeout: 10000,
        reporters: ["verbose"],
        coverage: {
            enabled: false,
            provider: "v8",
            reporter: ["text", "html"],
            include: ["lib/**/*.js"],
            exclude: ["**/*.test.js"]
        }
    }
});
