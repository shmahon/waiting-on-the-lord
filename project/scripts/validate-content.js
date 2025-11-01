#!/usr/bin/env node

/**
 * Content Validation Script
 *
 * Compares current content inventory against baseline to ensure
 * no content has been lost during aesthetic enhancements.
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execPromise = promisify(exec);

const baselineFile = path.join(__dirname, '../validation/content-inventory-baseline.txt');
const currentFile = path.join(__dirname, '../validation/content-inventory-current.txt');

async function main() {
  console.log('='.repeat(80));
  console.log('CONTENT VALIDATION');
  console.log('='.repeat(80));
  console.log();

  // Generate current inventory
  console.log('Generating current content inventory...');
  try {
    await execPromise('node project/scripts/content-inventory.js > project/validation/content-inventory-current.txt');
    console.log('✓ Current inventory generated');
  } catch (error) {
    console.error('✗ Failed to generate current inventory:', error.message);
    process.exit(1);
  }

  // Read both files
  if (!fs.existsSync(baselineFile)) {
    console.error('✗ Baseline file not found. Run content-inventory.js first.');
    process.exit(1);
  }

  const baseline = fs.readFileSync(baselineFile, 'utf8');
  const current = fs.readFileSync(currentFile, 'utf8');

  console.log();
  console.log('## COMPARISON RESULTS');
  console.log('-'.repeat(80));

  // Extract statistics from both
  const baselineStats = extractStats(baseline);
  const currentStats = extractStats(current);

  // Compare
  let allPassed = true;

  console.log();
  console.log('### Content Counts:');
  console.log();

  const checks = [
    { name: 'Themes', baseline: baselineStats.themes, current: currentStats.themes },
    { name: 'Scripture References', baseline: baselineStats.references, current: currentStats.references },
    { name: 'Hebrew Lexemes', baseline: baselineStats.hebrewLexemes, current: currentStats.hebrewLexemes },
    { name: 'Greek Lexemes', baseline: baselineStats.greekLexemes, current: currentStats.greekLexemes },
    { name: 'Hebrew Concepts', baseline: baselineStats.hebrewConcepts, current: currentStats.hebrewConcepts },
    { name: 'Greek Concepts', baseline: baselineStats.greekConcepts, current: currentStats.greekConcepts },
    { name: 'Hebrew Stems', baseline: baselineStats.hebrewStems, current: currentStats.hebrewStems },
    { name: 'Unique Text Strings', baseline: baselineStats.uniqueStrings, current: currentStats.uniqueStrings },
    { name: 'Approximate Words', baseline: baselineStats.words, current: currentStats.words }
  ];

  for (const check of checks) {
    const diff = check.current - check.baseline;
    const status = diff === 0 ? '✓' : (diff > 0 ? '⚠' : '✗');
    const symbol = diff === 0 ? '' : ` (${diff > 0 ? '+' : ''}${diff})`;

    console.log(`${status} ${check.name}: ${check.current}${symbol}`);

    if (check.baseline === 0 && check.name !== 'Unique Text Strings' && check.name !== 'Approximate Words') {
      console.log(`    [Baseline: ${check.baseline}, Current: ${check.current}]`);
    }

    if (diff < 0) {
      allPassed = false;
      console.log(`    ⚠ WARNING: ${Math.abs(diff)} ${check.name.toLowerCase()} missing!`);
    } else if (diff > 0) {
      console.log(`    ℹ INFO: ${diff} ${check.name.toLowerCase()} added`);
    }
  }

  // Extract all theme names and references for detailed validation
  console.log();
  console.log('### Theme Names:');
  const baselineThemes = extractThemes(baseline);
  const currentThemes = extractThemes(current);

  const missingThemes = baselineThemes.filter(t => !currentThemes.includes(t));
  const addedThemes = currentThemes.filter(t => !baselineThemes.includes(t));

  if (missingThemes.length === 0 && addedThemes.length === 0) {
    console.log('✓ All themes present and unchanged');
  } else {
    if (missingThemes.length > 0) {
      console.log('✗ Missing themes:');
      missingThemes.forEach(t => console.log(`  - ${t}`));
      allPassed = false;
    }
    if (addedThemes.length > 0) {
      console.log('⚠ Added themes:');
      addedThemes.forEach(t => console.log(`  - ${t}`));
    }
  }

  console.log();
  console.log('### Scripture References:');
  const baselineRefs = extractReferences(baseline);
  const currentRefs = extractReferences(current);

  const missingRefs = baselineRefs.filter(r => !currentRefs.includes(r));
  const addedRefs = currentRefs.filter(r => !baselineRefs.includes(r));

  if (missingRefs.length === 0 && addedRefs.length === 0) {
    console.log('✓ All scripture references present and unchanged');
  } else {
    if (missingRefs.length > 0) {
      console.log('✗ Missing references:');
      missingRefs.forEach(r => console.log(`  - ${r}`));
      allPassed = false;
    }
    if (addedRefs.length > 0) {
      console.log('⚠ Added references:');
      addedRefs.forEach(r => console.log(`  - ${r}`));
    }
  }

  // Word count comparison with tolerance
  console.log();
  console.log('### Word Count Analysis:');
  const wordDiff = currentStats.words - baselineStats.words;
  const wordDiffPercent = ((wordDiff / baselineStats.words) * 100).toFixed(2);

  if (Math.abs(wordDiff) <= 10) {
    console.log(`✓ Word count: ${currentStats.words} (${wordDiff >= 0 ? '+' : ''}${wordDiff}, ${wordDiffPercent}%)`);
    console.log('  Minor variation acceptable (≤10 words)');
  } else if (Math.abs(wordDiff) <= 50) {
    console.log(`⚠ Word count: ${currentStats.words} (${wordDiff >= 0 ? '+' : ''}${wordDiff}, ${wordDiffPercent}%)`);
    console.log('  Moderate variation - review recommended');
  } else {
    console.log(`✗ Word count: ${currentStats.words} (${wordDiff >= 0 ? '+' : ''}${wordDiff}, ${wordDiffPercent}%)`);
    console.log('  Significant variation - content may be missing or added');
    if (wordDiff < 0) allPassed = false;
  }

  console.log();
  console.log('='.repeat(80));
  if (allPassed) {
    console.log('✓ VALIDATION PASSED - Content integrity preserved');
  } else {
    console.log('✗ VALIDATION FAILED - Content missing or compromised');
  }
  console.log('='.repeat(80));
  console.log();
  console.log('Detailed comparison files:');
  console.log(`  Baseline: ${baselineFile}`);
  console.log(`  Current:  ${currentFile}`);
  console.log();

  process.exit(allPassed ? 0 : 1);
}

function extractStats(content) {
  const stats = {};

  const themeMatch = content.match(/Total Themes: (\d+)/);
  stats.themes = themeMatch ? parseInt(themeMatch[1]) : 0;

  const refMatch = content.match(/Total Scripture References: (\d+)/);
  stats.references = refMatch ? parseInt(refMatch[1]) : 0;

  const hebrewLexMatch = content.match(/Total Hebrew Lexemes: (\d+)/);
  stats.hebrewLexemes = hebrewLexMatch ? parseInt(hebrewLexMatch[1]) : 0;

  const greekLexMatch = content.match(/Total Greek Lexemes: (\d+)/);
  stats.greekLexemes = greekLexMatch ? parseInt(greekLexMatch[1]) : 0;

  const hebrewConMatch = content.match(/Total Hebrew Concepts: (\d+)/);
  stats.hebrewConcepts = hebrewConMatch ? parseInt(hebrewConMatch[1]) : 0;

  const greekConMatch = content.match(/Total Greek Concepts: (\d+)/);
  stats.greekConcepts = greekConMatch ? parseInt(greekConMatch[1]) : 0;

  const stemsMatch = content.match(/Total Hebrew Stems: (\d+)/);
  stats.hebrewStems = stemsMatch ? parseInt(stemsMatch[1]) : 0;

  const stringsMatch = content.match(/Total Unique Text Strings: (\d+)/);
  stats.uniqueStrings = stringsMatch ? parseInt(stringsMatch[1]) : 0;

  const wordsMatch = content.match(/Approximate Total Words: (\d+)/);
  stats.words = wordsMatch ? parseInt(wordsMatch[1]) : 0;

  return stats;
}

function extractThemes(content) {
  const themes = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.match(/^Theme \d+: /)) {
      const theme = line.replace(/^Theme \d+: /, '').trim();
      if (theme) themes.push(theme);
    }
  }

  return themes;
}

function extractReferences(content) {
  const references = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Match pattern like "1. Psalm 25:3 - קָוָה (H6960)"
    const match = line.match(/^\d+\.\s+([A-Za-z0-9:\s]+)\s+-\s+/);
    if (match) {
      references.push(match[1].trim());
    }
  }

  return references;
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
