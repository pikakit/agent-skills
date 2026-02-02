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
    private notificationTimer: NodeJS.Timeout | null = null;
    private pendingLessons: { id: string; pattern: string }[] = [];
    private skillGenerationTimer: NodeJS.Timeout | null = null;
    private pendingSkills: { filePath: string; category: string; skillName: string; count: number }[] = [];
    private promptedCategories: Set<string> = new Set(); // Prevent duplicate prompts

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
     * Schedule a batched notification after collecting multiple lessons
     */
    private scheduleBatchNotification(): void {
        // Clear existing timer if any
        if (this.notificationTimer) {
            clearTimeout(this.notificationTimer);
        }

        // Wait 2 seconds to collect all lessons, then show single notification
        this.notificationTimer = setTimeout(() => {
            if (this.pendingLessons.length === 0) return;

            const count = this.pendingLessons.length;

            if (count === 1) {
                // Single lesson - show detailed message
                const lesson = this.pendingLessons[0];
                vscode.window.showInformationMessage(
                    `📚 Auto-learned: [${lesson.id}] - ${lesson.pattern}...`
                );
            } else {
                // Multiple lessons - show summary
                const ids = this.pendingLessons.slice(0, 3).map(l => l.id).join(', ');
                const more = count > 3 ? ` +${count - 3} more` : '';
                vscode.window.showInformationMessage(
                    `📚 Auto-learned ${count} patterns: [${ids}]${more}`
                );
            }

            // Clear pending lessons
            this.pendingLessons = [];
            this.notificationTimer = null;
        }, 2000); // 2 second batch window
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

            // Add to pending lessons for batched notification
            this.pendingLessons.push({ id: lesson.id, pattern: analysis.pattern.substring(0, 30) });
            this.scheduleBatchNotification();
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
        // Prevent duplicate prompts for same category
        if (this.promptedCategories.has(category)) {
            return;
        }

        const lessonStore = this.getLessonStore(filePath);
        const lessons = lessonStore.getLessonsByCategory(category);

        if (lessons.length >= 3) {
            const skillName = this.patternAnalyzer.suggestSkillName(category, lessons);

            // Mark category as prompted
            this.promptedCategories.add(category);

            // Add to pending skills
            this.pendingSkills.push({
                filePath,
                category,
                skillName,
                count: lessons.length
            });

            // Schedule batched prompt
            this.scheduleSkillGenerationPrompt();
        }
    }

    /**
     * Schedule a single prompt for all pending skills
     */
    private scheduleSkillGenerationPrompt(): void {
        if (this.skillGenerationTimer) {
            clearTimeout(this.skillGenerationTimer);
        }

        // Wait 3 seconds to collect all skill candidates
        this.skillGenerationTimer = setTimeout(async () => {
            if (this.pendingSkills.length === 0) return;

            const skills = [...this.pendingSkills];
            this.pendingSkills = [];
            this.skillGenerationTimer = null;

            // Build consolidated message
            const skillList = skills.map(s => `${s.category} (${s.count})`).join(', ');
            const skillNames = skills.map(s => s.skillName).join('", "');

            const result = await vscode.window.showInformationMessage(
                `🎯 Patterns detected: ${skillList}. Generate skills "${skillNames}"?`,
                'Generate All',
                'Later'
            );

            if (result === 'Generate All') {
                for (const skill of skills) {
                    const lessonStore = this.getLessonStore(skill.filePath);
                    const skillGenerator = this.getSkillGenerator(skill.filePath);
                    const lessons = lessonStore.getLessonsByCategory(skill.category);

                    const success = await skillGenerator.generateSkill(skill.skillName, lessons);
                    if (success) {
                        for (const lesson of lessons) {
                            lessonStore.markAsUsed(lesson.id);
                        }
                    }
                }
                vscode.window.showInformationMessage(`✅ Generated ${skills.length} skills`);
            }

            // Clear prompted categories after prompt is handled
            this.promptedCategories.clear();
        }, 3000);
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
