/**
 * JsonStorage - Storage Adapter
 * 
 * JSON file storage implementation.
 */

import fs from 'fs';
import path from 'path';

export class JsonStorage {
    constructor(basePath) {
        this.basePath = basePath;
    }

    /**
     * Read JSON file
     * @param {string} key - File identifier
     * @returns {Promise<object>}
     */
    async read(key) {
        const filePath = path.join(this.basePath, `${key}.json`);

        if (!fs.existsSync(filePath)) {
            return null;
        }

        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
    }

    /**
     * Write JSON file
     * @param {string} key - File identifier
     * @param {object} data - Data to write
     */
    async write(key, data) {
        fs.mkdirSync(this.basePath, { recursive: true });

        const filePath = path.join(this.basePath, `${key}.json`);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    }

    /**
     * Delete JSON file
     * @param {string} key - File identifier
     */
    async delete(key) {
        const filePath = path.join(this.basePath, `${key}.json`);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    /**
     * Check if file exists
     * @param {string} key - File identifier
     * @returns {Promise<boolean>}
     */
    async exists(key) {
        const filePath = path.join(this.basePath, `${key}.json`);
        return fs.existsSync(filePath);
    }
}
