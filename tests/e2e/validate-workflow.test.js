/**
 * E2E Test - /validate Workflow
 * Tests the validation and checking scripts
 */
import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import { join } from 'path';

const PROJECT_ROOT = join(import.meta.dirname, '..', '..');
const SKILL_VALIDATOR = join(PROJECT_ROOT, '.agent', 'scripts-js', 'skill-validator.js');
const CHECKLIST = join(PROJECT_ROOT, '.agent', 'scripts-js', 'checklist.js');

describe('/validate Workflow E2E', () => {
    describe('Skill Validator', () => {
        it('should validate all skills successfully', () => {
            const cmd = `node "${SKILL_VALIDATOR}"`;

            const output = execSync(cmd, {
                cwd: PROJECT_ROOT,
                encoding: 'utf8',
                timeout: 30000
            });

            expect(output).toContain('Skill Standard Validation Report');
            expect(output).toContain('Valid:');
            // Should have zero invalid
            expect(output).toContain('Invalid: 0');
        });

        it('should validate specific skill by name', () => {
            const cmd = `node "${SKILL_VALIDATOR}" studio`;

            const output = execSync(cmd, {
                cwd: PROJECT_ROOT,
                encoding: 'utf8',
                timeout: 15000
            });

            expect(output).toContain('Validation Report');
        });
    });

    describe('Checklist Script', () => {
        it('should have checklist script available', () => {
            // Verify script exists
            const fs = require('fs');
            expect(fs.existsSync(CHECKLIST)).toBe(true);
        });
    });

    describe('Registry Validation', () => {
        it('should have valid JSON in registry', () => {
            const registryPath = join(PROJECT_ROOT, '.agent', 'skills', 'registry.json');

            expect(() => {
                const content = require(registryPath);
                expect(content.skills).toBeDefined();
                expect(Array.isArray(content.skills)).toBe(true);
                expect(content.skills.length).toBeGreaterThan(0);
            }).not.toThrow();
        });

        it('should have version in registry', () => {
            const registryPath = join(PROJECT_ROOT, '.agent', 'skills', 'registry.json');
            const content = require(registryPath);

            expect(content.version).toBeDefined();
            expect(content.updatedAt).toBeDefined();
        });
    });
});
