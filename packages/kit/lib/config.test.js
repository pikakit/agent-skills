/**
 * @fileoverview Tests for config.js
 */
import { describe, it, expect } from 'vitest';
import * as config from './config.js';

describe('config.js', () => {
    describe('Path Constants', () => {
        it('should define cwd', () => {
            expect(config.cwd).toBeDefined();
            expect(typeof config.cwd).toBe('string');
        });

        it('should define WORKSPACE path', () => {
            expect(config.WORKSPACE).toBeDefined();
            expect(config.WORKSPACE).toContain('.agent');
            expect(config.WORKSPACE).toContain('skills');
        });

        it('should define GLOBAL_DIR path', () => {
            expect(config.GLOBAL_DIR).toBeDefined();
            expect(config.GLOBAL_DIR).toContain('.gemini');
        });

        it('should define CACHE_ROOT path', () => {
            expect(config.CACHE_ROOT).toBeDefined();
            expect(config.CACHE_ROOT).toContain('.cache');
        });

        it('should define REGISTRY_CACHE path', () => {
            expect(config.REGISTRY_CACHE).toBeDefined();
            expect(config.REGISTRY_CACHE).toContain('registries');
        });

        it('should define BACKUP_DIR path', () => {
            expect(config.BACKUP_DIR).toBeDefined();
            expect(config.BACKUP_DIR).toContain('backups');
        });
    });

    describe('Argument Parsing', () => {
        it('should define command', () => {
            expect(config.command).toBeDefined();
            expect(typeof config.command).toBe('string');
        });

        it('should define flags as Set', () => {
            expect(config.flags).toBeDefined();
            expect(config.flags instanceof Set).toBe(true);
        });

        it('should define params as array', () => {
            expect(config.params).toBeDefined();
            expect(Array.isArray(config.params)).toBe(true);
        });
    });

    describe('Flag Shortcuts', () => {
        it('should define GLOBAL flag', () => {
            expect(typeof config.GLOBAL).toBe('boolean');
        });

        it('should define VERBOSE flag', () => {
            expect(typeof config.VERBOSE).toBe('boolean');
        });

        it('should define JSON_OUTPUT flag', () => {
            expect(typeof config.JSON_OUTPUT).toBe('boolean');
        });

        it('should define FORCE flag', () => {
            expect(typeof config.FORCE).toBe('boolean');
        });

        it('should define DRY flag', () => {
            expect(typeof config.DRY).toBe('boolean');
        });

        it('should define FIX flag', () => {
            expect(typeof config.FIX).toBe('boolean');
        });

        it('should define STRICT flag', () => {
            expect(typeof config.STRICT).toBe('boolean');
        });

        it('should define LOCKED flag', () => {
            expect(typeof config.LOCKED).toBe('boolean');
        });

        it('should define OFFLINE flag', () => {
            expect(typeof config.OFFLINE).toBe('boolean');
        });
    });

    describe('Package Info', () => {
        it('should define VERSION', () => {
            expect(config.VERSION).toBeDefined();
            expect(typeof config.VERSION).toBe('string');
        });

        it('should have valid version format', () => {
            // Version should match semver pattern or be fallback
            expect(config.VERSION).toMatch(/^\d+\.\d+\.\d+/);
        });
    });
});
