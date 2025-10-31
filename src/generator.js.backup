#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, UnderlineType } = require('docx');

// Load all data files
const dataDir = path.join(__dirname, '../data');
const structuredData = JSON.parse(fs.readFileSync(path.join(dataDir, 'structured_by_theme.json'), 'utf8'));
const hebrewLexemes = JSON.parse(fs.readFileSync(path.join(dataDir, 'hebrew_lexemes.json'), 'utf8'));
const greekLexemes = JSON.parse(fs.readFileSync(path.join(dataDir, 'greek_lexemes.json'), 'utf8'));
const hebrewConcepts = JSON.parse(fs.readFileSync(path.join(dataDir, 'hebrew_concepts.json'), 'utf8'));
const greekConcepts = JSON.parse(fs.readFileSync(path.join(dataDir, 'greek_concepts.json'), 'utf8'));
const hebrewStems = JSON.parse(fs.readFileSync(path.join(dataDir, 'hebrew_stems.json'), 'utf8'));

console.log('Loaded all data files successfully');

// Helper to find lexeme definition
function getLexemeDefinition(word, strongs, language) {
  const lexemes = language === 'Hebrew' ? hebrewLexemes.lexemes : greekLexemes.lexemes;
  return lexemes.find(lex => lex.word === word || lex.strongs === strongs);
}

// Helper to get concept explanation
function getConceptExplanation(term, language) {
  const concepts = language === 'Hebrew' ? hebrewConcepts.concepts : greekConcepts.concepts;
  return concepts.find(c => c.term === term || c.term.includes(term));
}

// Create document sections
const sections = [];

// Title
sections.push(
  new Paragraph({
    text: 'Waiting on the Lord',
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 }
  }),
  new Paragraph({
    text: 'A Lexical and Morphological Analysis',
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 }
  })
);

// Introduction
sections.push(
  new Paragraph({
    text: 'Introduction',
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 }
  }),
  new Paragraph({
    text: 'This study examines the Hebrew and Greek vocabulary used in Scripture to describe "waiting on the Lord." Through careful morphological analysis, we discover that biblical "waiting" is not a monolithic concept but encompasses a rich variety of postures, emotions, and expectations.',
    spacing: { after: 200 }
  }),
  new Paragraph({
    text: 'The Hebrew Old Testament employs multiple words for waiting—from the silent trust of דָּמַם (dāmam) to the writhing intensity of חוּל (ḥûl), from patient tarrying חָכָה (ḥākāh) to active expectation קָוָה (qāwāh). Each captures a different facet of the experience of depending on God through time.',
    spacing: { after: 200 }
  }),
  new Paragraph({
    text: 'The Greek New Testament emphasizes eschatological anticipation, with ἀπεκδέχομαι (apekdechomai) dominating the vocabulary—eager, confident awaiting of Christ\'s return. Yet patient endurance (ὑπομονή, hypomonē) and longsuffering forbearance (μακροθυμέω, makrothymeō) also feature prominently.',
    spacing: { after: 200 }
  }),
  new Paragraph({
    text: 'Morphology matters. When Hebrew uses participles, it transforms waiting from action to identity—"those who wait" are characterized by this posture. When Greek uses deponent verbs (middle/passive form with active meaning), it emphasizes personal investment in hope. The Hebrew stem system (Qal, Piel, Hiphil) modifies intensity and causation, adding theological nuance.',
    spacing: { after: 200 }
  }),
  new Paragraph({
    text: 'This analysis proceeds thematically, examining how morphological details illuminate the theological meaning of waiting in various contexts. Technical terms are explained inline or in endnotes to aid comprehension.',
    spacing: { after: 400 }
  })
);

// Process each theme
for (const themeData of structuredData) {
  // Theme heading
  sections.push(
    new Paragraph({
      text: themeData.theme,
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 }
    })
  );

  // Process each lexeme in theme
  for (const lexeme of themeData.lexemes) {
    const lexDef = getLexemeDefinition(lexeme.word, lexeme.strongs, lexeme.language);
    
    // Lexeme heading
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${lexeme.word} (${lexeme.transliteration}) — ${lexeme.strongs}`,
            bold: true,
            size: 28
          })
        ],
        spacing: { before: 300, after: 100 }
      })
    );

    // Add brief definition if available
    if (lexDef) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Definition: ', italics: true }),
            new TextRun({ text: lexDef.primary_theological_meaning || lexDef.root_meaning })
          ],
          spacing: { after: 200 }
        })
      );
    }

    // Process each occurrence
    for (let i = 0; i < lexeme.occurrences.length; i++) {
      const occ = lexeme.occurrences[i];
      
      // Reference
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: occ.reference,
              bold: true,
              underline: { type: UnderlineType.SINGLE }
            })
          ],
          spacing: { before: 200, after: 100 }
        })
      );

      // Parsing
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Parsing: ', bold: true }),
            new TextRun({ text: occ.parsing || 'Not available' })
          ],
          spacing: { after: 100 }
        })
      );

      // Morphology breakdown
      const morph = occ.morphology;
      if (morph) {
        const morphParts = [];
        if (morph.part_of_speech) morphParts.push(`Part of Speech: ${morph.part_of_speech}`);
        if (morph.stem) morphParts.push(`Stem: ${morph.stem}`);
        if (morph.type) morphParts.push(`Type: ${morph.type}`);
        if (morph.tense) morphParts.push(`Tense: ${morph.tense}`);
        if (morph.voice) morphParts.push(`Voice: ${morph.voice}`);
        if (morph.mood) morphParts.push(`Mood: ${morph.mood}`);
        if (morph.person) morphParts.push(`Person: ${morph.person}`);
        if (morph.gender) morphParts.push(`Gender: ${morph.gender}`);
        if (morph.number) morphParts.push(`Number: ${morph.number}`);
        if (morph.state) morphParts.push(`State: ${morph.state}`);

        if (morphParts.length > 0) {
          sections.push(
            new Paragraph({
              text: morphParts.join(' • '),
              spacing: { after: 100 }
            })
          );
        }
      }

      // Add ALL applicable learners' notes for obscure concepts
      if (occ.parsing) {
        const obscureTerms = ['Sequential Perfect', 'Sequential Imperfect', 'Construct', 'Deponent', 
                              'Participle', 'Infinitive', 'Imperative', 'Perfect', 'Imperfect'];
        const notesAdded = [];
        
        for (const term of obscureTerms) {
          if (occ.parsing.includes(term) && !notesAdded.includes(term)) {
            const concept = getConceptExplanation(term, lexeme.language);
            if (concept) {
              sections.push(
                new Paragraph({
                  children: [
                    new TextRun({ text: `Learner's Note (${term}): `, bold: true, italics: true }),
                    new TextRun({ text: concept.simple_explanation, italics: true })
                  ],
                  spacing: { after: 100 }
                })
              );
              notesAdded.push(term); // Track to avoid duplicates
            }
          }
        }
        
        // Add stem note if applicable
        if (morph && morph.stem && !notesAdded.includes('Stem')) {
          const stemInfo = hebrewStems.stems.find(s => s.name === morph.stem);
          if (stemInfo) {
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({ text: `Learner's Note (${morph.stem} Stem): `, bold: true, italics: true }),
                  new TextRun({ text: stemInfo.meaning, italics: true })
                ],
                spacing: { after: 100 }
              })
            );
            notesAdded.push('Stem');
          }
        }
      }

      // Scripture text (first 200 chars)
      const scriptureText = occ.scripture_text.split('\n')[0];
      const truncated = scriptureText.length > 200 ? scriptureText.substring(0, 200) + '...' : scriptureText;
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Text: ', bold: true }),
            new TextRun({ text: truncated })
          ],
          spacing: { after: 200 }
        })
      );
    }
  }
}

// Add Endnotes section
sections.push(
  new Paragraph({
    text: 'Endnotes',
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 600, after: 300 },
    pageBreakBefore: true
  })
);

// Hebrew Verb Stem System
sections.push(
  new Paragraph({
    text: 'Hebrew Verb Stem System',
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 200 }
  }),
  new Paragraph({
    text: hebrewStems.description,
    spacing: { after: 200 }
  })
);

for (const stem of hebrewStems.stems) {
  sections.push(
    new Paragraph({
      children: [
        new TextRun({ text: `${stem.name} (${stem.category}): `, bold: true }),
        new TextRun({ text: stem.meaning })
      ],
      spacing: { after: 100 }
    }),
    new Paragraph({
      text: stem.description,
      spacing: { after: 100 }
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Example: ', italics: true }),
        new TextRun({ text: stem.example.explanation })
      ],
      spacing: { after: 200 }
    })
  );
}

// Hebrew Grammatical Concepts Reference
sections.push(
  new Paragraph({
    text: 'Hebrew Grammatical Concepts',
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 200 }
  }),
  new Paragraph({
    text: 'This section provides detailed explanations of Hebrew grammatical concepts that appear in the morphological analysis above.',
    spacing: { after: 200 }
  })
);

for (const concept of hebrewConcepts.concepts) {
  sections.push(
    new Paragraph({
      children: [
        new TextRun({ text: concept.term, bold: true, size: 26 }),
        new TextRun({ text: ` (${concept.category})`, italics: true })
      ],
      spacing: { before: 200, after: 100 }
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Definition: ', bold: true }),
        new TextRun({ text: concept.simple_explanation })
      ],
      spacing: { after: 100 }
    }),
    new Paragraph({
      text: concept.detailed_explanation,
      spacing: { after: 100 }
    })
  );
  
  if (concept.example) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Example: ', italics: true }),
          new TextRun({ text: concept.example })
        ],
        spacing: { after: 100 }
      })
    );
  }
  
  if (concept.why_relevant) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Why This Matters: ', bold: true }),
          new TextRun({ text: concept.why_relevant })
        ],
        spacing: { after: 200 }
      })
    );
  }
}

// Greek Grammatical Concepts Reference
sections.push(
  new Paragraph({
    text: 'Greek Grammatical Concepts',
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 200 }
  }),
  new Paragraph({
    text: 'This section provides detailed explanations of Greek grammatical concepts that appear in the morphological analysis above.',
    spacing: { after: 200 }
  })
);

for (const concept of greekConcepts.concepts) {
  sections.push(
    new Paragraph({
      children: [
        new TextRun({ text: concept.term, bold: true, size: 26 }),
        new TextRun({ text: ` (${concept.category})`, italics: true })
      ],
      spacing: { before: 200, after: 100 }
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Definition: ', bold: true }),
        new TextRun({ text: concept.simple_explanation })
      ],
      spacing: { after: 100 }
    }),
    new Paragraph({
      text: concept.detailed_explanation,
      spacing: { after: 100 }
    })
  );
  
  if (concept.example) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Example: ', italics: true }),
          new TextRun({ text: concept.example })
        ],
        spacing: { after: 100 }
      })
    );
  }
  
  if (concept.why_relevant) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Why This Matters: ', bold: true }),
          new TextRun({ text: concept.why_relevant })
        ],
        spacing: { after: 200 }
      })
    );
  }
}

// Lexeme Summary Section
const lexemeSummary = JSON.parse(fs.readFileSync(path.join(dataDir, 'lexeme_summary.json'), 'utf8'));

sections.push(
  new Paragraph({
    text: 'Lexeme Summary',
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 200 }
  }),
  new Paragraph({
    text: 'This section provides a quick reference of all Hebrew and Greek words analyzed in this study.',
    spacing: { after: 300 }
  })
);

// Hebrew Lexemes Summary
sections.push(
  new Paragraph({
    text: 'Hebrew Words',
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 }
  })
);

for (const lex of lexemeSummary.filter(l => l.language === 'Hebrew')) {
  const lexDef = getLexemeDefinition(lex.word, lex.strongs, 'Hebrew');
  sections.push(
    new Paragraph({
      children: [
        new TextRun({ text: `${lex.word} (${lex.transliteration}) — ${lex.strongs}`, bold: true })
      ],
      spacing: { before: 150, after: 50 }
    }),
    new Paragraph({
      text: lexDef ? lexDef.primary_theological_meaning : 'Definition not available',
      spacing: { after: 50 }
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `Occurrences: ${lex.occurrence_count} | Themes: `, italics: true }),
        new TextRun({ text: lex.themes.join(', '), italics: true })
      ],
      spacing: { after: 150 }
    })
  );
}

// Greek Lexemes Summary
sections.push(
  new Paragraph({
    text: 'Greek Words',
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 }
  })
);

for (const lex of lexemeSummary.filter(l => l.language === 'Greek')) {
  const lexDef = getLexemeDefinition(lex.word, lex.strongs, 'Greek');
  sections.push(
    new Paragraph({
      children: [
        new TextRun({ text: `${lex.word} (${lex.transliteration}) — ${lex.strongs}`, bold: true })
      ],
      spacing: { before: 150, after: 50 }
    }),
    new Paragraph({
      text: lexDef ? lexDef.primary_theological_meaning : 'Definition not available',
      spacing: { after: 50 }
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `Occurrences: ${lex.occurrence_count} | Themes: `, italics: true }),
        new TextRun({ text: lex.themes.join(', '), italics: true })
      ],
      spacing: { after: 150 }
    })
  );
}

// Create the document
const doc = new Document({
  sections: [{
    properties: {},
    children: sections
  }]
});

// Write to file
const outputDir = path.join(__dirname, '../output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, 'waiting_on_the_lord_analysis.docx');

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`\n✓ Document generated successfully!`);
  console.log(`  Output: ${outputPath}`);
  console.log(`  Size: ${(buffer.length / 1024).toFixed(1)} KB`);
}).catch(err => {
  console.error('Error generating document:', err);
  process.exit(1);
});
