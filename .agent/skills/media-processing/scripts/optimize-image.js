#!/usr/bin/env node
/**
 * Image Optimizer Script
 * Resize and optimize images using ImageMagick
 * 
 * Usage:
 *   node optimize-image.js --input image.jpg --output optimized.jpg --width 800 --quality 85
 */

const { execSync } = require('child_process');
const path = require('path');

// Parse arguments
const args = process.argv.slice(2);
const getArg = (name) => {
    const idx = args.indexOf(`--${name}`);
    return idx !== -1 ? args[idx + 1] : null;
};

const input = getArg('input');
const output = getArg('output');
const width = getArg('width') || '800';
const quality = getArg('quality') || '85';

// Help
if (args.includes('--help') || !input) {
    console.log(`
Image Optimizer - Resize and compress images

Usage:
  node optimize-image.js --input <file> [options]

Options:
  --input     Input image file (required)
  --output    Output file (default: input_optimized.ext)
  --width     Max width in pixels (default: 800)
  --quality   JPEG quality 1-100 (default: 85)
  --help      Show this help

Examples:
  node optimize-image.js --input photo.jpg --width 1200
  node optimize-image.js --input photo.png --output thumb.png --width 400
`);
    process.exit(0);
}

// Check ImageMagick
try {
    execSync('magick -version', { stdio: 'ignore' });
} catch {
    console.error('❌ ImageMagick not found. Install with: brew install imagemagick');
    process.exit(1);
}

// Default output name
const ext = path.extname(input);
const base = path.basename(input, ext);
const outputFile = output || `${base}_optimized${ext}`;

// Build command
const cmd = `magick "${input}" -resize ${width}x -quality ${quality} -strip "${outputFile}"`;

console.log(`🔄 Optimizing: ${input}`);
console.log(`   Width: ${width}px, Quality: ${quality}%`);

try {
    execSync(cmd);
    console.log(`✅ Saved: ${outputFile}`);
} catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
}
