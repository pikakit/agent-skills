/**
 * DiagnosticListener - Real-time IDE Error Listener
 * 
 * Listens to VS Code diagnostics (TypeScript, ESLint, etc.) and processes
 * errors in real-time for pattern learning.
 * 
 * @author PikaKit
 * @version 1.0.0
 */

import * as vscode from 'vscode';
import { PatternAnalyzer, DiagnosticInfo } from './patternAnalyzer';
import { LessonStore, Lesson } from './lessonStore';
import { SkillGenerator } from './skillGenerator';
import { StatusBarManager } from './statusBar';

export class DiagnosticListener {
    private disposable: vscode.Disposable | null = null;
    private patternAnalyzer: PatternAnalyzer;
    private getLessonStore: (filePath: string) => LessonStore;
    private getSkillGenerator: (filePath: string) => SkillGenerator;
    private statusBar: StatusBarManager;
    private processedErrors: Set<string> = new Set();
    private debounceTimer: NodeJS.Timeout | null = null;

    constructor(
        patternAnalyzer: PatternAnalyzer,
        getLessonStore: (filePath: string) => LessonStore,
        getSkillGenerator: (filePath: string) => SkillGenerator,
        statusBar: StatusBarManager
    ) {
        this.patternAnalyzer = patternAnalyzer;
        this.getLessonStore = getLessonStore;
        this.getSkillGenerator = getSkillGenerator;
        this.statusBar = statusBar;
    }

    /**
     * Start listening to diagnostic changes
     */
    start(): void {
        if (this.disposable) {
            return; // Already listening
        }

        this.disposable = vscode.languages.onDidChangeDiagnostics((e) => {
            this.handleDiagnosticsChange(e);
        });

        console.log('DiagnosticListener: Started listening');
    }

    /**
     * Stop listening
     */
    stop(): void {
        if (this.disposable) {
            this.disposable.dispose();
            this.disposable = null;
        }

        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = null;
        }

        console.log('DiagnosticListener: Stopped listening');
    }

    /**
     * Handle diagnostic changes with debouncing
     */
    private handleDiagnosticsChange(e: vscode.DiagnosticChangeEvent): void {
        // Debounce to avoid processing too frequently
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        this.debounceTimer = setTimeout(() => {
            this.processDiagnostics(e.uris);
        }, 500); // 500ms debounce
    }

    /**
     * Process diagnostics from changed URIs
     */
    private async processDiagnostics(uris: readonly vscode.Uri[]): Promise<void> {
        for (const uri of uris) {
            const diagnostics = vscode.languages.getDiagnostics(uri);

            // Filter to errors only (not warnings/hints)
            const errors = diagnostics.filter(d =>
                d.severity === vscode.DiagnosticSeverity.Error
            );

            for (const error of errors) {
                await this.processError(uri, error);
            }
        }
    }

    /**
     * Process a single error diagnostic
     */
    private async processError(uri: vscode.Uri, diagnostic: vscode.Diagnostic): Promise<void> {
        // Create unique ID for this error to avoid duplicates
        const errorId = this.createErrorId(uri, diagnostic);

        if (this.processedErrors.has(errorId)) {
            return; // Already processed
        }

        // Get workspace-specific stores for this file
        const filePath = uri.fsPath;
        const lessonStore = this.getLessonStore(filePath);
        const skillGenerator = this.getSkillGenerator(filePath);

        // Extract diagnostic info
        const info: DiagnosticInfo = {
            message: diagnostic.message,
            source: diagnostic.source || 'unknown',
            code: this.getErrorCode(diagnostic),
            severity: 'error',
            file: filePath,
            line: diagnostic.range.start.line + 1,
            column: diagnostic.range.start.character + 1
        };

        // Analyze and categorize the error
        const analysis = this.patternAnalyzer.analyze(info);

        if (!analysis.isLearnable) {
            return; // Not a pattern we can learn from
        }

        // Check if similar lesson already exists
        const existingLesson = lessonStore.findSimilar(analysis.pattern);

        if (existingLesson) {
            // Increment occurrence count
            lessonStore.incrementOccurrence(existingLesson.id);
            this.statusBar.updateCount(lessonStore.getAllLessons().length);

            // Check if threshold reached for skill generation
            const config = vscode.workspace.getConfiguration('pikakit');
            const threshold = config.get<number>('threshold', 3);

            if (existingLesson.occurrences + 1 >= threshold) {
                await this.tryGenerateSkill(filePath, existingLesson.category, analysis.pattern);
            }
        } else {
            // Create new lesson
            const lesson: Lesson = {
                id: this.generateLessonId(analysis.category, lessonStore),
                category: analysis.category,
                pattern: analysis.pattern,
                context: analysis.context,
                solution: analysis.suggestedFix,
                occurrences: 1,
                lastSeen: new Date().toISOString().split('T')[0],
                source: info.source,
                autoDetected: true
            };

            lessonStore.addLesson(lesson);
            this.statusBar.updateCount(lessonStore.getAllLessons().length);

            // Show notification
            vscode.window.showInformationMessage(
                `📚 Auto-learned: [${lesson.id}] - ${analysis.pattern.substring(0, 50)}...`
            );
        }

        // Mark as processed (clear after 10 seconds to allow re-learning if error persists)
        this.processedErrors.add(errorId);
        setTimeout(() => {
            this.processedErrors.delete(errorId);
        }, 10000);
    }

    /**
     * Try to generate skill when threshold reached
     */
    private async tryGenerateSkill(filePath: string, category: string, pattern: string): Promise<void> {
        const lessonStore = this.getLessonStore(filePath);
        const skillGenerator = this.getSkillGenerator(filePath);
        const lessons = lessonStore.getLessonsByCategory(category);

        if (lessons.length >= 3) {
            const skillName = this.patternAnalyzer.suggestSkillName(category, lessons);

            const result = await vscode.window.showInformationMessage(
                `🎯 Pattern detected: ${lessons.length} similar ${category} errors. Generate skill "${skillName}"?`,
                'Generate',
                'Later'
            );

            if (result === 'Generate') {
                const success = await skillGenerator.generateSkill(skillName, lessons);
                if (success) {
                    vscode.window.showInformationMessage(`✅ Generated skill: ${skillName}`);
                    // Mark lessons as used
                    for (const lesson of lessons) {
                        lessonStore.markAsUsed(lesson.id);
                    }
                }
            }
        }
    }

    /**
     * Create unique error ID
     */
    private createErrorId(uri: vscode.Uri, diagnostic: vscode.Diagnostic): string {
        return `${uri.fsPath}:${diagnostic.range.start.line}:${diagnostic.message.substring(0, 50)}`;
    }

    /**
     * Get error code from diagnostic
     */
    private getErrorCode(diagnostic: vscode.Diagnostic): string {
        if (typeof diagnostic.code === 'object' && diagnostic.code !== null) {
            return String(diagnostic.code.value);
        }
        return String(diagnostic.code || 'unknown');
    }

    /**
     * Generate lesson ID
     */
    private generateLessonId(category: string, lessonStore: LessonStore): string {
        const prefix = category.toUpperCase().substring(0, 4);
        const num = String(lessonStore.getNextId()).padStart(3, '0');
        return `${prefix}-${num}`;
    }

    /**
     * Dispose resources
     */
    dispose(): void {
        this.stop();
    }
}
