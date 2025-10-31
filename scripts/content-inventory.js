#!/usr/bin/env node

/**
 * Content Inventory Script
 *
 * Extracts and catalogs all content from data files to create a baseline
 * for validating that no content is lost during aesthetic enhancements.
 */

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

// Load all data files
const structuredData = JSON.parse(fs.readFileSync(path.join(dataDir, 'structured_by_theme.json'), 'utf8'));
const hebrewLexemes = JSON.parse(fs.readFileSync(path.join(dataDir, 'hebrew_lexemes.json'), 'utf8'));
const greekLexemes = JSON.parse(fs.readFileSync(path.join(dataDir, 'greek_lexemes.json'), 'utf8'));
const hebrewConcepts = JSON.parse(fs.readFileSync(path.join(dataDir, 'hebrew_concepts.json'), 'utf8'));
const greekConcepts = JSON.parse(fs.readFileSync(path.join(dataDir, 'greek_concepts.json'), 'utf8'));
const hebrewStems = JSON.parse(fs.readFileSync(path.join(dataDir, 'hebrew_stems.json'), 'utf8'));
const lexemeSummary = JSON.parse(fs.readFileSync(path.join(dataDir, 'lexeme_summary.json'), 'utf8'));

console.log('='.repeat(80));
console.log('CONTENT INVENTORY BASELINE');
console.log('Generated:', new Date().toISOString());
console.log('='.repeat(80));
console.log();

// Section 1: Themes and Structure
console.log('## THEMES AND STRUCTURE');
console.log('-'.repeat(80));
console.log(`Total Themes: ${structuredData.length}`);
console.log();

for (let i = 0; i < structuredData.length; i++) {
  const theme = structuredData[i];
  console.log(`Theme ${i + 1}: ${theme.theme}`);
  console.log(`  Lexemes: ${theme.lexemes.length}`);

  for (const lexeme of theme.lexemes) {
    console.log(`    - ${lexeme.word} (${lexeme.transliteration}) ${lexeme.strongs}`);
    console.log(`      Language: ${lexeme.language}`);
    console.log(`      Occurrences: ${lexeme.occurrences.length}`);
  }
  console.log();
}

// Section 2: All Scripture References
console.log('## SCRIPTURE REFERENCES');
console.log('-'.repeat(80));
const allReferences = [];
for (const theme of structuredData) {
  for (const lexeme of theme.lexemes) {
    for (const occ of lexeme.occurrences) {
      allReferences.push({
        reference: occ.reference,
        word: lexeme.word,
        strongs: lexeme.strongs,
        parsing: occ.parsing || 'N/A',
        theme: theme.theme
      });
    }
  }
}
console.log(`Total Scripture References: ${allReferences.length}`);
console.log();
allReferences.forEach((ref, idx) => {
  console.log(`${idx + 1}. ${ref.reference} - ${ref.word} (${ref.strongs})`);
  console.log(`   Parsing: ${ref.parsing}`);
  console.log(`   Theme: ${ref.theme}`);
});
console.log();

// Section 3: Lexemes
console.log('## LEXEMES');
console.log('-'.repeat(80));
console.log(`Hebrew Lexemes: ${hebrewLexemes.lexemes.length}`);
console.log(`Greek Lexemes: ${greekLexemes.lexemes.length}`);
console.log();

console.log('### Hebrew Lexemes:');
for (const lex of hebrewLexemes.lexemes) {
  console.log(`  ${lex.word} (${lex.strongs})`);
  console.log(`    Root Meaning: ${lex.root_meaning}`);
  console.log(`    Theological Meaning: ${lex.primary_theological_meaning}`);
}
console.log();

console.log('### Greek Lexemes:');
for (const lex of greekLexemes.lexemes) {
  console.log(`  ${lex.word} (${lex.strongs})`);
  console.log(`    Root Meaning: ${lex.root_meaning}`);
  console.log(`    Theological Meaning: ${lex.primary_theological_meaning}`);
}
console.log();

// Section 4: Grammatical Concepts
console.log('## GRAMMATICAL CONCEPTS');
console.log('-'.repeat(80));
console.log(`Hebrew Concepts: ${hebrewConcepts.concepts.length}`);
console.log(`Greek Concepts: ${greekConcepts.concepts.length}`);
console.log();

console.log('### Hebrew Concepts:');
for (const concept of hebrewConcepts.concepts) {
  console.log(`  ${concept.term} (${concept.category})`);
  console.log(`    Simple: ${concept.simple_explanation}`);
  console.log(`    Detailed: ${concept.detailed_explanation.substring(0, 100)}...`);
  if (concept.example) {
    console.log(`    Example: ${concept.example.substring(0, 80)}...`);
  }
}
console.log();

console.log('### Greek Concepts:');
for (const concept of greekConcepts.concepts) {
  console.log(`  ${concept.term} (${concept.category})`);
  console.log(`    Simple: ${concept.simple_explanation}`);
  console.log(`    Detailed: ${concept.detailed_explanation.substring(0, 100)}...`);
  if (concept.example) {
    console.log(`    Example: ${concept.example.substring(0, 80)}...`);
  }
}
console.log();

// Section 5: Hebrew Stems
console.log('## HEBREW VERB STEMS');
console.log('-'.repeat(80));
console.log(`Total Stems: ${hebrewStems.stems.length}`);
console.log(`Description: ${hebrewStems.description}`);
console.log();

for (const stem of hebrewStems.stems) {
  console.log(`  ${stem.name} (${stem.category})`);
  console.log(`    Meaning: ${stem.meaning}`);
  console.log(`    Description: ${stem.description.substring(0, 100)}...`);
  console.log(`    Example: ${stem.example.explanation.substring(0, 80)}...`);
}
console.log();

// Section 6: Content Statistics
console.log('## CONTENT STATISTICS');
console.log('-'.repeat(80));

// Count all unique text strings
const allTextContent = new Set();

// Add all theme names
structuredData.forEach(t => allTextContent.add(t.theme));

// Add all lexeme info
for (const theme of structuredData) {
  for (const lexeme of theme.lexemes) {
    allTextContent.add(lexeme.word);
    allTextContent.add(lexeme.transliteration);
    allTextContent.add(lexeme.strongs);
    for (const occ of lexeme.occurrences) {
      allTextContent.add(occ.reference);
      if (occ.parsing) allTextContent.add(occ.parsing);
      allTextContent.add(occ.scripture_text);
    }
  }
}

// Add lexeme definitions
hebrewLexemes.lexemes.forEach(l => {
  allTextContent.add(l.root_meaning);
  allTextContent.add(l.primary_theological_meaning);
});
greekLexemes.lexemes.forEach(l => {
  allTextContent.add(l.root_meaning);
  allTextContent.add(l.primary_theological_meaning);
});

// Add concepts
hebrewConcepts.concepts.forEach(c => {
  allTextContent.add(c.term);
  allTextContent.add(c.simple_explanation);
  allTextContent.add(c.detailed_explanation);
  if (c.example) allTextContent.add(c.example);
  if (c.why_relevant) allTextContent.add(c.why_relevant);
});
greekConcepts.concepts.forEach(c => {
  allTextContent.add(c.term);
  allTextContent.add(c.simple_explanation);
  allTextContent.add(c.detailed_explanation);
  if (c.example) allTextContent.add(c.example);
  if (c.why_relevant) allTextContent.add(c.why_relevant);
});

// Add stems
hebrewStems.stems.forEach(s => {
  allTextContent.add(s.name);
  allTextContent.add(s.meaning);
  allTextContent.add(s.description);
  allTextContent.add(s.example.explanation);
});

console.log(`Total Themes: ${structuredData.length}`);
console.log(`Total Scripture References: ${allReferences.length}`);
console.log(`Total Hebrew Lexemes: ${hebrewLexemes.lexemes.length}`);
console.log(`Total Greek Lexemes: ${greekLexemes.lexemes.length}`);
console.log(`Total Hebrew Concepts: ${hebrewConcepts.concepts.length}`);
console.log(`Total Greek Concepts: ${greekConcepts.concepts.length}`);
console.log(`Total Hebrew Stems: ${hebrewStems.stems.length}`);
console.log(`Total Unique Text Strings: ${allTextContent.size}`);

// Calculate total word count
let totalWords = 0;
allTextContent.forEach(text => {
  totalWords += text.split(/\s+/).length;
});
console.log(`Approximate Total Words: ${totalWords}`);

console.log();
console.log('='.repeat(80));
console.log('END CONTENT INVENTORY');
console.log('='.repeat(80));
