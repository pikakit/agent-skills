/**
 * CSS Template Tests - Studio Design System
 * ==========================================
 * Unit tests for CSS variable generators
 */

import { describe, test, expect } from 'vitest';
import {
    generateColorVars,
    generateSpacingScale,
    generateShadowDepths,
    generateBorderRadiusScale,
    generateTokenSystem
} from '../../.agent/studio/scripts-js/utils/css-templates.js';

describe('CSS Template Generators', () => {
    describe('generateColorVars', () => {
        test('generates valid CSS custom properties', () => {
            const colors = {
                primary: '#2563EB',
                secondary: '#3B82F6',
                cta: '#F97316',
                background: '#F8FAFC',
                text: '#1E293B',
                border: '#E2E8F0'
            };

            const css = generateColorVars(colors);

            expect(css).toContain(':root {');
            expect(css).toContain('--color-primary: #2563EB;');
            expect(css).toContain('--color-secondary: #3B82F6;');
            expect(css).toContain('--color-cta: #F97316;');
            expect(css).toContain('}');
        });

        test('handles missing colors gracefully', () => {
            const colors = {
                primary: '#2563EB'
            };

            const css = generateColorVars(colors);

            expect(css).toContain('--color-primary: #2563EB');
            expect(css).not.toContain('--color-secondary');
        });

        test('returns empty string for null input', () => {
            const css = generateColorVars(null);
            expect(css).toBe('');
        });
    });

    describe('generateSpacingScale', () => {
        test('generates 7-level spacing scale', () => {
            const css = generateSpacingScale();

            expect(css).toContain('--spacing-xs: 4px');
            expect(css).toContain('--spacing-sm: 8px');
            expect(css).toContain('--spacing-md: 16px');
            expect(css).toContain('--spacing-lg: 24px');
            expect(css).toContain('--spacing-xl: 32px');
            expect(css).toContain('--spacing-2xl: 48px');
            expect(css).toContain('--spacing-3xl: 64px');
        });

        test('includes usage examples', () => {
            const css = generateSpacingScale();
            expect(css).toContain('Usage Examples');
        });
    });

    describe('generateShadowDepths', () => {
        test('generates 4-level shadow system', () => {
            const css = generateShadowDepths();

            expect(css).toContain('--shadow-sm:');
            expect(css).toContain('--shadow-md:');
            expect(css).toContain('--shadow-lg:');
            expect(css).toContain('--shadow-xl:');
        });

        test('shadows use rgba values', () => {
            const css = generateShadowDepths();
            expect(css).toContain('rgba(0, 0, 0,');
        });
    });

    describe('generateBorderRadiusScale', () => {
        test('generates border radius variables', () => {
            const css = generateBorderRadiusScale();

            expect(css).toContain('--radius-none: 0');
            expect(css).toContain('--radius-sm:');
            expect(css).toContain('--radius-md:');
            expect(css).toContain('--radius-full: 9999px');
        });
    });

    describe('generateTokenSystem', () => {
        test('combines all token categories', () => {
            const colors = {
                primary: '#2563EB',
                secondary: '#3B82F6'
            };

            const tokens = generateTokenSystem(colors);

            expect(tokens).toContain('Design Tokens');
            expect(tokens).toContain('Colors');
            expect(tokens).toContain('Spacing Scale');
            expect(tokens).toContain('Shadow Depths');
            expect(tokens).toContain('Border Radius');
        });

        test('handles empty color data', () => {
            const tokens = generateTokenSystem(null);

            expect(tokens).toContain('Spacing Scale');
            expect(tokens).toContain('Shadow Depths');
        });
    });
});
