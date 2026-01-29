/**
 * Performance Benchmark Script
 * Measures and validates performance of critical operations
 * 
 * Usage: node .agent/scripts-js/benchmark.cjs
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURATION
// ============================================

const THRESHOLDS = {
    'skill-validator': { maxMs: 5000, description: 'Validate all skills' },
    'registry-load': { maxMs: 100, description: 'Load registry.json' },
    'studio-search': { maxMs: 3000, description: 'Studio design system search' },
    'checklist-init': { maxMs: 500, description: 'Checklist script init' }
};

const PROJECT_ROOT = path.join(__dirname, '..', '..');

// ============================================
// UTILITIES
// ============================================

function formatMs(ms) {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
}

function getStatus(actual, threshold) {
    if (actual <= threshold * 0.5) return { icon: '🟢', status: 'EXCELLENT' };
    if (actual <= threshold * 0.8) return { icon: '🟡', status: 'GOOD' };
    if (actual <= threshold) return { icon: '🟠', status: 'OK' };
    return { icon: '🔴', status: 'EXCEEDED' };
}

// ============================================
// BENCHMARKS
// ============================================

function benchmarkSkillValidator() {
    const start = performance.now();
    try {
        execSync('node .agent/scripts-js/skill-validator.js', {
            cwd: PROJECT_ROOT,
            encoding: 'utf8',
            timeout: 10000,
            stdio: 'pipe'
        });
    } catch (e) {
        // Validator may exit with non-zero for warnings
    }
    return performance.now() - start;
}

function benchmarkRegistryLoad() {
    const registryPath = path.join(PROJECT_ROOT, '.agent', 'skills', 'registry.json');

    const start = performance.now();
    const content = fs.readFileSync(registryPath, 'utf8');
    JSON.parse(content);
    return performance.now() - start;
}

function benchmarkStudioSearch() {
    const start = performance.now();
    try {
        execSync('node .agent/skills/studio/scripts-js/search.js "fintech modern" --domain style', {
            cwd: PROJECT_ROOT,
            encoding: 'utf8',
            timeout: 10000,
            stdio: 'pipe'
        });
    } catch (e) {
        // May have non-zero exit
    }
    return performance.now() - start;
}

function benchmarkChecklistInit() {
    const checklistPath = path.join(PROJECT_ROOT, '.agent', 'scripts-js', 'checklist.js');

    const start = performance.now();
    fs.existsSync(checklistPath);
    fs.statSync(checklistPath);
    return performance.now() - start;
}

// ============================================
// MAIN
// ============================================

console.log('');
console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║  ⚡ Performance Benchmark Report                               ║');
console.log('╚════════════════════════════════════════════════════════════════╝');
console.log('');

const results = [];

// Run benchmarks
console.log('Running benchmarks...\n');

const benchmarks = {
    'skill-validator': benchmarkSkillValidator,
    'registry-load': benchmarkRegistryLoad,
    'studio-search': benchmarkStudioSearch,
    'checklist-init': benchmarkChecklistInit
};

for (const [name, fn] of Object.entries(benchmarks)) {
    const threshold = THRESHOLDS[name];
    const elapsed = fn();
    const { icon, status } = getStatus(elapsed, threshold.maxMs);

    results.push({
        name,
        elapsed,
        threshold: threshold.maxMs,
        status,
        passed: elapsed <= threshold.maxMs
    });

    console.log(`${icon} ${name.padEnd(20)} ${formatMs(elapsed).padStart(8)} / ${formatMs(threshold.maxMs).padStart(8)}  [${status}]`);
}

console.log('');

// Summary
const passed = results.filter(r => r.passed).length;
const failed = results.filter(r => !r.passed).length;

console.log('─'.repeat(64));
console.log(`Results: ${passed} passed, ${failed} exceeded thresholds`);
console.log('');

if (failed === 0) {
    console.log('✅ All benchmarks within thresholds!');
    process.exit(0);
} else {
    console.log('⚠️  Some benchmarks exceeded thresholds');
    process.exit(1);
}
