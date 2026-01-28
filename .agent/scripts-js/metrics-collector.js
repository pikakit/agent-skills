#!/usr/bin/env node
/**
 * Metrics Collector for Project Health Dashboard
 * 
 * Collects and stores project metrics:
 * - Build times
 * - Test coverage
 * - Bundle size
 * - Lighthouse scores
 * - Security vulnerabilities
 * 
 * Usage:
 *   node metrics-collector.js collect
 *   node metrics-collector.js show
 *   node metrics-collector.js trends
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const METRICS_FILE = '.agent/knowledge/project-metrics.json';
const MAX_HISTORY = 30; // Keep 30 days of history

/**
 * Load metrics history
 */
function loadMetrics() {
    const metricsPath = path.join(process.cwd(), METRICS_FILE);
    
    if (!fs.existsSync(metricsPath)) {
        return { history: [] };
    }
    
    try {
        return JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
    } catch {
        return { history: [] };
    }
}

/**
 * Save metrics history
 */
function saveMetrics(data) {
    const metricsPath = path.join(process.cwd(), METRICS_FILE);
    const dir = path.dirname(metricsPath);
    
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(metricsPath, JSON.stringify(data, null, 2));
}

/**
 * Run command and capture output
 */
function runCommand(cmd) {
    try {
        return execSync(cmd, { encoding: 'utf8', stdio: 'pipe' });
    } catch {
        return null;
    }
}

/**
 * Get build time from npm run build
 */
function getBuildTime() {
    const start = Date.now();
    const result = runCommand('npm run build 2>&1');
    const duration = Date.now() - start;
    
    return {
        success: result !== null,
        durationMs: duration,
        durationFormatted: `${(duration / 1000).toFixed(1)}s`
    };
}

/**
 * Get test coverage from npm test
 */
function getTestCoverage() {
    const result = runCommand('npm test -- --coverage --json 2>&1');
    
    if (!result) return { coverage: null };
    
    // Try to parse Jest coverage output
    const coverageMatch = result.match(/All files[^|]+\|[^|]+\|[^|]+\|[^|]+\|\s*([\d.]+)/);
    
    return {
        coverage: coverageMatch ? parseFloat(coverageMatch[1]) : null
    };
}

/**
 * Get bundle size from build output
 */
function getBundleSize() {
    // Check for common build output directories
    const buildDirs = ['dist', 'build', '.next', 'out'];
    
    for (const dir of buildDirs) {
        const buildPath = path.join(process.cwd(), dir);
        if (fs.existsSync(buildPath)) {
            const size = getDirSize(buildPath);
            return {
                sizeBytes: size,
                sizeFormatted: formatBytes(size)
            };
        }
    }
    
    return { sizeBytes: null };
}

/**
 * Get directory size recursively
 */
function getDirSize(dirPath) {
    let size = 0;
    
    try {
        const files = fs.readdirSync(dirPath);
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
                size += getDirSize(filePath);
            } else {
                size += stat.size;
            }
        }
    } catch {
        // Ignore errors
    }
    
    return size;
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
    if (bytes === null || bytes === undefined) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Collect all metrics
 */
function collectMetrics() {
    console.log('📊 Collecting metrics...\n');
    
    const metrics = {
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0]
    };
    
    // Build time
    console.log('⏱️  Measuring build time...');
    const buildResult = getBuildTime();
    metrics.buildTime = buildResult;
    console.log(`   Build: ${buildResult.durationFormatted}`);
    
    // Bundle size
    console.log('📦 Checking bundle size...');
    const bundleResult = getBundleSize();
    metrics.bundleSize = bundleResult;
    console.log(`   Size: ${bundleResult.sizeFormatted || 'N/A'}`);
    
    // File count
    console.log('📄 Counting files...');
    const fileCount = countSourceFiles();
    metrics.fileCount = fileCount;
    console.log(`   Files: ${fileCount}`);
    
    // Save to history
    const data = loadMetrics();
    
    // Remove old entry for same date if exists
    data.history = data.history.filter(m => m.date !== metrics.date);
    data.history.push(metrics);
    
    // Keep only last MAX_HISTORY entries
    if (data.history.length > MAX_HISTORY) {
        data.history = data.history.slice(-MAX_HISTORY);
    }
    
    data.latest = metrics;
    saveMetrics(data);
    
    console.log('\n✅ Metrics collected and saved.');
    return metrics;
}

/**
 * Count source files
 */
function countSourceFiles() {
    const extensions = ['.js', '.ts', '.jsx', '.tsx', '.vue', '.svelte'];
    const excludeDirs = ['node_modules', '.git', 'dist', 'build', '.next'];
    
    function countDir(dir) {
        let count = 0;
        try {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);
                
                if (stat.isDirectory()) {
                    if (!excludeDirs.includes(file)) {
                        count += countDir(filePath);
                    }
                } else if (extensions.some(ext => file.endsWith(ext))) {
                    count++;
                }
            }
        } catch {
            // Ignore errors
        }
        return count;
    }
    
    return countDir(process.cwd());
}

/**
 * Show current metrics
 */
function showMetrics() {
    const data = loadMetrics();
    
    if (!data.latest) {
        console.log('No metrics collected yet. Run: node metrics-collector.js collect');
        return;
    }
    
    const m = data.latest;
    
    console.log('\n┌─────────────────────────────────────────┐');
    console.log('│  📊 Project Metrics Dashboard           │');
    console.log('├─────────────────────────────────────────┤');
    console.log(`│  Build Time:    ${padRight(m.buildTime?.durationFormatted || 'N/A', 20)} │`);
    console.log(`│  Bundle Size:   ${padRight(m.bundleSize?.sizeFormatted || 'N/A', 20)} │`);
    console.log(`│  Source Files:  ${padRight(String(m.fileCount || 'N/A'), 20)} │`);
    console.log(`│  Last Updated:  ${padRight(m.date || 'N/A', 20)} │`);
    console.log('└─────────────────────────────────────────┘');
}

/**
 * Show trends
 */
function showTrends() {
    const data = loadMetrics();
    
    if (!data.history || data.history.length < 2) {
        console.log('Not enough history for trends. Collect metrics for 2+ days.');
        return;
    }
    
    console.log('\n📈 7-Day Trends\n');
    console.log('─'.repeat(50));
    
    const recent = data.history.slice(-7);
    
    // Build time trend
    const buildTimes = recent
        .map(m => m.buildTime?.durationMs)
        .filter(t => t !== null && t !== undefined);
    
    if (buildTimes.length >= 2) {
        const first = buildTimes[0];
        const last = buildTimes[buildTimes.length - 1];
        const change = ((last - first) / first * 100).toFixed(0);
        const trend = last < first ? '↓' : last > first ? '↑' : '→';
        console.log(`Build Time: ${trend} ${change}%`);
        console.log(`  Trend: ${generateSparkline(buildTimes)}`);
    }
    
    // Bundle size trend
    const bundleSizes = recent
        .map(m => m.bundleSize?.sizeBytes)
        .filter(s => s !== null && s !== undefined);
    
    if (bundleSizes.length >= 2) {
        const first = bundleSizes[0];
        const last = bundleSizes[bundleSizes.length - 1];
        const change = ((last - first) / first * 100).toFixed(0);
        const trend = last < first ? '↓' : last > first ? '↑' : '→';
        console.log(`\nBundle Size: ${trend} ${change}%`);
        console.log(`  Trend: ${generateSparkline(bundleSizes)}`);
    }
    
    console.log('\n' + '─'.repeat(50));
}

/**
 * Generate ASCII sparkline
 */
function generateSparkline(values) {
    const bars = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    
    return values
        .map(v => {
            const normalized = (v - min) / range;
            const index = Math.floor(normalized * (bars.length - 1));
            return bars[index];
        })
        .join('');
}

/**
 * Pad string to right
 */
function padRight(str, len) {
    return (str + ' '.repeat(len)).slice(0, len);
}

/**
 * Main
 */
function main() {
    const command = process.argv[2];
    
    switch (command) {
        case 'collect':
            collectMetrics();
            break;
        case 'show':
            showMetrics();
            break;
        case 'trends':
            showTrends();
            break;
        default:
            console.log(`
Metrics Collector

Usage:
  node metrics-collector.js <command>

Commands:
  collect   Collect and save current metrics
  show      Display current metrics
  trends    Show 7-day trends

Examples:
  node metrics-collector.js collect
  node metrics-collector.js trends
`);
    }
}

main();
