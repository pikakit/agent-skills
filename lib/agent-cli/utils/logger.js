/**
 * Logger Utility - Configurable logging with levels and file output
 * 
 * Part of FAANG-Grade Auto-Learn System
 * 
 * Features:
 * - 4 log levels: DEBUG, INFO, WARN, ERROR
 * - Console output (default)
 * - File output (optional)
 * - Timestamps
 * - Lazy evaluation for debug messages
 * 
 * Usage:
 *   import { logger, setLogLevel, enableFileLogging } from './logger.js';
 *   logger.debug('Debug message', { data });
 *   logger.info('Info message');
 *   logger.warn('Warning message');
 *   logger.error('Error message', error);
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==================== LOG LEVELS ====================

const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    SILENT: 4
};

// ==================== COLORS ====================

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m',
    bold: '\x1b[1m'
};

const levelColors = {
    DEBUG: colors.gray,
    INFO: colors.cyan,
    WARN: colors.yellow,
    ERROR: colors.red
};

const levelIcons = {
    DEBUG: '🔍',
    INFO: 'ℹ️',
    WARN: '⚠️',
    ERROR: '❌'
};

// ==================== STATE ====================

let currentLevel = LOG_LEVELS.INFO;
let fileLoggingEnabled = false;
let logFilePath = null;

// ==================== CONFIGURATION ====================

/**
 * Set the minimum log level
 * @param {keyof typeof LOG_LEVELS} level - 'DEBUG', 'INFO', 'WARN', 'ERROR', or 'SILENT'
 */
function setLogLevel(level) {
    if (LOG_LEVELS[level] !== undefined) {
        currentLevel = LOG_LEVELS[level];
    }
}

/**
 * Enable file logging
 * @param {string} filePath - Path to log file
 */
function enableFileLogging(filePath) {
    fileLoggingEnabled = true;
    logFilePath = filePath;

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

/**
 * Disable file logging
 */
function disableFileLogging() {
    fileLoggingEnabled = false;
    logFilePath = null;
}

// ==================== FORMATTING ====================

/**
 * Format log message with timestamp
 */
function formatMessage(level, message, data) {
    const timestamp = new Date().toISOString();
    const icon = levelIcons[level];
    const color = levelColors[level];

    let formatted = `${color}${icon} [${timestamp.split('T')[1].split('.')[0]}] [${level}]${colors.reset} ${message}`;

    if (data !== undefined) {
        if (typeof data === 'object') {
            formatted += ` ${colors.gray}${JSON.stringify(data)}${colors.reset}`;
        } else {
            formatted += ` ${colors.gray}${data}${colors.reset}`;
        }
    }

    return formatted;
}

/**
 * Format for file (no colors)
 */
function formatForFile(level, message, data) {
    const timestamp = new Date().toISOString();
    let formatted = `[${timestamp}] [${level}] ${message}`;

    if (data !== undefined) {
        if (typeof data === 'object') {
            formatted += ` ${JSON.stringify(data)}`;
        } else {
            formatted += ` ${data}`;
        }
    }

    return formatted;
}

// ==================== WRITE FUNCTIONS ====================

/**
 * Write to console
 */
function writeToConsole(level, formatted) {
    if (level === 'ERROR') {
        console.error(formatted);
    } else if (level === 'WARN') {
        console.warn(formatted);
    } else {
        console.log(formatted);
    }
}

/**
 * Write to file (async)
 */
function writeToFile(formatted) {
    if (fileLoggingEnabled && logFilePath) {
        try {
            fs.appendFileSync(logFilePath, formatted + '\n');
        } catch (err) {
            // Silently fail file logging
        }
    }
}

// ==================== LOG FUNCTIONS ====================

/**
 * Log at specified level
 */
function log(level, message, data) {
    if (LOG_LEVELS[level] < currentLevel) {
        return;
    }

    // Console output
    const formatted = formatMessage(level, message, data);
    writeToConsole(level, formatted);

    // File output
    if (fileLoggingEnabled) {
        const fileFormatted = formatForFile(level, message, data);
        writeToFile(fileFormatted);
    }
}

/**
 * Debug log (lowest priority)
 * @param {string} message - Log message
 * @param {any} [data] - Optional data to log
 */
function debug(message, data) {
    log('DEBUG', message, data);
}

/**
 * Info log
 * @param {string} message - Log message
 * @param {any} [data] - Optional data to log
 */
function info(message, data) {
    log('INFO', message, data);
}

/**
 * Warning log
 * @param {string} message - Log message
 * @param {any} [data] - Optional data to log
 */
function warn(message, data) {
    log('WARN', message, data);
}

/**
 * Error log (highest priority)
 * @param {string} message - Log message
 * @param {any} [data] - Optional error or data
 */
function error(message, data) {
    log('ERROR', message, data);
}

// ==================== SPECIALIZED LOGGERS ====================

/**
 * Create a logger with fixed prefix
 * @param {string} prefix - Prefix for all log messages
 */
function createLogger(prefix) {
    return {
        debug: (msg, data) => debug(`[${prefix}] ${msg}`, data),
        info: (msg, data) => info(`[${prefix}] ${msg}`, data),
        warn: (msg, data) => warn(`[${prefix}] ${msg}`, data),
        error: (msg, data) => error(`[${prefix}] ${msg}`, data)
    };
}

/**
 * Log timing for operations
 * @param {string} label - Operation label
 */
function time(label) {
    const start = Date.now();
    return {
        end: () => {
            const duration = Date.now() - start;
            debug(`${label} completed`, { duration: `${duration}ms` });
            return duration;
        }
    };
}

// ==================== LOGGER OBJECT ====================

const logger = {
    debug,
    info,
    warn,
    error,
    time,
    createLogger,
    setLevel: setLogLevel,
    enableFile: enableFileLogging,
    disableFile: disableFileLogging,
    LOG_LEVELS
};

// ==================== CLI SUPPORT ====================

// Check for environment variable
if (process.env.LOG_LEVEL) {
    setLogLevel(process.env.LOG_LEVEL.toUpperCase());
}

// Check for LOG_FILE environment variable
if (process.env.LOG_FILE) {
    enableFileLogging(process.env.LOG_FILE);
}

export {
    logger,
    debug,
    info,
    warn,
    error,
    setLogLevel,
    enableFileLogging,
    disableFileLogging,
    createLogger,
    time,
    LOG_LEVELS
};

export default logger;
