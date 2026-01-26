#!/usr/bin/env node
/**
 * CoinPika Doctrine Validator
 * 
 * Validates a single file or directory against CoinPika doctrines.
 * Usage: node validate_doctrine.js <path> [--doctrine <name>]
 * 
 * @version 1.1.0
 * @author DataGuruIn
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// DOCTRINE RULES
// ============================================================================

const DOCTRINE_RULES = {
    'Law-1': {
        name: 'Truth Ownership',
        description: 'Backend owns financial truth. Frontend only displays.',
        checks: [
            {
                pattern: /localStorage\.(set|get)Item.*(?:price|balance|portfolio)/gi,
                message: 'Price/balance data should not be stored in localStorage',
                suggestion: 'Fetch from backend API instead of caching in localStorage'
            },
            {
                pattern: /const\s+(?:price|balance)\s*=\s*(?:useState|useReducer)/gi,
                message: 'Financial state should originate from backend, not frontend',
                suggestion: 'Use SWR/React Query to fetch from backend API'
            },
            {
                pattern: /calculatePrice|computeBalance|derivePortfolioValue/gi,
                message: 'Price calculations should happen on backend',
                suggestion: 'Move calculation logic to backend API'
            }
        ]
    },
    'Law-2': {
        name: 'Historical Integrity',
        description: 'Historical data is append-only and immutable.',
        checks: [
            {
                pattern: /history.*\.(push|splice|pop|shift|unshift)/gi,
                message: 'Historical arrays should not be mutated',
                suggestion: 'Create new array instead of mutating: [...history, newItem]'
            },
            {
                pattern: /UPDATE.*SET.*WHERE.*(?:timestamp|date|created_at)/gi,
                message: 'Historical records should not be updated',
                suggestion: 'Insert correction record instead of updating'
            },
            {
                pattern: /DELETE.*FROM.*(?:history|prices|candles)/gi,
                message: 'Historical data should not be deleted',
                suggestion: 'Mark as obsolete instead of deleting'
            }
        ]
    },
    'Law-3': {
        name: 'Realtime Ephemerality',
        description: 'Realtime data is ephemeral and separate from historical.',
        checks: [
            {
                pattern: /websocket.*(?:history|historical).*push/gi,
                message: 'WebSocket ticks should not be pushed to historical arrays',
                suggestion: 'Store realtime in separate buffer, aggregate before persisting'
            },
            {
                pattern: /chart.*data.*=.*(?:ws|websocket|socket)/gi,
                message: 'Charts should not consume raw WebSocket feeds',
                suggestion: 'Use aggregated historical API for chart data'
            },
            {
                pattern: /setInterval.*(?:history|chart).*push/gi,
                message: 'Interval-based pushes to history violate ephemerality',
                suggestion: 'Backend should aggregate ticks into OHLCV candles'
            }
        ]
    },
    'Law-4': {
        name: 'Chart Truthfulness',
        description: 'Charts display pre-aggregated backend data only.',
        checks: [
            {
                pattern: /candlestick.*(?:realtime|websocket|live)/gi,
                message: 'Candlestick charts should not use realtime data',
                suggestion: 'Load candlesticks from /api/historical endpoint'
            },
            {
                pattern: /ohlc.*(?:push|update|modify)/gi,
                message: 'OHLC data should be immutable on frontend',
                suggestion: 'Refetch from API instead of modifying locally'
            }
        ]
    },
    'Architecture': {
        name: 'Architecture Boundaries',
        description: 'System boundaries must be respected.',
        checks: [
            {
                pattern: /fetch\(['"`]https?:\/\/(?:api\.coingecko|api\.binance|api\.coinbase)/gi,
                message: 'Frontend should not call external APIs directly',
                suggestion: 'Create backend proxy endpoint for external API calls'
            },
            {
                pattern: /process\.env\.(?:API_KEY|SECRET|PRIVATE)/gi,
                message: 'Secrets should not be accessed in frontend code',
                suggestion: 'Keep secrets server-side only'
            }
        ]
    },
    'Performance': {
        name: 'Performance Standards',
        description: 'Optimization and caching required.',
        checks: [
            {
                pattern: /useEffect.*fetch.*\[\s*\]/gi,
                message: 'Empty dependency array may cause stale data',
                suggestion: 'Consider using SWR or React Query for data fetching'
            },
            {
                pattern: /fetch\([^)]+\)(?!.*\.then.*cache)/gi,
                message: 'API calls should consider caching strategy',
                suggestion: 'Add cache headers or use SWR/React Query'
            }
        ]
    },
    'Frontend-Mobile': {
        name: 'Mobile UX Standards',
        description: 'Mobile-first, touch-friendly interfaces.',
        checks: [
            {
                pattern: /overflow.*hidden.*scroll/gi,
                message: 'Hidden overflow may break native scroll',
                suggestion: 'Use overflow-y: auto instead of hidden'
            },
            {
                pattern: /touchmove.*preventDefault/gi,
                message: 'Blocking touchmove breaks native scroll',
                suggestion: 'Only preventDefault on intentional gestures'
            }
        ]
    }
};

// ============================================================================
// VALIDATION
// ============================================================================

function validateContent(content, filePath, targetDoctrines = null) {
    const results = [];
    const lines = content.split('\n');

    const doctrinesToCheck = targetDoctrines
        ? Object.entries(DOCTRINE_RULES).filter(([k]) => targetDoctrines.includes(k))
        : Object.entries(DOCTRINE_RULES);

    for (const [doctrineId, doctrine] of doctrinesToCheck) {
        for (const check of doctrine.checks) {
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (check.pattern.test(line)) {
                    results.push({
                        doctrine: doctrineId,
                        doctrineName: doctrine.name,
                        file: filePath,
                        line: i + 1,
                        message: check.message,
                        suggestion: check.suggestion,
                        code: line.trim().substring(0, 100)
                    });
                    // Reset regex lastIndex for global patterns
                    check.pattern.lastIndex = 0;
                }
            }
        }
    }

    return results;
}

function validateFile(filePath, targetDoctrines = null) {
    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        return [];
    }

    const content = fs.readFileSync(filePath, 'utf8');
    return validateContent(content, filePath, targetDoctrines);
}

function validateDirectory(dirPath, targetDoctrines = null) {
    const results = [];

    function walkDir(dir) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                if (!file.startsWith('.') && file !== 'node_modules') {
                    walkDir(fullPath);
                }
            } else if (/\.(js|ts|tsx|jsx|mjs)$/.test(file)) {
                results.push(...validateFile(fullPath, targetDoctrines));
            }
        }
    }

    walkDir(dirPath);
    return results;
}

// ============================================================================
// OUTPUT
// ============================================================================

function printResults(results) {
    if (results.length === 0) {
        console.log('\n✅ No doctrine violations found!\n');
        return;
    }

    console.log(`\n🔍 Found ${results.length} potential doctrine violation(s):\n`);

    results.forEach((r, i) => {
        console.log(`${i + 1}. [${r.doctrine}] ${r.doctrineName}`);
        console.log(`   📍 ${r.file}:${r.line}`);
        console.log(`   ⚠️  ${r.message}`);
        console.log(`   💡 ${r.suggestion}`);
        console.log(`   📝 ${r.code}...`);
        console.log('');
    });
}

// ============================================================================
// CLI
// ============================================================================

function printHelp() {
    console.log(`
CoinPika Doctrine Validator v1.1.0

USAGE:
  node validate_doctrine.js <path> [OPTIONS]

OPTIONS:
  --doctrine <name>   Check specific doctrine only (Law-1, Law-2, etc.)
  --json              Output as JSON
  --help              Show this help

DOCTRINES:
  Law-1        Truth Ownership
  Law-2        Historical Integrity
  Law-3        Realtime Ephemerality
  Law-4        Chart Truthfulness
  Architecture System Boundaries
  Performance  Caching & Optimization
  Frontend-Mobile  Mobile UX

EXAMPLES:
  node validate_doctrine.js src/components/Chart.tsx
  node validate_doctrine.js src/ --doctrine Law-3
  node validate_doctrine.js . --json
`);
}

function main() {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.length === 0) {
        printHelp();
        process.exit(0);
    }

    const targetPath = args[0];
    const jsonOutput = args.includes('--json');
    let targetDoctrines = null;

    if (args.includes('--doctrine')) {
        const idx = args.indexOf('--doctrine');
        targetDoctrines = [args[idx + 1]];
    }

    let results;
    const stat = fs.statSync(targetPath);

    if (stat.isDirectory()) {
        results = validateDirectory(targetPath, targetDoctrines);
    } else {
        results = validateFile(targetPath, targetDoctrines);
    }

    if (jsonOutput) {
        console.log(JSON.stringify({ violations: results, count: results.length }, null, 2));
    } else {
        printResults(results);
    }

    process.exit(results.length > 0 ? 1 : 0);
}

main();
