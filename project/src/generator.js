#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, UnderlineType,
  Table, TableRow, TableCell, WidthType, BorderStyle, Shading, VerticalAlign,
  Footer, FootnoteReferenceRun, convertInchesToTwip, PageNumber, NumberFormat,
  Media, ImageRun, PageOrientation, ExternalHyperlink
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

// Spacing configuration for page count compression
// Values in twips (1/20 of a point, 1440 twips = 1 inch)
const SPACING = {
  // Line spacing (multiply by 240 for docx line spacing value)
  LINE_TIGHT: 240,      // 1.0x (single)
  LINE_NORMAL: 260,     // ~1.08x (slightly above single)
  LINE_RELAXED: 300,    // 1.25x

  // Paragraph spacing (before/after in twips)
  PARA_NONE: 0,
  PARA_MINIMAL: 60,     // ~4pt
  PARA_SMALL: 100,      // ~7pt
  PARA_MEDIUM: 140,     // ~10pt
  PARA_LARGE: 200,      // ~14pt

  // Heading spacing
  H1_BEFORE: 300,       // Reduced from 600
  H1_AFTER: 140,        // Reduced from 200
  H2_BEFORE: 200,       // Reduced from 400
  H2_AFTER: 100,        // Reduced from 200
  H3_BEFORE: 140,       // Reduced from 300
  H3_AFTER: 80,         // Reduced from 100-200

  // Table cell margins
  CELL_MARGIN: 80       // Reduced from 100
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

// Helper to convert Bible reference to Blue Letter Bible Interlinear URL
function getBlueletterBibleUrl(reference) {
  // Format: "Book Chapter:Verse" -> https://www.blueletterbible.org/[translation]/[book]/[chapter]/[verse]
  // Example: "Psalm 25:3" -> https://www.blueletterbible.org/esv/psa/25/3/

  // Parse the reference
  const match = reference.match(/^(\d?\s?[A-Za-z]+)\s+(\d+):(\d+)/);
  if (!match) return null;

  const [, book, chapter, verse] = match;

  // Map book names to BLB abbreviations
  const bookMap = {
    'Genesis': 'gen', 'Exodus': 'exo', 'Leviticus': 'lev', 'Numbers': 'num', 'Deuteronomy': 'deu',
    'Joshua': 'jos', 'Judges': 'jdg', 'Ruth': 'rut', '1 Samuel': '1sa', '2 Samuel': '2sa',
    '1 Kings': '1ki', '2 Kings': '2ki', '1 Chronicles': '1ch', '2 Chronicles': '2ch',
    'Ezra': 'ezr', 'Nehemiah': 'neh', 'Esther': 'est', 'Job': 'job', 'Psalm': 'psa', 'Psalms': 'psa',
    'Proverbs': 'pro', 'Ecclesiastes': 'ecc', 'Song of Solomon': 'sng', 'Isaiah': 'isa',
    'Jeremiah': 'jer', 'Lamentations': 'lam', 'Ezekiel': 'eze', 'Daniel': 'dan', 'Hosea': 'hos',
    'Joel': 'joe', 'Amos': 'amo', 'Obadiah': 'oba', 'Jonah': 'jon', 'Micah': 'mic', 'Nahum': 'nah',
    'Habakkuk': 'hab', 'Zephaniah': 'zep', 'Haggai': 'hag', 'Zechariah': 'zec', 'Malachi': 'mal',
    'Matthew': 'mat', 'Mark': 'mar', 'Luke': 'luk', 'John': 'jhn', 'Acts': 'act',
    'Romans': 'rom', '1 Corinthians': '1co', '2 Corinthians': '2co', 'Galatians': 'gal',
    'Ephesians': 'eph', 'Philippians': 'phi', 'Colossians': 'col', '1 Thessalonians': '1th',
    '2 Thessalonians': '2th', '1 Timothy': '1ti', '2 Timothy': '2ti', 'Titus': 'tit',
    'Philemon': 'phm', 'Hebrews': 'heb', 'James': 'jam', '1 Peter': '1pe', '2 Peter': '2pe',
    '1 John': '1jo', '2 John': '2jo', '3 John': '3jo', 'Jude': 'jud', 'Revelation': 'rev'
  };

  const bookAbbr = bookMap[book.trim()];
  if (!bookAbbr) {
    console.warn(`Unknown book: ${book}`);
    return null;
  }

  return `https://www.blueletterbible.org/esv/${bookAbbr}/${chapter}/${verse}/`;
}

// Helper to parse lexeme information from lexeme_parsing field
function parseLexemeInfo(lexemeParsing) {
  const lines = lexemeParsing.split('\n');

  // Handle cases with multiple lexemes (e.g., "יָחַל / חוּל")
  const hebrewGreekLine = lines[0];
  const transliterationLine = lines[1];
  const morphologyLines = lines.slice(3); // Skip the Strong's number line

  // Get the primary word (first one if multiple)
  const word = hebrewGreekLine.split('/')[0].trim();
  const transliteration = transliterationLine.split('/')[0].trim();

  // Parse morphology: "Verb, Qal, Imperative, Masculine Singular"
  const morphologyText = morphologyLines.join(' ');

  // Extract stem (Qal, Piel, Hiphil, etc.) or tense (Present, Aorist, etc.)
  let stem = '';
  const stemPatterns = ['Qal', 'Piel', 'Hiphil', 'Niphal', 'Pual', 'Hithpael', 'Hophal',
                        'Present', 'Aorist', 'Imperfect', 'Perfect', 'Future'];
  for (const pattern of stemPatterns) {
    if (morphologyText.includes(pattern)) {
      stem = pattern;
      break;
    }
  }

  // Extract form (Participle, Imperative, Indicative, etc.)
  let form = '';
  const formPatterns = ['Participle', 'Imperative', 'Indicative', 'Infinitive', 'Subjunctive',
                        'Optative', 'Sequential'];
  for (const pattern of formPatterns) {
    if (morphologyText.includes(pattern)) {
      form = pattern;
      break;
    }
  }

  return { word, transliteration, stem, form };
}

// Helper to decorate wait-words with colored lexeme annotations
function decorateWaitWords(text, lexemeInfo) {
  const { transliteration, stem, form } = lexemeInfo;

  // Common wait-related words to search for (case-insensitive)
  // Include alternative translations: "looked for", "look for", "patience"
  const waitWords = ['wait', 'waited', 'waiting', 'waits', 'waiteth',
                     'hope', 'hoped', 'hoping', 'hopes', 'hopeth',
                     'looked for', 'look for', 'looketh for',
                     'patience', 'patient', 'patiently'];

  const children = [];
  let remainingText = text;
  let foundMatch = false;

  for (const waitWord of waitWords) {
    // Escape special regex characters and handle multi-word phrases
    const escapedWord = waitWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b(${escapedWord})\\b`, 'i');
    const match = remainingText.match(regex);

    if (match) {
      foundMatch = true;
      const beforeMatch = remainingText.substring(0, match.index);
      const matchedWord = match[1];
      const afterMatch = remainingText.substring(match.index + matchedWord.length);

      // Add text before the match
      if (beforeMatch) {
        children.push(new TextRun({
          text: beforeMatch,
          size: 16,
          font: 'Times New Roman',
          color: COLORS.TEXT_PRIMARY
        }));
      }

      // Add the matched wait-word
      children.push(new TextRun({
        text: matchedWord,
        size: 16,
        font: 'Times New Roman',
        color: COLORS.TEXT_PRIMARY
      }));

      // Add the decoration (transliteration, stem, form) with different colors
      children.push(new TextRun({
        text: ' (',
        size: 14,
        font: 'Times New Roman',
        color: COLORS.TEXT_PRIMARY
      }));

      children.push(new TextRun({
        text: transliteration,
        size: 14,
        font: 'Times New Roman',
        color: '8B4513', // Saddle brown for word
        italics: true
      }));

      if (stem) {
        children.push(new TextRun({
          text: ', ',
          size: 14,
          font: 'Times New Roman',
          color: COLORS.TEXT_PRIMARY
        }));

        children.push(new TextRun({
          text: stem,
          size: 14,
          font: 'Times New Roman',
          color: '2E8B57', // Sea green for stem
          italics: true
        }));
      }

      if (form) {
        children.push(new TextRun({
          text: ', ',
          size: 14,
          font: 'Times New Roman',
          color: COLORS.TEXT_PRIMARY
        }));

        children.push(new TextRun({
          text: form,
          size: 14,
          font: 'Times New Roman',
          color: '4169E1', // Royal blue for form
          italics: true
        }));
      }

      children.push(new TextRun({
        text: ')',
        size: 14,
        font: 'Times New Roman',
        color: COLORS.TEXT_PRIMARY
      }));

      // Continue with remaining text
      remainingText = afterMatch;
      break; // Only decorate first occurrence in this text segment
    }
  }

  // Add any remaining text
  if (remainingText && foundMatch) {
    children.push(new TextRun({
      text: remainingText,
      size: 16,
      font: 'Times New Roman',
      color: COLORS.TEXT_PRIMARY
    }));
  }

  // If no match found, return the original text as a single TextRun
  if (!foundMatch) {
    children.push(new TextRun({
      text: text,
      size: 16,
      font: 'Times New Roman',
      color: COLORS.TEXT_PRIMARY
    }));
  }

  return children;
}

// Helper to format scripture text with special styling for Context, Thematic fit, and Application
function formatScriptureText(text, lexemeInfo = null) {
  const paragraphs = text.split('\n\n');
  const formattedParagraphs = [];

  for (const para of paragraphs) {
    const children = [];

    // Check if paragraph starts with a label
    if (para.startsWith('Context:')) {
      children.push(
        new TextRun({
          text: 'Context:',
          bold: true,
          color: COLORS.ACCENT,
          size: 16,
          font: 'Calibri'
        }),
        new TextRun({
          text: para.substring(8), // Rest of text after "Context:"
          size: 16,
          font: 'Times New Roman',
          color: COLORS.TEXT_PRIMARY
        })
      );
    } else if (para.startsWith('Thematic fit:')) {
      children.push(
        new TextRun({
          text: 'Thematic fit:',
          bold: true,
          color: COLORS.SUPPORTING,
          size: 16,
          font: 'Calibri'
        }),
        new TextRun({
          text: para.substring(13), // Rest of text after "Thematic fit:"
          size: 16,
          font: 'Times New Roman',
          color: COLORS.TEXT_PRIMARY
        })
      );
    } else if (para.startsWith('Application:')) {
      children.push(
        new TextRun({
          text: 'Application:',
          bold: true,
          color: COLORS.PRIMARY,
          size: 16,
          font: 'Calibri'
        }),
        new TextRun({
          text: para.substring(12), // Rest of text after "Application:"
          size: 16,
          font: 'Times New Roman',
          color: COLORS.TEXT_PRIMARY
        })
      );
    } else {
      // Regular text (scripture quote) - decorate wait-words if lexeme info provided
      if (lexemeInfo) {
        children.push(...decorateWaitWords(para, lexemeInfo));
      } else {
        children.push(
          new TextRun({
            text: para,
            size: 16,
            font: 'Times New Roman',
            color: COLORS.TEXT_PRIMARY
          })
        );
      }
    }

    formattedParagraphs.push(
      new Paragraph({
        children: children,
        spacing: { line: SPACING.LINE_NORMAL, after: SPACING.PARA_SMALL }
      })
    );
  }

  return formattedParagraphs;
}

// Helper to create callout box for learner's notes (professional textbook sidebar style)
// Compressed and narrowed to save vertical space - floated right with text wrapping
function createCalloutBox(title, content) {
  return new Table({
    width: { size: 3.5, type: WidthType.INCHES },  // Fixed width for better control
    float: {
      horizontalAnchor: 'text',
      verticalAnchor: 'text',
      relativeHorizontalPosition: 'right',
      relativeVerticalPosition: 'top',
      leftFromText: convertInchesToTwip(0.15),  // Space between text and box
      rightFromText: 0,
      topFromText: 0,
      bottomFromText: convertInchesToTwip(0.1)
    },
    margins: {
      top: SPACING.PARA_MINIMAL,
      bottom: SPACING.PARA_MINIMAL,
      left: convertInchesToTwip(0.2),
      right: convertInchesToTwip(0.2)
    },
    borders: {
      // Professional frame: subtle top/bottom, prominent left accent
      left: { style: BorderStyle.SINGLE, size: 20, color: COLORS.SUPPORTING },  // Reduced from 24
      top: { style: BorderStyle.SINGLE, size: 4, color: COLORS.GRAY_MEDIUM },  // Reduced from 6
      bottom: { style: BorderStyle.SINGLE, size: 4, color: COLORS.GRAY_MEDIUM },  // Reduced from 6
      right: { style: BorderStyle.SINGLE, size: 4, color: COLORS.GRAY_MEDIUM },  // Reduced from 6
      insideHorizontal: { style: BorderStyle.NONE, size: 0 },
      insideVertical: { style: BorderStyle.NONE, size: 0 }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: {
              fill: 'FAFBFC',  // Extremely subtle gray
              type: 'clear',
              color: 'auto'
            },
            margins: {
              top: SPACING.PARA_MINIMAL,  // Reduced from 140
              bottom: SPACING.PARA_MINIMAL,  // Reduced from 140
              left: SPACING.PARA_SMALL,  // Reduced from 200
              right: SPACING.PARA_SMALL  // Reduced from 200
            },
            verticalAlign: VerticalAlign.TOP,
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${title}`,
                    bold: true,
                    color: COLORS.SUPPORTING,
                    size: 18,  // Reduced from 20
                    font: 'Calibri'
                  })
                ],
                spacing: { after: SPACING.PARA_MINIMAL },  // Reduced from H1_AFTER
                border: {
                  bottom: {
                    color: COLORS.GRAY_LIGHT,
                    space: 1,
                    style: BorderStyle.SINGLE,
                    size: 4  // Reduced from 6
                  }
                }
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: content,
                    color: COLORS.TEXT_PRIMARY,
                    size: 16,  // Reduced from 18
                    font: 'Calibri'
                  })
                ],
                spacing: { line: SPACING.LINE_TIGHT }  // Tighter line spacing
              })
            ]
          })
        ]
      })
    ],
    spacing: {
      before: SPACING.PARA_SMALL,  // Reduced from PARA_LARGE
      after: SPACING.PARA_SMALL  // Reduced from PARA_LARGE
    }
  });
}

// Create statistical summary table for pattern analysis
function createStatisticalSummaryTable() {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    margins: {
      top: SPACING.CELL_MARGIN,
      bottom: SPACING.CELL_MARGIN,
      left: SPACING.CELL_MARGIN,
      right: SPACING.CELL_MARGIN
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 8, color: COLORS.PRIMARY },
      bottom: { style: BorderStyle.SINGLE, size: 8, color: COLORS.PRIMARY },
      left: { style: BorderStyle.SINGLE, size: 6, color: COLORS.GRAY_MEDIUM },
      right: { style: BorderStyle.SINGLE, size: 6, color: COLORS.GRAY_MEDIUM },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 3, color: COLORS.GRAY_LIGHT },
      insideVertical: { style: BorderStyle.SINGLE, size: 3, color: COLORS.GRAY_LIGHT }
    },
    rows: [
      // Header row
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            width: { size: 18, type: WidthType.PERCENTAGE },
            shading: { fill: COLORS.PRIMARY, type: 'clear' },
            margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({ children: [new TextRun({ text: 'Lexeme', bold: true, color: 'FFFFFF', size: 18, font: 'Calibri' })], alignment: AlignmentType.CENTER })]
          }),
          new TableCell({
            width: { size: 10, type: WidthType.PERCENTAGE },
            shading: { fill: COLORS.PRIMARY, type: 'clear' },
            margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({ children: [new TextRun({ text: 'Total', bold: true, color: 'FFFFFF', size: 18, font: 'Calibri' })], alignment: AlignmentType.CENTER })]
          }),
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: COLORS.PRIMARY, type: 'clear' },
            margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({ children: [new TextRun({ text: 'Form with Strongest Pattern', bold: true, color: 'FFFFFF', size: 18, font: 'Calibri' })], alignment: AlignmentType.CENTER })]
          }),
          new TableCell({
            width: { size: 27, type: WidthType.PERCENTAGE },
            shading: { fill: COLORS.PRIMARY, type: 'clear' },
            margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({ children: [new TextRun({ text: 'Theme Correlation', bold: true, color: 'FFFFFF', size: 18, font: 'Calibri' })], alignment: AlignmentType.CENTER })]
          }),
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            shading: { fill: COLORS.PRIMARY, type: 'clear' },
            margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({ children: [new TextRun({ text: 'Strength', bold: true, color: 'FFFFFF', size: 18, font: 'Calibri' })], alignment: AlignmentType.CENTER })]
          })
        ]
      }),
      // prosdechomai - STRONG pattern
      new TableRow({
        children: [
          new TableCell({ margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN }, children: [new Paragraph({ children: [new TextRun({ text: 'προσδέχομαι', size: 18, font: 'Times New Roman' }), new TextRun({ text: ' (prosdechomai)', size: 16, font: 'Times New Roman', italics: true })], spacing: { line: SPACING.LINE_TIGHT } })] }),
          new TableCell({ margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: '4', size: 18, font: 'Times New Roman' })], alignment: AlignmentType.CENTER })] }),
          new TableCell({ margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN }, children: [new Paragraph({ children: [new TextRun({ text: 'Present Participle (4)', size: 18, font: 'Times New Roman' })], spacing: { line: SPACING.LINE_TIGHT } })] }),
          new TableCell({ margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN }, children: [new Paragraph({ children: [new TextRun({ text: 'Messianic Expectation (75%)', size: 18, font: 'Times New Roman' })], spacing: { line: SPACING.LINE_TIGHT } })] }),
          new TableCell({ margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN }, shading: { fill: '90EE90', type: 'clear' }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: 'Strong ✓', size: 18, font: 'Times New Roman', bold: true, color: '228B22' })], alignment: AlignmentType.CENTER })] })
        ]
      }),
      // apekdechomai - MILD pattern
      new TableRow({
        children: [
          new TableCell({ margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN }, children: [new Paragraph({ children: [new TextRun({ text: 'ἀπεκδέχομαι', size: 18, font: 'Times New Roman' }), new TextRun({ text: ' (apekdechomai)', size: 16, font: 'Times New Roman', italics: true })], spacing: { line: SPACING.LINE_TIGHT } })] }),
          new TableCell({ margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: '6', size: 18, font: 'Times New Roman' })], alignment: AlignmentType.CENTER })] }),
          new TableCell({ margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN }, children: [new Paragraph({ children: [new TextRun({ text: 'Present Indicative (4)', size: 18, font: 'Times New Roman' })], spacing: { line: SPACING.LINE_TIGHT } })] }),
          new TableCell({ margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN }, children: [new Paragraph({ children: [new TextRun({ text: 'Eschatological Hope (50%)', size: 18, font: 'Times New Roman' })], spacing: { line: SPACING.LINE_TIGHT } })] }),
          new TableCell({ margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN }, shading: { fill: 'FFF8DC', type: 'clear' }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: 'Mild', size: 18, font: 'Times New Roman', color: 'DAA520' })], alignment: AlignmentType.CENTER })] })
        ]
      }),
      // qāwāh - WEAK pattern
      new TableRow({
        children: [
          new TableCell({ margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN }, children: [new Paragraph({ children: [new TextRun({ text: 'קָוָה', size: 18, font: 'Times New Roman' }), new TextRun({ text: ' (qāwāh)', size: 16, font: 'Times New Roman', italics: true })], spacing: { line: SPACING.LINE_TIGHT } })] }),
          new TableCell({ margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: '16', size: 18, font: 'Times New Roman' })], alignment: AlignmentType.CENTER })] }),
          new TableCell({ margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN }, children: [new Paragraph({ children: [new TextRun({ text: 'Piel Perfect (6)', size: 18, font: 'Times New Roman' })], spacing: { line: SPACING.LINE_TIGHT } })] }),
          new TableCell({ margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN }, children: [new Paragraph({ children: [new TextRun({ text: 'Scattered across 6 themes', size: 18, font: 'Times New Roman' })], spacing: { line: SPACING.LINE_TIGHT } })] }),
          new TableCell({ margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN }, shading: { fill: 'FFE4E4', type: 'clear' }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: 'Weak ✗', size: 18, font: 'Times New Roman', color: 'CC0000' })], alignment: AlignmentType.CENTER })] })
        ]
      }),
      // ḥākāh - WEAK pattern
      new TableRow({
        children: [
          new TableCell({ margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN }, children: [new Paragraph({ children: [new TextRun({ text: 'חָכָה', size: 18, font: 'Times New Roman' }), new TextRun({ text: ' (ḥākāh)', size: 16, font: 'Times New Roman', italics: true })], spacing: { line: SPACING.LINE_TIGHT } })] }),
          new TableCell({ margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: '5', size: 18, font: 'Times New Roman' })], alignment: AlignmentType.CENTER })] }),
          new TableCell({ margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN }, children: [new Paragraph({ children: [new TextRun({ text: 'Piel Participle (2)', size: 18, font: 'Times New Roman' })], spacing: { line: SPACING.LINE_TIGHT } })] }),
          new TableCell({ margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN }, children: [new Paragraph({ children: [new TextRun({ text: 'No pattern (2 themes)', size: 18, font: 'Times New Roman' })], spacing: { line: SPACING.LINE_TIGHT } })] }),
          new TableCell({ margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN }, shading: { fill: 'FFE4E4', type: 'clear' }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: 'Weak ✗', size: 18, font: 'Times New Roman', color: 'CC0000' })], alignment: AlignmentType.CENTER })] })
        ]
      }),
      // yāḥal - Cannot assess
      new TableRow({
        children: [
          new TableCell({ margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN }, children: [new Paragraph({ children: [new TextRun({ text: 'יָחַל', size: 18, font: 'Times New Roman' }), new TextRun({ text: ' (yāḥal)', size: 16, font: 'Times New Roman', italics: true })], spacing: { line: SPACING.LINE_TIGHT } })] }),
          new TableCell({ margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: '4', size: 18, font: 'Times New Roman' })], alignment: AlignmentType.CENTER })] }),
          new TableCell({ margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN }, children: [new Paragraph({ children: [new TextRun({ text: 'All singles (1 each)', size: 18, font: 'Times New Roman' })], spacing: { line: SPACING.LINE_TIGHT } })] }),
          new TableCell({ margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN }, children: [new Paragraph({ children: [new TextRun({ text: 'Cannot assess', size: 18, font: 'Times New Roman', italics: true })], spacing: { line: SPACING.LINE_TIGHT } })] }),
          new TableCell({ margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN }, shading: { fill: 'F5F5F5', type: 'clear' }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: 'N/A', size: 18, font: 'Times New Roman', color: '999999' })], alignment: AlignmentType.CENTER })] })
        ]
      })
    ],
    spacing: {
      before: SPACING.PARA_MEDIUM,
      after: SPACING.PARA_LARGE
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
    spacing: { after: SPACING.PARA_LARGE },
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
    spacing: { after: SPACING.PARA_LARGE },
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
    spacing: { before: SPACING.H2_BEFORE, after: SPACING.H1_AFTER },
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
    spacing: { after: SPACING.PARA_LARGE, line: SPACING.LINE_RELAXED },  // 1.5 line spacing
    run: {
      color: COLORS.TEXT_PRIMARY,
      font: 'Times New Roman',
      size: 22  // Reduced from 24
    }
  }),
  new Paragraph({
    text: 'The Hebrew Old Testament employs multiple words for waiting—from the silent trust of דָּמַם (dāmam) to the writhing intensity of חוּל (ḥûl), from patient tarrying חָכָה (ḥākāh) to active expectation קָוָה (qāwāh). Each captures a different facet of the experience of depending on God through time.',
    spacing: { after: SPACING.PARA_LARGE, line: SPACING.LINE_RELAXED },
    run: {
      color: COLORS.TEXT_PRIMARY,
      font: 'Times New Roman',
      size: 22  // Reduced from 24
    }
  }),
  new Paragraph({
    text: 'The Greek New Testament emphasizes eschatological anticipation, with ἀπεκδέχομαι (apekdechomai) dominating the vocabulary—eager, confident awaiting of Christ\'s return. Yet patient endurance (ὑπομονή, hypomonē) and longsuffering forbearance (μακροθυμέω, makrothymeō) also feature prominently.',
    spacing: { after: SPACING.PARA_LARGE, line: SPACING.LINE_RELAXED },
    run: {
      color: COLORS.TEXT_PRIMARY,
      font: 'Times New Roman',
      size: 22  // Reduced from 24
    }
  }),
  new Paragraph({
    text: 'Morphology matters. When Hebrew uses participles, it transforms waiting from action to identity—"those who wait" are characterized by this posture. When Greek uses deponent verbs (middle/passive form with active meaning), it emphasizes personal investment in hope. The Hebrew stem system (Qal, Piel, Hiphil) modifies intensity and causation, adding theological nuance.',
    spacing: { after: SPACING.PARA_LARGE, line: SPACING.LINE_RELAXED },
    run: {
      color: COLORS.TEXT_PRIMARY,
      font: 'Times New Roman',
      size: 22  // Reduced from 24
    }
  }),
  new Paragraph({
    text: 'This analysis proceeds thematically, examining how morphological details illuminate the theological meaning of waiting in various contexts. Technical terms are explained in callout boxes for immediate reference, with detailed grammatical explanations provided in the reference section.',
    spacing: { after: SPACING.PARA_LARGE, line: SPACING.LINE_RELAXED },
    run: {
      color: COLORS.TEXT_PRIMARY,
      font: 'Times New Roman',
      size: 22  // Reduced from 24
    }
  })
);

// Visual Summary: Pattern Analysis
sections.push(
  new Paragraph({
    text: 'Visual Summary: Grammar→Theme Pattern Analysis',
    heading: HeadingLevel.HEADING_1,
    spacing: { before: SPACING.H1_BEFORE, after: SPACING.H1_AFTER },
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
    keepNext: true
  }),
  new Paragraph({
    text: 'Statistical analysis reveals that only ONE strong grammatical pattern exists: prosdechomai Present Participle → Messianic Expectation (75%). Most lexemes show distributed patterns where context determines theme more than morphology.',
    spacing: { after: SPACING.PARA_MEDIUM, line: SPACING.LINE_RELAXED },
    run: {
      color: COLORS.TEXT_SECONDARY,
      italics: true,
      font: 'Times New Roman',
      size: 20
    },
    keepNext: true
  })
);

// Statistical Summary Table
sections.push(createStatisticalSummaryTable());

// Strong Pattern Diagram
sections.push(
  new Paragraph({
    text: 'Strong Pattern: prosdechomai (75% Correlation)',
    heading: HeadingLevel.HEADING_2,
    spacing: { before: SPACING.H2_BEFORE, after: SPACING.H2_AFTER },
    run: {
      color: COLORS.SUPPORTING,
      font: 'Calibri',
      size: 22
    },
    keepNext: true
  })
);

const strongPatternImage = fs.readFileSync(path.join(__dirname, '../../study/output/pattern-strong-prosdechomai.png'));
sections.push(
  new Paragraph({
    children: [
      new ImageRun({
        data: strongPatternImage,
        transformation: {
          width: 480,
          height: 380
        }
      })
    ],
    alignment: AlignmentType.CENTER,
    spacing: { after: SPACING.PARA_MEDIUM, before: SPACING.PARA_MINIMAL },
    keepLines: true
  })
);

// Weak Pattern Diagram
sections.push(
  new Paragraph({
    text: 'Distributed Pattern: qāwāh (No Dominant Theme)',
    heading: HeadingLevel.HEADING_2,
    spacing: { before: SPACING.H2_BEFORE, after: SPACING.H2_AFTER },
    run: {
      color: COLORS.SUPPORTING,
      font: 'Calibri',
      size: 22
    },
    keepNext: true
  })
);

const weakPatternImage = fs.readFileSync(path.join(__dirname, '../../study/output/pattern-weak-qawah.png'));
sections.push(
  new Paragraph({
    children: [
      new ImageRun({
        data: weakPatternImage,
        transformation: {
          width: 480,
          height: 430
        }
      })
    ],
    alignment: AlignmentType.CENTER,
    spacing: { after: SPACING.PARA_LARGE, before: SPACING.PARA_MINIMAL },
    keepLines: true
  })
);

// Helper function to get theme diagram filename
function getThemeDiagramFilename(themeName) {
  const themeMap = {
    'STRENGTH & RENEWAL': 'theme-strength-renewal.png',
    'TRUST & HOPE': 'theme-trust-hope.png',
    'HELP & DELIVERANCE': 'theme-help-deliverance.png',
    'PATIENCE & ENDURANCE': 'theme-patience-endurance.png',
    'BLESSING & INHERITANCE': 'theme-blessing-inheritance.png',
    'ESCHATOLOGICAL HOPE': 'theme-eschatological-hope.png',
    'MESSIANIC EXPECTATION': 'theme-messianic-expectation.png',
    'GOODNESS OF GOD': 'theme-goodness-of-god.png',
    'FAITHFULNESS & DEVOTION': 'theme-faithfulness-devotion.png',
    'PRAISE & WORSHIP': 'theme-praise-worship.png',
    'TEACHING & GUIDANCE': 'theme-teaching-guidance.png',
    'JUDGMENT & JUSTICE': 'theme-judgment-justice.png'
  };
  return themeMap[themeName.toUpperCase()];
}

// Process each theme
for (const themeData of structuredData) {
  // Theme heading with colored sidebar
  sections.push(
    new Paragraph({
      text: themeData.theme,
      heading: HeadingLevel.HEADING_1,
      spacing: { before: SPACING.H2_BEFORE, after: SPACING.H1_AFTER },
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
      }
    })
  );

  // Add theme-specific grammar→theme diagram
  const themeDiagramFile = getThemeDiagramFilename(themeData.theme);
  if (themeDiagramFile) {
    const themeDiagramPath = path.join(__dirname, '../../study/output', themeDiagramFile);
    try {
      const themeDiagramImage = fs.readFileSync(themeDiagramPath);
      sections.push(
        new Paragraph({
          children: [
            new ImageRun({
              data: themeDiagramImage,
              transformation: {
                width: 400,
                height: 350
              }
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: SPACING.PARA_MEDIUM, before: SPACING.PARA_SMALL },
          keepLines: true
        })
      );
    } catch (err) {
      // Diagram file doesn't exist, skip silently
    }
  }

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
        spacing: { before: SPACING.H3_BEFORE, after: SPACING.H2_AFTER }
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
          spacing: { after: SPACING.PARA_LARGE, line: SPACING.LINE_RELAXED }
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
          spacing: { before: SPACING.H3_BEFORE, after: SPACING.H2_AFTER }
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
          spacing: { after: SPACING.H2_AFTER, line: SPACING.LINE_RELAXED }
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
              spacing: { after: SPACING.H2_AFTER, line: SPACING.LINE_RELAXED },
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
                spacing: { after: SPACING.H2_AFTER }
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
          spacing: { after: SPACING.PARA_LARGE, before: SPACING.PARA_SMALL, line: SPACING.LINE_RELAXED },  // Slightly tighter line spacing for quotes
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
    spacing: { before: SPACING.H1_BEFORE, after: SPACING.H1_AFTER },
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
    spacing: { after: SPACING.PARA_LARGE, line: SPACING.LINE_RELAXED },
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
    spacing: { before: SPACING.H3_BEFORE, after: SPACING.H1_AFTER },
    run: {
      color: COLORS.ACCENT,
      font: 'Calibri',
      size: 22  // Reduced from 24
    }
  }),
  new Paragraph({
    text: hebrewStems.description,
    spacing: { after: SPACING.PARA_LARGE, line: SPACING.LINE_RELAXED },
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
      spacing: { after: SPACING.H2_AFTER }
    }),
    new Paragraph({
      text: stem.description,
      spacing: { after: SPACING.H2_AFTER, line: SPACING.LINE_RELAXED },
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
      spacing: { after: SPACING.PARA_LARGE }
    })
  );
}

// Hebrew Grammatical Concepts Reference
sections.push(
  new Paragraph({
    text: 'Hebrew Grammatical Concepts',
    heading: HeadingLevel.HEADING_2,
    spacing: { before: SPACING.H2_BEFORE, after: SPACING.H1_AFTER },
    run: {
      color: COLORS.ACCENT,
      font: 'Calibri',
      size: 22  // Reduced from 24
    }
  }),
  new Paragraph({
    text: 'Detailed explanations of Hebrew grammatical concepts that appear in the morphological analysis.',
    spacing: { after: SPACING.PARA_LARGE, line: SPACING.LINE_RELAXED },
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
      spacing: { before: SPACING.H3_BEFORE, after: SPACING.H2_AFTER }
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
      spacing: { after: SPACING.H2_AFTER, line: SPACING.LINE_RELAXED }
    }),
    new Paragraph({
      text: concept.detailed_explanation,
      spacing: { after: SPACING.H2_AFTER, line: SPACING.LINE_RELAXED },
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
        spacing: { after: SPACING.H2_AFTER, line: SPACING.LINE_RELAXED }
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
        spacing: { after: SPACING.PARA_LARGE, line: SPACING.LINE_RELAXED }
      })
    );
  }
}

// Greek Grammatical Concepts Reference
sections.push(
  new Paragraph({
    text: 'Greek Grammatical Concepts',
    heading: HeadingLevel.HEADING_2,
    spacing: { before: SPACING.H2_BEFORE, after: SPACING.H1_AFTER },
    run: {
      color: COLORS.ACCENT,
      font: 'Calibri',
      size: 22  // Reduced from 24
    }
  }),
  new Paragraph({
    text: 'Detailed explanations of Greek grammatical concepts that appear in the morphological analysis.',
    spacing: { after: SPACING.PARA_LARGE, line: SPACING.LINE_RELAXED },
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
      spacing: { before: SPACING.H3_BEFORE, after: SPACING.H2_AFTER }
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
      spacing: { after: SPACING.H2_AFTER, line: SPACING.LINE_RELAXED }
    }),
    new Paragraph({
      text: concept.detailed_explanation,
      spacing: { after: SPACING.H2_AFTER, line: SPACING.LINE_RELAXED },
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
        spacing: { after: SPACING.H2_AFTER, line: SPACING.LINE_RELAXED }
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
        spacing: { after: SPACING.PARA_LARGE, line: SPACING.LINE_RELAXED }
      })
    );
  }
}

// Appendix: Source Table (separate section for landscape orientation)
const sourceData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../study/source/source_data.json'), 'utf8'));
const appendixSections = [];

appendixSections.push(
  new Paragraph({
    text: 'Appendix: Source Reference Table',
    heading: HeadingLevel.HEADING_1,
    spacing: { before: SPACING.H1_BEFORE, after: SPACING.H1_AFTER },
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
    }
  }),
  new Paragraph({
    text: 'This appendix reproduces the original source table from which this analysis was generated, preserving all 41 Scripture references with their thematic organization, lexical parsing details, and contextual notes.',
    spacing: { after: SPACING.PARA_LARGE, line: SPACING.LINE_RELAXED },
    run: {
      color: COLORS.TEXT_SECONDARY,
      italics: true,
      font: 'Times New Roman',
      size: 20
    }
  })
);

// Create source table
const sourceTable = new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    // Header row
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          width: { size: 10, type: WidthType.PERCENTAGE },
          shading: { fill: COLORS.PRIMARY },
          children: [new Paragraph({
            children: [new TextRun({
              text: 'Theme',
              bold: true,
              color: 'FFFFFF',
              size: 20,
              font: 'Calibri'
            })],
            alignment: AlignmentType.CENTER
          })]
        }),
        new TableCell({
          width: { size: 12, type: WidthType.PERCENTAGE },
          shading: { fill: COLORS.PRIMARY },
          children: [new Paragraph({
            children: [new TextRun({
              text: 'Reference',
              bold: true,
              color: 'FFFFFF',
              size: 20,
              font: 'Calibri'
            })],
            alignment: AlignmentType.CENTER
          })]
        }),
        new TableCell({
          width: { size: 18, type: WidthType.PERCENTAGE },
          shading: { fill: COLORS.PRIMARY },
          children: [new Paragraph({
            children: [new TextRun({
              text: 'Lexeme & Parsing',
              bold: true,
              color: 'FFFFFF',
              size: 20,
              font: 'Calibri'
            })],
            alignment: AlignmentType.CENTER
          })]
        }),
        new TableCell({
          width: { size: 60, type: WidthType.PERCENTAGE },
          shading: { fill: COLORS.PRIMARY },
          children: [new Paragraph({
            children: [new TextRun({
              text: 'Scripture Text & Context',
              bold: true,
              color: 'FFFFFF',
              size: 20,
              font: 'Calibri'
            })],
            alignment: AlignmentType.CENTER
          })]
        })
      ]
    }),
    // Data rows
    ...sourceData.map((entry, index) => new TableRow({
      children: [
        new TableCell({
          shading: { fill: index % 2 === 0 ? COLORS.GRAY_VERY_LIGHT : 'FFFFFF' },
          margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN },
          children: [new Paragraph({
            children: [new TextRun({
              text: entry.theme,
              size: 18,
              font: 'Calibri',
              color: COLORS.ACCENT,
              bold: true
            })],
            spacing: { line: SPACING.LINE_NORMAL }
          })]
        }),
        new TableCell({
          shading: { fill: index % 2 === 0 ? COLORS.GRAY_VERY_LIGHT : 'FFFFFF' },
          margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN },
          children: [new Paragraph({
            children: [
              new ExternalHyperlink({
                children: [
                  new TextRun({
                    text: entry.reference,
                    size: 18,
                    font: 'Times New Roman',
                    color: COLORS.PRIMARY,
                    bold: true,
                    underline: { type: UnderlineType.SINGLE }
                  })
                ],
                link: getBlueletterBibleUrl(entry.reference) || '#'
              })
            ],
            spacing: { line: SPACING.LINE_NORMAL }
          })]
        }),
        new TableCell({
          shading: { fill: index % 2 === 0 ? COLORS.GRAY_VERY_LIGHT : 'FFFFFF' },
          margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN },
          children: entry.lexeme_parsing.split('\n').map(line => new Paragraph({
            children: [new TextRun({
              text: line,
              size: 16,
              font: 'Times New Roman',
              color: COLORS.TEXT_PRIMARY
            })],
            spacing: { line: SPACING.LINE_NORMAL }
          }))
        }),
        new TableCell({
          shading: { fill: index % 2 === 0 ? COLORS.GRAY_VERY_LIGHT : 'FFFFFF' },
          margins: { top: SPACING.CELL_MARGIN, bottom: SPACING.CELL_MARGIN, left: SPACING.CELL_MARGIN, right: SPACING.CELL_MARGIN },
          children: formatScriptureText(entry.scripture_text, parseLexemeInfo(entry.lexeme_parsing))
        })
      ]
    }))
  ]
});

appendixSections.push(sourceTable);

// Lexeme Summary Section
const lexemeSummary = JSON.parse(fs.readFileSync(path.join(dataDir, 'lexeme_summary.json'), 'utf8'));

sections.push(
  new Paragraph({
    text: 'Lexeme Summary',
    heading: HeadingLevel.HEADING_2,
    spacing: { before: SPACING.H2_BEFORE, after: SPACING.H1_AFTER },
    run: {
      color: COLORS.ACCENT,
      font: 'Calibri',
      size: 22  // Reduced from 24
    }
  }),
  new Paragraph({
    text: 'Quick reference of all Hebrew and Greek words analyzed in this study.',
    spacing: { after: SPACING.H1_AFTER, line: SPACING.LINE_RELAXED },
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
    spacing: { before: SPACING.H3_BEFORE, after: SPACING.H2_AFTER },
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
      spacing: { before: SPACING.PARA_MEDIUM, after: SPACING.PARA_MINIMAL }
    }),
    new Paragraph({
      text: lexDef ? lexDef.primary_theological_meaning : 'Definition not available',
      spacing: { after: SPACING.PARA_MINIMAL, line: SPACING.LINE_RELAXED },
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
      spacing: { after: SPACING.PARA_MEDIUM }
    })
  );
}

// Greek Lexemes Summary
sections.push(
  new Paragraph({
    text: 'Greek Words',
    heading: HeadingLevel.HEADING_3,
    spacing: { before: SPACING.H3_BEFORE, after: SPACING.H2_AFTER },
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
      spacing: { before: SPACING.PARA_MEDIUM, after: SPACING.PARA_MINIMAL }
    }),
    new Paragraph({
      text: lexDef ? lexDef.primary_theological_meaning : 'Definition not available',
      spacing: { after: SPACING.PARA_MINIMAL, line: SPACING.LINE_RELAXED },
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
      spacing: { after: SPACING.PARA_MEDIUM }
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
// Split into two sections: main content (portrait) and appendix (landscape)
const doc = new Document({
  footnotes: footnotes,
  sections: [
    {
      properties: {
        page: {
          pageNumbers: {
            start: 1,
            formatType: NumberFormat.DECIMAL
          },
          size: {
            orientation: PageOrientation.PORTRAIT
          }
        }
      },
      footers: {
        default: pageNumberFooter
      },
      children: sections
    },
    {
      properties: {
        page: {
          size: {
            orientation: PageOrientation.LANDSCAPE
          }
        }
      },
      footers: {
        default: pageNumberFooter
      },
      children: appendixSections
    }
  ]
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
