#!/usr/bin/env python3
"""
Security Scanner - Stub Script
Referenced by: /launch, /inspect, /diagnose, /autopilot workflows

This is a stub implementation. For full security scanning,
integrate with tools like:
- npm audit / yarn audit
- Snyk CLI
- Trivy
- Semgrep
"""

import sys
import os
import json
import subprocess
from pathlib import Path


def scan_directory(target_path: str) -> dict:
    """Scan directory for common security issues."""
    results = {
        "scan_path": target_path,
        "issues": [],
        "warnings": [],
        "passed": []
    }
    
    target = Path(target_path)
    
    # Check for common security files
    security_files = [".env", ".env.local", ".env.production"]
    for sf in security_files:
        env_file = target / sf
        if env_file.exists():
            # Check if in .gitignore
            gitignore = target / ".gitignore"
            if gitignore.exists():
                content = gitignore.read_text()
                if sf not in content:
                    results["warnings"].append(f"⚠️ {sf} exists but not in .gitignore")
                else:
                    results["passed"].append(f"✅ {sf} is gitignored")
    
    # Check for package-lock.json (npm audit possible)
    if (target / "package-lock.json").exists():
        results["passed"].append("✅ package-lock.json found - npm audit available")
        # Try npm audit
        try:
            result = subprocess.run(
                ["npm", "audit", "--json"],
                cwd=target,
                capture_output=True,
                text=True,
                timeout=30
            )
            if result.returncode != 0:
                audit_data = json.loads(result.stdout) if result.stdout else {}
                vuln_count = audit_data.get("metadata", {}).get("vulnerabilities", {})
                if vuln_count:
                    total = sum(vuln_count.values())
                    if total > 0:
                        results["issues"].append(f"🔴 npm audit found {total} vulnerabilities")
                    else:
                        results["passed"].append("✅ npm audit: no vulnerabilities")
        except Exception:
            results["warnings"].append("⚠️ npm audit failed or timed out")
    
    # Check for secrets patterns in common files
    secret_patterns = ["API_KEY", "SECRET", "PASSWORD", "TOKEN", "PRIVATE_KEY"]
    config_files = list(target.glob("*.json")) + list(target.glob("*.js")) + list(target.glob("*.ts"))
    
    for cf in config_files[:10]:  # Limit to first 10
        try:
            content = cf.read_text()
            for pattern in secret_patterns:
                if pattern in content and "process.env" not in content:
                    results["warnings"].append(f"⚠️ Possible hardcoded secret in {cf.name}")
                    break
        except Exception:
            pass
    
    if not results["issues"] and not results["warnings"]:
        results["passed"].append("✅ No obvious security issues detected")
    
    return results


def print_results(results: dict):
    """Print scan results in readable format."""
    print("\n" + "=" * 50)
    print("🔒 SECURITY SCAN RESULTS")
    print("=" * 50)
    print(f"Scanned: {results['scan_path']}\n")
    
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
    
    # Summary
    total_issues = len(results["issues"])
    total_warnings = len(results["warnings"])
    
    if total_issues > 0:
        print(f"❌ FAILED: {total_issues} issues, {total_warnings} warnings")
        return 1
    elif total_warnings > 0:
        print(f"⚠️ PASSED WITH WARNINGS: {total_warnings} warnings")
        return 0
    else:
        print("✅ PASSED: No security issues detected")
        return 0


def main():
    if len(sys.argv) < 2:
        print("Usage: python security_scan.py <path>")
        print("Example: python security_scan.py .")
        sys.exit(1)
    
    target_path = sys.argv[1]
    
    if not os.path.exists(target_path):
        print(f"Error: Path '{target_path}' does not exist")
        sys.exit(1)
    
    results = scan_directory(target_path)
    exit_code = print_results(results)
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
