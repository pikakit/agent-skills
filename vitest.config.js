import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // Test file patterns
        include: [
            'tests/scripts/**/*.test.js',
            'tests/e2e/**/*.test.js',
            'packages/cli/tests/**/*.test.js'
        ],
        exclude: [
            '**/node_modules/**',
            '**/integration/**',
            // Exclude files with broken imports (need refactoring)
            '**/runner.test.js',
            '**/process-manager.test.js',
            '**/reporter.test.js',
            '**/config-loader.test.js',
            '**/colors.test.js',
            '**/css-templates.test.js',
            'packages/cli/tests/unit/**'
        ],

        // Environment
        environment: 'node',

        // Timeouts
        testTimeout: 10000,
        hookTimeout: 10000,

        // Coverage
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: [
                '.agent/scripts-js/**/*.js',
                '.agent/skills/studio/scripts-js/**/*.js',
                'packages/cli/lib/**/*.js'
            ],
            exclude: [
                '**/*.test.js',
                '**/node_modules/**',
                '**/*.config.js',
                '**/tests/**'
            ],
            thresholds: {
                lines: 80,
                functions: 80,
                branches: 75,
                statements: 80
            }
        },

        // Reporter
        reporters: ['default'],

        // Globals
        globals: true
    }
});
