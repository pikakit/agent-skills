/**
 * Fix All UI - Agent Coding Handoff (Smart Version)
 * Instead of brittle regex auto-fix, generates AI-friendly prompts
 */
import * as p from "@clack/prompts";
import pc from "picocolors";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import { showIntro, createSpinner, showSuccessNote, showErrorNote, theme } from "./clack-helpers.js";
import { loadMostRecentScan, loadScanResult } from "../recall.js";

/**
 * Fix All UI - Generate Agent handoff prompts
 */
export async function runFixAllUI(scanId = null) {
    showIntro('🔧 Fix All - Agent Handoff');

    // 1. Get scan results
    let scanResult;
    const spinner = createSpinner('Loading scan results...');

    if (!scanId) {
        scanResult = loadMostRecentScan();
    } else {
        scanResult = loadScanResult(scanId);
    }

    spinner.stop();

    if (!scanResult) {
        showErrorNote(
            'No scan results found.\\n\\n' +
            'Run "Scan All" first to generate scan data.',
            '✗ No Scan Results'
        );
        return;
    }

    // 2. Show summary
    console.log(`\\n${theme.primary(scanResult.totalIssues)} violations found\\n`);

    // 3. Offer handoff options
    const choice = await p.select({
        message: "How would you like to fix these violations?",
        options: [
            { value: "agent", label: "🤖 Hand off to Agent", hint: "Generate AI fix request" },
            { value: "skip", label: "← Skip", hint: "Return to menu" }
        ]
    });

    if (p.isCancel(choice) || choice === "skip") {
        p.cancel('Cancelled');
        return;
    }

    // 4. Generate fix prompt
    const fixPrompt = generateAgentFixPrompt(scanResult);

    // 5. Ask where to send
    const outputChoice = await p.select({
        message: "Where to send the fix request?",
        options: [
            { value: "clipboard", label: "📋 Copy to Clipboard", hint: "Paste into AI chat" },
            { value: "file", label: "💾 Save to File", hint: ".agent/fix-request.md" },
            { value: "both", label: "✨ Both", hint: "Copy and save" }
        ]
    });

    if (p.isCancel(outputChoice)) {
        p.cancel('Cancelled');
        return;
    }

    // 6. Execute handoff
    let copied = false;
    let saved = false;

    if (outputChoice === "clipboard" || outputChoice === "both") {
        copied = copyToClipboard(fixPrompt);
    }

    if (outputChoice === "file" || outputChoice === "both") {
        saved = saveFixRequest(fixPrompt);
    }

    // 7. Show success
    let message = '';
    if (copied && saved) {
        message = '✓ Copied to clipboard\\n✓ Saved to .agent/fix-request.md\\n\\nPaste into your AI coding assistant!';
    } else if (copied) {
        message = '✓ Copied to clipboard\\n\\nPaste into your AI coding assistant!';
    } else if (saved) {
        message = '✓ Saved to .agent/fix-request.md\\n\\nOpen file and copy into your AI coding assistant!';
    } else {
        message = 'Failed to copy or save. Check console for errors.';
    }

    p.note(message, '🎉 Fix Request Ready');
}

/**
 * Generate AI-friendly fix prompt from scan results
 */
function generateAgentFixPrompt(scanResult) {
    // Group by file
    const byFile = {};
    scanResult.issues.forEach(issue => {
        const file = path.relative(process.cwd(), issue.file);
        if (!byFile[file]) byFile[file] = [];
        byFile[file].push(issue);
    });

    const fileList = Object.entries(byFile).sort((a, b) => b[1].length - a[1].length);

    let prompt = '# Code Violation Fix Request\\n\\n## Summary\\n';
    prompt += `- **Total violations**: ${scanResult.totalIssues}\\n`;
    prompt += `- **Files affected**: ${fileList.length}\\n`;
    prompt += `- **Errors**: ${scanResult.summary.errors}\\n`;
    prompt += `- **Warnings**: ${scanResult.summary.warnings}\\n\\n`;
    prompt += '## Violations by File\\n\\n';

    fileList.forEach(([file, issues]) => {
        prompt += `### 📁 \`${file}\`\\n\\n`;
        issues.forEach(issue => {
            const icon = issue.severity === 'ERROR' ? '🔴' : '⚠️';
            prompt += `${icon} **Line ${issue.line}** - ${issue.severity}\\n`;
            prompt += `- **Issue**: ${issue.message}\\n`;
            if (issue.pattern) {
                prompt += `- **Pattern**: \`${issue.pattern}\`\\n`;
            }
            prompt += '\\n';
        });
        prompt += '\\n';
    });

    prompt += '## Instructions\\n\\n';
    prompt += 'Please fix all violations following these guidelines:\\n\\n';
    prompt += '1. **Understand Context**: Read the entire file before making changes\\n';
    prompt += '2. **Fix Correctly**: Address the root cause, not just the symptom\\n';
    prompt += '3. **Maintain Style**: Keep existing code style and formatting\\n';
    prompt += '4. **Test Changes**: Ensure no functionality is broken\\n';
    prompt += '5. **Verify**: Check that all violations are resolved\\n\\n';
    prompt += '**Important**: Some violations may be false positives. Use your judgment and skip if the code is actually correct.\\n\\n';
    prompt += 'Ready to proceed with fixing these violations?\\n';

    return prompt;
}

/**
 * Copy text to clipboard (cross-platform)
 */
function copyToClipboard(text) {
    try {
        if (process.platform === 'win32') {
            execSync('clip', { input: text });
            return true;
        } else if (process.platform === 'darwin') {
            execSync('pbcopy', { input: text });
            return true;
        } else {
            execSync('xclip -selection clipboard', { input: text });
            return true;
        }
    } catch (e) {
        console.error(`Clipboard error: ${e.message}`);
        return false;
    }
}

/**
 * Save fix request to file
 */
function saveFixRequest(text) {
    try {
        const fixRequestPath = path.join('.agent', 'fix-request.md');
        const dir = path.dirname(fixRequestPath);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(fixRequestPath, text, 'utf8');
        return true;
    } catch (e) {
        console.error(`Save error: ${e.message}`);
        return false;
    }
}

export default runFixAllUI;
