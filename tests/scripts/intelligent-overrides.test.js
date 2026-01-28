/**
 * Intelligent Override Tests - Studio Design System
 * ==================================================
 * Unit tests for generateIntelligentOverrides() function
 */

import { describe, test, expect, vi, beforeEach } from 'vitest';
import { generateIntelligentOverrides } from '../../.agent/studio/scripts-js/utils/intelligent-overrides.js';
import * as coreModule from '../../.agent/studio/scripts-js/core.js';

// Mock the search function
vi.mock('../../.agent/studio/scripts-js/core.js', () => ({
    search: vi.fn()
}));

describe('generateIntelligentOverrides', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('detects dashboard page type and infers data-dense layout', async () => {
        // Mock search results for dashboard context
        coreModule.search
            .mockResolvedValueOnce({
                // Style search - data-heavy keywords
                results: [{
                    'Style Category': 'Data Visualization',
                    'Keywords': 'dashboard, data, dense, grid',
                    'Best For': 'Analytics dashboards',
                    'Effects & Animation': 'Smooth data transitions'
                }]
            })
            .mockResolvedValueOnce({ results: [] }) // UX search
            .mockResolvedValueOnce({ results: [] }); // Landing search

        const overrides = await generateIntelligentOverrides('dashboard', 'analytics', {});

        expect(overrides.page_type).toBe('Dashboard / Data View');
        expect(overrides.layout['Max Width']).toBe('1400px or full-width');
        expect(overrides.layout['Grid']).toBe('12-column grid for data flexibility');
        expect(overrides.spacing['Content Density']).toBe('High — optimize for information display');
        expect(overrides.recommendations).toContain('Effects: Smooth data transitions');
    });

    test('detects minimal style and infers narrow layout', async () => {
        coreModule.search
            .mockResolvedValueOnce({
                results: [{
                    'Style Category': 'Minimalism',
                    'Keywords': 'minimal, clean, simple',
                    'Best For': 'Content-focused pages',
                    'Effects & Animation': 'Subtle fades'
                }]
            })
            .mockResolvedValueOnce({ results: [] })
            .mockResolvedValueOnce({ results: [] });

        const overrides = await generateIntelligentOverrides('content', 'blog post', {});

        expect(overrides.layout['Max Width']).toBe('800px (narrow, focused)');
        expect(overrides.layout['Layout']).toBe('Single column, centered');
        expect(overrides.spacing['Content Density']).toBe('Low — focus on clarity');
    });

    test('extracts UX recommendations from search results', async () => {
        coreModule.search
            .mockResolvedValueOnce({ results: [] }) // Style
            .mockResolvedValueOnce({
                // UX search with guidelines
                results: [
                    {
                        'Category': 'Form UX',
                        'Do': 'Show field validation inline',
                        "Don't": 'Hide error messages'
                    },
                    {
                        'Category': 'Navigation',
                        'Do': 'Keep primary actions visible',
                        "Don't": 'Bury actions in menus'
                    }
                ]
            })
            .mockResolvedValueOnce({ results: [] }); // Landing

        const overrides = await generateIntelligentOverrides('checkout', '', {});

        expect(overrides.recommendations).toContain('Form UX: Show field validation inline');
        expect(overrides.recommendations).toContain('Navigation: Keep primary actions visible');
        expect(overrides.components).toContain('Avoid: Hide error messages');
        expect(overrides.components).toContain('Avoid: Bury actions in menus');
    });

    test('extracts landing pattern info', async () => {
        coreModule.search
            .mockResolvedValueOnce({ results: [] })
            .mockResolvedValueOnce({ results: [] })
            .mockResolvedValueOnce({
                // Landing search
                results: [{
                    'Section Order': 'Hero > Features > Testimonials > CTA',
                    'Primary CTA Placement': 'Above fold, right side',
                    'Color Strategy': 'Bold CTA with neutral background'
                }]
            });

        const overrides = await generateIntelligentOverrides('landing', 'marketing page', {});

        expect(overrides.layout['Sections']).toBe('Hero > Features > Testimonials > CTA');
        expect(overrides.recommendations).toContain('CTA Placement: Above fold, right side');
        expect(overrides.colors['Strategy']).toBe('Bold CTA with neutral background');
    });

    test('provides default layout when no search results', async () => {
        coreModule.search
            .mockResolvedValue({ results: [] });

        const overrides = await generateIntelligentOverrides('unknown', '', {});

        expect(overrides.layout['Max Width']).toBe('1200px');
        expect(overrides.layout['Layout']).toBe('Responsive grid');
        expect(overrides.recommendations).toContain('Refer to MASTER.md for all design rules');
    });

    test('handles null/undefined inputs gracefully', async () => {
        coreModule.search
            .mockResolvedValue({ results: [] });

        const overrides = await generateIntelligentOverrides(null, null, {});

        expect(overrides.page_type).toBe('General');
        expect(overrides.layout).toBeDefined();
        expect(overrides.recommendations.length).toBeGreaterThan(0);
    });

    test('combines page name and query for context', async () => {
        coreModule.search
            .mockResolvedValue({ results: [] });

        await generateIntelligentOverrides('dashboard', 'SaaS analytics', {});

        // Verify search was called with combined context
        expect(coreModule.search).toHaveBeenCalledWith(
            expect.stringContaining('dashboard'),
            expect.any(String),
            expect.any(Number)
        );
        expect(coreModule.search).toHaveBeenCalledWith(
            expect.stringContaining('saas'),
            expect.any(String),
            expect.any(Number)
        );
    });

    test('calls search for all three domains', async () => {
        coreModule.search
            .mockResolvedValue({ results: [] });

        await generateIntelligentOverrides('test', 'page', {});

        expect(coreModule.search).toHaveBeenCalledTimes(3);
        expect(coreModule.search).toHaveBeenCalledWith(expect.any(String), 'style', 1);
        expect(coreModule.search).toHaveBeenCalledWith(expect.any(String), 'ux', 3);
        expect(coreModule.search).toHaveBeenCalledWith(expect.any(String), 'landing', 1);
    });

    test('returns all expected override categories', async () => {
        coreModule.search
            .mockResolvedValue({ results: [] });

        const overrides = await generateIntelligentOverrides('test', '', {});

        expect(overrides).toHaveProperty('page_type');
        expect(overrides).toHaveProperty('layout');
        expect(overrides).toHaveProperty('spacing');
        expect(overrides).toHaveProperty('typography');
        expect(overrides).toHaveProperty('colors');
        expect(overrides).toHaveProperty('components');
        expect(overrides).toHaveProperty('unique_components');
        expect(overrides).toHaveProperty('recommendations');
    });
});
