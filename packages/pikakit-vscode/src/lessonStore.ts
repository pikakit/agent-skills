/**
 * LessonStore - Persistent Lesson Storage
 * 
 * Manages CRUD operations for lessons stored in .agent/lessons.json.
 * Provides methods for finding similar lessons and grouping by category.
 * 
 * @author PikaKit
 * @version 1.0.0
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Lesson structure
 */
export interface Lesson {
    id: string;
    category: string;
    pattern: string;
    context: string;
    solution: string;
    occurrences: number;
    lastSeen: string;
    source: string;
    autoDetected: boolean;
    usedForSkill?: boolean;
}

/**
 * Lessons file structure
 */
interface LessonsFile {
    version: string;
    lastUpdated: string;
    lessons: Lesson[];
    stats: {
        totalLearned: number;
        skillsGenerated: number;
    };
}

export class LessonStore {
    private filePath: string;
    private lessons: LessonsFile;
    private nextId: number = 1;

    constructor(workspaceRoot: string) {
        this.filePath = path.join(workspaceRoot, '.agent', 'lessons.json');
        this.lessons = this.load();
    }

    /**
     * Load lessons from file
     */
    private load(): LessonsFile {
        try {
            if (fs.existsSync(this.filePath)) {
                const content = fs.readFileSync(this.filePath, 'utf8');
                const data = JSON.parse(content) as LessonsFile;

                // Calculate next ID
                if (data.lessons.length > 0) {
                    const maxId = Math.max(...data.lessons.map(l => {
                        const num = parseInt(l.id.split('-')[1], 10);
                        return isNaN(num) ? 0 : num;
                    }));
                    this.nextId = maxId + 1;
                }

                return data;
            }
        } catch (error) {
            console.error('LessonStore: Failed to load lessons', error);
        }

        // Return default structure
        return {
            version: '1.0',
            lastUpdated: new Date().toISOString(),
            lessons: [],
            stats: {
                totalLearned: 0,
                skillsGenerated: 0
            }
        };
    }

    /**
     * Save lessons to file
     */
    private save(): void {
        try {
            // Ensure directory exists
            const dir = path.dirname(this.filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            this.lessons.lastUpdated = new Date().toISOString();
            fs.writeFileSync(this.filePath, JSON.stringify(this.lessons, null, 2), 'utf8');
        } catch (error) {
            console.error('LessonStore: Failed to save lessons', error);
        }
    }

    /**
     * Get next available ID number
     */
    getNextId(): number {
        return this.nextId++;
    }

    /**
     * Add a new lesson
     */
    addLesson(lesson: Lesson): void {
        this.lessons.lessons.push(lesson);
        this.lessons.stats.totalLearned++;
        this.save();
    }

    /**
     * Get all lessons
     */
    getAllLessons(): Lesson[] {
        return this.lessons.lessons;
    }

    /**
     * Get lesson by ID
     */
    getLesson(id: string): Lesson | undefined {
        return this.lessons.lessons.find(l => l.id === id);
    }

    /**
     * Find similar lesson based on pattern
     */
    findSimilar(pattern: string, threshold: number = 0.7): Lesson | undefined {
        for (const lesson of this.lessons.lessons) {
            if (lesson.usedForSkill) {
                continue; // Skip lessons already used for skill
            }

            const similarity = this.calculateSimilarity(lesson.pattern, pattern);
            if (similarity >= threshold) {
                return lesson;
            }
        }
        return undefined;
    }

    /**
     * Calculate similarity between two patterns
     */
    private calculateSimilarity(pattern1: string, pattern2: string): number {
        const words1 = new Set(pattern1.toLowerCase().split(/\s+/));
        const words2 = new Set(pattern2.toLowerCase().split(/\s+/));

        const intersection = new Set([...words1].filter(x => words2.has(x)));
        const union = new Set([...words1, ...words2]);

        return union.size > 0 ? intersection.size / union.size : 0;
    }

    /**
     * Increment occurrence count for a lesson
     */
    incrementOccurrence(id: string): void {
        const lesson = this.getLesson(id);
        if (lesson) {
            lesson.occurrences++;
            lesson.lastSeen = new Date().toISOString().split('T')[0];
            this.save();
        }
    }

    /**
     * Mark lesson as used for skill generation
     */
    markAsUsed(id: string): void {
        const lesson = this.getLesson(id);
        if (lesson) {
            lesson.usedForSkill = true;
            this.save();
        }
    }

    /**
     * Get lessons by category
     */
    getLessonsByCategory(category: string): Lesson[] {
        return this.lessons.lessons.filter(l =>
            l.category === category && !l.usedForSkill
        );
    }

    /**
     * Get lessons grouped by category
     */
    getGroupedLessons(): Record<string, Lesson[]> {
        const grouped: Record<string, Lesson[]> = {};

        for (const lesson of this.lessons.lessons) {
            if (lesson.usedForSkill) {
                continue;
            }

            if (!grouped[lesson.category]) {
                grouped[lesson.category] = [];
            }
            grouped[lesson.category].push(lesson);
        }

        return grouped;
    }

    /**
     * Clear all lessons
     */
    clear(): void {
        this.lessons.lessons = [];
        this.lessons.stats.totalLearned = 0;
        this.nextId = 1;
        this.save();
    }

    /**
     * Increment skills generated count
     */
    incrementSkillsGenerated(): void {
        this.lessons.stats.skillsGenerated++;
        this.save();
    }

    /**
     * Get statistics
     */
    getStats(): { totalLearned: number; skillsGenerated: number } {
        return this.lessons.stats;
    }
}
