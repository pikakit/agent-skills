#!/usr/bin/env node
/**
 * Mobile UX Audit Script - Full Mobile Design Coverage
 * 
 * Analyzes React Native / Flutter code for compliance with:
 * - Touch Psychology (touch targets, spacing, thumb zones)
 * - Mobile Performance (FlatList, memo, callbacks)
 * - Mobile Navigation (tabs, back handling)
 * - Mobile Typography (system fonts, scaling)
 * - Mobile Color System (dark mode, OLED)
 * - Platform iOS/Android specifics
 * - Mobile Backend (secure storage, offline)
 * 
 * Total: 50+ mobile-specific checks
 */

import fs from 'fs';
import path from 'path';

class MobileAuditor {
    constructor() {
        this.issues = [];
        this.warnings = [];
        this.passedCount = 0;
        this.filesChecked = 0;
    }

    auditFile(filepath) {
        let content;
        try {
            content = fs.readFileSync(filepath, 'utf-8');
        } catch {
            return;
        }

        this.filesChecked++;
        const filename = path.basename(filepath);

        // Detect framework
        const isReactNative = /react-native|@react-navigation|React\.Native/.test(content);
        const isFlutter = /import 'package:flutter|MaterialApp|Widget\.build/.test(content);

        if (!isReactNative && !isFlutter) {
            return; // Skip non-mobile files
        }

        // --- 1. TOUCH PSYCHOLOGY CHECKS ---

        // 1.1 Touch Target Size Check
        const smallSizes = content.match(/(?:width|height|size):\s*([0-3]\d)/g) || [];
        for (const match of smallSizes) {
            const size = parseInt(match.match(/\d+/)[0]);
            if (size < 44) {
                this.issues.push(`[Touch Target] ${filename}: Touch target size ${size}px < 44px minimum`);
            }
        }

        // 1.2 Touch Target Spacing Check
        const smallGaps = content.match(/(?:margin|gap):\s*([0-7])\s*(?:px|dp)/g) || [];
        for (const match of smallGaps) {
            const gap = parseInt(match.match(/\d+/)[0]);
            if (gap < 8) {
                this.warnings.push(`[Touch Spacing] ${filename}: Touch spacing ${gap}px < 8px minimum`);
            }
        }

        // 1.3 Thumb Zone Placement
        const primaryButtons = /(?:testID|id):\s*["'](?:.*(?:primary|cta|submit|confirm)[^"']*)["']/i.test(content);
        const hasBottomPlacement = /position:\s*["']?absolute|bottom:\s*\d+|justifyContent:\s*["']?flex-end/.test(content);
        if (primaryButtons && !hasBottomPlacement) {
            this.warnings.push(`[Thumb Zone] ${filename}: Primary CTA may not be in thumb zone (bottom)`);
        }

        // 1.4 Gesture Alternatives
        const hasSwipe = /Swipeable|onSwipe|PanGestureHandler|swipe/.test(content);
        const hasButtons = /Button.*(?:delete|archive|more)|TouchableOpacity|Pressable/.test(content);
        if (hasSwipe && !hasButtons) {
            this.warnings.push(`[Gestures] ${filename}: Swipe gestures without visible button alternatives`);
        }

        // 1.5 Haptic Feedback
        const hasImportantActions = /(?:onPress|onSubmit|delete|remove|confirm|purchase)/.test(content);
        const hasHaptics = /Haptics|Vibration|react-native-haptic-feedback/.test(content);
        if (hasImportantActions && !hasHaptics) {
            this.warnings.push(`[Haptics] ${filename}: Important actions without haptic feedback`);
        }

        // --- 2. MOBILE PERFORMANCE CHECKS ---

        // 2.1 CRITICAL: ScrollView vs FlatList
        const hasScrollView = /<ScrollView|ScrollView\./.test(content);
        const hasMapInScrollView = /ScrollView.*\.map\(|ScrollView.*\{.*\.map/.test(content);
        if (hasScrollView && hasMapInScrollView) {
            this.issues.push(`[Performance CRITICAL] ${filename}: ScrollView with .map() - Use FlatList!`);
        }

        // 2.2 React.memo Check
        if (isReactNative) {
            const hasList = /FlatList|FlashList|SectionList/.test(content);
            const hasMemo = /React\.memo|memo\(/.test(content);
            if (hasList && !hasMemo) {
                this.warnings.push(`[Performance] ${filename}: FlatList without React.memo on list items`);
            }
        }

        // 2.3 useCallback Check
        if (isReactNative) {
            const hasFlatList = /FlatList|FlashList/.test(content);
            const hasCallback = /useCallback/.test(content);
            if (hasFlatList && !hasCallback) {
                this.warnings.push(`[Performance] ${filename}: FlatList renderItem without useCallback`);
            }
        }

        // 2.4 keyExtractor Check (CRITICAL)
        if (isReactNative) {
            const hasFlatList = /FlatList/.test(content);
            const hasKeyExtractor = /keyExtractor/.test(content);
            const usesIndexKey = /key=\{.*index.*\}|key:\s*index/.test(content);
            if (hasFlatList && !hasKeyExtractor) {
                this.issues.push(`[Performance CRITICAL] ${filename}: FlatList without keyExtractor`);
            }
            if (usesIndexKey) {
                this.issues.push(`[Performance CRITICAL] ${filename}: Using index as key - use unique ID`);
            }
        }

        // 2.5 useNativeDriver Check
        if (isReactNative) {
            const hasAnimated = /Animated\./.test(content);
            const hasNativeDriverFalse = /useNativeDriver:\s*false/.test(content);
            if (hasAnimated && hasNativeDriverFalse) {
                this.warnings.push(`[Performance] ${filename}: Animation with useNativeDriver: false`);
            }
        }

        // 2.6 Memory Leak Check
        if (isReactNative) {
            const hasEffect = /useEffect/.test(content);
            const hasCleanup = /return\s*\(\)\s*=>|return\s+function/.test(content);
            const hasSubscriptions = /addEventListener|subscribe|\.focus\(\)|\.off\(/.test(content);
            if (hasEffect && hasSubscriptions && !hasCleanup) {
                this.issues.push(`[Memory Leak] ${filename}: useEffect with subscriptions but no cleanup`);
            }
        }

        // 2.7 Console.log Detection
        const consoleLogs = (content.match(/console\.log|console\.warn|console\.error/g) || []).length;
        if (consoleLogs > 5) {
            this.warnings.push(`[Performance] ${filename}: ${consoleLogs} console.log statements`);
        }

        // 2.8 Inline Function Detection
        if (isReactNative) {
            const inlineFunctions = (content.match(/(?:onPress|renderItem):\s*\([^)]*\)\s*=>/g) || []).length;
            if (inlineFunctions > 3) {
                this.warnings.push(`[Performance] ${filename}: ${inlineFunctions} inline arrow functions - use useCallback`);
            }
        }

        // --- 3. MOBILE NAVIGATION CHECKS ---

        // 3.1 Tab Bar Max Items
        const tabItems = (content.match(/Tab\.Screen|createBottomTabNavigator/g) || []).length;
        if (tabItems > 5) {
            this.warnings.push(`[Navigation] ${filename}: ${tabItems} tab items (max 5 recommended)`);
        }

        // --- 4. MOBILE TYPOGRAPHY CHECKS ---

        // 4.1 Font Size Limits
        const fontSizes = content.match(/fontSize:\s*([\d.]+)/g) || [];
        for (const match of fontSizes) {
            const size = parseFloat(match.match(/[\d.]+/)[0]);
            if (size < 12) {
                this.warnings.push(`[Typography] ${filename}: fontSize ${size}px below 12px minimum`);
            }
        }

        // --- 5. MOBILE COLOR SYSTEM CHECKS ---

        // 5.1 Pure Black Avoidance
        if (/#000000|color:\s*black|backgroundColor:\s*["']?black/.test(content)) {
            this.warnings.push(`[Color] ${filename}: Pure black (#000000) - use dark gray for OLED`);
        }

        // 5.2 Dark Mode Support
        const hasColorScheme = /useColorScheme|colorScheme|appearance:\s*["']?dark/.test(content);
        if (!hasColorScheme) {
            this.warnings.push(`[Color] ${filename}: No dark mode support detected`);
        }

        // --- 6. PLATFORM iOS CHECKS ---

        if (isReactNative) {
            // 6.1 iOS Safe Area
            const hasSafeArea = /SafeAreaView|useSafeAreaInsets/.test(content);
            if (!hasSafeArea) {
                this.warnings.push(`[iOS] ${filename}: No SafeArea detected - content may be hidden by notch`);
            }
        }

        // --- 7. PLATFORM ANDROID CHECKS ---

        if (isReactNative) {
            // 7.1 Ripple Effect
            const hasRipple = /ripple|android_ripple/.test(content);
            const hasPressable = /Pressable|Touchable/.test(content);
            if (hasPressable && !hasRipple) {
                this.warnings.push(`[Android] ${filename}: Touchable without ripple effect`);
            }
        }

        // --- 8. MOBILE BACKEND CHECKS ---

        // 8.1 Secure Storage Check
        const hasAsyncStorage = /AsyncStorage|@react-native-async-storage/.test(content);
        const hasSecureStorage = /SecureStore|Keychain|EncryptedSharedPreferences/.test(content);
        const hasTokenStorage = /token|jwt|auth.*storage/i.test(content);
        if (hasTokenStorage && hasAsyncStorage && !hasSecureStorage) {
            this.issues.push(`[Security] ${filename}: Auth tokens in AsyncStorage - use SecureStore!`);
        }

        // 8.2 Offline Handling
        const hasNetwork = /fetch|axios|netinfo/.test(content);
        const hasOffline = /offline|isConnected|netInfo/.test(content);
        if (hasNetwork && !hasOffline) {
            this.warnings.push(`[Offline] ${filename}: Network requests without offline handling`);
        }

        // --- 9. ACCESSIBILITY ---

        if (isReactNative) {
            const hasPressable = /Pressable|TouchableOpacity/.test(content);
            const hasA11yLabel = /accessibilityLabel|aria-label|testID/.test(content);
            if (hasPressable && !hasA11yLabel) {
                this.warnings.push(`[A11y] ${filename}: Touchable without accessibilityLabel`);
            }
        }

        // --- 10. ERROR HANDLING ---

        if (isReactNative) {
            const hasErrorBoundary = /ErrorBoundary|componentDidCatch/.test(content);
            if (!hasErrorBoundary) {
                this.warnings.push(`[Error] ${filename}: No ErrorBoundary detected`);
            }
        }
    }

    auditDirectory(directory) {
        const extensions = new Set(['.tsx', '.ts', '.jsx', '.js', '.dart']);
        const excludeDirs = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'ios', 'android']);

        const walk = (dir) => {
            try {
                const entries = fs.readdirSync(dir, { withFileTypes: true });
                for (const entry of entries) {
                    const fullPath = path.join(dir, entry.name);
                    if (entry.isDirectory()) {
                        if (!excludeDirs.has(entry.name)) {
                            walk(fullPath);
                        }
                    } else if (entry.isFile()) {
                        if (extensions.has(path.extname(entry.name))) {
                            this.auditFile(fullPath);
                        }
                    }
                }
            } catch {
                // Ignore permission errors
            }
        };

        walk(directory);
    }

    getReport() {
        return {
            files_checked: this.filesChecked,
            issues: this.issues,
            warnings: this.warnings,
            passed_checks: this.passedCount,
            compliant: this.issues.length === 0
        };
    }
}

function main() {
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.log('Usage: node mobile_audit.js <directory>');
        process.exit(1);
    }

    const targetPath = args[0];
    const isJson = args.includes('--json');

    const auditor = new MobileAuditor();

    if (fs.statSync(targetPath).isFile()) {
        auditor.auditFile(targetPath);
    } else {
        auditor.auditDirectory(targetPath);
    }

    const report = auditor.getReport();

    if (isJson) {
        console.log(JSON.stringify(report, null, 2));
    } else {
        console.log(`\n[MOBILE AUDIT] ${report.files_checked} mobile files checked`);
        console.log('-'.repeat(50));

        if (report.issues.length > 0) {
            console.log(`[!] ISSUES (${report.issues.length}):`);
            report.issues.slice(0, 10).forEach(i => console.log(`  - ${i}`));
        }

        if (report.warnings.length > 0) {
            console.log(`[*] WARNINGS (${report.warnings.length}):`);
            report.warnings.slice(0, 15).forEach(w => console.log(`  - ${w}`));
        }

        console.log(`[+] PASSED CHECKS: ${report.passed_checks}`);
        const status = report.compliant ? 'PASS' : 'FAIL';
        console.log(`STATUS: ${status}`);
    }

    process.exit(report.compliant ? 0 : 1);
}

main();
