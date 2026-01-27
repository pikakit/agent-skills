/**
 * ExportService - Application Service
 * 
 * Orchestrates skill export workflow:
 * - Load cognitive lessons
 * - Filter by maturity
 * - Format as Gemini skills
 * - Write to .agent/skills/
 */

import fs from 'fs';
import path from 'path';

export class ExportService {
    constructor(learningService, skillFormatter) {
        this.learningService = learningService;
        this.skillFormatter = skillFormatter;
    }

    /**
     * Export all mature skills to Gemini format
     * @param {string} outputDir - Output directory (default: .agent/skills)
     * @param {number} minConfidence - Minimum confidence threshold (default: 0.8)
     * @returns {Promise<Array>} Exported skills
     */
    async exportMatureSkills(outputDir = '.agent/skills', minConfidence = 0.8) {
        // 1. Get all cognitive lessons
        const lessons = await this.learningService.getCognitiveLessons();

        // 2. Filter mature lessons
        const mature = this.filterMature(lessons, minConfidence);

        // 3. Format as skills
        const skills = mature.map(lesson =>
            this.skillFormatter.format(lesson)
        );

        // 4. Write to output directory
        const exported = await this.writeSkills(skills, outputDir);

        return exported;
    }

    /**
     * Export a specific lesson by ID
     * @param {string} lessonId - Lesson ID (e.g., LESSON-008)
     * @param {string} outputDir - Output directory
     * @returns {Promise<object>} Exported skill
     */
    async exportLesson(lessonId, outputDir = '.agent/skills') {
        // 1. Get all lessons
        const lessons = await this.learningService.getCognitiveLessons();

        // 2. Find specific lesson
        const lesson = lessons.find(l => l.id === lessonId);

        if (!lesson) {
            throw new Error(`Lesson not found: ${lessonId}`);
        }

        // 3. Format as skill
        const skill = this.skillFormatter.format(lesson);

        // 4. Write to output
        await this.writeSkill(skill, outputDir);

        return skill;
    }

    /**
     * Preview mature skills without writing
     * @param {number} minConfidence - Minimum confidence threshold
     * @returns {Promise<Array>} Skills preview
     */
    async previewMatureSkills(minConfidence = 0.8) {
        const lessons = await this.learningService.getCognitiveLessons();
        const mature = this.filterMature(lessons, minConfidence);

        return mature.map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            state: lesson.maturity.state,
            confidence: lesson.maturity.confidence,
            coverage: lesson.maturity.coverage,
            filename: `learned-${this.skillFormatter.sanitizeName(lesson.tag)}.md`
        }));
    }

    /**
     * Filter mature lessons
     * @param {Array} lessons - All cognitive lessons
     * @param {number} minConfidence - Minimum confidence
     * @returns {Array} Filtered lessons
     */
    filterMature(lessons, minConfidence) {
        return lessons.filter(lesson => {
            const isMature = lesson.maturity.state === 'MATURE' || lesson.maturity.state === 'IDEAL';
            const isConfident = lesson.maturity.confidence >= minConfidence;
            return isMature && isConfident;
        });
    }

    /**
     * Write multiple skills to directory
     * @param {Array} skills - Formatted skills
     * @param {string} outputDir - Output directory
     * @returns {Promise<Array>} Written skills with paths
     */
    async writeSkills(skills, outputDir) {
        // Ensure directory exists
        fs.mkdirSync(outputDir, { recursive: true });

        const written = [];

        for (const skill of skills) {
            const filePath = path.join(outputDir, skill.filename);
            fs.writeFileSync(filePath, skill.content, 'utf8');

            written.push({
                ...skill,
                path: filePath
            });
        }

        return written;
    }

    /**
     * Write a single skill to directory
     * @param {object} skill - Formatted skill
     * @param {string} outputDir - Output directory
     */
    async writeSkill(skill, outputDir) {
        fs.mkdirSync(outputDir, { recursive: true });

        const filePath = path.join(outputDir, skill.filename);
        fs.writeFileSync(filePath, skill.content, 'utf8');

        return {
            ...skill,
            path: filePath
        };
    }

    /**
     * Get export statistics
     * @returns {Promise<object>} Export stats
     */
    async getExportStats() {
        const lessons = await this.learningService.getCognitiveLessons();
        const mature = this.filterMature(lessons, 0.8);

        return {
            total: lessons.length,
            mature: mature.length,
            learning: lessons.filter(l => l.maturity.state === 'LEARNING').length,
            raw: lessons.filter(l => l.maturity.state === 'RAW').length,
            ideal: lessons.filter(l => l.maturity.state === 'IDEAL').length,
            exportable: mature.length
        };
    }
}
