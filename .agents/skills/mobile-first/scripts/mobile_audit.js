#!/usr/bin/env node
/**
 * Mobile UX Audit - Touch Psychology & Mobile Best Practices
 * 
 * Categories:
 * - Touch Psychology (44px minimum targets)
 * - Performance
 * - Navigation
 * - Typography
 * - Platform-specific (iOS/Android)
 */

import { readFileSync, readdirSync } from 'fs';
import { resolve, extname } from 'path';

const SKIP_DIRS = new Set([
    'node_modules', '.expo', 'dist', 'build', '.git',
    '__pycache__', '.vscode', 'coverage', 'android/build', 'ios/Pods'
]);

class MobileAuditor {
    constructor() {
        this.issues = [];
        this.passed = [];
    }

    auditFile(filePath) {
        try {
            const content = readFileSync(filePath, 'utf-8');
            const fileName = filePath.split(/[/\\]/).pop();

            this.checkTouchPsychology(content, fileName);
            this.checkPerformance(content, fileName);
            this.checkNavigation(content, fileName);
            this.checkTypography(content, fileName);
            this.checkPlatformSpecific(content, fileName);
            this.checkAccessibility(content, fileName);

        } catch (e) {
            this.issues.push({ file: filePath, issue: `Error: ${e.message}` });
        }
    }

    checkTouchPsychology(content, fileName) {
        // Minimum touch target 44x44dp (iOS) / 48x48dp (Android)
        const smallTargetPatterns = [
            /width:\s*([1-3][0-9]|[0-9])px/,
            /height:\s*([1-3][0-9]|[0-9])px/,
            /size:\s*([1-3][0-9]|[0-9])/,
            /TouchableOpacity[^>]*style[^}]*height:\s*([1-3][0-9]|[0-9])/
        ];

        for (const pattern of smallTargetPatterns) {
            if (pattern.test(content)) {
                this.issues.push({
                    file: fileName,
                    issue: 'Touch: Target may be <44px (minimum for comfortable touch)'
                });
                break;
            }
        }

        // Check for proper hitSlop in React Native
        if (content.includes('TouchableOpacity') || content.includes('Pressable')) {
            if (content.includes('hitSlop')) {
                this.passed.push({ file: fileName, check: 'Touch: hitSlop configured for better tap area' });
            }
        }

        // Touch feedback
        const hasHaptic = content.includes('Haptic') || content.includes('vibrate');
        if (hasHaptic) {
            this.passed.push({ file: fileName, check: 'Touch: Haptic feedback implemented' });
        }

        // Gesture conflicts
        if (content.includes('ScrollView') && content.includes('onPress')) {
            this.issues.push({
                file: fileName,
                issue: 'Touch: onPress inside ScrollView may cause gesture conflicts'
            });
        }
    }

    checkPerformance(content, fileName) {
        // FlatList vs ScrollView
        if (content.includes('ScrollView') && content.includes('.map(')) {
            this.issues.push({
                file: fileName,
                issue: 'Performance: Use FlatList instead of ScrollView with map() for long lists'
            });
        }

        // Inline styles
        const inlineStyleCount = (content.match(/style=\{\{/g) || []).length;
        if (inlineStyleCount > 5) {
            this.issues.push({
                file: fileName,
                issue: `Performance: ${inlineStyleCount} inline styles - use StyleSheet.create()`
            });
        }

        // Image optimization
        if (content.includes('<Image') || content.includes('Image source=')) {
            if (!content.includes('resizeMode')) {
                this.issues.push({ file: fileName, issue: 'Performance: Image without resizeMode' });
            }
            if (content.includes('FastImage') || content.includes('expo-image')) {
                this.passed.push({ file: fileName, check: 'Performance: Optimized image library in use' });
            }
        }

        // Heavy animations
        if (content.includes('useSharedValue') || content.includes('Reanimated')) {
            this.passed.push({ file: fileName, check: 'Performance: Using native animations (Reanimated)' });
        }

        // Memoization
        if (content.includes('React.memo') || content.includes('useMemo') || content.includes('useCallback')) {
            this.passed.push({ file: fileName, check: 'Performance: Memoization in use' });
        }
    }

    checkNavigation(content, fileName) {
        // Bottom tabs
        if (content.includes('BottomTab') || content.includes('createBottomTabNavigator')) {
            this.passed.push({ file: fileName, check: 'Navigation: Bottom tabs implemented (thumb-friendly)' });
        }

        // Safe Area
        if (content.includes('SafeAreaView') || content.includes('useSafeAreaInsets')) {
            this.passed.push({ file: fileName, check: 'Navigation: SafeArea handling present' });
        } else if (content.includes('View') && fileName.includes('Screen')) {
            this.issues.push({
                file: fileName,
                issue: 'Navigation: Screen may need SafeAreaView'
            });
        }

        // Gesture navigation
        if (content.includes('GestureHandler') || content.includes('swipe')) {
            this.passed.push({ file: fileName, check: 'Navigation: Gesture navigation supported' });
        }

        // Deep linking
        if (content.includes('linking') || content.includes('deepLink')) {
            this.passed.push({ file: fileName, check: 'Navigation: Deep linking configured' });
        }
    }

    checkTypography(content, fileName) {
        // Font scaling
        if (content.includes('allowFontScaling={false}')) {
            this.issues.push({
                file: fileName,
                issue: 'Typography: Disabled font scaling harms accessibility'
            });
        }

        // Text truncation
        if (content.includes('<Text') && !content.includes('numberOfLines')) {
            // Check if there are long text components
            const textBlocks = (content.match(/<Text[^>]*>[^<]{100,}</g) || []).length;
            if (textBlocks > 0) {
                this.issues.push({
                    file: fileName,
                    issue: 'Typography: Long text without numberOfLines may overflow'
                });
            }
        }

        // Custom fonts
        if (content.includes('fontFamily:')) {
            this.passed.push({ file: fileName, check: 'Typography: Custom font family in use' });
        }
    }

    checkPlatformSpecific(content, fileName) {
        // Platform checks
        if (content.includes('Platform.OS') || content.includes('Platform.select')) {
            this.passed.push({ file: fileName, check: 'Platform: Multi-platform handling present' });
        }

        // iOS specific
        if (content.includes('ios:') || content.includes("Platform.OS === 'ios'")) {
            if (content.includes('safeArea') || content.includes('StatusBar')) {
                this.passed.push({ file: fileName, check: 'iOS: Safe area + status bar handled' });
            }
        }

        // Android specific
        if (content.includes('android:') || content.includes("Platform.OS === 'android'")) {
            if (content.includes('elevation') || content.includes('shadow')) {
                this.passed.push({ file: fileName, check: 'Android: Elevation/shadow styling present' });
            }
        }
    }

    checkAccessibility(content, fileName) {
        // Accessibility labels
        if (content.includes('accessible=') || content.includes('accessibilityLabel')) {
            this.passed.push({ file: fileName, check: 'A11y: Accessibility labels present' });
        } else if (content.includes('TouchableOpacity') || content.includes('Pressable')) {
            this.issues.push({
                file: fileName,
                issue: 'A11y: Interactive elements may need accessibilityLabel'
            });
        }

        // Screen reader support
        if (content.includes('accessibilityRole') || content.includes('accessibilityHint')) {
            this.passed.push({ file: fileName, check: 'A11y: Screen reader roles/hints configured' });
        }
    }

    getReport() {
        return {
            issues: this.issues,
            passed: this.passed,
            score: this.issues.length === 0 ? 100 :
                Math.max(0, 100 - (this.issues.length * 5))
        };
    }
}

function walkFiles(dir, callback) {
    try {
        const entries = readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            if (SKIP_DIRS.has(entry.name)) continue;
            const fullPath = resolve(dir, entry.name);
            if (entry.isDirectory()) {
                walkFiles(fullPath, callback);
            } else {
                const ext = extname(entry.name).toLowerCase();
                if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
                    callback(fullPath);
                }
            }
        }
    } catch { /* ignore */ }
}

function main() {
    const projectPath = resolve(process.argv[2] || '.');

    console.log('\n' + '='.repeat(60));
    console.log('  MOBILE UX AUDIT - Touch Psychology & Best Practices');
    console.log('='.repeat(60));
    console.log(`Project: ${projectPath}`);
    console.log(`Time: ${new Date().toISOString()}`);
    console.log('-'.repeat(60));

    const auditor = new MobileAuditor();
    let fileCount = 0;

    walkFiles(projectPath, (filePath) => {
        if (fileCount < 50) {
            auditor.auditFile(filePath);
            fileCount++;
        }
    });

    const report = auditor.getReport();

    console.log(`\nAnalyzed ${fileCount} files`);
    console.log('\n' + '='.repeat(60));
    console.log('MOBILE AUDIT RESULTS');
    console.log('='.repeat(60));

    if (report.issues.length > 0) {
        console.log('\nISSUES FOUND:');
        for (const item of report.issues.slice(0, 15)) {
            console.log(`  [!] ${item.file}: ${item.issue}`);
        }
        if (report.issues.length > 15) {
            console.log(`  ... and ${report.issues.length - 15} more issues`);
        }
    }

    if (report.passed.length > 0) {
        console.log('\nPASSED CHECKS:');
        for (const item of report.passed.slice(0, 10)) {
            console.log(`  [OK] ${item.file}: ${item.check}`);
        }
        if (report.passed.length > 10) {
            console.log(`  ... and ${report.passed.length - 10} more passed`);
        }
    }

    console.log(`\nMOBILE UX SCORE: ${report.score}/100`);

    const output = {
        script: 'mobile_audit',
        project: projectPath,
        files_analyzed: fileCount,
        issues_found: report.issues.length,
        passed_checks: report.passed.length,
        score: report.score,
        passed: report.score >= 70
    };

    console.log('\n' + JSON.stringify(output, null, 2));
    process.exit(report.score >= 70 ? 0 : 1);
}

main();
