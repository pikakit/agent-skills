import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['tests/scripts/**/*.test.js'],
        environment: 'node',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: [
                '.agent/scripts-js/**/*.js',
                '.agent/studio/scripts-js/**/*.js'
            ],
            exclude: [
                '**/*.test.js',
                '**/node_modules/**',
                '**/*.config.js'
            ],
            thresholds: {
                lines: 80,
                functions: 80,
                branches: 75,
                statements: 80
            }
        },
        testTimeout: 10000
    }
});
