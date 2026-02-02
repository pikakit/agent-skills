/**
 * StatusBarManager - VS Code Status Bar UI
 * 
 * Manages status bar item to show learning status and lesson count.
 * 
 * @author PikaKit
 * @version 1.0.0
 */

import * as vscode from 'vscode';

export class StatusBarManager implements vscode.Disposable {
    private statusBarItem: vscode.StatusBarItem;
    private isLearning: boolean = false;
    private lessonCount: number = 0;

    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );
        this.statusBarItem.command = 'pikakit.viewLessons';
        this.updateDisplay();
        this.statusBarItem.show();
    }

    /**
     * Set learning state
     */
    setLearning(learning: boolean): void {
        this.isLearning = learning;
        this.updateDisplay();
    }

    /**
     * Update lesson count
     */
    updateCount(count: number): void {
        this.lessonCount = count;
        this.updateDisplay();
    }

    /**
     * Update status bar display
     */
    private updateDisplay(): void {
        if (this.isLearning) {
            this.statusBarItem.text = `$(book) PikaKit: Learning (${this.lessonCount})`;
            this.statusBarItem.tooltip = `PikaKit Skill Generator - Learning\n${this.lessonCount} lessons learned\nClick to view lessons`;
            this.statusBarItem.backgroundColor = undefined;
        } else {
            this.statusBarItem.text = `$(book) PikaKit: Paused (${this.lessonCount})`;
            this.statusBarItem.tooltip = `PikaKit Skill Generator - Paused\n${this.lessonCount} lessons learned\nClick to view lessons`;
            this.statusBarItem.backgroundColor = new vscode.ThemeColor(
                'statusBarItem.warningBackground'
            );
        }
    }

    /**
     * Show temporary notification on status bar
     */
    showNotification(message: string, duration: number = 3000): void {
        const originalText = this.statusBarItem.text;
        this.statusBarItem.text = `$(check) ${message}`;

        setTimeout(() => {
            this.statusBarItem.text = originalText;
        }, duration);
    }

    /**
     * Dispose resources
     */
    dispose(): void {
        this.statusBarItem.dispose();
    }
}
