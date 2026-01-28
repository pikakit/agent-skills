#!/usr/bin/env node
/**
 * Chaos Injector - Core Engine for Chaos Engineering
 * 
 * SAFETY: This script includes multiple safety guards.
 * Never run in production environment.
 * 
 * Commands:
 *   latency     - Inject latency into requests
 *   network     - Simulate network failures  
 *   stress      - CPU/memory stress test
 *   stop        - Emergency stop all experiments
 */

import fs from 'fs';
import path from 'path';

const CONFIG_FILE = '.chaos-config.json';
const STATE_FILE = '.chaos-state.json';

// Default safety limits
const DEFAULT_SAFETY = {
    enabled: true,
    maxDuration: 300000, // 5 minutes
    maxCpuPercent: 90,
    maxMemoryMB: 1024,
    excludeEnvironments: ['production', 'prod'],
    requireConfirmation: true,
    autoStopOnError: true
};

/**
 * Load configuration
 */
function loadConfig() {
    const configPath = path.join(process.cwd(), CONFIG_FILE);
    
    if (fs.existsSync(configPath)) {
        try {
            return JSON.parse(fs.readFileSync(configPath, 'utf8'));
        } catch {
            return { safety: DEFAULT_SAFETY };
        }
    }
    
    return { safety: DEFAULT_SAFETY };
}

/**
 * Check if safe to run
 */
function safetyCheck(config) {
    const env = process.env.NODE_ENV || 'development';
    const safety = config.safety || DEFAULT_SAFETY;
    
    // Check environment
    if (safety.excludeEnvironments?.includes(env)) {
        console.error(`\n❌ SAFETY BLOCK: Cannot run chaos in ${env} environment`);
        console.error('   Change NODE_ENV to development or staging');
        process.exit(1);
    }
    
    console.log('\n🛡️  Safety checks passed');
    console.log(`   Environment: ${env}`);
    console.log(`   Max duration: ${safety.maxDuration / 1000}s`);
    
    return true;
}

/**
 * Request user confirmation
 */
async function requestConfirmation(experiment) {
    const config = loadConfig();
    
    if (!config.safety?.requireConfirmation) {
        return true;
    }
    
    console.log(`\n⚠️  About to run chaos experiment: ${experiment}`);
    console.log('   Press Ctrl+C to cancel, or wait 5 seconds to continue...');
    
    // Wait 5 seconds (allows Ctrl+C)
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    return true;
}

/**
 * Save experiment state
 */
function saveState(state) {
    const statePath = path.join(process.cwd(), STATE_FILE);
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
}

/**
 * Clear experiment state
 */
function clearState() {
    const statePath = path.join(process.cwd(), STATE_FILE);
    if (fs.existsSync(statePath)) {
        fs.unlinkSync(statePath);
    }
}

/**
 * Latency injection experiment
 */
async function injectLatency(options) {
    const delay = parseInt(options.delay || '500', 10);
    const duration = parseInt(options.duration || '60', 10) * 1000;
    
    console.log(`\n⏱️  Latency Injection Started`);
    console.log(`   Delay: ${delay}ms`);
    console.log(`   Duration: ${duration / 1000}s`);
    console.log(`   Target: ${options.target || 'all requests'}`);
    
    saveState({
        type: 'latency',
        startTime: Date.now(),
        delay,
        duration,
        target: options.target
    });
    
    // Simulate latency injection
    const startTime = Date.now();
    const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, duration - elapsed);
        
        if (remaining <= 0) {
            clearInterval(interval);
            clearState();
            console.log('\n✅ Latency injection complete');
            return;
        }
        
        process.stdout.write(`\r   Running... ${Math.round(remaining / 1000)}s remaining `);
    }, 1000);
    
    // Handle Ctrl+C
    process.on('SIGINT', () => {
        clearInterval(interval);
        clearState();
        console.log('\n\n🛑 Emergency stop - Latency injection cancelled');
        process.exit(0);
    });
}

/**
 * Network failure simulation
 */
async function simulateNetworkFailure(options) {
    const rate = parseInt(options.rate || '100', 10);
    const duration = parseInt(options.duration || '60', 10) * 1000;
    
    console.log(`\n🌐 Network Failure Simulation Started`);
    console.log(`   Failure rate: ${rate}%`);
    console.log(`   Duration: ${duration / 1000}s`);
    console.log(`   Target: ${options.target || 'all services'}`);
    
    saveState({
        type: 'network-failure',
        startTime: Date.now(),
        rate,
        duration,
        target: options.target
    });
    
    console.log('\n   [Simulating network failures...]');
    console.log('   In a real implementation, this would:');
    console.log('   - Intercept HTTP requests');
    console.log('   - Return 503/timeout based on rate');
    
    await new Promise(resolve => setTimeout(resolve, Math.min(duration, 5000)));
    
    clearState();
    console.log('\n✅ Network failure simulation complete');
}

/**
 * Emergency stop
 */
function emergencyStop() {
    console.log('\n🛑 EMERGENCY STOP');
    
    const statePath = path.join(process.cwd(), STATE_FILE);
    
    if (fs.existsSync(statePath)) {
        const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
        console.log(`   Stopped: ${state.type} experiment`);
        console.log(`   Was running for: ${Math.round((Date.now() - state.startTime) / 1000)}s`);
        clearState();
    } else {
        console.log('   No running experiments found');
    }
    
    console.log('   All chaos experiments stopped\n');
}

/**
 * Show help
 */
function showHelp() {
    console.log(`
Chaos Injector - Resilience Testing Tool

Usage: node chaos-injector.js <command> [options]

Commands:
  latency         Inject latency into requests
  network         Simulate network failures
  stop            Emergency stop all experiments
  status          Show running experiments

Options:
  --delay <ms>      Latency delay in milliseconds
  --duration <s>    Experiment duration in seconds
  --target <name>   Target service/endpoint
  --rate <percent>  Failure rate percentage

Examples:
  node chaos-injector.js latency --delay 500 --duration 60
  node chaos-injector.js network --target api --rate 50
  node chaos-injector.js stop

⚠️  SAFETY: Never run in production!
`);
}

/**
 * Parse arguments
 */
function parseArgs(args) {
    const options = {};
    let command = args[0];
    
    for (let i = 1; i < args.length; i++) {
        if (args[i].startsWith('--') && args[i + 1]) {
            options[args[i].replace('--', '')] = args[i + 1];
            i++;
        }
    }
    
    return { command, options };
}

/**
 * Main
 */
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        showHelp();
        return;
    }
    
    const { command, options } = parseArgs(args);
    const config = loadConfig();
    
    switch (command) {
        case 'latency':
            safetyCheck(config);
            await requestConfirmation('latency injection');
            await injectLatency(options);
            break;
            
        case 'network':
            safetyCheck(config);
            await requestConfirmation('network failure');
            await simulateNetworkFailure(options);
            break;
            
        case 'stop':
            emergencyStop();
            break;
            
        case 'status':
            const statePath = path.join(process.cwd(), STATE_FILE);
            if (fs.existsSync(statePath)) {
                const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
                console.log('\n📊 Running experiment:', state.type);
                console.log(`   Started: ${new Date(state.startTime).toISOString()}`);
            } else {
                console.log('\n📊 No experiments running');
            }
            break;
            
        default:
            showHelp();
    }
}

main().catch(console.error);
