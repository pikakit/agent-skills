#!/usr/bin/env node
/**
 * Health Check Script for Auto-Rollback System
 * 
 * Checks if a deployed application is healthy by:
 * 1. Hitting health endpoints
 * 2. Measuring response time
 * 3. Checking status codes
 * 
 * Usage:
 *   node health-check.js <url> [--timeout 60] [--retries 3]
 */

import http from 'http';
import https from 'https';
import { URL } from 'url';

// Configuration
const DEFAULT_TIMEOUT = 60000; // 60 seconds
const DEFAULT_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

const HEALTH_ENDPOINTS = [
    '/api/health',
    '/health',
    '/healthz',
    '/'
];

const MAX_RESPONSE_TIME = 2000; // 2 seconds

/**
 * Parse CLI arguments
 */
function parseArgs() {
    const args = process.argv.slice(2);
    const config = {
        url: null,
        timeout: DEFAULT_TIMEOUT,
        retries: DEFAULT_RETRIES
    };

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--timeout' && args[i + 1]) {
            config.timeout = parseInt(args[i + 1], 10) * 1000;
            i++;
        } else if (args[i] === '--retries' && args[i + 1]) {
            config.retries = parseInt(args[i + 1], 10);
            i++;
        } else if (!args[i].startsWith('--')) {
            config.url = args[i];
        }
    }

    return config;
}

/**
 * Make HTTP/HTTPS request with timeout
 */
function request(url, timeout) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const parsedUrl = new URL(url);
        const client = parsedUrl.protocol === 'https:' ? https : http;

        const req = client.get(url, { timeout }, (res) => {
            const responseTime = Date.now() - startTime;
            let data = '';
            
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    responseTime,
                    data,
                    headers: res.headers
                });
            });
        });

        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error(`Request timeout after ${timeout}ms`));
        });
    });
}

/**
 * Check single endpoint
 */
async function checkEndpoint(baseUrl, endpoint, timeout) {
    const url = new URL(endpoint, baseUrl).toString();
    
    try {
        const result = await request(url, timeout);
        
        return {
            endpoint,
            success: result.statusCode >= 200 && result.statusCode < 400,
            statusCode: result.statusCode,
            responseTime: result.responseTime,
            withinThreshold: result.responseTime < MAX_RESPONSE_TIME
        };
    } catch (error) {
        return {
            endpoint,
            success: false,
            error: error.message
        };
    }
}

/**
 * Run health check with retries
 */
async function runHealthCheck(config) {
    console.log(`\n🔍 Health Check for ${config.url}`);
    console.log(`   Timeout: ${config.timeout / 1000}s | Retries: ${config.retries}\n`);

    for (let attempt = 1; attempt <= config.retries; attempt++) {
        console.log(`Attempt ${attempt}/${config.retries}...`);
        
        let foundHealthy = false;
        const results = [];

        for (const endpoint of HEALTH_ENDPOINTS) {
            const result = await checkEndpoint(config.url, endpoint, config.timeout);
            results.push(result);

            if (result.success) {
                foundHealthy = true;
                console.log(`  ✅ ${endpoint} - ${result.statusCode} (${result.responseTime}ms)`);
                
                // Check response time threshold
                if (!result.withinThreshold) {
                    console.log(`  ⚠️  Response time ${result.responseTime}ms exceeds threshold ${MAX_RESPONSE_TIME}ms`);
                }
            } else if (result.error) {
                console.log(`  ❌ ${endpoint} - ${result.error}`);
            } else {
                console.log(`  ❌ ${endpoint} - ${result.statusCode}`);
            }
        }

        if (foundHealthy) {
            console.log('\n✅ Health check PASSED\n');
            return { success: true, results };
        }

        if (attempt < config.retries) {
            console.log(`\nRetrying in ${RETRY_DELAY / 1000}s...`);
            await new Promise(r => setTimeout(r, RETRY_DELAY));
        }
    }

    console.log('\n❌ Health check FAILED after all retries\n');
    return { success: false };
}

/**
 * Main
 */
async function main() {
    const config = parseArgs();

    if (!config.url) {
        console.log(`
Usage: node health-check.js <url> [options]

Options:
  --timeout <seconds>   Request timeout (default: 60)
  --retries <count>     Number of retries (default: 3)

Examples:
  node health-check.js http://localhost:3000
  node health-check.js https://app.example.com --timeout 30 --retries 5
`);
        process.exit(1);
    }

    try {
        const result = await runHealthCheck(config);
        process.exit(result.success ? 0 : 1);
    } catch (error) {
        console.error('Health check error:', error.message);
        process.exit(1);
    }
}

main();
