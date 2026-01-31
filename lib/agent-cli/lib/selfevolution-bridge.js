/**
 * SelfEvolution Bridge Module
 * Connects Settings API keys with SelfEvolution's AI-powered optimization
 * 
 * @module selfevolution-bridge
 */

import { getApiKey } from './settings.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../../..');
const SELFEVOLUTION_DIR = path.join(PROJECT_ROOT, '.agent/skills/SelfEvolution');

/**
 * Export API keys from Settings to SelfEvolution .env file
 * This allows Python scripts to auto-detect and use the keys
 * 
 * @returns {{success: boolean, exported?: {gemini: boolean, claude: boolean}, path?: string, reason?: string}}
 */
export function exportApiKeysToSelfEvolution() {
    try {
        const geminiKey = getApiKey('gemini');
        const claudeKey = getApiKey('claude');

        // Check if any keys are configured
        if (!geminiKey && !claudeKey) {
            return {
                success: false,
                reason: 'No API keys configured in Settings'
            };
        }

        // Ensure SelfEvolution directory exists
        if (!fs.existsSync(SELFEVOLUTION_DIR)) {
            return {
                success: false,
                reason: 'SelfEvolution skill directory not found'
            };
        }

        // Build .env content
        const envContent = [];

        if (geminiKey) {
            envContent.push(`GEMINI_API_KEY=${geminiKey}`);
        }

        if (claudeKey) {
            envContent.push(`CLAUDE_API_KEY=${claudeKey}`);
            envContent.push(`ANTHROPIC_API_KEY=${claudeKey}`); // Alternative name
        }

        envContent.push('');
        envContent.push('# Auto-generated from Settings');
        envContent.push(`# Last updated: ${new Date().toISOString()}`);
        envContent.push('# DO NOT EDIT - Managed by CLI Settings');

        // Write .env file
        const envPath = path.join(SELFEVOLUTION_DIR, '.env');
        fs.writeFileSync(envPath, envContent.join('\n'), 'utf8');

        return {
            success: true,
            exported: {
                gemini: !!geminiKey,
                claude: !!claudeKey
            },
            path: envPath
        };
    } catch (error) {
        return {
            success: false,
            reason: `Export failed: ${error.message}`
        };
    }
}

/**
 * Verify that SelfEvolution can access the exported API keys
 * Runs Python api_key_resolver.py --test
 * 
 * @returns {Promise<{success: boolean, output?: string, error?: string, keyDetected?: boolean}>}
 */
export async function verifySelfEvolutionAccess() {
    return new Promise((resolve) => {
        const scriptPath = path.join(SELFEVOLUTION_DIR, 'scripts/api_key_resolver.py');

        // Check if script exists
        if (!fs.existsSync(scriptPath)) {
            resolve({
                success: false,
                error: 'api_key_resolver.py not found'
            });
            return;
        }

        // Run Python script with --test flag
        const python = spawn('python', [scriptPath, '--test'], {
            cwd: PROJECT_ROOT,
            env: { ...process.env }
        });

        let stdout = '';
        let stderr = '';

        python.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        python.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        python.on('close', (code) => {
            const success = code === 0;
            const keyDetected = stdout.includes('✓') || stdout.includes('detected');

            resolve({
                success,
                output: stdout.trim(),
                error: stderr.trim(),
                keyDetected
            });
        });

        python.on('error', (error) => {
            resolve({
                success: false,
                error: `Failed to run Python: ${error.message}`
            });
        });
    });
}

/**
 * Remove SelfEvolution .env file (cleanup)
 * Called when user removes all API keys from Settings
 * 
 * @returns {{success: boolean, reason?: string}}
 */
export function cleanupSelfEvolutionEnv() {
    try {
        const envPath = path.join(SELFEVOLUTION_DIR, '.env');

        if (fs.existsSync(envPath)) {
            fs.unlinkSync(envPath);
        }

        return { success: true };
    } catch (error) {
        return {
            success: false,
            reason: `Cleanup failed: ${error.message}`
        };
    }
}

export default {
    exportApiKeysToSelfEvolution,
    verifySelfEvolutionAccess,
    cleanupSelfEvolutionEnv
};
