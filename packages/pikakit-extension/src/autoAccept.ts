/**
 * PikaKit Auto Accept Module
 * 
 * Automatically accepts Antigravity agent steps (code edits, file saves, terminal commands).
 * Based on analysis of antigravity-auto-accept extension.
 */

import * as vscode from 'vscode';

let enabled = false;
let interval: ReturnType<typeof setInterval> | null = null;
let statusBarItem: vscode.StatusBarItem;

/**
 * Initialize Auto Accept feature
 */
export function initAutoAccept(context: vscode.ExtensionContext) {
    // Create status bar item (right-aligned, high priority to appear first)
    statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        10000
    );
    statusBarItem.command = 'pikakit.toggleAutoAccept';
    context.subscriptions.push(statusBarItem);

    // Register toggle command
    context.subscriptions.push(
        vscode.commands.registerCommand('pikakit.toggleAutoAccept', toggle)
    );

    // Load saved state from configuration
    const config = vscode.workspace.getConfiguration('pikakit');
    enabled = config.get('autoAcceptEnabled', false);

    updateUI();

    if (enabled) {
        startLoop();
    }
}

/**
 * Toggle Auto Accept on/off
 */
function toggle() {
    enabled = !enabled;

    // Save state to configuration
    const config = vscode.workspace.getConfiguration('pikakit');
    config.update('autoAcceptEnabled', enabled, vscode.ConfigurationTarget.Global);

    updateUI();

    if (enabled) {
        startLoop();
        vscode.window.showInformationMessage('PikaKit Auto-Accept: ON ✅');
    } else {
        stopLoop();
        vscode.window.showInformationMessage('PikaKit Auto-Accept: OFF 🛑');
    }
}

/**
 * Update status bar UI based on current state
 */
function updateUI() {
    if (!statusBarItem) return;

    if (enabled) {
        statusBarItem.text = "$(check) Auto-Accept";
        statusBarItem.tooltip = "PikaKit Auto-Accept is ON (Click to disable)";
        statusBarItem.backgroundColor = undefined;
    } else {
        statusBarItem.text = "$(circle-slash) Auto-Accept";
        statusBarItem.tooltip = "PikaKit Auto-Accept is OFF (Click to enable)";
        statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    }
    statusBarItem.show();
}

/**
 * Start the auto-accept polling loop
 */
function startLoop() {
    if (interval) return; // Already running

    interval = setInterval(async () => {
        if (!enabled) return;

        // Accept agent steps (code edits, file saves)
        try {
            await vscode.commands.executeCommand('antigravity.agent.acceptAgentStep');
        } catch (e) {
            // Silently ignore - command may not be available
        }

        // Accept terminal commands
        try {
            await vscode.commands.executeCommand('antigravity.terminal.accept');
        } catch (e) {
            // Silently ignore - command may not be available
        }
    }, 500); // Poll every 500ms
}

/**
 * Stop the auto-accept polling loop
 */
function stopLoop() {
    if (interval) {
        clearInterval(interval);
        interval = null;
    }
}

/**
 * Check if Auto Accept is currently enabled
 */
export function isAutoAcceptEnabled(): boolean {
    return enabled;
}

/**
 * Dispose Auto Accept resources
 */
export function disposeAutoAccept() {
    stopLoop();
    if (statusBarItem) {
        statusBarItem.dispose();
    }
}
