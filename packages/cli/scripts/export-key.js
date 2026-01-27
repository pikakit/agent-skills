#!/usr/bin/env node
/**
 * Extract and export Antigravity API key
 * Usage: npm run export-key
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

console.log('🔍 Searching for Antigravity API credentials...\n');

// Method 1: Check oauth_creds.json
const oauthPath = path.join(os.homedir(), '.gemini', 'oauth_creds.json');
if (fs.existsSync(oauthPath)) {
    try {
        const creds = JSON.parse(fs.readFileSync(oauthPath, 'utf8'));

        if (creds.access_token) {
            const isValid = creds.expiry_date && Date.now() < creds.expiry_date;

            console.log(`✓ Found OAuth credentials in ${oauthPath}`);
            console.log(`  Token: ${creds.access_token.substring(0, 20)}...`);
            console.log(`  Valid: ${isValid ? '✓ Yes' : '✗ Expired'}`);

            if (creds.expiry_date) {
                const expiryDate = new Date(creds.expiry_date);
                console.log(`  Expiry: ${expiryDate.toLocaleString()}`);
            }

            if (!isValid) {
                console.log('\n⚠️  Token expired! Antigravity is using a newer token in-memory.');
                console.log('   This file is not auto-updated by Antigravity.\n');
            }
        }
    } catch (e) {
        console.log(`✗ Failed to read OAuth credentials: ${e.message}`);
    }
}

// Method 2: Check for API key in Antigravity settings
const settingsPath = path.join(os.homedir(), '.gemini', 'settings.json');
if (fs.existsSync(settingsPath)) {
    try {
        const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
        console.log(`\n✓ Found Antigravity settings in ${settingsPath}`);

        // Check if there's an API key field
        if (settings.apiKey || settings.gemini?.apiKey) {
            const key = settings.apiKey || settings.gemini?.apiKey;
            console.log(`  API Key: ${key.substring(0, 10)}...`);
            console.log('\n📋 To export this key:');
            console.log(`  PowerShell: $env:GEMINI_API_KEY="${key}"`);
            console.log(`  Bash: export GEMINI_API_KEY="${key}"`);
        } else {
            console.log('  No API key field found in settings.');
        }
    } catch (e) {
        console.log(`✗ Failed to read settings: ${e.message}`);
    }
}

// Final recommendation
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 RECOMMENDATION:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('Antigravity uses OAuth (not permanent API keys).');
console.log('OAuth tokens expire and are not auto-exported to subprocesses.\n');
console.log('For CLI to use AI features, you need a permanent API key:\n');
console.log('1. Get API key from: https://aistudio.google.com/apikey');
console.log('2. Configure in CLI: agent → Settings → Gemini API Key');
console.log('3. It will auto-export to SelfEvolution for AI optimization\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
