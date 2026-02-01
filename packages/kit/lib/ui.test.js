/**
 * @fileoverview Tests for ui.js
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as ui from './ui.js';

describe('ui.js', () => {
    describe('Symbols (S)', () => {
        it('should export symbols object', () => {
            expect(ui.S).toBeDefined();
            expect(typeof ui.S).toBe('object');
        });

        it('should have branch symbol', () => {
            expect(ui.S.branch).toBe('│');
        });

        it('should have diamond symbol', () => {
            expect(ui.S.diamond).toBe('◇');
        });

        it('should have diamondFilled symbol', () => {
            expect(ui.S.diamondFilled).toBe('◆');
        });

        it('should have check symbol', () => {
            expect(ui.S.check).toBe('✓');
        });

        it('should have cross symbol', () => {
            expect(ui.S.cross).toBe('x');
        });

        it('should have arrow symbol', () => {
            expect(ui.S.arrow).toBe('→');
        });
    });

    describe('Colors (c)', () => {
        it('should export colors object', () => {
            expect(ui.c).toBeDefined();
            expect(typeof ui.c).toBe('object');
        });

        it('should have cyan color function', () => {
            expect(typeof ui.c.cyan).toBe('function');
        });

        it('should have green color function', () => {
            expect(typeof ui.c.green).toBe('function');
        });

        it('should have red color function', () => {
            expect(typeof ui.c.red).toBe('function');
        });

        it('should have dim color function', () => {
            expect(typeof ui.c.dim).toBe('function');
        });

        it('should have bold style function', () => {
            expect(typeof ui.c.bold).toBe('function');
        });
    });

    describe('Functions', () => {
        it('should export spinner function', () => {
            expect(typeof ui.spinner).toBe('function');
        });

        it('should export step function', () => {
            expect(typeof ui.step).toBe('function');
        });

        it('should export activeStep function', () => {
            expect(typeof ui.activeStep).toBe('function');
        });

        it('should export stepLine function', () => {
            expect(typeof ui.stepLine).toBe('function');
        });

        it('should export fatal function', () => {
            expect(typeof ui.fatal).toBe('function');
        });

        it('should export success function', () => {
            expect(typeof ui.success).toBe('function');
        });

        it('should export outputJSON function', () => {
            expect(typeof ui.outputJSON).toBe('function');
        });

        it('should export box function', () => {
            expect(typeof ui.box).toBe('function');
        });

        it('should export brandedIntro function', () => {
            expect(typeof ui.brandedIntro).toBe('function');
        });
    });

    describe('Prompts', () => {
        it('should export selectAgentsPrompt function', () => {
            expect(typeof ui.selectAgentsPrompt).toBe('function');
        });

        it('should export selectScopePrompt function', () => {
            expect(typeof ui.selectScopePrompt).toBe('function');
        });

        it('should export selectMethodPrompt function', () => {
            expect(typeof ui.selectMethodPrompt).toBe('function');
        });

        it('should export selectSkillsPrompt function', () => {
            expect(typeof ui.selectSkillsPrompt).toBe('function');
        });
    });

    describe('Spinner', () => {
        it('spinner should return object with methods', () => {
            const s = ui.spinner();
            expect(typeof s.start).toBe('function');
            expect(typeof s.stop).toBe('function');
            expect(typeof s.fail).toBe('function');
            expect(typeof s.message).toBe('function');
        });
    });

    describe('outputJSON', () => {
        let consoleSpy;

        beforeEach(() => {
            consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });
        });

        afterEach(() => {
            consoleSpy.mockRestore();
        });

        it('should output JSON when jsonMode is true', () => {
            ui.outputJSON({ test: 'data' }, true);
            expect(consoleSpy).toHaveBeenCalled();
            const output = consoleSpy.mock.calls[0][0];
            expect(JSON.parse(output)).toEqual({ test: 'data' });
        });

        it('should not output when jsonMode is false', () => {
            ui.outputJSON({ test: 'data' }, false);
            expect(consoleSpy).not.toHaveBeenCalled();
        });
    });
});
