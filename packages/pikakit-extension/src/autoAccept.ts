/**
 * PikaKit Auto Accept & Auto Run Module
 * 
 * Auto-Accept: Automatically accepts Antigravity agent steps (code edits, file saves, terminal accept).
 * Auto-Run: Automatically runs proposed terminal commands.
 * 
 * These are independent toggles:
 *   - Auto-Accept: Ctrl+Alt+Shift+A
 *   - Auto-Run: Alt+Enter
 */

import * as vscode from 'vscode';

// ═══════════════════════════════════════
// AUTO-ACCEPT
// ═══════════════════════════════════════

let acceptEnabled = false;
let acceptInterval: ReturnType<typeof setInterval> | null = null;
let acceptStatusBar: vscode.StatusBarItem;

/**
 * Initialize Auto Accept feature
 */
export function initAutoAccept(context: vscode.ExtensionContext) {
    acceptStatusBar = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        10000
    );
    acceptStatusBar.command = 'pikakit.toggleAutoAccept';
    context.subscriptions.push(acceptStatusBar);

    context.subscriptions.push(
        vscode.commands.registerCommand('pikakit.toggleAutoAccept', toggleAccept)
    );

    const config = vscode.workspace.getConfiguration('pikakit');
    acceptEnabled = config.get('autoAcceptEnabled', false);

    updateAcceptUI();

    if (acceptEnabled) {
        startAcceptLoop();
    }
}

function toggleAccept() {
    acceptEnabled = !acceptEnabled;

    const config = vscode.workspace.getConfiguration('pikakit');
    config.update('autoAcceptEnabled', acceptEnabled, vscode.ConfigurationTarget.Global);

    updateAcceptUI();

    if (acceptEnabled) {
        startAcceptLoop();
        vscode.window.showInformationMessage('PikaKit Auto-Accept: ON ✅');
    } else {
        stopAcceptLoop();
        vscode.window.showInformationMessage('PikaKit Auto-Accept: OFF 🛑');
    }
}

function updateAcceptUI() {
    if (!acceptStatusBar) return;

    if (acceptEnabled) {
        acceptStatusBar.text = "$(check) Auto-Accept";
        acceptStatusBar.tooltip = "PikaKit Auto-Accept is ON (Click to disable)";
        acceptStatusBar.backgroundColor = undefined;
    } else {
        acceptStatusBar.text = "$(circle-slash) Auto-Accept";
        acceptStatusBar.tooltip = "PikaKit Auto-Accept is OFF (Click to enable)";
        acceptStatusBar.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    }
    acceptStatusBar.show();
}

function startAcceptLoop() {
    if (acceptInterval) return;

    acceptInterval = setInterval(async () => {
        if (!acceptEnabled) return;

        try {
            await vscode.commands.executeCommand('antigravity.agent.acceptAgentStep');
        } catch (e) { /* command may not be available */ }

        try {
            await vscode.commands.executeCommand('antigravity.terminal.accept');
        } catch (e) { /* command may not be available */ }

        try {
            await vscode.commands.executeCommand('antigravity.executeCode');
        } catch (e) { /* command may not be available */ }
    }, 500);
}

function stopAcceptLoop() {
    if (acceptInterval) {
        clearInterval(acceptInterval);
        acceptInterval = null;
    }
}

export function isAutoAcceptEnabled(): boolean {
    return acceptEnabled;
}

// ═══════════════════════════════════════
// AUTO-RUN (Alt+Enter)
// ═══════════════════════════════════════

let runEnabled = false;
let runInterval: ReturnType<typeof setInterval> | null = null;
let runStatusBar: vscode.StatusBarItem;

/**
 * Initialize Auto Run feature (independent from Auto Accept)
 */
export function initAutoRun(context: vscode.ExtensionContext) {
    runStatusBar = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        9999 // Right after Auto-Accept
    );
    runStatusBar.command = 'pikakit.toggleAutoRun';
    context.subscriptions.push(runStatusBar);

    context.subscriptions.push(
        vscode.commands.registerCommand('pikakit.toggleAutoRun', toggleRun)
    );

    const config = vscode.workspace.getConfiguration('pikakit');
    runEnabled = config.get('autoRunEnabled', false);

    updateRunUI();

    if (runEnabled) {
        startRunLoop();
    }
}

function toggleRun() {
    runEnabled = !runEnabled;

    const config = vscode.workspace.getConfiguration('pikakit');
    config.update('autoRunEnabled', runEnabled, vscode.ConfigurationTarget.Global);

    updateRunUI();

    if (runEnabled) {
        startRunLoop();
        vscode.window.showInformationMessage('PikaKit Auto-Run: ON ⚡ (Alt+Enter to toggle)');
    } else {
        stopRunLoop();
        vscode.window.showInformationMessage('PikaKit Auto-Run: OFF 🛑 (Alt+Enter to toggle)');
    }
}

function updateRunUI() {
    if (!runStatusBar) return;

    if (runEnabled) {
        runStatusBar.text = "$(play) Auto-Run";
        runStatusBar.tooltip = "PikaKit Auto-Run is ON — proposed commands run automatically (Alt+Enter to toggle)";
        runStatusBar.backgroundColor = undefined;
    } else {
        runStatusBar.text = "$(debug-pause) Auto-Run";
        runStatusBar.tooltip = "PikaKit Auto-Run is OFF (Alt+Enter to toggle)";
        runStatusBar.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    }
    runStatusBar.show();
}

function startRunLoop() {
    if (runInterval) return;

    runInterval = setInterval(async () => {
        if (!runEnabled) return;

        try {
            await vscode.commands.executeCommand('antigravity.terminal.run');
        } catch (e) { /* command may not be available */ }
    }, 500);
}

function stopRunLoop() {
    if (runInterval) {
        clearInterval(runInterval);
        runInterval = null;
    }
}

export function isAutoRunEnabled(): boolean {
    return runEnabled;
}

// ═══════════════════════════════════════
// DISPOSE
// ═══════════════════════════════════════

export function disposeAutoAccept() {
    stopAcceptLoop();
    if (acceptStatusBar) {
        acceptStatusBar.dispose();
    }
}

export function disposeAutoRun() {
    stopRunLoop();
    if (runStatusBar) {
        runStatusBar.dispose();
    }
}

