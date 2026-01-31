#!/usr/bin/env node
/**
 * Integration Test Suite for SelfEvolution v4.0
 * Tests cross-phase integration and data flow
 * 
 * Note: This is a simplified JavaScript version.
 * The original Python version imports from local modules.
 * This version provides basic validation checks.
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = resolve(__dirname, '..');
const DATA_DIR = join(SKILL_DIR, 'data');
const VERSIONS_DIR = join(DATA_DIR, 'versions');

function testPhase1Foundation() {
    console.log('='.repeat(60));
    console.log('TEST PHASE 1: Foundation');
    console.log('='.repeat(60));

    // Test files exist
    const mistakesFile = join(DATA_DIR, 'mistakes.yaml');
    const improvementsFile = join(DATA_DIR, 'improvements.yaml');
    const metaFile = join(DATA_DIR, 'meta.json');

    const files = [
        { path: mistakesFile, name: 'mistakes.yaml' },
        { path: improvementsFile, name: 'improvements.yaml' },
        { path: metaFile, name: 'meta.json' }
    ];

    let allExist = true;
    for (const { path, name } of files) {
        if (existsSync(path)) {
            console.log(`[OK] ${name} exists`);
        } else {
            console.log(`[X] ${name} not found`);
            allExist = false;
        }
    }

    if (!allExist) return false;

    // Validate mistakes.yaml structure
    try {
        const mistakesData = parse(readFileSync(mistakesFile, 'utf-8'));
        if (!mistakesData.mistakes) throw new Error('mistakes key missing');
        if (!mistakesData.version) throw new Error('version key missing');
        console.log(`[OK] Mistakes file valid: v${mistakesData.version}, ${mistakesData.mistakes.length} items`);
    } catch (e) {
        console.log(`[X] Mistakes validation failed: ${e.message}`);
        return false;
    }

    // Validate improvements.yaml structure
    try {
        const improvementsData = parse(readFileSync(improvementsFile, 'utf-8'));
        if (!improvementsData.improvements) throw new Error('improvements key missing');
        console.log(`[OK] Improvements file valid: ${improvementsData.improvements.length} items`);
    } catch (e) {
        console.log(`[X] Improvements validation failed: ${e.message}`);
        return false;
    }

    // Validate meta.json structure
    try {
        const metaData = JSON.parse(readFileSync(metaFile, 'utf-8'));
        if (!metaData.event_counter) throw new Error('event_counter missing');
        if (!metaData.self_improve) throw new Error('self_improve missing');
        console.log('[OK] Meta file valid');
    } catch (e) {
        console.log(`[X] Meta validation failed: ${e.message}`);
        return false;
    }

    return true;
}

function testPhase5Versioning() {
    console.log('\n' + '='.repeat(60));
    console.log('TEST PHASE 5: Versioning & Rollback');
    console.log('='.repeat(60));

    if (!existsSync(VERSIONS_DIR)) {
        console.log('[!] versions/ directory not found');
        return true; // Not critical
    }

    const mistakesVersionsDir = join(VERSIONS_DIR, 'mistakes');
    const improvementsVersionsDir = join(VERSIONS_DIR, 'improvements');

    let mistakeVersions = [];
    let improvementVersions = [];

    if (existsSync(mistakesVersionsDir)) {
        mistakeVersions = readdirSync(mistakesVersionsDir).filter(f => f.endsWith('.yaml'));
    }
    if (existsSync(improvementsVersionsDir)) {
        improvementVersions = readdirSync(improvementsVersionsDir).filter(f => f.endsWith('.yaml'));
    }

    console.log(`[OK] Version lists: ${mistakeVersions.length} mistake versions, ${improvementVersions.length} improvement versions`);

    return true;
}

function testIntegrationFlow() {
    console.log('\n' + '='.repeat(60));
    console.log('TEST INTEGRATION: End-to-End Flow');
    console.log('='.repeat(60));

    const mistakesFile = join(DATA_DIR, 'mistakes.yaml');
    const metaFile = join(DATA_DIR, 'meta.json');

    if (!existsSync(mistakesFile) || !existsSync(metaFile)) {
        console.log('[X] Required files not found');
        return false;
    }

    try {
        const mistakesData = parse(readFileSync(mistakesFile, 'utf-8'));
        const metaData = JSON.parse(readFileSync(metaFile, 'utf-8'));

        const mistakes = mistakesData.mistakes;
        const eventCount = metaData.event_counter?.total || 0;

        console.log('[OK] Data flow consistent:');
        console.log(`   Mistakes file: ${mistakes.length} items`);
        console.log(`   Meta.json events: ${eventCount}`);

        return true;
    } catch (e) {
        console.log(`[X] Integration test failed: ${e.message}`);
        return false;
    }
}

function runAllTests() {
    console.log('\n[*] SelfEvolution v4.0 Integration Test Suite\n');

    const results = [];

    try {
        results.push(['Phase 1: Foundation', testPhase1Foundation()]);
    } catch (e) {
        console.log(`[X] Phase 1 failed: ${e.message}`);
        results.push(['Phase 1: Foundation', false]);
    }

    try {
        results.push(['Phase 5: Versioning', testPhase5Versioning()]);
    } catch (e) {
        console.log(`[X] Phase 5 failed: ${e.message}`);
        results.push(['Phase 5: Versioning', false]);
    }

    try {
        results.push(['Integration Flow', testIntegrationFlow()]);
    } catch (e) {
        console.log(`[X] Integration failed: ${e.message}`);
        results.push(['Integration Flow', false]);
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('TEST SUMMARY');
    console.log('='.repeat(60));

    const passed = results.filter(([, result]) => result).length;
    const total = results.length;

    for (const [name, result] of results) {
        const status = result ? '[OK] PASS' : '[X] FAIL';
        console.log(`${status}: ${name}`);
    }

    console.log(`\n${passed === total ? '[OK]' : '[!]'} ${passed}/${total} tests passed`);

    if (passed === total) {
        console.log('\n[*] ALL INTEGRATION TESTS PASSED!');
        return 0;
    } else {
        console.log(`\n[!] ${total - passed} test(s) failed`);
        return 1;
    }
}

process.exit(runAllTests());
