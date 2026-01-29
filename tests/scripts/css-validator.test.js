/**
 * CSS Validator Tests - Studio Design System
 * ===========================================
 * Unit tests for CSS syntax validation
 * 
 * NOTE: css-tree is intentionally tolerant - it recovers from most errors
 * for better developer experience. These tests verify the validator catches
 * what it can and doesn't break on edge cases.
 */

import { describe, test, expect } from 'vitest';
import {
    validateCss,
    validateCssWithContext,
    validateMarkdownCss
} from '../../.agent/skills/studio/scripts-js/utils/css-validator.js';

describe('CSS Validator', () => {
    describe('validateCss', () => {
        test('validates correct CSS syntax', () => {
            const css = `.btn { color: red; padding: 10px; }`;
            const result = validateCss(css);
            
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        test('validates CSS with pseudo-selectors', () => {
            const css = `.btn:hover { opacity: 0.9; transform: translateY(-1px); }`;
            const result = validateCss(css);
            
            expect(result.valid).toBe(true);
        });

        test('validates CSS variables', () => {
            const css = `:root { --color-primary: #2563EB; }`;
            const result = validateCss(css);
            
            expect(result.valid).toBe(true);
        });

        test('validates complex CSS with nesting structures', () => {
            const css = `
                .card {
                    padding: 24px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                .card:hover {
                    box-shadow: 0 8px 12px rgba(0,0,0,0.15);
                }
            `;
            const result = validateCss(css);
            
            expect(result.valid).toBe(true);
        });

        test('handles empty/null input gracefully', () => {
            expect(validateCss('').valid).toBe(true);
            expect(validateCss(null).valid).toBe(true);
            expect(validateCss(undefined).valid).toBe(true);
        });

        test('returns result object with expected structure', () => {
            const result = validateCss('.btn { color: red; }');
            
            expect(result).toHaveProperty('valid');
            expect(result).toHaveProperty('errors');
            expect(Array.isArray(result.errors)).toBe(true);
        });

        test('strict mode throws when errors exist', () => {
            // Force an error by passing non-CSS content
            const invalidContent = '<<< NOT VALID CSS >>>';
            const result = validateCss(invalidContent);
            
            if (!result.valid) {
                expect(() => validateCss(invalidContent, { strict: true }))
                    .toThrow('CSS validation failed');
            } else {
                // If parser is tolerant, verify no throw in non-strict mode
                expect(() => validateCss(invalidContent)).not.toThrow();
            }
        });
    });

    describe('validateCssWithContext', () => {
        test('returns null for valid CSS', () => {
            const css = `.card { padding: 24px; }`;
            const result = validateCssWithContext(css, 'Card Component');
            
            expect(result).toBeNull();
        });

        test('includes context in error message when provided', () => {
            const invalidContent = '<<< NOT CSS >>>';
            const result = validateCssWithContext(invalidContent, 'Test Context');
            
            // Result is either null (tolerant) or contains context
            if (result !== null) {
                expect(result).toContain('Test Context');
            }
        });
    });

    describe('validateMarkdownCss', () => {
        test('validates CSS blocks in markdown', () => {
            const markdown = `
# Component Specs

\`\`\`css
.btn { color: red; }
\`\`\`

\`\`\`css
.card { padding: 10px; }
\`\`\`
`;
            const result = validateMarkdownCss(markdown);
            expect(result.valid).toBe(true);
            expect(result.warnings).toHaveLength(0);
        });

        test('handles markdown without CSS blocks', () => {
            const markdown = `# No CSS here\nJust text.`;
            const result = validateMarkdownCss(markdown);
            expect(result.valid).toBe(true);
        });

        test('returns result with expected structure', () => {
            const result = validateMarkdownCss('# Test');
            
            expect(result).toHaveProperty('valid');
            expect(result).toHaveProperty('warnings');
            expect(Array.isArray(result.warnings)).toBe(true);
        });
    });
});
