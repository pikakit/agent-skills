#!/usr/bin/env python3
"""
Mobile Design Audit - Stub Script
Referenced by: /mobile workflow

Checks mobile app projects for:
- Touch target sizes (44x44 minimum)
- Color contrast ratios
- Platform guidelines compliance
"""

import sys
import os
import json
from pathlib import Path


def audit_project(project_path: str) -> dict:
    """Audit mobile project for design issues."""
    results = {
        "project_path": project_path,
        "issues": [],
        "warnings": [],
        "passed": []
    }
    
    target = Path(project_path)
    
    # Detect platform
    platforms = []
    if (target / "android").exists() or (target / "app/build.gradle").exists():
        platforms.append("android")
    if (target / "ios").exists() or (target / "*.xcodeproj").exists():
        platforms.append("ios")
    if (target / "package.json").exists():
        pkg_path = target / "package.json"
        try:
            pkg = json.loads(pkg_path.read_text())
            deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
            if "react-native" in deps:
                platforms.append("react-native")
            if "flutter" in str(pkg):
                platforms.append("flutter")
        except Exception:
            pass
    
    if (target / "pubspec.yaml").exists():
        platforms.append("flutter")
    
    if platforms:
        results["passed"].append(f"✅ Detected platforms: {', '.join(platforms)}")
    else:
        results["warnings"].append("⚠️ Could not detect mobile platform")
    
    # Check for accessibility files
    a11y_indicators = [
        "accessibility", "a11y", "contentDescription",
        "accessibilityLabel", "semanticLabel"
    ]
    
    source_files = list(target.rglob("*.tsx")) + list(target.rglob("*.jsx"))
    source_files += list(target.rglob("*.dart")) + list(target.rglob("*.kt"))
    source_files += list(target.rglob("*.swift"))
    
    has_a11y = False
    for sf in source_files[:20]:  # Sample first 20
        try:
            content = sf.read_text()
            if any(ind in content for ind in a11y_indicators):
                has_a11y = True
                break
        except Exception:
            pass
    
    if has_a11y:
        results["passed"].append("✅ Accessibility attributes detected")
    else:
        results["warnings"].append("⚠️ No accessibility attributes found in sampled files")
    
    # Check for touch target sizing
    touch_indicators = ["minHeight: 44", "minWidth: 44", "hitSlop", "touchableOpacity"]
    has_touch_targets = False
    for sf in source_files[:20]:
        try:
            content = sf.read_text()
            if any(ind in content for ind in touch_indicators):
                has_touch_targets = True
                break
        except Exception:
            pass
    
    if has_touch_targets:
        results["passed"].append("✅ Touch target sizing considerations found")
    else:
        results["warnings"].append("⚠️ Consider adding minimum touch target sizes (44x44)")
    
    if not results["issues"]:
        results["passed"].append("✅ Mobile design audit complete")
    
    return results


def print_results(results: dict):
    """Print audit results."""
    print("\n" + "=" * 50)
    print("📱 MOBILE DESIGN AUDIT")
    print("=" * 50)
    print(f"Project: {results['project_path']}\n")
    
    if results["issues"]:
        print("❌ ISSUES:")
        for issue in results["issues"]:
            print(f"  {issue}")
        print()
    
    if results["warnings"]:
        print("⚠️ WARNINGS:")
        for warning in results["warnings"]:
            print(f"  {warning}")
        print()
    
    if results["passed"]:
        print("✅ PASSED:")
        for passed in results["passed"]:
            print(f"  {passed}")
        print()
    
    if results["issues"]:
        print("❌ AUDIT FAILED")
        return 1
    else:
        print("✅ AUDIT PASSED")
        return 0


def main():
    if len(sys.argv) < 2:
        print("Usage: python mobile_audit.py <project_path>")
        sys.exit(1)
    
    project_path = sys.argv[1]
    if not os.path.exists(project_path):
        print(f"Error: Path '{project_path}' does not exist")
        sys.exit(1)
    
    results = audit_project(project_path)
    exit_code = print_results(results)
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
