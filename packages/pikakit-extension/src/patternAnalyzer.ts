/**
 * PatternAnalyzer - Error Pattern Analysis
 * 
 * Analyzes diagnostic errors and categorizes them into learnable patterns.
 * Detects common error types and suggests fixes.
 * 
 * @author PikaKit
 * @version 1.0.0
 */

import { Lesson } from './lessonStore';

/**
 * Diagnostic information from VS Code
 */
export interface DiagnosticInfo {
    message: string;
    source: string;
    code: string;
    severity: 'error' | 'warning' | 'info';
    file: string;
    line: number;
    column: number;
}

/**
 * Analysis result from pattern analyzer
 */
export interface AnalysisResult {
    isLearnable: boolean;
    category: string;
    pattern: string;
    context: string;
    suggestedFix: string;
    confidence: number;
}

/**
 * Pattern rules for categorization
 */
interface PatternRule {
    pattern: RegExp;
    category: string;
    extractPattern: (match: RegExpMatchArray, info: DiagnosticInfo) => string;
    suggestFix: (match: RegExpMatchArray) => string;
}

export class PatternAnalyzer {
    private rules: PatternRule[] = [];

    constructor() {
        this.initializeRules();
    }

    /**
     * Initialize pattern matching rules
     */
    private initializeRules(): void {
        this.rules = [
            // TypeScript: Cannot find name
            {
                pattern: /Cannot find name '(\w+)'/,
                category: 'import',
                extractPattern: (match) => `Import missing: ${match[1]}`,
                suggestFix: (match) => `Add import for '${match[1]}'`
            },

            // TypeScript: Property does not exist
            {
                pattern: /Property '(\w+)' does not exist on type '(\w+)'/,
                category: 'type',
                extractPattern: (match) => `Property '${match[1]}' missing on type '${match[2]}'`,
                suggestFix: (match) => `Add '${match[1]}' to type definition or use type assertion`
            },

            // TypeScript: Type mismatch
            {
                pattern: /Type '(.+)' is not assignable to type '(.+)'/,
                category: 'type',
                extractPattern: (match) => `Type mismatch: ${match[1]} → ${match[2]}`,
                suggestFix: (match) => `Convert ${match[1]} to ${match[2]} or update type definition`
            },

            // TypeScript: JSX namespace
            {
                pattern: /Cannot find namespace 'JSX'/,
                category: 'react',
                extractPattern: () => `JSX namespace not found`,
                suggestFix: () => `Import React or use tsconfig jsx setting`
            },

            // TypeScript: Module not found
            {
                pattern: /Cannot find module '(.+)'/,
                category: 'import',
                extractPattern: (match) => `Module not found: ${match[1]}`,
                suggestFix: (match) => `Install package: npm install ${match[1]}`
            },

            // ESLint: Unused variable
            {
                pattern: /'(\w+)' is (defined|declared) but (never used|its value is never read)/,
                category: 'code-quality',
                extractPattern: (match) => `Unused variable: ${match[1]}`,
                suggestFix: (match) => `Remove '${match[1]}' or prefix with underscore`
            },

            // ESLint: Missing semicolon
            {
                pattern: /Missing semicolon/,
                category: 'code-style',
                extractPattern: () => `Missing semicolon`,
                suggestFix: () => `Add semicolon or configure prettier`
            },

            // React: Invalid hook call
            {
                pattern: /React Hook "(\w+)" is called/,
                category: 'react',
                extractPattern: (match) => `Invalid hook usage: ${match[1]}`,
                suggestFix: (match) => `Move ${match[1]} to function component top level`
            },

            // React: Missing dependency
            {
                pattern: /React Hook .+ has a missing dependency: '(\w+)'/,
                category: 'react',
                extractPattern: (match) => `Missing hook dependency: ${match[1]}`,
                suggestFix: (match) => `Add '${match[1]}' to dependency array`
            },

            // TypeScript: Strict null check
            {
                pattern: /'(\w+)' is possibly '(null|undefined)'/,
                category: 'null-safety',
                extractPattern: (match) => `Possible ${match[2]}: ${match[1]}`,
                suggestFix: (match) => `Add null check or use optional chaining`
            },

            // TypeScript: Argument type
            {
                pattern: /Argument of type '(.+)' is not assignable/,
                category: 'type',
                extractPattern: (match) => `Wrong argument type: ${match[1]}`,
                suggestFix: () => `Check function signature and pass correct type`
            },

            // Generic: Async/await
            {
                pattern: /(await|async).*(not allowed|unexpected)/i,
                category: 'async',
                extractPattern: () => `Async/await usage error`,
                suggestFix: () => `Ensure function is async or remove await`
            }
        ];
    }

    /**
     * Analyze a diagnostic and extract pattern
     */
    analyze(info: DiagnosticInfo): AnalysisResult {
        for (const rule of this.rules) {
            const match = info.message.match(rule.pattern);
            if (match) {
                return {
                    isLearnable: true,
                    category: rule.category,
                    pattern: rule.extractPattern(match, info),
                    context: this.extractContext(info),
                    suggestedFix: rule.suggestFix(match),
                    confidence: 0.9
                };
            }
        }

        // Generic pattern for unmatched errors
        if (this.isLearnableGeneric(info)) {
            return {
                isLearnable: true,
                category: this.guessCategory(info),
                pattern: this.normalizeMessage(info.message),
                context: this.extractContext(info),
                suggestedFix: 'See error message for details',
                confidence: 0.5
            };
        }

        return {
            isLearnable: false,
            category: 'unknown',
            pattern: '',
            context: '',
            suggestedFix: '',
            confidence: 0
        };
    }

    /**
     * Check if generic error is learnable
     */
    private isLearnableGeneric(info: DiagnosticInfo): boolean {
        // Skip very short or very long messages
        if (info.message.length < 10 || info.message.length > 200) {
            return false;
        }

        // Skip messages with file paths (too specific)
        if (info.message.includes('\\') || info.message.includes('/')) {
            return false;
        }

        // Skip messages with line numbers (too specific)
        if (/line \d+|:\d+:\d+/.test(info.message)) {
            return false;
        }

        return true;
    }

    /**
     * Guess category from source and message
     */
    private guessCategory(info: DiagnosticInfo): string {
        const source = info.source.toLowerCase();
        const message = info.message.toLowerCase();

        if (source.includes('typescript') || source === 'ts') {
            if (message.includes('import') || message.includes('module')) {
                return 'import';
            }
            if (message.includes('type')) {
                return 'type';
            }
            return 'typescript';
        }

        if (source.includes('eslint')) {
            return 'code-quality';
        }

        if (source.includes('prettier')) {
            return 'code-style';
        }

        if (message.includes('react') || message.includes('hook')) {
            return 'react';
        }

        return 'general';
    }

    /**
     * Extract context from diagnostic info
     */
    private extractContext(info: DiagnosticInfo): string {
        const fileExt = info.file.split('.').pop() || '';
        return `${fileExt} file, line ${info.line}`;
    }

    /**
     * Normalize message for pattern storage
     */
    private normalizeMessage(message: string): string {
        // Remove specific identifiers but keep structure
        return message
            .replace(/'[^']+'/g, "'<identifier>'")
            .replace(/"[^"]+"/g, '"<identifier>"')
            .substring(0, 100);
    }

    /**
     * Suggest skill name based on lessons
     */
    suggestSkillName(category: string, lessons: Lesson[]): string {
        // Use category as base
        let name = category;

        // Add specificity if possible
        if (lessons.length > 0) {
            const firstPattern = lessons[0].pattern.toLowerCase();
            if (firstPattern.includes('import')) {
                name = `${category}-imports`;
            } else if (firstPattern.includes('type')) {
                name = `${category}-types`;
            } else if (firstPattern.includes('hook')) {
                name = `${category}-hooks`;
            }
        }

        // Convert to kebab-case
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    /**
     * Calculate similarity between two patterns
     */
    calculateSimilarity(pattern1: string, pattern2: string): number {
        const words1 = new Set(pattern1.toLowerCase().split(/\s+/));
        const words2 = new Set(pattern2.toLowerCase().split(/\s+/));

        const intersection = new Set([...words1].filter(x => words2.has(x)));
        const union = new Set([...words1, ...words2]);

        return intersection.size / union.size;
    }
}
