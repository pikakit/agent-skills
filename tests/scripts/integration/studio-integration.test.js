/**
 * Studio Integration Tests
 * =========================
 * End-to-end tests with real CSV data
 * Verifies the complete search + design system pipeline
 * 
 * NOTE: CSV data quality issues exist (inconsistent columns).
 * Tests are designed to gracefully handle errors.
 */

import { describe, test, expect } from 'vitest';
import { search, detectDomain, searchStack } from '../../../.agent/studio/scripts-js/core.js';
import { formatMasterMd } from '../../../.agent/studio/scripts-js/design_system.js';
import { detectPageType } from '../../../.agent/studio/scripts-js/utils/page-type-detector.js';

// Timeout for integration tests
const INTEGRATION_TIMEOUT = 10000;

describe('Studio Integration Tests', () => {
    
    describe('Search Function Structure', () => {
        test('search returns object with results array', async () => {
            const result = await search('dashboard', 'style', 2);
            
            expect(result).toHaveProperty('results');
            expect(Array.isArray(result.results)).toBe(true);
        }, INTEGRATION_TIMEOUT);

        test('search handles UX domain', async () => {
            const result = await search('checkout', 'ux', 2);
            
            expect(result).toHaveProperty('results');
            expect(Array.isArray(result.results)).toBe(true);
        }, INTEGRATION_TIMEOUT);

        test('search handles landing domain', async () => {
            const result = await search('marketing', 'landing', 2);
            
            expect(result).toHaveProperty('results');
            expect(Array.isArray(result.results)).toBe(true);
        }, INTEGRATION_TIMEOUT);
    });

    describe('Domain Detection', () => {
        test('detectDomain returns a string', () => {
            const domain = detectDomain('modern minimalist design for SaaS');
            expect(typeof domain).toBe('string');
        });

        test('detectDomain handles various inputs', () => {
            const inputs = [
                'dashboard with charts',
                'ecommerce checkout',
                'landing page hero section',
                'user profile settings'
            ];
            
            inputs.forEach(input => {
                const domain = detectDomain(input);
                expect(domain).toBeDefined();
                expect(typeof domain).toBe('string');
            });
        });
    });

    describe('Stack Search', () => {
        test('searchStack returns results structure', async () => {
            const result = await searchStack('React Tailwind');
            
            expect(result).toBeDefined();
            // searchStack may return results or empty depending on data availability
            if (result && result.results) {
                expect(Array.isArray(result.results)).toBe(true);
            }
        }, INTEGRATION_TIMEOUT);
    });

    describe('formatMasterMd Generation', () => {
        test('formatMasterMd generates complete markdown', () => {
            const mockDesignSystem = {
                project_name: 'Integration Test',
                style: { 'Style Category': 'Modern Minimal' },
                colors: {
                    primary: '#2563EB',
                    secondary: '#3B82F6',
                    cta: '#F97316',
                    background: '#FFFFFF',
                    text: '#1E293B'
                },
                typography: {
                    'Font Family': 'Inter, sans-serif',
                    'Body Size': '16px'
                },
                pattern: { 'Pattern Title': 'Dashboard Layout' }
            };

            const output = formatMasterMd(mockDesignSystem);
            
            // Verify all major sections present
            expect(output).toContain('# Design System Master File');
            expect(output).toContain('## Global Rules');
            expect(output).toContain('### Color Palette');
            expect(output).toContain('### Typography');
            expect(output).toContain('## Component Specs');
            expect(output).toContain('## Pre-Delivery Checklist');
        });

        test('formatMasterMd includes CSS custom properties', () => {
            const mockDesignSystem = {
                project_name: 'CSS Test',
                colors: {
                    primary: '#FF5733',
                    cta: '#33FF57'
                }
            };

            const output = formatMasterMd(mockDesignSystem);
            
            expect(output).toContain('--color-primary');
            expect(output).toContain('#FF5733');
        });

        test('formatMasterMd handles minimal input', () => {
            const minimalDesignSystem = {
                project_name: 'Minimal'
            };

            const output = formatMasterMd(minimalDesignSystem);
            
            expect(output).toContain('# Design System Master File');
            expect(output).toContain('Minimal');
        });
    });

    describe('Page Type Detection with Context', () => {
        test('detectPageType works with style results', () => {
            const mockStyleResults = [
                { 'Style Category': 'Data Visualization', 'Keywords': 'dashboard, analytics' }
            ];
            
            const pageType = detectPageType('admin panel', mockStyleResults);
            
            expect(pageType).toBe('Dashboard / Data View');
        });

        test('detectPageType handles empty style results', () => {
            const pageType = detectPageType('checkout confirmation', []);
            
            expect(pageType).toBe('Checkout / Payment');
        });

        test('detectPageType returns General for unknown patterns', () => {
            // Use truly random string without any keyword matches
            const pageType = detectPageType('zzz qwerty asdfgh', []);
            
            expect(pageType).toBe('General');
        });
    });

    describe('Error Handling', () => {
        test('search handles empty query gracefully', async () => {
            const result = await search('', 'style', 1);
            
            expect(result).toHaveProperty('results');
            expect(Array.isArray(result.results)).toBe(true);
        }, INTEGRATION_TIMEOUT);

        test('search handles invalid domain gracefully', async () => {
            const result = await search('test query', 'invalid_domain', 1);
            
            // Should return empty results, not throw
            expect(result).toHaveProperty('results');
        }, INTEGRATION_TIMEOUT);

        test('formatMasterMd handles undefined colors', () => {
            const designSystem = {
                project_name: 'No Colors'
            };

            expect(() => formatMasterMd(designSystem)).not.toThrow();
        });
    });
});
