/**
 * E2E Test - /studio Workflow
 * Tests the design system generation workflow
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync } from 'child_process';
import { existsSync, readFileSync, rmSync, mkdirSync } from 'fs';
import { join } from 'path';

const PROJECT_ROOT = join(import.meta.dirname, '..', '..');
const STUDIO_SCRIPT = join(PROJECT_ROOT, '.agent', 'skills', 'studio', 'scripts-js', 'search.js');
const TEST_OUTPUT_DIR = join(PROJECT_ROOT, 'design-system', 'test-project');

describe('/studio Workflow E2E', () => {
    beforeAll(() => {
        // Clean up test output if exists
        if (existsSync(TEST_OUTPUT_DIR)) {
            rmSync(TEST_OUTPUT_DIR, { recursive: true, force: true });
        }
    });

    afterAll(() => {
        // Clean up after tests
        if (existsSync(TEST_OUTPUT_DIR)) {
            rmSync(TEST_OUTPUT_DIR, { recursive: true, force: true });
        }
    });

    describe('Design System Generation', () => {
        it('should generate design system with --design-system flag', () => {
            const cmd = `node "${STUDIO_SCRIPT}" "fintech dashboard minimal" --design-system -p "Test Project"`;

            const output = execSync(cmd, {
                cwd: PROJECT_ROOT,
                encoding: 'utf8',
                timeout: 30000
            });

            // Should contain key sections
            expect(output).toContain('PATTERN');
            expect(output).toContain('STYLE');
            expect(output).toContain('COLORS');
            expect(output).toContain('TYPOGRAPHY');
        });

        it('should persist design system with --persist flag', () => {
            const cmd = `node "${STUDIO_SCRIPT}" "ecommerce modern clean" --design-system --persist -p "test-project"`;

            const output = execSync(cmd, {
                cwd: PROJECT_ROOT,
                encoding: 'utf8',
                timeout: 30000
            });

            // Should indicate persistence
            expect(output).toContain('persisted') || expect(output).toContain('MASTER');
        });
    });

    describe('Domain Search', () => {
        it('should search style domain', () => {
            const cmd = `node "${STUDIO_SCRIPT}" "glassmorphism" --domain style`;

            const output = execSync(cmd, {
                cwd: PROJECT_ROOT,
                encoding: 'utf8',
                timeout: 15000
            });

            expect(output).toContain('style');
        });

        it('should search typography domain', () => {
            const cmd = `node "${STUDIO_SCRIPT}" "modern clean" --domain typography`;

            const output = execSync(cmd, {
                cwd: PROJECT_ROOT,
                encoding: 'utf8',
                timeout: 15000
            });

            expect(output).toContain('typography');
        });
    });

    describe('Error Handling', () => {
        it('should handle minimal query', () => {
            const cmd = `node "${STUDIO_SCRIPT}" "a" --domain style`;

            // Should not throw
            expect(() => {
                execSync(cmd, {
                    cwd: PROJECT_ROOT,
                    encoding: 'utf8',
                    timeout: 15000
                });
            }).not.toThrow();
        });
    });
});
