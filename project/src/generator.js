#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, UnderlineType,
  Table, TableRow, TableCell, WidthType, BorderStyle, Shading, VerticalAlign,
  Footer, FootnoteReferenceRun, convertInchesToTwip, PageNumber, NumberFormat,
  Media, ImageRun
} = require('docx');

// Mature Scholastic Color Palette
const COLORS = {
  // Primary: Deep navy blue for academic professionalism
  PRIMARY: '1B3B5A',       // Deep navy
  PRIMARY_LIGHT: '2E5077', // Medium navy

  // Accent: Rich burgundy for emphasis
  ACCENT: '6B2C3E',        // Deep burgundy
  ACCENT_LIGHT: '8B3F52',  // Medium burgundy

  // Supporting: Muted sage green for callouts
  SUPPORTING: '5F7161',    // Sage green
  SUPPORTING_LIGHT: 'D6E4E5', // Very light sage

  // Neutrals
  GRAY_DARK: '4A4A4A',
  GRAY_MEDIUM: '757575',
  GRAY_LIGHT: 'E8E8E8',
  GRAY_VERY_LIGHT: 'F5F5F5',

  // Text
  TEXT_PRIMARY: '2C2C2C',
  TEXT_SECONDARY: '5A5A5A'
};

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

// Helper to create callout box for learner's notes (professional textbook sidebar style)
// Based on academic publishing standards: sans-serif font, clear borders, subtle styling
function createCalloutBox(title, content) {
  return new Table({
    width: { size: 85, type: WidthType.PERCENTAGE },
    margins: {
      top: 120,
      bottom: 120,
      left: convertInchesToTwip(0.4),
      right: convertInchesToTwip(0.4)
    },
    borders: {
      // Professional frame: subtle top/bottom, prominent left accent
      left: { style: BorderStyle.SINGLE, size: 24, color: COLORS.SUPPORTING },
      top: { style: BorderStyle.SINGLE, size: 6, color: COLORS.GRAY_MEDIUM },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: COLORS.GRAY_MEDIUM },
      right: { style: BorderStyle.SINGLE, size: 6, color: COLORS.GRAY_MEDIUM },
      insideHorizontal: { style: BorderStyle.NONE, size: 0 },
      insideVertical: { style: BorderStyle.NONE, size: 0 }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: {
              fill: 'FAFBFC',  // Extremely subtle gray (better than pure white for print)
              type: 'clear',
              color: 'auto'
            },
            margins: {
              top: 140,
              bottom: 140,
              left: 200,
              right: 200
            },
            verticalAlign: VerticalAlign.TOP,
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${title}`,  // Removed emoji for professional appearance
                    bold: true,
                    color: COLORS.SUPPORTING,
                    size: 20,  // Reduced from 22
                    font: 'Calibri'  // Sans-serif for sidebars (publishing standard)
                  })
                ],
                spacing: { after: 140 },
                border: {
                  bottom: {
                    color: COLORS.GRAY_LIGHT,
                    space: 1,
                    style: BorderStyle.SINGLE,
                    size: 6
                  }
                }
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: content,
                    color: COLORS.TEXT_PRIMARY,
                    size: 18,  // Reduced from 20
                    font: 'Calibri'  // Sans-serif to distinguish from body text
                  })
                ],
                spacing: { line: 276 }  // 1.15 line spacing for readability
              })
            ]
          })
        ]
      })
    ],
    spacing: {
      before: 240,
      after: 240
    }
  });
}

// Create document sections and footnotes
const sections = [];
const footnotes = {};
let footnoteCounter = 1;

// Track recent footnotes for deduplication (within a logical page/section)
// Map: stem name -> footnote ID
const recentFootnotes = new Map();
const footnoteResetInterval = 3; // Reset tracking after N lexeme occurrences (approximates page breaks)

// Title
sections.push(
  new Paragraph({
    text: 'Waiting on the Lord',
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    shading: {
      fill: COLORS.PRIMARY,
      type: 'clear',
      color: 'auto'
    },
    run: {
      color: 'FFFFFF',
      bold: true,
      font: 'Garamond',  // Classic serif for title
      size: 30  // Reduced from 32
    }
  }),
  new Paragraph({
    text: 'A Lexical and Morphological Analysis',
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
    run: {
      color: COLORS.PRIMARY,
      italics: true,
      size: 24,  // Reduced from 26
      font: 'Garamond'
    }
  })
);

// Introduction
sections.push(
  new Paragraph({
    text: 'Introduction',
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    border: {
      left: {
        color: COLORS.ACCENT,
        space: 8,
        style: BorderStyle.SINGLE,
        size: 40
      }
    },
    run: {
      color: COLORS.PRIMARY,
      font: 'Calibri',  // Sans-serif for headings
      size: 26  // Reduced from 28
    }
  }),
  new Paragraph({
    text: 'This study examines the Hebrew and Greek vocabulary used in Scripture to describe "waiting on the Lord." Through careful morphological analysis, we discover that biblical "waiting" is not a monolithic concept but encompasses a rich variety of postures, emotions, and expectations.',
    spacing: { after: 200, line: 360 },  // 1.5 line spacing
    run: {
      color: COLORS.TEXT_PRIMARY,
      font: 'Times New Roman',
      size: 22  // Reduced from 24
    }
  }),
  new Paragraph({
    text: 'The Hebrew Old Testament employs multiple words for waiting—from the silent trust of דָּמַם (dāmam) to the writhing intensity of חוּל (ḥûl), from patient tarrying חָכָה (ḥākāh) to active expectation קָוָה (qāwāh). Each captures a different facet of the experience of depending on God through time.',
    spacing: { after: 200, line: 360 },
    run: {
      color: COLORS.TEXT_PRIMARY,
      font: 'Times New Roman',
      size: 22  // Reduced from 24
    }
  }),
  new Paragraph({
    text: 'The Greek New Testament emphasizes eschatological anticipation, with ἀπεκδέχομαι (apekdechomai) dominating the vocabulary—eager, confident awaiting of Christ\'s return. Yet patient endurance (ὑπομονή, hypomonē) and longsuffering forbearance (μακροθυμέω, makrothymeō) also feature prominently.',
    spacing: { after: 200, line: 360 },
    run: {
      color: COLORS.TEXT_PRIMARY,
      font: 'Times New Roman',
      size: 22  // Reduced from 24
    }
  }),
  new Paragraph({
    text: 'Morphology matters. When Hebrew uses participles, it transforms waiting from action to identity—"those who wait" are characterized by this posture. When Greek uses deponent verbs (middle/passive form with active meaning), it emphasizes personal investment in hope. The Hebrew stem system (Qal, Piel, Hiphil) modifies intensity and causation, adding theological nuance.',
    spacing: { after: 200, line: 360 },
    run: {
      color: COLORS.TEXT_PRIMARY,
      font: 'Times New Roman',
      size: 22  // Reduced from 24
    }
  }),
  new Paragraph({
    text: 'This analysis proceeds thematically, examining how morphological details illuminate the theological meaning of waiting in various contexts. Technical terms are explained in callout boxes for immediate reference, with detailed grammatical explanations provided in the reference section.',
    spacing: { after: 400, line: 360 },
    run: {
      color: COLORS.TEXT_PRIMARY,
      font: 'Times New Roman',
      size: 22  // Reduced from 24
    }
  })
);

// Visual Summary: Lexeme Overview
sections.push(
  new Paragraph({
    text: 'Visual Summary: Lexeme-Form-Theme Overview',
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 600, after: 200 },  // Reduced after spacing from 300 to 200
    pageBreakBefore: true,
    border: {
      left: {
        color: COLORS.ACCENT,
        space: 8,
        style: BorderStyle.SINGLE,
        size: 40
      }
    },
    run: {
      color: COLORS.PRIMARY,
      font: 'Calibri',
      size: 26
    },
    keepNext: true  // Keep heading with next paragraph
  }),
  new Paragraph({
    text: 'This diagram maps the relationship between Hebrew/Greek lexemes, their grammatical forms, and their thematic significance throughout Scripture.',
    spacing: { after: 100, line: 360 },  // Reduced after spacing from 200 to 100
    run: {
      color: COLORS.TEXT_SECONDARY,
      italics: true,
      font: 'Times New Roman',
      size: 20
    },
    keepNext: true,  // Keep description with diagram
    keepLines: true  // Don't break this paragraph across pages
  })
);

// Load and prepare the lexeme overview diagram image
const diagramPath = path.join(__dirname, '../../study/output/lexeme-overview.png');
const diagramImage = fs.readFileSync(diagramPath);

// Add the diagram image centered on the page
sections.push(
  new Paragraph({
    children: [
      new ImageRun({
        data: diagramImage,
        transformation: {
          width: 580,  // Reduced from 600 to help fit on same page
          height: 800  // Reduced from 830 to help fit on same page
        }
      })
    ],
    alignment: AlignmentType.CENTER,
    spacing: { after: 400, before: 50 },  // Reduced before spacing from 100 to 50
    keepLines: true  // Keep image from breaking across pages
  })
);

// Process each theme
for (const themeData of structuredData) {
  // Theme heading with colored sidebar
  sections.push(
    new Paragraph({
      text: themeData.theme,
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      border: {
        left: {
          color: COLORS.PRIMARY,
          space: 8,
          style: BorderStyle.SINGLE,
          size: 40
        }
      },
      run: {
        color: COLORS.PRIMARY,
        bold: true,
        font: 'Calibri',  // Sans-serif for headings
        size: 26  // Reduced from 28
      },
      pageBreakBefore: true  // Start each theme on new page
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
            size: 24,  // Reduced from 26
            color: COLORS.ACCENT,
            font: 'Times New Roman'
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
            new TextRun({
              text: 'Definition: ',
              italics: true,
              color: COLORS.GRAY_DARK,
              font: 'Times New Roman',
              size: 22  // Reduced from 24
            }),
            new TextRun({
              text: lexDef.primary_theological_meaning || lexDef.root_meaning,
              color: COLORS.TEXT_PRIMARY,
              font: 'Times New Roman',
              size: 22  // Reduced from 24
            })
          ],
          spacing: { after: 200, line: 360 }
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
              underline: { type: UnderlineType.SINGLE },
              color: COLORS.PRIMARY,
              font: 'Times New Roman',
              size: 22  // Reduced from 24
            })
          ],
          spacing: { before: 200, after: 100 }
        })
      );

      // Parsing
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Parsing: ',
              bold: true,
              color: COLORS.GRAY_DARK,
              font: 'Times New Roman',
              size: 20  // Reduced from 22
            }),
            new TextRun({
              text: occ.parsing || 'Not available',
              color: COLORS.TEXT_PRIMARY,
              font: 'Times New Roman',
              size: 20  // Reduced from 22
            })
          ],
          spacing: { after: 100, line: 360 }
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
              spacing: { after: 100, line: 360 },
              run: {
                color: COLORS.TEXT_SECONDARY,
                size: 18,  // Reduced from 20
                font: 'Times New Roman'
              }
            })
          );
        }
      }

      // Add ALL applicable learners' notes for obscure concepts as callout boxes
      if (occ.parsing) {
        const obscureTerms = ['Sequential Perfect', 'Sequential Imperfect', 'Construct', 'Deponent',
                              'Participle', 'Infinitive', 'Imperative', 'Perfect', 'Imperfect'];
        const notesAdded = [];

        for (const term of obscureTerms) {
          if (occ.parsing.includes(term) && !notesAdded.includes(term)) {
            const concept = getConceptExplanation(term, lexeme.language);
            if (concept) {
              sections.push(createCalloutBox(`${term}`, concept.simple_explanation));
              notesAdded.push(term);
            }
          }
        }

        // Add stem note as footnote if applicable (with deduplication for same-page refs)
        if (morph && morph.stem && !notesAdded.includes('Stem')) {
          const stemInfo = hebrewStems.stems.find(s => s.name === morph.stem);
          if (stemInfo) {
            let footnoteId;

            // Check if this stem was recently footnoted (same page approximation)
            if (recentFootnotes.has(morph.stem)) {
              // Reuse existing footnote - reference it with "ibid."
              const previousFootnoteId = recentFootnotes.get(morph.stem);
              footnoteId = footnoteCounter++;
              footnotes[footnoteId] = {
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: 'Ibid. ',
                        italics: true,
                        size: 16  // Reduced from 18 (7pt)
                      }),
                      new TextRun({
                        text: '(See previous note on this page)',
                        size: 16  // Reduced from 18
                      })
                    ]
                  })
                ]
              };
            } else {
              // Create new footnote for this stem
              footnoteId = footnoteCounter++;
              footnotes[footnoteId] = {
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `${morph.stem} Stem: `,
                        bold: true,
                        size: 16  // Reduced from 18 (8pt)
                      }),
                      new TextRun({
                        text: stemInfo.meaning + '. ',
                        size: 16  // Reduced from 18
                      }),
                      new TextRun({
                        text: stemInfo.description,
                        size: 16  // Reduced from 18
                      })
                    ]
                  })
                ]
              };

              // Track this footnote for deduplication
              recentFootnotes.set(morph.stem, footnoteId);
            }

            // Add inline reference with footnote
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Stem: ${morph.stem}`,
                    italics: true,
                    color: COLORS.GRAY_DARK,
                    font: 'Times New Roman',
                    size: 20  // Reduced from 22
                  }),
                  new FootnoteReferenceRun(footnoteId)
                ],
                spacing: { after: 100 }
              })
            );

            notesAdded.push('Stem');
          }
        }
      }

      // Periodically reset footnote tracking (approximates page breaks)
      if (i > 0 && i % footnoteResetInterval === 0) {
        recentFootnotes.clear();
      }

      // Scripture text as styled block quote
      const scriptureText = occ.scripture_text.split('\n')[0];
      const truncated = scriptureText.length > 200 ? scriptureText.substring(0, 200) + '...' : scriptureText;
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: truncated,
              italics: true,
              color: COLORS.TEXT_SECONDARY,
              size: 20,  // Reduced from 22
              font: 'Times New Roman'
            })
          ],
          indent: {
            left: convertInchesToTwip(0.6),
            right: convertInchesToTwip(0.6)
          },
          shading: {
            fill: COLORS.GRAY_VERY_LIGHT,
            type: 'clear',
            color: 'auto'
          },
          spacing: { after: 200, before: 120, line: 345 },  // Slightly tighter line spacing for quotes
          border: {
            left: {
              color: COLORS.GRAY_LIGHT,
              space: 4,
              style: BorderStyle.SINGLE,
              size: 12
            }
          }
        })
      );
    }
  }
}

// Add Endnotes section (for generic, reusable concepts)
sections.push(
  new Paragraph({
    text: 'Reference: Grammatical Concepts',
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 600, after: 300 },
    pageBreakBefore: true,
    border: {
      left: {
        color: COLORS.ACCENT,
        space: 8,
        style: BorderStyle.SINGLE,
        size: 40
      }
    },
    run: {
      color: COLORS.PRIMARY,
      font: 'Calibri',
      size: 26  // Reduced from 28
    }
  }),
  new Paragraph({
    text: 'This section provides comprehensive explanations of grammatical concepts referenced throughout the analysis. These concepts apply generally across multiple passages.',
    spacing: { after: 400, line: 360 },
    run: {
      color: COLORS.TEXT_SECONDARY,
      italics: true,
      font: 'Times New Roman',
      size: 20  // Reduced from 22
    }
  })
);

// Hebrew Verb Stem System (kept as endnote - generic overview)
sections.push(
  new Paragraph({
    text: 'Hebrew Verb Stem System',
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 200 },
    run: {
      color: COLORS.ACCENT,
      font: 'Calibri',
      size: 22  // Reduced from 24
    }
  }),
  new Paragraph({
    text: hebrewStems.description,
    spacing: { after: 200, line: 360 },
    run: {
      color: COLORS.TEXT_PRIMARY,
      font: 'Times New Roman',
      size: 20  // Reduced from 22
    }
  })
);

for (const stem of hebrewStems.stems) {
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `${stem.name} (${stem.category}): `,
          bold: true,
          color: COLORS.ACCENT,
          font: 'Times New Roman',
          size: 20  // Reduced from 22
        }),
        new TextRun({
          text: stem.meaning,
          color: COLORS.TEXT_PRIMARY,
          font: 'Times New Roman',
          size: 20  // Reduced from 22
        })
      ],
      spacing: { after: 100 }
    }),
    new Paragraph({
      text: stem.description,
      spacing: { after: 100, line: 360 },
      run: {
        color: COLORS.TEXT_PRIMARY,
        font: 'Times New Roman',
        size: 18  // Reduced from 20
      }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Example: ',
          italics: true,
          color: COLORS.GRAY_DARK,
          font: 'Times New Roman',
          size: 18  // Reduced from 20
        }),
        new TextRun({
          text: stem.example.explanation,
          color: COLORS.TEXT_SECONDARY,
          font: 'Times New Roman',
          size: 18  // Reduced from 20
        })
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
    spacing: { before: 400, after: 200 },
    run: {
      color: COLORS.ACCENT,
      font: 'Calibri',
      size: 22  // Reduced from 24
    }
  }),
  new Paragraph({
    text: 'Detailed explanations of Hebrew grammatical concepts that appear in the morphological analysis.',
    spacing: { after: 200, line: 360 },
    run: {
      color: COLORS.TEXT_SECONDARY,
      italics: true,
      font: 'Times New Roman',
      size: 20  // Reduced from 22
    }
  })
);

for (const concept of hebrewConcepts.concepts) {
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: concept.term,
          bold: true,
          size: 22,  // Reduced from 24
          color: COLORS.ACCENT,
          font: 'Times New Roman'
        }),
        new TextRun({
          text: ` (${concept.category})`,
          italics: true,
          color: COLORS.GRAY_MEDIUM,
          font: 'Times New Roman',
          size: 20  // Reduced from 22
        })
      ],
      spacing: { before: 200, after: 100 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Definition: ',
          bold: true,
          color: COLORS.GRAY_DARK,
          font: 'Times New Roman',
          size: 20  // Reduced from 22
        }),
        new TextRun({
          text: concept.simple_explanation,
          color: COLORS.TEXT_PRIMARY,
          font: 'Times New Roman',
          size: 20  // Reduced from 22
        })
      ],
      spacing: { after: 100, line: 360 }
    }),
    new Paragraph({
      text: concept.detailed_explanation,
      spacing: { after: 100, line: 360 },
      run: {
        color: COLORS.TEXT_PRIMARY,
        font: 'Times New Roman',
        size: 20  // Reduced from 22
      }
    })
  );

  if (concept.example) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Example: ',
            italics: true,
            color: COLORS.GRAY_DARK,
            font: 'Times New Roman',
            size: 18  // Reduced from 20
          }),
          new TextRun({
            text: concept.example,
            color: COLORS.TEXT_SECONDARY,
            font: 'Times New Roman',
            size: 18  // Reduced from 20
          })
        ],
        spacing: { after: 100, line: 360 }
      })
    );
  }

  if (concept.why_relevant) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Why This Matters: ',
            bold: true,
            color: COLORS.GRAY_DARK,
            font: 'Times New Roman',
            size: 20  // Reduced from 22
          }),
          new TextRun({
            text: concept.why_relevant,
            color: COLORS.TEXT_PRIMARY,
            font: 'Times New Roman',
            size: 20  // Reduced from 22
          })
        ],
        spacing: { after: 200, line: 360 }
      })
    );
  }
}

// Greek Grammatical Concepts Reference
sections.push(
  new Paragraph({
    text: 'Greek Grammatical Concepts',
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 200 },
    run: {
      color: COLORS.ACCENT,
      font: 'Calibri',
      size: 22  // Reduced from 24
    }
  }),
  new Paragraph({
    text: 'Detailed explanations of Greek grammatical concepts that appear in the morphological analysis.',
    spacing: { after: 200, line: 360 },
    run: {
      color: COLORS.TEXT_SECONDARY,
      italics: true,
      font: 'Times New Roman',
      size: 20  // Reduced from 22
    }
  })
);

for (const concept of greekConcepts.concepts) {
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: concept.term,
          bold: true,
          size: 22,  // Reduced from 24
          color: COLORS.ACCENT,
          font: 'Times New Roman'
        }),
        new TextRun({
          text: ` (${concept.category})`,
          italics: true,
          color: COLORS.GRAY_MEDIUM,
          font: 'Times New Roman',
          size: 20  // Reduced from 22
        })
      ],
      spacing: { before: 200, after: 100 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Definition: ',
          bold: true,
          color: COLORS.GRAY_DARK,
          font: 'Times New Roman',
          size: 20  // Reduced from 22
        }),
        new TextRun({
          text: concept.simple_explanation,
          color: COLORS.TEXT_PRIMARY,
          font: 'Times New Roman',
          size: 20  // Reduced from 22
        })
      ],
      spacing: { after: 100, line: 360 }
    }),
    new Paragraph({
      text: concept.detailed_explanation,
      spacing: { after: 100, line: 360 },
      run: {
        color: COLORS.TEXT_PRIMARY,
        font: 'Times New Roman',
        size: 20  // Reduced from 22
      }
    })
  );

  if (concept.example) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Example: ',
            italics: true,
            color: COLORS.GRAY_DARK,
            font: 'Times New Roman',
            size: 18  // Reduced from 20
          }),
          new TextRun({
            text: concept.example,
            color: COLORS.TEXT_SECONDARY,
            font: 'Times New Roman',
            size: 18  // Reduced from 20
          })
        ],
        spacing: { after: 100, line: 360 }
      })
    );
  }

  if (concept.why_relevant) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Why This Matters: ',
            bold: true,
            color: COLORS.GRAY_DARK,
            font: 'Times New Roman',
            size: 20  // Reduced from 22
          }),
          new TextRun({
            text: concept.why_relevant,
            color: COLORS.TEXT_PRIMARY,
            font: 'Times New Roman',
            size: 20  // Reduced from 22
          })
        ],
        spacing: { after: 200, line: 360 }
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
    spacing: { before: 400, after: 200 },
    run: {
      color: COLORS.ACCENT,
      font: 'Calibri',
      size: 22  // Reduced from 24
    }
  }),
  new Paragraph({
    text: 'Quick reference of all Hebrew and Greek words analyzed in this study.',
    spacing: { after: 300, line: 360 },
    run: {
      color: COLORS.TEXT_SECONDARY,
      italics: true,
      font: 'Times New Roman',
      size: 20  // Reduced from 22
    }
  })
);

// Hebrew Lexemes Summary
sections.push(
  new Paragraph({
    text: 'Hebrew Words',
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    run: {
      color: COLORS.PRIMARY,
      font: 'Calibri',
      size: 20  // Reduced from 22
    }
  })
);

for (const lex of lexemeSummary.filter(l => l.language === 'Hebrew')) {
  const lexDef = getLexemeDefinition(lex.word, lex.strongs, 'Hebrew');
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `${lex.word} (${lex.transliteration}) — ${lex.strongs}`,
          bold: true,
          color: COLORS.ACCENT,
          font: 'Times New Roman',
          size: 20  // Reduced from 22
        })
      ],
      spacing: { before: 150, after: 50 }
    }),
    new Paragraph({
      text: lexDef ? lexDef.primary_theological_meaning : 'Definition not available',
      spacing: { after: 50, line: 360 },
      run: {
        color: COLORS.TEXT_PRIMARY,
        font: 'Times New Roman',
        size: 20  // Reduced from 22
      }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Occurrences: ${lex.occurrence_count} | Themes: `,
          italics: true,
          color: COLORS.GRAY_DARK,
          font: 'Times New Roman',
          size: 18  // Reduced from 20
        }),
        new TextRun({
          text: lex.themes.join(', '),
          italics: true,
          color: COLORS.TEXT_SECONDARY,
          font: 'Times New Roman',
          size: 18  // Reduced from 20
        })
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
    spacing: { before: 200, after: 100 },
    run: {
      color: COLORS.PRIMARY,
      font: 'Calibri',
      size: 20  // Reduced from 22
    }
  })
);

for (const lex of lexemeSummary.filter(l => l.language === 'Greek')) {
  const lexDef = getLexemeDefinition(lex.word, lex.strongs, 'Greek');
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `${lex.word} (${lex.transliteration}) — ${lex.strongs}`,
          bold: true,
          color: COLORS.ACCENT,
          font: 'Times New Roman',
          size: 20  // Reduced from 22
        })
      ],
      spacing: { before: 150, after: 50 }
    }),
    new Paragraph({
      text: lexDef ? lexDef.primary_theological_meaning : 'Definition not available',
      spacing: { after: 50, line: 360 },
      run: {
        color: COLORS.TEXT_PRIMARY,
        font: 'Times New Roman',
        size: 20  // Reduced from 22
      }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Occurrences: ${lex.occurrence_count} | Themes: `,
          italics: true,
          color: COLORS.GRAY_DARK,
          font: 'Times New Roman',
          size: 18  // Reduced from 20
        }),
        new TextRun({
          text: lex.themes.join(', '),
          italics: true,
          color: COLORS.TEXT_SECONDARY,
          font: 'Times New Roman',
          size: 18  // Reduced from 20
        })
      ],
      spacing: { after: 150 }
    })
  );
}

// Create footer with page numbers
const pageNumberFooter = new Footer({
  children: [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          children: [PageNumber.CURRENT],
          size: 18,  // Reduced from 20
          color: COLORS.GRAY_MEDIUM
        })
      ]
    })
  ]
});

// Create the document with footnotes and page numbers
const doc = new Document({
  footnotes: footnotes,
  sections: [{
    properties: {
      page: {
        pageNumbers: {
          start: 1,
          formatType: NumberFormat.DECIMAL
        }
      }
    },
    footers: {
      default: pageNumberFooter
    },
    children: sections
  }]
});

// Write to file
const outputDir = path.join(__dirname, '../../study/output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, 'waiting_on_the_lord_analysis.docx');

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`\n✓ Document generated successfully!`);
  console.log(`  Output: ${outputPath}`);
  console.log(`  Size: ${(buffer.length / 1024).toFixed(1)} KB`);
  console.log(`  Footnotes: ${Object.keys(footnotes).length}`);
  console.log(`\n📘 Aesthetic enhancements applied:`);
  console.log(`  - Mature scholastic color palette`);
  console.log(`  - Styled callout boxes for learners' notes`);
  console.log(`  - Colored sidebar borders for themes`);
  console.log(`  - Footnotes for stem explanations`);
  console.log(`  - Styled scripture block quotes`);
}).catch(err => {
  console.error('Error generating document:', err);
  process.exit(1);
});
