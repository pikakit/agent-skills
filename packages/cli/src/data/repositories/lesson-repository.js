/**
 * LessonRepository - Data Access Layer
 * 
 * Manages persistence of mistakes and improvements.
 * Provides CRUD operations with YAML storage.
 */

export class LessonRepository {
    constructor(storage) {
        this.storage = storage;
    }

    /**
     * Load mistakes from storage
     * @returns {Promise<{version: number, mistakes: Array}>}
     */
    async loadMistakes() {
        try {
            const data = await this.storage.read('mistakes');
            return data || { version: 4.0, mistakes: [] };
        } catch (error) {
            console.error('Error loading mistakes:', error.message);
            return { version: 4.0, mistakes: [] };
        }
    }

    /**
     * Load improvements from storage
     * @returns {Promise<{version: number, improvements: Array}>}
     */
    async loadImprovements() {
        try {
            const data = await this.storage.read('improvements');
            return data || { version: 4.0, improvements: [] };
        } catch (error) {
            console.error('Error loading improvements:', error.message);
            return { version: 4.0, improvements: [] };
        }
    }

    /**
     * Save mistakes to storage
     * @param {object} data - {version, mistakes}
     */
    async saveMistakes(data) {
        await this.storage.write('mistakes', data);
    }

    /**
     * Save improvements to storage
     * @param {object} data - {version, improvements}
     */
    async saveImprovements(data) {
        await this.storage.write('improvements', data);
    }

    /**
     * Load legacy lessons.yaml (v1-v3 format)
     * @returns {Promise<{version: number, lessons: Array}>}
     */
    async loadLegacyLessons() {
        try {
            const data = await this.storage.read('lessons');
            if (!data) {
                // Initialize if doesn't exist
                const initial = { lessons: [], version: 1 };
                await this.storage.write('lessons', initial);
                return initial;
            }
            return data;
        } catch (error) {
            console.error('Error loading legacy lessons:', error.message);
            return { lessons: [], version: 1 };
        }
    }

    /**
     * Save legacy lessons.yaml
     * @param {object} data - {version, lessons}
     */
    async saveLegacyLessons(data) {
        await this.storage.write('lessons', data);
    }

    /**
     * Add a lesson to legacy format
     * @param {object} lesson - Lesson object
     */
    async addLegacyLesson(lesson) {
        const db = await this.loadLegacyLessons();
        db.lessons.push(lesson);
        await this.saveLegacyLessons(db);
        return lesson;
    }

    /**
     * Remove a lesson from legacy format
     * @param {string} lessonId
     */
    async removeLegacyLesson(lessonId) {
        const db = await this.loadLegacyLessons();
        const idx = db.lessons.findIndex(l => l.id === lessonId.toUpperCase());

        if (idx === -1) {
            throw new Error(`Lesson not found: ${lessonId}`);
        }

        const removed = db.lessons.splice(idx, 1)[0];
        await this.saveLegacyLessons(db);
        return removed;
    }

    /**
     * Find lesson by ID in legacy format
     * @param {string} lessonId
     */
    async findLegacyLessonById(lessonId) {
        const db = await this.loadLegacyLessons();
        return db.lessons.find(l => l.id === lessonId.toUpperCase());
    }

    /**
     * Find lessons by category in legacy format
     * @param {string} category
     */
    async findLegacyLessonsByCategory(category) {
        const db = await this.loadLegacyLessons();
        return db.lessons.filter(l => l.category === category);
    }
}
