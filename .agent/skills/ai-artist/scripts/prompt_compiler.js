#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Basic CLI argument parser: --key "value"
function parseArgs(args) {
    const parsed = {};
    for (let i = 0; i < args.length; i++) {
        if (args[i].startsWith('--')) {
            const key = args[i].substring(2).toLowerCase();
            parsed[key] = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : '';
        }
    }
    return parsed;
}

// Replaces [token] with corresponding param value. Preserves structure.
function compileTemplate(templateStr, params) {
    let result = templateStr.replace(/\[([^\]]+)\]/g, (match, key) => {
        const paramKey = key.toLowerCase();
        return params[paramKey] ? params[paramKey] : '';
    });
    
    // Clean up empty lines and trailing commas caused by empty parameters
    result = result.replace(/,\s*,/g, ',')
                   .replace(/,\s*$/g, '')
                   .replace(/^\s*,\s*/g, '')
                   .replace(/\n\s*\n/g, '\n')
                   .trim();
    return result;
}

function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    const params = parseArgs(args.slice(1));
    
    if (!command || !['build-image', 'build-llm'].includes(command)) {
        console.error(JSON.stringify({
            status: 'error',
            error: { code: 'ERR_INVALID_DOMAIN', message: 'Command must be build-image or build-llm' }
        }));
        process.exit(1);
    }

    const templateName = command === 'build-image' ? 'image-core.txt' : 'llm-core.txt';
    const templatePath = path.join(__dirname, '..', 'templates', templateName);

    if (!fs.existsSync(templatePath)) {
        console.error(JSON.stringify({
            status: 'error',
            error: { code: 'ERR_TEMPLATE_NOT_FOUND', message: `Missing template file: ${templatePath}` }
        }));
        process.exit(1);
    }

    const templateStr = fs.readFileSync(templatePath, 'utf8');
    const promptValue = compileTemplate(templateStr, params);
    
    // Emit pure JSON for agent inter-process communication
    console.log(JSON.stringify({
        status: 'success',
        data: {
            command: command,
            prompt: promptValue,
            length: promptValue.length
        }
    }, null, 2));
}

main();
