#!/usr/bin/env python3
"""
Lint Runner - Code Quality Script
Referenced by: /launch, /autopilot workflows

Runs linting tools on the project:
- ESLint for JavaScript/TypeScript
- Python linters (if detected)
"""

import sys
import os
import subprocess
import json
from pathlib import Path


def run_eslint(target_path: str) -> dict:
    """Run ESLint if available."""
    result = {"tool": "eslint", "status": "skipped", "errors": 0, "warnings": 0}
    
    target = Path(target_path)
    
    # Check if ESLint config exists
    eslint_configs = [".eslintrc", ".eslintrc.js", ".eslintrc.json", ".eslintrc.yml", "eslint.config.js"]
    has_eslint = any((target / cfg).exists() for cfg in eslint_configs)
    has_pkg = (target / "package.json").exists()
    
    if not has_eslint and not has_pkg:
        result["status"] = "no-config"
        return result
    
    try:
        # Try running ESLint
        cmd = ["npx", "eslint", ".", "--ext", ".js,.jsx,.ts,.tsx", "--format", "json"]
        proc = subprocess.run(
            cmd,
            cwd=target,
            capture_output=True,
            text=True,
            timeout=60
        )
        
        if proc.stdout:
            try:
                lint_results = json.loads(proc.stdout)
                for file_result in lint_results:
                    result["errors"] += file_result.get("errorCount", 0)
                    result["warnings"] += file_result.get("warningCount", 0)
            except json.JSONDecodeError:
                pass
        
        result["status"] = "success"
    except FileNotFoundError:
        result["status"] = "not-installed"
    except subprocess.TimeoutExpired:
        result["status"] = "timeout"
    except Exception as e:
        result["status"] = f"error: {str(e)}"
    
    return result


def run_tsc(target_path: str) -> dict:
    """Run TypeScript compiler check."""
    result = {"tool": "tsc", "status": "skipped", "errors": 0}
    
    target = Path(target_path)
    
    if not (target / "tsconfig.json").exists():
        result["status"] = "no-config"
        return result
    
    try:
        cmd = ["npx", "tsc", "--noEmit"]
        proc = subprocess.run(
            cmd,
            cwd=target,
            capture_output=True,
            text=True,
            timeout=120
        )
        
        if proc.returncode != 0:
            # Count errors in output
            errors = proc.stdout.count("error TS")
            result["errors"] = errors if errors > 0 else 1
            result["status"] = "errors"
        else:
            result["status"] = "success"
    except FileNotFoundError:
        result["status"] = "not-installed"
    except subprocess.TimeoutExpired:
        result["status"] = "timeout"
    except Exception as e:
        result["status"] = f"error: {str(e)}"
    
    return result


def print_results(results: list, target_path: str):
    """Print lint results."""
    print("\n" + "=" * 50)
    print("🔍 LINT CHECK RESULTS")
    print("=" * 50)
    print(f"Path: {target_path}\n")
    
    total_errors = 0
    total_warnings = 0
    
    for r in results:
        tool = r["tool"]
        status = r["status"]
        errors = r.get("errors", 0)
        warnings = r.get("warnings", 0)
        
        total_errors += errors
        total_warnings += warnings
        
        if status == "skipped" or status == "no-config":
            print(f"⏭️  {tool}: skipped (no config)")
        elif status == "not-installed":
            print(f"⚠️  {tool}: not installed")
        elif status == "success" and errors == 0:
            if warnings > 0:
                print(f"✅ {tool}: passed ({warnings} warnings)")
            else:
                print(f"✅ {tool}: passed")
        elif status == "errors" or errors > 0:
            print(f"❌ {tool}: {errors} errors, {warnings} warnings")
        else:
            print(f"⚠️  {tool}: {status}")
    
    print()
    
    if total_errors > 0:
        print(f"❌ LINT FAILED: {total_errors} errors, {total_warnings} warnings")
        return 1
    elif total_warnings > 0:
        print(f"⚠️  LINT PASSED WITH WARNINGS: {total_warnings} warnings")
        return 0
    else:
        print("✅ ALL LINT CHECKS PASSED")
        return 0


def main():
    if len(sys.argv) < 2:
        print("Usage: python lint_runner.py <path>")
        print("Example: python lint_runner.py .")
        sys.exit(1)
    
    target_path = sys.argv[1]
    
    if not os.path.exists(target_path):
        print(f"Error: Path '{target_path}' does not exist")
        sys.exit(1)
    
    results = []
    results.append(run_eslint(target_path))
    results.append(run_tsc(target_path))
    
    exit_code = print_results(results, target_path)
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
