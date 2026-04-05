#!/usr/bin/env node
// @ts-nocheck
/**
 * Video Converter — FFmpeg CLI wrapper
 *
 * Convert and optimize videos for web delivery.
 * Supports encoding, audio extraction, thumbnails, and GIF generation.
 *
 * @version 2.0.0
 * @contract media-processing v2.0.0
 * @see references/engineering-spec.md
 *
 * CRF Guide (fixed):
 *   18 = Visually lossless (archival)
 *   22 = Recommended balance (default)
 *   28 = Smaller file (web previews)
 *
 * Read-only: does not modify input files.
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
const crf = getArg('crf') || '22';
const preset = getArg('preset') || 'medium';
const mode = getArg('mode') || 'encode';

// Help
if (args.includes('--help') || !input) {
  console.log(`
Video Converter — FFmpeg CLI wrapper (v2.0.0)

Usage:
  node convert-video.js --input <file> [options]

Options:
  --input     Input video file (required)
  --output    Output file (default: input_web.mp4)
  --mode      Operation mode: encode | audio | thumbnail | gif (default: encode)
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
  node convert-video.js --input video.mp4 --mode audio
  node convert-video.js --input video.mp4 --mode thumbnail
  node convert-video.js --input video.mp4 --mode gif
`);
  process.exit(0);
}

// Check FFmpeg
try {
  execSync('ffmpeg -version', { stdio: 'ignore' });
} catch {
  console.error(JSON.stringify({
    success: false,
    error: { code: 'ERR_TOOL_MISSING', message: 'FFmpeg not found. Install: brew install ffmpeg | choco install ffmpeg | apt install ffmpeg' }
  }));
  process.exit(1);
}

// Default output name
const ext = path.extname(input);
const base = path.basename(input, ext);

/** Build FFmpeg command based on mode. */
function buildCommand() {
  switch (mode) {
    case 'encode': {
      const out = output || `${base}_web.mp4`;
      return {
        cmd: `ffmpeg -i "${input}" -c:v libx264 -crf ${crf} -preset ${preset} -c:a aac -movflags +faststart -y "${out}"`,
        outputFile: out,
        description: `Encode with CRF ${crf}, preset ${preset}`
      };
    }
    case 'audio': {
      const out = output || `${base}.m4a`;
      return {
        cmd: `ffmpeg -i "${input}" -vn -c:a copy -y "${out}"`,
        outputFile: out,
        description: 'Extract audio (copy codec)'
      };
    }
    case 'thumbnail': {
      const timestamp = getArg('timestamp') || '00:00:05';
      const out = output || `${base}_thumb.jpg`;
      return {
        cmd: `ffmpeg -i "${input}" -ss ${timestamp} -vframes 1 -y "${out}"`,
        outputFile: out,
        description: `Thumbnail at ${timestamp}`
      };
    }
    case 'gif': {
      const fps = getArg('fps') || '10';
      const width = getArg('width') || '480';
      const out = output || `${base}.gif`;
      return {
        cmd: `ffmpeg -i "${input}" -vf "fps=${fps},scale=${width}:-1:flags=lanczos" -y "${out}"`,
        outputFile: out,
        description: `GIF at ${fps}fps, ${width}px wide`
      };
    }
    default:
      return null;
  }
}

const result = buildCommand();

if (!result) {
  console.error(JSON.stringify({
    success: false,
    error: { code: 'ERR_UNKNOWN_MODE', message: `Unknown mode: ${mode}. Use: encode, audio, thumbnail, gif` }
  }));
  process.exit(1);
}

console.log(`🔄 ${result.description}: ${input}`);

try {
  execSync(result.cmd, { stdio: 'inherit' });
  console.log(JSON.stringify({
    success: true,
    version: '2.0.0',
    tool: 'ffmpeg',
    mode,
    input,
    output: result.outputFile,
    params: { crf: mode === 'encode' ? crf : undefined, preset: mode === 'encode' ? preset : undefined }
  }));
} catch (err) {
  console.error(JSON.stringify({
    success: false,
    error: { code: 'ERR_FFMPEG', message: err.message }
  }));
  process.exit(1);
}
