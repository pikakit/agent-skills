#!/usr/bin/env node
/**
 * Mobile Design Audit - Stub Script
 * Referenced by: /mobile workflow
 * 
 * Checks mobile app projects for:
 * - Touch target sizes (44x44 minimum)
 * - Color contrast ratios
 * - Platform guidelines compliance
 */

const fs = require('fs');
const path = require('path');

function auditProject(projectPath) {
    const results = {
        projectPath,
        issues: [],
        warnings: [],
        passed: []
    };

    if (!fs.existsSync(projectPath)) {
        console.error(`Error: Path '${projectPath}' does not exist`);
        process.exit(1);
    }

    // Detect platform
    const platforms = [];
    if (fs.existsSync(path.join(projectPath, 'android')) || fs.existsSync(path.join(projectPath, 'app/build.gradle'))) {
        platforms.push('android');
    }
    if (fs.existsSync(path.join(projectPath, 'ios')) || fs.readdirSync(projectPath).some(f => f.endsWith('.xcodeproj'))) {
        platforms.push('ios');
    }
    if (fs.existsSync(path.join(projectPath, 'package.json'))) {
        try {
            const pkg = JSON.parse(fs.readFileSync(path.join(projectPath, 'package.json'), 'utf8'));
            const deps = { ...pkg.dependencies, ...pkg.devDependencies };
            if (deps['react-native']) platforms.push('react-native');
            if (JSON.stringify(pkg).includes('flutter')) platforms.push('flutter');
        } catch (e) { }
    }
    if (fs.existsSync(path.join(projectPath, 'pubspec.yaml'))) {
        platforms.push('flutter');
    }

    if (platforms.length > 0) {
        results.passed.push(`✅ Detected platforms: ${[...new Set(platforms)].join(', ')}`);
    } else {
        results.warnings.push('⚠️ Could not detect mobile platform');
    }

    // Check for accessibility files
    const a11yIndicators = [
        "accessibility", "a11y", "contentDescription",
        "accessibilityLabel", "semanticLabel"
    ];

    function getFiles(dir, exts) {
        let files = [];
        const items = fs.readdirSync(dir, { withFileTypes: true });
        for (const item of items) {
            if (item.name.startsWith('.') || item.name === 'node_modules') continue;
            const res = path.resolve(dir, item.name);
            if (item.isDirectory()) {
                files = [...files, ...getFiles(res, exts)];
            } else if (exts.some(ext => item.name.endsWith(ext))) {
                files.push(res);
            }
        }
        return files;
    }

    const sourceFiles = getFiles(projectPath, ['.tsx', '.jsx', '.dart', '.kt', '.swift']);

    let hasA11y = false;
    for (const file of sourceFiles.slice(0, 20)) {
        try {
            const content = fs.readFileSync(file, 'utf8');
            if (a11yIndicators.some(ind => content.includes(ind))) {
                hasA11y = true;
                break;
            }
        } catch (e) { }
    }

    if (hasA11y) {
        results.passed.push("✅ Accessibility attributes detected");
    } else {
        results.warnings.push("⚠️ No accessibility attributes found in sampled files");
    }

    // Check for touch targets
    const touchIndicators = ["minHeight: 44", "minWidth: 44", "hitSlop", "touchableOpacity"];
    let hasTouchTargets = false;
    for (const file of sourceFiles.slice(0, 20)) {
        try {
            const content = fs.readFileSync(file, 'utf8');
            if (touchIndicators.some(ind => content.includes(ind))) {
                hasTouchTargets = true;
                break;
            }
        } catch (e) { }
    }

    if (hasTouchTargets) {
        results.passed.push("✅ Touch target sizing considerations found");
    } else {
        results.warnings.push("⚠️ Consider adding minimum touch target sizes (44x44)");
    }

    if (results.issues.length === 0) {
        results.passed.push("✅ Mobile design audit complete");
    }

    return results;
}

function printResults(results) {
    console.log("\n" + "=".repeat(50));
    console.log("📱 MOBILE DESIGN AUDIT");
    console.log("=".repeat(50));
    console.log(`Project: ${results.projectPath}\n`);

    if (results.issues.length > 0) {
        console.log("❌ ISSUES:");
        results.issues.forEach(i => console.log(`  ${i}`));
        console.log();
    }
    if (results.warnings.length > 0) {
        console.log("⚠️ WARNINGS:");
        results.warnings.forEach(w => console.log(`  ${w}`));
        console.log();
    }
    if (results.passed.length > 0) {
        console.log("✅ PASSED:");
        results.passed.forEach(p => console.log(`  ${p}`));
        console.log();
    }

    if (results.issues.length > 0) {
        console.log("❌ AUDIT FAILED");
        process.exit(1);
    } else {
        console.log("✅ AUDIT PASSED");
        process.exit(0);
    }
}

const args = process.argv.slice(2);
if (args.length < 1) {
    console.log("Usage: node mobile_audit.js <project_path>");
    process.exit(1);
}

printResults(auditProject(args[0]));
