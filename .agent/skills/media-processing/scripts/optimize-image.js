#!/usr/bin/env node
/**
 * Image Optimizer — ImageMagick CLI wrapper
 *
 * Resize and compress images with quality control.
 * Default: 85 JPEG quality, -strip EXIF, maintain aspect ratio.
 *
 * @version 2.0.0
 * @contract media-processing v2.0.0
 * @see references/engineering-spec.md
 *
 * ⚠️ --batch mode uses mogrify (DESTRUCTIVE — modifies in-place).
 *    Always backup originals first. Test on single file before batch.
 *
 * Read-only by default (magick convert). Destructive only with --batch.
 */

import { execSync } from 'node:child_process';
import path from 'node:path';

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
const batch = args.includes('--batch');

// Help
if (args.includes('--help') || !input) {
    console.log(`
Image Optimizer — ImageMagick CLI wrapper (v2.0.0)

Usage:
  node optimize-image.js --input <file> [options]

Options:
  --input     Input image file or glob pattern (required)
  --output    Output file (default: input_optimized.ext)
  --width     Max width in pixels (default: 800)
  --quality   JPEG quality 1-100 (default: 85)
  --batch     ⚠️ DESTRUCTIVE: use mogrify (modifies in-place)
  --help      Show this help

Examples:
  node optimize-image.js --input photo.jpg --width 1200
  node optimize-image.js --input photo.png --output thumb.png --width 400
  node optimize-image.js --input "*.jpg" --batch --width 800
`);
    process.exit(0);
}

// Check ImageMagick
try {
    execSync('magick -version', { stdio: 'ignore' });
} catch {
    console.error(JSON.stringify({
        success: false,
        error: { code: 'ERR_TOOL_MISSING', message: 'ImageMagick not found. Install: brew install imagemagick | choco install imagemagick | apt install imagemagick' }
    }));
    process.exit(1);
}

if (batch) {
    // ⚠️ DESTRUCTIVE: mogrify modifies files in-place
    console.warn('⚠️  DESTRUCTIVE: mogrify will modify files in-place. Backup originals first!');
    const cmd = `mogrify -resize ${width}x -quality ${quality} -strip ${input}`;

    console.log(`🔄 Batch optimizing: ${input}`);
    console.log(`   Width: ${width}px, Quality: ${quality}%`);

    try {
        execSync(cmd, { stdio: 'inherit' });
        console.log(JSON.stringify({
            success: true,
            version: '2.0.0',
            tool: 'imagemagick',
            mode: 'batch',
            destructive: true,
            warning: 'Files modified in-place. Use backups to recover originals.',
            input,
            params: { width, quality }
        }));
    } catch (err) {
        console.error(JSON.stringify({
            success: false,
            error: { code: 'ERR_IMAGEMAGICK', message: err.message }
        }));
        process.exit(1);
    }
} else {
    // Safe mode: magick convert to new file
    const ext = path.extname(input);
    const base = path.basename(input, ext);
    const outputFile = output || `${base}_optimized${ext}`;

    const cmd = `magick "${input}" -resize ${width}x -quality ${quality} -strip "${outputFile}"`;

    console.log(`🔄 Optimizing: ${input}`);
    console.log(`   Width: ${width}px, Quality: ${quality}%`);

    try {
        execSync(cmd);
        console.log(JSON.stringify({
            success: true,
            version: '2.0.0',
            tool: 'imagemagick',
            mode: 'single',
            destructive: false,
            input,
            output: outputFile,
            params: { width, quality }
        }));
    } catch (err) {
        console.error(JSON.stringify({
            success: false,
            error: { code: 'ERR_IMAGEMAGICK', message: err.message }
        }));
        process.exit(1);
    }
}
