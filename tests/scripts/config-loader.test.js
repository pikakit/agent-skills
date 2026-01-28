/**
 * Config Loader Tests - Studio Design System
 * ===========================================
 * Unit tests for custom page pattern configuration
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { writeFile, unlink, mkdir, rmdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import {
    loadConfig,
    validateConfig,
    mergePatterns,
    getExampleConfig
} from '../../.agent/studio/scripts-js/utils/config-loader.js';

describe('Config Loader', () => {
    const testDir = join(tmpdir(), 'studio-config-test-' + Date.now());
    
    beforeEach(async () => {
        if (!existsSync(testDir)) {
            await mkdir(testDir, { recursive: true });
        }
    });
    
    afterEach(async () => {
        // Cleanup test files
        for (const file of ['.studiorc.json', 'studio-config.json', '.studiorc']) {
            const filepath = join(testDir, file);
            if (existsSync(filepath)) {
                await unlink(filepath);
            }
        }
    });

    describe('validateConfig', () => {
        test('validates valid config', () => {
            const config = {
                customPatterns: [
                    { keywords: ['inventory', 'stock'], type: 'Inventory' }
                ]
            };
            
            const result = validateConfig(config);
            
            expect(result.customPatterns).toHaveLength(1);
            expect(result.customPatterns[0].type).toBe('Inventory');
        });

        test('normalizes keywords to lowercase', () => {
            const config = {
                customPatterns: [
                    { keywords: ['INVENTORY', 'Stock'], type: 'Inventory' }
                ]
            };
            
            const result = validateConfig(config);
            
            expect(result.customPatterns[0].keywords).toEqual(['inventory', 'stock']);
        });

        test('throws on non-object config', () => {
            expect(() => validateConfig(null)).toThrow('Config must be an object');
            expect(() => validateConfig('string')).toThrow('Config must be an object');
        });

        test('throws on non-array customPatterns', () => {
            expect(() => validateConfig({ customPatterns: 'invalid' }))
                .toThrow('customPatterns must be an array');
        });

        test('throws on missing keywords', () => {
            expect(() => validateConfig({ 
                customPatterns: [{ type: 'Test' }] 
            })).toThrow("must have non-empty 'keywords' array");
        });

        test('throws on empty keywords array', () => {
            expect(() => validateConfig({ 
                customPatterns: [{ keywords: [], type: 'Test' }] 
            })).toThrow("must have non-empty 'keywords' array");
        });

        test('throws on missing type', () => {
            expect(() => validateConfig({ 
                customPatterns: [{ keywords: ['test'] }] 
            })).toThrow("must have non-empty 'type' string");
        });

        test('handles empty customPatterns array', () => {
            const result = validateConfig({ customPatterns: [] });
            expect(result.customPatterns).toEqual([]);
        });

        test('handles config without customPatterns', () => {
            const result = validateConfig({});
            expect(result.customPatterns).toEqual([]);
        });
    });

    describe('loadConfig', () => {
        test('loads config from direct path', async () => {
            const configPath = join(testDir, 'custom-config.json');
            await writeFile(configPath, JSON.stringify({
                customPatterns: [
                    { keywords: ['test'], type: 'Test Pattern' }
                ]
            }));
            
            const config = await loadConfig(configPath);
            
            expect(config).not.toBeNull();
            expect(config.customPatterns[0].type).toBe('Test Pattern');
            
            await unlink(configPath);
        });

        test('returns null when no config found', async () => {
            const config = await loadConfig(null, testDir);
            expect(config).toBeNull();
        });

        test('prioritizes .studiorc.json over studio-config.json', async () => {
            await writeFile(join(testDir, '.studiorc.json'), JSON.stringify({
                customPatterns: [{ keywords: ['rc'], type: 'From RC' }]
            }));
            await writeFile(join(testDir, 'studio-config.json'), JSON.stringify({
                customPatterns: [{ keywords: ['config'], type: 'From Config' }]
            }));
            
            const config = await loadConfig(null, testDir);
            
            expect(config.customPatterns[0].type).toBe('From RC');
        });

        test('handles invalid JSON gracefully', async () => {
            const configPath = join(testDir, 'invalid.json');
            await writeFile(configPath, '{ invalid json }');
            
            const config = await loadConfig(configPath);
            
            expect(config).toBeNull();
            
            await unlink(configPath);
        });
    });

    describe('mergePatterns', () => {
        const defaultPatterns = [
            { keywords: ['dashboard', 'admin'], type: 'Dashboard' },
            { keywords: ['checkout', 'payment'], type: 'Checkout' }
        ];

        test('returns default patterns when no custom patterns', () => {
            const result = mergePatterns(defaultPatterns, null);
            expect(result).toEqual(defaultPatterns);
            
            const result2 = mergePatterns(defaultPatterns, []);
            expect(result2).toEqual(defaultPatterns);
        });

        test('places custom patterns first (higher priority)', () => {
            const customPatterns = [
                { keywords: ['inventory'], type: 'Inventory' }
            ];
            
            const result = mergePatterns(defaultPatterns, customPatterns);
            
            expect(result[0].type).toBe('Inventory');
            expect(result[1].type).toBe('Dashboard');
            expect(result).toHaveLength(3);
        });

        test('preserves pattern structure', () => {
            const customPatterns = [
                { keywords: ['a', 'b', 'c'], type: 'Custom' }
            ];
            
            const result = mergePatterns(defaultPatterns, customPatterns);
            
            expect(result[0].keywords).toEqual(['a', 'b', 'c']);
            expect(result[0].type).toBe('Custom');
        });
    });

    describe('getExampleConfig', () => {
        test('returns valid JSON string', () => {
            const example = getExampleConfig();
            
            expect(() => JSON.parse(example)).not.toThrow();
        });

        test('includes customPatterns with examples', () => {
            const example = JSON.parse(getExampleConfig());
            
            expect(example).toHaveProperty('customPatterns');
            expect(example.customPatterns.length).toBeGreaterThan(0);
            expect(example.customPatterns[0]).toHaveProperty('keywords');
            expect(example.customPatterns[0]).toHaveProperty('type');
        });
    });
});
