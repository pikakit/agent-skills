/**
 * Page Override Formatter Tests - Studio Design System
 * =====================================================
 * Unit tests for formatPageOverrideMd() function
 */

import { describe, test, expect, vi, beforeEach } from 'vitest';
import { formatPageOverrideMd } from '../../.agent/studio/scripts-js/utils/page-override-formatter.js';
import * as intelligentOverridesModule from '../../.agent/studio/scripts-js/utils/intelligent-overrides.js';

// Mock generateIntelligentOverrides
vi.mock('../../.agent/studio/scripts-js/utils/intelligent-overrides.js', () => ({
    generateIntelligentOverrides: vi.fn()
}));

describe('formatPageOverrideMd', () => {
    const mockDesignSystem = {
        project_name: 'Test Project'
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('generates complete page override file with all sections', async () => {
        intelligentOverridesModule.generateIntelligentOverrides.mockResolvedValue({
            page_type: 'Dashboard / Data View',
            layout: { 'Max Width': '1400px', 'Grid': '12-column' },
            spacing: { 'Content Density': 'High' },
            typography: {},
            colors: { 'Strategy': 'Data-focused' },
            components: ['Use data tables'],
            unique_components: ['Chart.js integration'],
            recommendations: ['Optimize for large datasets', 'Use lazy loading']
        });

        const output = await formatPageOverrideMd(mockDesignSystem, 'dashboard', 'analytics');

        // Header section
        expect(output).toContain('# Dashboard Page Overrides');
        expect(output).toContain('> **PROJECT:** Test Project');
        expect(output).toContain('> **Page Type:** Dashboard / Data View');
        expect(output).toContain('> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file');

        // Layout overrides
        expect(output).toContain('### Layout Overrides');
        expect(output).toContain('- **Max Width:** 1400px');
        expect(output).toContain('- **Grid:** 12-column');

        // Spacing overrides
        expect(output).toContain('### Spacing Overrides');
        expect(output).toContain('- **Content Density:** High');

        // Color overrides
        expect(output).toContain('### Color Overrides');
        expect(output).toContain('- **Strategy:** Data-focused');

        // Component overrides
        expect(output).toContain('### Component Overrides');
        expect(output).toContain('- Use data tables');

        // Unique components
        expect(output).toContain('## Page-Specific Components');
        expect(output).toContain('- Chart.js integration');

        // Recommendations
        expect(output).toContain('## Recommendations');
        expect(output).toContain('- Optimize for large datasets');
        expect(output).toContain('- Use lazy loading');
    });

    test('handles empty overrides with fallback messages', async () => {
        intelligentOverridesModule.generateIntelligentOverrides.mockResolvedValue({
            page_type: 'General',
            layout: {},
            spacing: {},
            typography: {},
            colors: {},
            components: [],
            unique_components: [],
            recommendations: ['Refer to MASTER.md']
        });

        const output = await formatPageOverrideMd(mockDesignSystem, 'generic-page');

        expect(output).toContain('- No overrides — use Master layout');
        expect(output).toContain('- No overrides — use Master spacing');
        expect(output).toContain('- No overrides — use Master typography');
        expect(output).toContain('- No overrides — use Master colors');
        expect(output).toContain('- No overrides — use Master component specs');
        expect(output).toContain('- No unique components for this page');
    });

    test('formats page title correctly from slug', async () => {
        intelligentOverridesModule.generateIntelligentOverrides.mockResolvedValue({
            page_type: 'General',
            layout: {},
            spacing: {},
            typography: {},
            colors: {},
            components: [],
            unique_components: [],
            recommendations: []
        });

        const output = await formatPageOverrideMd(mockDesignSystem, 'checkout-page');
        expect(output).toContain('# Checkout Page Page Overrides');

        const output2 = await formatPageOverrideMd(mockDesignSystem, 'user_profile');
        expect(output2).toContain('# User Profile Page Overrides');
    });

    test('includes timestamp in ISO format', async () => {
        intelligentOverridesModule.generateIntelligentOverrides.mockResolvedValue({
            page_type: 'General',
            layout: {},
            spacing: {},
            typography: {},
            colors: {},
            components: [],
            unique_components: [],
            recommendations: []
        });

        const output = await formatPageOverrideMd(mockDesignSystem, 'test');
        expect(output).toMatch(/> \*\*Generated:\*\* \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/);
    });

    test('passes page query to intelligent overrides', async () => {
        intelligentOverridesModule.generateIntelligentOverrides.mockResolvedValue({
            page_type: 'General',
            layout: {},
            spacing: {},
            typography: {},
            colors: {},
            components: [],
            unique_components: [],
            recommendations: []
        });

        await formatPageOverrideMd(mockDesignSystem, 'dashboard', 'SaaS analytics');

        expect(intelligentOverridesModule.generateIntelligentOverrides)
            .toHaveBeenCalledWith('dashboard', 'SaaS analytics', mockDesignSystem);
    });

    test('uses project name from design system', async () => {
        const customDesignSystem = {
            project_name: 'My Custom Project'
        };

        intelligentOverridesModule.generateIntelligentOverrides.mockResolvedValue({
            page_type: 'General',
            layout: {},
            spacing: {},
            typography: {},
            colors: {},
            components: [],
            unique_components: [],
            recommendations: []
        });

        const output = await formatPageOverrideMd(customDesignSystem, 'test');
        expect(output).toContain('> **PROJECT:** My Custom Project');
    });

    test('includes all required sections in order', async () => {
        intelligentOverridesModule.generateIntelligentOverrides.mockResolvedValue({
            page_type: 'General',
            layout: {},
            spacing: {},
            typography: {},
            colors: {},
            components: [],
            unique_components: [],
            recommendations: []
        });

        const output = await formatPageOverrideMd(mockDesignSystem, 'test');

        const sections = [
            'Page Overrides',
            '## Page-Specific Rules',
            '### Layout Overrides',
            '### Spacing Overrides',
            '### Typography Overrides',
            '### Color Overrides',
            '### Component Overrides',
            '## Page-Specific Components',
            '## Recommendations'
        ];

        let lastIndex = -1;
        for (const section of sections) {
            const index = output.indexOf(section);
            expect(index).toBeGreaterThan(lastIndex);
            lastIndex = index;
        }
    });

    test('output is valid markdown', async () => {
        intelligentOverridesModule.generateIntelligentOverrides.mockResolvedValue({
            page_type: 'Dashboard',
            layout: { 'Max Width': '1400px' },
            spacing: {},
            typography: {},
            colors: {},
            components: [],
            unique_components: [],
            recommendations: ['Test recommendation']
        });

        const output = await formatPageOverrideMd(mockDesignSystem, 'dashboard');

        // Check for proper heading levels
        expect(output).toContain('# Dashboard Page Overrides');
        expect(output).toContain('## Page-Specific Rules');
        expect(output).toContain('### Layout Overrides');

        // Check for proper lists
        expect(output).toMatch(/- \*\*[^:]+:\*\* [^\n]+/); // Bold key-value pairs
        expect(output).toMatch(/- [^\n]+/); // Simple list items

        // Check for blockquotes
        expect(output).toMatch(/> [^\n]+/);
    });
});
