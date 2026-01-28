#!/usr/bin/env node
/**
 * Knowledge Metrics Collector
 * 
 * Aggregates KPIs from knowledge base for observability.
 * Metrics are collected on-demand or on scan completion.
 * 
 * Usage:
 *   ag-smart metrics           # Show dashboard
 *   ag-smart metrics --json    # JSON output for CI
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { KNOWLEDGE_DIR } from './config.js';
import { loadIndex } from './knowledge-index.js';

const METRICS_PATH = path.join(KNOWLEDGE_DIR, 'metrics.json');

/**
 * Load mistakes and improvements
 * @returns {{ mistakes: Array, improvements: Array }}
 */
function loadKnowledge() {
    const mistakes = [];
    const improvements = [];
    
    const mistakesPath = path.join(KNOWLEDGE_DIR, 'mistakes.yaml');
    if (fs.existsSync(mistakesPath)) {
        const data = yaml.load(fs.readFileSync(mistakesPath, 'utf8'));
        if (data?.mistakes) mistakes.push(...data.mistakes);
    }
    
    const improvementsPath = path.join(KNOWLEDGE_DIR, 'improvements.yaml');
    if (fs.existsSync(improvementsPath)) {
        const data = yaml.load(fs.readFileSync(improvementsPath, 'utf8'));
        if (data?.improvements) improvements.push(...data.improvements);
    }
    
    return { mistakes, improvements };
}

/**
 * Calculate average confidence score
 * @param {Array} lessons
 * @returns {number}
 */
function calculateAvgConfidence(lessons) {
    if (lessons.length === 0) return 0;
    
    const total = lessons.reduce((sum, l) => {
        return sum + (l.cognitive?.confidence || 0.3);
    }, 0);
    
    return total / lessons.length;
}

/**
 * Calculate escalation rate
 * @param {Array} mistakes
 * @returns {number}
 */
function calculateEscalationRate(mistakes) {
    if (mistakes.length === 0) return 0;
    
    const escalated = mistakes.filter(m => m.autoEscalated === true).length;
    return escalated / mistakes.length;
}

/**
 * Calculate fix rate
 * @param {Array} improvements
 * @returns {number}
 */
function calculateFixRate(improvements) {
    if (improvements.length === 0) return 0;
    
    const applied = improvements.filter(i => (i.appliedCount || 0) > 0).length;
    return applied / improvements.length;
}

/**
 * Get 7-day hit trend
 * @param {Array} lessons
 * @returns {number[]}
 */
function get7DayTrend(lessons) {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const trend = new Array(7).fill(0);
    
    for (const lesson of lessons) {
        if (lesson.lastHit) {
            const hitTime = new Date(lesson.lastHit).getTime();
            const daysAgo = Math.floor((now - hitTime) / dayMs);
            
            if (daysAgo >= 0 && daysAgo < 7) {
                trend[6 - daysAgo] += lesson.hitCount || 0;
            }
        }
    }
    
    return trend;
}

/**
 * Get new lessons in last 30 days
 * @param {Array} lessons
 * @returns {number}
 */
function getNewLessonsLast30Days(lessons) {
    const now = Date.now();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    
    return lessons.filter(l => {
        if (l.addedAt) {
            const addedTime = new Date(l.addedAt).getTime();
            return (now - addedTime) < thirtyDaysMs;
        }
        return false;
    }).length;
}

/**
 * Get top violations
 * @param {Array} mistakes
 * @param {number} limit
 * @returns {Array}
 */
function getTopViolations(mistakes, limit = 5) {
    return mistakes
        .map(m => ({
            id: m.id,
            pattern: m.pattern,
            hitCount: m.hitCount || 0,
            severity: m.severity || 'WARNING'
        }))
        .sort((a, b) => b.hitCount - a.hitCount)
        .slice(0, limit);
}

/**
 * Get stale lessons (no hits, old)
 * @param {Array} lessons
 * @returns {number}
 */
function getStaleLessonsCount(lessons) {
    const now = Date.now();
    const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;
    
    return lessons.filter(l => {
        const noHits = !l.hitCount || l.hitCount === 0;
        const isOld = l.addedAt && (now - new Date(l.addedAt).getTime()) > ninetyDaysMs;
        return noHits && isOld;
    }).length;
}

/**
 * Collect all metrics
 * @returns {Object}
 */
export function collectMetrics() {
    const { mistakes, improvements } = loadKnowledge();
    const allLessons = [...mistakes, ...improvements];
    
    // Load index for additional stats
    let indexStats = { totalPatterns: 0, totalTags: 0 };
    try {
        const index = loadIndex();
        indexStats = index.stats || indexStats;
    } catch (e) {
        // Index may not exist yet
    }
    
    const metrics = {
        version: 1,
        lastUpdated: new Date().toISOString(),
        
        kpis: {
            totalLessons: allLessons.length,
            totalMistakes: mistakes.length,
            totalImprovements: improvements.length,
            activePatterns: allLessons.filter(l => (l.hitCount || 0) > 0).length,
            totalHits: allLessons.reduce((sum, l) => sum + (l.hitCount || 0), 0),
            avgConfidence: parseFloat(calculateAvgConfidence(allLessons).toFixed(2)),
            escalationRate: parseFloat(calculateEscalationRate(mistakes).toFixed(2)),
            fixRate: parseFloat(calculateFixRate(improvements).toFixed(2)),
            staleLessons: getStaleLessonsCount(allLessons)
        },
        
        trends: {
            hitsLast7Days: get7DayTrend(allLessons),
            newLessonsLast30Days: getNewLessonsLast30Days(allLessons)
        },
        
        topViolations: getTopViolations(mistakes, 5),
        
        breakdown: {
            bySeverity: {
                ERROR: mistakes.filter(m => m.severity === 'ERROR').length,
                WARNING: mistakes.filter(m => m.severity === 'WARNING').length,
                INFO: improvements.length
            },
            byMaturity: {
                stable: allLessons.filter(l => l.cognitive?.maturity === 'stable').length,
                learning: allLessons.filter(l => l.cognitive?.maturity === 'learning').length,
                deprecated: allLessons.filter(l => l.cognitive?.maturity === 'deprecated').length
            }
        },
        
        index: indexStats
    };
    
    return metrics;
}

/**
 * Save metrics to file
 * @param {Object} metrics
 */
export function saveMetrics(metrics) {
    fs.writeFileSync(METRICS_PATH, JSON.stringify(metrics, null, 2), 'utf8');
}

/**
 * Load cached metrics
 * @returns {Object|null}
 */
export function loadMetrics() {
    if (!fs.existsSync(METRICS_PATH)) {
        return null;
    }
    
    try {
        return JSON.parse(fs.readFileSync(METRICS_PATH, 'utf8'));
    } catch (e) {
        return null;
    }
}

/**
 * Display metrics dashboard
 * @param {Object} metrics
 */
function displayDashboard(metrics) {
    console.log(`
📊 Knowledge Metrics Dashboard
${'─'.repeat(50)}

📈 KPIs:
   Total Lessons:     ${metrics.kpis.totalLessons}
   Active Patterns:   ${metrics.kpis.activePatterns} (${Math.round((metrics.kpis.activePatterns / metrics.kpis.totalLessons) * 100)}%)
   Total Hits:        ${metrics.kpis.totalHits}
   Avg Confidence:    ${metrics.kpis.avgConfidence}
   Escalation Rate:   ${Math.round(metrics.kpis.escalationRate * 100)}%
   Fix Rate:          ${Math.round(metrics.kpis.fixRate * 100)}%
   Stale Lessons:     ${metrics.kpis.staleLessons}

📊 Breakdown:
   Mistakes:          ${metrics.kpis.totalMistakes}
     ERROR:           ${metrics.breakdown.bySeverity.ERROR}
     WARNING:         ${metrics.breakdown.bySeverity.WARNING}
   Improvements:      ${metrics.kpis.totalImprovements}

🧠 Maturity:
   Stable:            ${metrics.breakdown.byMaturity.stable}
   Learning:          ${metrics.breakdown.byMaturity.learning}
   Deprecated:        ${metrics.breakdown.byMaturity.deprecated}

📈 Trends:
   7-Day Hits:        ${sparkline(metrics.trends.hitsLast7Days)}
   New (30d):         ${metrics.trends.newLessonsLast30Days}

🔥 Top Violations:`);

    metrics.topViolations.forEach((v, i) => {
        console.log(`   ${i + 1}. ${v.id}: ${v.hitCount} hits (${v.severity})`);
    });

    console.log(`
🔎 Index:
   Patterns:          ${metrics.index.totalPatterns}
   Tags:              ${metrics.index.totalTags}
   
Last Updated: ${new Date(metrics.lastUpdated).toLocaleString()}
`);
}

/**
 * Generate ASCII sparkline
 * @param {number[]} data
 * @returns {string}
 */
function sparkline(data) {
    const chars = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
    const max = Math.max(...data, 1);
    
    return data.map(val => {
        const index = Math.floor((val / max) * (chars.length - 1));
        return chars[index];
    }).join('');
}

/**
 * CLI entry point
 */
function main() {
    const args = process.argv.slice(2);
    const jsonMode = args.includes('--json');
    
    console.log('🔄 Collecting metrics...');
    const metrics = collectMetrics();
    
    // Save for caching
    saveMetrics(metrics);
    
    if (jsonMode) {
        console.log(JSON.stringify(metrics, null, 2));
        return;
    }
    
    displayDashboard(metrics);
}

// Run if called directly
if (process.argv[1]?.includes('knowledge-metrics')) {
    main();
}

export default {
    collectMetrics,
    saveMetrics,
    loadMetrics
};
