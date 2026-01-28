/**
 * Windows-safe icons utility
 * 
 * Provides ASCII fallback for emojis/Unicode when running on Windows Console
 * that doesn't support UTF-8 properly.
 */

// Check if we're in a Windows environment with potential encoding issues
const isWindowsConsole = process.platform === 'win32' && 
    (!process.env.WT_SESSION && !process.env.TERM_PROGRAM);

// Icon mappings: [unicode, ascii fallback]
const ICONS = {
    brain: ['🧠', '[*]'],
    check: ['✓', '[v]'],
    cross: ['✗', '[x]'],
    warning: ['⚠️', '[!]'],
    info: ['ℹ️', '[i]'],
    arrow: ['›', '>'],
    star: ['⭐', '*'],
    rocket: ['🚀', '>>'],
    fire: ['🔥', '!!'],
    party: ['🎉', ':)'],
    magnify: ['🔍', '?'],
    folder: ['📁', '[]'],
    file: ['📄', '-'],
    gear: ['⚙️', '@'],
    lock: ['🔒', '#'],
    key: ['🔑', '#'],
    bulb: ['💡', '!'],
    clock: ['⏰', 'T'],
    success: ['✅', '[OK]'],
    error: ['❌', '[ERR]'],
    sparkle: ['✨', '*'],
    chart: ['📊', '[=]'],
    note: ['📝', '-'],
    book: ['📚', '[]'],
    package: ['📦', '[]'],
    tools: ['🛠️', '[]'],
    shield: ['🛡️', 'S'],
    target: ['🎯', 'o'],
    refresh: ['🔄', '@'],
    lightning: ['⚡', '!'],
};

/**
 * Get appropriate icon for current environment
 * @param {string} name - Icon name from ICONS map
 * @returns {string} Unicode icon or ASCII fallback
 */
export function icon(name) {
    const pair = ICONS[name];
    if (!pair) return '';
    return isWindowsConsole ? pair[1] : pair[0];
}

/**
 * Replace all emojis in text with ASCII equivalents
 * @param {string} text - Text containing emojis
 * @returns {string} Text with ASCII replacements on Windows
 */
export function safeText(text) {
    if (!isWindowsConsole) return text;
    
    let result = text;
    for (const [name, [unicode, ascii]] of Object.entries(ICONS)) {
        result = result.replace(new RegExp(unicode, 'g'), ascii);
    }
    return result;
}

/**
 * Check if Unicode output is safe
 * @returns {boolean}
 */
export function supportsUnicode() {
    return !isWindowsConsole;
}

// Quick accessor for common icons
export const icons = {
    get brain() { return icon('brain'); },
    get check() { return icon('check'); },
    get cross() { return icon('cross'); },
    get warning() { return icon('warning'); },
    get arrow() { return icon('arrow'); },
    get party() { return icon('party'); },
    get success() { return icon('success'); },
    get error() { return icon('error'); },
    get sparkle() { return icon('sparkle'); },
};

export default { icon, safeText, supportsUnicode, icons, ICONS };
