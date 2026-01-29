import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        // Globals
        globals: true,
        
        // Environment
        environment: "node",
        
        // Test patterns
        include: ["lib/**/*.test.js", "tests/**/*.test.js"],
        
        // Timeouts
        testTimeout: 10000,
        hookTimeout: 10000,
        
        // Coverage
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['lib/**/*.js'],
            exclude: [
                '**/*.test.js',
                '**/node_modules/**',
                '**/tests/**'
            ],
            thresholds: {
                lines: 70,
                functions: 70,
                branches: 65,
                statements: 70
            }
        }
    }
});
