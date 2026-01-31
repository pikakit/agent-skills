#!/usr/bin/env node
/**
 * Extract and export Gemini API key
 * Usage: node scripts/export-key.js
 * 
 * @deprecated This script is for debugging OAuth/API key issues.
 * CLI should use its own API key configuration via interactive menu.
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

console.log('🔍 Searching for Gemini API credentials...\n');

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
                console.log('\n⚠️  Token expired! Using newer token in-memory.');
                console.log('   This file is not auto-updated.\n');
            }
        }
    } catch (e) {
        console.log(`✗ Failed to read OAuth credentials: ${e.message}`);
    }
} else {
    console.log(`✗ OAuth credentials not found at ${oauthPath}`);
}

// Method 2: Check for API key in settings
const settingsPath = path.join(os.homedir(), '.gemini', 'settings.json');
if (fs.existsSync(settingsPath)) {
    try {
        const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
        console.log(`\n✓ Found settings in ${settingsPath}`);

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
} else {
    console.log(`\n✗ Settings not found at ${settingsPath}`);
}

// Final recommendation
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📌 RECOMMENDATION:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('PikaKit CLI uses independent API key configuration.\n');
console.log('For CLI AI features, configure via interactive menu:\n');
console.log('1. Run: ag-smart (no arguments)');
console.log('2. Select: Settings → Configure Gemini API Key');
console.log('3. Get key from: https://aistudio.google.com/apikey\n');
console.log('The CLI stores its own API key separate from IDE settings.');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
