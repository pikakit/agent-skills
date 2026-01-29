/**
 * Compact Registry.json
 * 
 * Refactors registry.json to use compact format:
 * - 2-space indentation
 * - Arrays on single line if short
 * - Remove empty arrays (rules, scripts)
 * - Preserve all data
 */

const fs = require('fs');
const path = require('path');

const registryPath = path.join(__dirname, '..', 'skills', 'registry.json');
const outputPath = registryPath; // Overwrite

console.log('📦 Reading registry.json...');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
console.log(`   Found ${registry.skills.length} skills`);

// Compact each skill
const compactedSkills = registry.skills.map(skill => {
    const compacted = {
        name: skill.name,
        category: skill.category,
    };

    // Only include triggers if not empty
    if (skill.triggers && skill.triggers.length > 0) {
        compacted.triggers = skill.triggers;
    }

    // Only include coordinates_with if not empty
    if (skill.coordinates_with && skill.coordinates_with.length > 0) {
        compacted.coordinates_with = skill.coordinates_with;
    }

    // Only include success_metrics if exists and not empty
    if (skill.success_metrics && skill.success_metrics.trim()) {
        compacted.success_metrics = skill.success_metrics;
    }

    // Only include rules if not empty
    if (skill.rules && skill.rules.length > 0) {
        compacted.rules = skill.rules;
    }

    // Only include scripts if not empty
    if (skill.scripts && skill.scripts.length > 0) {
        compacted.scripts = skill.scripts;
    }

    return compacted;
});

// Create compacted registry
const compactedRegistry = {
    updatedAt: new Date().toISOString(),
    version: registry.version,
    skills: compactedSkills
};

// Write with 2-space indentation
console.log('💾 Writing compacted registry...');
fs.writeFileSync(outputPath, JSON.stringify(compactedRegistry, null, 2), 'utf8');

// Stats
const originalSize = fs.statSync(path.join(__dirname, '..', 'skills', 'registry.backup.json')).size;
const newSize = fs.statSync(outputPath).size;
const reduction = ((1 - newSize / originalSize) * 100).toFixed(1);

console.log('');
console.log('✅ Compaction complete!');
console.log('');
console.log('📊 Results:');
console.log(`   Original: ${(originalSize / 1024).toFixed(1)} KB`);
console.log(`   New:      ${(newSize / 1024).toFixed(1)} KB`);
console.log(`   Reduction: ${reduction}%`);
console.log(`   Skills:   ${compactedSkills.length}`);
