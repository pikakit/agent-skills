/**
 * Data Layer
 * 
 * Data access layer with repositories and storage adapters.
 * Implements persistence interfaces defined in core.
 * 
 * Exported:
 * - Repositories: LessonRepository, SignalRepository, SettingsRepository
 * - Storage: FileStorage, YamlStorage, JsonStorage
 */

export * from './repositories/index.js';
export * from './storage/index.js';
