/**
 * Settings UI - Interactive settings configuration
 */
import * as p from "@clack/prompts";
import pc from "picocolors";
import {
    loadSettings,
    saveSettings,
    toggleAutoLearning,
    toggleAutoUpdating,
    setApiKey,
    getApiKey,
    removeApiKey
} from "../settings.js";
import fs from 'fs';
import path from 'path';
import os from 'os';

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Mask API key for display (show first 4 and last 4 chars)
 */
function maskApiKey(key) {
    if (!key) return pc.dim("[Not Set]");
    if (key.length < 12) return "***...***";
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
}

/**
 * Get Antigravity OAuth credentials (if available)
 * @returns {{accessToken: string, expiryDate: number} | null}
 */
function getAntigravityOAuthToken() {
    try {
        const credPath = path.join(os.homedir(), '.gemini', 'oauth_creds.json');

        if (!fs.existsSync(credPath)) return null;

        const creds = JSON.parse(fs.readFileSync(credPath, 'utf8'));

        // Check if token is still valid
        if (creds.access_token && creds.expiry_date) {
            const now = Date.now();
            if (now < creds.expiry_date) {
                return {
                    accessToken: creds.access_token,
                    expiryDate: creds.expiry_date
                };
            }
        }

        return null;
    } catch (e) {
        return null;
    }
}

/**
 * Detect which API key Agent is actively using (from environment)
 * Checks multiple sources in priority order:
 * 1. Current process environment
 * 2. Exported Settings API key
 * 3. SelfEvolution .env file
 * @returns {'gemini' | 'claude' | null}
 */
function getActiveApiKey() {
    // Priority 1: Current process environment (Agent session)
    if (process.env.GEMINI_API_KEY) return 'gemini';
    if (process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY) return 'claude';

    // Priority 2: Check if we have exported keys from Settings
    const geminiKey = getApiKey('gemini');
    const claudeKey = getApiKey('claude');

    // If Settings has a key configured, consider it "active"
    // (because we auto-export to SelfEvolution)
    if (geminiKey) return 'gemini';
    if (claudeKey) return 'claude';

    // Priority 3: Check Antigravity OAuth credentials
    const oauthCreds = getAntigravityOAuthToken();
    if (oauthCreds) return 'gemini'; // Antigravity uses Google OAuth

    return null;
}

/**
 * Format API key status (ON if active, OFF if not)
 */
function formatApiKeyStatus(provider, storedKey) {
    const activeKey = getActiveApiKey();
    const isActive = activeKey === provider;

    if (!storedKey) {
        return pc.dim("[Not Set]");
    }

    if (isActive) {
        return `${pc.green("[ON]")} ${maskApiKey(storedKey)}`;
    } else {
        return `${pc.dim("[OFF]")} ${maskApiKey(storedKey)}`;
    }
}

// ============================================================================
// SETTINGS MENU
// ============================================================================

/**
 * Interactive settings menu with Clack icons
 */
export async function runSettingsUI() {
    // No intro - go straight to settings menu

    // Display active API key info ONCE at the start
    const geminiKey = getApiKey('gemini');
    const claudeKey = getApiKey('claude');

    let bannerMsg;

    // Priority 1: Check if running in Antigravity (check for oauth_creds.json)
    try {
        const credPath = path.join(os.homedir(), '.gemini', 'oauth_creds.json');
        if (fs.existsSync(credPath)) {
            // Running in Antigravity - always show this message
            bannerMsg = pc.green(
                `✓ Agent Coding is using system credentials\n` +
                `  Source: Antigravity Session (in-memory)\n` +
                `  → Configure permanent API key below for SelfEvolution features`
            );
        } else {
            // Not in Antigravity, check for configured keys
            if (geminiKey) {
                bannerMsg = pc.green(`✓ Using Gemini API Key (Configured)\n  → SelfEvolution features enabled`);
            } else if (claudeKey) {
                bannerMsg = pc.green(`✓ Using Claude API Key (Configured)\n  → SelfEvolution features enabled`);
            } else {
                bannerMsg = pc.yellow(`⚠ No API Key Configured\n  → Set up API key below to enable SelfEvolution features`);
            }
        }
    } catch (e) {
        // Fallback: check configured keys
        if (geminiKey) {
            bannerMsg = pc.green(`✓ Using Gemini API Key (Configured)\n  → SelfEvolution features enabled`);
        } else if (claudeKey) {
            bannerMsg = pc.green(`✓ Using Claude API Key (Configured)\n  → SelfEvolution features enabled`);
        } else {
            bannerMsg = pc.yellow(`⚠ No API Key Configured\n  → Set up API key below to enable SelfEvolution features`);
        }
    }

    p.note(bannerMsg, "🔑 Active API Key");

    while (true) {
        const settings = loadSettings();

        const action = await p.select({
            message: "⚙️  Settings",
            options: [
                // AI BEHAVIOR GROUP
                {
                    value: "autoLearn",
                    label: `🤖 Auto-Learning: ${settings.autoLearning ? pc.green("[ON]") : pc.dim("[OFF]")}`,
                    hint: "Learn from mistakes"
                },
                {
                    value: "autoUpdate",
                    label: `🔄 Auto-Updating: ${settings.autoUpdating ? pc.green("[ON]") : pc.dim("[OFF]")}`,
                    hint: "Update threshold hits"
                },
                {
                    value: "threshold",
                    label: `📈 Update Threshold: ${pc.cyan(settings.updateThreshold)}`,
                    hint: "Hits before update"
                },

                // API CONFIGURATION GROUP
                {
                    value: "geminiKey",
                    label: `🔑 Gemini API: ${formatApiKeyStatus('gemini', getApiKey('gemini'))}`,
                    hint: "For agent coding"
                },
                {
                    value: "claudeKey",
                    label: `🔑 Claude API: ${formatApiKeyStatus('claude', getApiKey('claude'))}`,
                    hint: "Alternative AI provider"
                },
                {
                    value: "testOptimization",
                    label: "🧪 Test AI Optimization",
                    hint: "Verify SelfEvolution integration"
                },
                { value: "back", label: "← Back", hint: "Return to main menu" }
            ]
        });

        if (p.isCancel(action) || action === "back") {
            return;
        }

        switch (action) {
            case "autoLearn": {
                const newValue = toggleAutoLearning();
                p.note(
                    `Auto-Learning is now ${newValue ? pc.green("ON") : pc.red("OFF")}`,
                    "Setting Updated"
                );
                break; // Continue loop to show menu again
            }
            case "autoUpdate": {
                const newValue = toggleAutoUpdating();
                if (newValue) {
                    p.note(
                        `Auto-Updating is now ${pc.green("ON")}\n\n` +
                        `When patterns become valuable, Agent will:\n` +
                        `• Analyze learned lessons\n` +
                        `• Generate update proposals\n` +
                        `• Notify you for approval`,
                        "Setting Updated"
                    );
                } else {
                    p.note(
                        `Auto-Updating is now ${pc.red("OFF")}`,
                        "Setting Updated"
                    );
                }
                break; // Continue loop
            }
            case "threshold": {
                const newThreshold = await p.text({
                    message: "Set new threshold (1-20):",
                    placeholder: "5",
                    initialValue: String(settings.updateThreshold),
                    validate: (value) => {
                        const num = parseInt(value);
                        if (isNaN(num) || num < 1 || num > 20) {
                            return "Please enter a number between 1 and 20";
                        }
                    }
                });

                if (!p.isCancel(newThreshold)) {
                    settings.updateThreshold = parseInt(newThreshold);
                    saveSettings(settings);
                    p.note(
                        `Update threshold set to ${settings.updateThreshold}`,
                        "Setting Updated"
                    );
                }
                break; // Continue loop
            }
            case "geminiKey":
            case "claudeKey": {
                const provider = action === "geminiKey" ? "gemini" : "claude";
                const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
                const currentKey = getApiKey(provider);

                // Ask user action
                const keyAction = await p.select({
                    message: `${providerName} API Key:`,
                    options: [
                        { value: "set", label: "Set/Update Key", hint: "Configure API key" },
                        ...(currentKey ? [{ value: "remove", label: "Remove Key", hint: "Clear stored key" }] : []),
                        { value: "cancel", label: "Cancel", hint: "Go back" }
                    ]
                });

                if (p.isCancel(keyAction) || keyAction === "cancel") {
                    break; // Return to settings menu
                }

                if (keyAction === "set") {
                    const apiKey = await p.password({
                        message: `Enter ${providerName} API Key:`,
                        mask: "*",
                        validate: (value) => {
                            if (!value || value.length < 10) {
                                return "API key must be at least 10 characters";
                            }
                        }
                    });

                    if (!p.isCancel(apiKey)) {
                        const success = setApiKey(provider, apiKey);
                        if (success) {
                            p.note(
                                `${providerName} API key ${currentKey ? 'updated' : 'set'} successfully!\n\n` +
                                `Key: ${maskApiKey(apiKey)}\n` +
                                `Stored in: .agent/knowledge/settings.yaml`,
                                pc.green("✓ API Key Saved")
                            );
                        } else {
                            p.note(
                                `Failed to save ${providerName} API key`,
                                pc.red("✗ Error")
                            );
                        }
                    }
                } else if (keyAction === "remove") {
                    const confirm = await p.confirm({
                        message: `Remove ${providerName} API key?`,
                    });

                    if (confirm && !p.isCancel(confirm)) {
                        removeApiKey(provider);
                        p.note(
                            `${providerName} API key removed`,
                            "Key Removed"
                        );
                    }
                }
                break;
            }
            case "testOptimization": {
                const { exportApiKeysToSelfEvolution, verifySelfEvolutionAccess } =
                    await import('../selfevolution-bridge.js');

                // Step 1: Export keys
                const spinner = p.spinner();
                spinner.start('Exporting API keys to SelfEvolution...');

                const exportResult = exportApiKeysToSelfEvolution();

                if (!exportResult.success) {
                    spinner.stop('Export failed');
                    p.note(
                        `❌ No API keys configured\n\n` +
                        `Please set Gemini or Claude API key first.\n\n` +
                        `Reason: ${exportResult.reason}`,
                        pc.red('✗ Cannot Test')
                    );
                    break;
                }

                spinner.message('Keys exported. Verifying Python access...');

                // Step 2: Verify Python can access
                const verifyResult = await verifySelfEvolutionAccess();

                if (verifyResult.success && verifyResult.keyDetected) {
                    spinner.stop('Verification complete');

                    const exportedKeys = [];
                    if (exportResult.exported.gemini) exportedKeys.push('Gemini');
                    if (exportResult.exported.claude) exportedKeys.push('Claude');

                    p.note(
                        `✅ **API Key Integration Working!**\n\n` +
                        `Exported: ${exportedKeys.join(', ')}\n` +
                        `Location: ${exportResult.path}\n\n` +
                        `SelfEvolution can now:\n` +
                        `• Auto-learn from mistakes\n` +
                        `• AI-powered lesson optimization\n` +
                        `• Self-improve knowledge base\n\n` +
                        `${pc.dim('Python Output:')}\n${pc.dim(verifyResult.output)}`,
                        pc.green('✓ Optimization Ready')
                    );
                } else {
                    spinner.stop('Verification failed');
                    p.note(
                        `⚠️ **Export OK, but verification failed**\n\n` +
                        `Keys exported to: ${exportResult.path}\n` +
                        `But Python script couldn't detect them.\n\n` +
                        `Error: ${verifyResult.error || 'Unknown'}\n\n` +
                        `Possible causes:\n` +
                        `• Python not installed\n` +
                        `• SelfEvolution scripts missing\n` +
                        `• Environment variable issue`,
                        pc.yellow('⚠ Partial Success')
                    );
                }
                break;
            }
        }
    }
}

export default runSettingsUI;
