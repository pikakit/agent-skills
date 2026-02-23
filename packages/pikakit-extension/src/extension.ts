/**
 * PikaKit Skill Generator - VS Code Extension
 * 
 * Entry point for the extension. Initializes all components and handles
 * activation/deactivation lifecycle.
 * 
 * @author PikaKit
 * @version 1.0.0
 */

import * as vscode from 'vscode';
import { DiagnosticListener } from './diagnosticListener';
import { PatternAnalyzer } from './patternAnalyzer';
import { LessonStore } from './lessonStore';
import { SkillGenerator } from './skillGenerator';
import { StatusBarManager } from './statusBar';
import { initAutoAccept, initAutoRun, disposeAutoAccept, disposeAutoRun } from './autoAccept';

// Global output channel for logging
let outputChannel: vscode.OutputChannel;

/**
 * Log message to output channel
 */
function log(message: string, level: 'info' | 'warn' | 'error' = 'info') {
    const timestamp = new Date().toISOString().slice(11, 19);
    const prefix = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : 'ℹ️';
    outputChannel?.appendLine(`[${timestamp}] ${prefix} ${message}`);
    if (level === 'error') {
        console.error(`[PikaKit] ${message}`);
    }
}

/**
 * Wrap async function with error handling
 */
function withErrorHandling<T>(fn: () => Promise<T>, errorMsg: string): Promise<T | undefined> {
    return fn().catch(err => {
        log(`${errorMsg}: ${err.message}`, 'error');
        vscode.window.showErrorMessage(`PikaKit: ${errorMsg}`);
        return undefined;
    });
}

// Global instances
let diagnosticListener: DiagnosticListener | null = null;
let patternAnalyzer: PatternAnalyzer | null = null;
let statusBar: StatusBarManager | null = null;
let isLearning = false;

// Per-workspace stores (keyed by workspace folder path)
const lessonStores: Map<string, LessonStore> = new Map();
const skillGenerators: Map<string, SkillGenerator> = new Map();

/**
 * Get or create LessonStore for a workspace folder
 */
function getLessonStore(workspacePath: string): LessonStore {
    if (!lessonStores.has(workspacePath)) {
        lessonStores.set(workspacePath, new LessonStore(workspacePath));
    }
    return lessonStores.get(workspacePath)!;
}

/**
 * Get or create SkillGenerator for a workspace folder
 */
function getSkillGenerator(workspacePath: string): SkillGenerator {
    if (!skillGenerators.has(workspacePath)) {
        skillGenerators.set(workspacePath, new SkillGenerator(workspacePath));
    }
    return skillGenerators.get(workspacePath)!;
}

/**
 * Get workspace folder path for a file
 */
function getWorkspaceForFile(filePath: string): string | null {
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(filePath));
    return workspaceFolder?.uri.fsPath || null;
}

/**
 * Get current workspace (from active editor or first workspace)
 */
function getCurrentWorkspace(): string | null {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        const ws = getWorkspaceForFile(activeEditor.document.uri.fsPath);
        if (ws) return ws;
    }
    return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || null;
}

/**
 * Extension activation
 */
export function activate(context: vscode.ExtensionContext) {
    // Initialize output channel first
    outputChannel = vscode.window.createOutputChannel('PikaKit');
    context.subscriptions.push(outputChannel);

    log('PikaKit Skill Generator is now active!');
    console.log('PikaKit Skill Generator is now active!');

    // Check if any workspace folder exists
    if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
        vscode.window.showWarningMessage('PikaKit: No workspace folder found');
        return;
    }

    // Initialize shared components
    patternAnalyzer = new PatternAnalyzer();
    statusBar = new StatusBarManager();

    // Initialize stores for all workspace folders
    for (const folder of vscode.workspace.workspaceFolders) {
        lessonStores.set(folder.uri.fsPath, new LessonStore(folder.uri.fsPath));
        skillGenerators.set(folder.uri.fsPath, new SkillGenerator(folder.uri.fsPath));
        log(`Initialized stores for: ${folder.name}`);
    }

    // Get default workspace for diagnostic listener
    const defaultWorkspace = vscode.workspace.workspaceFolders[0].uri.fsPath;

    // Initialize diagnostic listener with workspace-aware callbacks
    diagnosticListener = new DiagnosticListener(
        patternAnalyzer,
        (filePath: string) => {
            const ws = getWorkspaceForFile(filePath);
            return getLessonStore(ws || vscode.workspace.workspaceFolders![0].uri.fsPath);
        },
        (filePath: string) => {
            const ws = getWorkspaceForFile(filePath);
            return getSkillGenerator(ws || vscode.workspace.workspaceFolders![0].uri.fsPath);
        },
        statusBar
    );

    // Register commands
    const startCmd = vscode.commands.registerCommand('pikakit.startLearning', () => {
        startLearning();
    });

    const stopCmd = vscode.commands.registerCommand('pikakit.stopLearning', () => {
        stopLearning();
    });

    const generateCmd = vscode.commands.registerCommand('pikakit.generateSkill', async () => {
        await generateSkillManual();
    });

    const viewCmd = vscode.commands.registerCommand('pikakit.viewLessons', () => {
        viewLessons();
    });

    const clearCmd = vscode.commands.registerCommand('pikakit.clearLessons', async () => {
        await clearLessons();
    });

    context.subscriptions.push(startCmd, stopCmd, generateCmd, viewCmd, clearCmd);
    context.subscriptions.push(statusBar);

    // Auto-start if configured
    const config = vscode.workspace.getConfiguration('pikakit');
    if (config.get<boolean>('autoStart', true)) {
        startLearning();
    }

    // Initialize Auto Accept & Auto Run features
    initAutoAccept(context);
    initAutoRun(context);
}

/**
 * Start learning from diagnostics
 */
function startLearning() {
    if (isLearning) {
        vscode.window.showInformationMessage('PikaKit: Already learning');
        return;
    }

    if (diagnosticListener) {
        diagnosticListener.start();
        isLearning = true;
        statusBar?.setLearning(true);
        vscode.window.showInformationMessage('📚 PikaKit Engine online. Learning initialized.');
    }
}

/**
 * Stop learning
 */
function stopLearning() {
    if (!isLearning) {
        vscode.window.showInformationMessage('PikaKit: Not currently learning');
        return;
    }

    if (diagnosticListener) {
        diagnosticListener.stop();
        isLearning = false;
        statusBar?.setLearning(false);
        vscode.window.showInformationMessage('⏹️ PikaKit: Stopped learning');
    }
}

/**
 * Manually trigger skill generation
 */
async function generateSkillManual() {
    const currentWorkspace = getCurrentWorkspace();
    if (!currentWorkspace) {
        vscode.window.showErrorMessage('PikaKit: No workspace folder found');
        return;
    }

    const lessonStore = getLessonStore(currentWorkspace);
    const skillGenerator = getSkillGenerator(currentWorkspace);

    const lessons = lessonStore.getAllLessons();
    if (lessons.length === 0) {
        vscode.window.showWarningMessage('PikaKit: No lessons learned yet');
        return;
    }

    // Group lessons by category
    const grouped = lessonStore.getGroupedLessons();

    // Show quick pick to select category
    const categories = Object.keys(grouped);
    if (categories.length === 0) {
        vscode.window.showWarningMessage('PikaKit: No patterns to generate skills from');
        return;
    }

    const selected = await vscode.window.showQuickPick(categories, {
        placeHolder: 'Select category to generate skill from'
    });

    if (selected) {
        const skillName = await vscode.window.showInputBox({
            prompt: 'Enter skill name',
            placeHolder: 'e.g., typescript-imports'
        });

        if (skillName) {
            const success = await skillGenerator.generateSkill(skillName, grouped[selected]);
            if (success) {
                vscode.window.showInformationMessage(`🎯 Generated skill: ${skillName}`);
            } else {
                vscode.window.showErrorMessage(`Failed to generate skill: ${skillName}`);
            }
        }
    }
}

/**
 * View all learned lessons
 */
function viewLessons() {
    const currentWorkspace = getCurrentWorkspace();
    if (!currentWorkspace) {
        vscode.window.showErrorMessage('PikaKit: No workspace folder found');
        return;
    }

    const lessonStore = getLessonStore(currentWorkspace);
    const lessons = lessonStore.getAllLessons();
    if (lessons.length === 0) {
        vscode.window.showInformationMessage('PikaKit: No lessons learned yet');
        return;
    }

    // Create output channel
    const output = vscode.window.createOutputChannel('PikaKit Lessons');
    output.clear();
    output.appendLine('📚 PikaKit - Learned Lessons\n');
    output.appendLine('='.repeat(50));

    for (const lesson of lessons) {
        output.appendLine(`\n[${lesson.id}] ${lesson.category.toUpperCase()}`);
        output.appendLine(`Pattern: ${lesson.pattern}`);
        output.appendLine(`Occurrences: ${lesson.occurrences}`);
        output.appendLine(`Last seen: ${lesson.lastSeen}`);
        output.appendLine('-'.repeat(30));
    }

    output.appendLine(`\nTotal: ${lessons.length} lessons`);
    output.show();
}

/**
 * Clear all lessons
 */
async function clearLessons() {
    const currentWorkspace = getCurrentWorkspace();
    if (!currentWorkspace) {
        vscode.window.showErrorMessage('PikaKit: No workspace folder found');
        return;
    }

    const confirm = await vscode.window.showWarningMessage(
        'Clear all learned lessons?',
        { modal: true },
        'Yes, clear all'
    );

    if (confirm === 'Yes, clear all') {
        const lessonStore = getLessonStore(currentWorkspace);
        lessonStore.clear();
        statusBar?.updateCount(0);
        vscode.window.showInformationMessage('🗑️ PikaKit: All lessons cleared');
    }
}

/**
 * Extension deactivation
 */
export function deactivate() {
    if (diagnosticListener) {
        diagnosticListener.stop();
    }
    disposeAutoAccept();
    disposeAutoRun();
    console.log('PikaKit Skill Generator deactivated');
}
