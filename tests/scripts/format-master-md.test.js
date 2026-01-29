/**
 * Integration Test: formatMasterMd() - Complete MASTER.md Generation
 * ==================================================================
 * Tests the complete Phase 3 implementation
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { formatMasterMd } from '../../.agent/skills/studio/scripts-js/design_system.js';

describe('formatMasterMd - Integration Test', () => {
    let mockDesignSystem;

    beforeEach(() => {
        mockDesignSystem = {
            project_name: 'Test Project',
            category: 'SaaS Dashboard',
            pattern: {
                name: 'Hero + Features + CTA',
                sections: 'Hero > Features > Pricing > CTA',
                cta_placement: 'Above fold',
                conversion: 'Clear value proposition',
                color_strategy: 'Brand-driven'
            },
            style: {
                name: 'Minimalism',
                type: 'Modern',
                effects: 'Subtle hover transitions',
                keywords: 'Clean, simple, professional',
                best_for: 'SaaS, enterprise applications',
                performance: 'Excellent',
                accessibility: 'AAA compliant'
            },
            colors: {
                primary: '#2563EB',
                secondary: '#3B82F6',
                cta: '#F97316',
                background: '#F8FAFC',
                text: '#1E293B',
                notes: 'High contrast for accessibility'
            },
            typography: {
                heading: 'Inter',
                body: 'Inter',
                mood: 'Professional, modern',
                best_for: 'Body text, UI elements',
                google_fonts_url: 'https://fonts.google.com/specimen/Inter',
                css_import: '@import url(https://fonts.googleapis.com/css2?family=Inter);'
            },
            key_effects: 'Smooth transitions (200ms), subtle shadows',
            anti_patterns: 'Comic Sans + Excessive animations + Stock photos'
        };
    });

    test('includes logic header with override explanation', () => {
        const output = formatMasterMd(mockDesignSystem);

        expect(output).toContain('# Design System Master File');
        expect(output).toContain('> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.');
        expect(output).toContain('> If that file exists, its rules **override** this Master file.');
    });

    test('includes project metadata', () => {
        const output = formatMasterMd(mockDesignSystem);

        expect(output).toContain('**Project:** Test Project');
        expect(output).toContain('**Category:** SaaS Dashboard');
        expect(output).toMatch(/\*\*Generated:\*\* \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/); // ISO 8601 UTC
    });

    test('includes color palette with CSS variables', () => {
        const output = formatMasterMd(mockDesignSystem);

        expect(output).toContain('### Color Palette');
        expect(output).toContain('| Role | Hex | CSS Variable |');
        expect(output).toContain('| Primary | `#2563EB` | `--color-primary` |');
        expect(output).toContain('| CTA/Accent | `#F97316` | `--color-cta` |');
        expect(output).toContain('**Color Notes:** High contrast for accessibility');
    });

    test('includes typography with Google Fonts', () => {
        const output = formatMasterMd(mockDesignSystem);

        expect(output).toContain('### Typography');
        expect(output).toContain('- **Heading Font:** Inter');
        expect(output).toContain('- **Body Font:** Inter');
        expect(output).toContain('- **Mood:** Professional, modern');
        expect(output).toContain('- **Google Fonts:**');
        expect(output).toContain('**CSS Import:**');
        expect(output).toContain('@import url');
    });

    test('includes spacing variables table', () => {
        const output = formatMasterMd(mockDesignSystem);

        expect(output).toContain('### Spacing Variables');
        expect(output).toContain('| `--space-xs` | `4px` / `0.25rem` | Tight gaps |');
        expect(output).toContain('| `--space-md` | `16px` / `1rem` | Standard padding |');
        expect(output).toContain('| `--space-3xl` | `64px` / `4rem` | Hero padding |');
    });

    test('includes shadow depths table', () => {
        const output = formatMasterMd(mockDesignSystem);

        expect(output).toContain('### Shadow Depths');
        expect(output).toContain('| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |');
        expect(output).toContain('| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |');
    });

    test('includes button component specs', () => {
        const output = formatMasterMd(mockDesignSystem);

        expect(output).toContain('## Component Specs');
        expect(output).toContain('### Buttons');
        expect(output).toContain('.btn-primary {');
        expect(output).toContain('background: #F97316'); // CTA color
        expect(output).toContain('.btn-primary:hover {');
        expect(output).toContain('.btn-secondary {');
        expect(output).toContain('border: 2px solid #2563EB'); // Primary color
    });

    test('includes card component specs', () => {
        const output = formatMasterMd(mockDesignSystem);

        expect(output).toContain('### Cards');
        expect(output).toContain('.card {');
        expect(output).toContain('background: #F8FAFC'); // Background color
        expect(output).toContain('box-shadow: var(--shadow-md)');
        expect(output).toContain('.card:hover {');
        expect(output).toContain('box-shadow: var(--shadow-lg)');
    });

    test('includes input component specs', () => {
        const output = formatMasterMd(mockDesignSystem);

        expect(output).toContain('### Inputs');
        expect(output).toContain('.input {');
        expect(output).toContain('.input:focus {');
        expect(output).toContain('border-color: #2563EB'); // Primary color
        expect(output).toContain('box-shadow: 0 0 0 3px #2563EB20'); // Focus ring with opacity
    });

    test('includes modal component specs', () => {
        const output = formatMasterMd(mockDesignSystem);

        expect(output).toContain('### Modals');
        expect(output).toContain('.modal-overlay {');
        expect(output).toContain('backdrop-filter: blur(4px)');
        expect(output).toContain('.modal {');
        expect(output).toContain('box-shadow: var(--shadow-xl)');
    });

    test('includes style guidelines section', () => {
        const output = formatMasterMd(mockDesignSystem);

        expect(output).toContain('## Style Guidelines');
        expect(output).toContain('**Style:** Minimalism');
        expect(output).toContain('**Keywords:** Clean, simple, professional');
        expect(output).toContain('**Best For:** SaaS, enterprise applications');
        expect(output).toContain('**Key Effects:** Smooth transitions (200ms), subtle shadows');
    });

    test('includes page pattern section', () => {
        const output = formatMasterMd(mockDesignSystem);

        expect(output).toContain('### Page Pattern');
        expect(output).toContain('**Pattern Name:** Hero + Features + CTA');
        expect(output).toContain('- **Conversion Strategy:** Clear value proposition');
        expect(output).toContain('- **CTA Placement:** Above fold');
        expect(output).toContain('- **Section Order:** Hero > Features > Pricing > CTA');
    });

    test('includes anti-patterns section', () => {
        const output = formatMasterMd(mockDesignSystem);

        expect(output).toContain('## Anti-Patterns (Do NOT Use)');
        expect(output).toContain('- ❌ Comic Sans');
        expect(output).toContain('- ❌ Excessive animations');
        expect(output).toContain('- ❌ Stock photos');
        expect(output).toContain('### Additional Forbidden Patterns');
        expect(output).toContain('- ❌ **Emojis as icons** — Use SVG icons');
        expect(output).toContain('- ❌ **Missing cursor:pointer**');
        expect(output).toContain('- ❌ **Invisible focus states**');
    });

    test('includes pre-delivery checklist', () => {
        const output = formatMasterMd(mockDesignSystem);

        expect(output).toContain('## Pre-Delivery Checklist');
        expect(output).toContain('Before delivering any UI code, verify:');
        expect(output).toContain('- [ ] No emojis used as icons (use SVG instead)');
        expect(output).toContain('- [ ] All icons from consistent icon set (Heroicons/Lucide)');
        expect(output).toContain('- [ ] `cursor-pointer` on all clickable elements');
        expect(output).toContain('- [ ] Responsive: 375px, 768px, 1024px, 1440px');
        expect(output).toContain('- [ ] No content hidden behind fixed navbars');
        expect(output).toContain('- [ ] No horizontal scroll on mobile');
    });

    test('output is valid markdown', () => {
        const output = formatMasterMd(mockDesignSystem);

        // Check for proper heading levels
        expect(output).toContain('# Design System Master File');
        expect(output).toContain('## Global Rules');
        expect(output).toContain('### Color Palette');

        // Check for proper code blocks
        expect(output).toMatch(/```css\n[\s\S]*?```/); // CSS code blocks exist

        // Check for proper tables
        expect(output).toMatch(/\| .+ \| .+ \|/); // Table rows exist
    });

    test('handles missing optional fields gracefully', () => {
        const minimalDesignSystem = {
            project_name: 'Minimal',
            colors: {},
            typography: {},
            pattern: {},
            style: {},
            key_effects: '',
            anti_patterns: ''
        };

        const output = formatMasterMd(minimalDesignSystem);

        // Should still generate structure with defaults
        expect(output).toContain('# Design System Master File');
        expect(output).toContain('## Global Rules');
        expect(output).toContain('## Component Specs');
        expect(output).toContain('## Pre-Delivery Checklist');
    });
});
