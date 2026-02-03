#!/usr/bin/env node
/**
 * Video Converter Script
 * Convert and optimize videos using FFmpeg
 * 
 * Usage:
 *   node convert-video.js --input video.mov --output web.mp4 --crf 22
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
const crf = getArg('crf') || '22';
const preset = getArg('preset') || 'medium';

// Help
if (args.includes('--help') || !input) {
    console.log(`
Video Converter - Convert and optimize videos for web

Usage:
  node convert-video.js --input <file> [options]

Options:
  --input     Input video file (required)
  --output    Output file (default: input_web.mp4)
  --crf       Quality 0-51, lower=better (default: 22)
  --preset    Encoding speed: ultrafast/fast/medium/slow (default: medium)
  --help      Show this help

CRF Guide:
  18 = Visually lossless (large file)
  22 = Recommended balance
  28 = Smaller file, lower quality

Examples:
  node convert-video.js --input raw.mov
  node convert-video.js --input raw.mov --crf 18 --preset slow
`);
    process.exit(0);
}

// Check FFmpeg
try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
} catch {
    console.error('❌ FFmpeg not found. Install with: brew install ffmpeg');
    process.exit(1);
}

// Default output name
const ext = path.extname(input);
const base = path.basename(input, ext);
const outputFile = output || `${base}_web.mp4`;

// Build command
const cmd = `ffmpeg -i "${input}" -c:v libx264 -crf ${crf} -preset ${preset} -c:a aac -movflags +faststart -y "${outputFile}"`;

console.log(`🔄 Converting: ${input}`);
console.log(`   CRF: ${crf}, Preset: ${preset}`);

try {
    execSync(cmd, { stdio: 'inherit' });
    console.log(`✅ Saved: ${outputFile}`);
} catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
}
