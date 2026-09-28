#!/usr/bin/env node
/**
 * Studio Search CLI
 *
 * CLI entry point for Studio search and design system generation.
 * BM25-powered search across 24 CSV databases with design system output.
 *
 * @version 3.9.224
 * @contract studio v2.0.0
 * @see references/engineering-spec.md
 */

import { parseArgs } from 'node:util';
import {
    search,
    searchStack,
    CSV_CONFIG,
    AVAILABLE_STACKS,
    isSearchDomain,
    isStackName
} from './core.ts';
import { generateDesignSystem } from './design_system.ts';
import { StudioError, toStudioError, type SearchResult, type StackSearchResult } from './types.ts';

/**
 * Format search results for terminal output
 */
function formatOutput(result: SearchResult | StackSearchResult): string {
    const output = [];
    if ('stack' in result) {
        output.push('## Studio Stack Guidelines');
        output.push(`**Stack:** ${result.stack} | **Query:** ${result.query}`);
    } else {
        output.push('## Studio Search Results');
        output.push(`**Domain:** ${result.domain} | **Query:** ${result.query}`);
    }
    output.push(`**Source:** ${result.file} | **Found:** ${result.count} results\n`);

    result.results.forEach((row, i) => {
        output.push(`### Result ${i + 1}`);
        for (const [key, value] of Object.entries(row)) {
            let valueStr = String(value);
            if (valueStr.length > 300) {
                valueStr = valueStr.slice(0, 300) + '...';
            }
            output.push(`- **${key}:** ${valueStr}`);
        }
        output.push('');
    });

    return output.join('\n');
}

/**
 * Main CLI function
 */
async function main() {
    const options = {
        domain: {
            type: 'string',
            short: 'd'
        },
        stack: {
            type: 'string',
            short: 's'
        },
        'max-results': {
            type: 'string',
            short: 'n'
        },
        json: {
            type: 'boolean'
        },
        'design-system': {
            type: 'boolean'
            // No short option (parseArgs requires single char only)
        },
        'project-name': {
            type: 'string',
            short: 'p'
        },
        format: {
            type: 'string',
            short: 'f'
        },
        persist: {
            type: 'boolean'
        },
        page: {
            type: 'string'
        },
        'output-dir': {
            type: 'string',
            short: 'o'
        }
    } as const;

    const args = parseArgs({ options, allowPositionals: true });

    const query = args.positionals[0];
    if (!query) {
        throw new StudioError('ERR_EMPTY_QUERY', 'Query is required', true);
    }

    const domain = args.values.domain;
    const stack = args.values.stack;
    const maxResults = args.values['max-results'] ? parseInt(args.values['max-results']) : 3;
    const jsonOutput = args.values.json || false;
    const designSystem = args.values['design-system'] || false;
    const projectName = args.values['project-name'] || null;
    const requestedFormat = args.values.format || 'ascii';
    if (requestedFormat !== 'ascii' && requestedFormat !== 'markdown') {
        throw new StudioError('ERR_INVALID_ARGUMENT', 'Format must be ascii or markdown', true, {
            format: requestedFormat
        });
    }
    const format = requestedFormat;
    const persist = args.values.persist || false;
    const page = args.values.page || null;
    const outputDir = args.values['output-dir'] || null;

    // Design system takes priority
    if (designSystem) {
        const result = await generateDesignSystem(
            query,
            projectName,
            format,
            persist,
            page,
            outputDir
        );
        console.log(result);

        // Print persistence confirmation
        if (persist) {
            const projectSlug = (projectName || query).toLowerCase().replace(/\s+/g, '-');
            console.log('\n' + '='.repeat(60));
            console.log(`✅ Design system persisted to design-system/${projectSlug}/`);
            console.log(`   📄 design-system/${projectSlug}/MASTER.md (Global Source of Truth)`);
            if (page) {
                const pageFilename = page.toLowerCase().replace(/\s+/g, '-');
                console.log(`   📄 design-system/${projectSlug}/pages/${pageFilename}.md (Page Overrides)`);
            }
            console.log('');
            console.log(`📖 Usage: When building a page, check design-system/${projectSlug}/pages/[page].md first.`);
            console.log(`   If exists, its rules override MASTER.md. Otherwise, use MASTER.md.`);
            console.log('='.repeat(60));
        }
    }
    // Stack search
    else if (stack) {
        if (!isStackName(stack)) {
            throw new StudioError(
                'ERR_UNKNOWN_CATEGORY',
                `Unknown stack: ${stack}. Available: ${AVAILABLE_STACKS.join(', ')}`,
                true
            );
        }

        const result = await searchStack(query, stack, maxResults);
        if (jsonOutput) {
            console.log(JSON.stringify(result, null, 2));
        } else {
            console.log(formatOutput(result));
        }
    }
    // Domain search
    else {
        if (domain && !isSearchDomain(domain)) {
            throw new StudioError(
                'ERR_UNKNOWN_CATEGORY',
                `Unknown domain: ${domain}. Available: ${Object.keys(CSV_CONFIG).join(', ')}`,
                true
            );
        }

        const result = await search(query, domain, maxResults);
        if (jsonOutput) {
            console.log(JSON.stringify(result, null, 2));
        } else {
            console.log(formatOutput(result));
        }
    }
}

// Run CLI
main().catch((error: unknown) => {
    const studioError = toStudioError(error);
    console.error(JSON.stringify(studioError.toJSON()));
    process.exit(1);
});
