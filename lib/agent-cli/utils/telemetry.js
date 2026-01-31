/**
 * Telemetry Utility - Local Metrics Collection
 * 
 * Provides opt-in anonymous metrics collection:
 * - Local storage only (no external transmission)
 * - Error frequency tracking
 * - Usage patterns
 * - Performance metrics
 * 
 * Usage:
 *   import telemetry from './telemetry.js';
 *   telemetry.track('error_detected', { type: 'test' });
 *   telemetry.report();
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==================== CONFIGURATION ====================

const config = {
    enabled: true,          // Master switch
    storeLocally: true,     // Store to file
    maxEvents: 1000,        // Max events to keep
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    storagePath: null       // Will be set dynamically
};

// ==================== STORAGE ====================

const events = [];
const counters = new Map();
const gauges = new Map();

// ==================== HELPERS ====================

/**
 * Get storage path
 */
function getStoragePath() {
    if (config.storagePath) return config.storagePath;

    // Try to find project root
    let dir = process.cwd();
    while (dir !== path.dirname(dir)) {
        if (fs.existsSync(path.join(dir, 'package.json'))) {
            return path.join(dir, '.agent', 'knowledge', 'telemetry.json');
        }
        dir = path.dirname(dir);
    }

    return path.join(process.cwd(), '.agent', 'knowledge', 'telemetry.json');
}

/**
 * Load existing telemetry data
 */
function load() {
    const storagePath = getStoragePath();
    if (!fs.existsSync(storagePath)) return;

    try {
        const data = JSON.parse(fs.readFileSync(storagePath, 'utf8'));
        if (data.events) events.push(...data.events);
        if (data.counters) {
            for (const [k, v] of Object.entries(data.counters)) {
                counters.set(k, v);
            }
        }
    } catch (e) {
        // Ignore parse errors
    }
}

/**
 * Save telemetry data
 */
function save() {
    if (!config.storeLocally) return;

    const storagePath = getStoragePath();
    const dir = path.dirname(storagePath);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const data = {
        events: events.slice(-config.maxEvents),
        counters: Object.fromEntries(counters),
        gauges: Object.fromEntries(gauges),
        savedAt: new Date().toISOString()
    };

    fs.writeFileSync(storagePath, JSON.stringify(data, null, 2));
}

// ==================== TRACKING ====================

/**
 * Track an event
 * @param {string} name - Event name
 * @param {object} properties - Event properties
 */
function track(name, properties = {}) {
    if (!config.enabled) return;

    const event = {
        name,
        properties,
        timestamp: new Date().toISOString()
    };

    events.push(event);

    // Increment counter
    increment(name);

    // Cleanup old events
    if (events.length > config.maxEvents) {
        events.splice(0, events.length - config.maxEvents);
    }
}

/**
 * Increment a counter
 * @param {string} name - Counter name
 * @param {number} value - Value to add (default: 1)
 */
function increment(name, value = 1) {
    if (!config.enabled) return;
    counters.set(name, (counters.get(name) || 0) + value);
}

/**
 * Set a gauge value
 * @param {string} name - Gauge name
 * @param {number} value - Value to set
 */
function gauge(name, value) {
    if (!config.enabled) return;
    gauges.set(name, value);
}

// ==================== TIMING ====================

/**
 * Time an operation
 * @param {string} name - Operation name
 */
function startTimer(name) {
    const start = Date.now();
    return {
        end: () => {
            const duration = Date.now() - start;
            track(`${name}_duration`, { duration });
            return duration;
        }
    };
}

// ==================== REPORTING ====================

/**
 * Get summary statistics
 */
function getSummary() {
    const now = Date.now();
    const cutoff = now - 24 * 60 * 60 * 1000; // Last 24 hours

    const recentEvents = events.filter(e =>
        new Date(e.timestamp).getTime() > cutoff
    );

    const byName = {};
    for (const event of recentEvents) {
        byName[event.name] = (byName[event.name] || 0) + 1;
    }

    return {
        totalEvents: events.length,
        last24h: recentEvents.length,
        counters: Object.fromEntries(counters),
        gauges: Object.fromEntries(gauges),
        byEvent: byName
    };
}

/**
 * Print telemetry report
 */
function report() {
    const summary = getSummary();

    console.log('\n📊 Telemetry Report');
    console.log('═══════════════════\n');

    console.log(`Total Events: ${summary.totalEvents}`);
    console.log(`Last 24h: ${summary.last24h}`);

    if (Object.keys(summary.counters).length > 0) {
        console.log('\nCounters:');
        for (const [name, count] of Object.entries(summary.counters)) {
            console.log(`  ${name}: ${count}`);
        }
    }

    if (Object.keys(summary.byEvent).length > 0) {
        console.log('\nRecent Events (24h):');
        const sorted = Object.entries(summary.byEvent)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        for (const [name, count] of sorted) {
            console.log(`  ${name}: ${count}`);
        }
    }
}

// ==================== CONFIGURATION ====================

/**
 * Enable telemetry
 */
function enable() {
    config.enabled = true;
}

/**
 * Disable telemetry
 */
function disable() {
    config.enabled = false;
}

/**
 * Check if enabled
 */
function isEnabled() {
    return config.enabled;
}

/**
 * Clear all telemetry data
 */
function clear() {
    events.length = 0;
    counters.clear();
    gauges.clear();
}

// ==================== EXPORTS ====================

const telemetry = {
    track,
    increment,
    gauge,
    startTimer,
    getSummary,
    report,
    enable,
    disable,
    isEnabled,
    clear,
    save,
    load,
    config
};

export {
    track,
    increment,
    gauge,
    startTimer,
    getSummary,
    report,
    enable,
    disable,
    isEnabled,
    clear,
    save,
    load,
    config
};

export default telemetry;
