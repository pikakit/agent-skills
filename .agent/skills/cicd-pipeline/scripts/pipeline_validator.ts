#!/usr/bin/env node
// @ts-nocheck
import * as fs from 'node:fs';
import * as path from 'node:path';

const VERSION = '1.0.0';

const ANTI_PATTERNS = [
  {
    message: 'Security/Reliability Risk: Job missing `timeout-minutes`. Missing timeouts can lead to infinite resource consumption.',
    severity: 'critical'
  },
  {
    message: 'Supply Chain Risk: Untrusted script execution (curl | bash) without checksum validation.',
    severity: 'high'
  },
  {
    message: 'Security Risk: Hardcoded secret detected. Use CI/CD Secrets context (e.g. ${{ secrets.XXX }}).',
    severity: 'critical'
  }
];

function scanDirectory(dir, results) {
    if (!fs.existsSync(dir)) return;
    
    let entries;
    try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch(e) { return; }
    
    for (const entry of entries) {
        if (['node_modules', '.git', 'dist', 'build'].includes(entry.name)) continue;
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
            scanDirectory(fullPath, results);
        } else if (fullPath.endsWith('.yml') || fullPath.endsWith('.yaml')) {
            try {
                const content = fs.readFileSync(fullPath, 'utf8');
                let fileIssues = [];
                
                // Job timeout check 
                const jobsSectionMatch = content.match(/jobs:\s*\n([\s\S]+?)(?:^[a-zA-Z0-9_]+:|\z)/m);
                if (jobsSectionMatch) {
                    const jobsStr = jobsSectionMatch[1];
                    if (jobsStr.includes('steps:') && !jobsStr.includes('timeout-minutes:')) {
                       fileIssues.push({ rule: ANTI_PATTERNS[0].message, severity: 'critical' });
                    }
                }
                
                const lines = content.split('\n');
                lines.forEach((line, idx) => {
                    // Check Supply Chain
                    if (/(curl|wget)[\s\S]+?\|\s*(bash|sh)/i.test(line) && !line.includes('sha256sum')) {
                        fileIssues.push({ rule: `Line ${idx+1}: ` + ANTI_PATTERNS[1].message, severity: 'high' });
                    }
                    // Check Hardcoded Secrets
                    if (/(password|token|secret|key|api_key)\s*[:=]\s*['"]?[a-zA-Z0-9_\-]{16,}['"]?/i.test(line) && !line.includes('${{')) {
                        fileIssues.push({ rule: `Line ${idx+1}: ` + ANTI_PATTERNS[2].message, severity: 'critical' });
                    }
                });
                
                if (fileIssues.length > 0) {
                    results.push({ file: path.relative(process.cwd(), fullPath), issues: fileIssues });
                }
            } catch(e) {}
        }
    }
}

function main() {
    const args = process.argv.slice(2);
    // Look for target dir like '--target .github/workflows' or fallback
    let targetPath = path.resolve('.github/workflows');
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--target' && args[i+1]) {
            targetPath = path.resolve(args[i+1]);
        }
    }
    
    if (!fs.existsSync(targetPath)) {
        console.log(JSON.stringify({
            status: 'success', // It's fine if they don't have workflows
            data: { message: `No workflow directory found at ${targetPath}. Skipping validation.` },
            error: null
        }, null, 2));
        process.exit(0);
    }
    
    const results = [];
    scanDirectory(targetPath, results);
    
    const criticalIssuesCount = results.reduce((acc, r) => acc + r.issues.length, 0);
    
    const data = {
        version: VERSION,
        scannedPath: targetPath,
        timestamp: new Date().toISOString(),
        findings: results,
        summary: { totalFilesWithIssues: results.length, totalIssues: criticalIssuesCount }
    };
    
    if (criticalIssuesCount > 0) {
        console.log(JSON.stringify({
            status: 'error',
            data,
            error: { 
                code: 'ERR_PIPELINE_VULNERABILITY', 
                phase: 'scan', 
                message: `Failed CI/CD Check: Found ${criticalIssuesCount} pipeline anti-patterns.` 
            }
        }, null, 2));
        process.exit(1);
    } else {
        console.log(JSON.stringify({
            status: 'success',
            data,
            error: null
        }, null, 2));
        process.exit(0);
    }
}

try {
    main();
} catch (e) {
    console.log(JSON.stringify({
        status: 'error',
        data: null,
        error: { code: 'ERR_FATAL', phase: 'execution', message: e.message }
    }, null, 2));
    process.exit(1);
}
