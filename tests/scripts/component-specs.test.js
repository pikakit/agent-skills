/**
 * Component Specs Tests - Studio Design System
 * =============================================
 * Unit tests for component CSS generators
 */

import { describe, test, expect } from 'vitest';
import {
    generateButtonSpecs,
    generateCardSpecs,
    generateInputSpecs,
    generateModalSpecs,
    generateComponentSpecs
} from '../../.agent/studio/scripts-js/utils/component-specs.js';

describe('Component Spec Generators', () => {
    const mockColors = {
        primary: '#2563EB',
        secondary: '#3B82F6',
        cta: '#F97316',
        background: '#F8FAFC',
        text: '#1E293B'
    };

    describe('generateButtonSpecs', () => {
        test('generates primary and secondary button CSS', () => {
            const css = generateButtonSpecs(mockColors);

            expect(css).toContain('### Buttons');
            expect(css).toContain('.btn-primary {');
            expect(css).toContain('.btn-secondary {');
        });

        test('uses CTA color for primary button', () => {
            const css = generateButtonSpecs(mockColors);
            expect(css).toContain('background: #F97316'); // CTA color
        });

        test('uses primary color for secondary button', () => {
            const css = generateButtonSpecs(mockColors);
            expect(css).toContain('color: #2563EB'); // Primary color
            expect(css).toContain('border: 2px solid #2563EB');
        });

        test('includes hover states', () => {
            const css = generateButtonSpecs(mockColors);
            expect(css).toContain('.btn-primary:hover {');
            expect(css).toContain('opacity: 0.9');
            expect(css).toContain('transform: translateY(-1px)');
        });

        test('handles missing colors with fallbacks', () => {
            const css = generateButtonSpecs(null);
            expect(css).toContain('#F97316'); // Default CTA
            expect(css).toContain('#2563EB'); // Default primary
        });
    });

    describe('generateCardSpecs', () => {
        test('generates card CSS with hover state', () => {
            const css = generateCardSpecs(mockColors);

            expect(css).toContain('### Cards');
            expect(css).toContain('.card {');
            expect(css).toContain('.card:hover {');
        });

        test('uses background color from design system', () => {
            const css = generateCardSpecs(mockColors);
            expect(css).toContain('background: #F8FAFC');
        });

        test('includes shadow variables', () => {
            const css = generateCardSpecs(mockColors);
            expect(css).toContain('var(--shadow-md)');
            expect(css).toContain('var(--shadow-lg)');
        });

        test('includes transition and cursor', () => {
            const css = generateCardSpecs(mockColors);
            expect(css).toContain('transition: all 200ms ease');
            expect(css).toContain('cursor: pointer');
        });
    });

    describe('generateInputSpecs', () => {
        test('generates input CSS with focus state', () => {
            const css = generateInputSpecs(mockColors);

            expect(css).toContain('### Inputs');
            expect(css).toContain('.input {');
            expect(css).toContain('.input:focus {');
        });

        test('uses primary color for focus state', () => {
            const css = generateInputSpecs(mockColors);
            expect(css).toContain('border-color: #2563EB');
            expect(css).toContain('box-shadow: 0 0 0 3px #2563EB20'); // With 20% opacity
        });

        test('includes outline: none', () => {
            const css = generateInputSpecs(mockColors);
            expect(css).toContain('outline: none');
        });
    });

    describe('generateModalSpecs', () => {
        test('generates modal and overlay CSS', () => {
            const css = generateModalSpecs();

            expect(css).toContain('### Modals');
            expect(css).toContain('.modal-overlay {');
            expect(css).toContain('.modal {');
        });

        test('includes backdrop-filter blur', () => {
            const css = generateModalSpecs();
            expect(css).toContain('backdrop-filter: blur(4px)');
        });

        test('includes shadow variable', () => {
            const css = generateModalSpecs();
            expect(css).toContain('var(--shadow-xl)');
        });

        test('includes responsive width', () => {
            const css = generateModalSpecs();
            expect(css).toContain('max-width: 500px');
            expect(css).toContain('width: 90%');
        });
    });

    describe('generateComponentSpecs', () => {
        test('combines all component types', () => {
            const specs = generateComponentSpecs(mockColors);

            expect(specs).toContain('## Component Specs');
            expect(specs).toContain('### Buttons');
            expect(specs).toContain('### Cards');
            expect(specs).toContain('### Inputs');
            expect(specs).toContain('### Modals');
        });

        test('includes section separators', () => {
            const specs = generateComponentSpecs(mockColors);
            expect(specs).toContain('---');
        });

        test('has proper spacing between sections', () => {
            const specs = generateComponentSpecs(mockColors);
            const lines = specs.split('\n');

            // Should have empty lines between sections
            expect(lines.some(line => line === '')).toBe(true);
        });
    });
});
