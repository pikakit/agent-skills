/**
 * Studio Config Loader - Custom Page Patterns
 * =============================================
 * Loads user-defined configuration for custom page type patterns
 * Supports .studiorc.json and studio-config.json
 */

import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import type { CustomPattern, PagePattern, StudioConfig } from '../types.ts';

/**
 * Default config file names (in priority order)
 */
const CONFIG_FILES = [
    '.studiorc.json',
    'studio-config.json',
    '.studiorc'
];

/**
 * @typedef {Object} CustomPattern
 * @property {string[]} keywords - Keywords to match
 * @property {string} type - Page type name to return when matched
 */

/**
 * @typedef {Object} StudioConfig
 * @property {CustomPattern[]} customPatterns - User-defined page patterns
 */

/**
 * Load studio configuration from file
 * @param {string} configPath - Direct path to config file (optional)
 * @param {string} projectDir - Project directory to search for config (default: cwd)
 * @returns {Promise<StudioConfig|null>} Parsed config or null if not found
 */
export async function loadConfig(
    configPath: string | null = null,
    projectDir = process.cwd()
): Promise<StudioConfig | null> {
    let targetPath: string | null = configPath;
    
    // If no direct path, search for config files
    if (!targetPath) {
        for (const filename of CONFIG_FILES) {
            const candidatePath = join(projectDir, filename);
            if (existsSync(candidatePath)) {
                targetPath = candidatePath;
                break;
            }
        }
    }
    
    // No config found
    if (!targetPath || !existsSync(targetPath)) {
        return null;
    }
    
    try {
        const content = await readFile(targetPath, 'utf-8');
        const config: unknown = JSON.parse(content);
        
        // Validate config
        const validated = validateConfig(config);
        
        return validated;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Error loading studio config from ${targetPath}:`, message);
        return null;
    }
}

/**
 * Validate and normalize config structure
 * @param {Object} config - Raw config object
 * @returns {StudioConfig} Validated config
 * @throws {Error} If config is invalid
 */
export function validateConfig(config: unknown): StudioConfig {
    if (!config || typeof config !== 'object') {
        throw new Error('Config must be an object');
    }
    
    const source = config as Record<string, unknown>;
    const validated: StudioConfig = {
        customPatterns: []
    };
    
    // Validate customPatterns
    if (source.customPatterns) {
        if (!Array.isArray(source.customPatterns)) {
            throw new Error('customPatterns must be an array');
        }
        
        for (let i = 0; i < source.customPatterns.length; i++) {
            const pattern = source.customPatterns[i] as Record<string, unknown> | null;
            
            if (!pattern || typeof pattern !== 'object') {
                throw new Error(`Pattern at index ${i} must be an object`);
            }
            
            if (!pattern || !Array.isArray(pattern.keywords) || pattern.keywords.length === 0) {
                throw new Error(`Pattern at index ${i} must have non-empty 'keywords' array`);
            }
            
            if (typeof pattern.type !== 'string' || pattern.type.trim() === '') {
                throw new Error(`Pattern at index ${i} must have non-empty 'type' string`);
            }
            
            // Normalize keywords to lowercase
            validated.customPatterns?.push({
                keywords: pattern.keywords.map((keyword: unknown) => String(keyword).toLowerCase().trim()),
                type: pattern.type.trim()
            });
        }
    }
    
    return validated;
}

/**
 * Merge custom patterns with default patterns
 * Custom patterns take priority (checked first)
 * @param {Array} defaultPatterns - Default page patterns
 * @param {CustomPattern[]} customPatterns - User-defined patterns
 * @returns {Array} Merged patterns with custom first
 */
export function mergePatterns(
    defaultPatterns: PagePattern[],
    customPatterns: CustomPattern[]
): PagePattern[] {
    if (!customPatterns || customPatterns.length === 0) {
        return defaultPatterns;
    }
    
    // Convert custom patterns to same format as default patterns
    const formattedCustom = customPatterns.map(p => ({
        keywords: p.keywords,
        type: p.type
    }));
    
    // Custom patterns first (higher priority)
    return [...formattedCustom, ...defaultPatterns];
}

/**
 * Create example config for users
 * @returns {string} JSON string of example config
 */
export function getExampleConfig(): string {
    const example = {
        $schema: 'https://pikakit.dev/schemas/studio-config.json',
        customPatterns: [
            {
                keywords: ['inventory', 'warehouse', 'stock', 'shipment'],
                type: 'Inventory Management'
            },
            {
                keywords: ['calendar', 'scheduling', 'appointment', 'booking'],
                type: 'Calendar / Scheduling'
            },
            {
                keywords: ['chat', 'messaging', 'conversation', 'inbox'],
                type: 'Chat / Messaging'
            }
        ]
    };
    
    return JSON.stringify(example, null, 2);
}
