/**
 * LearningService - Application Service
 * 
 * Orchestrates learning workflow:
 * - Load raw data (mistakes, improvements)
 * - Synthesize cognitive lessons
 * - Manage lesson CRUD operations
 */

import { LessonSynthesizer } from '../core/learning/lesson-synthesizer.js';

export class LearningService {
    constructor(lessonRepository) {
        this.lessonRepository = lessonRepository;
    }

    /**
     * Get all cognitive lessons
     * @returns {Promise<Array>}
     */
    async getCognitiveLessons() {
        const mistakesDb = await this.lessonRepository.loadMistakes();
        const improvementsDb = await this.lessonRepository.loadImprovements();

        return LessonSynthesizer.synthesize(
            mistakesDb.mistakes || [],
            improvementsDb.improvements || []
        );
    }

    /**
     * Add a lesson to legacy format
     * @param {string} pattern - Regex pattern
     * @param {string} message - Explanation message
     * @param {string} severity - WARNING or ERROR
     * @param {string} category - Category tag
     * @returns {Promise<object>}
     */
    async addLesson(pattern, message, severity = 'WARNING', category = 'general') {
        // Validate Regex
        try {
            new RegExp(pattern);
        } catch (e) {
            throw new Error(`Invalid Regex pattern: ${e.message}`);
        }

        // Validate severity
        if (!['WARNING', 'ERROR'].includes(severity.toUpperCase())) {
            throw new Error('Invalid severity. Must be WARNING or ERROR');
        }

        // Check for duplicates
        const db = await this.lessonRepository.loadLegacyLessons();
        const exists = db.lessons.some(l => l.pattern === pattern);

        if (exists) {
            throw new Error('Pattern already exists in knowledge base');
        }

        const id = `LEARN-${String(db.lessons.length + 1).padStart(3, '0')}`;

        const lesson = {
            id,
            pattern,
            message,
            severity: severity.toUpperCase(),
            category,
            source: 'manual',
            hitCount: 0,
            lastHit: null,
            autoEscalated: false,
            addedAt: new Date().toISOString()
        };

        return this.lessonRepository.addLegacyLesson(lesson);
    }

    /**
     * Remove a lesson
     * @param {string} lessonId
     */
    async removeLesson(lessonId) {
        return this.lessonRepository.removeLegacyLesson(lessonId);
    }

    /**
     * List all lessons
     * @param {string} category - Optional category filter
     */
    async listLessons(category = null) {
        const db = await this.lessonRepository.loadLegacyLessons();

        if (category) {
            return db.lessons.filter(l => l.category === category);
        }

        return db.lessons;
    }
}
