/**
 * Performance Benchmark Utility
 * 
 * Provides tools for measuring and reporting performance:
 * - Execution time measurement
 * - Memory usage tracking
 * - Performance reports
 * 
 * Usage:
 *   import { benchmark, measure, report } from './benchmark.js';
 *   
 *   const result = await measure('operation-name', async () => {
 *       // code to measure
 *   });
 *   
 *   report();
 */

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

// ==================== STORAGE ====================

const metrics = new Map();
const thresholds = {
    fast: 100,       // < 100ms
    normal: 500,     // 100-500ms
    slow: 1000,      // 500-1000ms
    // > 1000ms = very slow
};

// ==================== COLORS ====================

const c = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m',
    bold: '\x1b[1m'
};

// ==================== TIMING ====================

/**
 * Measure execution time of a function
 * @param {string} name - Operation name
 * @param {Function} fn - Function to measure
 * @returns {Promise<{result: any, duration: number, memory: object}>}
 */
async function measure(name, fn) {
    const startTime = performance.now();
    const startMemory = process.memoryUsage();

    let result;
    let error = null;

    try {
        result = await fn();
    } catch (e) {
        error = e;
    }

    const endTime = performance.now();
    const endMemory = process.memoryUsage();

    const duration = Math.round((endTime - startTime) * 100) / 100;
    const memoryDelta = {
        heapUsed: endMemory.heapUsed - startMemory.heapUsed,
        heapTotal: endMemory.heapTotal - startMemory.heapTotal,
        external: endMemory.external - startMemory.external
    };

    // Store metric
    const metric = {
        name,
        duration,
        memory: memoryDelta,
        timestamp: new Date().toISOString(),
        success: !error
    };

    if (!metrics.has(name)) {
        metrics.set(name, []);
    }
    metrics.get(name).push(metric);

    if (error) {
        throw error;
    }

    return { result, duration, memory: memoryDelta };
}

/**
 * Simple timing wrapper
 * @param {string} label - Operation label
 */
function time(label) {
    const start = performance.now();
    return {
        end: () => {
            const duration = performance.now() - start;
            console.log(`${c.gray}⏱️ ${label}: ${duration.toFixed(2)}ms${c.reset}`);
            return duration;
        }
    };
}

/**
 * Benchmark multiple iterations
 * @param {string} name - Benchmark name
 * @param {Function} fn - Function to benchmark
 * @param {number} iterations - Number of iterations
 */
async function benchmark(name, fn, iterations = 10) {
    const results = [];

    for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        await fn();
        results.push(performance.now() - start);
    }

    const avg = results.reduce((a, b) => a + b, 0) / results.length;
    const min = Math.min(...results);
    const max = Math.max(...results);
    const p95 = results.sort((a, b) => a - b)[Math.floor(results.length * 0.95)];

    return {
        name,
        iterations,
        avg: Math.round(avg * 100) / 100,
        min: Math.round(min * 100) / 100,
        max: Math.round(max * 100) / 100,
        p95: Math.round(p95 * 100) / 100
    };
}

// ==================== MEMORY ====================

/**
 * Get current memory usage
 */
function getMemoryUsage() {
    const usage = process.memoryUsage();
    return {
        heapUsed: formatBytes(usage.heapUsed),
        heapTotal: formatBytes(usage.heapTotal),
        external: formatBytes(usage.external),
        rss: formatBytes(usage.rss)
    };
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

// ==================== REPORTING ====================

/**
 * Get performance status color
 */
function getStatusColor(duration) {
    if (duration < thresholds.fast) return c.green;
    if (duration < thresholds.normal) return c.blue;
    if (duration < thresholds.slow) return c.yellow;
    return c.red;
}

/**
 * Get performance status label
 */
function getStatusLabel(duration) {
    if (duration < thresholds.fast) return '🚀 FAST';
    if (duration < thresholds.normal) return '✓ NORMAL';
    if (duration < thresholds.slow) return '⚠️ SLOW';
    return '❌ VERY SLOW';
}

/**
 * Print performance report
 */
function report() {
    console.log(`\n${c.cyan}╔════════════════════════════════════════╗${c.reset}`);
    console.log(`${c.cyan}║${c.reset}  📊 Performance Report                  ${c.cyan}║${c.reset}`);
    console.log(`${c.cyan}╚════════════════════════════════════════╝${c.reset}\n`);

    if (metrics.size === 0) {
        console.log(`${c.gray}No metrics collected yet.${c.reset}`);
        return;
    }

    for (const [name, data] of metrics) {
        const durations = data.map(d => d.duration);
        const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
        const color = getStatusColor(avg);
        const status = getStatusLabel(avg);

        console.log(`${c.bold}${name}${c.reset}`);
        console.log(`  Runs: ${data.length}`);
        console.log(`  Avg: ${color}${avg.toFixed(2)}ms${c.reset} ${status}`);
        console.log(`  Min: ${Math.min(...durations).toFixed(2)}ms`);
        console.log(`  Max: ${Math.max(...durations).toFixed(2)}ms`);
        console.log('');
    }

    // Memory summary
    const mem = getMemoryUsage();
    console.log(`${c.bold}Memory Usage${c.reset}`);
    console.log(`  Heap: ${mem.heapUsed} / ${mem.heapTotal}`);
    console.log(`  RSS: ${mem.rss}`);
}

/**
 * Get metrics as JSON
 */
function getMetrics() {
    const result = {};
    for (const [name, data] of metrics) {
        const durations = data.map(d => d.duration);
        result[name] = {
            runs: data.length,
            avg: durations.reduce((a, b) => a + b, 0) / durations.length,
            min: Math.min(...durations),
            max: Math.max(...durations),
            success: data.filter(d => d.success).length
        };
    }
    return result;
}

/**
 * Clear all metrics
 */
function clear() {
    metrics.clear();
}

// ==================== EXPORTS ====================

export {
    measure,
    time,
    benchmark,
    getMemoryUsage,
    report,
    getMetrics,
    clear,
    thresholds
};

export default {
    measure,
    time,
    benchmark,
    getMemoryUsage,
    report,
    getMetrics,
    clear
};
