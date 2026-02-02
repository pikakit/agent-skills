#!/usr/bin/env node
/**
 * Version Manager for SelfEvolution v4.0
 * Manages version history, changelog, and rollback capability
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';
import readline from 'readline';

import {
    getMistakesFile,
    getImprovementsFile,
    getMetaFile,
    getVersionsDir,
    ensureV4Structure
} from './project_utils.js';

const __filename = fileURLToPath(import.meta.url);

/**
 * Save a version snapshot
 */
export function saveVersion(versionType, versionNumber, data) {
    ensureV4Structure();
    const versionsDir = getVersionsDir();

    fs.mkdirSync(versionsDir, { recursive: true });
    const versionFile = path.join(versionsDir, `${versionType}-v${versionNumber}.yaml`);

    fs.writeFileSync(versionFile, yaml.dump(data, { noRefs: true }), 'utf-8');

    return versionFile;
}

/**
 * Load a specific version
 */
export function loadVersion(versionType, versionNumber) {
    const versionsDir = getVersionsDir();
    const versionFile = path.join(versionsDir, `${versionType}-v${versionNumber}.yaml`);

    if (!fs.existsSync(versionFile)) {
        return null;
    }

    return yaml.load(fs.readFileSync(versionFile, 'utf-8'));
}

/**
 * List all versions of a type
 */
export function listVersions(versionType) {
    const versionsDir = getVersionsDir();

    if (!fs.existsSync(versionsDir)) {
        return [];
    }

    const files = fs.readdirSync(versionsDir)
        .filter(f => f.startsWith(`${versionType}-v`) && f.endsWith('.yaml'))
        .sort();

    const versions = [];
    for (const vFile of files) {
        const versionStr = vFile.split('-v')[1].replace('.yaml', '');
        const versionNum = parseInt(versionStr, 10);

        const filePath = path.join(versionsDir, vFile);
        const stat = fs.statSync(filePath);

        const data = yaml.load(fs.readFileSync(filePath, 'utf-8')) || {};
        const count = (data[versionType] || []).length;
        const lastImproved = data.last_improved;

        versions.push({
            version: versionNum,
            file: filePath,
            size: stat.size,
            modified: new Date(stat.mtime).toISOString(),
            count,
            last_improved: lastImproved
        });
    }

    return versions;
}

/**
 * Get current version number
 */
export function getCurrentVersion(versionType) {
    const filePath = versionType === 'mistakes'
        ? getMistakesFile()
        : getImprovementsFile();

    if (!fs.existsSync(filePath)) {
        return 0;
    }

    const data = yaml.load(fs.readFileSync(filePath, 'utf-8')) || {};
    return data.version || 1;
}

/**
 * Rollback to a specific version
 */
export function rollbackToVersion(versionType, targetVersion) {
    const targetData = loadVersion(versionType, targetVersion);

    if (!targetData) {
        console.log(`❌ Version ${targetVersion} not found`);
        return false;
    }

    const currentFile = versionType === 'mistakes'
        ? getMistakesFile()
        : getImprovementsFile();

    // Backup current version first
    const currentVersion = getCurrentVersion(versionType);
    const backupFile = path.join(path.dirname(currentFile), `${versionType}.backup-v${currentVersion}.yaml`);

    if (fs.existsSync(currentFile)) {
        fs.copyFileSync(currentFile, backupFile);
        console.log(`💾 Backed up current version to ${path.basename(backupFile)}`);
    }

    // Restore target version
    fs.writeFileSync(currentFile, yaml.dump(targetData, { noRefs: true }), 'utf-8');

    console.log(`✅ Rolled back to version ${targetVersion}`);

    // Update meta.json
    try {
        const metaFile = getMetaFile();
        if (fs.existsSync(metaFile)) {
            const meta = JSON.parse(fs.readFileSync(metaFile, 'utf-8'));

            if (!meta.rollbacks) meta.rollbacks = [];
            meta.rollbacks.push({
                type: versionType,
                from_version: currentVersion,
                to_version: targetVersion,
                rolled_back_at: new Date().toISOString()
            });

            meta.updated = new Date().toISOString();

            fs.writeFileSync(metaFile, JSON.stringify(meta, null, 2), 'utf-8');
        }
    } catch (e) {
        console.log(`⚠️  Could not update meta.json: ${e.message}`);
    }

    return true;
}

/**
 * Compare two versions
 */
export function compareVersions(versionType, versionA, versionB) {
    const dataA = loadVersion(versionType, versionA);
    const dataB = loadVersion(versionType, versionB);

    if (!dataA || !dataB) {
        return { error: 'One or both versions not found' };
    }

    const itemsA = dataA[versionType] || [];
    const itemsB = dataB[versionType] || [];

    const idsA = new Set(itemsA.map(item => item.id));
    const idsB = new Set(itemsB.map(item => item.id));

    const added = [...idsB].filter(id => !idsA.has(id));
    const removed = [...idsA].filter(id => !idsB.has(id));
    const common = [...idsA].filter(id => idsB.has(id));

    const modified = [];
    for (const itemId of common) {
        const itemA = itemsA.find(i => i.id === itemId);
        const itemB = itemsB.find(i => i.id === itemId);

        if ((itemA.version || 1) !== (itemB.version || 1)) {
            modified.push({
                id: itemId,
                version_a: itemA.version || 1,
                version_b: itemB.version || 1
            });
        }
    }

    return {
        version_a: versionA,
        version_b: versionB,
        total_a: itemsA.length,
        total_b: itemsB.length,
        added,
        removed,
        modified
    };
}

/**
 * Display changelog for a version
 */
export function displayChangelog(versionType, versionNumber) {
    const data = loadVersion(versionType, versionNumber);

    if (!data) {
        console.log(`Version ${versionNumber} not found`);
        return;
    }

    const items = data[versionType] || [];

    console.log(`\n📋 Changelog for ${versionType} v${versionNumber}`);
    console.log(`Last improved: ${data.last_improved || 'Never'}`);
    console.log(`Total items: ${items.length}\n`);

    for (const item of items) {
        const changelog = item.changelog || [];
        if (changelog.length === 0) continue;

        console.log(`${item.id} (v${item.version || 1}):`);
        for (const entry of changelog) {
            console.log(`  v${entry.version || '?'}: ${entry.change || 'No details'}`);
            console.log(`     Date: ${(entry.date || 'Unknown').slice(0, 10)}`);
        }
        console.log();
    }
}

function prompt(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        rl.question(question, answer => {
            rl.close();
            resolve(answer);
        });
    });
}

async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
        case 'list': {
            const versionType = args[1];
            if (!['mistakes', 'improvements'].includes(versionType)) {
                console.log('Usage: node version_manager.js list <mistakes|improvements>');
                return;
            }

            const versions = listVersions(versionType);

            if (versions.length === 0) {
                console.log(`No versions found for ${versionType}`);
                return;
            }

            console.log(`\n📚 ${versionType.charAt(0).toUpperCase() + versionType.slice(1)} Versions:\n`);
            for (const v of versions) {
                console.log(`v${v.version}: ${v.modified.slice(0, 10)} - ${v.count} items (${v.size} bytes)`);
            }
            break;
        }

        case 'show': {
            const versionType = args[1];
            const versionNum = parseInt(args[2], 10);

            const data = loadVersion(versionType, versionNum);

            if (!data) {
                console.log(`Version ${versionNum} not found`);
                return;
            }

            console.log(`\n${versionType.charAt(0).toUpperCase() + versionType.slice(1)} v${versionNum}:`);
            console.log(`Last improved: ${data.last_improved || 'Never'}`);
            console.log(`Total items: ${(data[versionType] || []).length}`);

            console.log('\nItems:');
            for (const item of data[versionType] || []) {
                const text = (item.lesson || item.improvement || '').slice(0, 60);
                console.log(`  ${item.id} (v${item.version || 1}): ${text}`);
            }
            break;
        }

        case 'rollback': {
            const versionType = args[1];
            const targetVersion = parseInt(args[2], 10);

            const confirm = await prompt(`⚠️  Rollback ${versionType} to v${targetVersion}? (yes/no): `);

            if (confirm.toLowerCase() === 'yes') {
                rollbackToVersion(versionType, targetVersion);
            } else {
                console.log('Cancelled');
            }
            break;
        }

        case 'compare': {
            const versionType = args[1];
            const versionA = parseInt(args[2], 10);
            const versionB = parseInt(args[3], 10);

            const result = compareVersions(versionType, versionA, versionB);

            if (result.error) {
                console.log(`❌ ${result.error}`);
                return;
            }

            console.log(`\n📊 Comparing v${versionA} vs v${versionB}:`);
            console.log(`  v${versionA}: ${result.total_a} items`);
            console.log(`  v${versionB}: ${result.total_b} items`);
            console.log(`\n  Added: ${result.added.length} - ${JSON.stringify(result.added)}`);
            console.log(`  Removed: ${result.removed.length} - ${JSON.stringify(result.removed)}`);
            console.log(`  Modified: ${result.modified.length}`);

            for (const mod of result.modified) {
                console.log(`    ${mod.id}: v${mod.version_a} → v${mod.version_b}`);
            }
            break;
        }

        case 'changelog': {
            const versionType = args[1];
            const versionNum = parseInt(args[2], 10);
            displayChangelog(versionType, versionNum);
            break;
        }

        default:
            console.log('Version Manager for SelfEvolution v4.0');
            console.log('\nCommands:');
            console.log('  list <type>                   List all versions');
            console.log('  show <type> <version>         Show version details');
            console.log('  rollback <type> <version>     Rollback to version');
            console.log('  compare <type> <v1> <v2>      Compare versions');
            console.log('  changelog <type> <version>    Show changelog');
            console.log('\nTypes: mistakes, improvements');
    }
}

if (process.argv[1] === __filename) {
    main();
}
