#!/usr/bin/env node
// @ts-nocheck
/**
 * Mobile Design Audit — MFRI Scoring + Platform Compliance
 *
 * Audits mobile app projects for design quality using the
 * Mobile Feasibility & Risk Index (5 dimensions, 0-10 score).
 *
 * @version 2.0.0
 * @contract mobile-design v2.0.0
 * @see references/engineering-spec.md
 *
 * Checks:
 *  - Platform detection (iOS/Android/React Native/Flutter)
 *  - Touch target sizing (44×44pt iOS / 48×48dp Android)
 *  - Accessibility attributes (a11y labels, content descriptions)
 *  - Platform typography (SF Pro / Roboto detection)
 *  - Offline capability indicators
 *  - MFRI composite score
 *
 * Read-only: scans source files, never modifies them.
 */

import fs from 'node:fs';
import path from 'node:path';

// --- MFRI Dimensions (from SKILL.md) ---
const MFRI_DIMENSIONS = [
    'Platform Clarity',
    'Interaction Complexity',
    'Performance Risk',
    'Offline Dependence',
    'Accessibility Risk'
];

// --- Audit Checklist ---
const checks = {
    platform: { name: 'Platform Detection', weight: 2, score: 0, details: '' },
    touchTargets: { name: 'Touch Targets (44pt/48dp)', weight: 2, score: 0, details: '' },
    accessibility: { name: 'Accessibility Attributes', weight: 2, score: 0, details: '' },
    typography: { name: 'Platform Typography', weight: 1, score: 0, details: '' },
    offline: { name: 'Offline Capability', weight: 1, score: 0, details: '' },
    performance: { name: 'Performance Patterns', weight: 1, score: 0, details: '' },
    navigation: { name: 'Navigation Patterns', weight: 1, score: 0, details: '' },
};

/** Recursively get source files with depth limit. */
function getSourceFiles(dir, exts, maxDepth = 5, depth = 0) {
    if (depth >= maxDepth) return [];
    let files = [];
    try {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        for (const item of items) {
            if (item.name.startsWith('.') || item.name === 'node_modules' || item.name === 'build' || item.name === 'dist') continue;
            const fullPath = path.resolve(dir, item.name);
            if (item.isDirectory()) {
                files = [...files, ...getSourceFiles(fullPath, exts, maxDepth, depth + 1)];
            } else if (exts.some(ext => item.name.endsWith(ext))) {
                files.push(fullPath);
            }
        }
    } catch { /* permission denied */ }
    return files;
}

/** Read file content safely. */
function readSafe(filePath) {
    try { return fs.readFileSync(filePath, 'utf8'); } catch { return ''; }
}

/** Run the full audit. */
function auditProject(projectPath) {
    if (!fs.existsSync(projectPath)) {
        console.error(JSON.stringify({
            success: false,
            error: { code: 'ERR_PATH_NOT_FOUND', message: `Path not found: ${projectPath}` }
        }));
        process.exit(1);
    }

    const sourceFiles = getSourceFiles(projectPath, ['.tsx', '.jsx', '.ts', '.js', '.dart', '.kt', '.swift', '.xml']);
    const sampleFiles = sourceFiles.slice(0, 50);
    const sampleContents = sampleFiles.map(f => ({ path: f, content: readSafe(f) }));

    // 1. Platform Detection
    const platforms = new Set();
    if (fs.existsSync(path.join(projectPath, 'android')) || fs.existsSync(path.join(projectPath, 'app/build.gradle'))) {
        platforms.add('android');
    }
    if (fs.existsSync(path.join(projectPath, 'ios')) || fs.readdirSync(projectPath).some(f => f.endsWith('.xcodeproj'))) {
        platforms.add('ios');
    }
    if (fs.existsSync(path.join(projectPath, 'pubspec.yaml'))) {
        platforms.add('flutter');
    }
    if (fs.existsSync(path.join(projectPath, 'package.json'))) {
        try {
            const pkg = JSON.parse(readSafe(path.join(projectPath, 'package.json')));
            const deps = { ...pkg.dependencies, ...pkg.devDependencies };
            if (deps['react-native']) platforms.add('react-native');
            if (deps['expo']) platforms.add('expo');
        } catch { /* invalid json */ }
    }

    checks.platform.score = platforms.size > 0 ? 2 : 0;
    checks.platform.details = platforms.size > 0
        ? `Detected: ${[...platforms].join(', ')}`
        : 'No mobile platform detected';

    // 2. Touch Targets (iOS 44pt / Android 48dp)
    const touchPatterns = [
        /minHeight:\s*(4[4-9]|[5-9]\d|\d{3})/,   // >= 44
        /minWidth:\s*(4[4-9]|[5-9]\d|\d{3})/,
        /hitSlop/,
        /TouchableOpacity|TouchableHighlight|Pressable/i,
        /GestureDetector|InkWell/,                 // Flutter
        /android:minHeight="48dp"/,                // Android XML
    ];

    let touchHits = 0;
    for (const { content } of sampleContents) {
        if (touchPatterns.some(p => p.test(content))) touchHits++;
    }
    const touchRatio = sampleContents.length > 0 ? touchHits / sampleContents.length : 0;
    checks.touchTargets.score = touchRatio > 0.1 ? 2 : touchRatio > 0 ? 1 : 0;
    checks.touchTargets.details = `${touchHits}/${sampleContents.length} files have touch target patterns`;

    // 3. Accessibility
    const a11yPatterns = [
        /accessibilityLabel/,
        /accessibilityHint/,
        /accessibilityRole/,
        /contentDescription/,
        /semanticLabel/,
        /Semantics\(/,
        /aria-label/,
        /importantForAccessibility/,
    ];

    let a11yHits = 0;
    for (const { content } of sampleContents) {
        if (a11yPatterns.some(p => p.test(content))) a11yHits++;
    }
    const a11yRatio = sampleContents.length > 0 ? a11yHits / sampleContents.length : 0;
    checks.accessibility.score = a11yRatio > 0.2 ? 2 : a11yRatio > 0 ? 1 : 0;
    checks.accessibility.details = `${a11yHits}/${sampleContents.length} files have a11y attributes`;

    // 4. Platform Typography (SF Pro / Roboto)
    const typoPatterns = [
        /SF Pro|SFProText|SFProDisplay/i,
        /Roboto|MaterialTheme\.typography/i,
        /fontFamily.*Inter|fontFamily.*System/i,
    ];

    let typoHits = 0;
    for (const { content } of sampleContents) {
        if (typoPatterns.some(p => p.test(content))) typoHits++;
    }
    checks.typography.score = typoHits > 0 ? 1 : 0;
    checks.typography.details = typoHits > 0
        ? `Platform typography detected in ${typoHits} files`
        : 'No platform typography detected';

    // 5. Offline Capability
    const offlinePatterns = [
        /AsyncStorage|@react-native-async-storage/,
        /NetInfo|@react-native-community\/netinfo/,
        /SharedPreferences|Room|SQLite/i,
        /CoreData|UserDefaults|Realm/i,
        /sqflite|hive|shared_preferences/,
        /offline|cache|persist/i,
    ];

    let offlineHits = 0;
    for (const { content } of sampleContents) {
        if (offlinePatterns.some(p => p.test(content))) offlineHits++;
    }
    checks.offline.score = offlineHits > 0 ? 1 : 0;
    checks.offline.details = offlineHits > 0
        ? `Offline patterns in ${offlineHits} files`
        : 'No offline capability indicators';

    // 6. Performance Patterns
    const perfPatterns = [
        /useMemo|useCallback|React\.memo/,
        /FlatList|SectionList|RecyclerView/i,
        /LazyColumn|LazyRow/,
        /ListView\.builder/,
        /shouldComponentUpdate/,
    ];

    let perfHits = 0;
    for (const { content } of sampleContents) {
        if (perfPatterns.some(p => p.test(content))) perfHits++;
    }
    checks.performance.score = perfHits > 0 ? 1 : 0;
    checks.performance.details = perfHits > 0
        ? `Performance patterns in ${perfHits} files`
        : 'No performance optimization patterns detected';

    // 7. Navigation
    const navPatterns = [
        /react-navigation|@react-navigation/,
        /createBottomTabNavigator|createStackNavigator/,
        /NavigationContainer/,
        /GoRouter|Navigator|MaterialApp/,
        /UINavigationController|UITabBarController/,
        /BottomNavigationView|NavController/,
    ];

    let navHits = 0;
    for (const { content } of sampleContents) {
        if (navPatterns.some(p => p.test(content))) navHits++;
    }
    checks.navigation.score = navHits > 0 ? 1 : 0;
    checks.navigation.details = navHits > 0
        ? `Navigation patterns in ${navHits} files`
        : 'No navigation framework detected';

    // Calculate MFRI Score (0-10)
    const maxScore = Object.values(checks).reduce((sum, c) => sum + c.weight, 0);
    const rawScore = Object.values(checks).reduce((sum, c) => sum + c.score, 0);
    const mfri = Math.round((rawScore / maxScore) * 10);

    // MFRI rating
    let mfriRating;
    if (mfri >= 6) mfriRating = '✅ Safe — proceed';
    else if (mfri >= 3) mfriRating = '⚠️ Add validation';
    else mfriRating = '🔴 Simplify first';

    return {
        success: true,
        version: '2.0.0',
        project: projectPath,
        platforms: [...platforms],
        filesScanned: sampleContents.length,
        totalSourceFiles: sourceFiles.length,
        mfri: {
            score: mfri,
            maxScore: 10,
            rating: mfriRating,
            dimensions: MFRI_DIMENSIONS
        },
        checks: Object.entries(checks).map(([key, c]) => ({
            id: key,
            name: c.name,
            score: c.score,
            maxScore: c.weight,
            pass: c.score > 0,
            details: c.details
        })),
    };
}

// --- CLI ---
const args = process.argv.slice(2);

if (args.includes('--help') || args.length < 1) {
    console.log(`
Mobile Design Audit — MFRI Scoring (v2.0.0)

Usage:
  node mobile_audit.js <project_path> [options]

Options:
  --json      Output raw JSON only
  --help      Show this help

MFRI Score Guide:
  6-10  ✅ Safe — proceed
  3-5   ⚠️ Add validation
  0-2   🔴 Simplify first

Examples:
  node mobile_audit.js ./my-app
  node mobile_audit.js ./my-app --json
`);
    process.exit(0);
}

const projectPath = args[0];
const jsonOnly = args.includes('--json');
const result = auditProject(projectPath);

if (jsonOnly) {
    console.log(JSON.stringify(result, null, 2));
} else {
    console.log('');
    console.log('='.repeat(50));
    console.log('📱 MOBILE DESIGN AUDIT (MFRI v2.0.0)');
    console.log('='.repeat(50));
    console.log(`Project: ${result.project}`);
    console.log(`Platforms: ${result.platforms.join(', ') || 'none detected'}`);
    console.log(`Files scanned: ${result.filesScanned} / ${result.totalSourceFiles}`);
    console.log('');

    for (const check of result.checks) {
        const icon = check.pass ? '✅' : '❌';
        console.log(`  ${icon} ${check.name}: ${check.score}/${check.maxScore} — ${check.details}`);
    }

    console.log('');
    console.log('-'.repeat(50));
    console.log(`  MFRI Score: ${result.mfri.score}/10 — ${result.mfri.rating}`);
    console.log('-'.repeat(50));
    console.log('');
}

process.exit(result.mfri.score >= 3 ? 0 : 1);
