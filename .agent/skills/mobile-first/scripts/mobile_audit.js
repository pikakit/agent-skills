#!/usr/bin/env node
/**
 * Mobile UX Audit — Touch Psychology & Mobile Best Practices
 * Version: 2.0.0
 *
 * Supports: React Native (.js/.jsx/.ts/.tsx), Flutter (.dart),
 *           Native iOS (.swift), Native Android (.kt)
 *
 * Categories:
 * - Touch Psychology (44px minimum targets)
 * - Performance
 * - Navigation
 * - Typography
 * - Platform-specific (iOS/Android)
 * - Accessibility
 * - Security
 * - Offline Patterns
 *
 * Usage: node mobile_audit.js <project_path> [options]
 * Options:
 *   --output <file>    Write JSON report to file
 *   --max-files <n>    Maximum files to scan (default: 200)
 *   --help             Show usage
 */

import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { resolve, extname } from 'path';

const VERSION = '2.0.0';

const SKIP_DIRS = new Set([
    'node_modules', '.expo', 'dist', 'build', '.git',
    '__pycache__', '.vscode', 'coverage', 'android/build',
    'ios/Pods', '.gradle', '.dart_tool', '.idea',
    'DerivedData', 'Pods', '.build'
]);

const SCAN_EXTENSIONS = new Set([
    '.js', '.jsx', '.ts', '.tsx',   // React Native
    '.dart',                         // Flutter
    '.swift',                        // iOS Native
    '.kt',                           // Android Native
]);

// --- Severity ---
const ERROR = 'error';      // Critical issue, will cause bugs/UX failures
const WARNING = 'warning';  // Should fix, degrades experience
const INFO = 'info';        // Suggestion for improvement

class MobileAuditor {
    constructor() {
        this.findings = [];
        this.filesScanned = 0;
        this.skippedDirs = [];
    }

    addFinding(severity, category, file, message) {
        this.findings.push({ severity, category, file, message });
    }

    auditFile(filePath) {
        try {
            const content = readFileSync(filePath, 'utf-8');
            const fileName = filePath.split(/[/\\]/).pop();
            const ext = extname(fileName).toLowerCase();

            // Universal checks (all frameworks)
            this.checkTouchTargets(content, fileName, ext);
            this.checkAccessibility(content, fileName, ext);
            this.checkSecurity(content, fileName, ext);
            this.checkOfflinePatterns(content, fileName, ext);
            this.checkCleanup(content, fileName, ext);

            // Framework-specific checks
            if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
                this.checkReactNativePerformance(content, fileName);
                this.checkReactNativeNavigation(content, fileName);
                this.checkReactNativeTypography(content, fileName);
                this.checkReactNativePlatform(content, fileName);
            } else if (ext === '.dart') {
                this.checkFlutterPerformance(content, fileName);
                this.checkFlutterPatterns(content, fileName);
            } else if (ext === '.swift') {
                this.checkSwiftPatterns(content, fileName);
            } else if (ext === '.kt') {
                this.checkKotlinPatterns(content, fileName);
            }

            this.filesScanned++;
        } catch (e) {
            this.addFinding(WARNING, 'System', filePath, `Could not read file: ${e.message}`);
        }
    }

    // ===== UNIVERSAL CHECKS =====

    checkTouchTargets(content, fileName, ext) {
        // React Native / CSS-in-JS touch targets
        if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
            const smallTargetPatterns = [
                /(?:width|height|minWidth|minHeight):\s*([1-3][0-9]|[0-9])(?!\d)/,
            ];
            for (const pattern of smallTargetPatterns) {
                const match = content.match(pattern);
                if (match && (content.includes('TouchableOpacity') ||
                    content.includes('Pressable') || content.includes('onPress'))) {
                    this.addFinding(ERROR, 'Touch', fileName,
                        `Touch target may be <44px (found ${match[0]}). Minimum: 44pt iOS / 48dp Android`);
                    break;
                }
            }

            if (content.includes('hitSlop')) {
                this.addFinding(INFO, 'Touch', fileName, 'hitSlop configured for better tap area ✓');
            }

            if (content.includes('ScrollView') && content.includes('onPress')) {
                this.addFinding(WARNING, 'Touch', fileName,
                    'onPress inside ScrollView may cause gesture conflicts — consider GestureHandler');
            }
        }

        // Flutter touch targets
        if (ext === '.dart') {
            if (/SizedBox\(\s*(?:width|height):\s*([1-3][0-9]|[0-9])(?!\d)/.test(content) &&
                (content.includes('onTap') || content.includes('onPressed'))) {
                this.addFinding(ERROR, 'Touch', fileName,
                    'Touch target may be <48dp. Use minimumSize or MaterialTapTargetSize');
            }

            if (content.includes('MaterialTapTargetSize.padded')) {
                this.addFinding(INFO, 'Touch', fileName,
                    'MaterialTapTargetSize.padded ensures minimum 48dp ✓');
            }
        }

        // Haptic feedback
        if (content.includes('Haptic') || content.includes('vibrate') ||
            content.includes('HapticFeedback') || content.includes('UIImpactFeedbackGenerator')) {
            this.addFinding(INFO, 'Touch', fileName, 'Haptic feedback implemented ✓');
        }
    }

    checkAccessibility(content, fileName, ext) {
        // React Native
        if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
            if (content.includes('accessible=') || content.includes('accessibilityLabel')) {
                this.addFinding(INFO, 'A11y', fileName, 'Accessibility labels present ✓');
            } else if (content.includes('TouchableOpacity') || content.includes('Pressable')) {
                this.addFinding(WARNING, 'A11y', fileName,
                    'Interactive elements without accessibilityLabel — screen readers cannot describe them');
            }

            if (content.includes('accessibilityRole') || content.includes('accessibilityHint')) {
                this.addFinding(INFO, 'A11y', fileName, 'Screen reader roles/hints configured ✓');
            }
        }

        // Flutter
        if (ext === '.dart') {
            if (content.includes('Semantics(') || content.includes('semanticsLabel')) {
                this.addFinding(INFO, 'A11y', fileName, 'Semantics widgets in use ✓');
            } else if (content.includes('GestureDetector') || content.includes('InkWell')) {
                this.addFinding(WARNING, 'A11y', fileName,
                    'Interactive widget without Semantics — TalkBack/VoiceOver cannot describe it');
            }

            if (content.includes('ExcludeSemantics') || content.includes('BlockSemantics')) {
                this.addFinding(WARNING, 'A11y', fileName,
                    'ExcludeSemantics/BlockSemantics found — verify decorative elements only are excluded');
            }
        }

        // Swift
        if (ext === '.swift') {
            if (content.includes('.accessibilityLabel') || content.includes('.accessibilityHint')) {
                this.addFinding(INFO, 'A11y', fileName, 'SwiftUI accessibility labels present ✓');
            }
            if (content.includes('.accessibilityHidden(true)')) {
                this.addFinding(INFO, 'A11y', fileName,
                    'accessibilityHidden used — verify only decorative elements are hidden');
            }
        }

        // Kotlin
        if (ext === '.kt') {
            if (content.includes('contentDescription') || content.includes('semantics {')) {
                this.addFinding(INFO, 'A11y', fileName, 'Compose semantics/contentDescription present ✓');
            }
        }
    }

    checkSecurity(content, fileName, ext) {
        // Token in insecure storage
        if (content.includes('AsyncStorage') && /token|jwt|auth|secret|password/i.test(content)) {
            this.addFinding(ERROR, 'Security', fileName,
                'Sensitive data in AsyncStorage — use SecureStore/Keychain/EncryptedSharedPreferences');
        }

        if (content.includes('SharedPreferences') && /token|jwt|auth|secret|password/i.test(content)) {
            this.addFinding(ERROR, 'Security', fileName,
                'Sensitive data in SharedPreferences — use EncryptedSharedPreferences');
        }

        // Hardcoded API keys
        if (/(?:api[_-]?key|secret|token)\s*[:=]\s*['"][A-Za-z0-9]{20,}['"]/i.test(content)) {
            this.addFinding(ERROR, 'Security', fileName,
                'Possible hardcoded API key/secret — use environment variables or secure storage');
        }

        // Console.log with sensitive data
        if (/console\.log.*(?:token|password|secret|key)/i.test(content)) {
            this.addFinding(ERROR, 'Security', fileName,
                'Logging potentially sensitive data — remove before production');
        }

        // SSL pinning
        if (content.includes('ssl') && content.includes('pin')) {
            this.addFinding(INFO, 'Security', fileName, 'SSL pinning configuration detected ✓');
        }
    }

    checkOfflinePatterns(content, fileName, ext) {
        // Network state awareness
        if (content.includes('NetInfo') || content.includes('connectivity') ||
            content.includes('ConnectivityManager') || content.includes('NWPathMonitor')) {
            this.addFinding(INFO, 'Offline', fileName, 'Network state monitoring present ✓');
        }

        // Offline queue
        if (content.includes('queue') && (content.includes('sync') || content.includes('offline'))) {
            this.addFinding(INFO, 'Offline', fileName, 'Offline sync queue detected ✓');
        }
    }

    checkCleanup(content, fileName, ext) {
        // React Native — useEffect without cleanup
        if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
            const effectCount = (content.match(/useEffect\s*\(/g) || []).length;
            const cleanupCount = (content.match(/return\s*\(\s*\)\s*=>/g) || []).length +
                (content.match(/return\s*(?:function|\(\))/g) || []).length;

            if (effectCount > 0 && cleanupCount === 0 &&
                (content.includes('setInterval') || content.includes('addEventListener') ||
                    content.includes('subscribe'))) {
                this.addFinding(ERROR, 'Memory', fileName,
                    'useEffect with timers/listeners but no cleanup — memory leak risk');
            }
        }

        // Flutter — missing dispose
        if (ext === '.dart') {
            const hasController = content.includes('Controller(') ||
                content.includes('StreamSubscription') || content.includes('Timer.');
            const hasDispose = content.includes('dispose()');

            if (hasController && !hasDispose && content.includes('State<')) {
                this.addFinding(ERROR, 'Memory', fileName,
                    'StatefulWidget with controllers but no dispose() — memory leak risk');
            }
        }

        // Swift — combine cancellables
        if (ext === '.swift') {
            if (content.includes('.sink') && !content.includes('cancellables') &&
                !content.includes('AnyCancellable')) {
                this.addFinding(WARNING, 'Memory', fileName,
                    'Combine sink without cancellable storage — subscription may leak');
            }
        }
    }

    // ===== REACT NATIVE CHECKS =====

    checkReactNativePerformance(content, fileName) {
        if (content.includes('ScrollView') && content.includes('.map(')) {
            this.addFinding(ERROR, 'Performance', fileName,
                'ScrollView with .map() for lists — use FlatList/FlashList for virtualization');
        }

        const inlineStyleCount = (content.match(/style=\{\{/g) || []).length;
        if (inlineStyleCount > 5) {
            this.addFinding(WARNING, 'Performance', fileName,
                `${inlineStyleCount} inline styles — use StyleSheet.create() to avoid re-creation`);
        }

        if (content.includes('<Image') || content.includes('Image source=')) {
            if (!content.includes('resizeMode')) {
                this.addFinding(WARNING, 'Performance', fileName,
                    'Image without resizeMode — may render at original size');
            }
            if (content.includes('FastImage') || content.includes('expo-image')) {
                this.addFinding(INFO, 'Performance', fileName, 'Optimized image library in use ✓');
            }
        }

        if (content.includes('useSharedValue') || content.includes('Reanimated')) {
            this.addFinding(INFO, 'Performance', fileName, 'Native animations (Reanimated) in use ✓');
        }

        if (content.includes('React.memo') || content.includes('useMemo') ||
            content.includes('useCallback')) {
            this.addFinding(INFO, 'Performance', fileName, 'Memoization in use ✓');
        }

        // Console.log in non-test files
        if (!fileName.includes('.test.') && !fileName.includes('.spec.') &&
            !fileName.includes('__test')) {
            const logCount = (content.match(/console\.log/g) || []).length;
            if (logCount > 3) {
                this.addFinding(WARNING, 'Performance', fileName,
                    `${logCount} console.log calls — remove for production (blocks JS thread)`);
            }
        }
    }

    checkReactNativeNavigation(content, fileName) {
        if (content.includes('BottomTab') || content.includes('createBottomTabNavigator')) {
            this.addFinding(INFO, 'Navigation', fileName, 'Bottom tabs implemented (thumb-friendly) ✓');
        }

        if (content.includes('SafeAreaView') || content.includes('useSafeAreaInsets')) {
            this.addFinding(INFO, 'Navigation', fileName, 'SafeArea handling present ✓');
        } else if (content.includes('View') && fileName.includes('Screen')) {
            this.addFinding(WARNING, 'Navigation', fileName,
                'Screen component may need SafeAreaView for notch/home-indicator');
        }

        if (content.includes('linking') || content.includes('deepLink') ||
            content.includes('useURL')) {
            this.addFinding(INFO, 'Navigation', fileName, 'Deep linking configured ✓');
        }
    }

    checkReactNativeTypography(content, fileName) {
        if (content.includes('allowFontScaling={false}')) {
            this.addFinding(ERROR, 'Typography', fileName,
                'allowFontScaling={false} disables Dynamic Type — accessibility violation');
        }

        const textBlocks = (content.match(/<Text[^>]*>[^<]{100,}</g) || []).length;
        if (textBlocks > 0 && !content.includes('numberOfLines')) {
            this.addFinding(WARNING, 'Typography', fileName,
                'Long text without numberOfLines may overflow on small screens');
        }
    }

    checkReactNativePlatform(content, fileName) {
        if (content.includes('Platform.OS') || content.includes('Platform.select')) {
            this.addFinding(INFO, 'Platform', fileName, 'Multi-platform handling present ✓');
        }
    }

    // ===== FLUTTER CHECKS =====

    checkFlutterPerformance(content, fileName) {
        // const constructor usage
        if (content.includes('Widget build') && !content.includes('const ')) {
            const widgetCount = (content.match(/(?:Container|Padding|SizedBox|Center)\(/g) || []).length;
            if (widgetCount > 3) {
                this.addFinding(WARNING, 'Performance', fileName,
                    `${widgetCount} basic widgets without const constructors — add const to prevent rebuilds`);
            }
        }

        // ListView.builder vs Column
        if (content.includes('Column(') && content.includes('.map(') &&
            content.includes('children:')) {
            this.addFinding(ERROR, 'Performance', fileName,
                'Column with .map() for lists — use ListView.builder for virtualization');
        }

        // setState scope
        const setStateCount = (content.match(/setState\s*\(/g) || []).length;
        if (setStateCount > 5) {
            this.addFinding(WARNING, 'Performance', fileName,
                `${setStateCount} setState calls — consider targeted state management (Riverpod/BLoC)`);
        }

        // Image.network without caching
        if (content.includes('Image.network') && !content.includes('CachedNetworkImage')) {
            this.addFinding(WARNING, 'Performance', fileName,
                'Image.network without CachedNetworkImage — images re-download on rebuild');
        }
    }

    checkFlutterPatterns(content, fileName) {
        // SafeArea
        if (content.includes('SafeArea')) {
            this.addFinding(INFO, 'Navigation', fileName, 'SafeArea widget in use ✓');
        }

        // GoRouter / deep linking
        if (content.includes('GoRouter') || content.includes('go(') ||
            content.includes('pushNamed')) {
            this.addFinding(INFO, 'Navigation', fileName, 'Navigation routing configured ✓');
        }

        // Platform checks
        if (content.includes('Platform.isIOS') || content.includes('Platform.isAndroid') ||
            content.includes('defaultTargetPlatform')) {
            this.addFinding(INFO, 'Platform', fileName, 'Platform-specific handling present ✓');
        }

        // Font scaling
        if (content.includes('textScaleFactor') || content.includes('MediaQuery.textScaleFactorOf')) {
            this.addFinding(INFO, 'Typography', fileName, 'Text scale factor awareness ✓');
        }
    }

    // ===== NATIVE iOS CHECKS =====

    checkSwiftPatterns(content, fileName) {
        // Safe area handling
        if (content.includes('.safeAreaInset') || content.includes('safeAreaLayoutGuide') ||
            content.includes('.ignoresSafeArea')) {
            this.addFinding(INFO, 'Navigation', fileName, 'Safe area handling present ✓');
        }

        // Dynamic Type
        if (content.includes('.font(.') && !content.includes('.system(size:')) {
            this.addFinding(INFO, 'Typography', fileName, 'Dynamic Type text styles in use ✓');
        } else if (content.includes('.system(size:') && !content.includes('relativeTo:')) {
            this.addFinding(WARNING, 'Typography', fileName,
                'Fixed font size without relativeTo: — breaks Dynamic Type scaling');
        }

        // Deep linking
        if (content.includes('onOpenURL') || content.includes('universalLinks') ||
            content.includes('NSUserActivity')) {
            this.addFinding(INFO, 'Navigation', fileName, 'Deep link handling configured ✓');
        }

        // Keychain usage
        if (content.includes('Keychain') || content.includes('SecItemAdd')) {
            this.addFinding(INFO, 'Security', fileName, 'Keychain secure storage in use ✓');
        }
    }

    // ===== NATIVE ANDROID CHECKS =====

    checkKotlinPatterns(content, fileName) {
        // Compose safe area (WindowInsets)
        if (content.includes('WindowInsets') || content.includes('systemBarsPadding') ||
            content.includes('windowInsetsPadding')) {
            this.addFinding(INFO, 'Navigation', fileName, 'Window insets handling present ✓');
        }

        // Material 3
        if (content.includes('MaterialTheme') || content.includes('dynamicColorScheme')) {
            this.addFinding(INFO, 'Platform', fileName, 'Material 3 theming in use ✓');
        }

        // sp for text
        if (content.includes('.dp') && content.includes('Text(') && !content.includes('.sp')) {
            this.addFinding(WARNING, 'Typography', fileName,
                'Text may use dp instead of sp — sp scales with user font preferences');
        }

        // Deep linking
        if (content.includes('navDeepLink') || content.includes('intent-filter') ||
            content.includes('NavHost')) {
            this.addFinding(INFO, 'Navigation', fileName, 'Deep link / navigation configured ✓');
        }

        // EncryptedSharedPreferences
        if (content.includes('EncryptedSharedPreferences') || content.includes('BiometricPrompt')) {
            this.addFinding(INFO, 'Security', fileName, 'Secure storage in use ✓');
        }

        // Lifecycle awareness
        if (content.includes('DisposableEffect') || content.includes('LaunchedEffect')) {
            this.addFinding(INFO, 'Memory', fileName, 'Compose lifecycle effects in use ✓');
        }
    }

    // ===== REPORT =====

    getReport() {
        const errors = this.findings.filter(f => f.severity === ERROR);
        const warnings = this.findings.filter(f => f.severity === WARNING);
        const infos = this.findings.filter(f => f.severity === INFO);
        const issues = [...errors, ...warnings];
        const passed = infos;

        // Weighted score: errors=10, warnings=3, info(passed) gives +1
        const penalty = (errors.length * 10) + (warnings.length * 3);
        const bonus = Math.min(infos.length, 20); // cap bonus
        const rawScore = 100 - penalty + bonus;
        const score = Math.max(0, Math.min(100, rawScore));

        return {
            version: VERSION,
            files_scanned: this.filesScanned,
            skipped_dirs: this.skippedDirs.length,
            findings: {
                errors: errors.length,
                warnings: warnings.length,
                passed: infos.length,
                total: this.findings.length,
            },
            score,
            passed: score >= 70,
            details: {
                errors: errors.map(f => ({ file: f.file, category: f.category, message: f.message })),
                warnings: warnings.map(f => ({ file: f.file, category: f.category, message: f.message })),
                passed: passed.map(f => ({ file: f.file, category: f.category, message: f.message })),
            }
        };
    }
}

// ===== FILE WALKER =====

function walkFiles(dir, callback, maxFiles, state = { count: 0, skipped: [] }) {
    try {
        const entries = readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            if (state.count >= maxFiles) return state;
            if (SKIP_DIRS.has(entry.name)) {
                state.skipped.push(resolve(dir, entry.name));
                continue;
            }
            const fullPath = resolve(dir, entry.name);
            if (entry.isDirectory()) {
                walkFiles(fullPath, callback, maxFiles, state);
            } else {
                const ext = extname(entry.name).toLowerCase();
                if (SCAN_EXTENSIONS.has(ext)) {
                    callback(fullPath);
                    state.count++;
                }
            }
        }
    } catch (e) {
        state.skipped.push(`${dir} (${e.code || e.message})`);
    }
    return state;
}

// ===== CLI =====

function parseArgs(argv) {
    const args = {
        projectPath: '.',
        outputFile: null,
        maxFiles: 200,
        help: false,
    };

    for (let i = 2; i < argv.length; i++) {
        switch (argv[i]) {
            case '--help': case '-h':
                args.help = true;
                break;
            case '--output': case '-o':
                args.outputFile = argv[++i];
                break;
            case '--max-files':
                args.maxFiles = parseInt(argv[++i], 10) || 200;
                break;
            default:
                if (!argv[i].startsWith('-')) {
                    args.projectPath = argv[i];
                }
        }
    }
    return args;
}

function showHelp() {
    console.log(`
Mobile UX Audit v${VERSION}

Usage: node mobile_audit.js <project_path> [options]

Arguments:
  project_path        Path to mobile project (default: current directory)

Options:
  --output, -o <file>   Write JSON report to file
  --max-files <n>       Maximum files to scan (default: 200)
  --help, -h            Show this help

Supported files:
  .js .jsx .ts .tsx     React Native
  .dart                 Flutter
  .swift                iOS Native (SwiftUI)
  .kt                   Android Native (Kotlin/Compose)

Categories audited:
  Touch, Performance, Navigation, Typography,
  Platform, Accessibility, Security, Offline, Memory

Exit codes:
  0   Score >= 70 (pass)
  1   Score < 70 (fail)
`);
}

function main() {
    const args = parseArgs(process.argv);

    if (args.help) {
        showHelp();
        process.exit(0);
    }

    const projectPath = resolve(args.projectPath);

    console.log('\n' + '='.repeat(60));
    console.log(`  MOBILE UX AUDIT v${VERSION}`);
    console.log('='.repeat(60));
    console.log(`Project:    ${projectPath}`);
    console.log(`Max files:  ${args.maxFiles}`);
    console.log(`Time:       ${new Date().toISOString()}`);
    console.log('-'.repeat(60));

    const auditor = new MobileAuditor();
    const walkState = walkFiles(projectPath, (fp) => auditor.auditFile(fp), args.maxFiles);
    auditor.skippedDirs = walkState.skipped;

    if (walkState.count >= args.maxFiles) {
        console.log(`\n⚠️  File limit reached (${args.maxFiles}). Use --max-files to increase.`);
    }

    const report = auditor.getReport();

    // Print results
    console.log(`\nScanned ${report.files_scanned} files`);
    console.log('='.repeat(60));

    if (report.findings.errors > 0) {
        console.log('\n❌ ERRORS:');
        for (const item of report.details.errors.slice(0, 20)) {
            console.log(`  [ERR]  ${item.file}: [${item.category}] ${item.message}`);
        }
        if (report.details.errors.length > 20) {
            console.log(`  ... and ${report.details.errors.length - 20} more errors`);
        }
    }

    if (report.findings.warnings > 0) {
        console.log('\n⚠️  WARNINGS:');
        for (const item of report.details.warnings.slice(0, 15)) {
            console.log(`  [WARN] ${item.file}: [${item.category}] ${item.message}`);
        }
        if (report.details.warnings.length > 15) {
            console.log(`  ... and ${report.details.warnings.length - 15} more warnings`);
        }
    }

    if (report.findings.passed > 0) {
        console.log('\n✅ PASSED:');
        for (const item of report.details.passed.slice(0, 10)) {
            console.log(`  [OK]   ${item.file}: [${item.category}] ${item.message}`);
        }
        if (report.details.passed.length > 10) {
            console.log(`  ... and ${report.details.passed.length - 10} more passed`);
        }
    }

    console.log('\n' + '-'.repeat(60));
    console.log(`SCORE: ${report.score}/100  ${report.passed ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  Errors: ${report.findings.errors}  Warnings: ${report.findings.warnings}  Passed: ${report.findings.passed}`);
    console.log('='.repeat(60));

    // JSON output
    const jsonOutput = {
        script: 'mobile_audit',
        version: VERSION,
        project: projectPath,
        timestamp: new Date().toISOString(),
        ...report
    };

    if (args.outputFile) {
        try {
            writeFileSync(args.outputFile, JSON.stringify(jsonOutput, null, 2));
            console.log(`\nReport written to: ${args.outputFile}`);
        } catch (e) {
            console.error(`\nFailed to write report: ${e.message}`);
        }
    }

    console.log('\n' + JSON.stringify({
        script: 'mobile_audit',
        version: VERSION,
        files_scanned: report.files_scanned,
        errors: report.findings.errors,
        warnings: report.findings.warnings,
        passed_checks: report.findings.passed,
        score: report.score,
        result: report.passed ? 'PASS' : 'FAIL'
    }, null, 2));

    process.exit(report.passed ? 0 : 1);
}

main();
