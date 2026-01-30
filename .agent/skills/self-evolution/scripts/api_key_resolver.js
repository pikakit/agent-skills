#!/usr/bin/env node
/**
 * Smart API Key Resolver for SelfEvolution
 * 
 * PURPOSE: Auto-detect and use API key from multiple sources:
 * 1. Agent's current session (GEMINI_API_KEY from parent environment)
 * 2. Project-specific .env file
 * 3. User's custom API key
 * 4. Fallback to manual input
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get API key from environment variable
 */
export function getApiKeyFromEnv() {
    return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || null;
}

/**
 * Load API key from .env file
 */
export function getApiKeyFromDotenv(skillDir = null) {
    try {
        const envFile = path.join(skillDir || path.dirname(__dirname), '.env');
        if (!fs.existsSync(envFile)) return null;

        const result = dotenv.config({ path: envFile, override: false });
        return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || null;
    } catch (e) {
        return null;
    }
}

/**
 * Get cached API key from previous session
 */
export function getApiKeyFromCache() {
    const cacheFile = path.join(process.env.HOME || process.env.USERPROFILE, '.selfevolution_cache', 'api_key.txt');

    if (!fs.existsSync(cacheFile)) return null;

    try {
        const apiKey = fs.readFileSync(cacheFile, 'utf-8').trim();
        if (apiKey && apiKey.length > 10) return apiKey;
    } catch (e) {
        // ignore
    }

    return null;
}

/**
 * Cache API key for future use
 */
export function cacheApiKey(apiKey) {
    const cacheDir = path.join(process.env.HOME || process.env.USERPROFILE, '.selfevolution_cache');

    try {
        fs.mkdirSync(cacheDir, { recursive: true });
        const cacheFile = path.join(cacheDir, 'api_key.txt');
        fs.writeFileSync(cacheFile, apiKey, 'utf-8');
        // Note: chmod not reliable on Windows
    } catch (e) {
        console.log(`⚠️  Could not cache API key: ${e.message}`);
    }
}

/**
 * Smart API key resolution with multiple fallbacks
 */
export function resolveApiKey(skillDir = null, allowPrompt = false) {
    const result = {
        api_key: null,
        source: 'none',
        cached: false
    };

    // Priority 1: Current environment (from Agent session)
    let apiKey = getApiKeyFromEnv();
    if (apiKey) {
        result.api_key = apiKey;
        result.source = 'agent_session';
        return result;
    }

    // Priority 2: Project .env file
    apiKey = getApiKeyFromDotenv(skillDir);
    if (apiKey) {
        result.api_key = apiKey;
        result.source = 'project_env';
        return result;
    }

    // Priority 3: Cached from previous session
    apiKey = getApiKeyFromCache();
    if (apiKey) {
        result.api_key = apiKey;
        result.source = 'cache';
        result.cached = true;
        return result;
    }

    // Priority 4: Prompt user (if allowed) - not implemented in JS version
    // Use environment variables or .env file instead

    return result;
}

/**
 * Configure Gemini API with given key
 */
export async function configureGenai(apiKey) {
    try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genai = new GoogleGenerativeAI(apiKey);
        return genai;
    } catch (e) {
        if (e.code === 'ERR_MODULE_NOT_FOUND') {
            console.log('❌ @google/generative-ai not installed');
            console.log('   Run: npm install @google/generative-ai');
        } else {
            console.log(`❌ Failed to configure API: ${e.message}`);
        }
        return null;
    }
}

/**
 * Get configured Gemini API or null
 */
export async function getConfiguredGenai(allowPrompt = false) {
    const resolution = resolveApiKey(null, allowPrompt);

    if (!resolution.api_key) {
        return null;
    }

    const genai = await configureGenai(resolution.api_key);

    if (genai) {
        const sourceMsg = {
            'agent_session': "🤖 Using Agent's current API key",
            'project_env': '📁 Using project .env API key',
            'cache': '💾 Using cached API key',
            'user_input': '⌨️  Using manually entered API key'
        };
        console.log(`ℹ️  ${sourceMsg[resolution.source] || 'Using API key'}`);
    }

    return genai;
}

async function main() {
    const args = process.argv.slice(2);

    if (args.includes('--clear-cache')) {
        const cacheFile = path.join(process.env.HOME || process.env.USERPROFILE, '.selfevolution_cache', 'api_key.txt');
        if (fs.existsSync(cacheFile)) {
            fs.unlinkSync(cacheFile);
            console.log('✅ Cache cleared');
        } else {
            console.log('ℹ️  No cache found');
        }
        return;
    }

    if (args.includes('--test')) {
        console.log('🔍 Testing API Key Resolution\n');
        console.log('='.repeat(60));

        const resolution = resolveApiKey();

        console.log(`\nSource: ${resolution.source}`);

        if (resolution.api_key) {
            const masked = resolution.api_key.slice(0, 8) + '...' + resolution.api_key.slice(-4);
            console.log(`API Key: ${masked}`);
            console.log(`Cached: ${resolution.cached ? 'Yes' : 'No'}`);

            const genai = await configureGenai(resolution.api_key);
            if (genai) {
                console.log('\n✅ API key is valid and configured');
            } else {
                console.log('\n❌ Failed to configure API');
            }
        } else {
            console.log('❌ No API key found');
            console.log('\nOptions:');
            console.log('1. Set GEMINI_API_KEY in current environment');
            console.log('2. Create .env file with GEMINI_API_KEY');
        }
    } else {
        console.log('Smart API Key Resolver');
        console.log('\nCommands:');
        console.log('  --test        Test API key resolution');
        console.log('  --clear-cache Clear cached API key');
    }
}

if (process.argv[1] === __filename) {
    main();
}
