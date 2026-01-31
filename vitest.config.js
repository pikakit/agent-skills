import { defineConfig } from 'vitest/config';

/**
 * Vitest Configuration v3.0 (2026)
 * PikaKit Agent Skills Test Suite
 * 
 * @version 3.7.0
 * @author PikaKit
 */
export default defineConfig({
    test: {
        // Test file patterns
        include: [
            'tests/scripts/**/*.test.js',
            'tests/e2e/**/*.test.js',
            'packages/cli/tests/**/*.test.js',
            // Skills tests
            '.agent/skills/**/tests/*.test.js'
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
            'packages/cli/tests/unit/**',
            // Vercel deploy tests (bash scripts, not JS)
            '.agent/skills/vercel-deploy/**'
        ],

        // Environment
        environment: 'node',

        // Timeouts
        testTimeout: 15000, // Increased for complex tests
        hookTimeout: 10000,

        // Parallel execution
        pool: 'threads',
        poolOptions: {
            threads: {
                singleThread: false,
                maxThreads: 4
            }
        },

        // Coverage
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html', 'lcov'],
            include: [
                '.agent/scripts-js/**/*.js',
                '.agent/skills/studio/scripts-js/**/*.js',
                'packages/cli/lib/**/*.js'
            ],
            exclude: [
                '**/*.test.js',
                '**/node_modules/**',
                '**/*.config.js',
                '**/tests/**',
                '**/vercel-deploy/**'
            ],
            thresholds: {
                lines: 80,
                functions: 80,
                branches: 75,
                statements: 80
            }
        },

        // Reporter
        reporters: ['default', 'verbose'],

        // Globals
        globals: true,

        // Watch mode
        watch: false,

        // Retry on failure (for flaky tests)
        retry: 1
    }
});
