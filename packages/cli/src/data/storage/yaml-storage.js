/**
 * YamlStorage - Storage Adapter for YAML Files
 * 
 * Handles YAML file read/write operations.
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export class YamlStorage {
    constructor(basePath) {
        this.basePath = basePath;
    }

    /**
     * Read YAML file
     * @param {string} key - File identifier
     * @returns {Promise<object>}
     */
    async read(key) {
        const filePath = path.join(this.basePath, `${key}.yaml`);

        if (!fs.existsSync(filePath)) {
            return null;
        }

        const content = fs.readFileSync(filePath, 'utf8');
        return yaml.load(content);
    }

    /**
     * Write YAML file
     * @param {string} key - File identifier
     * @param {object} data - Data to write
     */
    async write(key, data) {
        fs.mkdirSync(this.basePath, { recursive: true });

        const filePath = path.join(this.basePath, `${key}.yaml`);
        const yamlStr = yaml.dump(data, { lineWidth: -1, quotingType: '"' });
        fs.writeFileSync(filePath, yamlStr, 'utf8');
    }

    /**
     * Delete YAML file
     * @param {string} key - File identifier
     */
    async delete(key) {
        const filePath = path.join(this.basePath, `${key}.yaml`);

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
        const filePath = path.join(this.basePath, `${key}.yaml`);
        return fs.existsSync(filePath);
    }
}
