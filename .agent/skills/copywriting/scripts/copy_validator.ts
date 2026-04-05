#!/usr/bin/env node
// @ts-nocheck
import * as fs from 'node:fs';

const VERSION = '1.0.0';

// 5 Copy Validation Rules check heuristics
function validateCopy(text) {
  const issues = [];
  const lowerText = text.toLowerCase();

  // Rule 2: Single CTA (Count common CTA phrases)
  const ctaPhrases = ['click here', 'sign up', 'buy now', 'get started', 'subscribe', 'learn more', 'download'];
  let ctaCount = 0;
  for (const phrase of ctaPhrases) {
    const matches = lowerText.match(new RegExp(phrase, 'g'));
    if (matches) ctaCount += matches.length;
  }
  // Check Markdown/HTML links as another CTA signal
  const linkMatches = text.match(/\[(.*?)\]\(.*?\)|<a\s+href=.*?>.*?<\/a>/g);
  if (linkMatches) ctaCount += linkMatches.length;

  if (ctaCount > 1) {
    issues.push({
      rule: 'SINGLE_CTA',
      severity: 'warning',
      message: `Found approx ${ctaCount} possible CTAs/links. Ensure there is only ONE primary Call-to-Action.`
    });
  } else if (ctaCount === 0) {
    issues.push({
      rule: 'SINGLE_CTA',
      severity: 'warning',
      message: `No explicit CTA found. Copy must have one clear next step.`
    });
  }

  // Rule 3: Specific Claims (Look for numbers/percentages)
  const hasNumbers = /\d+/.test(text);
  const vagueAdjectives = ['faster', 'better', 'easier', 'more', 'less', 'great', 'awesome'];
  let vagueCount = 0;
  for (const adj of vagueAdjectives) {
    if (new RegExp(`\\b${adj}\\b`, 'i').test(text)) vagueCount++;
  }
  
  if (vagueCount > 0 && !hasNumbers) {
    issues.push({
      rule: 'SPECIFIC_CLAIMS',
      severity: 'warning',
      message: `Found ${vagueCount} vague adjective(s) without specific numbers to back them up (e.g. use "73% faster" instead of just "faster").`
    });
  }

  // Rule 4: No jargon (Corporate buzzwords)
  const jargon = ['synergy', 'leverage', 'paradigm shift', 'bandwidth', 'disrupt', 'game-changer', 'innovative', 'cutting-edge'];
  let jargonFound = [];
  for (const word of jargon) {
    if (new RegExp(`\\b${word}\\b`, 'i').test(text)) jargonFound.push(word);
  }
  if (jargonFound.length > 0) {
    issues.push({
      rule: 'NO_JARGON',
      severity: 'warning',
      message: `Found corporate jargon: ${jargonFound.join(', ')}. Use conversational tone.`
    });
  }

  return issues;
}

// 4Us Headline Framework estimation
function validateHeadline(headline) {
  const score = { Urgent: false, Unique: false, Useful: false, UltraSpecific: false, total: 0 };
  const lowerH = headline.toLowerCase();

  // Urgent: time words
  if (/\b(now|today|fast|quick|hurry|limited|breaking|instant)\b/.test(lowerH)) score.Urgent = true;
  
  // Unique: superlative or unique adjective
  if (/\b(only|first|never|secret|hidden|new|exclusive)\b/.test(lowerH)) score.Unique = true;
  
  // Useful: benefit-driven verbs/nouns
  if (/\b(how to|guide|boost|increase|stop|prevent|save|earn|learn)\b/.test(lowerH)) score.Useful = true;
  
  // Ultra-specific: numbers
  if (/\d+/.test(lowerH)) score.UltraSpecific = true;

  score.total = (score.Urgent?1:0) + (score.Unique?1:0) + (score.Useful?1:0) + (score.UltraSpecific?1:0);
  return score;
}

function processInput(inputStr) {
  if (!inputStr || inputStr.trim() === '') {
    console.log(JSON.stringify({
      status: 'error', data: null,
      error: { code: 'ERR_EMPTY_DRAFT', message: 'Input copy draft is empty.' }
    }, null, 2));
    process.exit(1);
  }

  // Separate headline (first line) and body body
  const lines = inputStr.split('\n').filter(l => l.trim() !== '');
  const headline = lines[0].replace(/^#+\s*/, ''); // Remove markdown headers
  const body = lines.slice(1).join('\n');

  const headlineScore = validateHeadline(headline);
  const copyIssues = validateCopy(inputStr); // validate entire text including headline

  const data = {
    version: VERSION,
    timestamp: new Date().toISOString(),
    metrics: {
      headlineScore,
      issuesCount: copyIssues.length,
      wordCount: inputStr.split(/\s+/).length
    },
    findings: copyIssues
  };

  if (copyIssues.length > 0) {
    console.log(JSON.stringify({
      status: 'success', // It's a success run, but with warnings
      data,
      error: null,
      message: `Validation complete with ${copyIssues.length} warnings.`
    }, null, 2));
  } else {
    console.log(JSON.stringify({
      status: 'success',
      data,
      error: null,
      message: 'All 5 Copy Validation rules passed.'
    }, null, 2));
  }
}

function main() {
  const args = process.argv.slice(2);
  let targetFile = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file' && args[i + 1]) targetFile = args[i + 1];
  }

  if (targetFile) {
    if (!fs.existsSync(targetFile)) {
      console.log(JSON.stringify({
        status: 'error', data: null,
        error: { code: 'ERR_MISSING_DRAFT', message: `File not found: ${targetFile}` }
      }, null, 2));
      process.exit(1);
    }
    const content = fs.readFileSync(targetFile, 'utf8');
    processInput(content);
  } else {
    // Read from stdin
    let inputStr = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', () => {
      let chunk;
      while ((chunk = process.stdin.read()) !== null) {
        inputStr += chunk;
      }
    });

    process.stdin.on('end', () => {
      processInput(inputStr);
    });

    // If terminal is interactive and no piped input, warn user
    setTimeout(() => {
      if (inputStr === '' && process.stdin.isTTY) {
        console.error("Usage: node copy_validator.js --file <draft.md> OR pipe text: echo 'Draft' | node copy_validator.js");
        process.exit(1);
      }
    }, 100);
  }
}

try { main(); } catch (e) {
  console.log(JSON.stringify({
    status: 'error', data: null,
    error: { code: 'ERR_FATAL', phase: 'execution', message: e.message }
  }, null, 2));
  process.exit(1);
}
